import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ResultEntryService } from './result-entry.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MatSort } from '@angular/material/sort';
import { ResultEntryOneComponent } from './result-entry-one/result-entry-one.component';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { PathTemplateViewComponent } from './path-template-view/path-template-view.component';
import { ResultEntrytwoComponent } from './result-entrytwo/result-entrytwo.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { SampledetailtwoComponent } from '../sample-collection/sampledetailtwo/sampledetailtwo.component';
import { AdvanceDetailObj } from 'app/main/opd/appointment/appointment.component';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';

@Component({
  selector: 'app-result-entry',
  templateUrl: './result-entry.component.html',
  styleUrls: ['./result-entry.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ResultEntryComponent implements OnInit {
  SpinLoading: boolean = false;


  displayedColumns: string[] = [
    'OP_Ip_Type',
    'Date',
   // 'Time',
    'RegNo',
    'PatientName',
    'DoctorName',
    'PatientType',
    'PBillNo',
    'GenderName',
    'AgeYear',  
    'action'
  ];


  reportPrintObjList: SampleDetailObj[] = [];
  reportPrintObjs: SampleDetailObj;
  currentDate = new Date();
  click: boolean = false;
  printTemplate: any;
  MouseEvent = true;
  screenFromString = 'opd-casepaper';
  PatientTypeList: any = [];
  myformSearch: FormGroup;
  isLoading = true;
  msg: any;
  step = 0;
  dataArray = {};
  sIsLoading: string = '';
  isSampleCollection: boolean = true;
  ServiceIdList: any = [];
  PathReportID: any;
  PathTestId: any
  subscriptionArr: Subscription[] = [];
  reportPrintObj: AdmissionPersonlModel;
  SBillNo: any;
  SOPIPtype: any;
  SFromDate: any;
  PatientName: any;
  OPD_IPD: any;
  Age: any;
  PatientType: any; 
  dateTimeObj: any;
  setStep(index: number) {
    this.step = index;
  }
  SearchName: string;


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator; 

  dataSource = new MatTableDataSource<PatientList>(); 
  dataSource1 = new MatTableDataSource<SampleList>();
  @ViewChild(MatPaginator) PathTestpaginator: MatPaginator;

  displayedColumns1: string[] = [
    'select', 
    'IsCompleted', 
    'IsTemplateTest',
    'TestName',
    'SampleCollectionTime',
    // 'SampleNo',
    'DoctorName',
    'action'

  ];

  hasSelectedContacts: boolean;
  constructor(

    private formBuilder: FormBuilder,
    public _SampleService: ResultEntryService, 
    public datePipe: DatePipe,
    private reportDownloadService: ExcelDownloadService,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
    private _fuseSidebarService: FuseSidebarService,
  ) { }


  ngOnInit(): void {
    this.getPatientsList();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  // validation
  get f() { return this._SampleService.myformSearch.controls; }


  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  getView(contact) {
    console.log(contact);

    this.advanceDataStored.storage = new Templateprintdetail(contact);
    if (contact.IsTemplateTest) {
      const dialogRef = this._matDialog.open(ResultEntrytwoComponent,
        {
          maxWidth: "80vw",
          maxHeight: "100vh", width: '100%', height: "100%"
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
      });
    }
    else {
      const dialogRef = this._matDialog.open(ResultEntryOneComponent,
        {
          maxWidth: "80vw",
          maxHeight: "100vh", width: '100%', height: "100%"
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
      });
    }
  }

 
  
  getPatientsList() { 
    this.dataSource1.data = [];
    this.sIsLoading = 'loading-data';
    var m_data = {
      "F_Name": (this._SampleService.myformSearch.get("FirstNameSearch").value).trim() + '%' || '%',
      "L_Name": (this._SampleService.myformSearch.get("LastNameSearch").value).trim() + '%' || '%',
      "Reg_No": (this._SampleService.myformSearch.get("RegNoSearch").value) || 0,
      "From_Dt": this.datePipe.transform(this._SampleService.myformSearch.get("start").value, "yyyy-MM-dd ") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._SampleService.myformSearch.get("end").value, "yyyy-MM-dd") || '01/01/1900',
      "IsCompleted": parseInt(this._SampleService.myformSearch.get("StatusSearch").value) || 0,
      "OP_IP_Type": parseInt(this._SampleService.myformSearch.get("PatientTypeSearch").value) || 0,
    }
console.log(m_data)
    this._SampleService.getPatientList(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as PatientList[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
      this.click = false;
      console.log(this.dataSource.data);
    },
      error => {
        this.sIsLoading = '';
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
  
  onSearchClear() {
    this._SampleService.myformSearch.reset({ RegNoSearch: '', FirstNameSearch: '', LastNameSearch: '', PatientTypeSearch: '', StatusSearch: '' });
  }

  // for sampledetails tablemyformSearch
  onEdit(m) { 
    console.log(m); 
    this.reportPrintObj=m
    console.log(this.reportPrintObj); 
    this.PatientName = m.PatientName;
    this.OPD_IPD = m.OP_IP_No
    this.Age = m.AgeYear
    this.PatientType = m.PatientType

    this.SBillNo = m.BillNo;
    this.SOPIPtype = m.OPD_IPD_Type;
    this.SFromDate = this.datePipe.transform(m.PathDate, "yyyy-MM-dd ");

    var m_data = {
      "BillNo": m.BillNo,
      "OP_IP_Type": m.OPD_IPD_Type,
      "From_Dt": this.datePipe.transform(m.PathDate, "yyyy-MM-dd"),
    }
    console.log(m_data);
    
    this._SampleService.getSampleList(m_data).subscribe(Visit => {
      this.dataSource1.data = Visit as SampleList[];
      console.log(this.dataSource1.data);

      this.dataSource1.sort = this.sort;
      this.dataSource1.paginator = this.paginator;
      this.sIsLoading = '';
      this.click = false;
    },
      error => {
        this.sIsLoading = '';
      });

  }

  SearchTest($event) { 
    var m_data = {
      "BillNo": this.SBillNo,
      "OP_IP_Type": this.SOPIPtype,
      "IsCompleted": this._SampleService.myformSearch.get("TestStatusSearch").value || 0,
    
    }
    
    this._SampleService.getTestList(m_data).subscribe(Visit => {
      this.dataSource1.data = Visit as SampleList[];
     this.dataSource1.sort = this.sort;
      this.dataSource1.paginator = this.paginator;
      this.sIsLoading = '';
      this.click = false;
    },
      error => {
        this.sIsLoading = '';
      });
  }


  isAllSelected() {
    
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource1.data.length;

     return numSelected === numRows;
    
  }


  selection = new SelectionModel<Templateprintdetail>(true, []);
  
  chkresultentry(){
    debugger
    setTimeout(() => {
      // this.SpinLoading = true;
      let data=[];
      this.selection.selected.forEach(element => {
        if(element.PathTestServiceId !=0)
        data.push({PathReportId:element["PathReportID"].toString(),ServiceId:element["ServiceId"].toString()});
      });
      console.log(data)
      console.log(this.advanceDataStored.storage)
      const dialogRef = this._matDialog.open(ResultEntryOneComponent,
        {
          maxWidth: "95vw",
          height: '670px',
          width: '90%',
          data: {
            RIdData:data,
            patientdata:this.reportPrintObj,
            OPIPID:this.OPIPID
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        this.SpinLoading = false;
      });
      dialogRef.afterClosed().subscribe(result => {
        this.SpinLoading = false;
      });
    }, 100);
  }

OPIPID:any=0;
  onresultentryshow(event,m){
    this.OPIPID=m.OPD_IPD_ID
    this.advanceDataStored.storage = new SampleDetailObj(m); 
    console.log(this.advanceDataStored.storage )
    if(event.checked){
    if(m.PathTestServiceId==0){
      this.toastr.warning('Result Not Generated !', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

  }
  }



  // for sample detail table to resultentry page
  PathTestServiceId:any=0;
  onresultentry(m) {
    debugger
    console.log(m);
    
    this.advanceDataStored.storage = new SampleDetailObj(m); 
    this.PathTestServiceId=m.PathTestServiceId;
    console.log(m);
  
    if (m.IsTemplateTest == 1) {
      this.advanceDataStored.storage = new SampleDetailObj(m);
      const dialogRef = this._matDialog.open(ResultEntrytwoComponent,
        {
          maxWidth: "90%",
          height: '95%',
          width: '100%',
          data:this.reportPrintObj,
          // data: {
          //   RIdData:data,
          //   patientdata:this.advanceDataStored.storage,
          //   OPIPID:this.OPIPID
          // }
        });


      dialogRef.afterClosed().subscribe(result => {
        console.log('Pathology Template  Saved ..', result);
      });
    }
    else {
      this.advanceDataStored.storage = new SampleDetailObj(m);
      const dialogRef = this._matDialog.open(ResultEntryOneComponent,
        {
          maxWidth: "95vw",
          height: '670px',
          width: '70%',
          data: {
           data : m
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('PathologyResult Saved ..', result);
      });
    }
  }

 
 
 
  getPrint(contact){
    debugger
    if(contact.IsTemplateTest)
      this.viewgetPathologyTemplateReportPdf(contact)
    else
    this.viewgetPathologyTestReportPdf(contact)
      }

  AdList: boolean = false;
  viewgetPathologyTemplateReportPdf(contact) {
    setTimeout(() => {
      this.SpinLoading = true;
      this.AdList = true;
      this._SampleService.getPathTempReport(
        contact.PathReportID,contact.OPD_IPD_Type
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Pathology Template  Viewer"
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            this.AdList=false;
            this.SpinLoading = false;
          });
      });

    }, 100);
  }



  viewgetPathologyTestReportPdf(contact) {
    debugger
    setTimeout(() => {
      this.SpinLoading = true;
      this.AdList = true;
      this._SampleService.getPathTestReport(
        contact.OPD_IPD_Type
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "pathology Test  Viewer"
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            this.AdList=false;
            this.SpinLoading = false;
          });
      });

    }, 100);
  }


 
  exportResultentryReportExcel(){
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['Date', 'Time', 'RegNo', 'PatientName', 'DoctorName', 'PatientType', 'PBillNo','GenderName','AgeYear','PathDues'];
    this.reportDownloadService.getExportJsonData(this.dataSource.data, exportHeaders, 'Result Entry');
    this.dataSource.data = [];
    this.sIsLoading = '';
  }

  exportReportPdf() {
    let actualData = [];
    this.dataSource.data.forEach(e => {
      var tempObj = [];
      tempObj.push(e.DOA);
      tempObj.push(e.DOT);
      // tempObj.push(e.DVisitDate);
      tempObj.push(e.RegNo);
      tempObj.push(e.DoctorName);
      tempObj.push(e.PatientType);
      tempObj.push(e.PBillNo);
      tempObj.push(e.GenderName);
      tempObj.push(e.AgeYear);
      // tempObj.push(e.PathAmount);
      actualData.push(tempObj);
    });
    let headers = [['Date', 'Time', 'RegNo', 'DoctorName', 'PatientType', 'PBillNo', 'GenderName','AgeYear','PathAmount']];
    this.reportDownloadService.exportPdfDownload(headers, actualData, 'Result Entry');
  }




  onClose() {
    
  } 
  onShow(event: MouseEvent) {
    // this.click = false;// !this.click;
    this.click = !this.click;
    // this. showSpinner = true;

    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data';

        this.getPatientsList();
      }

    }, 50);
    this.MouseEvent = true;
    this.click = true;

  }

  onsamplecolltion(contact) {
    console.log(contact)
   
    this.advanceDataStored.storage = new AdvanceDetailObj(contact);

    const dialogRef1 = this._matDialog.open(SampledetailtwoComponent,
      {
        maxWidth: "70vw",
        height: '80vh',
        width: '100%',
        data: {
         
          regobj:contact
        } 
      });

    dialogRef1.afterClosed().subscribe(result => {
      // console.log('The dialog was closed - Insert Action', result);
      // this.getPatientsList();
    });
  }
  

  onClear() { 
    this._SampleService.myformSearch.get('FirstNameSearch').reset();
    this._SampleService.myformSearch.get('LastNameSearch').reset();
    this._SampleService.myformSearch.get('RegNoSearch').reset();
    this._SampleService.myformSearch.get('StatusSearch').reset();
    this._SampleService.myformSearch.get('PatientTypeSearch').reset();
  }
}


export class PatientList {
  DOA: Date;
  DOT: Date;
  RegNo: any;
  PatientName: String;
  PBillNo: number;
  PatientType: number;
  DoctorName: String;
  AgeYear: any;
  GenderName: String;

  constructor(PatientList) {
    this.DOA = PatientList.DOA || '0';
    this.DOT = PatientList.DOT;
    this.RegNo = PatientList.RegNo;
    this.PatientName = PatientList.PatientName;
    this.PBillNo = PatientList.PBillNo;
    this.PatientType = PatientList.PatientType || '0';
    this.DoctorName = PatientList.DoctorName || 1;
    this.AgeYear = PatientList.AgeYear || 0;
    this.GenderName = PatientList.GenderName;  
  } 
}

export class SampleList {
  VADate: Date;
  ServiceName: String;
  IsSampleCollection: boolean;
  SampleCollectionTime: Date;
  PathTestID: any;
  IsVerifySign: boolean;
  TemplateDesc: String;
  IsCompleted: boolean;
  constructor(SampleList) {
    this.VADate = SampleList.VADate || '';
    this.ServiceName = SampleList.ServiceName || '';
    this.IsSampleCollection = SampleList.IsSampleCollection || 0;
    this.SampleCollectionTime = SampleList.SampleCollectionTime || '';
    this.PathTestID = SampleList.PathTestID || 0;
    this.IsVerifySign = SampleList.IsVerifySign || 0;
    this.TemplateDesc = SampleList.TemplateDesc || '';
    this.IsCompleted = SampleList.IsCompleted || 0;
  }

}

export class SampleDetailObj {
  RegNo: Number;
  AdmissionID: Number;
  PatientName: string;
  AdmDocId: number;
  Doctorname: string;
  AdmDateTime: string;
  AgeDay: number;
  AgeMonth: number;
  AgeYear: number;
  ClassId: number;
  TariffName: String;
  TariffId: number;
  PathReportID: any;
  TestId: any;
  PathTemplateId: any;
  PrintTestName: any;
  CategoryID: any;
  ReportDate: any;
  PrintParameterName: string;
  NormalRange: any;
  ResultValue: any;
  VisitTime: any;
  VisitDate: any;
  Age: number;
  GenderName: any;
  ConsultantDocName: string;
  OP_IP_Type: number;
  Adm_Visit_Time: any;
  TemplateDesc: any;
  Path_ConsultantDocname: any;
  RoomName: any;
  BedName: any;
  PathDate: any;
  PathTime: any;
  PathResultDr1: any;
  PathTestID: any;
  OP_IP_No:any;
  DepartmentName: any;
  CompanyName:any;
  IPDNo:any;
  PatientType:any;
  RefDocName:any;
  ServiceId:any;
  ChargeId:any;

  /**
  * Constructor
  *
  * @param SampleDetailObj
  */
  constructor(SampleDetailObj) {
    {
      this.RegNo = SampleDetailObj.RegNo || 0;
      this.AdmissionID = SampleDetailObj.AdmissionID || '';   
      this.RefDocName = SampleDetailObj.RefDocName || '';  
      this.CompanyName = SampleDetailObj.CompanyName || '';  
      this.IPDNo = SampleDetailObj.IPDNo || ''; 
      this.DepartmentName = SampleDetailObj.DepartmentName || ''; 
      this.PatientType = SampleDetailObj.PatientType || ''; 
      this.OP_IP_No = SampleDetailObj.OP_IP_No || '';
      this.PatientName = SampleDetailObj.PatientName || '';
      this.Doctorname = SampleDetailObj.Doctorname || '';
      this.AdmDateTime = SampleDetailObj.AdmDateTime || '';
      this.AgeDay = SampleDetailObj.AgeDay || '';
      this.AgeMonth = SampleDetailObj.AgeMonth || '';
      this.AgeYear = SampleDetailObj.AgeYear || '';
      this.ClassId = SampleDetailObj.ClassId || '';
      this.TariffName = SampleDetailObj.TariffName || '';
      this.TariffId = SampleDetailObj.TariffId || '';
      this.PathReportID = SampleDetailObj.PathReportID || '';
      this.TestId = SampleDetailObj.TestId || 0;
      this.PathTemplateId = SampleDetailObj.PathTemplateId || 0;
      this.CategoryID = SampleDetailObj.CategoryID || 0;
      this.AdmDocId = SampleDetailObj.AdmDocId || 0;
      this.PrintParameterName = SampleDetailObj.PrintParameterName || '';
      this.NormalRange = SampleDetailObj.NormalRange || '';
      this.ResultValue = SampleDetailObj.ResultValue || '';
      this.VisitTime = SampleDetailObj.VisitTime || '';
      this.VisitDate = SampleDetailObj.VisitDate || '';
      this.OP_IP_Type = SampleDetailObj.OP_IP_Type || 0;
      this.ConsultantDocName = SampleDetailObj.ConsultantDocName || '';
      this.Adm_Visit_Time = SampleDetailObj.Adm_Visit_Time || '';
      this.ReportDate = SampleDetailObj.ReportDate || '';
      this.TemplateDesc = SampleDetailObj.TemplateDesc || '';
      this.PrintTestName = SampleDetailObj.PrintTestName || '';
      this.Path_ConsultantDocname = SampleDetailObj.Path_ConsultantDocname || '';
      this.PathResultDr1 = SampleDetailObj.PathResultDr1 || 0;
      this.BedName = SampleDetailObj.BedName || '';
      this.RoomName = SampleDetailObj.RoomName || '';
      this.PathDate = SampleDetailObj.PathDate || '';
      this.PathTime = SampleDetailObj.PathTime || '';
      this.PathTestID = SampleDetailObj.PathTestID || 0;
      this.ServiceId = SampleDetailObj.ServiceId || 0;
      this.ChargeId=SampleDetailObj.ChargeId || 0

    }
  }
}


export class Templateprintdetail {
  Adm_Visit_docId: Number;
  AgeYear: number;
  CategoryName: String;
  ChargeId: number;
  DOA: Date;
  DOT: Date;
  DoctorName: string;
  GenderName: String;
  IsCompleted: boolean;
  IsPrinted: boolean;
  IsSampleCollection: boolean;
  IsTemplateTest: boolean;
  IsVerifySign: boolean;
  OPD_IPD_ID: number;
  OPD_IPD_Type: number;
  OP_IP_No: number;
  PBillNo: number;
  PathReportID: number;
  PathTestID: any;
  PatientName: string;
  PatientType: String;
  RegNo: number;
  SampleCollectionTime: Date;
  SampleNo: string;
  ServiceId: number;
  ServiceName: String;
  VADate: Date;
  VATime: Date;
  Visit_Adm_ID: any;
  ReportDate: Date;
  PathTemplateDetailsResult: any;
  PathTestServiceId:any;
  /**
   * Constructor
   *
   * @param Templateprintdetail
   */
  constructor(Templateprintdetail) {
    {
      this.Adm_Visit_docId = Templateprintdetail.Adm_Visit_docId || '';
      this.AgeYear = Templateprintdetail.AgeYear || '';
      this.CategoryName = Templateprintdetail.CategoryName || '';
      this.ChargeId = Templateprintdetail.ChargeId || '';
      this.DOA = Templateprintdetail.DOA || '';
      this.DOT = Templateprintdetail.DOT || '';
      this.DoctorName = Templateprintdetail.DoctorName || '';
      this.GenderName = Templateprintdetail.GenderName || '';
      this.IsPrinted = Templateprintdetail.IsPrinted || '';
      this.IsSampleCollection = Templateprintdetail.IsSampleCollection || '';
      this.IsTemplateTest = Templateprintdetail.IsTemplateTest || '';

      this.IsVerifySign = Templateprintdetail.IsVerifySign || '';
      this.OPD_IPD_ID = Templateprintdetail.OPD_IPD_ID || '';
      this.OPD_IPD_Type = Templateprintdetail.OPD_IPD_Type || '';
      this.OP_IP_No = Templateprintdetail.OP_IP_No || '';
      this.PBillNo = Templateprintdetail.PBillNo || '';
      this.PathReportID = Templateprintdetail.PathReportID || '';

      this.PathTestID = Templateprintdetail.PathTestID || '';

      this.PatientName = Templateprintdetail.PatientName || '';
      this.PatientType = Templateprintdetail.PatientType || '';
      this.RegNo = Templateprintdetail.RegNo || '';
      this.SampleCollectionTime = Templateprintdetail.SampleCollectionTime || '';
      this.SampleNo = Templateprintdetail.SampleNo || '';
      this.ServiceId = Templateprintdetail.ServiceId || '';
      this.ServiceName = Templateprintdetail.ServiceName || '';
      this.VADate = Templateprintdetail.VADate || '';
      this.VATime = Templateprintdetail.VATime || '';
      this.Visit_Adm_ID = Templateprintdetail.Visit_Adm_ID || '';
      this.ReportDate = Templateprintdetail.ReportDate || '';
      this.PathTemplateDetailsResult = Templateprintdetail.PathTemplateDetailsResult || '';
      this.PathTestServiceId=Templateprintdetail.PathTestServiceId|| 0
    }
  }

}

//
