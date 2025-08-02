import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { OttablemasterService } from '../ottablemaster.service';

@Component({
  selector: 'app-new-ottablemaster',
  templateUrl: './new-ottablemaster.component.html',
  styleUrls: ['./new-ottablemaster.component.scss'],
    encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class NewOTTablemasterComponent implements OnInit {
 myForm: FormGroup;
    isActive:boolean=true;

     constructor(
            public _OttablemasterService: OttablemasterService,
            public dialogRef: MatDialogRef<NewOTTablemasterComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any,
            public toastr: ToastrService
        ) { }
        
        autocompleteModeLocation: string = "Location";
    
        locationId = 0;
        
        ngOnInit(): void {
            this.myForm = this._OttablemasterService.createTableForm();
            this.myForm.markAllAsTouched();
            
            console.log(this.data)
            if ((this.data?.ottableId??0) > 0) 
            {
                this.isActive=this.data.isActive
                this.myForm.patchValue(this.data);
            }   
        }
        
          
            onSubmit() {
             if (!this.myForm.invalid) {
            console.log(this.myForm.value)
            this._OttablemasterService.OtMasterSave(this.myForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.myForm.invalid) {
                for (const controlName in this.myForm.controls) {
                    if (this.myForm.controls[controlName].invalid) {
                        invalidFields.push(`OT Form: ${controlName}`);
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
                    locationId:[
                               { name: "required", Message: "Location Name is required" }
                    ],
                    ottableName: [
                        { name: "required", Message: "otTable Name is required" },
                        { name: "maxlength", Message: "Ottable Name should not be greater than 50 char." },
                        { name: "pattern", Message: "Only char allowed." }
                    ]
                };
            }
        
        
            selectChangeLocation(obj: any){
                console.log(obj);
                this.locationId=obj.value
            }
        
            onClear(val: boolean) {
              this.myForm.reset();
              this.dialogRef.close(val);
            }
}
