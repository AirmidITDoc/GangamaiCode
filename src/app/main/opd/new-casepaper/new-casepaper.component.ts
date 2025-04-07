import { ChangeDetectorRef, Component, ElementRef, inject, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, ReplaySubject, Subject, Subscription, of } from 'rxjs';
import { SearchInforObj } from '../op-search-list/opd-search-list/opd-search-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { CasepaperService } from './casepaper.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
// import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import Swal from 'sweetalert2';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { debounceTime, exhaustMap, filter, map, scan, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { PrecriptionItemList } from 'app/main/nursingstation/prescription/new-prescription/new-prescription.component';
import { ToastrService } from 'ngx-toastr';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ConfigService } from 'app/core/services/config.service';
import { PrescriptionTemplateComponent } from './prescription-template/prescription-template.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { element } from 'protractor';
import { timeStamp } from 'console';
import { PrePresciptionListComponent } from './pre-presciption-list/pre-presciption-list.component';
import { ToasterService } from 'app/main/shared/services/toaster.service';
import { DosemasterComponent } from 'app/main/setup/prescription/dosemaster/dosemaster.component';
import { AddItemComponent } from './add-item/add-item.component';
import { CityMasterComponent } from 'app/main/setup/PersonalDetails/city-master/city-master.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { ServiceMaster } from 'app/main/setup/billing/service-master/service-master.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';

interface Patient {
  PHeight: string;
  PWeight: number;
  Pulse: string;
  VisitDate: any; // Changed to visitDate for clarity
}

@Component({
  selector: 'app-new-casepaper',
  templateUrl: './new-casepaper.component.html',
  styleUrls: ['./new-casepaper.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewCasepaperComponent implements OnInit {
  displayedItemColumn: string[] = [
    'ItemName',
    'ItemGenericName',
    'DoseName',
    'Days',
    'Remark',
    // 'DoseName1',
    // 'Day1',
    // 'DoseName2',
    // 'Day2',
    'Action'
  ]
  displayedpreviousColumn: string[] = [
    'ItemName',
    'DoseName',
    'Days',
    'Remark'
    // 'DoseName1',
    // 'Day1',
    // 'DoseName2',
    // 'Day2', 
  ]
  displayedVisitColumns = [
    'VisitId',
    'VisitTime',
    'DocName'
  ];

  displayedVisitinfoColumns = [
    'PHeight',
    'PWeight',
    'Pulse'
  ];

  isRegIdSelected: boolean = false;
  sIsLoading: string = '';
  noOptionFound: boolean = false;
  currentDate = new Date();
  caseFormGroup: FormGroup;
  searchFormGroup: FormGroup;
  MedicineItemForm: FormGroup;
  ItemForm: FormGroup;
  CompanyName: any;
  Tarrifname: any;
  Doctorname: any;
  Paymentdata: any;
  vOPIPId: any = 0;
  vOPDNo: any = 0;
  vTariffId: any = 0;
  vClassId: any = 0;
  CompanyId: any = 0;
  AgeYear: any = 0;
  RegNo: any = 0;
  City: any;
  RegId: any;
  registerObj1 = new AdmissionPersonlModel({});
  registerObj = new CasepaperVisitDetails({});

  PatientName: any;
  MobileNo: any;
  VisitDate: any;
  DepartmentName: any;
  AgeMonth: any;
  AgeDay: any;
  GenderName: any;
  RefDocName: any;
  BedName: any;
  vClassName: any;
  add: boolean = false;
  ItemName: any;
  BalanceQty: any;
  vQty: any;
  ItemId: any;
  PresItemlist: any = [];
  vRemark: any;
  selectedAdvanceObj: AdmissionPersonlModel;
  isDrugIdSelected: any;
  filteredOptionsItem: any;
  vDay: any;
  vInstruction: any;
  Chargelist: any[] = [];  // changed here for onAdd purpose
  PatientType: any;
  vHeight: any;
  vWeight: any;
  vBSL: any;
  vBMI: any;
  vBP: any;
  VisitId: any;
  vTemp: any;
  vSpO2: any;
  vPulse: any;
  screenFromString = 'OP-billing';
  vChiefComplaint: any;
  vDiagnosis: any;
  vExamination: any;
  isItemIdSelected: boolean = false;
  isTemplateSelected: boolean = false;
  filteredOptionsDosename: Observable<string[]>;
  doseList: any = [];
  isDoseSelected: boolean = false;
  dateTimeObj: any;
  vMobileNo: any = 0;
  doseresults: any[] = [];
  vDepartmentid: any;
  filteredOptionsDoc: any;
  filteredOptionsService: Observable<string[]>;
  DoctorList: any = [];
  isDoctorSelected: boolean = false;
  vDoctorId: any;
  vTemplateId: any;
  vServiceId: any;
  isServiceIdSelected: boolean = false;
  vFollowUpDays: any = 0;
  patientDetail: any;
  patientDetail1: any;
  savebtn: boolean = true;
  regObj = new CasepaperVisitDetails({});
  vItemGenericName: any;
  vItemGenericNameId: any;
  PatientReferDocId: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dsItemList = new MatTableDataSource<MedicineItemList>();
  dataSource1 = new MatTableDataSource<CasepaperVisitDetails>();
  dsItemList1 = new MatTableDataSource<MedicineItemList>();
  dsCopyItemList = new MatTableDataSource<MedicineItemList>();

  autocompleteModeItem: string = "Item"; //ItemType
  autocompleteModeItemGeneric: string = "ItemGeneric";
  autocompleteModeDose: string = "DoseMaster";
  autocompleteModeTemplate: string = "PrescriptionTemplateMaster";
  autocompleteModeServcie: string = "Service"; //ServiceName
  autocompleteModeDoctor: string = "ConDoctor";
  autocompleteModeDiagnosis: string = "CasepaperDignosis";

  AllTypeDescription: any = []
  @ViewChild('ddlDiagnosis') ddlDiagnosis: AirmidDropDownComponent;
  @ViewChild('ddlChiefComplaint') ddlChiefComplaint: AirmidDropDownComponent;
  @ViewChild('ddlExamination') ddlExamination: AirmidDropDownComponent;
  @ViewChild('ddlService') ddlService: AirmidDropDownComponent;

  constructor(
    private _CasepaperService: CasepaperService,
    private _snackBar: MatSnackBar,
    private _formBuilder: UntypedFormBuilder,
    private advanceDataStored: AdvanceDataStored,
    private cdr: ChangeDetectorRef,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<NewCasepaperComponent>,
    public _WhatsAppEmailService: WhatsAppEmailService,
    private configService: ConfigService,
    private commonService: PrintserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { console.log('Dialog Data:', data); }

  ngOnInit(): void {
    // 
    this.searchFormGroup = this.createSearchForm();
    this.caseFormGroup = this.createForm();
    this.MedicineItemform();
    this.specificDate = new Date();
    this.dateStyle = 'Day'
    this.onDaysChange();
    console.log("dddddddddd:", this.patients);
    // this.getHistoryList();

    if (this.data) {
      this.regObj = this.data
      console.log(this.regObj)
      this.RegNo = this.regObj.regNoWithPrefix
      this.vOPIPId = this.regObj.visitId
      this.VisitId = this.regObj.visitId
      this.RegId = this.regObj.regId
      this.PatientName = this.regObj.patientName
      this.Doctorname = this.regObj.doctorname
      this.vOPDNo = this.regObj.opdNo
      this.AgeYear = this.regObj.ageYear
      this.AgeMonth = this.regObj.ageMonth
      this.AgeDay = this.regObj.ageDay
      this.GenderName = this.regObj.GenderName
      this.DepartmentName = this.regObj.departmentName
      this.PatientType = this.regObj.patientType
      this.Tarrifname = this.regObj.tariffName
      this.CompanyName = this.regObj.companyName
      this.RefDocName = this.regObj.refDocName
      this.vClassId = this.regObj.classId
      this.getPrescription(this.regObj);
      this.getnewVisistListDemo(this.regObj);
      this.getRtrvTestServiceList(this.regObj);  //retrive list
      this.getRtrvCheifComplaintList(this.regObj); // retrive list
    }
  }

  // removedignosis(item) {
  //   let removedIndex = this.caseFormGroup.value.mAssignDiagnosis.findIndex(x => x.id == item.id);
  //   this.caseFormGroup.value.mAssignDiagnosis.splice(removedIndex, 1);
  //   this.ddlDiagnosis.SetSelection(this.caseFormGroup.value.mAssignDiagnosis.map(x => x.id));
  // }

  removedignosis(item) {
    let removedIndex = this.caseFormGroup.value.mAssignDiagnosis.findIndex(x => x.id === item.id);

    if (removedIndex !== -1) {
        this.caseFormGroup.value.mAssignDiagnosis.splice(removedIndex, 1);

        this.ddlDiagnosis.SetSelection(this.caseFormGroup.value.mAssignDiagnosis.map(x => x.id));

        this.addDiagnolist = this.caseFormGroup.value.mAssignDiagnosis.map(x => ({
            id: x.id,
            descriptionName: x.descriptionName
        }));

        console.log("Updated addDiagnolist after removal:", this.addDiagnolist);
    }
}

  // removeChiefComplaint(item) {
  //   let removedIndex = this.caseFormGroup.value.mAssignChiefComplaint.findIndex(x => x.complaintId == item.complaintId);
  //   this.caseFormGroup.value.mAssignChiefComplaint.splice(removedIndex, 1);
  //   this.ddlChiefComplaint.SetSelection(this.caseFormGroup.value.mAssignChiefComplaint.map(x => x.complaintId));
  // }

  removeChiefComplaint(item) {
    debugger
    let removedIndex = this.caseFormGroup.value.mAssignChiefComplaint.findIndex(x => x.complaintId === item.complaintId);

    if (removedIndex !== -1) {
        this.caseFormGroup.value.mAssignChiefComplaint.splice(removedIndex, 1);

        this.ddlChiefComplaint.SetSelection(this.caseFormGroup.value.mAssignChiefComplaint.map(x => x.complaintId));

        this.addCheiflist = this.caseFormGroup.value.mAssignChiefComplaint.map(x => ({
            complaintId: x.complaintId,
            complaintDescr: x.complaintDescr
        }));

        console.log("Updated addCheiflist after removal:", this.addCheiflist);
    }
}

  // removeExamination(item) {
  //   let removedIndex = this.caseFormGroup.value.mAssignExamination.findIndex(x => x.examinationId == item.examinationId);
  //   this.caseFormGroup.value.mAssignExamination.splice(removedIndex, 1);
  //   this.ddlExamination.SetSelection(this.caseFormGroup.value.mAssignExamination.map(x => x.examinationId));
  // }

  removeExamination(item) {
    debugger
    let removedIndex = this.caseFormGroup.value.mAssignExamination.findIndex(x => x.examinationId === item.examinationId);

    if (removedIndex !== -1) {
        this.caseFormGroup.value.mAssignExamination.splice(removedIndex, 1);

        this.ddlExamination.SetSelection(this.caseFormGroup.value.mAssignExamination.map(x => x.examinationId));

        this.addExaminlist = this.caseFormGroup.value.mAssignExamination.map(x => ({
            examinationId: x.examinationId,
            examinationDescr: x.examinationDescr
        }));

        console.log("Updated addExaminlist after removal:", this.addExaminlist);
    }
}

  // removeService(item) {
  //   let removedIndex = this.caseFormGroup.value.mAssignService.findIndex(x => x.serviceId == item.serviceId);
  //   this.caseFormGroup.value.mAssignService.splice(removedIndex, 1);
  //   this.ddlService.SetSelection(this.caseFormGroup.value.mAssignService.map(x => x.serviceId));
  // }

  removeService(item) {
    let removedIndex = this.caseFormGroup.value.mAssignService.findIndex(x => x.serviceId === item.serviceId);

    if (removedIndex !== -1) {
        this.caseFormGroup.value.mAssignService.splice(removedIndex, 1);

        this.ddlService.SetSelection(this.caseFormGroup.value.mAssignService.map(x => x.serviceId));

        this.selectedItems = this.caseFormGroup.value.mAssignService.map(x => ({ serviceId: x.serviceId }));

        console.log("Updated selectedItems after removal:", this.selectedItems);
    }
}



  vDays: any = 10;
  followUpDate: string;
  specificDate: Date;

  onDaysChange() {

    if (this.dateStyle == 'Day') {
      const today = new Date();
      const todaydays = today.getDate()
      const followDays = ((todaydays) + parseInt(this.vDays))
      console.log(followDays)
      const followUp = new Date();
      followUp.setDate((todaydays) + parseInt(this.vDays));
      this.followUpDate = this.datePipe.transform(followUp.toDateString(), 'MM/dd/YYYY');
      this.specificDate = new Date(this.followUpDate);
      console.log(this.followUpDate)
    }
    else if (this.dateStyle == 'Month') {
      const today = new Date();
      const followUp = new Date();
      followUp.setMonth((today.getMonth()) + parseInt(this.vDays));
      this.followUpDate = this.datePipe.transform(followUp.toDateString(), 'MM/dd/YYYY');
      this.specificDate = new Date(this.followUpDate);
      console.log(this.followUpDate)
    }
    else if (this.dateStyle == 'Year') {
      const today = new Date();
      const Currentyear = today.getFullYear()
      const followUp = new Date();
      followUp.setFullYear((Currentyear) + parseInt(this.vDays));
      this.followUpDate = this.datePipe.transform(followUp.toDateString(), 'MM/dd/YYYY');
      this.specificDate = new Date(this.followUpDate);
      console.log(this.followUpDate)
    }
    else {
      if (this.vDays == '' || this.vDays == 0 || this.vDays == null || this.vDays == undefined)
        this.specificDate = new Date();
    }
  }
  dateStyle: string;

  selectedOption: string = 'Day';

  OnChangeDobType(e) {
    this.dateStyle = e.value;
    this.onDaysChange();
    console.log(this.dateStyle)
  }
  createForm() {
    return this._formBuilder.group({
      LetteHeadRadio: ['NormalHead'],
      LangaugeRadio: ["true"],
      Height: ['', [
        Validators.required,
      ]],
      Weight: ['', [
        Validators.required,
      ]],
      BMI: '',
      BSL: '',
      SpO2: ['', [
        // Validators.required,
      ]],
      Pulse: ['', [
        // Validators.required,
      ]],
      BP: ['', [
        // Validators.required,
      ]],
      Temp: ['', [
        // Validators.required,
      ]],
      ChiefComplaint: '',
      serviceId: '',
      Diagnosis: '',
      Examination: '',
      ExaminationControl: '',
      DiagnosisControl: '',
      CheifComplaintControl: '',

      mAssignChiefComplaint: [""],
      mAssignDiagnosis: [""],
      mAssignExamination: [""],

      mAssignService: [""],
    });
  }

  MedicineItemform() {
    this.MedicineItemForm = this._formBuilder.group({
      ItemId: ['', [Validators.required]],
      DoseId: ['', [Validators.required]],
      DoseId1: '',
      Day: ['', [Validators.required,Validators.pattern("^^[1-9]+[0-9]*$")]],
      ItemGenericNameId: '',
      Instruction: '',
      DoctorID: '',
      Departmentid: '',
      FollowupDays: '',
      start: [''],
      Remark: '',
      Days: '',
      serviceId: '',
      FollowupMonths: '',
      FollowupYears: '',
      dateStylebtn: ['Day'],
      TemplateId: ['']
    });
  }

  createSearchForm() {
    return this._formBuilder.group({
      regRadio: ['registration'],
      regRadio1: ['registration1'],
      RegId: [''],
    });
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  PatientListfilteredOptions: any;
  ConsultantDocId: any;

  getSelectedObj(obj) {
    this.onClear();
    if ((obj.regId ?? 0) > 0) {
      console.log(obj)
      this.vOPIPId = obj.visitId
      this.RegNo = obj.visitId
      setTimeout(() => {
        this._CasepaperService.getRegistraionById(obj.regId).subscribe((response) => {
          this.patientDetail = response;
          this.savebtn = false
          this.PatientName = this.patientDetail.firstName + " " + this.patientDetail.middleName + " " + this.patientDetail.lastName
          console.log(this.patientDetail)
        });

      }, 500);

      setTimeout(() => {

        this._CasepaperService.getVisitById(this.vOPIPId).subscribe(data => {
          this.patientDetail1 = data;
          console.log(data)
          console.log(this.patientDetail1)
        });
      }, 1000);
    }
    this.getPrescription(obj);
    this.getnewVisistListDemo(obj);
    // this.getVitalInfo(obj);
    this.getRtrvTestServiceList(obj); // retrive list
    this.getRtrvCheifComplaintList(obj); // retrive list
  }

  RefDocNameId: any;
  PrefollowUpDate: string;

  // tried
  vDrugName: any;
  vDoseName: any;
  vItemGN: any;
  vDayys: any;
  vInst: any;
  vPrescriptionId: any;
  getPrescription(obj) {
    debugger
    var m_data2 = {
      "first": 0,
      "rows": 10,
      "sortField": "VisitId",
      "sortOrder": 0,
      "filters": [
    {
          "fieldName": "VisitId",
          "fieldValue": String(obj.visitId),
          "opType": "Equals"
        }
    ],
      "exportType": "JSON"
    }
    console.log("VisitId:", m_data2)
    this._CasepaperService.RtrvPreviousprescriptionDetailsdemo(m_data2).subscribe(Visit => {
      this.dsItemList.data = Visit?.data as MedicineItemList[];
      if (this.dsItemList.data)

        console.log("bbbbbbbb:", this.dsItemList.data);
      this.Chargelist = this.dsItemList.data;

      console.log("iiiiii:", this.Chargelist);

      if (this.dsItemList.data.length > 0) {
        for (let item of this.dsItemList.data) {
          this.vHeight = item.pHeight;
          this.vWeight = item.pWeight;
          this.vBMI = item.bmi;
          this.vSpO2 = item.spO2;
          this.vTemp = item.temp;
          this.vPulse = item.pulse;
          this.vBSL = item.bsl;
          this.vBP = item.bp;

          this.vChiefComplaint = item.chiefComplaint;
        this.vDiagnosis = item.diagnosis;
        this.vExamination = item.examination;
        this.PrefollowUpDate = this.datePipe.transform(item.followupDate, 'MM/dd/YYYY');
        this.specificDate = new Date(this.PrefollowUpDate)
        this.MedicineItemForm.get('Remark').setValue(item.advice)
        this.RefDocName = item.doctorname
        this.vDrugName = item.drugName
        this.vDoseName = item.doseName
        this.vItemGN = item.genericName
        this.vDayys = item.days
        this.vInst = item.instruction
        this.MedicineItemForm.get("DoctorID").setValue(item.patientReferDocId)
        }
        
      }

      // if (this.dsItemList.data.length > 0) {
      //   this.vHeight = this.dsItemList.data[0].pHeight;
      //   this.vWeight = this.dsItemList.data[0].pWeight;
      //   this.vBMI = this.dsItemList.data[0].bmi;
      //   this.vSpO2 = this.dsItemList.data[0].spO2;
      //   this.vTemp = this.dsItemList.data[0].temp;
      //   this.vPulse = this.dsItemList.data[0].pulse;
      //   this.vBSL = this.dsItemList.data[0].bsl;
      //   this.vBP = this.dsItemList.data[0].bp;

      //   this.vChiefComplaint = this.dsItemList.data[0].chiefComplaint;
      //   this.vDiagnosis = this.dsItemList.data[0].diagnosis;
      //   this.vExamination = this.dsItemList.data[0].examination;
      //   this.PrefollowUpDate = this.datePipe.transform(this.dsItemList.data[0].followupDate, 'MM/dd/YYYY');
      //   this.specificDate = new Date(this.PrefollowUpDate)
      //   this.MedicineItemForm.get('Remark').setValue(this.dsItemList.data[0].advice)
      //   this.RefDocName = this.dsItemList.data[0].doctorname
      //   this.vDrugName = this.dsItemList.data[0].drugName
      //   this.vDoseName = this.dsItemList.data[0].doseName
      //   this.vItemGN = this.dsItemList.data[0].genericName
      //   this.vDayys = this.dsItemList.data[0].days
      //   this.vInst = this.dsItemList.data[0].instruction
      //   this.MedicineItemForm.get("DoctorID").setValue(this.dsItemList.data[0].patientReferDocId)
      // }
    });

  }

  RtrvDescriptionList: any = [];

  HistoryList: any = [];
  addCheiflist: any[] = [];
  addDiagnolist: any = [];
  addExaminlist: any = [];
  nValue: any[] = [];

  getRtrvCheifComplaintList(obj) {
    // debugger
    this.addCheiflist = [];
    this.addDiagnolist = [];
    this.addExaminlist = [];
    this.AllTypeDescription = [];

    const vdata = {
      "first": 0,
      "rows": 10,
      "sortField": "VisitId",
      "sortOrder": 0,
      "filters": [
        { "fieldName": "VisitId", "fieldValue": String(obj.visitId), "opType": "Equals" }
      ],
      "exportType": "JSON"
    };

    this._CasepaperService.getRtrvCheifComplaintList1(vdata).subscribe(response => {
      console.log("three response:", response);

      if (response && Array.isArray(response.data)) {
        this.RtrvDescriptionList = response.data;
        console.log("RtrvDescriptionList:", this.RtrvDescriptionList);

        // Process Chief Complaints
        // this.addCheiflist = []; 
        let ChiefComplaint = this.RtrvDescriptionList.filter(item => item.descriptionType === 'Complaint');
        this.addCheiflist = [];
        if (ChiefComplaint.length > 0) {
          ChiefComplaint.forEach(element => {
            this.addCheiflist.push(
              {
                complaintId:element.id,
                complaintDescr: element.descriptionName,
              }
            )
          })
          // this.ddlChiefComplaint.SetSelection(this.addCheiflist);
          // this.caseFormGroup.get('mAssignChiefComplaint').setValue(this.addCheiflist);
          setTimeout(() => {
            this.caseFormGroup.get('mAssignChiefComplaint').setValue(this.addCheiflist);
          }, 100);

          console.log("Chief Complaints:", this.addCheiflist);

        } else {
          console.log("No Chief Complaints found");
        }
        console.log("demommmm:", this.caseFormGroup.get('mAssignChiefComplaint').value)
        // Process Diagnosis
        let Diagnosis = this.RtrvDescriptionList.filter(item => item.descriptionType === 'Diagnosis');
        if (Diagnosis.length > 0) {
          Diagnosis.forEach(element => {
            this.addDiagnolist.push(
              {
                id:element.id,
                descriptionName: element.descriptionName
              }
            )
          })
          console.log("Diagnosis List:", this.addDiagnolist);
          setTimeout(() => {
            this.caseFormGroup.get('mAssignDiagnosis').setValue(this.addDiagnolist);
          }, 100)
          // this.ddlDiagnosis.SetSelection(this.addDiagnolist);
        } else {
          console.log("No Diagnosis found");
        }

        // Process Examination
        let Examination = this.RtrvDescriptionList.filter(item => item.descriptionType === 'Examination');
        if (Examination.length > 0) {
          Examination.forEach(element => {
            this.addExaminlist.push(
              {
                examinationId:element.id,
                examinationDescr: element.descriptionName
              }
            )
          });
          console.log("Examination List:", this.addExaminlist);
          // this.caseFormGroup.get('mAssignExamination').setValue(this.addExaminlist);
          setTimeout(() => {
            this.caseFormGroup.get('mAssignExamination').setValue(this.addExaminlist);
          }, 100)
          // this.ddlExamination.SetSelection(this.addExaminlist);
        } else {
          console.log("No Examination found");
        }
      } else {
        console.error("Invalid response format:", response);
      }
    }, error => {
      console.error("Error fetching Chief Complaints:", error);
    });

  }

  getBMIcalculation() {
    if (this.vHeight > 0 && this.vWeight > 0) {
      let Height = (this.vHeight / 100)
      this.vBMI = Math.round((this.vWeight) / ((Height) * (Height)));
    }
    else if (this.vHeight <= 0) {
      this.vBMI = 0;
      //Swal.fire('Please enter Height')
    }
    else if (this.vWeight <= 0) {
      this.vBMI = 0;
      //Swal.fire('Please enter Weight')
    }
  }

  doseId = 0
  doseName = ""
  durgId = 0
  durgName = ""
  templateId = 0
  templateName = ""
  itemObjects: any;
  itemGeneric: any;
  vdoseName:any;

  selectChangeItemName(row) {
    // debugger
    console.log("itemData:", row)
    this.durgId = row.itemId
    this.durgName = row.itemName
    // this.vdoseName=row.doseName
    this.vDay=row.doseDay

    if ((this.durgId ?? 0) > 0) {
      setTimeout(() => {
        this._CasepaperService.getItemMasterById(this.durgId).subscribe((response) => {
          this.itemObjects = response;
          console.log("all data:", this.itemObjects)
          this.vItemGenericNameId = this.itemObjects.itemGenericNameId

          if ((this.vItemGenericNameId ?? 0) > 0) {
            setTimeout(() => {
              this._CasepaperService.getItemGenericById(this.vItemGenericNameId).subscribe((response) => {
                this.itemGeneric = response;
                console.log("vItemGenericName:", this.itemGeneric)
                this.vItemGenericName = this.itemGeneric.itemGenericName
              });
            }, 500);
          }
        });
      }, 500);
    }
  }

  selectChangeItemGenericName(row) {
    console.log("GenericName:", row)
    this.vItemGenericNameId = row.value
    this.vItemGenericName = row.text
  }

  GenericNameEditable: boolean = false;

  editingIndex1: number | null = null;
  GenericoriginalValue: string | null = null;

  editItem(index: number, data) {
    this.editingIndex1 = index;
    this.originalValue = data.genericName;
  }

  OnSaveEditGeneric(contact) {

    this.vPrescriptionId = contact.precriptionId;
    console.log(contact)
    if (this.vPrescriptionId) {
      var m_dataUpdate = {
        "precriptionId": this.vPrescriptionId,
        "genericId": this.vItemGenericNameId || '',
      }
      console.log("UpdateJson:", m_dataUpdate);

      this._CasepaperService.genericNameUpdate(m_dataUpdate).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        } else {
          this.toastr.error('Record not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
  }

  GenericdisableEditing(data) {

    if (this.GenericoriginalValue !== null) {
      this.MedicineItemForm.get('ItemGenericNameId').setValue(this.GenericoriginalValue);
    }
    this.editingIndex1 = null;
  }

  DoseObjects: any;
  DoseQtyPerDay:any;
  selectChangeDoseName(row) {
    debugger
    console.log("Dose:", row)
    this.doseId = row.value
    this.doseName = row.text

    if ((this.doseId ?? 0) > 0) {
      setTimeout(() => {
        this._CasepaperService.getDoseMasterById(this.doseId).subscribe((response) => {
          this.DoseObjects = response;
          console.log("all data:", this.DoseObjects)
          this.DoseQtyPerDay = this.DoseObjects.doseQtyPerDay
        });
      }, 500);
    }
  }

  editingIndex: number | null = null;
  originalValue: string | null = null;

  editDose(index: number, data) {

    console.log(data)
    this.editingIndex = index;
    this.originalValue = data.doseName;
  }

  OnSaveEditDose(element: any) {
    console.log("Saving Dose:", element);
    this.editingIndex = null;
    this.vPrescriptionId = element.precriptionId;

    if (this.vPrescriptionId) {
      var m_dataUpdate = {
        "precriptionId": this.vPrescriptionId,
        "doseId": this.doseId || '',
      }
      console.log("UpdateJson:", m_dataUpdate);

      this._CasepaperService.doseNameUpdate(m_dataUpdate).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        } else {
          this.toastr.error('Record not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
  }

  DosedisableEditing(index: number) {

    if (this.originalValue !== null) {
      // Restore old value
      this.MedicineItemForm.get('DoseId').setValue(this.originalValue);
    }
    this.editingIndex = null;
  }

  selectedItems = [];

  selectChangeServiceName(row) {
    console.log("Selected Services:", row);

    const selectedData = Array.isArray(row) ? row : [row]; // Convert single data to array

    this.selectedItems = selectedData.map(item => ({ serviceId: item.serviceId }));

    console.log("Updated selectedItems:", this.selectedItems);
  }


  RtrvTestServiceList: any = [];
  getRtrvTestServiceList(obj) {
    // 
    var m_data2 = {
      "first": 0,
      "rows": 10,
      "sortField": "VisitId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "VisitId",
          "fieldValue": String(obj.visitId),//"40773",	
          "opType": "Equals"
        }
      ],
      "exportType": "JSON"
    }
    this._CasepaperService.getRtrvTestService(m_data2).subscribe(response => {
      console.log("Full response:", response);
      this.RtrvTestServiceList = response.data
      console.log("Extracted data array::", this.RtrvTestServiceList)
      if (Array.isArray(this.RtrvTestServiceList) && this.RtrvTestServiceList.length > 0) {
        this.RtrvTestServiceList.forEach(element => {
          this.selectedItems.push({
            serviceId: element.serviceId || 0,
            serviceName: element.serviceName || ''
          });
        });
        this.caseFormGroup.get('mAssignService').setValue(this.selectedItems);
        console.log("sdsdssd:", this.selectedItems);
      } else {
        console.log("RtrvTestServiceList is either empty or not an array:", this.RtrvTestServiceList);
      }
    })
  }

  selectChangeDoctorName(row) {
    console.log("DoctorName:", row)
  }

  selectChangeCheifComplaint(row) {
    console.log("Selected Services:", row);
    const selectedData = Array.isArray(row) ? row : [row];
    this.addCheiflist = selectedData.map(item => ({ 
      complaintId: item.complaintId,
      complaintDescr:item.complaintDescr
    }));
    console.log("Updated selectedItems:", this.addCheiflist);
  }

  //   selectChangeCheifComplaint(row) {
  //     debugger
  //     console.log("Selected Services:", row);

  //     if (!this.addCheiflist || !Array.isArray(this.addCheiflist)) {
  //         this.addCheiflist = [];
  //     }
  //     const selectedData = Array.isArray(row) ? row : [row];

  //     const newItems = selectedData.map(item => ({
  //         complaintDescr: item.complaintDescr,
  //     }));

  //     if (newItems.length > 0) {
  //         this.addCheiflist = [...this.addCheiflist, ...newItems];

  //         this.addCheiflist = this.addCheiflist.filter((value, index, self) =>
  //             index === self.findIndex(item => item.complaintDescr === value.complaintDescr)

  //         );
  //     }
  //     console.log("Updated selectedItems:", this.addCheiflist);
  //     this.caseFormGroup.get('mAssignChiefComplaint').setValue(this.addCheiflist);
  // }

  selectChangeDiagnosis(row) {
    console.log("Selected Services:", row);
    const selectedData = Array.isArray(row) ? row : [row];
    this.addDiagnolist = selectedData.map(item => ({ 
      id: item.id,
      descriptionName:item.descriptionName
    }));
    console.log("Updated selectedItems:", this.addDiagnolist);
  }

  selectChangeExamination(row) {
    console.log("Selected Services:", row);
    const selectedData = Array.isArray(row) ? row : [row];
    this.addExaminlist = selectedData.map(item => ({ 
      examinationId: item.examinationId,
      examinationDescr:item.examinationDescr
     }));
    console.log("Updated selectedItems:", this.addExaminlist);
  }

  //   selectChangeExamination(row) {
  //     debugger
  //     console.log("Selected Services:", row);

  //     if (!this.addExaminlist || !Array.isArray(this.addExaminlist)) {
  //         this.addExaminlist = [];
  //     }
  //     const selectedData = Array.isArray(row) ? row : [row];

  //     const newItems = selectedData.map(item => ({
  //         examinationDescr: item.examinationDescr,
  //     }));

  //     if (newItems.length > 0) {
  //         this.addExaminlist = [...this.addExaminlist, ...newItems];

  //         this.addExaminlist = this.addExaminlist.filter((value, index, self) =>
  //             index === self.findIndex(item => item.examinationDescr === value.examinationDescr)

  //         );
  //     }
  //     console.log("Updated selectedItems:", this.addExaminlist);
  //     this.caseFormGroup.get('mAssignExamination').setValue(this.addExaminlist);
  // }

  getValidationMessages() {
    return {
      ItemId: [],
      DoseId: [],
      TemplateId: [],
      serviceId: [],
      DoctorID: [],
      Diagnosis: [],
      ChiefComplaint: [],
      Examination: []
    }
  }

  FilteredServicec: any;
  NooptionsService: any;

  getdoseDetailValue1(element, event) {
    element.DoseName1 = event
    console.log(event, element)
  }

  getdoseDetailValue2(element, event) {
    element.DoseName2 = event
    console.log(event, element)
  }
  getdosedetail() {
    if (this.doseList.length > 0) {
      this.doseList.forEach(element => {
        this.doseresults.push(element)
      });
      //console.log(this.doseresults)
    }
  }

  Day1: any = 0;
  Day2: any = 0;
  onAdd() {

    if (!this.MedicineItemForm.get("ItemId")?.value) {
      this.toastr.warning('Please select a Item Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.MedicineItemForm.get("DoseId")?.value) {
      this.toastr.warning('Please select a Dose Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vDay == '' || this.vDay == null || this.vDay == undefined)) {
      this.toastr.warning('Please enter a Day', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    console.log('Before push, Chargelist:', this.Chargelist);
    console.log('Is Chargelist an array?', Array.isArray(this.Chargelist));

    if (!Array.isArray(this.Chargelist)) {
      console.warn("Chargelist was not an array. Resetting...");
      this.Chargelist = [...this.dsItemList.data];
    }

    const iscekDuplicate = this.dsItemList.data.some(item => item.DrugId == this.durgId)
    if (!iscekDuplicate) {

      let Qty = this.DoseQtyPerDay || 0

      let newEntry = {
        DrugId: this.durgId || 0,
        DrugName: this.durgName || '',
        DoseId: this.doseId || 0,
        GenericName: this.vItemGenericName || '',
        GenericId: this.vItemGenericNameId || 1,
        DoseName: this.doseName || '',
        Days: this.MedicineItemForm.get('Day').value || this.vDay,
        QtyPerDay: this.DoseQtyPerDay || 0,
        totalQty: Qty * (this.DoseQtyPerDay || 0),
        DoseId1: this.doseId || 0,
        DoseName1: this.doseName || '',
        Day1: this.Day1,
        DoseId2: this.durgId || 0,
        DoseName2: this.durgName || '',
        Day2: this.Day1,
        Instruction: this.MedicineItemForm.get("Instruction").value || ''
      };
      this.Chargelist.push(newEntry);
      this.dsItemList.data = [...this.Chargelist];

      console.log(this.dsItemList.data);
    } else {
      this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.getdosedetail();
    this.MedicineItemForm.get('ItemId').reset('');
    this.MedicineItemForm.get('DoseId').reset('');
    this.MedicineItemForm.get('Day').reset('');
    this.MedicineItemForm.get('Instruction').reset('');
    // this.itemid.nativeElement.focus();
  }

  deleteTableRow(event, element) {

    let index = this.Chargelist.indexOf(element);
    if (index >= 0) {
      this.Chargelist.splice(index, 1);
      this.dsItemList.data = [];
      this.dsItemList.data = this.Chargelist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  
  selectChangeTemplateName(row) {
    console.log("Template:", row)
    this.templateId = row.value
    this.templateName = row.text
  }

  onTemplDetAdd() {
    debugger
    if ((this.vOPIPId == '' || this.vOPIPId == '0')) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.MedicineItemForm.get("TemplateId")?.value) {
      this.toastr.warning('Please select a Template Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    const iscekDuplicate = this.dsItemList.data.some(item => item.Presid == this.MedicineItemForm.get('TemplateId').value)
    if (!iscekDuplicate) {
      var vdata = {
        "first": 0,
        "rows": 10,
        "sortField": "Presid",
        "sortOrder": 0,
        "filters": [
          {
            "fieldName": "Presid",
            "fieldValue": String(this.templateId),//"40773",	
            "opType": "Equals"
          }
        ],
        "exportType": "JSON"
      }
      console.log(vdata)
      this._CasepaperService.getTempPrescriptionList(vdata).subscribe(data => {
        this.dsItemList.data = data.data as MedicineItemList[];
        this.Chargelist = data as MedicineItemList[];
        console.log(this.dsItemList.data)
      });
    }
    else {
      this.toastr.warning('Selected Template Details already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.MedicineItemForm.get('TemplateId').reset('');

  }

  onSave() {
    debugger
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    if (this.addCheiflist.length > 0) {
      this.addCheiflist.forEach(element => {
        this.AllTypeDescription.push({
          descriptionName: element.complaintDescr,
          descriptionType: "Complaint"
        });
      });
    }

    if (this.addDiagnolist.length > 0) {
      this.addDiagnolist.forEach(element => {
        this.AllTypeDescription.push({
          descriptionName: element.descriptionName,
          descriptionType: "Diagnosis"
        });
      });
    }

    if (this.addExaminlist.length > 0) {
      this.addExaminlist.forEach(element => {
        this.AllTypeDescription.push({
          descriptionName: element.examinationDescr,
          descriptionType: "Examination"
        });
      });
    }
    console.log("Updated AllTypeDescription:", this.AllTypeDescription);

    if (this.RegNo == '' || this.RegNo == undefined || this.RegNo == null) {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.caseFormGroup.get("Height")?.value) {
      this.toastr.warning('Please Enter Height', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.caseFormGroup.get("Weight")?.value) {
      this.toastr.warning('Please Enter Weight', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.dsItemList.data.length == 0) {
      Swal.fire('Error !', 'Please add prescription', 'error');
      return
    }

    let ReferDocNameID = 0;
    if (this.MedicineItemForm.get('DoctorID').value) {
      ReferDocNameID = this.MedicineItemForm.get('DoctorID').value || 1;
    } else {
      ReferDocNameID = this.ConsultantDocId
    }

    let insertOPDPrescriptionarray = [];
    this.dsItemList.data.forEach(element => {
      let insertOPDPrescription = {};
      insertOPDPrescription['opdIpdIp'] = this.vOPIPId;
      insertOPDPrescription['opdIpdType'] = 0;
      insertOPDPrescription['date'] = formattedDate,
      insertOPDPrescription['pTime'] = this.dateTimeObj.time;
      insertOPDPrescription['classId'] = this.vClassId || 12;
      insertOPDPrescription['genericId'] = element.GenericId || element.genericId;
      insertOPDPrescription['drugId'] = element.DrugId || element.drugId ;
      insertOPDPrescription['doseId'] = element.DoseId || element.doseId;
      insertOPDPrescription['days'] = element.Days || element.days;
      insertOPDPrescription['instruction'] = element.Instruction || element.instructionDescription || '';
      insertOPDPrescription['remark'] = this.MedicineItemForm.get('Remark').value || '';
      insertOPDPrescription['doseOption2'] = 0,
      insertOPDPrescription['daysOption2'] = 0 ,
      insertOPDPrescription['doseOption3'] = 0,
      insertOPDPrescription['daysOption3'] = 0 ,
      insertOPDPrescription['instructionId'] = 0;
      insertOPDPrescription['qtyPerDay'] = element.QtyPerDay || element.qtyPerDay || 0;
      insertOPDPrescription['totalQty'] = (element.QtyPerDay * element.Days) || (element.qtyPerDay * element.days) ||0;
      insertOPDPrescription['isClosed'] = true;
      insertOPDPrescription['isEnglishOrIsMarathi'] = JSON.parse(this.caseFormGroup.get('LangaugeRadio').value), //this.caseFormGroup.get('LangaugeRadio').value;
      insertOPDPrescription['chiefComplaint'] = this.caseFormGroup.get('ChiefComplaint').value || '';
      insertOPDPrescription['diagnosis'] = this.caseFormGroup.get('Diagnosis').value || '';
      insertOPDPrescription['examination'] = this.caseFormGroup.get('Examination').value || '';
      insertOPDPrescription['height'] = this.caseFormGroup.get('Height').value || '';
      insertOPDPrescription['pWeight'] = this.caseFormGroup.get('Weight').value || '';
      insertOPDPrescription['bmi'] = parseInt(this.caseFormGroup.get('BMI').value).toString() || '';
      insertOPDPrescription['bsl'] = this.caseFormGroup.get('BSL').value || '';
      insertOPDPrescription['spO2'] = this.caseFormGroup.get('SpO2').value || '';
      insertOPDPrescription['temp'] = this.caseFormGroup.get('Temp').value || '';
      insertOPDPrescription['pulse'] = this.caseFormGroup.get('Pulse').value || '';
      insertOPDPrescription['bp'] = this.caseFormGroup.get('BP').value || '';
      insertOPDPrescription['storeId'] = this._loggedService.currentUserValue.storeId || 0;
      insertOPDPrescription['patientReferDocId'] = ReferDocNameID || element.doctorname;
      insertOPDPrescription['advice'] = this.MedicineItemForm.get('Remark').value || '';
      insertOPDPrescription['isAddBy'] = this._loggedService.currentUserValue.userId;

      insertOPDPrescriptionarray.push(insertOPDPrescription);
    });

    let opRequestList = [];
    if (this.selectedItems.length == 0) {
      let opRequestListObj = {};
      opRequestListObj['opipid'] = this.vOPIPId;
      opRequestListObj['serviceId'] = 0
      opRequestList.push(opRequestListObj);
    } else {
      this.selectedItems.forEach(element => {
        let opRequestListObj = {};
        opRequestListObj['opipid'] = this.vOPIPId;
        opRequestListObj['serviceId'] = element.serviceId || 32;
        opRequestList.push(opRequestListObj);
      });
    }

    let OpDescriptinList = [];
    if (this.AllTypeDescription.length == 0) {
      let OpDescriptinListObj = {};
      OpDescriptinListObj['visitId'] = this.VisitId || 0;
      OpDescriptinListObj['descriptionType'] = '';
      OpDescriptinListObj['descriptionName'] = ''
      OpDescriptinList.push(OpDescriptinListObj);
    } else {
      this.AllTypeDescription.forEach(element => {
        let OpDescriptinListObj = {};
        OpDescriptinListObj['visitId'] = this.VisitId || 0;
        OpDescriptinListObj['descriptionType'] = element.descriptionType || '';
        OpDescriptinListObj['descriptionName'] = element.descriptionName || '';
        OpDescriptinList.push(OpDescriptinListObj);
      });
    }

    let casePaperSaveObj = {
      // "tPrescription": insertOPDPrescription,
      "tPrescription": insertOPDPrescriptionarray,
      "topRequestList": opRequestList,
      "mopCasepaperDignosisMaster": OpDescriptinList
    }
    console.log(casePaperSaveObj);

    this._CasepaperService.onSaveCasepaper(casePaperSaveObj).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'Casepaper save Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {

            if (this.caseFormGroup.get("LetteHeadRadio").value == 'LetterHead')
              this.OnViewReportPdf(this.VisitId)
            else
              this.OnViewReportPdf(this.VisitId)
            this.getWhatsappshareSales(this.vOPIPId, this.vMobileNo)
            this.onClear();
            this.onClose();
          }
        });
      } else {
        Swal.fire('Error !', 'Casepaper not saved', 'error');
      }
    });

  }

  OnViewReportPdf(element) {
 
    console.log('Third action clicked for:', element);
    this.commonService.Onprint("VisitId", element, "AppointmentReceipt");
  }

  onClose() {
    this.caseFormGroup.reset({ LangaugeRadio: ["true"] });
    // this.numericForm.reset();
    this.dialogRef.close();
  }
  onClear() {
    this.caseFormGroup.reset();
    this.searchFormGroup.get('RegId').reset();
    this.dsItemList.data = [];
    this.PatientName = " ";
    this.RegId = " ";
    this.Doctorname = " ";
    this.VisitDate = this.datePipe.transform(Date.now(), 'dd/MM/yyyy hh:mm a');
    this.CompanyName = " ";
    this.Tarrifname = " ";
    this.DepartmentName = " ";
    this.RegNo = " ";
    this.vOPIPId = " ";
    this.vOPDNo = " ";
    this.vTariffId = " ";
    this.vClassId = " ";
    this.AgeYear = " ";
    this.AgeMonth = " ";
    this.vClassName = " ";
    this.AgeDay = " ";
    this.GenderName = " ";
    this.RefDocName = " ";
    this.BedName = " ";
    this.PatientType = " ";
    this.caseFormGroup.get('LetteHeadRadio').setValue('NormalHead');
    this.caseFormGroup.get('LangaugeRadio').setValue("true");
    this.MedicineItemForm.get('Remark').setValue('');
    this.MedicineItemForm.get('DoctorID').setValue('');
    this.selectedItems = [];
    this.addCheiflist = [];
    this.addDiagnolist = [];
    this.addExaminlist = [];
    this.specificDate = new Date();
    this.vDays = 10
  }
  SpinLoading: any = ""
  viewgetOpprescriptionReportwithheaderPdf() {

    setTimeout(() => {
      this.SpinLoading = true;
      //  this.AdList=true;
      this._CasepaperService.getOpPrescriptionview(
        this.VisitId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "OP Prescription Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
      });

    }, 100);
  }

  viewgetOpprescriptionReportwithoutheaderPdf() {

    setTimeout(() => {
      this.SpinLoading = true;
      //  this.AdList=true;
      this._CasepaperService.getOpPrescriptionwithoutheaderview(
        this.VisitId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "OP Prescription Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
      });

    }, 100);
  }

  getWhatsappshareSales(el, vmono) {

    if (vmono != '' && vmono != '0') {
      var m_data = {
        "insertWhatsappsmsInfo": {
          "mobileNumber": vmono || 0,
          "smsString": '',
          "isSent": 0,
          "smsType": 'OPPRESCRIPTIONT',
          "smsFlag": 0,
          "smsDate": this.currentDate,
          "tranNo": el,
          "PatientType": 1,//el.PatientType,
          "templateId": 0,
          "smSurl": "info@gmail.com",
          "filePath": '',
          "smsOutGoingID": 0
        }
      }
      this._WhatsAppEmailService.InsertWhatsappSales(m_data).subscribe(response => {
        if (response) {
          this.toastr.success('Prescription Sent on WhatsApp Successfully.', 'Save !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
        } else {
          this.toastr.error('API Error!', 'Error WhatsApp!', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
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
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  // ///[^a-zA-Z0-9]/
  keyPressOk(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^[0-9!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  @ViewChild('ChiefComp') ChiefComp: ElementRef;
  @ViewChild('EHeight') EHeight: ElementRef;
  @ViewChild('EBSL') EBSL: ElementRef;
  @ViewChild('EWeight') EWeight: ElementRef;
  @ViewChild('ESpO2') ESpO2: ElementRef;
  @ViewChild('EPulse') EPulse: ElementRef;
  @ViewChild('EBMI') EBMI: ElementRef;
  @ViewChild('EBP') EBP: ElementRef;
  @ViewChild('ETemp') ETemp: ElementRef;
  @ViewChild('deptdoc') deptdoc: ElementRef;
  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('dosename') dosename: ElementRef;
  @ViewChild('Day') Day: ElementRef;
  @ViewChild('Instruction') Instruction: ElementRef;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
  public onEnterdept(event): void {
    if (event.which === 13) {
      this.deptdoc.nativeElement.focus();
    }
  }
  public onEnterHeight(event): void {
    if (event.which === 13) {
      this.EWeight.nativeElement.focus();
    }
  }
  public onEnterWeight(event): void {
    if (event.which === 13) {
      this.EBSL.nativeElement.focus();
    }
  }
  public onEnterBSL(event): void {
    if (event.which === 13) {
      this.ESpO2.nativeElement.focus();
    }
  }
  public onEnterSpO2(event): void {
    if (event.which === 13) {
      this.EPulse.nativeElement.focus();
    }
  }
  public onEnterPulse(event): void {
    if (event.which === 13) {
      this.EBP.nativeElement.focus();
    }
  }
  public onEnterBMI(event): void {
    if (event.which === 13) {
    }
  }
  public onEnterBP(event): void {
    if (event.which === 13) {
      this.ETemp.nativeElement.focus();
    }
  }
  onEnterTemp(event): void {
    if (event.which === 13) {
      this.ChiefComp.nativeElement.focus();
    }
  }

  public onEnterqty(event): void {
    if (event.which === 13) {
      this.Instruction.nativeElement.focus();
    }
  }
  public onEnterremark(event): void {
    if (event.which === 13) {
      this.addbutton.focus;
      this.add = true;
    }
  }
  public onEnterChiefComplaint(event): void {
    // if (event.which === 13) {
    //   this.addbutton.focus;
    //   this.add = true;
    // }
  }

  onChangeLangaugeRadio(event) {

  }
  LetterheadFilter(event) {

  }

  //datewise visit info and table data
  patients: any[] = []; // Using 'any' type for simplicity
  uniqueDates: string[] = [];
  displayedColumns: string[] = ['patientName', 'age', 'gender'];

  getnewVisistListDemo(obj) {
    // 
    var D_data = {
      "first": 0,
      "rows": 10,
      "sortField": "VisitId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "RegID",
          "fieldValue": String(obj.regId),//"40773",	
          "opType": "Equals"
        }
      ],
      "exportType": "JSON"
    }
    console.log(D_data);
    this._CasepaperService.getRtrvVisitedListdemo(D_data).subscribe(Visit => {
      this.patients = Visit?.data as MedicineItemList[];
      this.extractUniqueDates();
      console.log("visitPatient info:", this.patients)
    });
  }

  extractUniqueDates() {
    // 
    const visitId = this.patients.map(patient => patient.visitId);
    this.uniqueDates = Array.from(new Set(visitId));
    // this.uniqueDates = Array.from(new Set(dates));
  }
  //datewise table data
  getFirstPatientForDate(visitId: string) {
    return this.patients.filter(patient => patient.visitId === visitId); //
  }
  //datewise visit info date
  getPatientsForDate(visitId: string) {
    // 
    const patientsForDate = this.patients.filter(patient => patient.visitId === visitId);
    return patientsForDate.length > 0 ? [patientsForDate[0]] : []; // 
  }

  SelectedObj: any;

  preHeight: any;
  preSPO: any;
  preWeight: any;
  preTemp: any;
  PreBMI: any;
  prePulse: any;
  preBSL: any;
  preBP: any;
  preCheifComplaint: any;
  preExamination: any;
  preDiagnosis: any;
  preFollowupDate: Date;


  getPreviousPrescriptionlist() {
    console.log(this.RegId)
    if ((this.RegId == '' || this.RegId == '0' || this.RegId == undefined)) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const dialogRef = this._matDialog.open(PrePresciptionListComponent,
      {
        maxWidth: "70vw",
        maxHeight: "72vh",
        width: '100%',
        height: "100%",
        data: {
          Obj: this.RegId
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      console.log(result)

      if (result) {
        ;
        this.dsCopyItemList.data = result;
        console.log("this.dsCopyItemList.data:", this.dsCopyItemList.data);

        if (!this.dsItemList.data) {
          this.dsItemList.data = [];
        }

        this.Chargelist = [...this.dsItemList.data];

        this.dsCopyItemList.data.forEach(element => {
          console.log("Checking for duplicate:", element.drugId);

          const chkitem = this.dsItemList.data.find(item =>
            item.DrugId === element.drugId || item.drugId === element.drugId
          );

          console.log("this.dsItemList.data before insert:", this.dsItemList.data);

          if (!chkitem) {
            const newItem = {
              PrecriptionId: element.precriptionId || 0,
              OPD_IPD_IP: element.opD_IPD_IP || '',
              ClassID: element.classID || 0,
              ClassName: element.className,
              GenericId: element.genericId,
              GenericName: element.genericName || '',
              DrugId: element.drugId || '',
              DoseId: element.doseId || 0,
              DoseName: element.doseName,
              Days: element.days,
              InstructionId: element.instructionId || 0,
              InstructionDescription: element.instructionDescription || '',
              Remark: element.remark || '',
              DrugName: element.drugName,
              Instruction: element.instruction,
              TotalQty: element.totalQty,
              QtyPerDay: element.qtyPerDay,
              PWeight: element.pWeight,
              Pulse: element.pulse,
              BP: element.bp,
              BSL: element.bsl,
              ChiefComplaint: element.chiefComplaint,
              DoseOption2: element.doseOption2,
              DoseNameOption2: element.doseNameOption2,
              DaysOption2: element.daysOption2,
              DoseOption3: element.doseOption3,
              DoseNameOption3: element.doseNameOption3,
              DaysOption3: element.daysOption3,
            };

            this.Chargelist.push(newItem);
            this.dsItemList.data = [...this.Chargelist];

            console.log("Updated this.dsItemList.data:", this.dsItemList.data);
          } else {
            console.warn("Duplicate DrugId found:", element.drugId);
            this.toastr.warning('This Drug is already added', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
          }
        });

        console.log("Final dsItemList.data:", this.dsItemList.data);
      }

    });
  }

  SaveTemplate() {
    if (this.dsItemList.data.length == 0) {
      Swal.fire('Error !', 'Please add prescription in table', 'error');
      return
    }
    const dialogRef = this._matDialog.open(PrescriptionTemplateComponent,
      {
        maxWidth: "50vw",
        maxHeight: "35vh",
        width: '100%',
        // height: "100%",
        data: {
          Obj: this.dsItemList.data
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }

  //chipset cheifcomplaint
  // CheifComplaintControl = new FormControl();
  // ExaminationControl = new FormControl();
  // DiagnosisControl = new FormControl();
  filteredHistory: Observable<string[]>;
  selectable = true;
  removable = true;

  getItemMaster() {
    const dialogRef = this._matDialog.open(AddItemComponent,
      {
        maxWidth: "60vw",
        maxHeight: "65vh",
        width: '100%',
        // height: "65%" 
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
  getDosemaster() {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    let that = this;
    const dialogRef = this._matDialog.open(DosemasterComponent,
      {
        maxWidth: "85vw",
        height: '85%',
        width: '70%',
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //  that.grid.bindGridData();
      }
    });
  }

  // getHistoryList() {
  //   this._CasepaperService.getcheifcomplaintList().subscribe(data => {
  //     this.HistoryList = data;
  //     console.log(this.HistoryList)
  //     this.filteredHistory = this.caseFormGroup.get('ChiefComplaint').valueChanges.pipe(
  //       startWith(''),
  //       map(value => value ? this._filter(value) : this.HistoryList.slice()),
  //     );
  //   });
  // }
  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.HistoryList.filter(item => item.toLowerCase().includes(filterValue));
  // }

  //Cheifcomplaint
  addCheif(event: any): void {
    const input = event.input;
    const value = event.value;
    // Add cheif
    if ((value || '').trim()) {
      this.addCheiflist.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  selectedobjCheif(obj): void {
    const value = obj.ChiefComplaint;
    if ((value || '').trim()) {
      this.addCheiflist.push(value.trim());
    }
  }
  //Diagnosis
  addDiagnos(event: any): void {
    const input = event.input;
    const value = event.value;
    // Add cheif
    if ((value || '').trim()) {
      this.addDiagnolist.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  removeDiagno(Diagno: string): void {
    const index = this.addDiagnolist.indexOf(Diagno);
    if (index >= 0) {
      this.addDiagnolist.splice(index, 1);
    }
  }
  selectedobjDiagno(obj): void {
    const value = obj.Diagnosis;
    if ((value || '').trim()) {
      this.addDiagnolist.push(value.trim());
    }
  }
  //Examination
  addExamina(event: any): void {
    const input = event.input;
    const value = event.value;
    // Add cheif
    if ((value || '').trim()) {
      this.addExaminlist.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  removeExamin(Examin: string): void {
    const index = this.addExaminlist.indexOf(Examin);
    if (index >= 0) {
      this.addExaminlist.splice(index, 1);
    }
  }
  selectedobjExamin(obj): void {
    const value = obj.Examination;
    if ((value || '').trim()) {
      this.addExaminlist.push(value.trim());
    }
  }

}

export class CasepaperVisitDetails {
  ItemID: any;
  ItemName: any;
  DoseId: any;
  DoseName: any;
  Days: any;
  DoseId1: any;
  DoseName1: any;
  Day1: any;
  DoseId2: any;
  DoseName2: any;
  Day2: any;
  Instruction: any;
  BP: string;
  ConsultantDocName: string;
  BSL: string;
  CasePaperID: number;
  Complaint: string;
  Diagnosis: string;
  DocName: string;
  Finding: string;
  Height: string;
  Investigations: string;
  PastHistory: string;
  PatientName: string;
  PersonalDetails: string;
  Pluse: string;
  BMI: any;
  PresentHistory: string;
  RegID: number;
  SecondDocRef: number;
  SpO2: string;
  VisitDate: any;
  PreviousVisitDate: any;
  VisitId: any;
  VisitTime: any;
  Weight: string;
  DrugName: string;
  TotalQty: number;
  HospitalName: string;
  HospitalAddress: string;
  Phone: number;
  IPPreId: number;
  GenderName: string;
  PrecriptionId: number;
  TotalDayes: number;
  AgeYear: number;
  OPDNo: any;
  // _matDialog: any;
  RegNo: any;
  Temp: any;
  DepartmentName: any;
  Address: any;
  SecondRefDoctorName: any;
  VistDateTime: any;
  Qty: any;
  mAssignDiagnosis: any[];
  mAssignChiefComplaint: any[];
  mAssignExamination: any[];
  regNoWithPrefix: any;
  visitId: any;
  regId: any;
  patientName: any;
  doctorname: any;
  opdNo: any;
  ageYear: any;
  ageMonth: any;
  ageDay: any;
  departmentName: any;
  patientType: any;
  tariffName: any;
  companyName: any;
  refDocName: any;
  classId: any;
  bmi: any;
  spO2: any;
  temp: any;
  pulse: any;
  bsl: any;
  bp: any;
  chiefComplaint: any
  diagnosis: any
  examination: any
  followupDate: any
  advice: any
  patientReferDocId: any
  drugName: any;

  MAssignService: ServiceDet[];

  constructor(casePaperDetails) {
    this.BP = casePaperDetails.BP || '';
    this.ConsultantDocName = casePaperDetails.ConsultantDocName || '';
    this.BSL = casePaperDetails.BSL || '';
    this.BMI = casePaperDetails.BMI || '';
    this.CasePaperID = casePaperDetails.CasePaperID || 0;
    this.Complaint = casePaperDetails.Complaint || '';
    this.Diagnosis = casePaperDetails.Diagnosis || '';
    this.DocName = casePaperDetails.DocName || '';
    this.Finding = casePaperDetails.Finding || '';
    this.Height = casePaperDetails.Height || '';
    this.Investigations = casePaperDetails.Investigations || '';
    this.PastHistory = casePaperDetails.PastHistory || '';
    this.PatientName = casePaperDetails.PatientName || '';
    this.PersonalDetails = casePaperDetails.PersonalDetails || '';
    this.Pluse = casePaperDetails.Pluse || '';
    this.PresentHistory = casePaperDetails.PresentHistory || '';
    this.RegID = casePaperDetails.RegID || 0;
    this.SecondDocRef = casePaperDetails.SecondDocRef || 0;
    this.SpO2 = casePaperDetails.SpO2 || '';
    this.VisitDate = casePaperDetails.VisitDate || '';
    this.VisitId = casePaperDetails.VisitId || 0;
    this.VisitTime = casePaperDetails.VisitTime || '';
    this.Weight = casePaperDetails.Weight || '';
    this.DrugName = casePaperDetails.DrugName || '';
    this.TotalQty = casePaperDetails.TotalQty || '';
    this.HospitalName = casePaperDetails.HospitalName || '';
    this.HospitalAddress = casePaperDetails.HospitalAddress || '';
    this.Phone = casePaperDetails.Phone || '';
    this.IPPreId = casePaperDetails.IPPreId || '';
    this.DoseName = casePaperDetails.DoseName || '';
    this.Days = casePaperDetails.Days || 0;
    this.TotalDayes = casePaperDetails.TotalDayes || 0;
    this.GenderName = casePaperDetails.GenderName || '';
    this.OPDNo = casePaperDetails.OPDNo || '';
    this.AgeYear = casePaperDetails.AgeYear || 0;
    this.RegNo = casePaperDetails.RegNo || 0;
    this.Temp = casePaperDetails.Temp || 0;
    this.DepartmentName = casePaperDetails.DepartmentName || '';
    this.Address = casePaperDetails.Address || '';
    this.SecondRefDoctorName = casePaperDetails.SecondRefDoctorName || '';
    this.VistDateTime = casePaperDetails.VistDateTime || '';
    this.PreviousVisitDate = casePaperDetails.PreviousVisitDate || '';
    this.mAssignDiagnosis = casePaperDetails.mAssignDiagnosis || [];
    this.mAssignChiefComplaint = casePaperDetails.mAssignChiefComplaint || [];
    this.mAssignExamination = casePaperDetails.mAssignExamination || [];
    this.regNoWithPrefix = casePaperDetails.regNoWithPrefix || '';
    this.visitId = casePaperDetails.visitId || '';
    this.regId = casePaperDetails.regId || '';
    this.patientName = casePaperDetails.patientName || '';
    this.doctorname = casePaperDetails.doctorname || '';
    this.opdNo = casePaperDetails.opdNo || '';
    this.ageYear = casePaperDetails.ageYear || '';
    this.ageMonth = casePaperDetails.ageMonth || '';
    this.ageDay = casePaperDetails.ageDay || '';
    this.departmentName = casePaperDetails.departmentName || '';
    this.patientType = casePaperDetails.patientType || '';
    this.tariffName = casePaperDetails.tariffName || '';
    this.companyName = casePaperDetails.companyName || '';
    this.refDocName = casePaperDetails.refDocName || '';
    this.classId = casePaperDetails.classId || '';
    this.bmi = casePaperDetails.bmi || '';
    this.spO2 = casePaperDetails.spO2 || '';
    this.temp = casePaperDetails.temp || '';
    this.pulse = casePaperDetails.pulse || '';
    this.bsl = casePaperDetails.bsl || '';
    this.bp = casePaperDetails.bp || '';
    this.chiefComplaint = casePaperDetails.chiefComplaint || '';
    this.diagnosis = casePaperDetails.diagnosis || '';
    this.examination = casePaperDetails.examination || '';
    this.followupDate = casePaperDetails.followupDate || '';
    this.advice = casePaperDetails.advice || '';
    this.patientReferDocId = casePaperDetails.patientReferDocId || '';
    this.MAssignService = casePaperDetails.MAssignService;
  }


}

export class ServiceDet {
  serviceId: any;
  serviceName: any;

  constructor(ServiceDet) {
    {
      this.serviceId = ServiceDet.serviceId || "";
      this.serviceName = ServiceDet.serviceName || "";
    }
  }
}



export class MedicineItemList {
  ItemID: any;
  ItemId: any;
  ItemName: string;
  DoseName: any;
  Days: number;
  DoseName1: any;
  Day1: number;
  DoseName2: any;
  Day2: number;
  Instruction: any;
  DoseId: any;
  DoseId1: any;
  DoseId2: any;
  Day: any;
  DaysOption2: any;
  DaysOption3: any;
  DoseNameOption2: any;
  DoseNameOption3: any;
  pWeight: any;
  DoseOption3: any;
  DoseOption2: any;
  ChiefComplaint: any;
  Pulse: any;
  BSL: any;
  BP: any;
  DrugName: any;
  Remark: any;
  InstructionDescription: any;
  InstructionId: any;
  DrugId: any;
  GenericName: any;
  PrecriptionId: any;
  OPD_IPD_IP: any;
  ClassID: any;
  ClassName: any;
  GenericId: any;
  pHeight: any;
  Diagnosis: any;
  Examination: any;
  Temp: any;
  Advice: any;
  BMI: any;
  SpO2: any;
  Doctorname: any;
  FollowupDate: any;
  QtyPerDay: any;
  Presid: any;
  mAssignItemToStores: [];
  bmi: any;
  spO2: any;
  temp: any;
  pulse: any;
  bsl: any;
  bp: any;
  chiefComplaint: any
  diagnosis: any
  examination: any
  followupDate: any
  advice: any
  doctorname: any
  patientReferDocId: any
  drugName: any;
  doseName: any;
  genericName: any;
  days: any;
  instruction: any;
  storeId: any;
  storeName: any;
  precriptionId: any;
  opD_IPD_IP: any;
  classID: any;
  className: any;
  genericId: any;
  drugId: any;
  doseId: any;
  instructionId: any;
  instructionDescription: any;
  remark: any;
  totalQty: any;
  qtyPerDay: any;
  doseOption2: any;
  doseNameOption2: any;
  daysOption2: any;
  doseOption3: any;
  doseNameOption3: any;
  daysOption3: any;
  /**
  * Constructor
  *
  * @param MedicineItemList
  */
  constructor(MedicineItemList) {
    {
      this.ItemId = MedicineItemList.ItemId || 0;
      this.ItemID = MedicineItemList.ItemID || 0;
      this.ItemName = MedicineItemList.ItemName || "";
      this.Instruction = MedicineItemList.Instruction || '';
      this.DoseName = MedicineItemList.DoseName || '';
      this.Days = MedicineItemList.Days || 0;
      this.DoseName1 = MedicineItemList.DoseName1 || '';
      this.Day1 = MedicineItemList.Day1 || 0;
      this.DoseName2 = MedicineItemList.DoseName2 || '';
      this.Day2 = MedicineItemList.Day2 || 0;
      this.DoseId1 = MedicineItemList.DoseId1 || '';
      this.DoseId2 = MedicineItemList.DoseId2 || 0;
      this.DaysOption2 = MedicineItemList.DaysOption2 || 0;
      this.DaysOption3 = MedicineItemList.DaysOption3 || 0;
      this.DoseNameOption2 = MedicineItemList.DoseNameOption2 || '';
      this.DoseNameOption3 = MedicineItemList.DoseNameOption3 || '';
      this.ClassName = MedicineItemList.ClassName || '';
      this.GenericId = MedicineItemList.GenericId || 0;
      this.GenericName = MedicineItemList.GenericName || '';
      this.ClassID = MedicineItemList.ClassID || 0;
      this.DrugId = MedicineItemList.DrugId || 0;
      this.OPD_IPD_IP = MedicineItemList.OPD_IPD_IP || 0;
      this.PrecriptionId = MedicineItemList.PrecriptionId || 0;
      this.InstructionId = MedicineItemList.InstructionId || 0;
      this.Remark = MedicineItemList.Remark || '';
      this.DrugName = MedicineItemList.DrugName || '';
      this.drugName = MedicineItemList.drugName || '';
      this.BP = MedicineItemList.BP || 0;
      this.BSL = MedicineItemList.BSL || 0;
      this.Pulse = MedicineItemList.Pulse || 0;
      this.ChiefComplaint = MedicineItemList.ChiefComplaint || 0;
      this.DoseOption2 = MedicineItemList.DoseOption2 || 0;
      this.DoseOption3 = MedicineItemList.DoseOption3 || 0;
      this.pWeight = MedicineItemList.pWeight || 0;
      this.QtyPerDay = MedicineItemList.QtyPerDay || 0;
      this.mAssignItemToStores = MedicineItemList.mAssignItemToStores || [];
      this.pHeight = MedicineItemList.pHeight || 0;
      this.bmi = MedicineItemList.bmi || '';
      this.spO2 = MedicineItemList.spO2 || '';
      this.temp = MedicineItemList.temp || '';
      this.pulse = MedicineItemList.pulse || '';
      this.bsl = MedicineItemList.bsl || '';
      this.bp = MedicineItemList.bp || '';
      this.chiefComplaint = MedicineItemList.chiefComplaint || 0;
      this.diagnosis = MedicineItemList.diagnosis || '';
      this.examination = MedicineItemList.examination || '';
      this.followupDate = MedicineItemList.followupDate || '';
      this.advice = MedicineItemList.advice || '';
      this.doctorname = MedicineItemList.doctorname || '';
      this.patientReferDocId = MedicineItemList.patientReferDocId || '';
      this.doseName = MedicineItemList.doseName || ''
      this.genericName = MedicineItemList.genericName || ''
      this.days = MedicineItemList.days || ''
      this.storeId = MedicineItemList.storeId || ''
      this.storeName = MedicineItemList.storeName || ''
      this.instruction = MedicineItemList.instruction || ''
      this.precriptionId = MedicineItemList.precriptionId || ''
      this.opD_IPD_IP = MedicineItemList.opD_IPD_IP || ''
      this.classID = MedicineItemList.classID || ''
      this.className = MedicineItemList.className || ''
      this.genericId = MedicineItemList.genericId || ''
      this.drugId = MedicineItemList.durgId || ''
      this.doseId = MedicineItemList.doseId
      this.instructionId = MedicineItemList.instructionId
      this.instructionDescription = MedicineItemList.instructionDescription
      this.remark = MedicineItemList.remark
      this.totalQty = MedicineItemList.totalQty
      this.qtyPerDay = MedicineItemList.qtyPerDay
      this.doseOption2 = MedicineItemList.doseOption2
      this.doseNameOption2 = MedicineItemList.doseNameOption2
      this.daysOption2 = MedicineItemList.daysOption2
      this.doseOption3 = MedicineItemList.doseOption3
      this.doseNameOption3 = MedicineItemList.doseNameOption3
      this.daysOption3 = MedicineItemList.daysOption3
    }
  }
}

export class StoreDetail {
  storeId: any;
  // departmentName: any;

  constructor(StoreDetail) {
    {
      this.storeId = StoreDetail.storeId || "";
      // this.departmentName = StoreDetail.departmentName || "";
    }
  }
}

export class PrescriptionList {
  RegNo: any;
  PatientName: string;
  Date: any;
  Vst_Adm_Date: any;
  StoreName: any;
  PreNo: any;
  OPD_IPD_IP: any;
  AgeYear: any;
  GenderName: any;
  VisitDate: any;
  ConsultantDocName: any;
  DrugName: any;
  PrecriptionId: any;
  TotalQty: any;
  PDate: any;
  IPPreId: any;
  WardName: any;
  CompanyName: any;


  constructor(PrescriptionList) {
    this.RegNo = PrescriptionList.RegNo || 0;
    this.PatientName = PrescriptionList.PatientName || '';
    this.Date = PrescriptionList.Date || '01/01/1900';
    this.Vst_Adm_Date = PrescriptionList.Vst_Adm_Date || '01/01/1900';
    this.StoreName = PrescriptionList.StoreName || '01/01/1900';
    this.PreNo = PrescriptionList.PreNo || '';
    this.CompanyName = PrescriptionList.CompanyName || '01/01/1900';

  }
}

export class PrescriptiondetList {
  ItemName: any;
  Qty: number;

  constructor(PrescriptiondetList) {
    this.ItemName = PrescriptiondetList.ItemName;
    this.Qty = PrescriptiondetList.Qty;
  }
}

