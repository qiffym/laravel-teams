<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class NotSelfEmail implements ValidationRule
{
    public function __construct(private readonly ?string $currentUserEmail)
    {
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($this->currentUserEmail && $value === $this->currentUserEmail) {
            $fail('You cannot invite yourself to the team.');
        }
    }
}
