import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PharmacyreportService } from './pharmacyreport.service';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BrowsSalesBillService } from 'app/main/pharmacy/brows-sales-bill/brows-sales-bill.service';
import { SalesService } from 'app/main/pharmacy/sales/sales.service';
import { IndentList, Printsal } from 'app/main/pharmacy/sales/sales.component';
import { Observable, Subscription } from 'rxjs';
import * as converter from 'number-to-words';
import { PrintPreviewService } from 'app/main/shared/services/print-preview.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-pharmacy-report',
  templateUrl: './pharmacy-report.component.html',
  styleUrls: ['./pharmacy-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PharmacyReportComponent implements OnInit {
  @ViewChild('SalescollectiontSummaryemplate') SalescollectiontSummaryemplate: ElementRef;
  @ViewChild('SalesPatientwiseTemplate') SalesPatientwiseTemplate: ElementRef;
  @ViewChild('SalesDailycollectiontemplate') SalesDailycollectiontemplate: ElementRef;
  @ViewChild('SalesReturntemplate') SalesReturntemplate: ElementRef;
  @ViewChild('billTemplate') billTemplate: ElementRef;

  UserList: any = [];
  sIsLoading: string = '';
  currentDate = new Date();
  reportPrintObjList: Printsal[] = [];
  reportPrintObjListTest: Printsal[] = [];
  reportPrintObjList2: Printsal[] = [];
  reportPrintObjList1: IndentList[] = [];
  printTemplate: any;
  reportPrintObj: Printsal;
  reportPrintObjTax: Printsal;
  subscriptionArr: Subscription[] = [];
  ReportID: any;
  TotalCashpay: any = 0;
  TotalCardpay: any = 0;
  TotalChequepay: any = 0;
  TotalNeftpay: any = 0;
  TotalPayTmpay: any = 0;
  TotalBalancepay: any = 0;
  TotalAdvUsed: any = 0;
  TotalNETAmount: any = 0;
  TotalPaidAmount: any = 0;
  TotalBillAmount: any = 0;
  filteredOptionsUser: Observable<string[]>;
  isUserSelected: boolean = false;

  optionsUser: any[] = [];
  TotalAmount: any = 0;
  TotalVatAmount: any = 0;
  TotalDiscAmount: any = 0;
  TotalCGST: any = 0;
  TotalSGST: any = 0;
  TotalIGST: any = 0;
  ReportName: any;
  SalesNetAmount: any = 0;
  SalesReturnNetAmount: any = 0;
  SalesDiscAmount: any = 0;
  SalesReturnDiscAmount: any = 0;
  SalesBillAmount: any = 0;
  SalesReturnBillAmount: any = 0;
  SalesPaidAmount: any = 0;
  SalesReturnPaidAmount: any = 0;
  SalesBalAmount: any = 0;
  SalesReturnBalAmount: any = 0;

  SalesCashAmount: any = 0;
  SalesReturnCashAmount: any = 0;

  TotalBalAmount: any = 0;
  TotalCashAmount: any = 0;

  FromDate: any;
  Todate: any;
  UserId:any=0;
  UserName:any;
  displayedColumns = [
    'ReportName'
  ];

  dataSource = new MatTableDataSource<ReportDetail>();
  constructor(
    // this.dataSource.data = TREE_DATA;
    public _PharmacyreportService: PharmacyreportService,
    public _PrintPreviewService: PrintPreviewService,

    public _BrowsSalesService: SalesService,
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    public datePipe: DatePipe,
    public _BrowsSalesBillService: BrowsSalesBillService,
    private _loggedUser: AuthenticationService,
    private formBuilder: FormBuilder
  ) { 
    this.UserId= this._loggedUser.currentUserValue.user.id;
    this.UserName= this._loggedUser.currentUserValue.user.userName;
  }


  ngOnInit(): void {
    this.bindReportData();
    this.GetUserList();
    console.log(this.UserList)
    const toSelect = this.UserList.find(c => c.UserId == this.UserId);
    this._BrowsSalesBillService.userForm.get('UserId').setValue(toSelect);

  }

  bindReportData() {
    // let qry = "SELECT * FROM ReportConfigMaster WHERE IsActive=1 AND IsDeleted=0 AND ReportType=1";

    this._PharmacyreportService.getDataByQuery().subscribe(data => {
      this.dataSource.data = data as any[];

    });
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  ReportSelection(el) {
    this.ReportName = el.ReportName;
    this.ReportID = el.ReportId;

  }

  
  getOptionTextUser(option) {
    this.UserId = option.UserId;
    this.UserName=option.UserName;
    return option && option.UserName ? option.UserName : '';
   
  }


  private _filterUser(value: any): string[] {
    if (value) {
      const filterValue = value && value.UserName ? value.UserName.toLowerCase() : value.toLowerCase();
      return this.optionsUser.filter(option => option.UserName.toLowerCase().includes(filterValue));
    }
  }

  GetUserList() {
    var data ={
      "StoreId":this._loggedUser.currentUserValue.user.storeId
    }
    this._PharmacyreportService.getUserdetailList(data).subscribe(data => {
      this.UserList = data;
      this.optionsUser = this.UserList.slice();
      console.log(this.UserList);
      this.filteredOptionsUser = this._BrowsSalesBillService.userForm.get('UserId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterUser(value) : this.UserList.slice()),
      );

    });
  // }, 2000);
      
  }


  
  getPrint() {
    if (this.ReportName == 'Pharmacy Daily Collection') {
      this.viewDailyCollectionPdf();
    } else if (this.ReportName == 'Pharmacy Daily Collection Summary') {
      this.viewDailyCollectionSummaryPdf();
    } else if (this.ReportName == 'Sales Summary Report') {
      this.viewgetsalesSummaryReportPdf();
    } else if (this.ReportName == 'Sales Patient Wise Report') {
      this.viewgetSalesPatientWiseReportPdf();
    } else if (this.ReportName == 'Sales Return Summary Report') {
      this.viewgetSalesReturnReportPdf();
    } else if (this.ReportName == 'Sales Return PatientWise Report') {
      this.viewgetSalesReturnPatientwiseReportPdf();
    } else if (this.ReportName == 'Sales Credit Report') {
      this.viewgetSalesCreditReportPdf();
    } else if (this.ReportName == 'Pharmacy Daily Collection Summary Day & User Wise') {
      this.viewgetPharCollsummDayuserwiseReportPdf();
    }
  }



  viewDailyCollectionPdf(){
    this._BrowsSalesBillService.getSalesDailyCollectionNew(
      this.datePipe.transform(this._BrowsSalesBillService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      this.datePipe.transform(this._BrowsSalesBillService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      this._loggedUser.currentUserValue.user.storeId,this._BrowsSalesBillService.userForm.get('UserId').value.UserId || 0
    ).subscribe(res=>{
    const dialogRef = this._matDialog.open(PdfviewerComponent, 
      {   maxWidth: "95vw",
          height: '1000px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Pharma Daily Collection Viewer"
          }
        });
    });
  }



  viewDailyCollectionSummaryPdf() {
    console.log(this._BrowsSalesBillService.userForm.get('UserId').value.UserId || 0)

    this._BrowsSalesBillService.getSalesDailyCollectionSummary(
      this.datePipe.transform(this._BrowsSalesBillService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      this.datePipe.transform(this._BrowsSalesBillService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      this._loggedUser.currentUserValue.user.storeId,
      this._BrowsSalesBillService.userForm.get('UserId').value.UserId || 0 //this.UserId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Pharma Daily Collection Summary Viewer"
          }
        });
    });
  }

  viewgetPharCollsummDayuserwiseReportPdf() {


    this._BrowsSalesBillService.getSalesDailyCollectionSummaryDayuserwise(
      this.datePipe.transform(this._BrowsSalesBillService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      this.datePipe.transform(this._BrowsSalesBillService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      this._loggedUser.currentUserValue.user.storeId,this._BrowsSalesBillService.userForm.get('UserId').value.UserId || 0
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Pharma Daily Collection Summary Viewer"
          }
        });
    });
  }

  // viewgetsalesReportPdf() {

  //   this._BrowsSalesBillService.getSalesDetail(
  //     this.datePipe.transform(this._BrowsSalesBillService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
  //     this.datePipe.transform(this._BrowsSalesBillService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', 11, 12,
  //     this._loggedUser.currentUserValue.user.storeId, 0
  //   ).subscribe(res => {
  //     const dialogRef = this._matDialog.open(PdfviewerComponent,
  //       {
  //         maxWidth: "85vw",
  //         height: '750px',
  //         width: '100%',
  //         data: {
  //           base64: res["base64"] as string,
  //           title: "Pharma Daily Collection Summary Viewer"
  //         }
  //       });
  //   });
  // }

  viewgetsalesSummaryReportPdf() {

    this._BrowsSalesBillService.getSalesDetailSummary(
      this.datePipe.transform(this._BrowsSalesBillService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      this.datePipe.transform(this._BrowsSalesBillService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',0,0,this.UserId,
      this._loggedUser.currentUserValue.user.storeId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Pharma Sales Summary Viewer"
          }
        });
    });
  }

  viewgetSalesPatientWiseReportPdf() {

    this._BrowsSalesBillService.getSalesDetail_Patientwise(
      this.datePipe.transform(this._BrowsSalesBillService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      this.datePipe.transform(this._BrowsSalesBillService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',0,0,this.UserId,
      this._loggedUser.currentUserValue.user.storeId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Pharma Daily Collection Summary Viewer"
          }
        });
    });
  }

 
  viewgetSalesReturnReportPdf() {

    this._BrowsSalesBillService.getSalesReturn(
      this.datePipe.transform(this._BrowsSalesBillService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      this.datePipe.transform(this._BrowsSalesBillService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',0,0,
      this._loggedUser.currentUserValue.user.storeId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Pharma Daily Collection Summary Viewer"
          }
        });
    });
  }
  viewgetSalesReturnPatientwiseReportPdf() {

    this._BrowsSalesBillService.getSalesReturnPatientwise(
      this.datePipe.transform(this._BrowsSalesBillService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      this.datePipe.transform(this._BrowsSalesBillService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',0,0,
      this._loggedUser.currentUserValue.user.storeId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Pharma Daily Collection Summary Viewer"
          }
        });
    });
  }


  viewgetSalesCreditReportPdf() {

    this._BrowsSalesBillService.getSalesCredit(
      this.datePipe.transform(this._BrowsSalesBillService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      this.datePipe.transform(this._BrowsSalesBillService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', 0,0,0,
      this._loggedUser.currentUserValue.user.storeId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Pharma Daily Collection Summary Viewer"
          }
        });
    });
  }

  userChk(option){
    this.UserId=option.UserID || 0;
    this.UserName=option.UserName;
  }

  onClose() { }


  convertToWord(e) {

    return converter.toWords(e);
  }

  transform2(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    return value;
  }

}


export class ReportDetail {
  ReportName: any;
  ReportId: any;
  constructor(ReportDetail) {
    this.ReportName = ReportDetail.ReportName || '';
    this.ReportId = ReportDetail.ReportId || '';
  }
}