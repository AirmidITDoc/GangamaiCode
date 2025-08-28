import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSliderChange } from '@angular/material/slider';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { BedTransferComponent } from 'app/main/ipd/ip-search-list/bed-transfer/bed-transfer.component';
import { DischargeSummaryComponent } from 'app/main/ipd/ip-search-list/discharge-summary/discharge-summary.component';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DoctornoteComponent } from '../doctornote/doctornote.component';
import { NursingnoteComponent } from '../nursingnote/nursingnote.component';
import { NewPrescriptionComponent } from '../prescription/new-prescription/new-prescription.component';
import { NewRequestforlabComponent } from '../requestforlabtest/new-requestforlab/new-requestforlab.component';
import { ClinicalCareChartService } from './clinical-care-chart.service';
import { MedicationErrorComponent } from './medication-error/medication-error.component';
import { PhlebitisScoreComponent } from './phlebitis-score/phlebitis-score.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';

@Component({
  selector: 'app-clinical-care-chart',
  templateUrl: './clinical-care-chart.component.html',
  styleUrls: ['./clinical-care-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ClinicalCareChartComponent implements OnInit {
  displayedColumns: string[] = [
    'patientId',
    'PatientName'
  ]
  displayedPainAsse: string[] = [
    'givendate',
    'giventime',
    'PainAssess',
    'Employeename',
    'Action'
  ]
  displayedPainAsse2: string[] = [
    'givendate',
    'Employeename',
    'PainAssess',
    'Action'
  ]
  displayedLabReport: string[] = [
    'Date&Time',
    'TestName',
    'PBillNo',
    'IsCompleted'
  ]
  // displayedIpPrescription: string[] = [
  //   'AdmDate', 
  //   'PresDate',
  //   'StoreName',
  //   'CompanyName',
  //   'Action'
  // ]
  // displayedIpPrescriptionDetail: string[] = [
  //   'Status', 
  //   'ItemName',
  //   'Qty'
  // ]

  displayedLabRequest: string[] = [
    'ReqDate',
    'ReqTime',
    'WardName',
    'RequestType',
    'IsonFileTest'
  ]
  displayedLabRequestDetail: string[] = [
    'isBillingStatus',
    'isTestStatus',
    'ServiceName',
    'AddedBy',
    'AddBillUser',
    'BillDateTime',
    'PBillNo'
  ]

  displayedVitals: string[] = [
    'date',
    'time',
    'Temperature',
    'Pulse',
    'Respiration',
    'BP',
    'MewaScore',
    'AVPU',
    'TakenBy',
    'CVP',
    'Action'
  ]
  displayedInOutput: string[] = [
    'Date',
    'Time',
    'IV',
    'Infusions',
    'Boluses',
    'Peroral',
    'Perrt',
    'Perjt',
    'IntakeOther',
    'Urine',
    'Drange',
    'Action'
  ]
  displayedOxygen: string[] = [
    'Date',
    'Time',
    'IV',
    'Infusions',
    'Boluses',
    'Peroral',
    'Perrt',
    'Perjt',
    'IntakeOther',
    'Urine',
    'Drange',
    'Action'
  ]
  displayedSugar: string[] = [
    'Date',
    'Time',
    'IV',
    'Infusions',
    'Boluses',
    'Peroral',
    'Action'
  ]
  isLoading: String = '';
  sIsLoading: string = "";
  WardList: any = [];
  isRegIdSelected: boolean = false;
  //screenFromString:'fromdate-form';
  screenFromString1 = 'admission-form';
  screenFromString = 'admission-form';
  dateTimeObj: any;
  isWardNameSelected: boolean = false;
  wardListfilteredOptions: Observable<string[]>;
  vWardId: any;
  checkDailyWeight: boolean = false;
  vDepartmentName: any;
  vpatientName: any;
  vDoctorname: any;
  vAgeYear: any;
  vAgeDay: any;
  vAgeMonth: any;
  vRegNo: any;
  vDailyWeight: any;
  painLevel: any;
  additionalNotes: any;
  painLocation: any;

  autocompleteward: string = "Room";
  currentDate = new Date();

  dsClinicalcarePatient = new MatTableDataSource<PatientList>();
  dsPainsAssessment = new MatTableDataSource<PainAssesList>();
  dsPainsAssessment2 = new MatTableDataSource<PainAssesList>();
  dsLabReport = new MatTableDataSource<PainAssesList>();
  // dsIpPrescription=new MatTableDataSource<PainAssesList>();
  // dsIpPrescriptionDetail=new MatTableDataSource<PainAssesList>();
  dsLabRequest = new MatTableDataSource<PainAssesList>();
  dsLabRequestDetail = new MatTableDataSource<PainAssesList>();
  dsvitalsList = new MatTableDataSource<VitalsList>();
  dsInputOutTable = new MatTableDataSource<INputOutputList>();
  dsOxygenTable = new MatTableDataSource<INputOutputList>();
  dsSugarTable = new MatTableDataSource<INputOutputList>();


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('wardpaginator', { static: true }) public wardpaginator: MatPaginator;
  @ViewChild('Outputpaginator', { static: true }) public Outputpaginator: MatPaginator;

  constructor(
    public _ClinicalcareService: ClinicalCareChartService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private commonService: PrintserviceService,
    private advanceDataStored: AdvanceDataStored
  ) { }

  ngOnInit(): void {
    this.getPatientListwardWise();

    // only for calling
    this.getpainAssesmentList();
    this.getpainAssesmentWeightList();

  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getSelectedObjReg() {

  }
  selectedPainLevel: number;
  onSliderChange(event: MatSliderChange) {
    this.selectedPainLevel = event.value;
    console.log(this.selectedPainLevel)
  }
  getEmoji(painLevel: number): string {
    // Map pain levels to corresponding emojis
    const emojiMap = {
      0: '&#x1F600;', // Neutral face
      1: '&#x1F600;', // Slightly frowning face
      2: '&#x1F60A;',
      3: '&#x1F60A;',
      4: '&#x1F641;',
      5: '&#x1F641;',
      6: '&#x1F612;',
      7: '&#x1F612;',
      8: '&#x1F620;',
      9: '&#x1F620;',
      10: '&#x1F629;' // Loudly crying face
    };

    return emojiMap[painLevel];
  }
  public setFocus(nextElementId): void {
    document.querySelector<HTMLInputElement>(`#${nextElementId}`)?.focus();
  }


  ///////////////////// main patient list ///////////////////////
  @ViewChild('grid5') grid5: AirmidTableComponent;
  gridConfig5: gridModel = new gridModel();
  pname = "%"
  wardid = '0'
  doctorid = '0'
  getPatientListwardWise() {
    this.gridConfig5 = {
      apiUrl: "ClinicalCare/AdmisionListNursingList",
      columnsList: [
        { heading: "Bed", key: "bedName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
      ],
      sortField: "RegNo",
      sortOrder: 0,
      filters: [
        { fieldName: "PatientName", fieldValue: this.pname, opType: OperatorComparer.Equals },
        { fieldName: "WardId", fieldValue: this.wardid, opType: OperatorComparer.Equals },
        { fieldName: "DoctorId", fieldValue: this.doctorid, opType: OperatorComparer.Equals }
      ]
    }
    setTimeout(() => {
      this.grid5.gridConfig = this.gridConfig5;
      this.grid5.bindGridData();
    });
  }

  onChangeFirst() {
    this.pname = this._ClinicalcareService.MyForm.get('PatientName').value + '%'
    if (!this.wardid) {
      this.wardid = "0";
    }
    this.getPatientListwardWise();
  }

  getSelectedObjward(value) {
    if (value.value !== 0)
      this.wardid = value.value
    else
      this.wardid = "0"
    this.onChangeFirst();
  }

  Clearfilter(event) {
    if (event == 'PatientName')
      this._ClinicalcareService.MyForm.get('PatientName').setValue("")
    this.onChangeFirst();
  }

  //   getPatientListwardWise() {
  //     var vdata = 	{
  // 	  "first": 0,
  // 	  "rows": 10,
  // 	  "sortField": "RegNo",
  // 	  "sortOrder": 0,
  // 	  "filters": [
  // 	    {
  // 	      "fieldName": "PatientName",
  // 	      "fieldValue": "%",
  // 	      "opType": "Contains"
  // 	    },
  // 	  {
  // 	      "fieldName": "WardId",
  // 	      "fieldValue": "0",
  // 	      "opType": "Contains"
  // 	    },
  // 	  {
  // 	      "fieldName": "DoctorId",
  // 	      "fieldValue": "0",
  // 	      "opType": "Contains"
  // 	    }
  // 	  ],
  // 	  "exportType": "JSON",
  // 	  "columns": []
  // }
  //     console.log(vdata)
  //     this._ClinicalcareService.getPatientList(vdata).subscribe((data) => {
  //       this.dsClinicalcarePatient.data = data as PatientList[];
  //       this.dsClinicalcarePatient.sort = this.sort;
  //       this.dsClinicalcarePatient.paginator = this.wardpaginator;
  //       console.log(this.dsClinicalcarePatient.data);
  //     });
  //   }
  registerObj: any;
  vAdmission: any;
  getpatientDet(obj) {
    console.log(obj)
    this.registerObj = obj;
    this.vpatientName = obj.patientName;
    this.vDoctorname = obj.doctorName;
    this.vAgeYear = obj.ageYear;
    this.vDepartmentName = obj.departmentName
    this.vAgeMonth = obj.ageMonth;
    this.vAgeDay = obj.ageDay;
    this.vRegNo = obj.regNo;
    this.vAdmission = this.registerObj.admissionID

    // this.gettestList();
    // this.getPrescriptionList();
    // this.getRequesttList();
    this.getpainAssesmentList();
    this.getpainAssesmentWeightList();
    // this.getRtrvVitallist();
    // this.getRtrvSugarlevellist();
    // this.getRtrvOxygenlist();
  }
  //////////////////////////////////////// main patient list end ////////////////////////////////////////

  //////////////////////////////////////// Pain Asissgment list ////////////////////////////////////////
  @ViewChild('grid6') grid6: AirmidTableComponent;
  gridConfig6: gridModel = new gridModel();
  columns6 = [
    { heading: "PainAssessmentDate", key: "bedName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Pain Assessment", key: "painAss", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "AddedBy", key: "addedBy", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Action", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
  ]

  getpainAssesmentList() {
    const admid = this.vAdmission ?? 0
    this.gridConfig6 = {
      apiUrl: "ClinicalCare/NursingPainAssessmentList",
      columnsList: this.columns6,
      sortField: "AdmissionId",
      sortOrder: 0,
      filters: [
        { fieldName: "AdmissionId", fieldValue: String(admid), opType: OperatorComparer.Equals }
      ]
    }
    setTimeout(() => {
     this.grid6.gridConfig = this.gridConfig6;
    this.grid6.bindGridData(); 
    });
  }

  //////////////////////////////////////// Pain Asissgment list end////////////////////////////////////////

  //////////////////////////////////////// Pain Asissgment weight list ////////////////////////////////////////
  PainList: any = [];

  getpainAssesmentWeightList() {
    const admid = this.vAdmission ?? 0
    var vdata = {
      "first": 0,
      "rows": 10,
      "sortField": "AdmissionId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "AdmissionId",
          "fieldValue": String(admid),
          "opType": "Contains"
        }
      ],
      "exportType": "JSON",
      "columns": []
    }
    console.log(vdata);
    this._ClinicalcareService.getpainAssesmentWeightList(vdata).subscribe(data => {
      if (data) {
        this.dsPainsAssessment2.data = data as PainAssesList[];
        this.checkDailyWeight = true;
        console.log(this.dsPainsAssessment2.data);
      } else {
        this.checkDailyWeight = false;
      }
    })
  }

  OnAdd() {
    if (this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    }
    this.vDailyWeight=this._ClinicalcareService.PainAssessForm.get('DailyWeight').value
    if (this.vDailyWeight == 0 || this.vDailyWeight == '' || this.vDailyWeight == null || this.vDailyWeight == undefined) {
      this.toastr.warning('Please enter weight', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    } 
    this.checkDailyWeight = true;
    this.PainList.push(
      {
        givendate: this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
        giventime: this.datePipe.transform(this.currentDate, 'shortTime'),
        Employeename: this.vpatientName,
        PainAssess: this.vDailyWeight
      });
    this.dsPainsAssessment2.data = this.PainList;
    this.vDailyWeight = '';
  }

  deleteTableRow(element) {
    let index = this.PainList.indexOf(element);
    if (index >= 0) {
      this.PainList.splice(index, 1);
      this.dsPainsAssessment2.data = [];
      this.dsPainsAssessment2.data = this.PainList;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
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
    
  //////////////////////////////////////// Pain Asissgment weight list end ////////////////////////////////////////

  getDoctornote() {
    if (this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    }
    this.advanceDataStored.storage = new AdmissionPersonlModel(this.registerObj);
    const dialogRef = this._matDialog.open(DoctornoteComponent,
      {
        maxWidth: "100%",
        height: '90%',
        width: '90%',
        data: {
          Obj: this.registerObj
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
  getNursingnote() {
    if (this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    }
    this.advanceDataStored.storage = new AdmissionPersonlModel(this.registerObj);
    const dialogRef = this._matDialog.open(NursingnoteComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '90%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
  getDischargeSummary() {
    if (this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    }
    this.advanceDataStored.storage = new AdmissionPersonlModel(this.registerObj);
    const dialogRef = this._matDialog.open(DischargeSummaryComponent,
      {
        maxWidth: "100%",
        height: '90%',
        width: '90%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }

  //////////////////////// Ip Prescription start////////////////////////

  gridConfig1: gridModel = new gridModel();
  regNo1: any = ""
  @ViewChild('grid') grid: AirmidTableComponent;
  @ViewChild('grid1') grid1: AirmidTableComponent;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  isShowDetailTable: boolean = false;

  getPriscription() {
    if (this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    }
    this.advanceDataStored.storage = new AdmissionPersonlModel(this.registerObj);
    const dialogRef = this._matDialog.open(NewPrescriptionComponent,
      {
        maxWidth: "100%",
        height: '90%',
        width: '90%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }

  allColumns1 = [
    { heading: "Admission Date", key: "vst_Adm_Date", sort: true, align: 'left', emptySign: 'NA', width: 170 },
    { heading: "Prescription Date", key: "ptime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 180 },
    // { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 90 },
    // { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Store Name", key: "storeName", sort: true, align: 'left', emptySign: 'NA', width: 170 },
    // { heading: "Class Name", key: "className", sort: true, align: 'left', emptySign: 'NA', width: 170 },
    // { heading: "Ward Name", key: "wardName", sort: true, align: 'left', emptySign: 'NA', width: 170 },
    { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 170 },
    // { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA', width: 170 },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action,
      actions: [
        {
          action: gridActions.print, callback: (data: any) => {
            this.viewgetIpprescriptionReportPdf(data);
          }
        }]
    }
  ]

  allFilters1 = [
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    { fieldName: "Reg_No", fieldValue: this.regNo1, opType: OperatorComparer.Equals }
  ]

  gridConfig: gridModel = {
    apiUrl: this.regNo1 ? "IPPrescription/PrescriptionPatientList" : "",
    columnsList: this.allColumns1,
    sortField: "RegNo",
    sortOrder: 0,
    filters: this.allFilters1
  }

  GetDetails1(data: any): void {
    console.log("detailList:", data)
    let ipMedID = data.ipMedID;

    this.gridConfig1 = {
      apiUrl: "IPPrescription/PrescriptionDetailList",
      columnsList: [
        { heading: "Status", key: "isClosed", type: gridColumnTypes.status, align: "center" },
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA' },
      ],
      sortField: "ipMedID",
      sortOrder: 0,
      filters: [
        { fieldName: "ipMedID", fieldValue: String(ipMedID), opType: OperatorComparer.Equals },
      ]
    };
    this.isShowDetailTable = true;
    setTimeout(() => {
      this.grid1.gridConfig = this.gridConfig1;
      this.grid1.bindGridData();
    }, 500);
  }

  viewgetIpprescriptionReportPdf(response) {
    console.log(response)
    setTimeout(() => {
      let param = {
        "searchFields": [
          {
            "fieldName": "OP_IP_ID",
            "fieldValue": String(response.ipMedID),
            "opType": "Equals"
          },
          {
            "fieldName": "PatientType",
            "fieldValue": "1",
            "opType": "Equals"
          }
        ],
        "mode": "NurIPprescriptionReport"
      }
      this._ClinicalcareService.getReportView(param).subscribe(res => {

        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Nursing Prescription" + " " + "Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
        });
      });
    }, 100);
  }

  //////////////////////// Ip Prescription end////////////////////////

  getbedTransfer() {
    if (this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    }
    this.advanceDataStored.storage = new AdmissionPersonlModel(this.registerObj);
    //  this._IpSearchListService.populateForm(this.registerObj); 
    const dialogRef = this._matDialog.open(BedTransferComponent,
      {
        maxWidth: "100%",
        height: '90%',
        width: '90%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }

  //////////////////////// Lab Request start////////////////////////
  gridConfig3: gridModel = new gridModel();
  regNo2: any = ""
  @ViewChild('grid2') grid2: AirmidTableComponent;
  @ViewChild('grid3') grid3: AirmidTableComponent;
  fromDate2 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate2 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  isShowDetailTable2: boolean = false;

  allColumns2 = [
    { heading: "Request Date", key: "reqTime", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 8 },
    // { heading: "Admission Date", key: "admDate", sort: true, align: 'left', emptySign: 'NA', width: 100},
    // { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    // { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "WardName", key: "wardName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    // { heading: "BedName", key: "bedName", sort: true, align: 'left', emptySign: 'NA', width: 100  },
    { heading: "RequestType", key: "requestType", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "IsOnFileTest", key: "isOnFileTest", type: gridColumnTypes.status, align: "center" },
  ]
  allFilters2 = [
    { fieldName: "FromDate", fieldValue: this.fromDate2, opType: OperatorComparer.Equals },
    { fieldName: "ToDate", fieldValue: this.toDate2, opType: OperatorComparer.Equals },
    { fieldName: "Reg_No", fieldValue: this.regNo2, opType: OperatorComparer.Equals }
  ]

  gridConfig2: gridModel = {
    apiUrl: this.regNo2 ? "IPPrescription/LabRadRequestList" : "",
    columnsList: this.allColumns2,
    sortField: "RegNo",
    sortOrder: 0,
    filters: this.allFilters2
  }

  getSelectedRow(row: any): void {

    console.log("Selected row : ", row);
    let vRequestId = row.requestId

    this.gridConfig3 = {
      apiUrl: "IPPrescription/LabRadRequestDetailList",
      columnsList: [

        { heading: "IsBillingStatus", key: "isStatus", type: gridColumnTypes.status, align: "center" },
        { heading: "IsTestStatus", key: "isTestCompleted", type: gridColumnTypes.status, align: "center" },
        // { heading: "ReqDate", key: "reqDate", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "ReqTime", key: "reqTime", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "ServiceName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "AddedBy", key: "addedByName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Add Billing User", key: "billingUser", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "BillDateTime", key: "addedByDate", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "PBill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
      ],
      sortField: "RequestId",
      sortOrder: 0,
      filters: [
        { fieldName: "RequestId", fieldValue: String(vRequestId), opType: OperatorComparer.Equals }
      ]
    }
    this.isShowDetailTable2 = true;

    setTimeout(() => {
      this.grid3.gridConfig = this.gridConfig3;
      this.grid3.bindGridData();
    });
  }

  viewLabRequestPdf(data) {
    this.commonService.Onprint("RequestId", data.requestId, "NurLabRequestTest");
  }

  getLabRequest() {
    if (this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    }
    this.advanceDataStored.storage = new AdmissionPersonlModel(this.registerObj);
    const dialogRef = this._matDialog.open(NewRequestforlabComponent,
      {
        maxWidth: "100%",
        height: '90%',
        width: '90%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
  //////////////////////// Lab Request end////////////////////////
  getPhlebitis() {
    if (this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    }
    this.advanceDataStored.storage = new AdmissionPersonlModel(this.registerObj);
    const dialogRef = this._matDialog.open(PhlebitisScoreComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '90%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
  getMedicationReport() {
    if (this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    }
    this.advanceDataStored.storage = new AdmissionPersonlModel(this.registerObj);
    const dialogRef = this._matDialog.open(MedicationErrorComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '90%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
}
export class PatientList {
  DoctorName: any;
  AgeYear: any;
  PatientName: string;
  DepartmentName: string;
  RegNo: any;

  constructor(PatientList) {
    {

      this.DoctorName = PatientList.DoctorName || 0;
      this.PatientName = PatientList.PatientName || "";
      this.DepartmentName = PatientList.DepartmentName || "";
      this.AgeYear = PatientList.AgeYear || 0;
    }
  }
}
export class PainAssesList {
  givendate: any;
  giventime: any;
  PainAssess: any;
  Employeename: string;

  constructor(PainAssesList) {
    {

      this.givendate = PainAssesList.givendate || 0;
      this.giventime = PainAssesList.giventime || 0;
      this.PainAssess = PainAssesList.PainAssess || 0;
      this.Employeename = PainAssesList.Employeename || "";
    }
  }
}
export class VitalsList {
  date: any;
  time: any;
  Temperature: any;
  Pulse: any;
  Respiration: any;
  PainAssess: any;
  BP: any;
  MewaScore: any;
  AVPU: any;
  TakenBy: any;
  CVP: any;
  constructor(VitalsList) {
    {

      this.date = VitalsList.date || 0;
      this.time = VitalsList.time || 0;
      this.Temperature = VitalsList.Temperature || 0;
      this.Pulse = VitalsList.Pulse || 0;
      this.Respiration = VitalsList.Respiration || 0;
      this.Temperature = VitalsList.Temperature || 0;
      this.BP = VitalsList.BP || 0;
      this.MewaScore = VitalsList.MewaScore || 0;
      this.AVPU = VitalsList.AVPU || 0;
      this.TakenBy = VitalsList.TakenBy || 0;
      this.CVP = VitalsList.CVP || 0;
    }
  }
}
export class INputOutputList {
  date: any;
  time: any;
  Temperature: any;
  Pulse: any;
  Respiration: any;
  PainAssess: any;
  BP: any;
  MewaScore: any;
  AVPU: any;
  TakenBy: any;
  CVP: any;
  constructor(INputOutputList) {
    {

      this.date = INputOutputList.date || 0;
      this.time = INputOutputList.time || 0;
      this.Temperature = INputOutputList.Temperature || 0;
      this.Pulse = INputOutputList.Pulse || 0;
      this.Respiration = INputOutputList.Respiration || 0;
      this.Temperature = INputOutputList.Temperature || 0;
      this.BP = INputOutputList.BP || 0;
      this.MewaScore = INputOutputList.MewaScore || 0;
      this.AVPU = INputOutputList.AVPU || 0;
      this.TakenBy = INputOutputList.TakenBy || 0;
      this.CVP = INputOutputList.CVP || 0;
    }
  }
}

