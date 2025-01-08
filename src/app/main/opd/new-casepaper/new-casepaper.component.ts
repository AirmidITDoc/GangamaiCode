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
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

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


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dsItemList = new MatTableDataSource<MedicineItemList>();
  dataSource1 = new MatTableDataSource<CasepaperVisitDetails>();
  dsItemList1 = new MatTableDataSource<MedicineItemList>();
  dsCopyItemList = new MatTableDataSource<MedicineItemList>();

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
    public _WhatsAppEmailService: WhatsAppEmailService,
    private configService: ConfigService,
  ) { }

  ngOnInit(): void {

    this.searchFormGroup = this.createSearchForm();
    this.caseFormGroup = this.createForm();
    this.MedicineItemform();
    this.getDoseList();
    this.specificDate = new Date();
    this.dateStyle = 'Day'
    this.onDaysChange();
    this.getHistoryList();
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
    this.MedicineItemForm = this._formBuilder.group({
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
    this.getpreviousVisitData(obj);
    this.getnewVisistList(obj);
    this.getServiceList();
    this.getVisistList();
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
      // console.log(this.dsItemList.data)
      if (this.dsItemList.data.length > 0) {
        this.vHeight = this.dsItemList.data[0].PHeight;
        this.vWeight = this.dsItemList.data[0].PWeight;
        this.vBMI = this.dsItemList.data[0].BMI;
        this.vSpO2 = this.dsItemList.data[0].SpO2;
        this.vTemp = this.dsItemList.data[0].Temp;
        this.vPulse = this.dsItemList.data[0].Pulse;
        this.vBSL = this.dsItemList.data[0].BSL;
        this.vBP = this.dsItemList.data[0].BP;
        this.vChiefComplaint = this.dsItemList.data[0].ChiefComplaint;
        this.vDiagnosis = this.dsItemList.data[0].Diagnosis;
        this.vExamination = this.dsItemList.data[0].Examination;
        this.PrefollowUpDate = this.datePipe.transform(this.dsItemList.data[0].FollowupDate, 'MM/dd/YYYY');
        this.specificDate = new Date(this.PrefollowUpDate)
        this.MedicineItemForm.get('Remark').setValue(this.dsItemList.data[0].Advice)
        this.RefDocName = this.dsItemList.data[0].Doctorname
        this.getAdmittedDoctorCombo();
      }
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
      "StoreId": this._loggedService.currentUserValue.storeId
    }
    console.log(m_data);
    this._CasepaperService.getItemlist(m_data).subscribe(data => {
      this.filteredOptionsItem = data;
      // console.log(this.data);
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
    this.ItemId = obj.ItemId;
  }

  getDoseList() {
    this._CasepaperService.getDoseList().subscribe((data) => {
      this.doseList = data;
      console.log(this.doseList)
      this.filteredOptionsDosename = this.MedicineItemForm.get('DoseId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDosename(value) : this.doseList.slice()),
      );
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

    var vdata = {
      "Keywords": this.MedicineItemForm.get('DoctorID').value + "%" || "%"
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
  selectedItems = [];
  toggleSelection(item: any) {
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedItems.push(item);
    } else {
      const i = this.selectedItems.findIndex(value => value.ServiceId === item.ServiceId);
      this.selectedItems.splice(i, 1);
    }
  }
  remove(e) {
    this.toggleSelection(e);
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
    
    if (this.RegNo == '' || this.RegNo == undefined || this.RegNo == null) {
      this.toastr.warning('Please select patient', 'Warning !', {
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
      insertOPDPrescription['storeId'] = this._loggedService.currentUserValue.storeId;
      insertOPDPrescription['patientReferDocId'] = ReferDocNameID || 0;
      insertOPDPrescription['advice'] = this.MedicineItemForm.get('Remark').value || '';
      insertOPDPrescription['isAddBy'] = this._loggedService.currentUserValue.userId;

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

    let delete_OPPrescriptionobj = {};
    delete_OPPrescriptionobj['oP_IP_ID'] = this.vOPIPId;

    let casePaperSaveObj = {
      "insertOPDPrescription": insertOPDPrescriptionarray,
      "update_VisitFollowupDate": update_VisitFollowupDatObj,
      "opRequestList": opRequestList,
      "delete_OPPrescription": delete_OPPrescriptionobj
    }
    console.log(casePaperSaveObj);

    this._CasepaperService.onSaveCasepaper(casePaperSaveObj).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'Casepaper save Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            
            if(this.caseFormGroup.get("LetteHeadRadio").value=='LetterHead')
            this.viewgetOpprescriptionReportwithheaderPdf();
          else
          this.viewgetOpprescriptionReportwithoutheaderPdf();
            this.getWhatsappshareSales(this.vOPIPId, this.vMobileNo)
            this.onClear();
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
  LetterheadFilter(event) {

  }

  //datewise visit info and table data
  patients: any[] = []; // Using 'any' type for simplicity
  uniqueDates: string[] = [];
  displayedColumns: string[] = ['patientName', 'age', 'gender'];
  getnewVisistList(obj) {
    this.sIsLoading = 'loading';
    var D_data = {
      "RegId": obj.RegID,
    }
    console.log(D_data);
    this.sIsLoading = 'loading-data';
    this._CasepaperService.getRtrvVisitedList(D_data).subscribe(Visit => {
      this.patients = Visit as MedicineItemList[];
      this.extractUniqueDates();
    });
  }
  extractUniqueDates() {
    const dates = this.patients.map(patient => patient.VisitDate);
    this.uniqueDates = Array.from(new Set(dates));
  }
  //datewise table data
  getFirstPatientForDate(date: string) {
    return this.patients.filter(patient => patient.VisitDate === date); //
  }
  //datewise visit info date
  getPatientsForDate(date: string) {
    const patientsForDate = this.patients.filter(patient => patient.VisitDate === date);
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
      this.dsCopyItemList.data = result
      console.log(this.dsCopyItemList.data)
      this.dsItemList.data = [];
      this.dsCopyItemList.data.forEach(element => {

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
      });
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

  //chipset cheifcomplaint
  // CheifComplaintControl = new FormControl();
  // ExaminationControl = new FormControl();
  // DiagnosisControl = new FormControl();
  filteredHistory: Observable<string[]>;
  selectable = true;
  removable = true;
  HistoryList: any = [];
  addCheiflist: any = [];
  addDiagnolist: any = [];
  addExaminlist: any = [];




  getHistoryList() {
    this._CasepaperService.getcheifcomplaintList().subscribe(data => {
      this.HistoryList = data;
      console.log(this.HistoryList)
      this.filteredHistory = this.caseFormGroup.get('ChiefComplaint').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filter(value) : this.HistoryList.slice()),
      );
    });
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.HistoryList.filter(item => item.toLowerCase().includes(filterValue));
  }
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
  removeCheif(cheif: string): void {
    const index = this.addCheiflist.indexOf(cheif);
    if (index >= 0) {
      this.addCheiflist.splice(index, 1);
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


export class PrescriptionList{
  RegNo :any;
  PatientName: string;
  Date:any;
  Vst_Adm_Date:any;
  StoreName:any;
  PreNo:any;
  OPD_IPD_IP:any;
  AgeYear:any;
  GenderName:any;
  VisitDate:any;
  ConsultantDocName:any;
  DrugName:any;
  PrecriptionId:any;
  TotalQty:any;
  PDate:any;
  IPPreId:any;
  WardName:any;
  CompanyName:any;
  

  constructor(PrescriptionList) {
    this.RegNo=PrescriptionList.RegNo || 0;
    this.PatientName=PrescriptionList.PatientName || '';
    this.Date=PrescriptionList.Date  || '01/01/1900';
    this.Vst_Adm_Date=PrescriptionList.Vst_Adm_Date || '01/01/1900';
    this.StoreName=PrescriptionList.StoreName || '01/01/1900';
    this.PreNo=PrescriptionList.PreNo || '';
    this.CompanyName=PrescriptionList.CompanyName || '01/01/1900';

  }
}

export class PrescriptiondetList{
  ItemName: any;
  Qty:number;

  constructor(PrescriptiondetList){
    this.ItemName=PrescriptiondetList.ItemName;
    this.Qty=PrescriptiondetList.Qty;
  }
}

