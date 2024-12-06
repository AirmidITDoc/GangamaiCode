import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConcessionReasonMasterService } from '../concession-reason-master.service';


@Component({
  selector: 'app-new-concessionreason',
  templateUrl: './new-concessionreason.component.html',
  styleUrls: ['./new-concessionreason.component.scss']
})
export class NewConcessionreasonComponent implements OnInit {

  concessionForm: FormGroup;
  constructor(
      public _ConcessionReasonMasterService: ConcessionReasonMasterService,
      public dialogRef: MatDialogRef<NewConcessionreasonComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.concessionForm = this._ConcessionReasonMasterService.createConcessionreasonForm();
      var m_data = {
        concessionId: this.data?.concessionId,
        concessionReason: this.data?.concessionReason.trim(),
        isActive: JSON.stringify(this.data?.isActive),
      };
      this.concessionForm.patchValue(m_data);
  }
  onSubmit() {
    if (this.concessionForm.invalid) {
        this.toastr.warning('Please check from is invalid', 'Warning !', {
          toastClass:'tostr-tost custom-toast-warning',
      })
      return;
      }else{
        if (this.concessionForm.valid) {
            this._ConcessionReasonMasterService.concessionreasonMasterSave(this.concessionForm.value).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
      }
  }

  onClear(val: boolean) {
      this.concessionForm.reset();
      this.dialogRef.close(val);
  }
}
