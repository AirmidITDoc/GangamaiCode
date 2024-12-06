import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MaritalstatusMasterService } from '../maritalstatus-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-maritalstatus',
  templateUrl: './new-maritalstatus.component.html',
  styleUrls: ['./new-maritalstatus.component.scss']
})
export class NewMaritalstatusComponent implements OnInit {
  maritalForm: FormGroup;
  constructor( public _MaritalstatusMasterService: MaritalstatusMasterService,
    public dialogRef: MatDialogRef<NewMaritalstatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    this.maritalForm = this._MaritalstatusMasterService.createMaritalForm();
    var m_data = {
    maritalStatusId: this.data?.maritalStatusId,
    maritalStatusName: this.data?.maritalStatusName.trim(),
    isDeleted: JSON.stringify(this.data?.isActive),
    };
    this.maritalForm.patchValue(m_data);
  }

  onSubmit() {
    if (this.maritalForm.invalid) {
        this.toastr.warning('please check from is invalid', 'Warning !', {
          toastClass:'tostr-tost custom-toast-warning',
      })
      return;
    }else{
    if (this.maritalForm.valid) {
        this._MaritalstatusMasterService.MaritalStatusMasterSave(this.maritalForm.value).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
        }, (error) => {
            this.toastr.error(error.message);
        });
    }
  }
}

onClear(val: boolean) {
    this.maritalForm.reset();
    this.dialogRef.close(val);
}
}