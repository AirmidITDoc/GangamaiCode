
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HsncodeserviceService } from '../hsncodeservice.service';

@Component({
  selector: 'app-new-hsncode',
  templateUrl: './new-hsncode.component.html',
  styleUrls: ['./new-hsncode.component.scss']
})
export class NewHsncodeComponent {
 HsnccodeForm: FormGroup;
     isActive: boolean = true;
     
 
     constructor(
         public _HsncodeserviceService: HsncodeserviceService,
         public dialogRef: MatDialogRef<NewHsncodeComponent>,
         @Inject(MAT_DIALOG_DATA) public data: any,
         public toastr: ToastrService
     ) { }
 
     ngOnInit(): void {
         this.HsnccodeForm = this._HsncodeserviceService.createItemHsncodeForm();
         this.HsnccodeForm.markAllAsTouched();
         if ((this.data?.hsncodeId ?? 0) > 0) {
             this.isActive = this.data.isActive
             this.HsnccodeForm.patchValue(this.data);
         }
     }
 
     onSubmit() {
         if (!this.HsnccodeForm.invalid) {
             console.log(this.HsnccodeForm.value)
             this._HsncodeserviceService.HsnccodeMasterSave(this.HsnccodeForm.value).subscribe((response) => {
                 this.onClear(true);
             });
         } {
             const invalidFields = [];
             if (this.HsnccodeForm.invalid) {
                 for (const controlName in this.HsnccodeForm.controls) {
                     if (this.HsnccodeForm.controls[controlName].invalid) {
                         invalidFields.push(`HSNCODE Form: ${controlName}`);
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
      
 
     onClear(val: boolean) {
         this.HsnccodeForm.reset();
         this.dialogRef.close(val);
     }
 
     getValidationMessages() {
         return {
             hsncodeName: [
                 { name: "required", Message: "hsncode is required" },
                 { name: "maxlength", Message: "hsncode should not be greater than 50 char." },
                 { name: "pattern", Message: "Special char not allowed." }
             ],
             
         };
     }
 }
 