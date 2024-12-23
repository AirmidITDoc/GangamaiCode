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
        this.saveflag = true
   
        debugger
        var mdata =
        {
            "id": 0,
            "taxNature": this.taxForm.get("taxNature").value,
            "isActive": 0
        }

        console.log("TaxMaster Insert:",mdata);

        this._TaxMasterService.taxMasterSave(mdata).subscribe((response) => {
        this.toastr.success(response.message);
        this.onClear(true);
        }, (error) => {
        this.toastr.error(error.message);
        });
  }

  onClear(val: boolean) {
    this.taxForm.reset();
    this.dialogRef.close(val);
  }

}
