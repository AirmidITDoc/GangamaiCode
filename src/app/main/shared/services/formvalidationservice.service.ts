import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormvalidationserviceService {

  constructor() { }

  notEmptyOrZeroValidator(): any {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value > 0 ? null : { greaterThanZero: { value: value } };
    };
  }

  notUndefinedValidator(): any {
return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value == undefined ? null : { undefinedValue: { value: value } };
    };

  }

//   onlyNumberValidator(): any {
// debugger
//     return (control: AbstractControl): ValidationErrors | null => {
//       const value = control.value;
//       return typeof value === 'number' && !isNaN(value) ? null : { onlyNumber: true };
//     };

//   }

 
    onlyNumberValidator(): any{
   return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
      if (value === null || value === '') return null;
    return /^[0-9]+$/.test(value) ? null : { invalidNumber: true };
    };
  }


  nonNegativeValidator(): any {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return typeof value === 'number' && value >= 0 ? null : { nonNegativeNumber: true };
    };
  }
  notBlankValidator(): any {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim();
      return value ? null : { notBlank: true };
    };
  }

  allowEmptyStringValidator(): any {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value !== null && value !== undefined ? null : { requiredValue: true };
    };
  }

 validDateValidator():any {
 return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
    return !isNaN(Date.parse(value)) ? null : { invalidDate: true };
    };
}
  dropdownvalidation(): any {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === undefined || value === null) {
        return { invalidDropdownValue: true };
      }

      if (typeof value === 'string' && value.trim() === '') {
        return { invalidDropdownValue: true };
      }

      if (value === 0) {
        return { invalidDropdownValue: true };
      }

      return null;
    }
  }

  inputFieldValidator(): any {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      // if (value === undefined || value === null) {
      //   return { invalidtextboxValue: true };
      // }

      // if (typeof value === 'string' && value.trim() === '') {
      //   return { invalidtextboxValue: true };
      // }

      // if (value === 0) {
      //   return { invalidtextboxValue: true };
      // }

      // return null;
      // debugger
      if (
        value === null ||
        value === undefined ||
        value === '' ||
        value.toString().trim() === '%' ||
        value.toString().trim() === '0'
      ) {
        return { invalidInput: true };
      } else
        return null;
    }
  }
}
