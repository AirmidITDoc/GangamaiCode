import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FeedingrouteMasterService } from '../feedingroute-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-feedingroute-master',
  templateUrl: './new-feedingroute-master.component.html',
  styleUrls: ['./new-feedingroute-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewFeedingrouteMasterComponent implements OnInit {
  myForm: FormGroup;
  isActive: boolean = true;
  FeedingRouteId = 0;
  autocompleteModeFeedingRoute: string = 'MDietTypeMaster'

  constructor(
    public _feedingRouteMasterService: FeedingrouteMasterService,
    public dialogRef: MatDialogRef<NewFeedingrouteMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.myForm = this._feedingRouteMasterService.createFeedingRouteForm();
    this.myForm.markAllAsTouched();

    console.log("ngOnInit", this.data)
    if ((this.data?.feedingRouteId ?? 0) > 0) {
      this.FeedingRouteId = this.data.feedingRouteId
      this.isActive = this.data.active
      this.myForm.patchValue(this.data);
    }
  }


  onSubmit() {
    if (!this.myForm.invalid) {
      console.log("Submit Form Values", this.myForm.value)
      this._feedingRouteMasterService.FeedingRouteSave(this.myForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      const invalidFields = [];
      if (this.myForm.invalid) {
        for (const controlName in this.myForm.controls) {
          if (this.myForm.controls[controlName].invalid) {
            invalidFields.push(`Feeding Route Form: ${controlName}`);
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
      FeedingRouteName: [
        { name: "required", Message: "Feeding Route Name is required" },
        { name: "maxlength", Message: "Feeding Route Name should not be greater than 50 char." },
        { name: "pattern", Message: "Only char allowed." }
      ],
      FeedingRouteCode: [
        { name: "required", Message: "Feeding Route Code is required" }
      ],
      DietTypesId: [
        { name: "required", Message: "Diet Type is required" }
      ]
    };
  }

  onClear(val: boolean) {
    this.myForm.reset();
    this.dialogRef.close(val);
  }
}

