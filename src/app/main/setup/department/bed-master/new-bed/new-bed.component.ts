import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { BedMasterService } from '../bed-master.service';

@Component({
  selector: 'app-new-bed',
  templateUrl: './new-bed.component.html',
  styleUrls: ['./new-bed.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewBedComponent implements OnInit {

  bedForm: FormGroup;
  isActive: boolean = true;
  isAvailible: boolean = true;
  autocompleteModeroomId: string = "Room";
  roomId = 0;

  constructor(
    public _BedMasterService: BedMasterService,
    public dialogRef: MatDialogRef<NewBedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.bedForm = this._BedMasterService.createBedForm();
    this.bedForm.markAllAsTouched();

    if ((this.data?.bedId ?? 0) > 0) {
      this.isActive = this.data.isActive;
      this.isAvailible = this.data.isAvailible;
      this.bedForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (!this.bedForm.invalid) {
      console.log(this.bedForm.value)
      this._BedMasterService.bedMasterSave(this.bedForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      let invalidFields = [];
      if (this.bedForm.invalid) {
        for (const controlName in this.bedForm.controls) {
          if (this.bedForm.controls[controlName].invalid) {
            invalidFields.push(`bed Form: ${controlName}`);
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

  selectChangeroomId(obj: any) {
    console.log(obj);
    this.roomId = obj.value
  }

  onClear(val: boolean) {
    this.bedForm.reset();
    this.dialogRef.close(val);
  }

  getValidationMessages() {
    return {
      roomId: [
        { name: "required", Message: "Ward Name is required" }
      ],
      bedName: [
        { name: "required", Message: "Bed Name is required" },
        { name: "pattern", Message: "Special char not allowed." }
      ]
    };
  }
}
