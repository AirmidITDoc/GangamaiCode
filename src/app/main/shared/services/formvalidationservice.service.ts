import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormvalidationserviceService {

  constructor() { }

  // allow when the number is required
  notEmptyOrZeroValidator(): any {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value > 0 ? null : { greaterThanZero: { value: value } };
    };
  }

    // Date validation
   validDateValidator():any {
   return (control: AbstractControl): ValidationErrors | null => {
   const value = control.value;
       //  const DatePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        if(!isNaN(Date.parse(value))){
          return null
        }else{
          return { invalidDate: true }
        } 
      }; 
  }

  // Only number is allowed
  onlyNumberValidator(): any {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
     if (value === null || value === '') return null;
      return /^[0-9]+$/.test(value) ? null : { invalidNumber: true };
    };
  }
// decimal number is allowed
  AllowDecimalNumberValidator(): any {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === '') return null;

    // Allow positive decimal numbers (e.g., 123, 123.45)
    const isValid = /^[0-9]+(\.[0-9]+)?$/.test(value);
    return isValid ? null : { invalidNumber: true };
  };
}
  // only string is allowed when it is required
  allowEmptyStringValidator(): any {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value !== null && value !== undefined ? null : { requiredValue: true };
    };
  }

  // created by raksha date:7/6/25
  // only string is allowed when it is not required
  allowEmptyStringValidatorOnly(): any {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value
    if (value === undefined || value===null) {
      control.setValue('', { emitEvent: false }); // converts undefined to ''
    }
    // Allow any string (including empty string), disallow null or non-string
    return typeof value === 'string' ? null : { requiredValue: true };
  };
}

// dropdown validator
  // dropdownvalidation(): any {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const value = control.value;
  //     if (value === undefined || value === null) {
  //       return { invalidDropdownValue: true };
  //     }

  //     if (typeof value === 'string' && value.trim() === '') {
  //       return { invalidDropdownValue: true };
  //     }

  //     if (value === 0) {
  //       return { invalidDropdownValue: true };
  //     }

  //     return null;
  //   }
  // }

  
  // allow for all manditory parameter when there is requied
  // notBlankValidator(): any {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const value = control.value?.trim();
  //     return value ? null : { notBlank: true };
  //   };
  // }
}

