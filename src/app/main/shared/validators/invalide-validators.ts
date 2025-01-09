import { AbstractControl, ValidatorFn } from '@angular/forms';

export function InvalidDataValidator(isError: boolean): ValidatorFn {
  // 
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (!control.value || isError) {
      return { invalidRange: true };
    }
    return null;
  };
}
