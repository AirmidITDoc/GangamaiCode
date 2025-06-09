import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { TalukaMasterService } from '../taluka-master.service';

@Component({
    selector: 'app-new-taluka',
    templateUrl: './new-taluka.component.html',
    styleUrls: ['./new-taluka.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewTalukaComponent implements OnInit {
    
    myForm: FormGroup;
    isActive:boolean=true;
      
    constructor(
        public _TalukaMasterService: TalukaMasterService,
        public dialogRef: MatDialogRef<NewTalukaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }
    
    autocompleteModecity: string = "City";

    cityId = 0;
    
    ngOnInit(): void {
        this.myForm = this._TalukaMasterService.createTalukaForm();
        this.myForm.markAllAsTouched();
        
        console.log(this.data)
        if ((this.data?.talukaId??0) > 0) 
        {
            this.isActive=this.data.isActive
            this.myForm.patchValue(this.data);
        }   
    }
    
      
        onSubmit() {
         if (!this.myForm.invalid) {
            console.log(this.myForm.value)
            this._TalukaMasterService.stateMasterSave(this.myForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.myForm.invalid) {
                for (const controlName in this.myForm.controls) {
                    if (this.myForm.controls[controlName].invalid) {
                        invalidFields.push(`taluka Form: ${controlName}`);
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
                cityId: [
                    { name: "required", Message: "City Name is required" }
                ],
                talukaName: [
                    { name: "required", Message: "Taluka Name is required" },
                    { name: "maxlength", Message: "Taluka Name should not be greater than 50 char." },
                    { name: "pattern", Message: "Only char allowed." }
                ]
            };
        }
    
    
        selectChangecountry(obj: any){
            console.log(obj);
            this.cityId=obj.value
        }
    
        onClear(val: boolean) {
          this.myForm.reset();
          this.dialogRef.close(val);
        }

}
