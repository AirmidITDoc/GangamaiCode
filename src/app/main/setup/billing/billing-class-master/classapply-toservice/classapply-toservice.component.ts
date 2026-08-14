import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { BillingClassMasterService } from '../billing-class-master.service';

@Component({
  selector: 'app-classapply-toservice',
  templateUrl: './classapply-toservice.component.html',
  styleUrls: ['./classapply-toservice.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ClassapplyToserviceComponent {

  classToServiceForm: FormGroup;

  autocompleteModeClass: string = "Class";
  autocompleteModetariff: string = "Tariff";

  constructor(
    public _BillingClassMasterService: BillingClassMasterService,
    public dialogRef: MatDialogRef<ClassapplyToserviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.classToServiceForm = this._BillingClassMasterService.createClassToServiceForm();
    this.classToServiceForm.markAllAsTouched();
  }

  onSubmit() {

    if (!this.classToServiceForm.invalid) {
      if (this.classToServiceForm.get('TariffId').value == '0') {
        this.classToServiceForm.get('TariffId').setValue(null)
      }
      const formValue = this.classToServiceForm.value;

      const payload = {
        ...formValue,
        TariffId: formValue.TariffId ? formValue.TariffId : null
      };

      console.log(payload);
      this._BillingClassMasterService.classSaveToService(this.classToServiceForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      const invalidFields = [];
      if (this.classToServiceForm.invalid) {
        for (const controlName in this.classToServiceForm.controls) {
          if (this.classToServiceForm.controls[controlName].invalid) {
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
    this.classToServiceForm.reset();
    this.dialogRef.close(val);
  }
}
