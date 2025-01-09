import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConcessionReasonMasterService } from '../concession-reason-master.service';
import { fuseAnimations } from '@fuse/animations';


@Component({
  selector: 'app-new-concessionreason',
  templateUrl: './new-concessionreason.component.html',
  styleUrls: ['./new-concessionreason.component.scss'],
  encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class NewConcessionreasonComponent implements OnInit {

  concessionForm: FormGroup;
  isActive:boolean=true;
  saveflag : boolean = false;

  constructor(
      public _ConcessionReasonMasterService: ConcessionReasonMasterService,
      public dialogRef: MatDialogRef<NewConcessionreasonComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.concessionForm = this._ConcessionReasonMasterService.createConcessionreasonForm();
      if(this.data){
        this.isActive=this.data.isActive
        this.concessionForm.patchValue(this.data);
    }
  }

  onSubmit() {
        
        if(!this.concessionForm.invalid) 
            {
                this.saveflag = true;

                console.log("JSON :- ",this.concessionForm.value);

            this._ConcessionReasonMasterService.concessionreasonMasterSave(this.concessionForm.value).subscribe((response) => {
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
      this.concessionForm.reset();
      this.dialogRef.close(val);
  }

  getValidationMessages() {
    return {
        concessionReason: [
            { name: "required", Message: "Concession Name is required" },
            { name: "maxlength", Message: "Concession name should not be greater than 50 char." },
            { name: "pattern", Message: "Special char not allowed." }
        ]
    };
}
}
