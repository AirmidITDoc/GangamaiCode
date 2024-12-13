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
  
  constructor(
      public _TaxMasterService: TaxMasterService,
      public dialogRef: MatDialogRef<NewTaxComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.taxForm = this._TaxMasterService.createTaxMasterForm();
      var m_data = {
        Id: this.data?.Id,
        taxNature: this.data?.taxNature.trim(),
        isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.taxForm.patchValue(m_data);
  }

  onSubmit() {
    if (this.taxForm.invalid) {
        this.toastr.warning('please check from is invalid', 'Warning !', {
          toastClass:'tostr-tost custom-toast-warning',
      })
      return;
    }else{
      if (this.taxForm.valid) {
          this._TaxMasterService.taxMasterSave(this.taxForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
    }
    // if (this.taxForm.invalid) {
    //     this.toastr.warning('please check form is invalid', 'Warning !', 
    //     {
    //         toastClass:'tostr-tost custom-toast-warning',
    //     })
    //     return;
    //     }else{
    //         debugger
    //         var mdata =
    //         {
    //             "id": 0,
    //             "taxNature": this.taxForm.get("taxNature").value || "",
    //             "isActive": 0
    //         }

    //             console.log("TaxMaster Insert:",mdata);
                
    //             this._TaxMasterService.taxMasterSave(mdata).subscribe((response) => {
    //             this.toastr.success(response.message);
    //             this.onClear(true);
    //             }, (error) => {
    //             this.toastr.error(error.message);
    //             });
    //   }
  }

  onClear(val: boolean) {
    this.taxForm.reset();
    this.dialogRef.close(val);
  }

}
