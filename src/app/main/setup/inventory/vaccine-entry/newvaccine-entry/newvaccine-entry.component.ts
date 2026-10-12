import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
import { VaccineEntryService } from '../vaccine-entry.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-newvaccine-entry',
  templateUrl: './newvaccine-entry.component.html',
  styleUrls: ['./newvaccine-entry.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewvaccineEntryComponent {
  myForm: FormGroup;
  autocompleteModeGenericName: string = "ItemGeneric";
  autocompleteModeManufacturer: string = "ItemManufacture";
  autocompleteModeRoute: string = "Route";

  constructor(
    public _vaccineEntryService: VaccineEntryService,
    public dialogRef: MatDialogRef<NewvaccineEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.myForm = this._vaccineEntryService.createVaccineForm();
    this.myForm.markAllAsTouched();
    console.log("Data", this.data)
    if ((this.data?.vaccineId ?? 0) > 0) {
      this.myForm.patchValue(this.data);
    }
  }

  onSubmit() {

    if (!this.myForm.invalid) {
      const payload = {
        ...this.myForm.value,
        expiryDate: this.datePipe.transform(this.myForm.value.expiryDate, 'yyyy-MM-dd')
      };
      this._vaccineEntryService.vaccineSave(payload).subscribe((response) => {
        this.onClear(true);
      });
    } {
      const invalidFields = [];
      if (this.myForm.invalid) {
        for (const controlName in this.myForm.controls) {
          if (this.myForm.controls[controlName].invalid) {
            invalidFields.push(`class Form: ${controlName}`);
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
    this.myForm.reset();
    this.dialogRef.close(val);
  }
}
