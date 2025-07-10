import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { OtRequestService } from '../ot-request.service';


@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewRequestComponent implements OnInit {
  countryForm: FormGroup;
   isActive:boolean=true;
 
   constructor( public _OtRequestService: OtRequestService,
     public dialogRef: MatDialogRef<NewRequestComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
     public toastr: ToastrService) { }
 
   ngOnInit(): void {
     this.countryForm = this._OtRequestService.createRequestForm();
     this.countryForm.markAllAsTouched();
     
     if ((this.data?.countryId??0) > 0) 
         {
             this.isActive=this.data.isActive
             this.countryForm.patchValue(this.data);
         }
 }
 
 
   onSubmit() {
     if (!this.countryForm.invalid) {
             console.log(this.countryForm.value)
             this._OtRequestService.requestSave(this.countryForm.value).subscribe((response) => {
                 this.onClear(true);
             });
         } {
             let invalidFields = [];
             if (this.countryForm.invalid) {
                 for (const controlName in this.countryForm.controls) {
                     if (this.countryForm.controls[controlName].invalid) {
                         invalidFields.push(`request Form: ${controlName}`);
                     }
                 }
             }
             if (invalidFields.length > 0) {
                 invalidFields.forEach(field => {
                     this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
                     );
                 });
             }
 
         }
     }
 
     getValidationMessages() {
       return {
           countryName: [
               { name: "required", Message: "Country Name is required" },
               { name: "maxlength", Message: "Country Name should not be greater than 50 char." },
               { name: "pattern", Message: "Special char not allowed." }
           ]
       };
   }
 
 onClear(val: boolean) {
     this.countryForm.reset();
     this.dialogRef.close(val);
 }
}





