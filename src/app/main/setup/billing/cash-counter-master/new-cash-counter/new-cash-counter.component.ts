import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CashCounterMasterService } from '../cash-counter-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-cash-counter',
  templateUrl: './new-cash-counter.component.html',
  styleUrls: ['./new-cash-counter.component.scss']
})
export class NewCashCounterComponent implements OnInit {

  cashcounterForm: FormGroup;
  constructor(
      public _CashCounterMasterService: CashCounterMasterService,
      public dialogRef: MatDialogRef<NewCashCounterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }
 
  ngOnInit(): void {
      this.cashcounterForm = this._CashCounterMasterService.createcashcounterForm();
      var m_data = {
        cashCounterId: this.data?.cashCounterId,
        cashCounterName: this.data?.cashCounterName.trim(),
        prefix: this.data?.prefix,
        billNo: this.data?.billNo,
     //  isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.cashcounterForm.patchValue(m_data);
  }
  onSubmit() {
      if (this.cashcounterForm.valid) {
        debugger
          this._CashCounterMasterService.cashcounterMasterSave(this.cashcounterForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }

  onClear(val: boolean) {
      this.cashcounterForm.reset();
      this.dialogRef.close(val);
  }
}
