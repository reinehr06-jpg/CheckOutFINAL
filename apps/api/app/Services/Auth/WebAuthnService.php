<?php

declare(strict_types=1);

namespace App\Services\Auth;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class WebAuthnService
{
    private string $rpId;
    private string $rpName;

    public function __construct()
    {
        $this->rpId = parse_url(config('app.url', 'http://localhost'), PHP_URL_HOST) ?: 'localhost';
        $this->rpName = config('app.name', 'Basileia Pay');
    }

    public function generateChallenge(): string
    {
        return Str::random(32);
    }

    public function buildCreationOptions(string $challenge, string $userId): array
    {
        return [
            'publicKey' => [
                'rp' => [
                    'id' => $this->rpId,
                    'name' => $this->rpName,
                ],
                'user' => [
                    'id' => hash('sha256', $userId, true),
                    'name' => config('master.master_email'),
                    'displayName' => 'Master Administrator',
                ],
                'challenge' => $this->base64urlEncode($challenge),
                'pubKeyCredParams' => [
                    ['type' => 'public-key', 'alg' => -7],
                    ['type' => 'public-key', 'alg' => -257],
                ],
                'timeout' => 60000,
                'attestation' => 'none',
                'authenticatorSelection' => [
                    'authenticatorAttachment' => 'cross-platform',
                    'userVerification' => 'discouraged',
                    'residentKey' => 'discouraged',
                ],
            ],
        ];
    }

    public function buildRequestOptions(string $challenge, string $credentialId): array
    {
        return [
            'publicKey' => [
                'challenge' => $this->base64urlEncode($challenge),
                'timeout' => 60000,
                'rpId' => $this->rpId,
                'allowCredentials' => [
                    [
                        'type' => 'public-key',
                        'id' => $credentialId,
                    ],
                ],
                'userVerification' => 'discouraged',
            ],
        ];
    }

    public function verifyRegistration(string $challenge, array $credential): array
    {
        $clientDataJSON = base64_decode($credential['clientDataJSON']);
        $clientData = json_decode($clientDataJSON, true);

        if (!$clientData || !isset($clientData['challenge'])) {
            throw new \RuntimeException('Invalid clientDataJSON');
        }

        $expectedChallenge = $this->base64urlEncode($challenge);
        if (!hash_equals($expectedChallenge, $clientData['challenge'])) {
            throw new \RuntimeException('Challenge mismatch');
        }

        if (!isset($clientData['origin']) || !$this->isValidOrigin($clientData['origin'])) {
            throw new \RuntimeException('Invalid origin');
        }

        if (($clientData['type'] ?? '') !== 'webauthn.create') {
            throw new \RuntimeException('Invalid clientData type');
        }

        $attestationObject = base64_decode($credential['attestationObject']);
        $cbor = CBORDecoder::decode($attestationObject);

        if (!$cbor || !isset($cbor['authData'])) {
            return $this->fallbackAttestationParse($attestationObject);
        }

        $authData = $cbor['authData'];
        $credentialIdLength = unpack('n', substr($authData, 53, 2))[1];
        $credentialId = $this->base64urlEncode(substr($authData, 55, $credentialIdLength));
        $publicKeyCbor = substr($authData, 55 + $credentialIdLength + 2);
        $publicKey = $this->parseCosePublicKey($publicKeyCbor);

        return [
            'credential_id' => $credentialId,
            'public_key' => $publicKey,
        ];
    }

    public function verifyAuthentication(string $challenge, array $assertion, array $storedCredential): bool
    {
        $clientDataJSON = base64_decode($assertion['clientDataJSON']);
        $clientData = json_decode($clientDataJSON, true);

        if (!$clientData || !isset($clientData['challenge'])) {
            Log::warning('WebAuthn: invalid clientDataJSON');
            return false;
        }

        $expectedChallenge = $this->base64urlEncode($challenge);
        if (!hash_equals($expectedChallenge, $clientData['challenge'])) {
            Log::warning('WebAuthn: challenge mismatch');
            return false;
        }

        if (!isset($clientData['origin']) || !$this->isValidOrigin($clientData['origin'])) {
            Log::warning('WebAuthn: invalid origin: ' . ($clientData['origin'] ?? 'null'));
            return false;
        }

        if (($clientData['type'] ?? '') !== 'webauthn.get') {
            Log::warning('WebAuthn: invalid clientData type: ' . ($clientData['type'] ?? 'null'));
            return false;
        }

        $authenticatorData = base64_decode($assertion['authenticatorData']);
        $signature = base64_decode($assertion['signature']);

        $clientDataHash = hash('sha256', $clientDataJSON, true);
        $signedData = $authenticatorData . $clientDataHash;

        $publicKeyDer = $this->coseToDer($storedCredential['public_key']);

        if (empty($publicKeyDer)) {
            Log::warning('WebAuthn: cannot convert COSE key to DER');
            return false;
        }

        $signatureDer = $this->rsToDer($signature);

        $result = openssl_verify($signedData, $signatureDer, $publicKeyDer, OPENSSL_ALGO_SHA256);

        if (!$result) {
            Log::warning('WebAuthn: signature verification failed: ' . openssl_error_string());
        }

        return (bool) $result;
    }

    private function parseCosePublicKey(string $cborData): array
    {
        $decoded = CBORDecoder::decode($cborData);
        if (!$decoded || !is_array($decoded)) {
            return ['raw' => bin2hex($cborData)];
        }

        return [
            'kty' => $decoded[1] ?? null,
            'alg' => $decoded[3] ?? null,
            'crv' => $decoded[-1] ?? null,
            'x' => isset($decoded[-2]) ? bin2hex($decoded[-2]) : null,
            'y' => isset($decoded[-3]) ? bin2hex($decoded[-3]) : null,
            'n' => isset($decoded[-1]) && !isset($decoded[-2]) ? bin2hex($decoded[-1]) : null,
            'e' => isset($decoded[-2]) && !isset($decoded[-3]) ? $decoded[-2] : null,
        ];
    }

    private function coseToDer(array $publicKey): string
    {
        if (empty($publicKey['x']) || empty($publicKey['y'])) {
            return '';
        }

        $x = hex2bin($publicKey['x']);
        $y = hex2bin($publicKey['y']);

        $der = "\x04" . $x . $y;

        $pem = "-----BEGIN PUBLIC KEY-----\n"
            . chunk_split(base64_encode(
                "\x30\x59\x30\x13\x06\x07\x2a\x86\x48\xce\x3d\x02\x01\x06\x08\x2a\x86\x48\xce\x3d\x03\x01\x07\x03\x42\x00" . $der
            ))
            . "-----END PUBLIC KEY-----";

        $key = openssl_pkey_get_public($pem);
        if (!$key) {
            Log::warning('WebAuthn: failed to load public key: ' . openssl_error_string());
            return '';
        }

        $details = openssl_pkey_get_details($key);
        return $details['key'] ?? '';
    }

    private function rsToDer(string $signature): string
    {
        if (strlen($signature) === 64) {
            $r = substr($signature, 0, 32);
            $s = substr($signature, 32, 32);

            $r = ltrim($r, "\x00");
            if (ord($r[0]) & 0x80) {
                $r = "\x00" . $r;
            }

            $s = ltrim($s, "\x00");
            if (ord($s[0]) & 0x80) {
                $s = "\x00" . $s;
            }

            return "\x30" . chr(2 + strlen($r) + 2 + strlen($s))
                . "\x02" . chr(strlen($r)) . $r
                . "\x02" . chr(strlen($s)) . $s;
        }

        return $signature;
    }

    private function fallbackAttestationParse(string $attestationObject): array
    {
        $credentialId = Str::random(32);
        return [
            'credential_id' => $credentialId,
            'public_key' => ['raw' => 'fallback-' . bin2hex($attestationObject)],
            'warning' => 'Used fallback parsing — attestation may need manual review',
        ];
    }

    private function isValidOrigin(string $origin): bool
    {
        $allowedOrigins = [
            config('app.url'),
            'http://localhost:3000',
            'http://localhost:3001',
            'https://' . $this->rpId,
            'http://' . $this->rpId,
        ];

        foreach ($allowedOrigins as $allowed) {
            if ($allowed && $origin === $allowed) {
                return true;
            }
        }

        return in_array($origin, array_filter($allowedOrigins), true);
    }

    private function base64urlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}
