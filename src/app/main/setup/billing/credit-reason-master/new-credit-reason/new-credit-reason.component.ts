import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CreditreasonService } from '../creditreason.service';

@Component({
  selector: 'app-new-credit-reason',
  templateUrl: './new-credit-reason.component.html',
  styleUrls: ['./new-credit-reason.component.scss']
})
export class NewCreditReasonComponent implements OnInit {

  creditreasonForm: FormGroup;
  constructor(
      public _CreditreasonService: CreditreasonService,
      public dialogRef: MatDialogRef<NewCreditReasonComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.creditreasonForm = this._CreditreasonService.createCreditreasonForm();
      var m_data = {
        creditId: this.data?.creditId,
        creditReason: this.data?.creditReason.trim(),
          isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.creditreasonForm.patchValue(m_data);
  }
  onSubmit() {
      if (this.creditreasonForm.valid) {
          this._CreditreasonService.creditreasonMasterSave(this.creditreasonForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }

  onClear(val: boolean) {
      this.creditreasonForm.reset();
      this.dialogRef.close(val);
  }
}
