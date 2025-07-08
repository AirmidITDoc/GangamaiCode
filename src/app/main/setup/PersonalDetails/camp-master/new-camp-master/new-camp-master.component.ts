import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { CampMasterService } from '../camp-master.service';

@Component({
  selector: 'app-new-camp-master',
  templateUrl: './new-camp-master.component.html',
  styleUrls: ['./new-camp-master.component.scss'],
   encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewCampMasterComponent implements OnInit {

    campForm: FormGroup;
     isActive:boolean=true;
      autocompleteModestatus: string = "State";
      stateId=0;
  
      constructor(
          public _CampMasterService: CampMasterService,
          public dialogRef: MatDialogRef<NewCampMasterComponent>,
          @Inject(MAT_DIALOG_DATA) public data: any,
          public toastr: ToastrService
      ) { }
  
      ngOnInit(): void {
          this.campForm = this._CampMasterService.createCampForm();
          this.campForm.markAllAsTouched();
          if ((this.data?.campId ?? 0) > 0) {
              this.isActive = this.data.isActive
              this.campForm.patchValue(this.data);
          }
      }
  
     onSubmit() {
        if (!this.campForm.invalid) {
            console.log(this.campForm.value)
            this._CampMasterService.campMasterSave(this.campForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.campForm.invalid) {
                for (const controlName in this.campForm.controls) {
                    if (this.campForm.controls[controlName].invalid) {
                        invalidFields.push(`camp Form: ${controlName}`);
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
              campLocation: [
                  { name: "required", Message: "location Name is required" }
              ],
              campName: [
                  { name: "required", Message: "Camp Name is required" },
                  { name: "pattern", Message: "Only char allowed." }
              ],
          }
      }
  
      onClear(val: boolean) {
          this.campForm.reset();
          this.dialogRef.close(val);
      }
  }

