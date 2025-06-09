import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { StateMasterService } from '../state-master.service';

@Component({
    selector: 'app-new-state-master',
    templateUrl: './new-state-master.component.html',
    styleUrls: ['./new-state-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewStateMasterComponent implements OnInit {

  stateForm: FormGroup;
  isActive:boolean=true;
  
  constructor(
      public _StateMasterService: StateMasterService,
      public dialogRef: MatDialogRef<NewStateMasterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
    ) { }

  autocompleteModecountry: string = "Country";

  countryId = 0;

    ngOnInit(): void {
      this.stateForm = this._StateMasterService.createStateForm();
      this.stateForm.markAllAsTouched();

      console.log(this.data)
      if ((this.data?.stateId??0) > 0) 
      {
        this.isActive=this.data.isActive
       this.stateForm.patchValue(this.data);
        }
  }

  
    onSubmit() {
     if (!this.stateForm.invalid) {
            console.log(this.stateForm.value)
            this._StateMasterService.stateMasterSave(this.stateForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.stateForm.invalid) {
                for (const controlName in this.stateForm.controls) {
                    if (this.stateForm.controls[controlName].invalid) {
                        invalidFields.push(`State Form: ${controlName}`);
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
      countryId: [
            { name: "required", Message: "Country Name is required" }
        ],
        stateName: [
          { name: "required", Message: "State Name is required" },
          { name: "maxlength", Message: "Religion name should not be greater than 50 char." },
          { name: "pattern", Message: "Only char allowed." }
      ]
    };
    }


    selectChangecountry(obj: any){
        console.log(obj);
        this.countryId=obj.value
    }

    onClear(val: boolean) {
      this.stateForm.reset();
      this.dialogRef.close(val);
    }
}