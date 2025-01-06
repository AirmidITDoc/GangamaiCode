import { Component, Inject, OnInit } from '@angular/core';
import { UomMasterService } from '../uom-master.service';
import { UntypedFormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-umo',
  templateUrl: './new-umo.component.html',
  styleUrls: ['./new-umo.component.scss']
})
export class NewUMOComponent implements OnInit {

  unitForm: UntypedFormGroup;
  isActive:boolean=true;

  constructor(
    public _UomMasterService: UomMasterService,
    public dialogRef: MatDialogRef<NewUMOComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.unitForm = this._UomMasterService.createUnitofmeasurementForm();
    if(this.data){
        this.isActive=this.data.isActive
        this.unitForm.patchValue(this.data);
    }
  }

  Saveflag: boolean= false;
  onSubmit() {
    if(!this.unitForm.invalid)
    {
    this.Saveflag=true
   
    if (this.unitForm.valid) {
        this._UomMasterService.unitMasterSave(this.unitForm.value).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
        }, (error) => {
            this.toastr.error(error.message);
        });
    }
    }
    else
    {
        this.toastr.warning('please check from is invalid', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return; 
    }
  }

  onClear(val: boolean) {
      this.unitForm.reset();
      this.dialogRef.close(val);
  }

  getValidationMessages() {
    return {
        unitofMeasurementName: [
            { name: "required", Message: "Currency Name is required" },
            { name: "maxlength", Message: "Currency name should not be greater than 50 char." },
            { name: "pattern", Message: "Special char not allowed." }
        ]
    };
}
}