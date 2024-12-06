import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CountryMasterService } from '../country-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-country-master',
  templateUrl: './new-country-master.component.html',
  styleUrls: ['./new-country-master.component.scss']
})
export class NewCountryMasterComponent implements OnInit {
  countryForm: FormGroup;
  constructor( public _CountryMasterService: CountryMasterService,
    public dialogRef: MatDialogRef<NewCountryMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    this.countryForm = this._CountryMasterService.createCountryForm();
    var m_data = {
    countryId: this.data?.countryId,
    countryName: this.data?.countryName.trim(),
    isDeleted: JSON.stringify(this.data?.isActive),
    };
    this.countryForm.patchValue(m_data);
  }

  onSubmit() {
    if (this.countryForm.invalid) {
        this.toastr.warning('please check from is invalid', 'Warning !', {
          toastClass:'tostr-tost custom-toast-warning',
      })
      return;
    }else{
    if (this.countryForm.valid) {
        debugger
        this._CountryMasterService.countryMasterSave(this.countryForm.value).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
        }, (error) => {
            this.toastr.error(error.message);
        });
    }
  }
}

onClear(val: boolean) {
    this.countryForm.reset();
    this.dialogRef.close(val);
}
}
