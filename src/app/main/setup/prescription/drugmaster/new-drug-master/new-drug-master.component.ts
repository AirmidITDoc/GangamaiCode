import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DrugmasterService } from '../drugmaster.service';

@Component({
  selector: 'app-new-drug-master',
  templateUrl: './new-drug-master.component.html',
  styleUrls: ['./new-drug-master.component.scss']
})
export class NewDrugMasterComponent implements OnInit {

    drugForm:FormGroup;
    isActive:boolean=true;

    autocompleteModeClass: string = "Class";  
    autocompleteModeGenericName: string = "ItemGeneric";

    constructor(
        public _durgMasterService: DrugmasterService,
        public dialogRef: MatDialogRef<NewDrugMasterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.drugForm=this._durgMasterService.createDrugForm();
        this.drugForm.markAllAsTouched();
        if((this.data?.drugId??0) > 0)
            {
            this.isActive=this.data.isActive
            this.drugForm.patchValue(this.data);
        }
    }

  
    onSubmit() {
        
      if (!this.drugForm.invalid) {
            console.log(this.drugForm.value)
            this._durgMasterService.drugMasterSave(this.drugForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.drugForm.invalid) {
                for (const controlName in this.drugForm.controls) {
                    if (this.drugForm.controls[controlName].invalid) {
                        invalidFields.push(`drug Form: ${controlName}`);
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
        this.drugForm.reset();
        this.dialogRef.close(val);
    }

    ClassId=0;
    GenericId=0;

    selectChangeClass(obj: any){
        console.log(obj);
        this.ClassId=obj.value
    }
    selectChangeGeneric(obj: any){
        console.log(obj);
        this.ClassId=obj.value
    }
        
    getValidationMessages(){
        return{
            drugName: [
                { name: "required", Message: "Drug Name is required" },
                { name: "maxlength", Message: "Drug name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            classId: [
                { name: "required", Message: "Class Name is required" },
            ],
            genericId : [
                { name: "required", Message: "Generic Name is required" },
            ]
        }
    }

}
