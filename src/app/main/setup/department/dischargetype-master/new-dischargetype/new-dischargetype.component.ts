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
  constructor(
      public _DischargetypeMasterService: DischargetypeMasterService,
      public dialogRef: MatDialogRef<NewDischargetypeComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.dischargetypeForm = this._DischargetypeMasterService.createDischargetypeForm();
      var m_data = {
        dischargeTypeId: this.data?.dischargeTypeId,
        dischargeTypeName: this.data?.dischargeTypeName.trim(),
        isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.dischargetypeForm.patchValue(m_data);
  }
  onSubmit() {
    if (this.dischargetypeForm.invalid) {
        this.toastr.warning('please check from is invalid', 'Warning !', {
          toastClass:'tostr-tost custom-toast-warning',
      })
      return;
    }else{
      if (this.dischargetypeForm.valid) {
          this._DischargetypeMasterService.dischargeTypeMasterSave(this.dischargetypeForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
    }
  }

  onClear(val: boolean) {
      this.dischargetypeForm.reset();
      this.dialogRef.close(val);
  }
}
