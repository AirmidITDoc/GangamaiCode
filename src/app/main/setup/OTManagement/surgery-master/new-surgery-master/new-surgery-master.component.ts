import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { SurgeryMasterService } from '../surgery-master.service';

@Component({
  selector: 'app-new-surgery-master',
  templateUrl: './new-surgery-master.component.html',
  styleUrls: ['./new-surgery-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
        animations: fuseAnimations,
})
export class NewSurgeryMasterComponent implements OnInit {
myForm: FormGroup;
    isActive:boolean=true;
      
    constructor(
                    public _SurgeryMasterService: SurgeryMasterService,
                    public dialogRef: MatDialogRef<NewSurgeryMasterComponent>,
                    @Inject(MAT_DIALOG_DATA) public data: any,
                    public toastr: ToastrService
                ) { }
    
    autocompleteModetaluka: string = "Taluka";
    autocompleteModeDepartment: String = "Department";

    SurgeryId = 0;
    
    ngOnInit(): void {
        this.myForm = this._SurgeryMasterService.createSurgeryForm();
         this.myForm.markAllAsTouched();

        console.log(this.data)
        if ((this.data?.surgeryId??0) > 0) 
        {
            this.isActive=this.data.isActive
            this.myForm.patchValue(this.data);
        }   
    }
    
      
        onSubmit() {
         if (!this.myForm.invalid) {
            console.log(this.myForm.value)
            this._SurgeryMasterService.stateMasterSave(this.myForm.value).subscribe((response) => {
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
                SurgeryName: [
                    { name: "required", Message: "surgery Name is required" }
                ],
                 surgeryCategoryId: [
                    { name: "required", Message: "surgeryCategory Id is required" }
                ],
                 departmentId: [
                    { name: "required", Message: "department id is required" }
                ],
                 surgeryAmount: [
                    { name: "required", Message: "amount is required" }
                ],
                 ottemplateId: [
                    { name: "required", Message: "Table id is required" }
                ],
                 siteDescId: [
                    { name: "required", Message: "siteDesc id is required" }
                ],
                departmentName: [
                    { name: "required", Message: "department Name is required" 
                    },
                    { name: "maxlength", Message: "department Name should not be greater than 50 char." },
                    { name: "pattern", Message: "Only char allowed." }
                ]
            };
        }
    
    
        selectChangecountry(obj: any){
            console.log(obj);
            this.SurgeryId=obj.value
        }
    
        onClear(val: boolean) {
          this.myForm.reset();
          this.dialogRef.close(val);
        }
}
