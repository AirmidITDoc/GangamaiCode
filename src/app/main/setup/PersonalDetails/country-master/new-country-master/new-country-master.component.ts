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
  isActive:boolean=true;
  saveflag : boolean = false;

  constructor( public _CountryMasterService: CountryMasterService,
    public dialogRef: MatDialogRef<NewCountryMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    this.countryForm = this._CountryMasterService.createCountryForm();
    if(this.data)
    this.isActive=this.data.isActive;
    this.countryForm.patchValue(this.data);
  }

 


  onSubmit() {
    this.saveflag = true;
   
        this._CountryMasterService.countryMasterSave(this.countryForm.value).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
        }, (error) => {
            this.toastr.error(error.message);
        });
    }

    getValidationMessages() {
      return {
          countryName: [
              { name: "required", Message: "Country Name is required" },
              { name: "pattern", Message: "Special char not allowed." }
          ]
      };
  }

onClear(val: boolean) {
    this.countryForm.reset();
    this.dialogRef.close(val);
}
}
