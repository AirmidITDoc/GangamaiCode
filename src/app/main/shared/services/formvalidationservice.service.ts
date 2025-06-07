import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
// import { parse, isValid } from 'date-fns';

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

    // Date validation
   validDateValidator():any {
   return (control: AbstractControl): ValidationErrors | null => {
      //   const value = control.value;
      // return !isNaN(Date.parse(value)) ? null : { invalidDate: true };
      // }; 
   const value = control.value;
         const DatePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        if(!DatePattern.test(value) && !isNaN(Date.parse(value))){
          return null
        }else{
          return { invalidDate: true }
        } 
      }; 
  }

  // validateCustomDateFormat(control: AbstractControl): ValidationErrors | null {
  //   const parsed = parse(control.value, 'dd-MM-yyyy', new Date());
  //   return isValid(parsed) ? null : { invalidDateFormat: true };
  // }

  // Only number is allowed
  onlyNumberValidator(): any {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === '') return null;
      return /^[0-9]+$/.test(value) ? null : { invalidNumber: true };
    };
  }

  // only string is allowed
  allowEmptyStringValidator(): any {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value !== null && value !== undefined ? null : { requiredValue: true };
    };
  }

  // created by raksha date:7/6/25
  allowEmptyStringValidatorOnly(): any {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === undefined) {
      control.setValue('', { emitEvent: false }); // converts undefined to ''
    }

    const value = control.value;
    // Allow any string (including empty string), disallow null or non-string
    return typeof value === 'string' ? null : { requiredValue: true };
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


  // Addedby Ambadas => 
  // Many field in form then save only few field then call this function
  //Add this code in html
    // // Fields to not allowed
    // const NotallowedFields = ['FinalDiscPer', 'CashPay', 'referanceNo', 'PaidbyPatient', 'PaidbacktoPatient', 'roundoffAmt','dsalesId','isClosed'];
    // // Get all form values
    // const allValues = this.ItemSubform.value;
    // // Filter out only the fields you want to save
    // const ItemfilteredValues = this.fromEntries(
    //   Object.entries(allValues).filter(([key]) => !NotallowedFields.includes(key))
    // );

fromEntries(entries: [string, any][]): { [key: string]: any } {
  const result: { [key: string]: any } = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}

}
function isValid(parsed: any) {
  throw new Error('Function not implemented.');
}

