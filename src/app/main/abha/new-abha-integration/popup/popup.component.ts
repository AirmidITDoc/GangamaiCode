import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, Optional, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { HospitalConfigService } from 'app/core/services/hospital-config.service';
import { UserDetail } from 'app/main/administration/create-user/newcreate-user/newcreate-user.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { NewAbhaIntegrationService } from '../new-abha-integration.service';
import { SelectionModel } from '@angular/cdk/collections';
import { abhaRegInsert } from '../new-abha-integration.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
  patientDetail: any = new abhaRegInsert({});
  PatientName: any;
  DepartmentName: any;
  vOPIPId = 0;
  vTariffId = 0;
  vhospitalId = 0;
  vClassId: any = 0;
  RegNo: any;
  Doctorname: any;
  AgeYear: any;
  abhaNumber: any;
  abhaAddress: any;
  abhaId: any;
  DOB: any;

  displayedColumns: string[] = [
    'CheckBox',
    'visitDate',
    'opdNo',
    'departmentName',
    'doctorName'
  ]

  displayedColumns1: string[] = [
    'CheckBox',
    'visitDate',
    'opdNo',
    'departmentName',
    'doctorName'
  ]

  visitdataSource = new MatTableDataSource<abhaRegInsert>();
  admissiondataSource = new MatTableDataSource<abhaRegInsert>();

  constructor(private _matDialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public datePipe: DatePipe,
    public _abhaIntegrationService: NewAbhaIntegrationService,
    public toastr: ToastrService,
    public _ConfigService: ConfigService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    if (this.data) {
      this.patientDetail = this.data
      console.log("Data", this.patientDetail)

      this.PatientName = this.patientDetail.patientName
      this.patientDetail.doctorName = this.patientDetail.doctorname
      this.DepartmentName = this.patientDetail.departmentName
      this.AgeYear = this.patientDetail.ageYear
      this.Doctorname = this.patientDetail.doctorname
      this.vOPIPId = this.patientDetail.visitId;
      this.vTariffId = this.patientDetail.tariffId;
      this.vhospitalId = this.patientDetail.hospitalId;
      this.vClassId = this.patientDetail.classId
      this.RegNo = this.patientDetail.regNo

      this.getLastVisitDoctorList(this.patientDetail.regId)
      this.getLastAdmissionDoctorList(this.patientDetail.regId)
    }
  }

  selection = new SelectionModel<any>(true, []); // true = multi-select

  // Whether the number of selected elements matches the total number of (enabled) rows
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const enabledRows = this.visitdataSource.data.filter(row => !row.disabled);
    return numSelected === enabledRows.length && enabledRows.length > 0;
  }

  // Whether some but not all rows are selected (for indeterminate state)
  isSomeSelected(): boolean {
    return this.selection.hasValue() && !this.isAllSelected();
  }

  // Selects all rows if not all selected; otherwise clears selection
  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.visitdataSource.data
        .filter(row => !row.disabled)
        .forEach(row => this.selection.select(row));
    }
  }

  areAllRowsDisabled(): boolean {
    return this.visitdataSource.data.every(row => row.disabled);
  }

  onCheckboxChange(contact: any, checked: boolean): void {
    // Clear previously selected row
    this.selection.clear();

    if (!checked) {
      return;
    }

    // Select only the current row
    this.selection.select(contact);

    if ((contact?.abhaTranId ?? 0) > 0) {
      this._abhaIntegrationService.getAbhaById(contact.abhaTranId).subscribe((response) => {
        console.log('Get ABHA DATA', response);
        this.abhaNumber = response.abhaNumber;
        this.abhaAddress = response.abhaAddress;
        this.abhaId = response.abhaTranId;
        this.DOB = response.yearOfBirth
      });
    }
  }

  getLastVisitDoctorList(regId) {
    const vdata = {
      "first": 0,
      "rows": 9999,
      "sortField": "RegId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "RegId",
          "fieldValue": String(regId),//"140306", //
          "opType": "Equals"
        }
      ],
      "Columns": [],
      "exportType": "JSON"
    }
    this._abhaIntegrationService.getLastVisitDoctorList(vdata).subscribe(data => {
      this.visitdataSource.data = data.data as abhaRegInsert[]
    })
  }


  selection1 = new SelectionModel<any>(true, []); // true = multi-select

  // Whether the number of selected elements matches the total number of (enabled) rows
  isAllSelected1(): boolean {
    const numSelected = this.selection1.selected.length;
    const enabledRows = this.admissiondataSource.data.filter(row => !row.disabled);
    return numSelected === enabledRows.length && enabledRows.length > 0;
  }

  // Whether some but not all rows are selected (for indeterminate state)
  isSomeSelected1(): boolean {
    return this.selection1.hasValue() && !this.isAllSelected();
  }

  // Selects all rows if not all selected; otherwise clears selection
  masterToggle1(): void {
    if (this.isAllSelected()) {
      this.selection1.clear();
    } else {
      this.admissiondataSource.data
        .filter(row => !row.disabled)
        .forEach(row => this.selection1.select(row));
    }
  }

  areAllRowsDisabled1(): boolean {
    return this.admissiondataSource.data.every(row => row.disabled);
  }

  getLastAdmissionDoctorList(regId) {
    const vdata = {
      "first": 0,
      "rows": 9999,
      "sortField": "AdmissionID",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "RegId",
          "fieldValue": String(regId),//"140436", 
          "opType": "Equals"
        }
      ],
      "Columns": [],
      "exportType": "JSON"
    }
    this._abhaIntegrationService.getLastAdmissionDoctorList(vdata).subscribe(data => {
      this.admissiondataSource.data = data.data as abhaRegInsert[]
    })
  }

  //  loader code

  isProgressDialogOpen = false;
  encounterStatus: 'pending' | 'inprogress' | 'completed' | 'failed' = 'pending';
  waitStatus: 'pending' | 'inprogress' | 'completed' = 'pending';
  careContextStatus: 'pending' | 'inprogress' | 'completed' | 'failed' = 'pending';

  encounterResponse: any;
  countdown = 0;
  countdownInterval: any;

  GetPatientEncounterDetails() {
    this.isProgressDialogOpen = true;
    this.encounterStatus = 'inprogress';
    this.waitStatus = 'pending';
    this.careContextStatus = 'pending';
    this.countdown = 0;

    const selectedVisit = this.selection.selected[0];

    const getData = {
      abhaNumber: String(this.abhaNumber), //'91-7464-3370-2840', //
      abhaAddress: String(this.abhaAddress), //'91746433702840@sbx', //
      hipId: 'AIRMIDABHA',
      OpIpId: String(selectedVisit.visitId), //"536228", //
      opIpType: "0"
    };

    this._abhaIntegrationService.pushAbhaEncounterDet(getData).subscribe({
      next: (response: any) => {
        console.log('Patient Encounter Details:', response);
        this.encounterResponse = response;
      },
      error: (error) => {
        console.error('Patient Encounter API Error:', error);
        this.encounterStatus = 'failed';
      },
      complete: () => {
        // 1st API completed
        this.encounterStatus = 'completed';
        // Start 1 minute wait
        this.startOneMinuteWait();
      }
    });
  }
  startOneMinuteWait() {
    this.waitStatus = 'inprogress';
    this.countdown = 60;
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.countdown = 0;
        // 1 minute completed
        this.waitStatus = 'completed';
        // Call 2nd API
        this.GetCarecontextDetails(this.encounterResponse);
      }
    }, 1000);
  }


  GetCarecontextDetails(response: any) {
    debugger
    this.careContextStatus = 'inprogress';
    const getData = {
      abhaId: String(this.abhaId), //"string", //
      abhaNumber: String(this.abhaNumber), //'91-7464-3370-2840', //
      patientReferenceNumber:
        response[0]?.patientReferenceNumber || '00000',
      yearOfBirth: String(this.DOB),//'2003-05-01 00:00:00.00'
      careContexts: [
        {
          referenceNumber: response[0]?.careContexts[0],
          comment: "string"
        }
      ],
      hipId: response[0]?.hipId
    };

    this._abhaIntegrationService.pushAbhaLinkCare(getData).subscribe({
      next: (response: any) => {
        console.log('Care Context Details:', response);
      },
      error: (error) => {
        console.error('Care Context API Error:', error);
        this.careContextStatus = 'failed';
      },
      complete: () => {
        this.careContextStatus = 'completed';
      }
    });
  }
  closeProgressDialog() {
    this.isProgressDialogOpen = false;
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}
