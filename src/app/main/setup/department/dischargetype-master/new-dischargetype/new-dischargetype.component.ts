import { Component, Inject, OnInit } from '@angular/core';
import { DischargetypeMasterService } from '../dischargetype-master.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-dischargetype',
  templateUrl: './new-dischargetype.component.html',
  styleUrls: ['./new-dischargetype.component.scss']
})
export class NewDischargetypeComponent implements OnInit {

  dischargetypeForm: FormGroup;
  isActive:boolean=true;
  saveflag : boolean = false;

  constructor(
      public _DischargetypeMasterService: DischargetypeMasterService,
      public dialogRef: MatDialogRef<NewDischargetypeComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


    ngOnInit(): void {
        this.dischargetypeForm = this._DischargetypeMasterService.createDischargetypeForm();
        if(this.data){
        this.isActive=this.data.isActive
        this.dischargetypeForm.patchValue(this.data);}
    }

        
    onSubmit() {
        if(!this.dischargetypeForm.invalid)
        {
            this.saveflag = true;
            
            console.log("dischragetype JSON :",this.dischargetypeForm.value);

            this._DischargetypeMasterService.dischargeTypeMasterSave(this.dischargetypeForm.value).subscribe((response) => {
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
            dischargeTypeName: [
                { name: "required", Message: "DischargeType Name is required" },
                { name: "maxlength", Message: "DischargeType name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    onClear(val: boolean) {
        this.dischargetypeForm.reset();
        this.dialogRef.close(val);
    }
}
