import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AreaMasterService } from '../area-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-area',
  templateUrl: './new-area.component.html',
  styleUrls: ['./new-area.component.scss']
})
export class NewAreaComponent implements OnInit {

  areaForm: FormGroup;
  constructor(
      public _AreaMasterService: AreaMasterService,
      public dialogRef: MatDialogRef<NewAreaComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.areaForm = this._AreaMasterService.createAreaForm();
      var m_data = {
          areaId: this.data?.areaId,
          areaName: this.data?.areaName.trim(),
          isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.areaForm.patchValue(m_data);
  }
  onSubmit() {
      if (this.areaForm.valid) {
          this._AreaMasterService.AreaMasterSave(this.areaForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }

  onClear(val: boolean) {
      this.areaForm.reset();
      this.dialogRef.close(val);
  }
}