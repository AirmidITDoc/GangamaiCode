import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CompanyTypeMasterService } from '../company-type-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-company-type',
  templateUrl: './new-company-type.component.html',
  styleUrls: ['./new-company-type.component.scss']
})
export class NewCompanyTypeComponent implements OnInit {

 
  companttypeForm: FormGroup;
  constructor(
      public _CompanyTypeMasterService: CompanyTypeMasterService,
      public dialogRef: MatDialogRef<NewCompanyTypeComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }
 
  ngOnInit(): void {
      this.companttypeForm = this._CompanyTypeMasterService.createcompanytypeForm();
      var m_data = {
        companyTypeId: this.data?.companyTypeId,
        typeName: this.data?.typeName.trim(),
       isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.companttypeForm.patchValue(m_data);
  }
  onSubmit() {
    if (this.companttypeForm.invalid) {
      this.toastr.warning('please check from is invalid', 'Warning !', {
        toastClass:'tostr-tost custom-toast-warning',
    })
    return;
    }else{
      if (this.companttypeForm.valid) {
        debugger
          this._CompanyTypeMasterService.companytypeMasterSave(this.companttypeForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
    }      
  }

  onClear(val: boolean) {
      this.companttypeForm.reset();
      this.dialogRef.close(val);
  }
}
