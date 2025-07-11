import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ServiceMasterService } from '../service-master.service';
import { fuseAnimations } from '@fuse/animations';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';

@Component({
  selector: 'app-tariff',
  templateUrl: './tariff.component.html',
  styleUrls: ['./tariff.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class TariffComponent implements OnInit {

  serviceForm: FormGroup;
  serviceTariffForm: FormGroup;
  isSelectedCheck: boolean = false;

  autocompleteModeName1: string = "Tariff";
  autocompleteModeName2: string = "Tariff";
  hideSomeFields: boolean = false
  constructor(
    public _ServiceMasterService: ServiceMasterService,
    public dialogRef: MatDialogRef<TariffComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.serviceForm = this._ServiceMasterService.createTariffmasterForm();
    this.serviceForm.markAllAsTouched();
    this.serviceTariffForm = this._ServiceMasterService.createAllTariffmasterForm();
    this.serviceTariffForm.markAllAsTouched();

    if ((this.data?.tariffId ?? 0) > 0) {
      // this.isActive=this.data.isActive
      this.serviceForm.patchValue(this.data);
    }
    if (this.data?.context === 'new') {
      this.hideSomeFields = true;
    } else {
      this.hideSomeFields = false;
    }

    this.serviceTariffForm.get('isAll')?.valueChanges.subscribe(value => {
      if (value) {
        this.serviceTariffForm.get('isSelected')?.setValue(0, { emitEvent: false });
        this.isSelectedCheck = false;
      }
    });

    this.serviceTariffForm.get('isSelected')?.valueChanges.subscribe(value => {
      if (value) {
        this.serviceTariffForm.get('isAll')?.setValue(0, { emitEvent: false });
        this.isSelectedCheck = true;
      }
    });
  }

  @ViewChild('ddltariff') ddltariff: AirmidDropDownComponent;
  tariffName: any[] = [];

  onChangeTariff(event) {
    if (event.length > 0) {
      this.tariffName = [];
      event.forEach(item => {
        this.tariffName.push(item.value)
      })
    }
    console.log(this.tariffName)
  }

  removeTariff(item) {
    let removedIndex = this.serviceForm.value.newTariffId.findIndex(x => x.value == item.value);
    this.serviceForm.value.newTariffId.splice(removedIndex, 1);
    this.ddltariff.SetSelection(this.serviceForm.value.newTariffId.map(x => x.value));
  }

  onSubmit() {
    if (!this.serviceForm.invalid) {
      console.log('Insert tariff:', this.serviceForm.value);

      this._ServiceMasterService.SaveTariff(this.serviceForm.value).subscribe(response => {
        this.onClear(true);
      });

    } else {
      let invalidFields = [];

      if (this.serviceForm.invalid) {
        for (const controlName in this.serviceForm.controls) {
          if (this.serviceForm.controls[controlName].invalid) {
            invalidFields.push(`Service Form: ${controlName}`);
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
    this.serviceForm.reset();
    this.dialogRef.close(val);
  }

  onSubmitTariff() {
    const isSelected = this.serviceTariffForm.get('isSelected')?.value;
    const isAll = this.serviceTariffForm.get('isAll')?.value;

    if (isSelected === true) {
      this.serviceTariffForm.get('TariffId')?.setValidators([Validators.required]);

      if (!this.serviceTariffForm.get('TariffId')?.value || this.serviceTariffForm.get('TariffId')?.value === false) {
        this.toastr.warning('Select Tariff');
        return;
      }
    }
    if (isAll === true) {
      this.serviceTariffForm.get('TariffId')?.clearValidators();
      // this.serviceTariffForm.get('TariffId')?.setValue(0);
    }
    this.serviceTariffForm.get('TariffId')?.updateValueAndValidity();

    if (!this.serviceTariffForm.invalid) {
      console.log('Insert tariff:', this.serviceTariffForm.value);

      // this._ServiceMasterService.SaveTariff(this.serviceTariffForm.value).subscribe(response => {
      //   this.onClear(true);
      // });

    } else {
      let invalidFields = [];

      if (this.serviceTariffForm.invalid) {
        for (const controlName in this.serviceTariffForm.controls) {
          if (this.serviceTariffForm.controls[controlName].invalid) {
            invalidFields.push(`Service Form: ${controlName}`);
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
}