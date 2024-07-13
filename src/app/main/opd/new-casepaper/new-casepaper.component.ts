import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PrescriptionList } from 'app/main/nursingstation/prescription/prescription.component';
import { PrecriptionItemList } from 'app/main/nursingstation/prescription/new-prescription/new-prescription.component';
import { ToastrService } from 'ngx-toastr';
import { MedicineItemList } from 'app/main/ipd/ip-search-list/discharge-summary/discharge-summary.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';

export interface PrescriptionTable {
  drugName: ILookup;
  // ItemID:

  doseName: any;
  days1: string;
  instruction: string;
  // doseNameOptional: any;
  // days2: string;
  // doseNameOptional3: any;
  // days3: string;
  isLocallyAdded: boolean;
}

export class ILookup {
  BalanceQty: number;
  ItemID: number;
  ItemName: string;
  UOM: string;
  UnitofMeasurementId: number;
}

interface dosedetail{
  DoseId: any;
  DoseName: any;
 
}
@Component({
  selector: 'app-new-casepaper',
  templateUrl: './new-casepaper.component.html',
  styleUrls: ['./new-casepaper.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewCasepaperComponent implements OnInit {


  isItemIdSelected: boolean = false;
  subscriptions: Subscription[] = [];
  reportPrintObj: CasepaperVisitDetails;
  printTemplate: any;
  reportPrintObjList: CasepaperVisitDetails[] = [];
  subscriptionArr: Subscription[] = [];
  regNo: any;
  patientName: any;
  doctorName: any;
  age: any;
  visitDate = '12/12/2021';
  ChiefComplaint: string;
  historyOptions = [
    { value: 'mri', viewValue: 'MRI Template' },
    { value: 'cough_cold', viewValue: 'Cough Cold Template' },
    { value: 'covid', viewValue: 'Covid' },
    { value: 'fracture', viewValue: 'Fracture' }
  ];
  currentDate = new Date();
  caseFormGroup: FormGroup;
  searchFormGroup: FormGroup;
  MedicineItemForm: FormGroup;
  // dsItemList: any = [];
  complaintList: any = [];
  examinationList: any = [];
  // historyList: any = [];
  diagnosisList: any = [];
  HistoryList: any = [];

  Height: any;
  Weight: any;
  BSL: any;
  BMI: any;
  BP: any;
  VisitId: any;
  Temp: any;
  SpO2: any;
  Pulse: any;
  doseList: any = [];
  drugList1: any = [];
  filteredDrugs$: Observable<ILookup[]>;
  filteredDrugs1$: Observable<ILookup[]>;

  filteredOptions: any;

  isDrugIdSelected: any;
  filteredOptionsItem: any;

  vDay: any;
  vInstruction: any;
  Chargelist: any = [];
  PatientType: any;
  // public filteredDiagnosis: ReplaySubject<any> = new ReplaySubject<any>(1);

  public filteredDose: ReplaySubject<any> = new ReplaySubject<any>(1);
  public filteredDrug: ReplaySubject<any> = new ReplaySubject<any>(1);
  // public filteredHistory: ReplaySubject<any> = new ReplaySubject<any>(1);
  // public filteredDiagnosis: ReplaySubject<any> = new ReplaySubject<any>(1);
  public filteredComplaint: ReplaySubject<any> = new ReplaySubject<any>(1);
  public filteredExamination: ReplaySubject<any> = new ReplaySubject<any>(1);


  public doseFilterCtrl: FormControl = new FormControl();
  public drugFilterCtrl: FormControl = new FormControl();
  public historyFilterCtrl: FormControl = new FormControl();
  public dignosFilterCtrl: FormControl = new FormControl();
  public complaintFilterCtrl: FormControl = new FormControl();
  public examinationFilterCtrl: FormControl = new FormControl();

  private lookups: ILookup[] = [];
  private nextPage$ = new Subject();
  private _onDestroy = new Subject();

  tbDays: any;
  Historyflist: any = [];
  Dignosflist: any = [];

  prescriptionData: PrescriptionTable[] = [];
  lookupsObj: ILookup = new ILookup();
  screenFromString = 'OP-billing';
  selectedAdvanceObj: AdmissionPersonlModel;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  filteredHistory: Observable<HistoryClass[]>;
  filteredDiagnosis: Observable<DiagnosisClass[]>;
  // filteredComplaint : Observable<ComplaintClass[]>;
  // filteredExamination : Observable<ExaminationClass[]>;

  historySelected: any[] = [];
  diagnosisSelected: any[] = [];
  allHistory: HistoryClass[] = [];
  allDiagnosis: DiagnosisClass[] = [];

  allExamination: ExaminationClass[] = [];
  allComplaint: ComplaintClass[] = [];


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

  vMobileNo: any;
  City: any;
  RegId: any;

  ItemForm: FormGroup;

  @ViewChild('historyInput') historyInput: ElementRef<HTMLInputElement>;
  @ViewChild('diagnosisInput') diagnosisInput: ElementRef<HTMLInputElement>;

  dsItemList = new MatTableDataSource<MedicineItemList>();
  // @ViewChild('historyInput') historyInput: ElementRef<HTMLInputElement>;
  // @ViewChild('diagnosisInput') diagnosisInput: ElementRef<HTMLInputElement>;

  isLoading = true;

  casePaperObj = new CasepaperVisitDetails({});

  VisitList: any;
  msg: any;
  selectedID: any;
  response: any = [];
  sIsLoading: string = '';
  noOptionFound: boolean = false;
  isRegIdSelected: boolean = false;
  registerObj = new AdmissionPersonlModel({});
  PatientName: any;
  MobileNo: any;
  VisitDate:any;
  DepartmentName:any;
  AgeMonth:any;
  AgeDay:any;
  GenderName:any;
  RefDocName:any;
  BedName:any;
  vClassName:any;
  add: boolean = false;
  ItemName: any;
  BalanceQty: any;
  vQty: any;
  ItemId: any;
  PresItemlist: any = [];
  vRemark: any;
  


  dsPresList = new MatTableDataSource<PrecriptionItemList>();
  dsafterPresList = new MatTableDataSource<PrecriptionItemList>();


  doseresults: dosedetail[] = [
    // { BillId: 1, PBillNo: '1', Amount:0},
    // { BillId: 2, PBillNo: '2',Amount:100 },
  ];


  filteredOptionsDosename: Observable<string[]>;

  @Input() dataArray: any;
  dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = [
    'ItemName',
    'DoseName',
    'Day',
    'Remark',
    'DoseName1',
    'Day1',
    'DoseName2',
    'Day2',
    'Action'
  ]

  displayedVisitColumns = [

    'VisitId',
    'VisitDate',
    'DocName'

  ];
  dataSource1 = new MatTableDataSource<CasepaperVisitDetails>();

  // displayClinicalColumns = [

  //   'VisitId',
  //   'VisitDate',
  //   'DocName'

  // ];
  dataSource2 = new MatTableDataSource<any>();

  displayClinicalColumns1 = [

    'DrugName',
    'DoseName',
    'QtyPerDay',
    'TotalQty'

  ];
  dataSource3 = new MatTableDataSource<OPDPrescription>();

  patientInfo: any;
  isRowAdded: boolean = false;

  constructor(
    private _FormBuilder: FormBuilder,
    private formBuilder: FormBuilder,
    private _CasepaperService: CasepaperService,
    private accountService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private advanceDataStored: AdvanceDataStored,
    private cdr: ChangeDetectorRef,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _WhatsAppEmailService: WhatsAppEmailService
  ) {
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj);
    this.VisitId=this.selectedAdvanceObj.VisitId
    }
  }

  ngOnInit(): void {

    this.MedicineItemForm = this.MedicineItemform();
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;

      console.log(this.selectedAdvanceObj);
    } else
      // this.selectedAdvanceObj =AdmissionPersonlModel;

      this.caseFormGroup = this.createForm();
    this.searchFormGroup = this.createSearchForm();
    // this.casepaperVisitDetails();
    // this.prescriptionDetails(this.VisitId);

    // this.getregisterList();
    // this.getVisistList();
    this.getHistoryList();

    // this.getHistoryList1();
    this.getDiagnosisList();
    this.getExaminationList();
    this.getComplaintList();
    this.getDrugList();
    this.getDoseList();
    this.dataSource.data = this.prescriptionData;
    this.addEmptyRow();

    this.filteredHistory = this.caseFormGroup.get('historyContoller').valueChanges.pipe(
      startWith(''),
      map((ele: any | null) => ele ? this._filterHistory(ele) : this.allHistory.slice()));

    this.filteredDiagnosis = this.caseFormGroup.get('diagnosisContoller').valueChanges.pipe(
      startWith(''),
      map((ele: any | null) => ele ? this._filterDiagnosis(ele) : this.allDiagnosis.slice()));

    this.filteredOptionsDosename = this.MedicineItemForm.get('DoseId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterDosename(value)),
    );


    this.doseFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDose();
      });

    this.drugFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDrug();
      });


    //   this.historyFilterCtrl.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.filterHistory();
    //   });

    // this.dignosFilterCtrl.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.filterDiagnosis();
    //   });

    this.complaintFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterComplaint();
      });


    this.examinationFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterExamination();
      });

    this.getPrescriptionListFill(this.VisitId);
  }


  MedicineItemform(): FormGroup {
    return this._formBuilder.group({
      ItemId: '',
      DoseId: '',
      Day: '',
      Instruction: '',
    });
  }

  createSearchForm() {
    return this.formBuilder.group({
      regRadio: ['registration'],
      regRadio1: ['registration1'],
      RegId: [''],
      Lhaed: ['true'],
      LangaugeRadio: ['Marathi'],
    });
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
  getSearchItemList() {
    if ((this.vOPIPId == '' || this.vOPIPId == '0')) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    var m_data = {
      "ItemName": `${this.MedicineItemForm.get('ItemId').value}%`,
      "StoreId": this.accountService.currentUserValue.user.storeId
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

  isDoseSelected: boolean = false;
  getOptionItemText(option) {
    this.ItemId = option.ItemID;
    if (!option) return '';
    return option.ItemName;
  }
  getSelectedObjItem(obj) {
    // console.log(obj)
    this.ItemId = obj.ItemId;
  }


  private _filterDosename(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoseName ? value.DoseName.toLowerCase() : value.toLowerCase();
      return this.doseList.filter(option => option.DoseName.toLowerCase().includes(filterValue));
    }
  }

  getDoseList() {
    this._CasepaperService.getDoseList().subscribe((data) => {
      this.doseList = data;
      console.log(this.doseList)
    });
    debugger
  }
  getdosedetail() {

    debugger
    if (this.doseList.length > 0) {
      this.doseList.forEach(element => {
        this.doseresults.push(element)
      });
      console.log(this.doseresults)
    }
  }

  getOptionTextDose(option) {
    return option && option.DoseName ? option.DoseName : '';
  }

  getOptionText1(option) {
    if (!option)
      return '';
    return option.FirstName + ' ' + option.MiddleName + ' ' + option.LastName;

  }

  getSelectedObj1(obj) {
    debugger
    console.log(obj)
    this.selectedAdvanceObj = obj;
    console.log(this.selectedAdvanceObj)
    this.dataSource.data = [];
    this.registerObj = obj;
    this.PatientName = obj.FirstName + " " + obj.LastName;
    this.RegId = obj.RegId;
    this.Doctorname = obj.Doctorname;
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
    this.RefDocName = obj.RefDocName
    this.BedName = obj.BedName;
    this.PatientType = obj.PatientType;
    this.prescriptionDetails(this.VisitId);
  }


  drugChange(event, index) {
    console.log(event, index);
    // this.dataSource.data.forEach((element, index1) => {
    //   if(element.drugName && index == index1) {
    //     element.drugName = event ? event : {};
    //   }
    // });
    const filter$ = this.caseFormGroup.get(`drugController${index}`).valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      filter(q => typeof q === "string"));

    this.filteredDrugs$ = filter$.pipe(
      switchMap(filter => {
        //Note: Reset the page with every new seach text
        let currentPage = 1;
        return this.nextPage$.pipe(
          startWith(currentPage),
          //Note: Until the backend responds, ignore NextPage requests.
          exhaustMap(_ => this.getDrugs(filter, currentPage)),
          tap(() => currentPage++),

          //Note: This is a custom operator because we also need the last emitted value.
          //Note: Stop if there are no more pages, or no results at all for the current search text.
          takeWhileInclusive(p => p.length > 0),
          scan((allProducts, newProducts) => allProducts.concat(newProducts), []),
        );
      }));
  }

  addChips(event: any, itemList, controller): void {
    const value = (event.value || '').trim();
    if (value) {
      itemList.push(value);
    }
    // event.chipInput!.clear();
    this.caseFormGroup.get(controller).setValue(null);
  }

  remove(item: any, itemList): void {
    const index = itemList.indexOf(item);

    if (index >= 0) {
      itemList.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent, itemList, controller, inputItem): void {

    if (itemList.length == 0) {
      itemList.push(event.option.value);
    } else {
      itemList.forEach(element => {
        if (element != event.option.value) {
          itemList.push(event.option.value);

          this.Historyflist = itemList;
          console.log(this.Historyflist);
        }
      });
    }
  
    this.caseFormGroup.get(controller).setValue(null);
  }

  selectedD(event: MatAutocompleteSelectedEvent, itemList, controller, inputItem): void {
    if (itemList.length == 0) {
      itemList.push(event.option.value);
    } else {
      itemList.forEach(element => {
        if (element != event.option.value) {
          itemList.push(event.option.value);

          this.Dignosflist = itemList;
          console.log(this.Dignosflist);
        }
      });
    }
    if (inputItem == 'diagnosisInput') {
      this.diagnosisInput.nativeElement.value = '';
    }
    //  else if (inputItem == 'diagnosisInput') {
    //   this.diagnosisInput.nativeElement.value = '';
    // }
    // inputItem.nativeElement.value = '';
    this.caseFormGroup.get(controller).setValue(null);
  }


  private _filterHistory(value: any) {
    const filterValue = (value && value.PastHistoryDescr) ? value.PastHistoryDescr.toLowerCase() : value.toLowerCase();

    return this.allHistory.filter(ele => ele.PastHistoryDescr.toLowerCase().includes(filterValue));
  }

  private _filterDiagnosis(value: any) {
    const filterValue = (value && value.ComplaintName) ? value.ComplaintName.toLowerCase() : value.toLowerCase();

    return this.allDiagnosis.filter(ele => ele.ComplaintName.toLowerCase().includes(filterValue));
  }


  // private _filterExamination(value: any) {
  //   const filterValue = (value && value.ExaminationDescr) ? value.ExaminationDescr.toLowerCase() : value.toLowerCase();

  //   return this.allExamination.filter(ele => ele.ExaminationDescr.toLowerCase().includes(filterValue));
  // }

  // private _filterComplaint(value: any) {
  //   const filterValue = (value && value.ComplaintName) ? value.ComplaintName.toLowerCase() : value.toLowerCase();

  //   return this.allComplaint.filter(ele => ele.ComplaintName.toLowerCase().includes(filterValue));
  // }

  SpinLoading:any=""
  viewgetIpprescriptionReportPdf(OP_IP_ID) {
    setTimeout(() => {
      this.SpinLoading = true;
      //  this.AdList=true;
      this._CasepaperService.getOpPrescriptionview(
        OP_IP_ID, 1
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "IP Prescription Viewer"
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

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  createForm() {
    return this.formBuilder.group({
      historyContoller: '',
      PastHistoryId: '',
      ChiefComplaint: '',
      DiagnosisId: '',
      regNoController: '',
      patientController: '',
      doctorController: '',
      ageController: '',
      visitController: '',
      histTextAreContrl: '',
      diagnosisContoller: '',
      diagnTextAreContrl: '',
      doseContoller: '',
      daysController: '',
      instructionController: '',
      remarkController: '',
      PastHistoryDescr: '',
      ComplaintName: '',
      Examination: '',
      BP:['', [
        Validators.required,
      ]],
      SpO2: ['', [
        Validators.required,
      ]],
      ConsultantDocName: '',
      BSL: '',
      BMI: '',
      CasePaperID: '0',
      Complaint: '',
      Diagnosis: '',
      DocName: '',
      Finding: '',
      Height: '',
      Investigations: '',
      PastHistory: '',
      PatientName: '',
      PersonalDetails: '',
      Pulse: ['', [
        Validators.required,
      ]],
      PresentHistory: '',
      RegID: '0',
      SecondDocRef: '0',
      Temp: ['', [
        Validators.required,
      ]],
      VisitDate: '',
      VisitId: '0',
      VisitTime: '',
      Weight: '',
      DrugName: '',
      TotalQty: '',
      HospitalName: '',
      HospitalAddress: '',
      Phone: '',
      IPPreId: '',
      DoseName: '',
      GenderName: '',
      PrecriptionId: '',
      Days: '0',
      Instruction: '',
      TotalDayes: '0',
      AgeYear: '0',
      OPDNo: '',
      RegNo: '0',
    });
  }

  // Fake backend api
  private getDrugs(startsWith: string, page: number): Observable<ILookup[]> {
    const take = 10;
    const skip = page > 0 ? (page - 1) * take : 0;
    const filtered = this.lookups
      .filter(option => option.ItemName.toLowerCase().startsWith(startsWith.toLowerCase()));
    return of(filtered.slice(skip, skip + take));
  }

  // private filterHistory(){
  //   if (!this.HistoryList) {
  //     return;
  //   }
  //   // get the search keyword
  //   let search = this.historyFilterCtrl.value;
  //   if (!search) {
  //     this.filteredHistory.next(this.HistoryList.slice());
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   // filter the diagnosis
  //   this.filteredHistory.next(
  //     this.HistoryList.filter(HisEl => HisEl.PastHistoryDescr.toLowerCase().indexOf(search) > -1)
  //   );

  // }
  // private filterDiagnosis() {
  //   if (!this.diagnosisList) {
  //     return;
  //   }
  //   // get the search keyword
  //   let search = this.dignosFilterCtrl.value;
  //   if (!search) {
  //     this.filteredDiagnosis.next(this.diagnosisList.slice());
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   // filter the diagnosis
  //   this.filteredDiagnosis.next(
  //     this.diagnosisList.filter(diagnosisEl => diagnosisEl.ComplaintName.toLowerCase().indexOf(search) > -1)
  //   );
  // } 
  private filterComplaint() {
    if (!this.complaintList) {
      return;
    }
    // get the search keyword
    let search = this.complaintFilterCtrl.value;
    if (!search) {
      this.filteredComplaint.next(this.complaintList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the diagnosis
    this.filteredComplaint.next(
      this.complaintList.filter(El => El.ComplaintName.toLowerCase().indexOf(search) > -1)
    );
  }

  private filterExamination() {
    if (!this.examinationList) {
      return;
    }
    // get the search keyword
    let search = this.examinationFilterCtrl.value;
    if (!search) {
      this.filteredExamination.next(this.examinationList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the diagnosis
    this.filteredExamination.next(
      this.examinationList.filter(El => El.ExaminationDescr.toLowerCase().indexOf(search) > -1)
    );
  }
  private filterDose() {

    if (!this.doseList) {
      return;
    }
    // get the search keyword
    let search = this.doseFilterCtrl.value;
    if (!search) {
      this.filteredDose.next(this.doseList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the history
    this.filteredDose.next(
      this.doseList.filter(doseEl => doseEl.DoseName.toLowerCase().indexOf(search) > -1)
    );
  }

  private filterDrug() {

    if (!this.drugList1) {
      return;
    }
    // get the search keyword
    let search = this.drugFilterCtrl.value;
    if (!search) {
      this.filteredDrug.next(this.drugList1.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the history
    this.filteredDrug.next(
      this.drugList1.filter(doseEl => doseEl.ItemName.toLowerCase().indexOf(search) > -1)
    );
  }

  casePaperData: CasepaperVisitDetails = new CasepaperVisitDetails({});

  // casepaperVisitDetails() {
  //   this._CasepaperService.getcasepaperVisitDetails(this.selectedAdvanceObj.AdmissionID).subscribe((data: CasepaperVisitDetails) => {
  //     this.casePaperData = data[0];
  //   });
  // }

    prescriptionDetails(VisitId) {
      debugger
      this._CasepaperService.RtrvPreviousprescriptionDetails(VisitId).subscribe((data: any) => {
        this.dataSource3 = data;
        this.dsItemList.data=data;
        console.log(this.dsItemList.data)
        this.Height=this.dsItemList.data[0]["Height"]
        this.Weight=this.dsItemList.data[0]["Weight"]
        this.BSL=this.dsItemList.data[0]["BSL"]
        this.BMI=this.dsItemList.data[0]["BSA"]
        this.BP=this.dsItemList.data[0]["BP"]
        this.Temp=this.dsItemList.data[0]["Temp"]
        this.SpO2=this.dsItemList.data[0]["SpO2"]
        this.Pulse=this.dsItemList.data[0]["Pluse"]
        console.log(this.dataSource3.data )
      });
    }



  getHistoryList() {
    this._CasepaperService.getHistoryList().subscribe((data: any) => {
      this.allHistory = data;
      console.log(this.allHistory);
      // this.casePaperData.PastHistory = 'M AS AMSAS, cc';

      let historyStringsArr = this.casePaperData.PastHistory.split(',');
      this.allHistory.forEach((elementHist, index) => {
        historyStringsArr.forEach(elementRetrieve => {
          if (elementHist.PastHistoryDescr == elementRetrieve) {
            this.historySelected.push(elementHist.PastHistoryDescr);
          }
        });
      });
    });
  }

  // getHistoryList1() {
  //   debugger;
  //   this._CasepaperService.getHistoryList().subscribe((data: any) => {
  //     this.HistoryList = data;
  //     console.log(data);
  //     console.log(this.HistoryList);
  //     this.filteredHistory.next(this.HistoryList.slice());
  //   });
  // }

  getDiagnosisList() {
    // debugger;
    this._CasepaperService.getDiagnosisList().subscribe((data: any) => {
      this.allDiagnosis = data;
      console.log(data);

      let dignosStringsArr = this.casePaperData.Diagnosis.split(',');
      this.allDiagnosis.forEach((elementDionos, index) => {
        dignosStringsArr.forEach(elementRetrieve => {
          if (elementDionos.ComplaintName == elementRetrieve) {
            this.diagnosisSelected.push(elementDionos.ComplaintName);
          }
        });
      });
    });
  }

  getDrugList() {
    debugger
    this._CasepaperService.getDrugList('%').subscribe((data: ILookup[]) => {
      this.lookups = data;
      this.drugList1 = data;
      this.filteredDrug.next(this.drugList1.slice());
    });
  }

  // getDoseList() {
  //   this._CasepaperService.getDoseList().subscribe((data) => {
  //     this.doseList = data;
  //     this.filteredDose.next(this.doseList.slice());
  //   });
  // }

  getComplaintList() {
    this._CasepaperService.getComplaintList().subscribe((data) => {
      this.complaintList = data;
      this.filteredComplaint.next(this.complaintList.slice());
    });

  }

  getExaminationList() {
    this._CasepaperService.getExaminationList().subscribe((data) => {
      this.examinationList = data;
      // this.filteredExamination.next(this.examinationList.slice());
    });

  }

  //   casePaperData: CasepaperVisitDetails = new CasepaperVisitDetails({});

  //   casepaperVisitDetails() {
  //     this._CasepaperService.casepaperVisitDetails(this.selectedAdvanceObj.AdmissionID).subscribe((data: CasepaperVisitDetails) => {
  //       this.casePaperData = data[0];
  //     });
  //   }




  //   getVisitList(){
  //     this._CasepaperService.getVisitedList().subscribe((data) => {
  //       this.examinationList = data;
  //       // this.filteredExamination.next(this.examinationList.slice());
  //     });

  //   }

  addSelectedOption(selectedElements, keyName) {
    let addedElement = '';
    if (selectedElements) {
      selectedElements.forEach(element => {
        addedElement += element[keyName] + ',\n';
      });
      if (keyName == 'PastHistoryDescr') {
        this.caseFormGroup.get('histTextAreContrl').setValue(addedElement);
      } else if (keyName == 'ComplaintName') {
        this.caseFormGroup.get('diagnTextAreContrl').setValue(addedElement);
      }
      // else if (keyName == 'DoseName') {
      //   this.caseFormGroup.get('diagnTextAreContrl').setValue(xx);
      // }
    }
  }

  getSelectedDrug(value, i) {
    // console.log('historyContoller==', this.caseFormGroup.get('historyContoller').value);
    console.log('controll===', value);
    this.caseFormGroup.get(`drugController${i}`).setValue(value);
    console.log(this.caseFormGroup.get(`drugController${i}`).value);

  }

  displayWith(lookup) {
    return lookup ? lookup.ItemName : null;
  }

  onScroll() {
    //Note: This is called multiple times after the scroll has reached the 80% threshold position.
    this.nextPage$.next();
  }

  onAddOption(fieldName) {
    if (fieldName == 'history') {
      // this.historyList.push({ PastHistoryDescr: this.historyFilterCtrl.value });
    } else if (fieldName == 'diagnosis') {
      this.diagnosisList.push({ ComplaintName: this.dignosFilterCtrl.value });
    }
  }


  addRow() {
    // debugger;
    let addingRow = {
      drugName: this.lookupsObj,
      doseName: '',
      days1: '',
      instruction: '',
      // doseNameOptional: '',
      // days2: '',
      // doseNameOptional3: '',
      // days3: '',
      isLocallyAdded: false
    }
    // this.caseFormGroup.get('doseContoller1').setValue(this.caseFormGroup.get('doseContoller').value.DoseName);
    // this.caseFormGroup.get('daysController1').setValue(this.caseFormGroup.get('daysController').value);
    this.prescriptionData.push(addingRow);
    this.dataSource.data = this.prescriptionData;

    // this.addEmptyRow();
  }


  addEmptyRow(element?: PrescriptionTable) {
    // debugger;
    if (this.caseFormGroup.invalid) {
      this.caseFormGroup.markAllAsTouched();
      this._snackBar.open('Please fill mandetory fields', 'Ok', {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 3000
      });
      return;
    }
    if (element) {
      this.isRowAdded = true;
      this.prescriptionData && this.prescriptionData.length > 0 ? this.prescriptionData.splice(this.prescriptionData.indexOf(element), 1) : '';
      console.log(this.prescriptionData);
    }
    let addingRow = {
      drugName: element && element.drugName ? element.drugName : this.lookupsObj,
      doseName: element && element.doseName ? element.doseName : '',
      days1: element && element.days1 ? element.days1 : '',
      instruction: element && element.instruction ? element.instruction : '',
      // doseNameOptional: element && element.doseNameOptional ? element.doseNameOptional : '',
      // days2: element && element.days2 ? element.days2 : '',
      // doseNameOptional3: element && element.doseNameOptional3 ? element.doseNameOptional3 : '',
      // days3: element && element.days3 ? element.days3 : '',
      isLocallyAdded: element ? true : false
    }
    this.prescriptionData.push(addingRow);
    this.dataSource.data = this.prescriptionData;
    // console.log(this.dataSource.data );
    // console.log(this.prescriptionData);
    element ? this.addRow() : '';
    this.caseFormGroup.addControl(`drugController${this.prescriptionData.length - 1}`, new FormControl());
    this.caseFormGroup.get(`drugController${this.prescriptionData.length - 1}`).setValidators(Validators.required);
  }
  onDelete(element) {
    let index = this.prescriptionData.indexOf(element);
    if (index !== -1) {
      this.prescriptionData.splice(index, 1);
    }
    this.dataSource.data = this.prescriptionData;
  }

  onSave() {
    this.dsItemList.data.forEach(element => {
      console.log(element)
    });
    
    if (this.dsItemList.data.length == 0) {
      Swal.fire('Error !', 'Please add before save', 'error');
    }
    debugger;
   let insertOPDPrescriptionarray=[];
    this.dsItemList.data.forEach(element => {
      let insertOPDPrescription = {};
      insertOPDPrescription['daysOption3'] =  parseInt(element.Day2.toString());
    insertOPDPrescription['ipMedID'] = 0;
    insertOPDPrescription['opD_IPD_IP'] = this.vOPIPId;
    insertOPDPrescription['opD_IPD_Type'] = 0;
    insertOPDPrescription['date'] =this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
    insertOPDPrescription['pTime'] = this.dateTimeObj.time;
    insertOPDPrescription['classID'] = this.vClassId;
    insertOPDPrescription['genericId'] = 1;
    insertOPDPrescription['drugId'] = element.ItemID;
    insertOPDPrescription['doseId'] =  element.DoseId || 0;
   
    insertOPDPrescription['days'] = element.Day || 0;
    insertOPDPrescription['qtyPerDay'] =0,// element.Qty || 0
    insertOPDPrescription['totalQty'] = 0,//element.Qty || 0;
    insertOPDPrescription['instructionId'] =1,// element.Instruction || '';
    insertOPDPrescription['qtyPerDay'] = 0;
    insertOPDPrescription['totalQty'] = 0;
    insertOPDPrescription['instruction'] =  element.Instruction || 1;
    insertOPDPrescription['remark'] = element.Instruction ;// this.myForm.get('WardName').value.RoomId || 0;
    insertOPDPrescription['isEnglishOrIsMarathi'] = 1 || '';
    insertOPDPrescription['pWeight'] =  this.caseFormGroup.get('Weight').value || 0;
    insertOPDPrescription['pulse'] = this.caseFormGroup.get('Pulse').value || 0;
    insertOPDPrescription['bp'] =  this.caseFormGroup.get('BP').value || 0;
    insertOPDPrescription['bsl'] = this.caseFormGroup.get('BSL').value || 0;
    insertOPDPrescription['chiefComplaint'] = '',//this.myForm.get('WardName').value.RoomId || 0;
    insertOPDPrescription['isAddBy'] = this._loggedService.currentUserValue.user.id;
    insertOPDPrescription['spO2'] =this.caseFormGroup.get('SpO2').value || 0;
    insertOPDPrescription['storeId'] = 1;
    insertOPDPrescription['doseOption2'] = element.DoseId1;
    insertOPDPrescription['daysOption2'] = parseInt(element.Day1.toString());
    insertOPDPrescription['doseOption3'] =  element.DoseId2;
   
    insertOPDPrescriptionarray.push(insertOPDPrescription);
   
    });
    
    let casePaperSaveObj = {};
    casePaperSaveObj['insertOPDPrescription'] = insertOPDPrescriptionarray;
    console.log(casePaperSaveObj);

    this._CasepaperService.onSaveCasepaper(casePaperSaveObj).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'Casepaper save Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {

            this.viewgetIpprescriptionReportPdf(this.vOPIPId);
            this.getWhatsappshareSales(this.vOPIPId,this.vMobileNo)
          }
        });
      } else {
        Swal.fire('Error !', 'Casepaper not saved', 'error');
      }

      
    });


  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  onEditVisitTable(row) {
    debugger;

    console.log(row);

    this.BP = row.BP;
    this.BSL = row.BSL;
    this.Height = row.Height;
    this.Weight = row.Weight;
    this.SpO2 = row.SpO2;
    this.Pulse = row.Pluse;
    this.VisitId = row.VisitId;
    // this.getPrescriptionListFill(70765);

  }

  BMIstatus='';
  getMeasures() {
    debugger;
 let height2= (this.caseFormGroup.get('Height').value * this.caseFormGroup.get('Height').value);
    const BMI = (this.caseFormGroup.get('Weight').value  / height2 )
    
    this.caseFormGroup.get('BMI').setValue(BMI.toFixed(2));

    if(BMI < 18.4)
      this.BMIstatus='Underweight'
    if(BMI > 18.5 && BMI< 24.9)
      this.BMIstatus='Normal'
    if(BMI > 25 && BMI< 39.9)
      this.BMIstatus='Overweight'
    if(BMI => 40)
      this.BMIstatus='Obese'
  }


  prescriptionList: OPDPrescription = new OPDPrescription({});

  getPrescriptionListFill(visitId) {
    debugger;
    this._CasepaperService.RtrvPreviousprescriptionDetails(visitId).subscribe(Visit => {
      this.dsItemList.data = Visit as MedicineItemList[];

      console.log(this.dsItemList.data);
    
      this.sIsLoading = '';

    })
  }

  getVisistList() {
    debugger;
    this.sIsLoading = 'loading';
    var D_data = {
      // "VisitId": 70765,//this.selectedAdvanceObj.VisitId,
      "VisitId":  this.VisitId,
    }
    console.log(D_data);
    this.sIsLoading = 'loading-data';
    this._CasepaperService.getVisitedList(D_data).subscribe(Visit => {
      this.dataSource1.data = Visit as CasepaperVisitDetails[];

      console.log(this.dataSource1.data);
      // this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';

    })

  }



  openCreatePrescriptionTemplate() {
    debugger;
    let xx = {
      RegNo: this.selectedAdvanceObj.RegNo,
      AdmissionID: this.selectedAdvanceObj.VisitId,
      IPDNo: this.selectedAdvanceObj.IPDNo,
      PatientName: this.selectedAdvanceObj.PatientName,
      Doctorname: this.selectedAdvanceObj.Doctorname,
      AdmDateTime: this.selectedAdvanceObj.AdmDateTime,
      AgeYear: this.selectedAdvanceObj.AgeYear,
      ClassId: this.selectedAdvanceObj.ClassId,
      TariffName: this.selectedAdvanceObj.TariffName,
      WardName: this.selectedAdvanceObj.RoomName,
      BedName: this.selectedAdvanceObj.BedName,
      TariffId: this.selectedAdvanceObj.TariffId,
      opD_IPD_Type: this.selectedAdvanceObj.opD_IPD_Type,
    };
    this.advanceDataStored.storage = new SearchInforObj(xx);

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

  Day1:any=0;
  Day2:any=0;

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
    debugger
    const iscekDuplicate = this.dsItemList.data.some(item => item.ItemID == this.ItemId)
    if (!iscekDuplicate) {
      this.dsItemList.data = [];
      this.Chargelist.push(
        {
          ItemID: this.MedicineItemForm.get('ItemId').value.ItemId || 0,
          ItemName: this.MedicineItemForm.get('ItemId').value.ItemName || '',
          DoseId:this.MedicineItemForm.get('DoseId').value.DoseId || 0,
          DoseName: this.MedicineItemForm.get('DoseId').value.DoseName || '',
          Day: this.vDay,
          DoseId1:this.MedicineItemForm.get('DoseId').value.DoseId || 0,
          DoseName1: this.MedicineItemForm.get('DoseId').value.DoseName || '',
          Day1:this.Day1,
          DoseId2:this.MedicineItemForm.get('DoseId').value.DoseId || 0,
          DoseName2: this.MedicineItemForm.get('DoseId').value.DoseName || '',
          Day2:this.Day1,
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
    this.MedicineItemForm.get('ItemId').reset('');
    this.MedicineItemForm.get('DoseId').reset('');
    this.MedicineItemForm.get('Day').reset('');
    this.MedicineItemForm.get('Instruction').reset('');
    this.itemid.nativeElement.focus();

    this.getdosedetail();
  }

  getdoseDetailValue1(element,event){
    element.DoseName1=event
    console.log(event,element)
  }

  getdoseDetailValue2(element,event){
    element.DoseName2=event
    console.log(event,element)
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
  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('dosename') dosename: ElementRef;
  @ViewChild('Day') Day: ElementRef;
  @ViewChild('Instruction') Instruction: ElementRef;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;

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
  


  @ViewChild('EHeight') EHeight: ElementRef;
  @ViewChild('EBSL') EBSL: ElementRef;
  @ViewChild('EWeight') EWeight: ElementRef;
  @ViewChild('ESpO2') ESpO2: ElementRef;
  @ViewChild('EPulse') EPulse: ElementRef;
  @ViewChild('EBMI') EBMI: ElementRef;
  @ViewChild('EBP') EBP: ElementRef;
  @ViewChild('ETemp') ETemp: ElementRef;


  public onEnterHeight(event): void {
    if (event.which === 13) {
      this.EWeight.nativeElement.focus();
    }
  }
 
  public onEnterWeight(event): void {
    if (event.which === 13) {
      this.ESpO2.nativeElement.focus();
      // if(this.mstatus) this.mstatus.focus();
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
      this.EBMI.nativeElement.focus();
    }
  }
  public onEnterBMI(event): void {
    if (event.which === 13) {
      this.EBP.nativeElement.focus();
      // if(this.mstatus) this.mstatus.focus();
    }
  }
  public onEnterBP(event): void {
    if (event.which === 13) {
      this.ETemp.nativeElement.focus();
      // if(this.mstatus) this.mstatus.focus();
    }

  }
  onEnterTemp(event): void {
    if (event.which === 13) {
      this.ETemp.nativeElement.focus();
      // if(this.mstatus) this.mstatus.focus();
    }
  }
  PrintMarathi() {

  }
  PrintEnglsih() {

  }
  onChangeLangaugeRadio(event) {

  }
  LetterheadFilter(event) {

  }
  onClear() {
    this.caseFormGroup.reset();
    this.searchFormGroup.get('RegId').reset();
    this.dsItemList.data=[];
    this.PatientName = " ";
    this.RegId = " ";
    this.Doctorname = " ";
    this.VisitDate = this.datePipe.transform(Date.now(), 'dd/MM/yyyy hh:mm a');
    this.CompanyName = " ";
    this.Tarrifname =" ";
    this.DepartmentName =" ";
    this.RegNo = " ";
    this.vOPIPId =" ";
    this.vOPDNo = " ";
    this.vTariffId = " ";
    this.vClassId = " ";
    this.AgeYear = " ";
    this.AgeMonth = " ";
    this.vClassName =" ";
    this.AgeDay =" ";
    this.GenderName = " ";
    this.RefDocName = " ";
    this.BedName = " ";
    this.PatientType = " ";
   }
}



export class HistoryClass {
  PastHistoryDescr: string;
  PastHistoryId: number;
}

export class DiagnosisClass {
  ComplaintName: string;
  DiagnosisId: number;
  // ComplaintName:any;
}

export class ComplaintClass {
  ComplaintName: string;
  ComplaintId: number;
}

export class ExaminationClass {
  ExaminationDescr: string;
  ExaminationId: number;
}

export class OPDPrescription {
  PrecriptionId: number;
  OPD_IPD_IP: number;
  OPD_IPD_Type: number;
  DateTime: Date;
  // DateTime:Time;
  ClassID: number;
  ClassName: string;
  GenericId: number;
  GenericName: string;
  DrugId: number;
  DoseId: number;
  DoseName: string;
  Days: number;
  InstructionId: number;
  DrugName: string;
  QtyPerDay: number;
  TotalQty: number;
  Instruction: string;
  InstructionDescription: string;
  Remark: string;
  IsEnglishOrIsMarathi: boolean;
  PWeight: string;
  Pulse: string;
  BP: string;
  BSL: string;
  ChiefComplaint: string;
  IsAddBy: number;
  SpO2: string;
  StoreId: number;
  RefDoctorId: number;

  constructor(opdPrescriptionDetails) {
    this.PrecriptionId = opdPrescriptionDetails.PrecriptionId || '';
    this.OPD_IPD_IP = opdPrescriptionDetails.OPD_IPD_IP || '';
    this.OPD_IPD_Type = opdPrescriptionDetails.OPD_IPD_Type || '';
    this.DateTime = opdPrescriptionDetails.DateTime || '';
    this.ClassID = opdPrescriptionDetails.ClassID || 0;
    this.ClassName = opdPrescriptionDetails.ClassName || '';
    this.GenericId = opdPrescriptionDetails.GenericId || '';
    this.GenericName = opdPrescriptionDetails.GenericName || '';
    this.DrugId = opdPrescriptionDetails.DrugId || '';
    this.DoseId = opdPrescriptionDetails.DoseId || '';
    this.DoseName = opdPrescriptionDetails.DoseName || '';
    this.Days = opdPrescriptionDetails.Days || '';
    this.InstructionId = opdPrescriptionDetails.InstructionId || '';
    this.DrugName = opdPrescriptionDetails.DrugName || '';
    this.QtyPerDay = opdPrescriptionDetails.QtyPerDay || '';
    this.TotalQty = opdPrescriptionDetails.TotalQty || '';
    this.Instruction = opdPrescriptionDetails.Instruction || 0;
    this.InstructionDescription = opdPrescriptionDetails.InstructionDescription || 0;
    this.SpO2 = opdPrescriptionDetails.SpO2 || '';
    this.Remark = opdPrescriptionDetails.Remark || '';
    this.IsEnglishOrIsMarathi = opdPrescriptionDetails.IsEnglishOrIsMarathi || 0;
    this.PWeight = opdPrescriptionDetails.PWeight || '';

    this.Pulse = opdPrescriptionDetails.Pulse || '';
    this.BP = opdPrescriptionDetails.BP || '';
    this.BSL = opdPrescriptionDetails.BSL || '';
    this.ChiefComplaint = opdPrescriptionDetails.ChiefComplaint || '';
    this.IsAddBy = opdPrescriptionDetails.IsAddBy || '';
    this.SpO2 = opdPrescriptionDetails.SpO2 || '';
    this.StoreId = opdPrescriptionDetails.StoreId || '';
    this.RefDoctorId = opdPrescriptionDetails.RefDoctorId || 0;

  }

}

export class CasepaperVisitDetails {
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
  DoseName: string;
  GenderName: string;
  PrecriptionId: number;
  Days: number;
  Instruction: String;
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



function takeWhileInclusive(arg0: (p: any) => boolean): import("rxjs").OperatorFunction<ILookup[], unknown> {
  throw new Error('Function not implemented.');
}

function NewAdmissionModel(arg0: {}): any {
  throw new Error('Function not implemented.');
}

