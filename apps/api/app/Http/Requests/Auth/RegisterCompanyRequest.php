<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $country = $this->input('country', 'BR');

        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'company_name' => 'required|string|max:255',
            'country' => 'sometimes|string|size:2',
        ];

        if ($country === 'BR') {
            $rules['document'] = 'required|string|max:20';
            $rules['document_type'] = 'required|string|in:cpf,cnpj';
            $rules['phone'] = 'required|string|max:20';
        } else {
            $rules['document'] = 'sometimes|string|max:50';
            $rules['document_type'] = 'sometimes|string|in:ein,ssn,null';
            $rules['phone'] = 'sometimes|string|max:20';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome completo é obrigatório.',
            'email.required' => 'O e-mail corporativo é obrigatório.',
            'email.unique' => 'Este e-mail já está cadastrado.',
            'password.required' => 'A senha é obrigatória.',
            'password.min' => 'A senha deve ter no mínimo 8 caracteres.',
            'password.confirmed' => 'A confirmação de senha não coincide.',
            'company_name.required' => 'O nome da empresa é obrigatório.',
            'document.required' => 'O documento (CNPJ/CPF) é obrigatório para contas no Brasil.',
            'document_type.required' => 'O tipo de documento é obrigatório para contas no Brasil.',
            'document_type.in' => 'O tipo de documento deve ser CPF ou CNPJ para contas no Brasil.',
            'phone.required' => 'O telefone é obrigatório para contas no Brasil.',
            'country.size' => 'O país deve ser informado com 2 caracteres (ex: BR, US).',
        ];
    }
}
