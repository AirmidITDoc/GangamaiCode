import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, ReplaySubject, Subject, Subscription, of } from 'rxjs';
import { SearchInforObj } from '../opd-search-list/opd-search-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, exhaustMap, filter, map, scan, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { ViewCasepaperComponent } from './view-casepaper/view-casepaper.component';

import { OPSearhlistService } from '../op-searhlist.service';
import { fuseAnimations } from '@fuse/animations';


export interface PrescriptionTable {
  drugName: ILookup;

  doseName: any;
  days1: string;
  instruction: string;

  isLocallyAdded: boolean;
}

export class ILookup {
  BalanceQty: number;
  ItemID: number;
  ItemName: string;
  UOM: string;
  UnitofMeasurementId: number;
}

@Component({
  selector: 'app-op-casepaper',
  templateUrl: './op-casepaper.component.html',
  styleUrls: ['./op-casepaper.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OPCasepaperComponent implements OnInit {

  subscriptions: Subscription[] = [];
  reportPrintObj: CasepaperVisitDetails;
  printTemplate: any;
  reportPrintObjList: CasepaperVisitDetails[] = [];
  subscriptionArr: Subscription[] = [];
  regNo: any = 1234;
  patientName: any = 'xyz xyz';
  doctorName: any = 'abc abc';
  age: any = 18;
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
  drugList: any = [];
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
  Pluse: any;
  doseList: any = [];
  drugList1: any = [];
  filteredDrugs$: Observable<ILookup[]>;
  filteredDrugs1$: Observable<ILookup[]>;


  public filteredDose: ReplaySubject<any> = new ReplaySubject<any>(1);
  public filteredDrug: ReplaySubject<any> = new ReplaySubject<any>(1);

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
  selectedAdvanceObj: SearchInforObj;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  filteredHistory: Observable<HistoryClass[]>;
  filteredDiagnosis: Observable<DiagnosisClass[]>;

  historySelected: any[] = [];
  diagnosisSelected: any[] = [];
  allHistory: HistoryClass[] = [];
  allDiagnosis: DiagnosisClass[] = [];

  allExamination: ExaminationClass[] = [];
  allComplaint: ComplaintClass[] = [];

  @ViewChild('historyInput') historyInput: ElementRef<HTMLInputElement>;
  @ViewChild('diagnosisInput') diagnosisInput: ElementRef<HTMLInputElement>;

  isLoading = true;

  casePaperObj = new CasepaperVisitDetails({});

  VisitList: any;
  msg: any;
  selectedID: any;
  response: any = [];
  sIsLoading: string = '';

  @Input() dataArray: any;
  dataSource = new MatTableDataSource<any>();
  displayedPrescriptionColumns: string[] = [
    'drugName',
    'doseName',
    'days1',
    'instruction',
    // 'doseOptional',
    // 'days2',
    // 'doseOptional3',
    // 'days3',
    'action'
  ];

  displayedVisitColumns = [

    'VisitId',
    'VisitDate',
    'DocName'

  ];
  dataSource1 = new MatTableDataSource<CasepaperVisitDetails>();

  displayClinicalColumns = [

    'VisitId',
    'VisitDate',
    'DocName'

  ];
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
    private dialogRef: MatDialogRef<OPCasepaperComponent>,
    private formBuilder: FormBuilder,
    private _matDialog: MatDialog,
    private _opSearchListService: OPSearhlistService,
    private accountService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private advanceDataStored: AdvanceDataStored,
    private cdr: ChangeDetectorRef,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
    this.patientInfo = data;
    console.log(this.patientInfo);
  }

  ngOnInit(): void {


    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj);
    }

    this.caseFormGroup = this.createForm();
    this.casepaperVisitDetails();
    // this.prescriptionDetails();

    this.getregisterList();

    this.getHistoryList();
    this.getDiagnosisList();
    this.getExaminationList();
    this.getComplaintList();

    this.getDrugList();
    this.getDoseList();
    this.addEmptyRow();

    this.filteredHistory = this.caseFormGroup.get('historyContoller').valueChanges.pipe(
      startWith(''),
      map((ele: any | null) => ele ? this._filterHistory(ele) : this.allHistory.slice()));

    this.filteredDiagnosis = this.caseFormGroup.get('diagnosisContoller').valueChanges.pipe(
      startWith(''),
      map((ele: any | null) => ele ? this._filterDiagnosis(ele) : this.allDiagnosis.slice()));


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

    this.getPrescriptionListFill(70765);
  }

  drugChange(event, index) {

    const filter$ = this.caseFormGroup.get(`drugController${index}`).valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      filter(q => typeof q === "string"));

    this.filteredDrugs$ = filter$.pipe(
      switchMap(filter => {

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

      BP: '',
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
      Pluse: '',
      PresentHistory: '',
      RegID: '0',
      SecondDocRef: '0',
      SPO2: '',
      Temp: '',
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
      _matDialog: '',
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

  casepaperVisitDetails() {
    this._opSearchListService.getcasepaperVisitDetails(this.selectedAdvanceObj.AdmissionID).subscribe((data: CasepaperVisitDetails) => {
      this.casePaperData = data[0];
    });
  }

  //   prescriptionDetails() {
  //     this._opSearchListService.prescriptionDetails(this.selectedAdvanceObj.AdmissionID).subscribe((data: any) => {
  //       // this.allHistory = data;
  //     });
  //   }



  getHistoryList() {
    this._opSearchListService.getHistoryList().subscribe((data: any) => {
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
  //   this._opSearchListService.getHistoryList().subscribe((data: any) => {
  //     this.HistoryList = data;
  //     console.log(data);
  //     console.log(this.HistoryList);
  //     this.filteredHistory.next(this.HistoryList.slice());
  //   });
  // }

  getDiagnosisList() {
    // debugger;
    this._opSearchListService.getDiagnosisList().subscribe((data: any) => {
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
    this._opSearchListService.getDrugList('%').subscribe((data: ILookup[]) => {
      this.lookups = data;
      this.drugList1 = data;
      this.filteredDrug.next(this.drugList1.slice());
    });
  }

  getDoseList() {
    this._opSearchListService.getDoseList().subscribe((data) => {
      this.doseList = data;
      this.filteredDose.next(this.doseList.slice());
    });
  }

  getComplaintList() {
    this._opSearchListService.getComplaintList().subscribe((data) => {
      this.complaintList = data;
      this.filteredComplaint.next(this.complaintList.slice());
    });

  }

  getExaminationList() {
    this._opSearchListService.getExaminationList().subscribe((data) => {
      this.examinationList = data;
      // this.filteredExamination.next(this.examinationList.slice());
    });

  }

  //   casePaperData: CasepaperVisitDetails = new CasepaperVisitDetails({});

  //   casepaperVisitDetails() {
  //     this._opSearchListService.casepaperVisitDetails(this.selectedAdvanceObj.AdmissionID).subscribe((data: CasepaperVisitDetails) => {
  //       this.casePaperData = data[0];
  //     });
  //   }




  //   getVisitList(){
  //     this._opSearchListService.getVisitedList().subscribe((data) => {
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

  // addRow() {
  //   debugger;
  //   let addingRow = {
  //     drugName: this.lookupsObj,
  //     doseName: '',
  //     days1: '',
  //     instruction: '',
  //     // doseNameOptional: '',
  //     // days2: '',
  //     // doseNameOptional3: '',
  //     // days3: '',
  //     isLocallyAdded: false
  //   }
  //   // this.caseFormGroup.get('doseContoller1').setValue(this.caseFormGroup.get('doseContoller').value.DoseName);
  //   // this.caseFormGroup.get('daysController1').setValue(this.caseFormGroup.get('daysController').value);
  //   this.prescriptionData.push(addingRow);
  //   this.dataSource.data = this.prescriptionData;

  //   // this.addEmptyRow();
  // }


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

  // addEmptyRow(element?: PrescriptionTable) {
  //   debugger;
  //   if(this.caseFormGroup.invalid) {
  //     this.caseFormGroup.markAllAsTouched();
  //     this._snackBar.open('Please fill mandetory fields', 'Ok', {
  //       horizontalPosition: 'end',
  //       verticalPosition: 'bottom',
  //       duration: 3000
  //     });
  //     return;
  //   }
  //   if (element) {
  //     this.isRowAdded = true;
  //     this.prescriptionData && this.prescriptionData.length > 0 ? this.prescriptionData.splice(this.prescriptionData.indexOf(element), 1) : '';
  //     console.log( this.prescriptionData);
  //   }
  //   let addingRow = {
  //     drugName: element && element.drugName ? element.drugName : this.lookupsObj,
  //     doseName: element && element.doseName ? element.doseName : '',
  //     days1: element && element.days1 ? element.days1 : '',
  //     instruction: element && element.instruction ? element.instruction : '',
  //     // doseNameOptional: element && element.doseNameOptional ? element.doseNameOptional : '',
  //     // days2: element && element.days2 ? element.days2 : '',
  //     // doseNameOptional3: element && element.doseNameOptional3 ? element.doseNameOptional3 : '',
  //     // days3: element && element.days3 ? element.days3 : '',
  //     isLocallyAdded: element ? true : false
  //   }
  //   this.prescriptionData.push(addingRow);
  //   this.dataSource.data = this.prescriptionData;
  //   // console.log(this.dataSource.data );
  //   // console.log(this.prescriptionData);
  //   element ? this.addRow() : '';
  //   this.caseFormGroup.addControl(`drugController${this.prescriptionData.length - 1}`, new FormControl());
  //   this.caseFormGroup.get(`drugController${this.prescriptionData.length - 1}`).setValidators(Validators.required);
  // }
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

    if (this.prescriptionData.length != 0) {

      let insertOPPrescription = [];

      debugger;
      this.prescriptionData.splice(this.prescriptionData.length - 1, 0);
      this.prescriptionData.forEach((element: any, index) => {
        console.log(element)
        let obj = {};
        obj['opD_IPD_IP'] = this.selectedAdvanceObj.AdmissionID,
          obj['opD_IPD_Type'] = this.selectedAdvanceObj.opD_IPD_Type,
          obj['date'] = this.dateTimeObj.date;
        obj['pTime'] = this.dateTimeObj.date;//this.dateTimeObj.times;
        obj['classID'] = this.selectedAdvanceObj.ClassId || 0,
          obj['genericId'] = 0;
        obj['drugId'] = 12,//this.caseFormGroup.get(`drugController${index}`).value || 0; //element.drugName.ItemID;
          obj['doseId'] = element && element.doseName ? element.doseName.DoseId : 0;
        obj['days'] = parseInt(element.days1) || 0;
        obj['instructionId'] = 0;
        obj['qtyPerDay'] = 0;
        obj['totalQty'] = 0;
        obj['instruction'] = element.instruction;
        obj['remark'] = this.caseFormGroup.get('remarkController').value || '';
        obj['isEnglishOrIsMarathi'] = true;
        obj['pWeight'] = this.caseFormGroup.get("Weight").value || 0;
        obj['pulse'] = this.caseFormGroup.get("Pluse").value || 0;
        obj['bp'] = this.caseFormGroup.get("BP").value || 0;
        obj['bsl'] = this.caseFormGroup.get("BSL").value || 0;
        obj['chiefComplaint'] = this.caseFormGroup.get('ChiefComplaint').value || '';
        obj['isAddBy'] = this.accountService.currentUserValue.user.id,
        obj['spO2'] = this.caseFormGroup.get("SPO2").value || 0;
        obj['storeId'] = 0;
        obj['doseOption2'] = element.doseName ? element.doseName.DoseId : 0;
        obj['daysOption2'] = element.days1 ? element.days1 : 0;
        obj['doseOption3'] = element.doseNameOptional3 ? element.doseNameOptional3.DoseId : 0;
        obj['daysOption3'] = element.days3 ? element.days3 : 0;
          insertOPPrescription.push(obj);
      });

      console.log(insertOPPrescription);
      let casePaperSaveObj = {};
    //  casePaperSaveObj['insertOpCasePaper'] = insertOpCasePaper;
      casePaperSaveObj['insertOPPrescription'] = insertOPPrescription;

      console.log(casePaperSaveObj);
      this._opSearchListService.onSaveCasepaper(casePaperSaveObj).subscribe(response => {

        if (response) {
          Swal.fire('Congratulations !', 'Casepaper save Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {

              this.getPrint();
              this._matDialog.closeAll();
            }
          });
        } else {
          Swal.fire('Error !', 'Casepaper not saved', 'error');
        }

      });
    } else
      Swal.fire('Error !', 'Please add before save', 'error');
  }




  onClose() {
    this.caseFormGroup.reset();
    this.dialogRef.close();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  getTemplate() {
    debugger;



    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=12';
    console.log(query);
    this._opSearchListService.getTemplate(query).subscribe((resData: any) => {
      console.log(resData);
      this.printTemplate = resData[0].TempDesign;
      console.log(this.printTemplate);
      let keysArray = ['RegNo', 'PrecriptionId', 'PatientName', 'OPDNo', 'Diagnosis', 'PatientName', 'Weight', 'Pluse', 'BP', 'BSL', 'DoseName', 'Days', 'GenderName', 'AgeYear', 'DrugName', 'ConsultantDocName', 'SecondRefDoctorName', 'MobileNo', 'Address', 'VisitDate']; // resData[0].TempKeys;

      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }


      this.printTemplate = this.printTemplate.replace('StrVisitDate', this.transform2(this.reportPrintObj.VisitDate));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      //  this.printTemplate =  this.printTemplate.replace('StrConsultantDr', (this.reportPrintObj.ConsultantDocName));
      //  this.printTemplate =  this.printTemplate.replace('StrOPDDate', this.transform1(this.reportPrintObj.VisitDate));
      //   var strrowslist = "";
      //   for (let i = 1; i <= this.reportPrintObjList.length; i++) {
      //     var objreportPrint = this.reportPrintObjList[i - 1];
      //     var strabc = `
      // <div style="display:flex;margin:8px 0">
      // <div style="display:flex;width:100px;margin-left:30px;">
      //     <div>`+ i + `</div> 
      // </div>
      // <div style="display:flex;width:100px;margin-left:10px;">
      // <span >TAB</span>
      // </div>

      // <div style="display:flex;width:200px;margin-left:15px;">
      // <div style="font-weight:700;">`+ objreportPrint.  DrugName + `</div> <!-- <div>BLOOD UREA</div> -->
      // </div>
      // <div style="display:flex;width:150px;margin-left:15px;">
      //     <div>`+ objreportPrint.DoseName + `</div> <!-- <div>BLOOD UREA</div> -->
      // </div>

      // <div style="display:flex;width:100px;margin-left:30px;">
      //     <div>`+ objreportPrint.TotalDayes + `</div> <!-- <div>450</div> -->
      // </div>

      // </div>`;
      //     strrowslist += strabc;
      //   }

      //   //console.log(this.printTemplate);
      //   this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);

      //console.log(this.printTemplate);
      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      setTimeout(() => {
        this.print();
      }, 1000);
    });
  }
  transform1(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(value, 'dd/MM/yyyy hh:mm a');
    return value;
  }

  transform2(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    return value;
  }


  getPrint() {
    // debugger;
    var D_data = {
      "VisitId": 82973,//this.selectedAdvanceObj.AdmissionID || 0,
      "PatientType": 0,//this.selectedAdvanceObj.PatientType || 0

    }
    // el.bgColor = 'red';
    console.log(D_data);
    let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
    this.subscriptionArr.push(
      this._opSearchListService.getOPDPrecriptionPrint(D_data).subscribe(res => {
        console.log(res);
        this.reportPrintObjList = res as CasepaperVisitDetails[];
        console.log(this.reportPrintObjList);
        this.reportPrintObj = res[0] as CasepaperVisitDetails;

        this.getTemplate();

        console.log(D_data);
      })
    );
  }

  // PRINT 
  print() {
    // HospitalName, HospitalAddress, AdvanceNo, PatientName
    let popupWin, printContents;
    // printContents =this.printTemplate; // document.getElementById('print-section').innerHTML;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
    // popupWin.document.open();
    popupWin.document.write(` <html>
    <head><style type="text/css">`);
    popupWin.document.write(`
      </style>
          <title></title>
      </head>
    `);
    popupWin.document.write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
    </html>`);
    popupWin.document.close();
  }

  onEditVisitTable(row) {
    debugger;

    console.log(row);
    //   var m_data = {
    // "BP": row.BP,
    // "ConsultantDocName": row.ConsultantDocName,
    // "BSL": row.BSL,
    // "CasePaperID": row.CasePaperID,
    // "Complaint": row.Complaint,
    // "Diagnosis": row.Diagnosis,
    // "DocName": row.DocName,
    // "Finding": row.Finding,
    // "Height": row.Height,
    // "Investigations": row.Investigations,
    // "PastHistory": row.Investigations,
    // "PatientName": row.PatientName,
    // "PersonalDetails": row.PersonalDetails,
    // "Pluse": row.Pluse,
    // "PresentHistory": row.PresentHistory,
    // "RegID": row.RegID,
    // "SecondDocRef": row.SecondDocRef,
    // "SpO2": row.SpO2,
    // "VisitDate": row.VisitDate,
    // "VisitId": row.VisitId,
    // "VisitTime": row.VisitTime,
    // "Weight": row.Weight,
    // "DrugName":row.DrugName,
    // "TotalQty":row.TotalQty,
    // "HospitalName":row.HospitalName,
    // "HospitalAddress":row.HospitalAddress,
    // "Phone":row.Phone,
    // "IPPreId":row.IPPreId,
    // "DoseName":row.DoseName,
    // "GenderName":row.GenderName,
    // "PrecriptionId":row.PrecriptionId,
    // "Days":row.Days,
    // "Instruction":row.Instruction,
    // "TotalDayes":row.TotalDayes,
    // "AgeYear":row.AgeYear,
    // "OPDNo":row.OPDNo,
    //   "_matDialog": row._matDialog,
    //   "RegNo": row.RegNo


    //     }
    //     console.log("EditVisitTable..:==");
    // console.log(m_data);
    //   this.getMeasures(m_data);

    this.BP = row.BP;
    this.BSL = row.BSL;
    this.Height = row.Height;
    this.Weight = row.Weight;
    this.SpO2 = row.SpO2;
    this.Pluse = row.Pluse;
    this.VisitId = row.VisitId;
    // this.getPrescriptionListFill(70765);

  }

  getMeasures(m_data) {
    debugger;
    const BP = this.data.CasepaperVisitDetails.BP;
    this.caseFormGroup.get('BP').setValue(BP);

    const BSL = this.data.CasepaperVisitDetails.BSL;
    this.caseFormGroup.get('BSL').setValue(BSL);

    const Height = this.data.CasepaperVisitDetails.Height;
    this.caseFormGroup.get('Height').setValue(Height);

    const Weight = this.data.CasepaperVisitDetails.Weight;
    this.caseFormGroup.get('Weight').setValue(Weight);

    const SpO2 = this.data.CasepaperVisitDetails.SpO2;
    this.caseFormGroup.get('SpO2').setValue(SpO2);

    const Pluse = this.data.CasepaperVisitDetails.Pluse;
    this.caseFormGroup.get('Pluse').setValue(Pluse);

    const BMI = this.data.CasepaperVisitDetails.BMI;
    this.caseFormGroup.get('BMI').setValue(BMI);

    const Temp = this.data.CasepaperVisitDetails.Temp;
    this.caseFormGroup.get('Temp').setValue(Temp);
  }


  prescriptionList: OPDPrescription = new OPDPrescription({});

  getPrescriptionListFill(visitId) {
    debugger;
    // this._opSearchListService.prescriptionDetails(visitId).subscribe((data =>{
    //     // this.prescriptionList = data ;
    //     this.dataSource3.data = data as OPDPrescription[];
    //     console.log("Prescription List=");
    //     console.log(data);
    //     console.log( this.dataSource3.data);


    //     // const DrugName = this.data.OPDPrescription.DrugName;
    //     // this.caseFormGroup.get('DrugName').setValue(DrugName);

    // })


    this._opSearchListService.prescriptionDetails(visitId).subscribe(Visit => {
      this.dataSource3.data = Visit as OPDPrescription[];

      console.log(this.dataSource3.data);
      // this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';

    })
  }

  getregisterList() {
    debugger;
    this.sIsLoading = 'loading';
    var D_data = {
      // "VisitId": 70765,//this.selectedAdvanceObj.VisitId,
      "VisitId": this.selectedAdvanceObj.VisitId,
    }
    console.log(D_data);
    this.sIsLoading = 'loading-data';
    this._opSearchListService.getVisitedList(D_data).subscribe(Visit => {
      this.dataSource1.data = Visit as CasepaperVisitDetails[];

      console.log(this.dataSource1.data);
      // this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
      // setTimeout(() => {


      //   },
      //     error => {
      //       this.sIsLoading = '';
      //     });
      // }, 5);
    })

  }



  getView() {

    var D_data = {
      // "VisitId": 70765,//this.selectedAdvanceObj.VisitId,
      "VisitId": 10003,//this.selectedAdvanceObj.VisitId,
    }
    this.advanceDataStored.storage = new SearchInforObj(D_data);
    const dialogRef = this._matDialog.open(ViewCasepaperComponent,
      {
        maxWidth: "80vw",
        maxHeight: "100vh", width: '100%', height: "100%"

      }
    );
    this.dialogRef.afterClosed().subscribe(result => {
      console.log("Close All", result);
    }
    );
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
      WardName: this.selectedAdvanceObj.WardName,
      BedName: this.selectedAdvanceObj.BedName,
      TariffId: this.selectedAdvanceObj.TariffId,
      opD_IPD_Type: this.selectedAdvanceObj.opD_IPD_Type,
    };
    this.advanceDataStored.storage = new SearchInforObj(xx);
    // const dialogRef = this._matDialog.open(PrescriptionComponent,
    //   {
    //     maxWidth: "80vw",
    //     maxHeight: "100vh", width: '100%', height: "100%"
    //   }
    // );
    // this.dialogRef.afterClosed().subscribe(result => {
    //   console.log("Close All",result);
    // }
    // );
  }

  copy() { }
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

