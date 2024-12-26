import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MaritalstatusMasterService } from '../maritalstatus-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-maritalstatus',
  templateUrl: './new-maritalstatus.component.html',
  styleUrls: ['./new-maritalstatus.component.scss']
})
export class NewMaritalstatusComponent implements OnInit {
  maritalForm: FormGroup;
  isActive:boolean=true;
  saveflag : boolean = false;
  
  constructor( public _MaritalstatusMasterService: MaritalstatusMasterService,
    public dialogRef: MatDialogRef<NewMaritalstatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    this.maritalForm = this._MaritalstatusMasterService.createMaritalForm();
   if(this.data)
    this.isActive=this.data.isActive;
    this.maritalForm.patchValue(this.data);
  }

  
  onSubmit() {
    if(!this.maritalForm.invalid)
        {
        this.saveflag = true;
        this._MaritalstatusMasterService.MaritalStatusMasterSave(this.maritalForm.value).subscribe((response) => {
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
 
    getValidationMessages() {
      return {
          maritalStatusName: [
              { name: "required", Message: "MaritalStatusName  is required" },
              { name: "pattern", Message: "Special char not allowed." }
          ]
      };
  }

onClear(val: boolean) {
    this.maritalForm.reset();
    this.dialogRef.close(val);
}
}