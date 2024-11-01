import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BillingClassMasterService } from '../billing-class-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-class',
  templateUrl: './new-class.component.html',
  styleUrls: ['./new-class.component.scss']
})
export class NewClassComponent implements OnInit {

  classForm: FormGroup;
  constructor(
      public _BillingClassMasterService: BillingClassMasterService,
      public dialogRef: MatDialogRef<NewClassComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }
 
  ngOnInit(): void {
      this.classForm = this._BillingClassMasterService.createClassForm();
      var m_data = {
        classId: this.data?.classId,
       className: this.data?.className.trim(),
       isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.classForm.patchValue(m_data);
  }
  onSubmit() {
      if (this.classForm.valid) {
        debugger
          this._BillingClassMasterService.classMasterSave(this.classForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }

  onClear(val: boolean) {
      this.classForm.reset();
      this.dialogRef.close(val);
  }
}
