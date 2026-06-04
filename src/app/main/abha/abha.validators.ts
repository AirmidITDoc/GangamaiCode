import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class AbhaValidators {
  /** 12-digit Aadhaar number — numeric, exactly 12 digits, first digit cannot be 0 or 1 (UIDAI rule). */
  static aadhaar(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    if (!/^\d{12}$/.test(value)) {
      return { aadhaar: 'Aadhaar must be exactly 12 digits' };
    }
    if (/^[01]/.test(value)) {
      return { aadhaar: 'Aadhaar cannot start with 0 or 1' };
    }
    return null;
  }

  /** 10-digit Indian mobile number — starts with 6, 7, 8, or 9. */
  static mobile(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    if (!/^[6-9]\d{9}$/.test(value)) {
      return { mobile: 'Enter a valid 10-digit Indian mobile number' };
    }
    return null;
  }

  /** 6-digit OTP. */
  static otp(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    if (!/^\d{6}$/.test(value)) {
      return { otp: 'OTP must be exactly 6 digits' };
    }
    return null;
  }

  /**
   * ABHA Address rules:
   * - 8 to 18 characters
   * - Letters + numbers (alphanumeric)
   * - At most 1 dot (.) and at most 1 underscore (_)
   * - Dot/underscore must NOT be at start or end (must be between alphanumeric)
   */
  static abhaAddress(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;
    if (!value) return null;
    const errors: ValidationErrors = {};

    if (value.length < 8 || value.length > 18) {
      errors['length'] = '8–18 characters required';
    }
    if (!/^[a-zA-Z0-9._]+$/.test(value)) {
      errors['chars'] = 'Only letters, numbers, dot and underscore allowed';
    }
    const dotCount = (value.match(/\./g) || []).length;
    const underCount = (value.match(/_/g) || []).length;
    if (dotCount > 1) errors['dots'] = 'At most 1 dot (.) allowed';
    if (underCount > 1) errors['underscores'] = 'At most 1 underscore (_) allowed';
    if (/^[._]/.test(value) || /[._]$/.test(value)) {
      errors['edges'] = 'Dot/underscore cannot be at start or end';
    }
    if (!/[a-zA-Z]/.test(value)) {
      errors['letters'] = 'Must contain at least one letter';
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  /** Validator factory: requires ALL items in a FormArray of booleans to be true. */
  static allConsentsAccepted(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const values: boolean[] = control.value || [];
      const allAccepted = values.length > 0 && values.every((v) => v === true);
      return allAccepted ? null : { consentsIncomplete: true };
    };
  }

  /** Name validator — only letters and spaces, 2–60 chars. */
  static beneficiaryName(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;
    if (!value) return null;
    if (value.trim().length < 2) {
      return { name: 'Name must be at least 2 characters' };
    }
    if (value.trim().length > 60) {
      return { name: 'Name must be at most 60 characters' };
    }
    if (!/^[a-zA-Z\s.'-]+$/.test(value)) {
      return { name: 'Only letters, spaces, dots, apostrophes and hyphens allowed' };
    }
    return null;
  }

  /**
   * ABHA Number — 14 digits.
   * Accepts:
   *  - "91XXXXXXXXXXXX" (raw 14 digits)
   *  - "91-XXXX-XXXX-XXXX" (hyphenated)
   * Validates: exactly 14 digits after hyphens stripped, starts with "91".
   */
  static abhaNumber(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;
    if (!value) return null;
    const digits = value.replace(/[-\s]/g, '');
    if (!/^\d{14}$/.test(digits)) {
      return { abhaNumber: 'ABHA number must be 14 digits' };
    }
    if (!digits.startsWith('91')) {
      return { abhaNumber: 'ABHA number must start with 91' };
    }
    return null;
  }

  /** Strip ABHA number to raw 14 digits */
  static normalizeAbhaNumber(value: string): string {
    return (value || '').replace(/[-\s]/g, '');
  }

  /** Format raw 14-digit ABHA number as 91-XXXX-XXXX-XXXX */
  static formatAbhaNumber(raw: string): string {
    const d = AbhaValidators.normalizeAbhaNumber(raw);
    if (d.length !== 14) return raw;
    return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6, 10)}-${d.slice(10, 14)}`;
  }
}
