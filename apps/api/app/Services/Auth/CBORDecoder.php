<?php

declare(strict_types=1);

namespace App\Services\Auth;

class CBORDecoder
{
    public static function decode(string $data): mixed
    {
        if ($data === '') {
            return null;
        }
        [$value, $_] = self::decodeItem($data, 0);
        return $value;
    }

    private static function decodeItem(string $data, int $offset): array
    {
        if ($offset >= strlen($data)) {
            return [null, $offset];
        }

        $first = ord($data[$offset]);
        $majorType = ($first >> 5) & 0x07;
        $additional = $first & 0x1f;
        $offset++;

        [$argument, $offset] = self::decodeArgument($data, $offset, $additional);

        return match ($majorType) {
            0 => [$argument, $offset],
            1 => [-$argument - 1, $offset],
            2 => self::decodeByteString($data, $offset, $argument),
            3 => self::decodeTextString($data, $offset, $argument),
            4 => self::decodeArray($data, $offset, $argument),
            5 => self::decodeMap($data, $offset, $argument),
            7 => self::decodeSpecial($argument),
            default => [null, $offset],
        };
    }

    private static function decodeArgument(string $data, int $offset, int $additional): array
    {
        return match (true) {
            $additional <= 23 => [$additional, $offset],
            $additional === 24 => [ord($data[$offset]), $offset + 1],
            $additional === 25 => [unpack('n', substr($data, $offset, 2))[1], $offset + 2],
            $additional === 26 => [unpack('N', substr($data, $offset, 4))[1], $offset + 4],
            $additional === 27 => [unpack('J', substr($data, $offset, 8))[1], $offset + 8],
            default => [null, $offset],
        };
    }

    private static function decodeByteString(string $data, int $offset, int $length): array
    {
        $value = substr($data, $offset, $length);
        return [$value, $offset + $length];
    }

    private static function decodeTextString(string $data, int $offset, int $length): array
    {
        $value = substr($data, $offset, $length);
        return [$value, $offset + $length];
    }

    private static function decodeArray(string $data, int $offset, int $count): array
    {
        $items = [];
        for ($i = 0; $i < $count; $i++) {
            [$item, $offset] = self::decodeItem($data, $offset);
            $items[] = $item;
        }
        return [$items, $offset];
    }

    private static function decodeMap(string $data, int $offset, int $count): array
    {
        $map = [];
        for ($i = 0; $i < $count; $i++) {
            [$key, $offset] = self::decodeItem($data, $offset);
            [$value, $offset] = self::decodeItem($data, $offset);
            if (is_int($key) || is_string($key)) {
                $map[$key] = $value;
            }
        }
        return [$map, $offset];
    }

    private static function decodeSpecial(int $additional): array
    {
        return match ($additional) {
            20 => [false, 0],
            21 => [true, 0],
            22 => [null, 0],
            23 => ['undefined', 0],
            default => [null, 0],
        };
    }
}
