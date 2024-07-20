import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Subscription } from 'rxjs';
import { RadioloyOrderlistService } from './radioloy-orderlist.service';
import { ResultEntryComponent } from './result-entry/result-entry.component';
import { RadiologyTemplateReportComponent } from './radiology-template-report/radiology-template-report.component';
import { fuseAnimations } from '@fuse/animations';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';

@Component({
  selector: 'app-radiology-order-list',
  templateUrl: './radiology-order-list.component.html',
  styleUrls: ['./radiology-order-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RadiologyOrderListComponent implements OnInit {

  click: boolean = false;
  MouseEvent = true;
  CategoryList: any = [];
  screenFromString = 'opd-casepaper';
  PatientTypeList: any = [];
  myFilterform: FormGroup;
  isLoading = true;
  msg: any;
  step = 0;
  dataArray = {};
  sIsLoading: string = '';
  hasSelectedContacts: boolean;
  menuActions: Array<string> = [];
  reportdata: any = [];
  templateHeading: any;
  currentDate = new Date();
  reportPrintObj: RadiologyPrint;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  SBillNo: any;
  SOPIPtype: any;
  SFromDate: any;
  dateTimeObj: any;
  setStep(index: number) {
    this.step = index;
  }
  SearchName: string; 
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  dataSource = new MatTableDataSource<RadioPatientList>();
  displayedColumns: string[] = [
    'OP_Ip_Type',
    'IsCompleted',
    'PatientType', 
    'RadDate',
    'RegNo',
    'PatientName',
    'DoctorName', 
    'AgeGender',
    'ServiceName',
    'PBillNo',
    'MobileNo',
    'CompanyName',
    'RefDoctorName',
    'action'

  ];

  dataSource1 = new MatTableDataSource<RadioPatientList>(); 
  constructor( 
    private formBuilder: FormBuilder,
    public _RadiologyOrderListService: RadioloyOrderlistService,
    private _ActRoute: Router,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    public _SampleService: RadioloyOrderlistService,
    private accountService: AuthenticationService,
    private _fuseSidebarService: FuseSidebarService,
    private reportDownloadService: ExcelDownloadService,
  ) { }

  ngOnInit(): void {
    //this.getcaterorylist();
    this.getRadiologyPatientsList(); 
  } 
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  } 

  getcaterorylist() {
    this._RadiologyOrderListService.getCategoryNameCombo().subscribe((data) =>{
      this.CategoryList = data
    }) 
  }

  onClose() {
    //  this.dialogRef.close();
  }

  SearchTest() {
    var m_data = {
      "BillNo": this.SBillNo,
      "OP_IP_Type": this.SOPIPtype,
      "IsCompleted": this._SampleService.myformSearch.get("TestStatusSearch").value || 0,
      // "From_Dt": this.datePipe.transform(this.SFromDate, "yyyy-MM-dd "),
    }
    console.log(m_data);
    //  setTimeout(() => {
    this._SampleService.getTestList(m_data).subscribe(Visit => {
      this.dataSource1.data = Visit as RadioPatientList[];
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
  
 
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
 
  onShow(event: MouseEvent) { 
    this.click = !this.click;  
    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data'; 
        this.getRadiologyPatientsList();
      }

    }, 500);
    this.MouseEvent = true;
    this.click = true; 
  } 
  onClear() { 
    this._RadiologyOrderListService.myformSearch.get('FirstNameSearch').reset();
    this._RadiologyOrderListService.myformSearch.get('LastNameSearch').reset();
    this._RadiologyOrderListService.myformSearch.get('RegNoSearch').reset();
    this._RadiologyOrderListService.myformSearch.get('StatusSearch').reset();
    this._RadiologyOrderListService.myformSearch.get('PatientTypeSearch').reset();
    this._RadiologyOrderListService.myformSearch.get('CategoryId').reset();
  } 
  getRadiologyPatientsList() {
    this.sIsLoading = 'loading-data';
    var m_data = {
      "F_Name": (this._RadiologyOrderListService.myformSearch.get("FirstNameSearch").value).trim() + '%' || '%',
      "L_Name": (this._RadiologyOrderListService.myformSearch.get("LastNameSearch").value).trim() + '%' || '%',
      "Reg_No": this._RadiologyOrderListService.myformSearch.get("RegNoSearch").value || 0,
      "From_Dt": this.datePipe.transform(this._RadiologyOrderListService.myformSearch.get("start").value, "MM-dd-yyyy") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._RadiologyOrderListService.myformSearch.get("end").value, "MM-dd-yyyy") || '01/01/1900',
      "IsCompleted": this._RadiologyOrderListService.myformSearch.get("StatusSearch").value || 0,
      "OP_IP_Type": this._RadiologyOrderListService.myformSearch.get("PatientTypeSearch").value || 0,
      "CategoryId": this._RadiologyOrderListService.myformSearch.get("CategoryId").value || 0,
    }
    console.log(m_data);
    this._RadiologyOrderListService.getRadiologyOrderList(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as RadioPatientList[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource.data);
      this.sIsLoading = '';
      this.click = false; 
    },
      error => {
        this.sIsLoading = '';
      });

  }

  onSearchClear() {
    this._RadiologyOrderListService.myformSearch.reset({ RegNoSearch: '', FirstNameSearch: '', LastNameSearch: '', PatientTypeSearch: '', StatusSearch: '' });
  }

  getRecord(contact): void {
    console.log(contact);
    // let xx = {
    //   RegNo: contact.RegNo,
    //   PatientName: contact.PatientName,
    //   Doctorname: contact.DoctorName,
    //   DepartmentName: contact.DepartmentName,
    //   AdmDateTime: contact.AdmissionTime,
    //   OP_IP_Number: contact.OP_IP_Number,
    //   AgeYear: contact.AgeYear,
    //   GenderName: contact.GenderName,
    //   RefDoctorName: contact.RefDoctorName,
    //   PatientType: contact.PatientType,
    //   CompanyName: contact.CompanyName,
    //   LBL: contact.LBL,
    //   RadReportId: contact.RadReportId,
    //   RadTestID: contact.RadTestID, 
    //   AdmissionID: contact.VisitId,
    //   AdmissionDate: contact.AdmissionDate,
    //   CategoryName: contact.CategoryName,
    //   OPD_IPD_ID: contact.OPD_IPD_ID,
    //   ChargeId: contact.ChargeId, 
    //   PBillNo: contact.PBillNo,
    //   RadDate: contact.RadDate,
    //   ServiceName: contact.ServiceName,
    //   TestName: contact.TestName,
    //   OP_IP_Type: contact.OPD_IPD_Type,
    // };
    
    this.advanceDataStored.storage = new RadiologyPrint(contact);
    const dialogRef = this._matDialog.open(ResultEntryComponent,
      {
        maxWidth: "90%",
        height: '95%',
        width: '100%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getRadiologyPatientsList();
    });
  }

  getView(contact) {
    debugger;
    console.log(contact);
   
    this.advanceDataStored.storage = new RadiologyPrint(contact);

    const dialogRef = this._matDialog.open(RadiologyTemplateReportComponent,
      {
        maxWidth: "95vw",
        maxHeight: "130vh", 
        width: '100%',
        height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      //  this.getRadiologytemplateMasterList();
    });
  }



  onEdit(row, m) {

    this.SBillNo = m.PBillNo;
    this.SOPIPtype = m.OPD_IPD_Type;
    this.SFromDate = this.datePipe.transform(m.PathDate, "yyyy-MM-dd ");
 
  }

 
  viewgetRadioloyTemplateReportPdf(obj) {
    debugger
    this._RadiologyOrderListService.getRadiologyTempReport(
      obj.RadReportId,0
      ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Radiology Template  Viewer"
          }
        });
    });
  }
  


  exportReportExcel() {
    let exportHeaders = ['OP_Ip_Type', 'IsCompleted', 'RadDate', 'RegNo', 'PatientName', 'Doctorname', 'AgeGender', 'ServiceName','PBillNo','MobileNo','CompanyName','RefDoctorName'];
    this.reportDownloadService.getExportJsonData(this.dataSource.data, exportHeaders, 'Radiology List');
  }

  exportReportPdf() {
    let actualData = [];
    this.dataSource.data.forEach(e => {
      var tempObj = [];
      tempObj.push(e.OP_Ip_Type);
      tempObj.push(e.IsCompleted);
      tempObj.push(e.RadDate);
      tempObj.push(e.RegNo);
      tempObj.push(e.PatientName);
      tempObj.push(e.Doctorname);
      tempObj.push(e.AgeGender);
      tempObj.push(e.ServiceName);
      tempObj.push(e.PBillNo);
      tempObj.push(e.MobileNo);
      tempObj.push(e.CompanyName);
      tempObj.push(e.RefDoctorName);
      
      actualData.push(tempObj);
    });
    let headers = [['OP_Ip_Type', 'IsCompleted', 'RadDate', 'RegNo', 'PatientName', 'Doctorname', 'AgeGender', 'ServiceName','PBillNo','MobileNo','CompanyName','RefDoctorName']];
    this.reportDownloadService.exportPdfDownload(headers, actualData, 'Radiology List');
  }

} 


export class RadioPatientList {
  RadDate: Date;
  RadTime: Date;
  RegNo: any;
  PatientName: String;
  PatientType: number;
  TestName: String;
  ConsultantDoctor: any;
  CategoryName: String;
  AgeYear: number;
  GenderName: String;
  PBillNo: number;
  OPD_IPD_ID: any;
OP_Ip_Type: any;
IsCompleted: any;
DoctorName: any;
AgeGender: any;
ServiceName: any;
MobileNo: any;
CompanyName: any;
RefDoctorName: any;
Doctorname:any;

  constructor(RadioPatientList) {
    this.RadDate = RadioPatientList.RadDate || '';
    this.RadTime = RadioPatientList.RadTime;
    this.RegNo = RadioPatientList.RegNo;
    this.PatientName = RadioPatientList.PatientName;
    this.PBillNo = RadioPatientList.PBillNo;
    this.PatientType = RadioPatientList.PatientType || '0';
    this.ConsultantDoctor = RadioPatientList.ConsultantDoctor || '';
    this.TestName = RadioPatientList.TestName || '0';
    this.CategoryName = RadioPatientList.CategoryName || '';
    this.AgeYear = RadioPatientList.AgeYear;
    this.GenderName = RadioPatientList.GenderName;
    this.OPD_IPD_ID = RadioPatientList.OPD_IPD_ID || '';

    this.OP_Ip_Type = RadioPatientList.OP_Ip_Type || '';
    this.IsCompleted = RadioPatientList.IsCompleted || '0';
    this.DoctorName = RadioPatientList.DoctorName || '';
    this.AgeGender = RadioPatientList.AgeGender;
    this.ServiceName = RadioPatientList.ServiceName;
    this.MobileNo = RadioPatientList.MobileNo || '';
    this.CompanyName = RadioPatientList.CompanyName;
    this.RefDoctorName = RadioPatientList.RefDoctorName || '';
    this.Doctorname=RadioPatientList.Doctorname || ''
  }

}

export class Templateinfo {

  RegNo: Number;
  AdmissionID: Number;
  PatientName: string;
  Doctorname: string;
  AdmDateTime: string;
  AgeYear: number;
  RadReportId: number;
  RadTestID: String;


  /**
  * Constructor
  *
  * @param Templateinfo
  */
  constructor(Templateinfo) {
    {
      this.RegNo = Templateinfo.RegNo || '';
      this.AdmissionID = Templateinfo.AdmissionID || '';
      this.PatientName = Templateinfo.PatientName || '';
      this.Doctorname = Templateinfo.Doctorname || '';
      this.AdmDateTime = Templateinfo.AdmDateTime || '';
      this.AgeYear = Templateinfo.AgeYear || '';
      this.RadReportId = Templateinfo.RadReportId || '';
      this.RadTestID = Templateinfo.RadTestID || ''; 
    }
  }
}


export class RadiologyPrint {
  RegNo: Number;
  AdmissionID: Number;
  PatientName: string;
  Doctorname: string;
  AdmDateTime: string;
  AgeYear: number;
  RadReportId: number;
  RadTestID: String; 
  RadDate: Date;
  RadTime: Date; 
  PatientType: any;
  TestName: String;
  ConsultantDoctor: any;
  CategoryName: String; 
  GenderName: String;
  PBillNo: number;
  AdmissionDate: Date;
  VisitDate: Date;
  VisitTime: Date;
  OPDNo: number;
  IPDNo: number;
  ReportDate: Date;
  ReportTime: Date;
  ResultEntry: String;
  RadiologyDocName: string;
  RefDoctorName:any;
  SuggestionNotes: string;
  UserName: string;
  PrintTestName: string;
  Education: string;
  AgeDay: any;
  ChargeId: number;
  ServiceName: String;
  OP_IP_Type: any;
  OP_IP_Number:any;
  CompanyName:any;
  DepartmentName:any;
  AgeMonth:any;
  ServiceId:any;

  constructor(RadiologyPrint) {
    this.RadDate = RadiologyPrint.RadDate || '';
    this.CompanyName = RadiologyPrint.CompanyName || '';
    this.DepartmentName = RadiologyPrint.DepartmentName || '';
    this.RefDoctorName = RadiologyPrint.RefDoctorName || '';
    this.RadTime = RadiologyPrint.RadTime;
    this.RegNo = RadiologyPrint.RegNo;
    this.OP_IP_Number = RadiologyPrint.OP_IP_Number || '';
    this.RadTime = RadiologyPrint.RadTime;
    this.PatientName = RadiologyPrint.PatientName;
    this.PBillNo = RadiologyPrint.PBillNo;
    this.PatientType = RadiologyPrint.PatientType || '0';
    this.ConsultantDoctor = RadiologyPrint.ConsultantDoctor || '';
    this.TestName = RadiologyPrint.TestName || '0';
    this.CategoryName = RadiologyPrint.CategoryName || '';
    this.AgeYear = RadiologyPrint.AgeYear;
    this.GenderName = RadiologyPrint.GenderName;
    this.AdmissionDate = RadiologyPrint.AdmissionDate || '';
    this.VisitDate = RadiologyPrint.VisitDate || '';
    this.VisitTime = RadiologyPrint.VisitTime;
    this.OPDNo = RadiologyPrint.OPDNo;
    this.IPDNo = RadiologyPrint.IPDNo;
    this.ReportDate = RadiologyPrint.ReportDate;
    this.ReportTime = RadiologyPrint.ReportTime || '';
    this.ResultEntry = RadiologyPrint.ResultEntry || '';
    this.RadiologyDocName = RadiologyPrint.RadiologyDocName || '0';
    this.AgeMonth = RadiologyPrint.AgeMonth || '0';
    this.SuggestionNotes = RadiologyPrint.SuggestionNotes || '';
    this.UserName = RadiologyPrint.UserName;
    this.RadReportId = RadiologyPrint.RadReportId;

    this.PrintTestName = RadiologyPrint.PrintTestName;
    this.ChargeId = RadiologyPrint.ChargeId;
    this.Education = RadiologyPrint.Education;
    this.AgeDay = RadiologyPrint.AgeDay;
    this.ServiceName = RadiologyPrint.ServiceName;
    this.OP_IP_Type = RadiologyPrint.OP_IP_Type;


    this.AdmissionID = RadiologyPrint.AdmissionID || '';

    this.Doctorname = RadiologyPrint.Doctorname || '';
    this.AdmDateTime = RadiologyPrint.AdmDateTime || '';

    this.RadTestID = RadiologyPrint.RadTestID || '';
    this.ServiceId = RadiologyPrint.ServiceId || 0;
  }

}