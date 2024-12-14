import { Component, Inject, OnInit } from '@angular/core';
import { UomMasterService } from '../uom-master.service';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-umo',
  templateUrl: './new-umo.component.html',
  styleUrls: ['./new-umo.component.scss']
})
export class NewUMOComponent implements OnInit {

  unitForm: FormGroup;
  constructor(
      public _UomMasterService: UomMasterService,
      public dialogRef: MatDialogRef<NewUMOComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.unitForm = this._UomMasterService.createUnitofmeasurementForm();
      var m_data = {
        unitofMeasurementId: this.data?.unitofMeasurementId,
        unitofMeasurementName: this.data?.unitofMeasurementName.trim(),
          isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.unitForm.patchValue(m_data);
  }

  Saveflag: boolean= false;
  onSubmit() {
    this.Saveflag=true
    if (this.unitForm.invalid) {
        this.toastr.warning('please check form is invalid', 'Warning !', {
          toastClass:'tostr-tost custom-toast-warning',
      })
      return;
    }else{
      if (this.unitForm.valid) {
          this._UomMasterService.unitMasterSave(this.unitForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
    }
  }

  onClear(val: boolean) {
      this.unitForm.reset();
      this.dialogRef.close(val);
  }
}