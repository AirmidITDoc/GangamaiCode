import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ServiceMasterService } from '../service-master.service';

@Component({
  selector: 'app-tariff',
  templateUrl: './tariff.component.html',
  styleUrls: ['./tariff.component.scss']
})
export class TariffComponent implements OnInit {

    serviceForm: FormGroup;;
    // isActive:boolean=true;

    autocompleteModeName1:string = "Tariff";
    autocompleteModeName2: string = "Tariff";

    constructor(
        public _ServiceMasterService: ServiceMasterService,
        public dialogRef: MatDialogRef<TariffComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.serviceForm=this._ServiceMasterService.createTariffmasterForm();
        this.serviceForm.markAllAsTouched();
        if((this.data?.tariffId??0) > 0){
            // this.isActive=this.data.isActive
            this.serviceForm.patchValue(this.data);
        }
    }

   onSubmit() {
  if (this.serviceForm.valid) {
    console.log('Insert tariff:', this.serviceForm.value);

    this._ServiceMasterService.SaveTariff(this.serviceForm.value).subscribe({
      next: (response) => {
        this.toastr.success(response.message);
        this.onClear(true);
      },
      error: (error) => {
        this.toastr.error(error.message || 'Failed to save tariff.', 'Error');
      }
    });

  } else {
    const invalidFields: string[] = [];

    Object.keys(this.serviceForm.controls).forEach((controlName) => {
      if (this.serviceForm.controls[controlName].invalid) {
        invalidFields.push(controlName);
      }
    });

    if (invalidFields.length > 0) {
      invalidFields.forEach(field => {
        this.toastr.warning(`Field "${field}" is invalid.`, 'Warning');
      });
    }
  }
}


    onClear(val: boolean) {
        this.serviceForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages(){
        return{
            tariffId: [
                { name: "required", Message: "Tariff Name is required" },
                { name: "maxlength", Message: "Tariff Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        }
    }
}