import { ChangeDetectorRef, Component, ElementRef, inject, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { PrescriptionList } from 'app/main/nursingstation/prescription/prescription.component';
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
  registerObj = new AdmissionPersonlModel({});
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
  Chargelist: any = [];
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
  vTemplateId:any;
  vServiceId: any;
  isServiceIdSelected: boolean = false;
  vFollowUpDays: any = 0;
  PatientReferDocId:any;
  AdvanceStorage:any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dsItemList = new MatTableDataSource<MedicineItemList>();
  dataSource1 = new MatTableDataSource<CasepaperVisitDetails>();
  dsItemList1 = new MatTableDataSource<MedicineItemList>();
  dsCopyItemList = new MatTableDataSource<MedicineItemList>();

  constructor(
    private _CasepaperService: CasepaperService,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private advanceDataStored: AdvanceDataStored,
    private cdr: ChangeDetectorRef,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _WhatsAppEmailService: WhatsAppEmailService,
    private configService: ConfigService,
       // @Inject(MAT_DIALOG_DATA) public data: any,
        //public dialogRef: MatDialogRef<NewCasepaperComponent>,
  ) { 
    if (this.advanceDataStored.storage) { 
      this.selectedAdvanceObj = this.advanceDataStored.storage; 
      //console.log( this.selectedAdvanceObj)
    } 
  }
  registerObj1:any;
  ngOnInit(): void { 
    this.searchFormGroup = this.createSearchForm();
    this.caseFormGroup = this.createForm();
    this.MedicineItemForm = this.MedicineItemform();
    if(this.selectedAdvanceObj){
      this.registerObj1 = this.selectedAdvanceObj
      console.log(this.registerObj1)
      this.AdvanceStorage = ''
      this.PatientName = this.registerObj1.FirstName + " " + this.registerObj1.LastName;
      this.RegId = this.registerObj1.RegId;
      this.Doctorname = this.registerObj1.Doctorname;
      this.VisitDate = this.datePipe.transform(this.registerObj1.VisitDate, 'dd/MM/yyyy hh:mm a');
      this.CompanyName = this.registerObj1.CompanyName;
      this.Tarrifname = this.registerObj1.TariffName;
      this.DepartmentName = this.registerObj1.DepartmentName;
      this.RegNo = this.registerObj1.RegNoWithPrefix;
      this.vOPIPId = this.registerObj1.VisitId;
      this.VisitId = this.registerObj1.VisitId;
      this.vOPDNo = this.registerObj1.OPDNo;
      this.vTariffId = this.registerObj1.TariffId;
      this.vClassId = this.registerObj1.ClassId;
      this.AgeYear = this.registerObj1.AgeYear;
      this.AgeMonth = this.registerObj1.AgeMonth;
      this.vClassName = this.registerObj1.ClassName;
      this.AgeDay = this.registerObj1.AgeDay;
      this.GenderName = this.registerObj1.GenderName;
      this.RefDocName = this.registerObj1.RefDocName
      this.BedName = this.registerObj1.BedName;
      this.PatientType = this.registerObj1.PatientType;
      this.vMobileNo = this.registerObj1.MobileNo;
      this.ConsultantDocId = this.registerObj1.DoctorId;
      this.getVitalInfo(this.registerObj1); 
      this.getpreviousVisitData(this.registerObj1);
      this.getnewVisistList(this.registerObj1);
      this.getServiceList();
      this.getVisistList();
      this.getRtrvTestService();
      this.getAdmittedDoctorCombo();
      this.getRtrvCheifComplaintList(this.registerObj1)
      this.selectedAdvanceObj = this.AdvanceStorage;
      console.log(this.selectedAdvanceObj)
    }
    this.getDoseList();
    this.specificDate = new Date();
    this.dateStyle = 'Day'
    this.onDaysChange();
    this.getDignosisList();
    this.getExaminList();
    this.getCheifComplaintList();
    this.getprestemplateList();
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
      if(this.vDays == '' || this.vDays == 0 || this.vDays == null || this.vDays == undefined)
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
      LangaugeRadio: ['True'],
      Height: '',
      Weight: '',
      BMI: '',
      BSL: '',
      SpO2: ['', [
        Validators.required,
      ]],
      Pulse: ['', [
        Validators.required,
      ]],
      BP: ['', [
        Validators.required,
      ]],
      Temp: ['', [
        Validators.required,
      ]],
      ChiefComplaint: '',
      Serviceid: '',
      Diagnosis: '',
      Examination: '',
      ExaminationControl:'',
      DiagnosisControl:'',
      CheifComplaintControl:''
    });
  }
  MedicineItemform() {
    return this._formBuilder.group({
      ItemId: '',
      DoseId: '',
      Day: '',
      Instruction: '',
      DoctorID: '',
      Departmentid: '',
      FollowupDays: '',
      start: [''],
      Remark: '',
      Days: '',
      FollowupMonths: '',
      FollowupYears: '',
      dateStylebtn: ['Day'],
      TemplateId:['']
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
  // Patient Search;
  getSearchList() {
    var m_data = {
      "Keyword": `${this.searchFormGroup.get('RegId').value}%`
    }
    this._CasepaperService.getPatientVisitedListSearch(m_data).subscribe(data => {
      this.PatientListfilteredOptions = data;
      if (this.PatientListfilteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
  ConsultantDocId:any;
  getSelectedObj1(obj) {
    console.log(obj)
    this.registerObj = obj;
    this.PatientName = obj.FirstName + " " + obj.LastName;
    this.RegId = obj.RegID;
    this.Doctorname = obj.DoctorName;
    this.VisitDate = this.datePipe.transform(obj.VisitDate, 'dd/MM/yyyy hh:mm a');
    this.CompanyName = obj.CompanyName;
    this.Tarrifname = obj.TariffName;
    this.DepartmentName = obj.DepartmentName;
    this.RegNo = obj.RegNo;
    this.vOPIPId = obj.VisitId;
    this.VisitId = obj.VisitId;
    this.vOPDNo = obj.OPDNo;
    this.vTariffId = obj.TariffId;
    this.vClassId = obj.ClassId;
    this.AgeYear = obj.AgeYear;
    this.AgeMonth = obj.AgeMonth;
    this.vClassName = obj.ClassName;
    this.AgeDay = obj.AgeDay;
    this.GenderName = obj.GenderName;
    this.RefDocName = obj.RefDoctorName
    this.BedName = obj.BedName;
    this.PatientType = obj.PatientType;
    this.vMobileNo = obj.MobileNo;
    this.ConsultantDocId = obj.ConsultantDocId;
    this.getVitalInfo(obj); 
    this.getpreviousVisitData(obj);
    this.getnewVisistList(obj);
    this.getServiceList();
    this.getVisistList();
    this.getRtrvTestService();
    this.getAdmittedDoctorCombo();
    this.getRtrvCheifComplaintList(obj)
   
  }
  getOptionText1(option) {
    if (!option)
      return '';
    return option.FirstName + ' ' + option.MiddleName + ' ' + option.LastName;
  }
  RefDocNameId: any;
  PrefollowUpDate: string;
  getpreviousVisitData(obj) {
    var mdata = {
      "visitId": obj.VisitId
    }
    this._CasepaperService.RtrvPreviousprescriptionDetails(mdata).subscribe(Visit => {
      this.dsItemList.data = Visit as MedicineItemList[];
      this.Chargelist = Visit as MedicineItemList[];
      console.log(this.dsItemList.data)  
      if (this.dsItemList.data.length > 0) {
        if(this.vitalInfo[0].Height > 0){
          this.vHeight = this.vitalInfo[0].Height;
          this.vWeight = this.vitalInfo[0].PWeight;
          this.vBMI = this.vitalInfo[0].BMI;
          this.vSpO2 = this.vitalInfo[0].SpO2;
          this.vTemp = this.vitalInfo[0].Temp;
          this.vPulse = this.vitalInfo[0].Pulse;
          this.vBSL = this.vitalInfo[0].BSL;
          this.vBP = this.vitalInfo[0].BP;
        }else{
          this.vHeight = this.dsItemList.data[0].PHeight;
          this.vWeight = this.dsItemList.data[0].PWeight;
          this.vBMI = this.dsItemList.data[0].BMI;
          this.vSpO2 = this.dsItemList.data[0].SpO2;
          this.vTemp = this.dsItemList.data[0].Temp;
          this.vPulse = this.dsItemList.data[0].Pulse;
          this.vBSL = this.dsItemList.data[0].BSL;
          this.vBP = this.dsItemList.data[0].BP;
        } 
        this.vChiefComplaint = this.dsItemList.data[0].ChiefComplaint;
        this.vDiagnosis = this.dsItemList.data[0].Diagnosis;
        this.vExamination = this.dsItemList.data[0].Examination;
        this.PrefollowUpDate = this.datePipe.transform(this.dsItemList.data[0].FollowupDate, 'MM/dd/YYYY');
        this.specificDate = new Date(this.PrefollowUpDate)
        this.MedicineItemForm.get('Remark').setValue(this.dsItemList.data[0].Advice)
        this.RefDocName = this.dsItemList.data[0].Doctorname
        this.PatientReferDocId = this.dsItemList.data[0].PatientReferDocId
        this.getAdmittedDoctorCombo();
      }
    });
  }
  vitalInfo:any;
getVitalInfo(obj){
  let query
  query ="select * from visitdetails where visitid=" + obj.VisitId
  //console.log(query)
  this._CasepaperService.getvitalInfo(query).subscribe(data=>{
    this.vitalInfo = data
    //console.log(this.vitalInfo) 
  })               
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

  //Prescription List
  getSearchItemList() {
    if ((this.vOPIPId == '' || this.vOPIPId == '0')) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    var m_data = {
      "ItemName": `${this.MedicineItemForm.get('ItemId').value}%`,
      "StoreId": this._loggedService.currentUserValue.user.storeId
    }
    console.log(m_data);
    this._CasepaperService.getItemlist(m_data).subscribe(data => {
      this.filteredOptionsItem = data;
       //console.log(this.filteredOptionsItem);
      this.filteredOptionsItem = data;
      if (this.filteredOptionsItem.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
  getOptionItemText(option) {
    this.ItemId = option.ItemID;
    if (!option) return '';
    return option.ItemName;
  }
  getSelectedObjItem(obj) {
    console.log(obj)
    this.ItemId = obj.ItemId;
    this.vDoseId = obj.DoseName
    this.vDay = obj.DoseDay
    this.vInstruction = obj.Instruction
    this.getDoseList();
  }
  vDoseId:any;
  getDoseList() {
    this._CasepaperService.getDoseList().subscribe((data) => {
      this.doseList = data;
      console.log(this.doseList)
      this.filteredOptionsDosename = this.MedicineItemForm.get('DoseId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDosename(value) : this.doseList.slice()),
      );
      if(this.vDoseId){
        const dvalue = this.doseList.filter(item=> item.DoseId == this.vDoseId)
        this.MedicineItemForm.get('DoseId').setValue(dvalue[0])
      }
    });
  }
  private _filterDosename(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoseName ? value.DoseName.toLowerCase() : value.toLowerCase();
      return this.doseList.filter(option => option.DoseName.toLowerCase().includes(filterValue));
    }
  }

  //Doctor list 
  getAdmittedDoctorCombo() {
    let DoctorName = '%';
    if(this.MedicineItemForm.get('DoctorID').value){
      DoctorName = this.MedicineItemForm.get('DoctorID').value
    }
    // else if(this.RefDocName){
    //   DoctorName = this.RefDocName
    // }
    var vdata = {
      "Keywords": DoctorName + "%" || "%"
    }
    console.log(vdata)
    this._CasepaperService.getAdmittedDoctorCombo(vdata).subscribe(data => {
      this.filteredOptionsDoc = data;
      console.log(this.filteredOptionsDoc)
      if (this.filteredOptionsDoc.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
      debugger
      if(this.PatientReferDocId > 0){
        const dvalue = this.filteredOptionsDoc.filter(item=> item.DoctorId == this.PatientReferDocId)
        console.log(dvalue)
        this.MedicineItemForm.get('DoctorID').setValue(dvalue[0])
      }
    });
  }
  getOptionTextDoctor(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }

  FilteredServicec: any;
  NooptionsService: any;
  getServiceList() {
    if (this.vClassId == '' || this.vTariffId == '' || this.vClassId == null || this.vTariffId == null) {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    var vdata = {
      'SrvcName': `${this.caseFormGroup.get('Serviceid').value}%`,
      'TariffId': this.vTariffId,
      'ClassId': this.vClassId
    }
    // console.log(vdata)
    this._CasepaperService.getServiceList(vdata).subscribe(data => {
      this.FilteredServicec = data;
      // console.log(this.FilteredServicec)
      if (this.FilteredServicec.length == 0) {
        this.NooptionsService = true;
      } else {
        this.NooptionsService = false;
      }
    });
  }
  RtrvTestServiceList: any = [];
  getRtrvTestService() {
    var vdata = {
      "VisitId": this.VisitId || 0
    }
    this._CasepaperService.getRtrvTestService(vdata).subscribe(data => {
      this.RtrvTestServiceList = data
      console.log(this.RtrvTestServiceList)
      if (this.RtrvTestServiceList) {
        this.RtrvTestServiceList.forEach(element => {
          this.selectedItems.push(
            {
              ServiceId: element.ServiceId || 0,
              ServiceName: element.ServiceName || ''
            });
        })
        console.log(this.selectedItems)
      }
    })
  }
  selectedItems = [];
  toggleSelection(item: any) {
    item.selected = !item.selected;
    if (item.selected) {
      if(this.selectedItems.find(data=> data.ServiceId == item.ServiceId)){
        this.toastr.warning(' Selected Test already added', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      this.selectedItems.push(item);
      console.log(this.selectedItems)
    } else {
      const i = this.selectedItems.findIndex(value => value.ServiceId === item.ServiceId);
      this.selectedItems.splice(i, 1);
    }
  }
  remove(item: string): void {
    const index = this.selectedItems.indexOf(item);
    if (index >= 0) {
      this.selectedItems.splice(index, 1);
    }
  }
  getOptionTextService(option) {
    return option && option.departmentName ? option.departmentName : '';
  }

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
  getOptionTextDose(option) {
    return option && option.DoseName ? option.DoseName : '';
  }


  Day1: any = 0;
  Day2: any = 0;
  onAdd() {

    if ((this.MedicineItemForm.get('ItemId').value == '' || this.MedicineItemForm.get('ItemId').value == null || this.MedicineItemForm.get('ItemId').value == undefined)) {
      this.toastr.warning('Please select Item', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.filteredOptionsItem.find(item => item.ItemName == this.MedicineItemForm.get('ItemId').value.ItemName)) {
      this.toastr.warning('Please select valid Item Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.MedicineItemForm.get('DoseId').value == '' || this.MedicineItemForm.get('DoseId').value == null || this.MedicineItemForm.get('DoseId').value == undefined)) {
      this.toastr.warning('Please select Dose', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.doseList.find(item => item.DoseName == this.MedicineItemForm.get('DoseId').value.DoseName)) {
      this.toastr.warning('Please select valid Dose Name', 'Warning !', {
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
    const iscekDuplicate = this.dsItemList.data.some(item => item.ItemID == this.ItemId)
    if (!iscekDuplicate) {
      //debugger
      let Qty = this.MedicineItemForm.get('DoseId').value.DoseQtyPerDay || 0
      this.Chargelist.push(
        { 
          DrugId: this.MedicineItemForm.get('ItemId').value.ItemId || 0,
          DrugName: this.MedicineItemForm.get('ItemId').value.ItemName || '',
          DoseId: this.MedicineItemForm.get('DoseId').value.DoseId || 0,
          DoseName: this.MedicineItemForm.get('DoseId').value.DoseName || '',
          Days: this.MedicineItemForm.get('Day').value || 0,
          QtyPerDay: this.MedicineItemForm.get('DoseId').value.DoseQtyPerDay || 0, 
          totalQty: (Qty *  this.MedicineItemForm.get('DoseId').value.DoseQtyPerDay) || 0,
          DoseId1: this.MedicineItemForm.get('DoseId').value.DoseId || 0,
          DoseName1: this.MedicineItemForm.get('DoseId').value.DoseName || '',
          Day1: this.Day1,
          DoseId2: this.MedicineItemForm.get('DoseId').value.DoseId || 0,
          DoseName2: this.MedicineItemForm.get('DoseId').value.DoseName || '',
          Day2: this.Day1,
          Instruction: this.vInstruction || ''
        });
      this.dsItemList.data = this.Chargelist
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
    this.itemid.nativeElement.focus();
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
  TemplateNameList:any=[];
  filteredtemplate:Observable<string[]>
getprestemplateList(){ 
  this._CasepaperService.getTemplateList().subscribe(data=>{
    this.TemplateNameList = data;
    this.filteredtemplate = this.MedicineItemForm.get('TemplateId').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._filterTemplatename(value) : this.TemplateNameList.slice()),
    );
  });
}
private _filterTemplatename(value: any): string[] {
  if (value) {
    const filterValue = value && value.PresTemplatename ? value.PresTemplatename.toLowerCase() : value.toLowerCase();
    return this.TemplateNameList.filter(option => option.PresTemplatename.toLowerCase().includes(filterValue));
  }
}
getOptionTextTemplate(option) {
  return option && option.PresTemplatename ? option.PresTemplatename : '';
}

onTemplDetAdd(){
    if ((this.vOPIPId == '' || this.vOPIPId == '0')) {
    this.toastr.warning('Please select Patient', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }
  if (this.vTemplateId == '' || this.vTemplateId == undefined || this.vTemplateId == null) {
    this.toastr.warning('Please select Template Name', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }

  const iscekDuplicate = this.dsItemList.data.some(item => item.Presid == this.MedicineItemForm.get('TemplateId').value.PresId )
  if (!iscekDuplicate) {
    var vdata ={
      'Presid':this.MedicineItemForm.get('TemplateId').value.PresId || 0
    }
    console.log(vdata)
    this._CasepaperService.getTempPrescriptionList(vdata).subscribe(data =>{
       this.dsItemList.data = data as MedicineItemList[]; 
       this.Chargelist = data as MedicineItemList[]; 
       console.log(this.dsItemList.data )
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
    if (this.addCheiflist) {
      this.addCheiflist.forEach(element => {
        this.AllTypeDescription.push(
          {
            DescriptionName: element.trim(),
            DescriptionType: "Complaint"
          }
        )
      })
    }
    if (this.addDiagnolist) {
      this.addDiagnolist.forEach(element => {
        this.AllTypeDescription.push(
          {
            DescriptionName: element.trim(),
            DescriptionType: "Diagnosis"
          }
        )
      })
    }
    if (this.addExaminlist) {
      this.addExaminlist.forEach(element => {
        this.AllTypeDescription.push(
          {
            DescriptionName: element.trim(),
            DescriptionType: "Examination"
          }
        )
      })
    }
    if (this.RegNo == '' || this.RegNo == undefined || this.RegNo == null) {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vHeight == '' || this.vHeight == undefined || this.vHeight == null || this.vHeight == '') {
      this.toastr.warning('Please enter Height', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vWeight == '' || this.vWeight == undefined || this.vWeight == null || this.vWeight == '') {
      this.toastr.warning('Please enter Weight', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.dsItemList.data.length == 0) {
      Swal.fire('Error !', 'Please add prescription', 'error');
      return
    }

    let ReferDocNameID = 0;
    if (this.MedicineItemForm.get('DoctorID').value){
      ReferDocNameID = this.MedicineItemForm.get('DoctorID').value.DoctorId || 0;
    }else{
      ReferDocNameID =   this.ConsultantDocId 
    } 

    let insertOPDPrescriptionarray = [];
    this.dsItemList.data.forEach(element => {
      let insertOPDPrescription = {};
      insertOPDPrescription['opD_IPD_IP'] = this.vOPIPId;
      insertOPDPrescription['opD_IPD_Type'] = 0;
      insertOPDPrescription['date'] = this.dateTimeObj.date,
      insertOPDPrescription['pTime'] = this.dateTimeObj.time;
      insertOPDPrescription['classID'] = this.vClassId;
      insertOPDPrescription['genericId'] = 1;
      insertOPDPrescription['drugId'] = element.DrugId || 0;
      insertOPDPrescription['doseId'] = element.DoseId || 0;
      insertOPDPrescription['days'] = element.Days || 0;
      insertOPDPrescription['instruction'] = element.Instruction || '';
      insertOPDPrescription['remark'] = '';
      insertOPDPrescription['doseOption2'] = element.DoseId1 || 0;
      insertOPDPrescription['daysOption2'] = 0 ,//parseInt(element.Day1.toString()) || 0;
      insertOPDPrescription['doseOption3'] = element.DoseId2 || 0;
      insertOPDPrescription['daysOption3'] = 0 ,///parseInt(element.Day2.toString()) || 0;
      insertOPDPrescription['instructionId'] = 0;
      insertOPDPrescription['qtyPerDay'] = element.QtyPerDay || 0;
      insertOPDPrescription['totalQty'] = (element.QtyPerDay * element.Days) || 0;
      insertOPDPrescription['isClosed'] = true;
      insertOPDPrescription['isEnglishOrIsMarathi'] = this.caseFormGroup.get('LangaugeRadio').value;
      insertOPDPrescription['chiefComplaint'] = this.caseFormGroup.get('ChiefComplaint').value || '';
      insertOPDPrescription['diagnosis'] = this.caseFormGroup.get('Diagnosis').value || '';
      insertOPDPrescription['examination'] = this.caseFormGroup.get('Examination').value || '';
      insertOPDPrescription['height'] = this.caseFormGroup.get('Height').value || '';
      insertOPDPrescription['pWeight'] = this.caseFormGroup.get('Weight').value || '';
      insertOPDPrescription['bmi'] = this.caseFormGroup.get('BMI').value || '';
      insertOPDPrescription['bsl'] = this.caseFormGroup.get('BSL').value || '';
      insertOPDPrescription['spO2'] = this.caseFormGroup.get('SpO2').value || '';
      insertOPDPrescription['temp'] = this.caseFormGroup.get('Temp').value || '';
      insertOPDPrescription['pulse'] = this.caseFormGroup.get('Pulse').value || '';
      insertOPDPrescription['bp'] = this.caseFormGroup.get('BP').value || '';
      insertOPDPrescription['storeId'] = this._loggedService.currentUserValue.user.storeId;
      insertOPDPrescription['patientReferDocId'] = ReferDocNameID || 0;
      insertOPDPrescription['advice'] = this.MedicineItemForm.get('Remark').value || '';
      insertOPDPrescription['isAddBy'] = this._loggedService.currentUserValue.user.id;

      insertOPDPrescriptionarray.push(insertOPDPrescription);
    });

    let update_VisitFollowupDatObj = {};
    update_VisitFollowupDatObj['visitId'] = this.VisitId || 0;
    update_VisitFollowupDatObj['followupDate'] = this.datePipe.transform(this.MedicineItemForm.get('start').value, "MM-dd-yyyy") || "01/01/1900";

    let opRequestList = [];
    if (this.selectedItems.length == 0) {
      let opRequestListObj = {};
      opRequestListObj['oP_IP_ID'] = this.vOPIPId;
      opRequestListObj['serviceId'] = 0
      opRequestList.push(opRequestListObj);
    } else {
      this.selectedItems.forEach(element => {
        let opRequestListObj = {};
        opRequestListObj['oP_IP_ID'] = this.vOPIPId;
        opRequestListObj['serviceId'] = element.ServiceId;
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
        OpDescriptinListObj['descriptionType'] = element.DescriptionType || '';
        OpDescriptinListObj['descriptionName'] = element.DescriptionName || '';
        OpDescriptinList.push(OpDescriptinListObj);
      });
    } 

    let delete_OPPrescriptionobj = {};
    delete_OPPrescriptionobj['oP_IP_ID'] = this.vOPIPId;

    let casePaperSaveObj = {
      "insertOPDPrescription": insertOPDPrescriptionarray,
      "update_VisitFollowupDate": update_VisitFollowupDatObj,
      "opRequestList": opRequestList,
      "delete_OPPrescription": delete_OPPrescriptionobj,
      "opCasepaperDignosisMaster":OpDescriptinList
    }
    console.log(casePaperSaveObj);

    this._CasepaperService.onSaveCasepaper(casePaperSaveObj).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'Casepaper save Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            debugger
            console.log(this.caseFormGroup.get("LetteHeadRadio").value )
            if(this.caseFormGroup.get("LetteHeadRadio").value == 'LetterHead'){
              this.viewgetOpprescriptionReportwithheaderPdf(this.VisitId);
            }else{
              this.viewgetOpprescriptionReportwithoutheaderPdf(this.VisitId);
            } 
            this.getWhatsappshareSales()
            this.onClear();
            this.onClose();
          }
        });
      } else {
        Swal.fire('Error !', 'Casepaper not saved', 'error');
      }
    });

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
    this.caseFormGroup.get('LangaugeRadio').setValue('True');
    this.MedicineItemForm.get('Remark').setValue('');
    this.MedicineItemForm.get('DoctorID').setValue('');
    this.selectedItems = [];
    this.addCheiflist = [];
    this.addDiagnolist = [];
    this.addExaminlist = [];
    this.specificDate = new Date();
    this.vDays = 10
    this.AllTypeDescription = [];
    this.getDignosisList();
    this.getExaminList();
    this.getCheifComplaintList();
  }
  onClose(){
   this._matDialog.closeAll();
  }
  SpinLoading: any = ""
  viewgetOpprescriptionReportwithheaderPdf(VisitId) {
    debugger
    setTimeout(() => {
      this.SpinLoading = true;
      //  this.AdList=true;
      this._CasepaperService.getOpPrescriptionview(
        VisitId
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

  viewgetOpprescriptionReportwithoutheaderPdf(VisitId) {
    debugger
    setTimeout(() => {
      this.SpinLoading = true;
      //  this.AdList=true;
      this._CasepaperService.getOpPrescriptionwithoutheaderview(
        VisitId
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

  getWhatsappshareSales() {
   // debugger
    if (this.vMobileNo != '' &&    this.vMobileNo != '0') {
      var m_data = {
        "insertWhatsappsmsInfo": {
          "mobileNumber":this.vMobileNo || 0,
          "smsString": '',
          "isSent": 0,
          "smsType": 'OPPRESCRIPTIONT',
          "smsFlag": 0,
          "smsDate": this.currentDate,
          "tranNo": this.vOPIPId,
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
  ///[^a-zA-Z0-9]/
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

  onEnterItem(event): void {
    if (event.which === 13) {
      this.dosename.nativeElement.focus();
    }
  }
  public onEnterDose(event): void {
    if (event.which === 13) {
      this.Day.nativeElement.focus();
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
 

  //datewise visit info and table data
  patients: any[] = []; // Using 'any' type for simplicity
  uniqueVisitId: string[] = [];
  uniqueDates: string[] = [];
  displayedColumns: string[] = ['patientName', 'age', 'gender'];
  getnewVisistList(obj) {
    this.sIsLoading = 'loading';
    var D_data = {
      "RegId": this.RegId,
    }
    console.log(D_data);
    this.sIsLoading = 'loading-data';
    this._CasepaperService.getRtrvVisitedList(D_data).subscribe(Visit => {
      this.patients = Visit as MedicineItemList[];
      this.extractUniqueDates();
    });
  }
  extractUniqueDates() {
    const VisitId = this.patients.map(patient => patient.VisitId);
    this.uniqueVisitId = Array.from(new Set(VisitId));
    // console.log(this.uniqueVisitId)


    // const Dates = this.patients.map(patient => patient.VisitDate);
    // this.uniqueDates = Array.from(new Set(Dates));
  }
  //datewise table data
  getFirstPatientForDate(VisitId: string) {
    return this.patients.filter(patient => patient.VisitId === VisitId); //
    
  }
  //datewise visit info date
  getPatientsForDate(VisitId: string) {
    const patientsForDate = this.patients.filter(patient => patient.VisitId === VisitId); 
    return patientsForDate.length > 0 ? [patientsForDate[0]] : []; // 
  }

  SelectedObj: any;
  //old 
  getVisistList() {
    this.sIsLoading = 'loading';
    var D_data = {
      "RegId": this.RegId,
    }
    //console.log(D_data);
    this.sIsLoading = 'loading-data';
    this._CasepaperService.getVisitedList(D_data).subscribe(Visit => {
      this.dataSource1.data = Visit as CasepaperVisitDetails[];
      //console.log(this.dataSource1.data);
      // this.VisitId = this.dataSource1.data[0].VisitId;
      // console.log(this.dataSource1.data[0].VisitId)
      this.dataSource1.sort = this.sort;
      this.dataSource1.paginator = this.paginator;
      this.sIsLoading = '';
    })
  }
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
  getPrescriptionListFill1(contact) {
    var mdata = {
      "visitid": contact.VisitId
    }
    this._CasepaperService.RtrvPreviousprescriptionDetails(mdata).subscribe(Visit => {
      this.dsItemList1.data = Visit as MedicineItemList[]; 
      this.SelectedObj = this.dsItemList1.data
      // console.log(this.dsItemList1.data);
      /// console.log(this.SelectedObj);
      if (this.dsItemList1.data.length > 0) {
        this.preHeight = this.SelectedObj[0].PHeight;
        this.preWeight = this.SelectedObj[0].PWeight;
        this.PreBMI = this.SelectedObj[0].BMI;
        this.preSPO = this.SelectedObj[0].SpO2;
        this.preTemp = this.SelectedObj[0].Temp;
        this.prePulse = this.SelectedObj[0].Pulse;
        this.preBSL = this.SelectedObj[0].BSL;
        this.preBP = this.SelectedObj[0].BP;
        this.preCheifComplaint = this.SelectedObj[0].ChiefComplaint;
        this.preDiagnosis = this.SelectedObj[0].Diagnosis;
        this.preExamination = this.SelectedObj[0].Examination;
      }
      this.sIsLoading = '';
    })
  }


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
      if(result){
        debugger
      this.dsCopyItemList.data = result
      console.log(this.dsCopyItemList.data)
     // this.dsItemList.data = [];
      this.dsCopyItemList.data.forEach(element => {
          const chkitem = this.dsItemList.data.find(item=> item.DrugId == element.DrugId);
        if(!chkitem){ 

        this.Chargelist.push(
          {
            PrecriptionId: element.PrecriptionId || 0,
            OPD_IPD_IP: element.OPD_IPD_IP || '',
            ClassID: element.ClassID || 0,
            ClassName: element.ClassName,
            GenericId: element.GenericId,
            GenericName: element.GenericName || 0,
            DrugId: element.DrugId || '',
            DoseId: element.DoseId || 0,
            DoseName: element.DoseName,
            Days: element.Days,
            InstructionId: element.InstructionId || 0,
            InstructionDescription: element.InstructionDescription || '',
            Remark: element.Remark || 0,
            DrugName: element.DrugName,
            Instruction: element.Instruction,
            TotalQty: 0,
            QtyPerDay: 0,
            PWeight: element.PWeight,
            Pulse: element.Pulse,
            BP: element.BP,
            BSL: element.BSL,
            ChiefComplaint: element.ChiefComplaint,
            DoseOption2: element.DoseOption2,
            DoseNameOption2: element.DoseNameOption2,
            DaysOption2: element.DaysOption2,
            DoseOption3: element.DoseOption3,
            DoseNameOption3: element.DoseNameOption3,
            DaysOption3: element.DaysOption3,
          });

        this.dsItemList.data = this.Chargelist;
        console.log(this.Chargelist)
        console.log(this.dsItemList.data)
      }else{
        this.toastr.warning('This Drug is already added', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      });
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
        maxHeight: "40vh",
        width: '100%',
        height: "100%",
        data:{
          Obj: this.dsItemList.data
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
 RtrvDescriptionList:any=[];
  getRtrvCheifComplaintList(obj) { 
    this.addCheiflist = [];
    this.addDiagnolist = [];
    this.addExaminlist = [];
    this.AllTypeDescription = [];
    var vdata={
      "VisitId":obj.VisitId
    }
    this._CasepaperService.getRtrvCheifComplaintList(vdata).subscribe(data => {
      this.RtrvDescriptionList = data;
      console.log(this.RtrvDescriptionList) 
      let Cheifcomplaint = this.RtrvDescriptionList.filter(item => item.DescriptionType == 'Complaint')
      if(Cheifcomplaint){
        Cheifcomplaint.forEach(element=>{
          const value = element.DescriptionName;
          this.addCheiflist.push(value.trim());
        })
      }
      let Diagnosis = this.RtrvDescriptionList.filter(item => item.DescriptionType == 'Diagnosis')
      if(Diagnosis){
        Diagnosis.forEach(element=>{
          const value = element.DescriptionName;
          this.addDiagnolist.push(value.trim()); 
        })
      }
      let Examination = this.RtrvDescriptionList.filter(item => item.DescriptionType == 'Examination')
      if(Examination){
        Examination.forEach(element=>{
          const value = element.DescriptionName;
          this.addExaminlist.push(value.trim()); 
        })
      } 
    }); 
  }
  //chipset cheifcomplaint
  CheifComplaintControl = new FormControl();
  ExaminationControl = new FormControl();
  DiagnosisControl = new FormControl(); 
  selectable = true;
  removable = true;
  HistoryList: any = [];
  addCheiflist: any = [];
  addDiagnolist: any = [];
  addExaminlist: any = [];

 
  filteredCheifComplaint:Observable<string[]>
  filteredDaignosis:Observable<string[]>
  filteredExamin:Observable<string[]>
  CheifCompListCombo:any=[];
  DaignoComboList:any=[];
  ExaminComboList:any=[];
 
  getCheifComplaintList() { 
    var vdata={
      "DescriptionType":"Complaint"
    }
    this._CasepaperService.getcheifcomplaintList(vdata).subscribe(data => {
      this.CheifCompListCombo = data;
      console.log(this.CheifCompListCombo)
      this.filteredCheifComplaint = this.CheifComplaintControl.valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filter(value) : this.CheifCompListCombo.slice()),
      );  
    }); 
  }
  private _filter(value: any): string[] {  
    if (value) {
      const filterValue = value && value.DescriptionName ? value.DescriptionName.toLowerCase() : value.toLowerCase();
      return this.CheifCompListCombo.filter(option => option.DescriptionName.toLowerCase().includes(filterValue));
    } 
  }
  getDignosisList() {
    var vdata={
      "DescriptionType":"Diagnosis"
    }
    this._CasepaperService.getcheifcomplaintList(vdata).subscribe(data => {
      this.DaignoComboList = data;
      console.log(this.DaignoComboList)
      this.filteredDaignosis = this.DiagnosisControl.valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDaignosis(value) : this.DaignoComboList.slice()),
      );
    });
  }
  private _filterDaignosis(value: any): string[] {
    if (value) {
      const filterValue = value && value.DescriptionName ? value.DescriptionName.toLowerCase() : value.toLowerCase();
      return this.DaignoComboList.filter(option => option.DescriptionName.toLowerCase().includes(filterValue));
    } 
  }
  getExaminList() {
    var vdata={
      "DescriptionType":"Examination"
    }
    this._CasepaperService.getcheifcomplaintList(vdata).subscribe(data => {
      this.ExaminComboList = data;
      console.log(this.ExaminComboList)
      this.filteredExamin = this.ExaminationControl.valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterExam(value) : this.ExaminComboList.slice()),
      );
    });
  }
  private _filterExam(value: any): string[] {
    if (value) {
      const filterValue = value && value.DescriptionName ? value.DescriptionName.toLowerCase() : value.toLowerCase();
      return this.ExaminComboList.filter(option => option.DescriptionName.toLowerCase().includes(filterValue));
    } 
  }
  //Cheifcomplaint
  AllTypeDescription:any=[]
  addCheif(event: any): void { 
    if(this.onSelecteCheif != 1){
      const input = event.input;
      const value = event.value;
      // Add cheif
      if ((value || '').trim()) {
        this.addCheiflist.push(value.trim());
  
        // this.AllTypeDescription.push(
        //   {
        //    DescriptionName :value.trim(),
        //    DescriptionType: "Complaint" 
        //   }
        // )
      }
      // Reset the input value
      if (input) {
        input.value = '';
      }
    } 
    console.log(this.AllTypeDescription) 
    this.onSelecteCheif = 0
  }
  removeCheif(cheif: string): void {
    const index = this.addCheiflist.indexOf(cheif);
    if (index >= 0) {
      this.addCheiflist.splice(index, 1);  
      console.log(index)
     // this.AllTypeDescription.splice(index, 1);
    }
  }
  onSelecteCheif:any=0;
  selectedobjCheif(obj): void { 
    this.onSelecteCheif = 1
    const value = obj.DescriptionName;
    if ((value || '').trim()) {
      this.addCheiflist.push(value.trim());
      // this.AllTypeDescription.push(
      //   {
      //    DescriptionName :value.trim(),
      //    DescriptionType: "Complaint" 
      //   }
      // )
    } 
  }
  //Diagnosis
  addDiagnos(event: any): void {
    if( this.onSelecteDaigno != 1){
      const input = event.input;
      const value = event.value;
      // Add cheif
      if ((value || '').trim()) {
        this.addDiagnolist.push(value.trim());
        // this.AllTypeDescription.push(
        //   {
        //    DescriptionName :value.trim(),
        //    DescriptionType: "Diagnosis" 
        //   }
        // )
      }
      // Reset the input value
      if (input) {
        input.value = '';
      }
    } 
    console.log(this.AllTypeDescription)
    this.onSelecteDaigno = 0
  }
  removeDiagno(Diagno: string): void {
    const index = this.addDiagnolist.indexOf(Diagno);
    if (index >= 0) {
      this.addDiagnolist.splice(index, 1);
     // this.AllTypeDescription.splice(index, 1); 
    }
  }
  onSelecteDaigno:any=0;
  selectedobjDiagno(obj): void {
    const value = obj.DescriptionName;
    this.onSelecteDaigno = 1
    if ((value || '').trim()) {
      this.addDiagnolist.push(value.trim());
      // this.AllTypeDescription.push(
      //   {
      //    DescriptionName :value.trim(),
      //    DescriptionType: "Diagnosis" 
      //   }
      // )
    }
  }
  //Examination
  addExamina(event: any): void {
    if(this.onSelecteExam != 1){
      const input = event.input;
      const value = event.value;
      // Add cheif
      if ((value || '').trim()) {
        this.addExaminlist.push(value.trim());
        // this.AllTypeDescription.push(
        //   {
        //    DescriptionName :value.trim(),
        //    DescriptionType: "Examination" 
        //   }
        // )
      }
      // Reset the input value
      if (input) {
        input.value = '';
      }
    } 
    console.log(this.AllTypeDescription)
    this.onSelecteExam = 0
  }
  removeExamin(Examin: string): void {
    const index = this.addExaminlist.indexOf(Examin);
    if (index >= 0) {
      this.addExaminlist.splice(index, 1);
      //this.AllTypeDescription.splice(index, 1);
    }
  }
  onSelecteExam:any=0;
  selectedobjExamin(obj): void {
    const value = obj.DescriptionName;
    this.onSelecteExam = 1
    if ((value || '').trim()) {
      this.addExaminlist.push(value.trim());
      // this.AllTypeDescription.push(
      //   {
      //    DescriptionName :value.trim(),
      //    DescriptionType: "Examination" 
      //   }
      // )
    }
  } 

  getItemMaster() { 
    const dialogRef = this._matDialog.open(AddItemComponent,
      {
        maxWidth: "60vw",
        maxHeight: "65vh",
        width: '100%',
        height: "100%" 
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  } 
  getDosemaster() { 
    const dialogRef = this._matDialog.open(DosemasterComponent,
      {
        maxWidth: "80vw",
        maxHeight: "80vh",
        width: '100%',
        height: "100%" 
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result); 
      this.getDoseList()
    });

  }
  //   subscriptions: Subscription[] = [];
  //   reportPrintObj: CasepaperVisitDetails;
  //   printTemplate: any;
  //   reportPrintObjList: CasepaperVisitDetails[] = [];
  //   subscriptionArr: Subscription[] = [];
  //   regNo: any;
  //   patientName: any;
  //   doctorName: any;
  //   age: any;
  //   visitDate = '12/12/2021'; 
  //   // dsItemList: any = [];
  //   complaintList: any = [];
  //   examinationList: any = [];
  //   // historyList: any = [];
  //   diagnosisList: any = [];
  //   HistoryList: any = []; 
  //   drugList1: any = [];
  //   filteredDrugs$: Observable<ILookup[]>;
  //   filteredDrugs1$: Observable<ILookup[]>;

  //   filteredOptions: any; 
  //   // public filteredDiagnosis: ReplaySubject<any> = new ReplaySubject<any>(1);

  //   public filteredDose: ReplaySubject<any> = new ReplaySubject<any>(1);
  //   public filteredDrug: ReplaySubject<any> = new ReplaySubject<any>(1);
  //   // public filteredHistory: ReplaySubject<any> = new ReplaySubject<any>(1);
  //   // public filteredDiagnosis: ReplaySubject<any> = new ReplaySubject<any>(1);
  //   public filteredComplaint: ReplaySubject<any> = new ReplaySubject<any>(1);
  //   public filteredExamination: ReplaySubject<any> = new ReplaySubject<any>(1);


  //   public doseFilterCtrl: FormControl = new FormControl();
  //   public drugFilterCtrl: FormControl = new FormControl();
  //   public historyFilterCtrl: FormControl = new FormControl();
  //   public dignosFilterCtrl: FormControl = new FormControl();
  //   public complaintFilterCtrl: FormControl = new FormControl();
  //   public examinationFilterCtrl: FormControl = new FormControl();

  //   private lookups: ILookup[] = [];
  //   private nextPage$ = new Subject();
  //   private _onDestroy = new Subject();

  //   tbDays: any;
  //   Historyflist: any = [];
  //   Dignosflist: any = [];

  //   prescriptionData: PrescriptionTable[] = [];
  //   lookupsObj: ILookup = new ILookup(); 
  //   
  //   selectable = true;
  //   removable = true;
  //   separatorKeysCodes: number[] = [ENTER, COMMA];

  //   filteredHistory: Observable<HistoryClass[]>;
  //   filteredDiagnosis: Observable<DiagnosisClass[]>;
  //   // filteredComplaint : Observable<ComplaintClass[]>;
  //   // filteredExamination : Observable<ExaminationClass[]>;

  //   historySelected: any[] = [];
  //   diagnosisSelected: any[] = [];
  //   allHistory: HistoryClass[] = [];
  //   allDiagnosis: DiagnosisClass[] = [];

  //   allExamination: ExaminationClass[] = [];
  //   allComplaint: ComplaintClass[] = [];

  //   @ViewChild('historyInput') historyInput: ElementRef<HTMLInputElement>;
  //   @ViewChild('diagnosisInput') diagnosisInput: ElementRef<HTMLInputElement>; 
  //   // @ViewChild('historyInput') historyInput: ElementRef<HTMLInputElement>;
  //   // @ViewChild('diagnosisInput') diagnosisInput: ElementRef<HTMLInputElement>;

  //   isLoading = true;

  //   casePaperObj = new CasepaperVisitDetails({});

  //   VisitList: any;
  //   msg: any;
  //   selectedID: any;
  //   response: any = []; 
  //   @Input() dataArray: any;
  //   dataSource = new MatTableDataSource<any>(); 

  //   // displayClinicalColumns = [

  //   //   'VisitId',
  //   //   'VisitDate',
  //   //   'DocName'

  //   // ];
  //   dataSource2 = new MatTableDataSource<any>();

  //   displayClinicalColumns1 = [

  //     'DrugName',
  //     'DoseName',
  //     'QtyPerDay',
  //     'TotalQty'

  //   ];
  //   dataSource3 = new MatTableDataSource<OPDPrescription>();

  //   patientInfo: any;
  //   isRowAdded: boolean = false; 

  //   drugChange(event, index) {
  //     console.log(event, index);
  //     // this.dataSource.data.forEach((element, index1) => {
  //     //   if(element.drugName && index == index1) {
  //     //     element.drugName = event ? event : {};
  //     //   }
  //     // });
  //     const filter$ = this.caseFormGroup.get(`drugController${index}`).valueChanges.pipe(
  //       startWith(''),
  //       debounceTime(200),
  //       filter(q => typeof q === "string"));

  //     this.filteredDrugs$ = filter$.pipe(
  //       switchMap(filter => {
  //         //Note: Reset the page with every new seach text
  //         let currentPage = 1;
  //         return this.nextPage$.pipe(
  //           startWith(currentPage),
  //           //Note: Until the backend responds, ignore NextPage requests.
  //           exhaustMap(_ => this.getDrugs(filter, currentPage)),
  //           tap(() => currentPage++),

  //           //Note: This is a custom operator because we also need the last emitted value.
  //           //Note: Stop if there are no more pages, or no results at all for the current search text.
  //           takeWhileInclusive(p => p.length > 0),
  //           scan((allProducts, newProducts) => allProducts.concat(newProducts), []),
  //         );
  //       }));
  //   }

  //   addChips(event: any, itemList, controller): void {
  //     const value = (event.value || '').trim();
  //     if (value) {
  //       itemList.push(value);
  //     }
  //     // event.chipInput!.clear();
  //     this.caseFormGroup.get(controller).setValue(null);
  //   }

  //   remove(item: any, itemList): void {
  //     const index = itemList.indexOf(item);

  //     if (index >= 0) {
  //       itemList.splice(index, 1);
  //     }
  //   }

  //   selected(event: MatAutocompleteSelectedEvent, itemList, controller, inputItem): void {

  //     if (itemList.length == 0) {
  //       itemList.push(event.option.value);
  //     } else {
  //       itemList.forEach(element => {
  //         if (element != event.option.value) {
  //           itemList.push(event.option.value);

  //           this.Historyflist = itemList;
  //           console.log(this.Historyflist);
  //         }
  //       });
  //     }

  //     this.caseFormGroup.get(controller).setValue(null);
  //   }

  //   selectedD(event: MatAutocompleteSelectedEvent, itemList, controller, inputItem): void {
  //     if (itemList.length == 0) {
  //       itemList.push(event.option.value);
  //     } else {
  //       itemList.forEach(element => {
  //         if (element != event.option.value) {
  //           itemList.push(event.option.value);

  //           this.Dignosflist = itemList;
  //           console.log(this.Dignosflist);
  //         }
  //       });
  //     }
  //     if (inputItem == 'diagnosisInput') {
  //       this.diagnosisInput.nativeElement.value = '';
  //     }
  //     //  else if (inputItem == 'diagnosisInput') {
  //     //   this.diagnosisInput.nativeElement.value = '';
  //     // }
  //     // inputItem.nativeElement.value = '';
  //     this.caseFormGroup.get(controller).setValue(null);
  //   }


  //   private _filterHistory(value: any) {
  //     const filterValue = (value && value.PastHistoryDescr) ? value.PastHistoryDescr.toLowerCase() : value.toLowerCase();

  //     return this.allHistory.filter(ele => ele.PastHistoryDescr.toLowerCase().includes(filterValue));
  //   }

  //   private _filterDiagnosis(value: any) {
  //     const filterValue = (value && value.ComplaintName) ? value.ComplaintName.toLowerCase() : value.toLowerCase();

  //     return this.allDiagnosis.filter(ele => ele.ComplaintName.toLowerCase().includes(filterValue));
  //   }


  //   // private _filterExamination(value: any) {
  //   //   const filterValue = (value && value.ExaminationDescr) ? value.ExaminationDescr.toLowerCase() : value.toLowerCase();

  //   //   return this.allExamination.filter(ele => ele.ExaminationDescr.toLowerCase().includes(filterValue));
  //   // }

  //   // private _filterComplaint(value: any) {
  //   //   const filterValue = (value && value.ComplaintName) ? value.ComplaintName.toLowerCase() : value.toLowerCase();

  //   //   return this.allComplaint.filter(ele => ele.ComplaintName.toLowerCase().includes(filterValue));
  //   // }


  //   // Fake backend api
  //   private getDrugs(startsWith: string, page: number): Observable<ILookup[]> {
  //     const take = 10;
  //     const skip = page > 0 ? (page - 1) * take : 0;
  //     const filtered = this.lookups
  //       .filter(option => option.ItemName.toLowerCase().startsWith(startsWith.toLowerCase()));
  //     return of(filtered.slice(skip, skip + take));
  //   }

  //   casePaperData: CasepaperVisitDetails = new CasepaperVisitDetails({});

  //     prescriptionDetails(VisitId) {
  //       debugger
  //       this._CasepaperService.RtrvPreviousprescriptionDetails(VisitId).subscribe((data: any) => {
  //         this.dataSource3 = data;
  //         this.dsItemList.data=data;
  //         console.log(this.dsItemList.data)
  //         this.Height=this.dsItemList.data[0]["Height"]
  //         this.Weight=this.dsItemList.data[0]["Weight"]
  //         this.BSL=this.dsItemList.data[0]["BSL"]
  //         this.BMI=this.dsItemList.data[0]["BSA"]
  //         this.BP=this.dsItemList.data[0]["BP"]
  //         this.Temp=this.dsItemList.data[0]["Temp"]
  //         this.SpO2=this.dsItemList.data[0]["SpO2"]
  //         this.Pulse=this.dsItemList.data[0]["Pluse"]
  //         console.log(this.dataSource3.data )
  //       });
  //     }


  //   getHistoryList() {
  //     this._CasepaperService.getHistoryList().subscribe((data: any) => {
  //       this.allHistory = data;
  //       console.log(this.allHistory);
  //       // this.casePaperData.PastHistory = 'M AS AMSAS, cc';

  //       let historyStringsArr = this.casePaperData.PastHistory.split(',');
  //       this.allHistory.forEach((elementHist, index) => {
  //         historyStringsArr.forEach(elementRetrieve => {
  //           if (elementHist.PastHistoryDescr == elementRetrieve) {
  //             this.historySelected.push(elementHist.PastHistoryDescr);
  //           }
  //         });
  //       });
  //     });
  //   }

  //   // getHistoryList1() {
  //   //   debugger;
  //   //   this._CasepaperService.getHistoryList().subscribe((data: any) => {
  //   //     this.HistoryList = data;
  //   //     console.log(data);
  //   //     console.log(this.HistoryList);
  //   //     this.filteredHistory.next(this.HistoryList.slice());
  //   //   });
  //   // }

  //   getDiagnosisList() {
  //     // debugger;
  //     this._CasepaperService.getDiagnosisList().subscribe((data: any) => {
  //       this.allDiagnosis = data;
  //       console.log(data);

  //       let dignosStringsArr = this.casePaperData.Diagnosis.split(',');
  //       this.allDiagnosis.forEach((elementDionos, index) => {
  //         dignosStringsArr.forEach(elementRetrieve => {
  //           if (elementDionos.ComplaintName == elementRetrieve) {
  //             this.diagnosisSelected.push(elementDionos.ComplaintName);
  //           }
  //         });
  //       });
  //     });
  //   }

  //   getDrugList() {
  //     debugger
  //     this._CasepaperService.getDrugList('%').subscribe((data: ILookup[]) => {
  //       this.lookups = data;
  //       this.drugList1 = data;
  //       this.filteredDrug.next(this.drugList1.slice());
  //     });
  //   }

  //   // getDoseList() {
  //   //   this._CasepaperService.getDoseList().subscribe((data) => {
  //   //     this.doseList = data;
  //   //     this.filteredDose.next(this.doseList.slice());
  //   //   });
  //   // }

  //   getComplaintList() {
  //     this._CasepaperService.getComplaintList().subscribe((data) => {
  //       this.complaintList = data;
  //       this.filteredComplaint.next(this.complaintList.slice());
  //     });

  //   }

  //   getExaminationList() {
  //     this._CasepaperService.getExaminationList().subscribe((data) => {
  //       this.examinationList = data;
  //       // this.filteredExamination.next(this.examinationList.slice());
  //     });

  //   }

  //   //   casePaperData: CasepaperVisitDetails = new CasepaperVisitDetails({});

  //   //   casepaperVisitDetails() {
  //   //     this._CasepaperService.casepaperVisitDetails(this.selectedAdvanceObj.AdmissionID).subscribe((data: CasepaperVisitDetails) => {
  //   //       this.casePaperData = data[0];
  //   //     });
  //   //   } 

  //   //   getVisitList(){
  //   //     this._CasepaperService.getVisitedList().subscribe((data) => {
  //   //       this.examinationList = data;
  //   //       // this.filteredExamination.next(this.examinationList.slice());
  //   //     });

  //   //   }

  //   addSelectedOption(selectedElements, keyName) {
  //     let addedElement = '';
  //     if (selectedElements) {
  //       selectedElements.forEach(element => {
  //         addedElement += element[keyName] + ',\n';
  //       });
  //       if (keyName == 'PastHistoryDescr') {
  //         this.caseFormGroup.get('histTextAreContrl').setValue(addedElement);
  //       } else if (keyName == 'ComplaintName') {
  //         this.caseFormGroup.get('diagnTextAreContrl').setValue(addedElement);
  //       }
  //       // else if (keyName == 'DoseName') {
  //       //   this.caseFormGroup.get('diagnTextAreContrl').setValue(xx);
  //       // }
  //     }
  //   }

  //   getSelectedDrug(value, i) {
  //     // console.log('historyContoller==', this.caseFormGroup.get('historyContoller').value);
  //     console.log('controll===', value);
  //     this.caseFormGroup.get(`drugController${i}`).setValue(value);
  //     console.log(this.caseFormGroup.get(`drugController${i}`).value);

  //   }

  //   displayWith(lookup) {
  //     return lookup ? lookup.ItemName : null;
  //   }

  //   onScroll() {
  //     //Note: This is called multiple times after the scroll has reached the 80% threshold position.
  //     this.nextPage$.next();
  //   }

  //   onAddOption(fieldName) {
  //     if (fieldName == 'history') {
  //       // this.historyList.push({ PastHistoryDescr: this.historyFilterCtrl.value });
  //     } else if (fieldName == 'diagnosis') {
  //       this.diagnosisList.push({ ComplaintName: this.dignosFilterCtrl.value });
  //     }
  //   } 

  //   addRow() {
  //     // debugger;
  //     let addingRow = {
  //       drugName: this.lookupsObj,
  //       doseName: '',
  //       days1: '',
  //       instruction: '',
  //       // doseNameOptional: '',
  //       // days2: '',
  //       // doseNameOptional3: '',
  //       // days3: '',
  //       isLocallyAdded: false
  //     }
  //     // this.caseFormGroup.get('doseContoller1').setValue(this.caseFormGroup.get('doseContoller').value.DoseName);
  //     // this.caseFormGroup.get('daysController1').setValue(this.caseFormGroup.get('daysController').value);
  //     this.prescriptionData.push(addingRow);
  //     this.dataSource.data = this.prescriptionData;

  //     // this.addEmptyRow();
  //   }


  //   addEmptyRow(element?: PrescriptionTable) {
  //     // debugger;
  //     if (this.caseFormGroup.invalid) {
  //       this.caseFormGroup.markAllAsTouched();
  //       this._snackBar.open('Please fill mandetory fields', 'Ok', {
  //         horizontalPosition: 'end',
  //         verticalPosition: 'bottom',
  //         duration: 3000
  //       });
  //       return;
  //     }
  //     if (element) {
  //       this.isRowAdded = true;
  //       this.prescriptionData && this.prescriptionData.length > 0 ? this.prescriptionData.splice(this.prescriptionData.indexOf(element), 1) : '';
  //       console.log(this.prescriptionData);
  //     }
  //     let addingRow = {
  //       drugName: element && element.drugName ? element.drugName : this.lookupsObj,
  //       doseName: element && element.doseName ? element.doseName : '',
  //       days1: element && element.days1 ? element.days1 : '',
  //       instruction: element && element.instruction ? element.instruction : '',
  //       // doseNameOptional: element && element.doseNameOptional ? element.doseNameOptional : '',
  //       // days2: element && element.days2 ? element.days2 : '',
  //       // doseNameOptional3: element && element.doseNameOptional3 ? element.doseNameOptional3 : '',
  //       // days3: element && element.days3 ? element.days3 : '',
  //       isLocallyAdded: element ? true : false
  //     }
  //     this.prescriptionData.push(addingRow);
  //     this.dataSource.data = this.prescriptionData;
  //     // console.log(this.dataSource.data );
  //     // console.log(this.prescriptionData);
  //     element ? this.addRow() : '';
  //     this.caseFormGroup.addControl(`drugController${this.prescriptionData.length - 1}`, new FormControl());
  //     this.caseFormGroup.get(`drugController${this.prescriptionData.length - 1}`).setValidators(Validators.required);
  //   }
  //   onDelete(element) {
  //     let index = this.prescriptionData.indexOf(element);
  //     if (index !== -1) {
  //       this.prescriptionData.splice(index, 1);
  //     }
  //     this.dataSource.data = this.prescriptionData;
  //   } 

  //   ngAfterViewChecked() {
  //     this.cdr.detectChanges();
  //   } 

  //   ngOnDestroy() {
  //     this._onDestroy.next();
  //     this._onDestroy.complete();
  //   } 

  //   onEditVisitTable(row) {
  //     debugger;

  //     console.log(row);

  //     this.BP = row.BP;
  //     this.BSL = row.BSL;
  //     this.Height = row.Height;
  //     this.Weight = row.Weight;
  //     this.SpO2 = row.SpO2;
  //     this.Pulse = row.Pluse;
  //     this.VisitId = row.VisitId;
  //     // this.getPrescriptionListFill(70765);

  //   } 
  //   prescriptionList: OPDPrescription = new OPDPrescription({});

  //   getPrescriptionListFill(visitId) {
  //     debugger;
  //     this._CasepaperService.RtrvPreviousprescriptionDetails(visitId).subscribe(Visit => {
  //       this.dsItemList.data = Visit as MedicineItemList[];
  //       console.log(this.dsItemList.data);

  //       if(this.dsItemList.data.length > 0){
  //       this.dsItemList.data.forEach(element => {
  //         element.Day1=element.DaysOption2
  //         element.Day2=element.DaysOption3

  //         element.DoseName1=element.DoseNameOption2.DoseName
  //         element.DoseName2=element.DoseNameOption3.DoseName
  //         element.DoseId1=element.DoseNameOption2.DoseId
  //         element.DoseName2=element.DoseNameOption3.DoseName

  //       });
  //       }
  //       this.sIsLoading = '';

  //     })
  //   }




  //   openCreatePrescriptionTemplate() {
  //     debugger;
  //     let xx = {
  //       RegNo: this.selectedAdvanceObj.RegNo,
  //       AdmissionID: this.selectedAdvanceObj.VisitId,
  //       IPDNo: this.selectedAdvanceObj.IPDNo,
  //       PatientName: this.selectedAdvanceObj.PatientName,
  //       Doctorname: this.selectedAdvanceObj.Doctorname,
  //       AdmDateTime: this.selectedAdvanceObj.AdmDateTime,
  //       AgeYear: this.selectedAdvanceObj.AgeYear,
  //       ClassId: this.selectedAdvanceObj.ClassId,
  //       TariffName: this.selectedAdvanceObj.TariffName,
  //       WardName: this.selectedAdvanceObj.RoomName,
  //       BedName: this.selectedAdvanceObj.BedName,
  //       TariffId: this.selectedAdvanceObj.TariffId,
  //       opD_IPD_Type: this.selectedAdvanceObj.opD_IPD_Type,
  //     };
  //     this.advanceDataStored.storage = new SearchInforObj(xx);

  //   }  
  //   PrintMarathi() {

  //   }
  //   PrintEnglsih() {

  //   } 

  // export class HistoryClass {
  //   PastHistoryDescr: string;
  //   PastHistoryId: number;
  // }

  // export class DiagnosisClass {
  //   ComplaintName: string;
  //   DiagnosisId: number;
  //   // ComplaintName:any;
  // }

  // export class ComplaintClass {
  //   ComplaintName: string;
  //   ComplaintId: number;
  // }

  // export class ExaminationClass {
  //   ExaminationDescr: string;
  //   ExaminationId: number;
  // }

  // export class OPDPrescription {
  //   PrecriptionId: number;
  //   OPD_IPD_IP: number;
  //   OPD_IPD_Type: number;
  //   DateTime: Date;
  //   // DateTime:Time;
  //   ClassID: number;
  //   ClassName: string;
  //   GenericId: number;
  //   GenericName: string;
  //   DrugId: number;
  //   DoseId: number;
  //   DoseName: string;
  //   Days: number;
  //   InstructionId: number;
  //   DrugName: string;
  //   QtyPerDay: number;
  //   TotalQty: number;
  //   Instruction: string;
  //   InstructionDescription: string;
  //   Remark: string;
  //   IsEnglishOrIsMarathi: boolean;
  //   PWeight: string;
  //   Pulse: string;
  //   BP: string;
  //   BSL: string;
  //   ChiefComplaint: string;
  //   IsAddBy: number;
  //   SpO2: string;
  //   StoreId: number;
  //   RefDoctorId: number;

  //   constructor(opdPrescriptionDetails) {
  //     this.PrecriptionId = opdPrescriptionDetails.PrecriptionId || '';
  //     this.OPD_IPD_IP = opdPrescriptionDetails.OPD_IPD_IP || '';
  //     this.OPD_IPD_Type = opdPrescriptionDetails.OPD_IPD_Type || '';
  //     this.DateTime = opdPrescriptionDetails.DateTime || '';
  //     this.ClassID = opdPrescriptionDetails.ClassID || 0;
  //     this.ClassName = opdPrescriptionDetails.ClassName || '';
  //     this.GenericId = opdPrescriptionDetails.GenericId || '';
  //     this.GenericName = opdPrescriptionDetails.GenericName || '';
  //     this.DrugId = opdPrescriptionDetails.DrugId || '';
  //     this.DoseId = opdPrescriptionDetails.DoseId || '';
  //     this.DoseName = opdPrescriptionDetails.DoseName || '';
  //     this.Days = opdPrescriptionDetails.Days || '';
  //     this.InstructionId = opdPrescriptionDetails.InstructionId || '';
  //     this.DrugName = opdPrescriptionDetails.DrugName || '';
  //     this.QtyPerDay = opdPrescriptionDetails.QtyPerDay || '';
  //     this.TotalQty = opdPrescriptionDetails.TotalQty || '';
  //     this.Instruction = opdPrescriptionDetails.Instruction || 0;
  //     this.InstructionDescription = opdPrescriptionDetails.InstructionDescription || 0;
  //     this.SpO2 = opdPrescriptionDetails.SpO2 || '';
  //     this.Remark = opdPrescriptionDetails.Remark || '';
  //     this.IsEnglishOrIsMarathi = opdPrescriptionDetails.IsEnglishOrIsMarathi || 0;
  //     this.PWeight = opdPrescriptionDetails.PWeight || '';

  //     this.Pulse = opdPrescriptionDetails.Pulse || '';
  //     this.BP = opdPrescriptionDetails.BP || '';
  //     this.BSL = opdPrescriptionDetails.BSL || '';
  //     this.ChiefComplaint = opdPrescriptionDetails.ChiefComplaint || '';
  //     this.IsAddBy = opdPrescriptionDetails.IsAddBy || '';
  //     this.SpO2 = opdPrescriptionDetails.SpO2 || '';
  //     this.StoreId = opdPrescriptionDetails.StoreId || '';
  //     this.RefDoctorId = opdPrescriptionDetails.RefDoctorId || 0;

  //   }
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
  _matDialog: any;
  RegNo: any;
  Temp: any;
  DepartmentName: any;
  Address: any;
  SecondRefDoctorName: any;
  VistDateTime: any;
  Qty:any;


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
  PWeight: any;
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
  PHeight: any;
  Diagnosis: any;
  Examination: any;
  Temp: any;
  Advice: any;
  BMI: any;
  SpO2: any;
  Doctorname: any;
  FollowupDate: any;
  QtyPerDay:any;
  Presid:any;
  PatientReferDocId:any;
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
      this.PWeight = MedicineItemList.PWeight || 0;
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
      this.BP = MedicineItemList.BP || 0;
      this.BSL = MedicineItemList.BSL || 0;
      this.Pulse = MedicineItemList.Pulse || 0;
      this.ChiefComplaint = MedicineItemList.ChiefComplaint || 0;
      this.DoseOption2 = MedicineItemList.DoseOption2 || 0;
      this.DoseOption3 = MedicineItemList.DoseOption3 || 0;
      this.PWeight = MedicineItemList.PWeight || 0;
      this.QtyPerDay = MedicineItemList.QtyPerDay || 0;
    }
  }
}



// function takeWhileInclusive(arg0: (p: any) => boolean): import("rxjs").OperatorFunction<ILookup[], unknown> {
//   throw new Error('Function not implemented.');
// }

// function NewAdmissionModel(arg0: {}): any {
//   throw new Error('Function not implemented.');


