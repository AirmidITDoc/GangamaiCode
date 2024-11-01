import { Component, Inject, OnInit } from '@angular/core';
import { BedMasterService } from '../bed-master.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-bed',
  templateUrl: './new-bed.component.html',
  styleUrls: ['./new-bed.component.scss']
})
export class NewBedComponent implements OnInit {

  bedForm: FormGroup;
  constructor(
      public _BedMasterService: BedMasterService,
      public dialogRef: MatDialogRef<NewBedComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }
 
  ngOnInit(): void {
      this.bedForm = this._BedMasterService.createBedForm();
      var m_data = {
        bedId: this.data?.bedId,
        bedName: this.data?.bedName.trim(),
        roomId: this.data?.roomId,
        isAvailible: JSON.stringify(this.data?.isAvailible),
         // isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.bedForm.patchValue(m_data);
  }
  onSubmit() {
      if (this.bedForm.valid) {
        debugger
          this._BedMasterService.bedMasterSave(this.bedForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }

  onClear(val: boolean) {
      this.bedForm.reset();
      this.dialogRef.close(val);
  }
}
