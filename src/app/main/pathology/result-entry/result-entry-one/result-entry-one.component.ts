import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SampleDetailObj } from '../result-entry.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ResultEntryService } from '../result-entry.service';
import { DatePipe } from '@angular/common';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { ConfigService } from 'app/core/services/config.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-result-entry-one',
  templateUrl: './result-entry-one.component.html',
  styleUrls: ['./result-entry-one.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ResultEntryOneComponent implements OnInit {

  displayedColumns: string[] = [
    'TestName',
    // 'SubTestName',
    'ParameterName',
    'ResultValue',
    'NormalRange',

  ];
  isLoading: string = '';

  Pthologyresult: any = [];

  PathologyDoctorList: any = [];
  DoctorList: any = [];
  Doctor1List: any = [];

  otherForm: FormGroup;
  msg: any;
  
  selectedAdvanceObj: SampleDetailObj;
  screenFromString = 'opd-casepaper';
  hasSelectedContacts: boolean;
  s
  advanceData: any;
  dataSource = new MatTableDataSource<Pthologyresult>();
  configDoc:any;
  sIsLoading: string = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    public _SampleService: ResultEntryService,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<ResultEntryOneComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private advanceDataStored: AdvanceDataStored,
    private configService: ConfigService,
    private _fuseSidebarService: FuseSidebarService) {

    this.advanceData = data;
    // console.log(this.advanceData);
  }

  //doctorone filter
  public pathodoctorFilterCtrl: FormControl = new FormControl();
  public filteredPathDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

  //doctorone filter
  public refDoctorFilterCtrl: FormControl = new FormControl();
  public filteredRefDoctorone: ReplaySubject<any> = new ReplaySubject<any>(1);


  //doctorone filter
  public doctorFilterCtrl: FormControl = new FormControl();
  public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.otherForm = this.formBuilder.group({
      suggestionNotes: '',
      PathResultDoctorId: [0],
      DoctorId:['', Validators.required],
      AdmDoctorID: [0],
      RefDoctorID: [0],
    });

  // console.log(this.configService.getConfigParam());
  //  console.log(this.configService.getConfigParam().IsPathologistDr);
  //   this.configDoc= this.configService.getConfigParam().IsPathologistDr;

    this.getDoctor1List();
    this.getDoctorList();

    this.getPathologyDoctorList();
   
    this.setDropdownObjs();
debugger;
   

    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj);
      // this.TemplateDesc = this.selectedAdvanceObj.TemplateDesc;
    }



    //For Diffrente List Dispaly(IP?OP)
    if (this.advanceData.IsCompleted == true) {
      if (this.advanceData.OP_IP_Type == true) {
        this.getResultListIP();
      }
      else {
        this.getResultListOP();
      }
    } else {
      this.getResultList();
    }

    this.refDoctorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctorone();
      });

    this.doctorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctor();
      });


    this.pathodoctorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPathologyDoctor();
      });

      setTimeout(function () {
        let element: HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
        element.click();
      }, 1000);
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
    console.log(this.dateTimeObj);
  }

  setDropdownObjs() {
        const toSelect = this.PathologyDoctorList.find(c => c.DoctorId == this.selectedAdvanceObj.PathResultDr1);
        this.otherForm.get('DoctorId').setValue(toSelect);

        const toSelect1 = this.DoctorList.find(c => c.DoctorID == this.selectedAdvanceObj.AdmDocId);
        this.otherForm.get('AdmDoctorID').setValue(toSelect1);

        // const toSelect2 = this.DoctorList.find(c => c.DoctorID == this.selectedAdvanceObj.AdmDocId);
        // this.otherForm.get('DoctorId').setValue(toSelect1);
  }
  private filterPathologyDoctor() {

    if (!this.PathologyDoctorList) {
      return;
    }
    // get the search keyword
    let search = this.pathodoctorFilterCtrl.value;
    if (!search) {
      this.filteredPathDoctor.next(this.PathologyDoctorList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredPathDoctor.next(
      this.PathologyDoctorList.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );

  }

  // doctorone filter code  
  private filterDoctor() {

    if (!this.DoctorList) {
      return;
    }
    // get the search keyword
    let search = this.doctorFilterCtrl.value;
    if (!search) {
      this.filteredDoctor.next(this.DoctorList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDoctor.next(
      this.DoctorList.filter(bank => bank.Doctorname.toLowerCase().indexOf(search) > -1)
    );
  }

  // doctorone filter code  
  private filterDoctorone() {

    if (!this.Doctor1List) {
      return;
    }
    // get the search keyword
    let search = this.refDoctorFilterCtrl.value;
    if (!search) {
      this.filteredRefDoctorone.next(this.Doctor1List.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredRefDoctorone.next(
      this.Doctor1List.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );
  }

  getResultList() {
    debugger;
    this.sIsLoading = 'loading-data';
    let SelectQuery = "Select * from lvw_Retrieve_PathologyResult where opd_ipd_id=" + this.advanceData.OPD_IPD_ID + " and ServiceID in (" + this.advanceData.ServiceId + ") and OPD_IPD_Type = " + this.advanceData.OP_IP_Type + " AND IsCompleted = 0 and PathReportID = " + this.advanceData.PathReportID + ""
   
    this._SampleService.getPathologyResultList(SelectQuery).subscribe(Visit => {
      this.dataSource.data = Visit as Pthologyresult[];
      this.Pthologyresult = Visit as Pthologyresult[];
      // console.log(this.Pthologyresult);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  // getPathologyDoctorList() {
  //   this._SampleService.getPathologyDoctorMaster1Combo().subscribe(data => { this.PathologyDoctorList = data; 
  //     this.filteredPathDoctor.next(this.PathologyDoctorList.slice());
  //   })
  // }

  onSave() {
    debugger;
    let pathologyDeleteObj = {};
    pathologyDeleteObj['pathReportID'] = this.selectedAdvanceObj.PathReportID;

    this.isLoading = 'submit';
    let PathInsertArry = [];

    this.Pthologyresult.forEach((element) => {

      let pathologyInsertReportObj = {};
      pathologyInsertReportObj['PathReportId'] = this.selectedAdvanceObj.PathReportID;
      pathologyInsertReportObj['CategoryID'] = element.CategoryID || 0;
      pathologyInsertReportObj['TestID'] = element.TestId || 0;
      pathologyInsertReportObj['SubTestId'] = element.SubTestID || 0;
      pathologyInsertReportObj['ParameterId'] = element.ParameterId || 0;
      pathologyInsertReportObj['ResultValue'] = element.ResultValue || '';
      pathologyInsertReportObj['UnitId'] = element.UnitId || 0;
      pathologyInsertReportObj['NormalRange'] = element.NormalResult || '';
      pathologyInsertReportObj['PrintOrder'] = element.PrintOrder || 0;
      pathologyInsertReportObj['PIsNumeric'] = element.PIsNumeric || 0;
      pathologyInsertReportObj['CategoryName'] = element.CategoryName || '';
      pathologyInsertReportObj['TestName'] = element.TestName || '';
      pathologyInsertReportObj['SubTestName'] = element.SubTestName || '';
      pathologyInsertReportObj['ParameterName'] = element.ParameterName || '';
      pathologyInsertReportObj['UnitName'] = element.UnitName || '';
      pathologyInsertReportObj['PatientName'] = this.selectedAdvanceObj.PatientName || '';
      pathologyInsertReportObj['RegNo'] = this.selectedAdvanceObj.RegNo;
      pathologyInsertReportObj['SampleID'] = element.SampleID || '';

      PathInsertArry.push(pathologyInsertReportObj);

    });
debugger;
    let pathologyUpdateReportObj = {};
    pathologyUpdateReportObj['PathReportID'] = this.selectedAdvanceObj.PathReportID;
    pathologyUpdateReportObj['ReportDate'] = this.dateTimeObj.date;
    pathologyUpdateReportObj['ReportTime'] = this.dateTimeObj.time;
    pathologyUpdateReportObj['IsCompleted'] = true;
    pathologyUpdateReportObj['IsPrinted'] = true;
    pathologyUpdateReportObj['PathResultDr1'] = this.otherForm.get('PathResultDoctorId').value.DoctorId || 0;
    pathologyUpdateReportObj['PathResultDr2'] = this.otherForm.get('DoctorId').value.DoctorId || 0;
    pathologyUpdateReportObj['PathResultDr3'] = 0;
    pathologyUpdateReportObj['IsTemplateTest'] = 0;
    pathologyUpdateReportObj['SuggestionNotes'] = this.otherForm.get('suggestionNotes').value || "";
    pathologyUpdateReportObj['AdmVisitDoctorID'] =  this.selectedAdvanceObj.AdmDocId,//this.otherForm.get('AdmDoctorID').value.DoctorID || 0;
    pathologyUpdateReportObj['RefDoctorID'] = this.otherForm.get('RefDoctorID').value.DoctorID || 0;

    const pathologyDelete = new PthologyresulDelt(pathologyDeleteObj);
    const pathologyUpdateObj = new PthologyresulUp(pathologyUpdateReportObj);

    let PatientHeaderObj = {};

    PatientHeaderObj['ReportDate'] = this.dateTimeObj.date;
    PatientHeaderObj['ReportTime'] = this.dateTimeObj.time;
    PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
    PatientHeaderObj['RegNo'] = this.selectedAdvanceObj.RegNo;

    // this.dialogRef.afterClosed().subscribe(result => {
    console.log('==============================  PathologyResult ===========');
    let submitData = {
      "deletepathreportheader": pathologyDelete,
      "insertpathreportdetail": PathInsertArry,
      "updatepathreportheader": pathologyUpdateObj
    };
    console.log(submitData);
    this._SampleService.PathResultentryInsert(submitData).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'Pathology Resulentry data saved Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Pathology Resulentry data not saved', 'error');
      }
      this.isLoading = '';
    });

    // });
  }



  getPathologyDoctorList() {
    debugger;
   
    this._SampleService.getPathologyDoctorCombo().subscribe(data => {
      this.PathologyDoctorList = data;
     this.filteredPathDoctor.next(this.PathologyDoctorList.slice());
      // this.otherForm.get('PathResultDoctorId').setValue(this.PathologyDoctorList[this.configDoc]);
    })
    //console.log(this.PathologyDoctorList);
  }

  getDoctorList() {
    this._SampleService.getDoctorMaster1Combo().subscribe(data => {
      this.DoctorList = data;
      this.filteredDoctor.next(this.DoctorList.slice());
    })
  }

  getDoctor1List() {
    this._SampleService.getDoctorMaster1Combo().subscribe(data => {
      this.Doctor1List = data;
      this.filteredRefDoctorone.next(this.Doctor1List.slice());
    })
  }

  getResultListIP() {
    debugger;
    this.sIsLoading = 'loading-data';
    let SelectQuery = "Select * from lvw_Retrieve_PathologyResultIPPatientUpdate where PathReportId in(" + this.advanceData.PathReportID + ")"

    console.log(SelectQuery);
    this._SampleService.getPathologyResultListforIP(SelectQuery).subscribe(Visit => {
      this.dataSource.data = Visit as Pthologyresult[];
      this.Pthologyresult = Visit as Pthologyresult[];
      // console.log(this.Pthologyresult);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getResultListOP() {
    debugger;
    this.sIsLoading = 'loading-data';
    let SelectQuery = "Select * from lvw_Retrieve_PathologyResultUpdate where PathReportId in(" + this.advanceData.PathReportID + ")"
    this._SampleService.getPathologyResultListforOP(SelectQuery).subscribe(Visit => {
      this.dataSource.data = Visit as Pthologyresult[];
      this.Pthologyresult = Visit as Pthologyresult[];
      // console.log(this.Pthologyresult);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  onClear() {
    this.otherForm.reset();
  }

  onClose() {
    this.dialogRef.close();
  }




}


export class Pthologyresult {
  TestName: String;
  SubTestName: boolean;
  ParameterName: Date;
  NormalRange: any;
  constructor(Pthologyresult) {
    this.TestName = Pthologyresult.TestName || '';
    this.SubTestName = Pthologyresult.SubTestName || '';
    this.ParameterName = Pthologyresult.ParameterName || '';
    this.NormalRange = Pthologyresult.NormalRange || 0;
  }
}


export class PthologyTemplateresult {
  
  TemplateDesc: String;
  PrintTestName: String;
  PathReportID: any;
  TestId: any;
  PathResultDr1:any;
  
  constructor(PthologyTemplateresult) {
    this.TemplateDesc = PthologyTemplateresult.TemplateDesc || '';
    this.PrintTestName = PthologyTemplateresult.PrintTestName || '';
    this.PathReportID = PthologyTemplateresult.PathReportID || '';
    this.TestId = PthologyTemplateresult.TestId || 0;
    this.PathResultDr1 = PthologyTemplateresult.PathResultDr1 || '';
  }
}


export class PthologyresultInsert {
  PathReportId: number;
  CategoryID: number;
  TestID: any;
  SubTestId: any;
  ParameterId: any;
  ResultValue: any;
  UnitId: any;
  NormalRange: any;
  PrintOrder: any;
  PIsNumeric: boolean;
  CategoryName: any;
  TestName: any;
  SubTestName: any;
  ParameterName: any;
  UnitName: String;
  PatientName: any;
  RegNo: any;
  SampleID: any;

  constructor(pathologyInsertReportObj) {
    this.PathReportId = pathologyInsertReportObj.PathReportId || 0;
    this.CategoryID = pathologyInsertReportObj.CategoryID || 0;
    this.TestID = pathologyInsertReportObj.TestID || 0;
    this.SubTestId = pathologyInsertReportObj.SubTestId || 0;
    this.ParameterId = pathologyInsertReportObj.ParameterId || 0;
    this.ResultValue = pathologyInsertReportObj.ResultValue || '0';
    this.UnitId = pathologyInsertReportObj.UnitId || '0';
    this.NormalRange = pathologyInsertReportObj.NormalRange || '';
    this.PrintOrder = pathologyInsertReportObj.PrintOrder || '0';
    this.PIsNumeric = pathologyInsertReportObj.PIsNumeric || 0;
    this.CategoryName = pathologyInsertReportObj.CategoryName || '';
    this.TestName = pathologyInsertReportObj.TestName || '';
    this.SubTestName = pathologyInsertReportObj.SubTestName || '';
    this.ParameterName = pathologyInsertReportObj.ParameterName || '';
    this.UnitName = pathologyInsertReportObj.UnitName || '';
    this.PatientName = pathologyInsertReportObj.PatientName || '';
    this.RegNo = pathologyInsertReportObj.RegNo || '0';
    this.SampleID = pathologyInsertReportObj.SampleID || 0;

  }

}

export class PthologyresulDelt {
  pathReportID: number;
  constructor(pathologyDeleteObj) {
    this.pathReportID = pathologyDeleteObj.pathReportID || 0;
  }
}


export class PthologyresulUp {
  PathReportID: number;
  ReportDate: any;
  ReportTime: any;
  IsCompleted: boolean;
  IsPrinted: boolean;
  PathResultDr1: any;
  PathResultDr2: any;
  PathResultDr3: any;
  IsTemplateTest: any;
  SuggestionNotes: any;
  AdmVisitDoctorID: any;
  RefDoctorID: any;

  constructor(pathologyUpdateReportObj) {
    this.PathReportID = pathologyUpdateReportObj.PathReportID || 0;
    this.RefDoctorID = pathologyUpdateReportObj.RefDoctorID || 0;
    this.ReportDate = pathologyUpdateReportObj.ReportDate || '';
    this.ReportTime = pathologyUpdateReportObj.ReportTime || '';
    this.IsCompleted = pathologyUpdateReportObj.IsCompleted || 0;
    this.IsPrinted = pathologyUpdateReportObj.IsPrinted || 0;
    this.PathResultDr1 = pathologyUpdateReportObj.PathResultDr1 || 0;
    this.PathResultDr2 = pathologyUpdateReportObj.PathResultDr2 || 0;
    this.PathResultDr3 = pathologyUpdateReportObj.PathResultDr3 || 0;
    this.IsTemplateTest = pathologyUpdateReportObj.IsTemplateTest || 0;
    this.SuggestionNotes = pathologyUpdateReportObj.SuggestionNotes || '';
    this.AdmVisitDoctorID = pathologyUpdateReportObj.AdmVisitDoctorID || 0;
    this.RefDoctorID = pathologyUpdateReportObj.RefDoctorID || 0;
  }
}


