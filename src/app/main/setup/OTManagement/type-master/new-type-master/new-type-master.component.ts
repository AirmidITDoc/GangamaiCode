import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { NewSurgeryMasterComponent } from '../../surgery-master/new-surgery-master/new-surgery-master.component';
import { TypeMasterService } from '../type-master.service';

@Component({
  selector: 'app-new-type-master',
  templateUrl: './new-type-master.component.html',
  styleUrls: ['./new-type-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
          animations: fuseAnimations,
})
export class NewTypeMasterComponent implements OnInit {
myForm: FormGroup;
    isActive:boolean=true;
      
    constructor(
                    public _TypeMasterService: TypeMasterService,
                    public dialogRef: MatDialogRef<NewSurgeryMasterComponent>,
                    @Inject(MAT_DIALOG_DATA) public data: any,
                    public toastr: ToastrService
                ) { }
    
      
    ngOnInit(): void {
    
        this.myForm = this._TypeMasterService.createTypeForm();
         this.myForm.markAllAsTouched();

        console.log(this.data)
        if ((this.data?.ottypeId??0) > 0) 
        {
            this.isActive=this.data.isActive
            this.myForm.patchValue(this.data);
        }   
    }
    
      
        onSubmit() {
         if (!this.myForm.invalid) {
            console.log(this.myForm.value)
            this._TypeMasterService.stateMasterSave(this.myForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.myForm.invalid) {
                for (const controlName in this.myForm.controls) {
                    if (this.myForm.controls[controlName].invalid) {
                        invalidFields.push(`myForm Form: ${controlName}`);
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
                // talukaName: [
                //     { name: "required", Message: "City Name is required" }
                // ],
                typeName: [
                    { name: "required", Message: "ottype Name is required" },
                    { name: "maxlength", Message: "Taluka Name should not be greater than 50 char." },
                    { name: "pattern", Message: "Only char allowed." }
                ]
            };
        }
    
        
        onClear(val: boolean) {
          this.myForm.reset();
          this.dialogRef.close(val);
        }
}
