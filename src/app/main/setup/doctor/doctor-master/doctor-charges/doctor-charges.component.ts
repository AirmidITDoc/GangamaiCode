import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { DoctorMasterService } from '../doctor-master.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-doctor-charges',
  templateUrl: './doctor-charges.component.html',
  styleUrls: ['./doctor-charges.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DoctorChargesComponent {
  DrchargesForm: FormGroup;
  SrvcName1: any;
  serviceId: any
  autocompleteModetariff: string = "Tariff";
  autocompleteModeService: string = "Service";
  autocompleteModeclass: string = "Class";


  constructor(public _DoctorMasterService: DoctorMasterService,
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<DoctorChargesComponent>,

  ) {  this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + 1 + "&ClassId=" + 1 + "&ServiceName="

  }

 
  ApiURL: any;
  ngOnInit(): void {
    this.DrchargesForm = this.createChargesForm();
    this.DrchargesForm.markAllAsTouched();

    // this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + 1 + "&ClassId=" + 1 + "&ServiceName="

  }


  createChargesForm() {
    return this.formBuilder.group({

      doctorId: [0],
      docChargeId: 0,
      serviceId:  ["",[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
      tariffId:  ["",[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
      classId: ["",[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
      days: ['',Validators.required],
      price: ['',Validators.required]

    });
  }

  getSelectedserviceObj(obj) {
    this.SrvcName1 = obj.serviceName;
    this.serviceId = obj.serviceId;

  }

 
  onCancel() {
    // reset logic
  }

  onSubmit() {
    console.log(this.DrchargesForm.value)
       this.DrchargesForm.get("serviceId").setValue(this.serviceId)
    if (!this.DrchargesForm.invalid) {
      // this.DrchargesForm.get("serviceId").setValue(this.serviceId)
      this.dialogRef.close(this.DrchargesForm.value)
    } else {
      let invalidFields = [];
      if (this.DrchargesForm.invalid) {
        for (const controlName in this.DrchargesForm.controls) {
          if (this.DrchargesForm.controls[controlName].invalid) { invalidFields.push(`Charges Form: ${controlName}`); }
        }
      }

      if (invalidFields.length > 0) {
        invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
      }

    }
  }
    keyPressAlphanumeric(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }


  onClear(val: boolean) {
    this.DrchargesForm.reset();
    this.dialogRef.close();
  }
  onClose() { this.dialogRef.close() }
}

export class ChargesDetail {
  serviceId: any;
  serviceName: any;
  tariffId: any;
  tariffName: any;
  classId: any;
  className: any;
  price: any;
  days: any;
  /**
   * Constructor
   *
   * @param RegInsert
   */

  constructor(ChargesDetail) {
    {
      this.serviceId = ChargesDetail.serviceId || 0;
      this.serviceName = ChargesDetail.serviceName || '';
      this.tariffId = ChargesDetail.tariffId || 0;
      this.tariffName = ChargesDetail.tariffName || '';
      this.classId = ChargesDetail.classId || 0;
      this.className = ChargesDetail.className || '';
      this.price = ChargesDetail.price || 0;
      this.days = ChargesDetail.days || '';

    }
  }
}