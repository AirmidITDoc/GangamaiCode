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

  allServices = [
    'Consultation Fee',
    'FOLEYS INSERTION / REMOVAL',
    'FOLLOWUP CHARGE'
  ];
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

  ) {
  }

  // appointmentGroups = [
  //   {
  //     label: 'Appointment Charges setup',
  //     rows: [
  //       { type: 'New Visit', graceDays: '', noOfVisits: '', charges: '', serviceName: 'Consultation Fee', enabled: true, filteredServices: [] },
  //       { type: 'Re-Visit Same Doctor', graceDays: '', noOfVisits: '', charges: '', serviceName: '', enabled: true, filteredServices: [] }
  //     ]
  //   },
  //   {
  //     label: 'Appointment Charges setup - VIDEO',
  //     rows: [
  //       { type: 'New Visit', graceDays: '', noOfVisits: '', charges: '', serviceName: '', enabled: true, filteredServices: [] }
  //     ]
  //   }
  // ];

  ApiURL: any;
  ngOnInit(): void {
    this.DrchargesForm = this.createChargesForm();
    this.DrchargesForm.markAllAsTouched();

    this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + 1 + "&ClassId=" + 1 + "&ServiceName="

  }


  createChargesForm() {
    return this.formBuilder.group({

      doctorId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      docChargeId: 0,
      serviceId: [''],
      tariffId: [0, [
        Validators.required]],
      classId: ['', [
        Validators.required]],
      days: [''],
      price: 0

    });
  }

  // initFilterOptions() {
  //   this.appointmentGroups.forEach(group => {
  //     group.rows.forEach(row => {
  //       row.filteredServices = this.allServices;
  //     });
  //   });
  // }

  // filterService(row: any) {
  //   const input = row.serviceName?.toLowerCase() || '';
  //   row.filteredServices = this.allServices.filter(service =>
  //     service.toLowerCase().includes(input)
  //   );
  // }
  SrvcName1: any;
  serviceId: any
  autocompleteModetariff: string = "Tariff";
  autocompleteModeService: string = "Service";
  autocompleteModeclass: string = "Class";

  getSelectedserviceObj(obj) {
    this.SrvcName1 = obj.serviceName;
    this.serviceId = obj.serviceId;

  }

  getSelectedclassObj(obj) { }


  getSelectedTariffObj(obj) { }
  onSave() {
    // console.log('Saved data:', this.appointmentGroups);
  }

  onCancel() {
    // reset logic
  }

  onSubmit() {

    this.DrchargesForm.get("serviceId").setValue(this.serviceId)
    this.dialogRef.close(this.DrchargesForm.value)
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