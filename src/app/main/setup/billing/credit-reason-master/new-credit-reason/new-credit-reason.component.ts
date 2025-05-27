import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { CreditreasonService } from '../creditreason.service';

@Component({
    selector: 'app-new-credit-reason',
    templateUrl: './new-credit-reason.component.html',
    styleUrls: ['./new-credit-reason.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewCreditReasonComponent implements OnInit {

  creditreasonForm: FormGroup;
  isActive:boolean=true;

  constructor(
      public _CreditreasonService: CreditreasonService,
      public dialogRef: MatDialogRef<NewCreditReasonComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.creditreasonForm = this._CreditreasonService.createCreditreasonForm();
      if((this.data?.creditId??0) > 0){
        this.isActive=this.data.isActive
        this.creditreasonForm.patchValue(this.data);
    }
  }
  onSubmit() {
    if(!this.creditreasonForm.invalid)
            {

            console.log("JSON: ", this.creditreasonForm.value);

        this._CreditreasonService.creditreasonMasterSave(this.creditreasonForm.value).subscribe((response) => {
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

    onClear(val: boolean) {
        this.creditreasonForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
        creditReason: [
                { name: "required", Message: "Credit Reason is required" },
                { name: "maxlength", Message: "Credit Reason should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }
}
