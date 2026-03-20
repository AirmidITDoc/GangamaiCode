import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

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
    'PainAssess',
    'Employeename',
    'IsActive',
    'Action'
  ]
  displayedPainAsse2: string[] = [
    'givendate',
    'PainAssess',
    'IsActive',
    'Action'
  ]

  displayedVitals: string[] = [
    'date',
    'Temperature',
    'Pulse',
    'Respiration',
    'BP',
    'ArterialBP',
    'Peep',
    'Brady',
    'CVP',
    'PAPressureReading',
    'Apnea',
    'AbdominalGrith',
    'Desaturation',
    'SaturationWithO2',
    'SaturationWithoutO2',
    'PO2',
    'FIO2',
    'PFRation',
    'AddedBy',
    'IsActive',
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
    'TidolV',
    'SetRange',
    'IPAP',
    'MinuteV',
    'RateTotal',
    'EPAP',
    'Peep',
    'PC',
    'MVPercentage',
    'PrSup',
    'FIO2',
    'IE',
    'OxygenRate',
    'SaturationWithO2',
    'FlowTrigger',
    'CreatedBy',
    'IsActive',
    'Action'
  ]
  displayedSugar: string[] = [
    'Date',
    'BSL',
    'UrineSugar',
    'ETTpressure',
    'UrineKetone',
    'Bodies',
    'IntakeMode',
    'ReportedToRMO',
    'AddedBy',
    'IsActive',
    'Action'
  ]
  isLoading: string = '';
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
  dsvitalsList = new MatTableDataSource<VitalsList>();
  dsInputOutTable = new MatTableDataSource<INputOutputList>();
  dsOxygenTable = new MatTableDataSource<OxygenVentilatorlist>();
  dsSugarTable = new MatTableDataSource<SugarlevelList>();
  PainAssessForm: FormGroup;
  PainAssessWeightForm: FormGroup;
  VitalsForm: FormGroup;
  SugarForm: FormGroup;
  OxygenForm: FormGroup;
  // ApacheScoreForm: FormGroup;
  // InPutOutputForm: FormGroup;

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
    this.getReporttestList();
    this.getPrescriptionList();
    this.getLabRequesttList();
    this.getRtrvVitallist();
    this.getRtrvSugarlevellist();
    this.getRtrvOxygenlist();

    this.PainAssessForm = this._ClinicalcareService.createPainAssesForm()

    this.PainAssessWeightForm = this._ClinicalcareService.createPainAssesweightForm()

    this.VitalsForm = this._ClinicalcareService.createVitalsForm()
    this.VitalsForm.markAllAsTouched();

    this.SugarForm = this._ClinicalcareService.createSugarForm();
    this.SugarForm.markAllAsTouched();

    this.OxygenForm = this._ClinicalcareService.CreateOxygenForm();
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getSelectedObjReg() {

  }

  //////////////////////////////////////// smile slider start ////////////////////////////////////////
  selectedPainLevel: number;
  onSliderChange(value: number) {
    this.selectedPainLevel = value;
    console.log(this.selectedPainLevel);
  }
  getEmoji(painLevel: number): string {
    const emojiMap = {
      0: '&#x1F600;', // 😀 Grinning face (no pain / happy)
      1: '&#x1F642;', // 🙂 Slightly smiling (very mild discomfort)
      2: '&#x1F610;', // 😐 Neutral face
      3: '&#x1F610;', // 😐 Neutral face
      4: '&#x1F641;', // 🙁 Slightly frowning
      5: '&#x1F641;', // 🙁 Slightly frowning
      6: '&#x1F612;', // 😒 Unamused face
      7: '&#x1F61F;', // 😟 Worried face
      8: '&#x1F620;', // 😠 Angry face
      9: '&#x1F621;', // 😡 Pouting face
      10: '&#x1F629;' // 😩 Weary face (severe pain)
    };
    return emojiMap[painLevel];
  }
  public setFocus(nextElementId): void {
    document.querySelector<HTMLInputElement>(`#${nextElementId}`)?.focus();
  }
  //////////////////////////////////////// smile slider end ////////////////////////////////////////

  //////////////////////////////////////// main patient list ////////////////////////////////////////
  @ViewChild('grid5') grid5: AirmidTableComponent;
  gridConfig5: gridModel = new gridModel();
  pname = "%"
  wardid = '0'
  doctorid = '0'
  getPatientListwardWise() {
    this.gridConfig5 = {
      apiUrl: "ClinicalCare/AdmisionListNursingList",
      columnsList: [
        { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IPD No", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Ward Name", key: "roomName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Bed", key: "bedName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' },
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
    debugger
    this.pname = this._ClinicalcareService.MyForm.get('PatientName').value + '%'
    this.wardid = this._ClinicalcareService.MyForm.get('WardName').value

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

  registerObj: any;
  vAdmission: any;
  vipdNo: any;
  isShowPrintButtons: boolean = false;
  getpatientDet(obj) {
    console.log(obj)

    this.isShowPrintButtons = true
    this.painLevel = 0

    this.registerObj = obj;
    this.vpatientName = obj.patientName;
    this.vDoctorname = obj.doctorName;
    this.vAgeYear = obj.ageYear;
    this.vDepartmentName = obj.departmentName
    this.vAgeMonth = obj.ageMonth;
    this.vAgeDay = obj.ageDay;
    this.vRegNo = obj.regNo;
    this.vAdmission = this.registerObj.admissionID
    this.vipdNo = this.registerObj.ipdNo

    this.getReporttestList();
    this.isShowDetailTable = false;
    this.getPrescriptionList();
    this.isShowDetailTable2 = false;
    this.getLabRequesttList();
    this.getpainAssesmentList();
    this.getpainAssesmentWeightList();
    this.getRtrvVitallist();
    this.getRtrvSugarlevellist();
    this.getRtrvOxygenlist();
  }
  //////////////////////////////////////// main patient list end ////////////////////////////////////////

  //////////////////////////////////////// Pain Asissgment list ////////////////////////////////////////
  @ViewChild('grid6') grid6: AirmidTableComponent;
  gridConfig6: gridModel = new gridModel();
  PainsAssessmentlist: any = [];

  getpainAssesmentList() { //required from deleting
    const admid = this.vAdmission ?? 19000101
    const vdata = {
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
    this._ClinicalcareService.getpainAssesmentList(vdata).subscribe(data => {
      this.dsPainsAssessment.data = data.data as PainAssesList[];
      this.PainsAssessmentlist = data.data as PainAssesList[];
      console.log(this.dsPainsAssessment.data);
    })
  }

  PaindeleteTableRow(data) {
    Swal.fire({
      title: 'Do you want to delete  Pain Assessment?',
      text: "Please provide a reason for delete ",
      icon: "warning",
      input: 'text',
      inputPlaceholder: 'Enter delete  reason...',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
      preConfirm: (reason) => {
        if (!reason || reason.trim() === '') {
          Swal.showValidationMessage('Reason is required');
        }
        return reason;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const submitData = {
          painAssessmentId: data.painAssessmentId,
          isActive: true,
          reason: `User: ${this._loggedService.currentUserValue.userName}, Reason: ${result.value}`
        };
        console.log(submitData);
        this._ClinicalcareService.OnDeleteAssessment(submitData).subscribe((res) => {
          this.getpainAssesmentList();
        });
      }
    });
  }

  OnSavePainAsses() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    if (this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    }
    this.PainAssessForm.get('admissionId').setValue(this.vAdmission)
    this.PainAssessForm.get('painAssessementValue').setValue(this.selectedPainLevel)
    this.PainAssessForm.get('painAssessmentDate').setValue(formattedDate)
    if (!this.PainAssessForm.invalid) {
      console.log(this.PainAssessForm.value)
      this._ClinicalcareService.SavePainAssesment(this.PainAssessForm.value).subscribe((response) => {
        this.getpainAssesmentList();
      });
    } else {
      const invalidFields = [];
      if (this.PainAssessForm.invalid) {
        for (const controlName in this.PainAssessForm.controls) {
          if (this.PainAssessForm.controls[controlName].invalid) {
            invalidFields.push(`PainAssessment Form: ${controlName}`);
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

  //////////////////////////////////////// Pain Asissgment list end////////////////////////////////////////

  //////////////////////////////////////// Pain Asissgment weight list ////////////////////////////////////////
  PainList: any = [];

  getpainAssesmentWeightList() {
    const admid = this.vAdmission ?? 19001010
    const vdata = {
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
    this._ClinicalcareService.getpainAssesmentWeightList(vdata).subscribe(data => {
      if (data) {
        this.dsPainsAssessment2.data = data.data as PainAssesList[];
        this.checkDailyWeight = true;
        console.log(this.dsPainsAssessment2.data);
      } else {
        this.checkDailyWeight = false;
      }
    })
  }

  OnAddSave() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    if (this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    }
    this.vDailyWeight = this.PainAssessWeightForm.get('patWeightValue').value
    if (this.vDailyWeight == 0 || this.vDailyWeight == '' || this.vDailyWeight == null || this.vDailyWeight == undefined) {
      this.toastr.warning('Please enter weight', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    }

    if (this.vDailyWeight > 200) {
      this.toastr.warning('Weight cannot be greater than 200 kg', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return
    }

    this.checkDailyWeight = true;
    this.PainAssessWeightForm.get('admissionId').setValue(this.vAdmission)
    this.PainAssessWeightForm.get('patWeightDate').setValue(formattedDate)
    if (!this.PainAssessWeightForm.invalid) {
      console.log(this.PainAssessWeightForm.value)
      this._ClinicalcareService.SavePainAssesmentWeight(this.PainAssessWeightForm.value).subscribe((response) => {
        this.getpainAssesmentWeightList();
        this.vDailyWeight = '';
      });
    } else {
      const invalidFields = [];
      if (this.PainAssessWeightForm.invalid) {
        for (const controlName in this.PainAssessWeightForm.controls) {
          if (this.PainAssessWeightForm.controls[controlName].invalid) {
            invalidFields.push(`PainAssessmentWeight Form: ${controlName}`);
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

  deleteTableRow(element) {
    Swal.fire({
      title: 'Do you want to delete  Pain Assessment Weight?',
      text: "Please provide a reason for delete ",
      icon: "warning",
      input: 'text',
      inputPlaceholder: 'Enter delete  reason...',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
      preConfirm: (reason) => {
        if (!reason || reason.trim() === '') {
          Swal.showValidationMessage('Reason is required');
        }
        return reason;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const submitData = {
          patWeightId: element.patWeightId,
          isActive: true,
          reason: `User: ${this._loggedService.currentUserValue.userName}, Reason: ${result.value}`
        };
        console.log(submitData);
        this._ClinicalcareService.OnDeleteAssessmentWeight(submitData).subscribe((res) => {
          this.getpainAssesmentWeightList();
        });
      }
    });
  }

  keyPressAlphanumeric(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  //////////////////////////////////////// Pain Asissgment weight list end ////////////////////////////////////////

  //////////////////////////////////////// Lab Report code ////////////////////////////////////////
  @ViewChild('grid7') grid7: AirmidTableComponent;
  gridConfig7: gridModel = new gridModel();
  @ViewChild('isTestCompletedIcon') isTestCompletedIcon!: TemplateRef<any>;
  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'isTestCompleted')!.template = this.isTestCompletedIcon;
  }

  columns7 = [
    { heading: "Date&Time", key: "vaTime", sort: true, align: 'left', emptySign: 'NA', type: 8 },
    { heading: "Test Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "PBill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "IsCompleted", key: "isCompleted", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template },
  ]
  getReporttestList() {
    const admid = this.vAdmission ?? 0
    const opip = this.vipdNo ? 1 : 0
    this.gridConfig7 = {
      apiUrl: "ClinicalCare/IPPathologyList",
      columnsList: this.columns7,
      sortField: "RegNo",
      sortOrder: 0,
      filters: [
        { fieldName: "AdmissionId", fieldValue: String(admid), opType: OperatorComparer.Equals },
        { fieldName: "OP_IP_Type", fieldValue: String(opip), opType: OperatorComparer.Equals }
      ]
    }
    setTimeout(() => {
      this.grid7.gridConfig = this.gridConfig7;
      this.grid7.bindGridData();
    });
  }

  getPrint(contact) {

    console.log(contact)

    Swal.fire({
      title: 'Select Report Format',
      text: "Choose how you want to view the report:",
      icon: "warning",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      denyButtonColor: "#6c757d",
      cancelButtonColor: "#d33",
      confirmButtonText: "With Header",
      denyButtonText: "Without Header",
    }).then((result) => {

      if (result.isConfirmed) {
        this.viewgetPathologyTemplateReportPdf1(contact, "PathologyReportTemplateWithHeader");
      } else if (result.isDenied) {
        this.viewgetPathologyTemplateReportPdf1(contact, "PathologyReportTemplate");
      }
    });
  }

  viewgetPathologyTemplateReportPdf1(contact: any, mode: string) {

    setTimeout(() => {
      const param = {
        searchFields: [
          {
            fieldName: "PathReportId",
            fieldValue: String(contact.pathReportID),
            opType: "Equals"
          },
          {
            fieldName: "OP_IP_Type",
            fieldValue: String(contact.opdipdtype),
            opType: "Equals"
          }
        ],
        mode: mode  // dynamic
      };
      console.log(param)
      this._ClinicalcareService.getReportView(param).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent, {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Template Report Viewer"
          }
        });
        matDialog.afterClosed().subscribe(result => { });
      });
    }, 100);
  }

  //////////////////////////////////////// Lab Report code end ////////////////////////////////////////

  //////////////////////////////////////// calling another component code ////////////////////////////////////////
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
        data: this.registerObj
      });
    dialogRef.componentInstance.openedFromClinical = true;
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
        data: this.registerObj
      });
    dialogRef.componentInstance.openedFromClinical = true;
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
        maxHeight: '95vh',
        width: '90%',
        data: this.registerObj
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }

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
        maxHeight: '95vh',
        width: '90%',
        data: this.registerObj
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
  //////////////////////////////////////// calling another component code end ////////////////////////////////////////

  //////////////////////// Ip Prescription start////////////////////////

  gridConfig: gridModel = new gridModel();
  gridConfig1: gridModel = new gridModel();
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
        maxHeight: '95vh',
        width: '90%',
        data: this.registerObj
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getPrescriptionList();
    });
  }

  allColumns1 = [
    { heading: "Admission Date", key: "vst_Adm_Date", sort: true, align: 'left', emptySign: 'NA', width: 170 },
    { heading: "Prescription Date", key: "ptime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 180 },
    { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 90 },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Store Name", key: "storeName", sort: true, align: 'left', emptySign: 'NA', width: 170 },
    { heading: "Class Name", key: "className", sort: true, align: 'left', emptySign: 'NA', width: 170 },
    { heading: "Ward Name", key: "wardName", sort: true, align: 'left', emptySign: 'NA', width: 170 },
    { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 170 },
    { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA', width: 170 },
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

  getPrescriptionList() {
    const regNo1 = this.vRegNo ?? 19000101 //this is default value because if i provide 0 then bydefault list will come
    this.gridConfig = {
      apiUrl: "IPPrescription/PrescriptionPatientList",
      columnsList: this.allColumns1,
      sortField: "RegNo",
      sortOrder: 0,
      filters: [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: String(regNo1), opType: OperatorComparer.Equals },
        { fieldName: "F_Name", fieldValue: '%', opType: OperatorComparer.Equals },
        { fieldName: "L_Name", fieldValue: '%', opType: OperatorComparer.Equals }
      ]
    }
    setTimeout(() => {
      this.grid.gridConfig = this.gridConfig;
      this.grid.bindGridData();
    });
  }

  GetDetails1(data: any): void {
    console.log("detailList:", data)
    const ipMedID = data.ippreId;
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
      const param = {
        "searchFields": [
          {
            "fieldName": "OP_IP_ID",
            "fieldValue": String(response.ippreId),
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

  //////////////////////////////////////// Ip Prescription end ////////////////////////////////////////

  //////////////////////////////////////// Lab Request start ////////////////////////////////////////
  gridConfig2: gridModel = new gridModel();
  gridConfig3: gridModel = new gridModel();
  @ViewChild('grid2') grid2: AirmidTableComponent;
  @ViewChild('grid3') grid3: AirmidTableComponent;
  fromDate2 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate2 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  isShowDetailTable2: boolean = false;

  allColumns2 = [
    { heading: "Request Date", key: "reqTime", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 8 },
    { heading: "Admission Date", key: "admDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "WardName", key: "wardName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "BedName", key: "bedName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "RequestType", key: "requestType", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "IsOnFileTest", key: "isOnFileTest", type: gridColumnTypes.status, align: "center" },
  ]

  getLabRequesttList() {
    const regNo1 = this.vRegNo ?? 19000101 //this is default value because if i provide 0 then bydefault list will come
    this.gridConfig2 = {
      apiUrl: "IPPrescription/LabRadRequestList",
      columnsList: this.allColumns2,
      sortField: "RegNo",
      sortOrder: 0,
      filters: [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: String(regNo1), opType: OperatorComparer.Equals },
        { fieldName: "F_Name", fieldValue: '%', opType: OperatorComparer.Equals },
        { fieldName: "L_Name", fieldValue: '%', opType: OperatorComparer.Equals }
      ]
    }
    setTimeout(() => {
      this.grid2.gridConfig = this.gridConfig2;
      this.grid2.bindGridData();
    });
  }

  getSelectedRow(row: any): void {
    console.log("Selected row : ", row);
    const vRequestId = row.requestId
    this.gridConfig3 = {
      apiUrl: "IPPrescription/LabRadRequestDetailList",
      columnsList: [
        { heading: "IsBillingStatus", key: "isStatus", type: gridColumnTypes.status, align: "center" },
        { heading: "IsTestStatus", key: "isTestCompleted", type: gridColumnTypes.status, align: "center" },
        { heading: "ReqDate", key: "reqDate", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "ReqTime", key: "reqTime", sort: true, align: 'left', emptySign: 'NA' },
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
        maxHeight: '95vh',
        width: '90%',
        data: this.registerObj
      });
    dialogRef.afterClosed().subscribe(result => {
      this.getLabRequesttList();
    });
  }
  //////////////////////////////////////// Lab Request end ////////////////////////////////////////

  //////////////////////////////////////// vital info list end ////////////////////////////////////////  
  vitallist: any;
  vsuctionType: any = "0";
  getRtrvVitallist() {
    const admid = this.vAdmission ?? 19001010
    const vdata = {
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
    console.log(vdata)
    this._ClinicalcareService.getRtrvVitallist(vdata).subscribe((data) => {
      this.dsvitalsList.data = data.data as VitalsList[];
      this.vitallist = data.data as VitalsList[];
      console.log(this.dsvitalsList.data);
    });
  }

  deleteVitalTableRow(element) {
    Swal.fire({
      title: 'Do you want to delete  Vitals?',
      text: "Please provide a reason for delete ",
      icon: "warning",
      input: 'text',
      inputPlaceholder: 'Enter delete  reason...',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
      preConfirm: (reason) => {
        if (!reason || reason.trim() === '') {
          Swal.showValidationMessage('Reason is required');
        }
        return reason;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const submitData = {
          vitalId: element.vitalId,
          isActive: true,
          reason: `User: ${this._loggedService.currentUserValue.userName}, Reason: ${result.value}`
        };
        console.log(submitData);
        this._ClinicalcareService.OnDeleteVital(submitData).subscribe((res) => {
          this.getRtrvVitallist();
        });
      }
    });
  }

  OnSaveVital() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');

    if (this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    }
    this.VitalsForm.get('vitalId').setValue(this.vVitalId ?? 0)
    this.VitalsForm.get('admissionId').setValue(this.vAdmission)
    this.VitalsForm.get('vitalDate').setValue(formattedDate)
    this.VitalsForm.get('vitalTime').setValue(`${formattedDate} ${formattedTime}`)
    if (!this.VitalsForm.invalid) {
      console.log(this.VitalsForm.value)
      this._ClinicalcareService.SaveVitalInfo(this.VitalsForm.value).subscribe((response) => {
        this.getRtrvVitallist();
        this.OnClosevital()
      });
    } else {
      const invalidFields = [];
      if (this.VitalsForm.invalid) {
        for (const controlName in this.VitalsForm.controls) {
          if (this.VitalsForm.controls[controlName].invalid) {
            invalidFields.push(`Vital Form: ${controlName}`);
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

  OnClosevital() {
    this.VitalsForm.reset();
    this.VitalsForm.get('suctionType').setValue('0')
  }
  vVitalId: any;
  onEditVital(row: any) {
    console.log('Row:', row, typeof row.suctionType);
    this.vVitalId = row.vitalId
    const updated = {
      ...row,
      suctionType: String(row.suctionType)
    };
    this.VitalsForm.patchValue(updated);
  }


  //////////////////////////////////////// vital info list end ////////////////////////////////////////

  //////////////////////////////////////// Sugar Level list code ////////////////////////////////////////
  Sugarlevellist: any;
  getRtrvSugarlevellist() {
    const admid = this.vAdmission ?? 19001010
    const vdata = {
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
    console.log(vdata)
    this._ClinicalcareService.getRtrvSugarlevellist(vdata).subscribe((data) => {
      this.dsSugarTable.data = data.data as SugarlevelList[];
      this.Sugarlevellist = data.data as SugarlevelList[];
      console.log(this.dsSugarTable.data);
    });
  }

  deleteSugarTableRow(element) {
    Swal.fire({
      title: 'Do you want to delete  Sugar Level?',
      text: "Please provide a reason for delete ",
      icon: "warning",
      input: 'text',
      inputPlaceholder: 'Enter delete  reason...',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
      preConfirm: (reason) => {
        if (!reason || reason.trim() === '') {
          Swal.showValidationMessage('Reason is required');
        }
        return reason;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const submitData = {
          id: element.id,
          isActive: true,
          reason: `User: ${this._loggedService.currentUserValue.userName}, Reason: ${result.value}`
        };
        console.log(submitData);
        this._ClinicalcareService.OnDeleteSugar(submitData).subscribe((res) => {
          this.getRtrvSugarlevellist();
        });
      }
    });
  }

  OnsaveSugarlevel() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');

    if (this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    }
    this.SugarForm.get('id').setValue(this.vid ?? 0)
    this.SugarForm.get('admissionId').setValue(this.vAdmission)
    this.SugarForm.get('entryDate').setValue(formattedDate)
    this.SugarForm.get('entryTime').setValue(`${formattedDate} ${formattedTime}`)
    if (!this.SugarForm.invalid) {
      const controlsToRemove = ['InformedTo', 'InformedBy', 'Injection', 'InjectionDose', 'Tablet', 'TabletDose'];
      controlsToRemove.forEach(controlName => {
        this.SugarForm.removeControl(controlName);
      });
      console.log(this.SugarForm.value)
      this._ClinicalcareService.SaveSugarlevel(this.SugarForm.value).subscribe((response) => {
        this.getRtrvSugarlevellist();
        this.OnCloseSugar()
      });
    } else {
      const invalidFields = [];
      if (this.SugarForm.invalid) {
        for (const controlName in this.SugarForm.controls) {
          if (this.SugarForm.controls[controlName].invalid) {
            invalidFields.push(`Sugar Level Form: ${controlName}`);
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

  OnCloseSugar() {
    this.SugarForm.reset();
  }

  vid: any;
  onEditSuugarlevel(row) {
    console.log(row)
    this.vid = row.id
    const m_data = row
    this.SugarForm.patchValue(m_data);
  }

  //////////////////////////////////////// Sugar Level list code end ////////////////////////////////////////

  //////////////////////////////////////// Oxygen/Venti code end ////////////////////////////////////////
  OxygenventiList: any;
  getRtrvOxygenlist() {
    const admid = this.vAdmission ?? 19001010
    const vdata = {
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
    console.log(vdata)
    this._ClinicalcareService.getRtrvOxygenlist(vdata).subscribe((data) => {
      this.dsOxygenTable.data = data.data as OxygenVentilatorlist[];
      this.OxygenventiList = data.data as OxygenVentilatorlist[];
      console.log(this.dsOxygenTable.data);
    });
  }

  OnsaveOxygenVenti() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');

    if (this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    }
    this.OxygenForm.get('id').setValue(this.vOxyid ?? 0)
    this.OxygenForm.get('admissionId').setValue(this.vAdmission)
    this.OxygenForm.get('entryDate').setValue(formattedDate)
    this.OxygenForm.get('entryTime').setValue(`${formattedDate} ${formattedTime}`)
    if (!this.OxygenForm.invalid) {
      console.log(this.OxygenForm.value)
      this._ClinicalcareService.SaveOxygenVentilator(this.OxygenForm.value).subscribe((response) => {
        this.getRtrvOxygenlist();
        this.OnCloseOxygen()
      });
    } else {
      const invalidFields = [];
      if (this.OxygenForm.invalid) {
        for (const controlName in this.OxygenForm.controls) {
          if (this.OxygenForm.controls[controlName].invalid) {
            invalidFields.push(`Oxygen Form: ${controlName}`);
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

  OnCloseOxygen() {
    this.OxygenForm.reset();
  }

  deleteOxygenTableRow(element) {
    Swal.fire({
      title: 'Do you want to delete oxygen/ventilation?',
      text: "Please provide a reason for delete ",
      icon: "warning",
      input: 'text',
      inputPlaceholder: 'Enter delete  reason...',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
      preConfirm: (reason) => {
        if (!reason || reason.trim() === '') {
          Swal.showValidationMessage('Reason is required');
        }
        return reason;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const submitData = {
          id: element.id,
          isActive: true,
          reason: `User: ${this._loggedService.currentUserValue.userName}, Reason: ${result.value}`
        };
        console.log(submitData);
        this._ClinicalcareService.OnDeleteOxygenVen(submitData).subscribe((res) => {
          this.getRtrvOxygenlist();
        });
      }
    });
  }

  vOxyid: any;
  onEditOxygen(row) {
    console.log(row)
    this.vOxyid = row.id
    const m_data = row
    this.OxygenForm.patchValue(m_data);
  }
  //////////////////////////////////////// Oxygen/Venti code end ////////////////////////////////////////

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
  temperature: any;
  Temperature: any;
  Pulse: any;
  pulse: any;
  Respiration: any;
  PainAssess: any;
  BP: any;
  MewaScore: any;
  AVPU: any;
  TakenBy: any;
  CVP: any;
  cvp: any;
  peep: any;
  constructor(VitalsList) {
    {

      this.date = VitalsList.date || 0;
      this.time = VitalsList.time || 0;
      this.temperature = VitalsList.temperature || 0;
      this.Pulse = VitalsList.Pulse || 0;
      this.pulse = VitalsList.pulse || 0;
      this.Respiration = VitalsList.Respiration || 0;
      this.Temperature = VitalsList.Temperature || 0;
      this.BP = VitalsList.BP || 0;
      this.MewaScore = VitalsList.MewaScore || 0;
      this.AVPU = VitalsList.AVPU || 0;
      this.TakenBy = VitalsList.TakenBy || 0;
      this.CVP = VitalsList.CVP || 0;
      this.cvp = VitalsList.cvp || 0
      this.peep = VitalsList.peep || 0
    }
  }
}
export class SugarlevelList {
  Date: any;
  BSL: any;
  bsl: any;
  UrineSugar: any;
  ETTpressure: any;
  UrineKetone: any;
  Bodies: any;
  IntakeMode: any;
  bodies: any;
  intakeMode: any;
  ReportedToRMO: any;
  Addedby: any;
  CVP: any;
  constructor(SugarlevelList) {
    {

      this.Date = SugarlevelList.Date || 0;
      this.BSL = SugarlevelList.BSL || 0;
      this.bsl = SugarlevelList.bsl || 0;
      this.UrineSugar = SugarlevelList.UrineSugar || 0;
      this.ETTpressure = SugarlevelList.ETTpressure || 0;
      this.Bodies = SugarlevelList.Bodies || 0;
      this.bodies = SugarlevelList.bodies || 0;
      this.intakeMode = SugarlevelList.intakeMode || 0;
      this.IntakeMode = SugarlevelList.IntakeMode || 0;
      this.ReportedToRMO = SugarlevelList.ReportedToRMO || 0;
      this.Addedby = SugarlevelList.Addedby || 0;
      this.UrineKetone = SugarlevelList.UrineKetone || 0;
    }
  }
}
export class OxygenVentilatorlist {
  Date: any;
  Mode: any;
  TidolV: any;
  setRange: any;
  ipap: any;
  MinuteV: any;
  rateTotal: any;
  epap: any;
  peep: any;
  pc: any;
  mvpercentage: any;
  prSup: any;
  fio2: any;
  ie: any;
  oxygenRate: any;
  saturationWithO2: any;
  flowTrigger: any;
  CreatedBy: any;
  tidolV: any;
  constructor(OxygenVentilatorlist) {
    {
      this.Date = OxygenVentilatorlist.Date || 0;
      this.Mode = OxygenVentilatorlist.Mode || 0;
      this.TidolV = OxygenVentilatorlist.TidolV || 0;
      this.tidolV = OxygenVentilatorlist.tidolV || 0
      this.setRange = OxygenVentilatorlist.setRange || 0;
      this.ipap = OxygenVentilatorlist.ipap || 0;
      this.MinuteV = OxygenVentilatorlist.MinuteV || 0;
      this.rateTotal = OxygenVentilatorlist.rateTotal || 0;
      this.epap = OxygenVentilatorlist.epap || 0;
      this.pc = OxygenVentilatorlist.pc || 0;
      this.peep = OxygenVentilatorlist.peep || 0;
      this.mvpercentage = OxygenVentilatorlist.mvpercentage || 0;
      this.prSup = OxygenVentilatorlist.prSup || 0;
      this.fio2 = OxygenVentilatorlist.fio2 || 0;
      this.ie = OxygenVentilatorlist.ie || 0;
      this.oxygenRate = OxygenVentilatorlist.oxygenRate || 0;
      this.saturationWithO2 = OxygenVentilatorlist.saturationWithO2 || 0;
      this.flowTrigger = OxygenVentilatorlist.flowTrigger || 0;
      this.CreatedBy = OxygenVentilatorlist.CreatedBy || 0;
    }
  }
}

export class INputOutputList {
  date: any;
  time: any;
  Temperature: any;
  temperature: any;
  Pulse: any;
  pulse: any;
  Respiration: any;
  PainAssess: any;
  BP: any;
  MewaScore: any;
  AVPU: any;
  TakenBy: any;
  CVP: any;
  cvp: any;
  peep: any;
  constructor(INputOutputList) {
    {

      this.date = INputOutputList.date || 0;
      this.time = INputOutputList.time || 0;
      this.temperature = INputOutputList.temperature || 0;
      this.Pulse = INputOutputList.Pulse || 0;
      this.pulse = INputOutputList.pulse || 0;
      this.Respiration = INputOutputList.Respiration || 0;
      this.Temperature = INputOutputList.Temperature || 0;
      this.BP = INputOutputList.BP || 0;
      this.MewaScore = INputOutputList.MewaScore || 0;
      this.AVPU = INputOutputList.AVPU || 0;
      this.TakenBy = INputOutputList.TakenBy || 0;
      this.CVP = INputOutputList.CVP || 0;
      this.cvp = INputOutputList.cvp || 0
      this.peep = INputOutputList.peep || 0
    }
  }
}

