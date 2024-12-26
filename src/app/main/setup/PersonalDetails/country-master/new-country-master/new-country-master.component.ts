import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CountryMasterService } from '../country-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-country-master',
  templateUrl: './new-country-master.component.html',
  styleUrls: ['./new-country-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
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
    if(!this.countryForm.invalid)
        {
    this.saveflag = true;
   
        this._CountryMasterService.countryMasterSave(this.countryForm.value).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
        }, (error) => {
            this.toastr.error(error.message);
        });
    }
    else
      {
        this.toastr.warning('please check from is invalid', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
      }
}

    getValidationMessages() {
      return {
          countryName: [
              { name: "required", Message: "Country Name is required" },
              { name: "maxlength", Message: "Religion name should not be greater than 50 char." },
              { name: "pattern", Message: "Special char not allowed." }
          ]
      };
  }

onClear(val: boolean) {
    this.countryForm.reset();
    this.dialogRef.close(val);
}
}
