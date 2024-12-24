import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaxMasterService } from '../tax-master.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-tax',
  templateUrl: './new-tax.component.html',
  styleUrls: ['./new-tax.component.scss']
})
export class NewTaxComponent implements OnInit {

  taxForm: FormGroup;
  isActive:boolean=true;
  
  constructor(
      public _TaxMasterService: TaxMasterService,
      public dialogRef: MatDialogRef<NewTaxComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.taxForm = this._TaxMasterService.createTaxMasterForm();
      if(this.data){
        this.isActive=this.data.isActive
        this.taxForm.patchValue(this.data);
      }
  }

    saveflag : boolean = false;
    onSubmit() 
    {
    debugger
        if(!this.taxForm.invalid)
        {
            this.saveflag = true        
            // var mdata =
            // {
            //     "id": 0,
            //     "taxNature": this.taxForm.get("taxNature").value,
            //     "isActive": 0
            // }

            console.log("TaxMaster Insert:",this.taxForm.value);

            this._TaxMasterService.taxMasterSave(this.taxForm.value).subscribe((response) => {
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

  onClear(val: boolean) {
    this.taxForm.reset();
    this.dialogRef.close(val);
  }

    getValidationMessages() {
        return {
            taxNature: [
                { name: "required", Message: "TaxNature Name is required" },
                { name: "maxlength", Message: "TaxNature name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

}
