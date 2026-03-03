import { Component, EventEmitter, Inject, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
// import { OPIPPatientModel } from 'app/main/nursingstation/patient-vist/patient-vist.component';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { OPIPPatientModel } from 'app/main/ipd/ipdsearc-patienth/ipdsearc-patienth.component';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MrdService } from '../../mrd.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { MrdDetailsService } from '../mrd-details.service';
import { ToastrService } from 'ngx-toastr';
import { RegInsert } from 'app/main/opd/registration/registration.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { AdmissionPersonl } from 'app/main/Lab Management/lab-result-list/lab-result-list.component';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { EWOULDBLOCK } from 'constants';



@Component({
  selector: 'app-new-mrd',
  templateUrl: './new-mrd.component.html',
  styleUrls: ['./new-mrd.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewMrdComponent {

  NewMrdForm: FormGroup
  myFilterform: FormGroup

  dateTimeString: any;
  rmdrecordId = 0
  RegId1 = "0";
  registerObj = new AdmissionPersonlModel({});
  PatientName: any
  OPIPID = 0

  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
  isDatePckrDisabled: boolean = false;
  isTimeChanged: boolean = false;
  minDate: Date;
  timeflag = 0;
  screenFromString = 'Common-form';
  date: string;
  autocompleteModeunit: string = "Hospital";
  autocompleteModedeptdoc: string = "ConDoctor";


  f_name: any = "%"
  regNo: any = "0"
  l_name: any = "%"
  m_name: any = "%"
  IPDNo: any = "0"
  status = "0"
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('DischargeGrid', { static: false }) discgrid: AirmidTableComponent;

  @ViewChild('mrdInFileStatus') mrdInFileStatus!: TemplateRef<any>;
  // @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  ngAfterViewInit() {

    // this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'mrdInFileStatus')!.template = this.mrdInFileStatus;
  }
  allcolumns = [
    { heading: "DOA", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 170 },
    { heading: "IPD No", key: "ipdno", sort: true, align: 'left', emptySign: 'NA', width: 100 },

    { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Doctor Name", key: "doctorname", sort: true, align: 'left', emptySign: 'NA', width: 180 },
    { heading: "MRD-InFileStatus", key: "mrdInFileStatus", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 150 },
    // {
    //     heading: "Action", key: "action", align: "right", type: gridColumnTypes.template, width: 200,
    //     template: this.actionButtonTemplate  // Assign ng-template to the column
    // }

  ];


  gridConfig: gridModel = {
    // permissionCode: permissionCodes.Admission,
    apiUrl: "Admission/AdmissionList",
    columnsList: this.allcolumns,
    sortField: "AdmissionId",
    sortOrder: 1,
    filters: [
      { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
      { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
      { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "Doctor_Id", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "Admtd_Dschrgd_All", fieldValue: "1", opType: OperatorComparer.Equals },
      { fieldName: "M_Name", fieldValue: "%", opType: OperatorComparer.Contains },
      { fieldName: "IPNo", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "Id", fieldValue: "0", opType: OperatorComparer.Equals },
    ],
    row: 25
  }
  constructor(private _fuseSidebarService: FuseSidebarService,
    public _MrdService: MrdDetailsService,
    public formBuilder: UntypedFormBuilder,
    public _matDialog: MatDialog, private _FormvalidationserviceService: FormvalidationserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AuthenticationService,
    private advanceDataStored: AdvanceDataStored, public toastr: ToastrService,
    public dialogRef: MatDialogRef<NewMrdComponent>,
    public datePipe: DatePipe) {

    let mydate = new Date()
    this.date = (this.datePipe.transform(new Date(), "MM-dd-YYYY hh:mm tt"));

    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.date = now.toISOString().slice(0, 16);
  }

  ngOnInit(): void {
    this.myFilterform = this._MrdService.filterdischargeForm();

    this.NewMrdForm = this.createMrdForm();

    if (this.data) {
      console.log(this.data)
      this.rmdrecordId = this.data.rmdRecordId
      this.OPIPID = this.data.opipid
      this.NewMrdForm.patchValue(this.data)
    }

  }

  createSearchForm() {
    return this.formBuilder.group({
      RegId: 0,
      AppointmentDate: [(new Date()).toISOString()],
    });
  }



  createMrdForm() {

    return this.formBuilder.group({
      rmdrecordId: this.rmdrecordId,
      recievedDate: [(new Date()).toISOString()],
      recievedTime: [(new Date()).toISOString()],
      unitId: [this.accountService.currentUserValue.user.unitId, Validators.required],
      opipid: [this.OPIPID, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      mrdno: [''],
      location: ['', Validators.required],
      isInOut: [false, Validators.required],
      outFileId: '0',
      comments: ['']
    });
  }

  getSelectedRow(row: any): void {

    if (row.mrdInFileStatus) {
      this.toastr.error('Selected Patinet File Already Received.', 'Save !', {
        toastClass: 'tostr-tost custom-toast-success',
      });

      var now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      this.date = now.toISOString().slice(0, 16);

    } else {
      console.log("Selected row : ", row);
      this.registerObj = row;
      this.OPIPID = this.registerObj.admissionId
    }
  }


  onChangeFirst() {
    debugger
    this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || "1900-01-01"
    this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd") || "1900-01-01"

    this.f_name = this.myFilterform.get('FirstName').value + "%"
    this.l_name = this.myFilterform.get('LastName').value + "%"
    this.regNo = this.myFilterform.get('RegNo').value || "0"
    this.m_name = this.myFilterform.get('MiddleName').value + "%"
    this.IPDNo = this.myFilterform.get('IPDNo').value || "0"

    this.getfilterdata();
  }

  getchangeDate() {

    this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || "1900-01-01"
    this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd") || "1900-01-01"

    this.f_name = this.myFilterform.get('FirstName').value + "%"
    this.l_name = this.myFilterform.get('LastName').value + "%"
    this.regNo = this.myFilterform.get('RegNo').value || "0"
    this.m_name = this.myFilterform.get('MiddleName').value + "%"
    this.IPDNo = this.myFilterform.get('IPDNo').value || "0"
    this.getfilterdata();
  }
  getfilterdata() {
    // debugger
    this.gridConfig = {
      apiUrl: "Admission/AdmissionDischargeList",
      columnsList: this.allcolumns,
      sortField: "AdmissionId",
      sortOrder: 0,
      filters: [
        { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
        { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
        { fieldName: "Doctor_Id", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Admtd_Dschrgd_All", fieldValue: this.status, opType: OperatorComparer.Equals },
        { fieldName: "M_Name", fieldValue: this.m_name, opType: OperatorComparer.Equals },
        { fieldName: "IPNo", fieldValue: this.IPDNo, opType: OperatorComparer.Equals }

      ],
      row: 25
    }
    this.discgrid.gridConfig = this.gridConfig;
    this.discgrid.bindGridData();


  }


  Clearfilter(event) {
    console.log(event)
    if (event == 'FirstName')
      this.myFilterform.get('FirstName').setValue("")
    else
      if (event == 'LastName')
        this.myFilterform.get('LastName').setValue("")
      else
        if (event == 'MiddleName')
          this.myFilterform.get('MiddleName').setValue("")
    if (event == 'RegNo')
      this.myFilterform.get('RegNo').setValue("")
    if (event == 'IPDNo')
      this.myFilterform.get('IPDNo').setValue("")

    this.onChangeFirst();
  }

  onSubmit() {
    debugger

    this.NewMrdForm.get('opipid').setValue(this.OPIPID)

    this.NewMrdForm.get('recievedDate').setValue(this.datePipe.transform(this.NewMrdForm.get('recievedDate').value, 'yyyy-MM-dd'))
    this.NewMrdForm.get('recievedTime').setValue(this.datePipe.transform(this.NewMrdForm.get('recievedDate').value, "yyyy-MM-dd hh:mm"))

    this.NewMrdForm.get('rmdrecordId').setValue(this.rmdrecordId)
    if (!this.NewMrdForm.invalid) {

      console.log(this.NewMrdForm.value)
      this._MrdService.MrdInsert(this.NewMrdForm.value).subscribe((response) => {

        this._matDialog.closeAll();
      });
    } else {
      let invalidFields = [];

      if (this.NewMrdForm.invalid) {
        for (const controlName in this.NewMrdForm.controls) {
          if (this.NewMrdForm.controls[controlName].invalid) {
            invalidFields.push(`MRD Info Form: ${controlName}`);
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


  pad(n: number) {
    return n < 10 ? '0' + n : n;
  }

  getValidationMessages() {
    return {
      opipid: [
        { name: "required", Message: "opipid is required" }
      ],
      mrdno: [
        { name: "required", Message: "mrdno is required" }
      ],
      location: [
        { name: "required", Message: "location is required" }
      ],
      policeStation: [
        { name: "required", Message: "policeStation is required" }
      ],
      UnitId: [
        { name: "required", Message: "policeStation is required" }
      ],
      searchDoctorId: [
        { name: "required", Message: "policeStation is required" }
      ],
      comments: [
        { name: "required", Message: "policeStation is required" }
      ],
    };
  }



  // public now: Date = new Date();
  // onChangeDate(value) {
  //   if (value) {
  //     const dateOfReg = new Date(value);
  //     let splitDate = dateOfReg.toLocaleString("en-US").split(',');
  //     let splitTime = this.NewMrdForm.get('recievedDate').value.toLocaleString("en-US").split(',');
  //     this.eventEmitForParent(splitDate[0], splitTime[1]);
  //   }
  // }

  // onChangeTime(event) {
  //   this.timeflag = 1
  //   if (event) {

  //     let selectedDate = new Date(this.NewMrdForm.get('recievedTime').value);
  //     let splitDate = selectedDate.toLocaleString("en-US").split(',');
  //     let splitTime = this.NewMrdForm.get('recievedTime').value.toLocaleString("en-US").split(',');
  //     this.isTimeChanged = true;
  //     // this.phdatetime = splitTime[1]
  //     // console.log(this.phdatetime)
  //     this.eventEmitForParent(splitDate[0], splitTime[1]);
  //   }
  // }

  // eventEmitForParent(actualDate, actualTime) {
  //   let localaDateValues = actualDate.split('/');
  //   let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
  //   this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  // }
  // dateTimeObj: any;
  // getDateTime(dateTimeObj) {
  //   console.log('dateTimeObj ==', dateTimeObj);
  //   this.dateTimeObj = dateTimeObj;
  // }
  onClose() {
    this.dialogRef.close();
  }
}


