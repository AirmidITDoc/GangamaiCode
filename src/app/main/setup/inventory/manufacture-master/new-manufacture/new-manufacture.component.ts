import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ManufactureMasterService } from '../manufacture-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-manufacture',
  templateUrl: './new-manufacture.component.html',
  styleUrls: ['./new-manufacture.component.scss']
})
export class NewManufactureComponent implements OnInit {

  manufForm: FormGroup;
  isActive:boolean=true;

    constructor(
      public _ManufactureMasterService: ManufactureMasterService,
      public dialogRef: MatDialogRef<NewManufactureComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
    ) { }

    ngOnInit(): void {
      this.manufForm = this._ManufactureMasterService.createManufactureForm();
      if((this.data?.itemManufactureId??0) > 0)
        {
        this.isActive=this.data.isActive
        this.manufForm.patchValue(this.data);
      }
    }

  
    onSubmit() {
      if (!this.manufForm.invalid) 
        {
        this._ManufactureMasterService.manufactureMasterSave(this.manufForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
      else
      {
        this.toastr.warning('please check from is invalid', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    onClear(val: boolean) 
    {
        this.manufForm.reset();
        this.dialogRef.close(val);
    }
     
    getValidationMessages() {
        return {
            manufName: [
                { name: "required", Message: "Manufacture Name is required" },
                { name: "maxlength", Message: "Manufacture Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            manufShortName:[
                { name: "required", Message: "Manufacture Short Name is required" },
                { name: "maxlength", Message: "Manufacture Short Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

}
