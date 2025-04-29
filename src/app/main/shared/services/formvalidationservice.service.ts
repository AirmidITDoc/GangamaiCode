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
    // if (control.value === undefined) {
    //   return { 'undefinedValue': true };
    // }
    // return null;


    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value == undefined ? null : { undefinedValue: { value: value } };
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
      debugger
      if (
        value === null ||
        value === undefined ||
        value === '' ||
        value.toString().trim() === '%' ||
        value.toString().trim() === '0'
      ) {
        return { invalidInput: true };
      }else
      return null;
    }
  }
}
