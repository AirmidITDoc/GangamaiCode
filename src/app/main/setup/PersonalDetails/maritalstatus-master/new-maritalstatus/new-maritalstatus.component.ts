import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MaritalstatusMasterService } from '../maritalstatus-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-maritalstatus',
  templateUrl: './new-maritalstatus.component.html',
  styleUrls: ['./new-maritalstatus.component.scss'],
   encapsulation: ViewEncapsulation.None,
        animations: fuseAnimations,
})
export class NewMaritalstatusComponent implements OnInit {
  maritalForm: FormGroup;
  isActive:boolean=true;
  
  constructor( public _MaritalstatusMasterService: MaritalstatusMasterService,
    public dialogRef: MatDialogRef<NewMaritalstatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    this.maritalForm = this._MaritalstatusMasterService.createMaritalForm();
   
    if ((this.data?.maritalStatusId??0) > 0) {
    this.maritalForm.patchValue(this.data);
  }
  }
  
  onSubmit() {
    if(!this.maritalForm.invalid)
        {
        this._MaritalstatusMasterService.MaritalStatusMasterSave(this.maritalForm.value).subscribe((response) => {
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
          maritalStatusName: [
              { name: "required", Message: "Marital Status Name  is required" },
              { name: "maxlength", Message: "Marital Status Name should not be greater than 50 char." },
              { name: "pattern", Message: "Special char not allowed." }
          ]
      };
  }

onClear(val: boolean) {
    this.maritalForm.reset();
    this.dialogRef.close(val);
}
}