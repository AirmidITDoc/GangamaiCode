import { Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SubspecialityMasterService } from '../subspeciality-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-subspeciality-master',
  templateUrl: './new-subspeciality-master.component.html',
  styleUrls: ['./new-subspeciality-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewSubspecialityMasterComponent implements OnInit {

  //   "subSpecialtyId": 0,
  // "specialtyId": 0,
  // "subSpecialtyName": "mkoi"
  myForm: FormGroup;
  isActive: boolean = true;
  subSpecialtyid = 0;
  autocompleteModeSpeciality: string = 'MOtSpecialtyMaster'
  constructor(
    public _subspecialityService: SubspecialityMasterService,
    public dialogRef: MatDialogRef<NewSubspecialityMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.myForm = this._subspecialityService.createSubSpecialityForm();
    this.myForm.markAllAsTouched();

    console.log(this.data)
    if ((this.data?.subSpecialtyId ?? 0) > 0) {
      this.isActive = this.data.isActive
      this.subSpecialtyid = this.data.subSpecialtyId
      console.log(this.subSpecialtyid)
      this.myForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (!this.myForm.invalid) {
      console.log(this.myForm.value)
      this._subspecialityService.subSpecialitySave(this.myForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      const invalidFields = [];
      if (this.myForm.invalid) {
        for (const controlName in this.myForm.controls) {
          if (this.myForm.controls[controlName].invalid) {
            invalidFields.push(`SUb-Speciality Form: ${controlName}`);
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
      specialtyId: [
        { name: "required", Message: "Specialty Name is required" }
      ],
      subSpecialtyName: [
        { name: "required", Message: "Sub Specialty Name is required" },
        { name: "maxlength", Message: "Sub Specialty Name should not be greater than 50 char." },
        { name: "pattern", Message: "Only char allowed." }
      ]
    };
  }

  onClear(val: boolean) {
    this.myForm.reset();
    this.dialogRef.close(val);
  }

}
