import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PrescriptionclassmasterService } from '../prescriptionclassmaster.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-prescription-class',
  templateUrl: './new-prescription-class.component.html',
  styleUrls: ['./new-prescription-class.component.scss']
})
export class NewPrescriptionClassComponent implements OnInit {

  prescriptionForm:FormGroup;
  isActive:boolean=true;

  constructor(
    public _PrescriptionclassService: PrescriptionclassmasterService,
        public dialogRef: MatDialogRef<NewPrescriptionClassComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.prescriptionForm=this._PrescriptionclassService.createPrescriptionclassForm();
    if(this.data){
        this.isActive=this.data.isActive
        this.prescriptionForm.patchValue(this.data);
    }
  }

  Saveflag: boolean= false;
  onSubmit() {

      if(!this.prescriptionForm.invalid)
        {
            this.Saveflag=true
        // var mdata={
        //   "classId": 0,
        //   "className": this.prescriptionForm.get("ClassName").value || ""
        // }
        console.log("class json:", this.prescriptionForm.value);
  
        this._PrescriptionclassService.prescriptionClassMasterSave(this.prescriptionForm.value).subscribe((response)=>{
          this.toastr.success(response.message);
          this.onClear(true);
        }, (error)=>{
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
        this.prescriptionForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            ClassName: [
                { name: "required", Message: "Class Name is required" },
                { name: "maxlength", Message: "Class Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special Char Not Allowed." }
            ]
        };
    }
}
