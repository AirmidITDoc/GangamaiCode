import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
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

  appointmentGroups = [
    {
      label: 'Appointment Charges setup',
      rows: [
        { type: 'New Visit', graceDays: '', noOfVisits: '', charges: '', serviceName: 'Consultation Fee', enabled: true, filteredServices: [] },
        { type: 'Re-Visit Same Doctor', graceDays: '', noOfVisits: '', charges: '', serviceName: '', enabled: true, filteredServices: [] }
      ]
    },
    {
      label: 'Appointment Charges setup - VIDEO',
      rows: [
        { type: 'New Visit', graceDays: '', noOfVisits: '', charges: '', serviceName: '', enabled: true, filteredServices: [] }
      ]
    }
  ];


  initFilterOptions() {
    this.appointmentGroups.forEach(group => {
      group.rows.forEach(row => {
        row.filteredServices = this.allServices;
      });
    });
  }

  filterService(row: any) {
    const input = row.serviceName?.toLowerCase() || '';
    row.filteredServices = this.allServices.filter(service =>
      service.toLowerCase().includes(input)
    );
  }

  onSave() {
    console.log('Saved data:', this.appointmentGroups);
  }

  onCancel() {
    // reset logic
  }

    onSubmit(){

  }

  onClose(){ this.dialogRef.close()}
}
