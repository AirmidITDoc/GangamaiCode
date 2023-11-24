import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PharmacyreportService } from './pharmacyreport.service';
import { fuseAnimations } from '@fuse/animations';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatTreeModule } from '@angular/material/tree';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BrowsSalesBillService } from 'app/main/pharmacy/brows-sales-bill/brows-sales-bill.service';
import { SalesService } from 'app/main/pharmacy/sales/sales.service';
import { IndentList, Printsal } from 'app/main/pharmacy/sales/sales.component';
import { Subscription } from 'rxjs';
import * as converter from 'number-to-words';
import Swal from 'sweetalert2';
import { PrintPreviewService } from 'app/main/shared/services/print-preview.service';


@Component({
  selector: 'app-pharmacy-report',
  templateUrl: './pharmacy-report.component.html',
  styleUrls: ['./pharmacy-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PharmacyReportComponent implements OnInit {
  // treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  // dataSource = new MatTreeNestedDataSource<FoodNode>();
  @ViewChild('SalescollectiontSummaryemplate') SalescollectiontSummaryemplate: ElementRef;

  @ViewChild('SalesDailycollectiontemplate') SalesDailycollectiontemplate: ElementRef;
  @ViewChild('SalesReturntemplate') SalesReturntemplate: ElementRef;


  @ViewChild('billTemplate') billTemplate: ElementRef;
  sIsLoading: string = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  currentDate = new Date();
  reportPrintObjList: Printsal[] = [];
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
  
 FromDate:any;
  Todate:any; 

  displayedColumns = [
    'ReportName'
    // 'buttons'

  ];

  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = ELEMENT_DATA;

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
    private accountService: AuthenticationService,
    private formBuilder: FormBuilder
  ) { }

  // hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    this.bindReportData();
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

  getPrint() {
    if (this.ReportID == 1) {
      this.getPrintsalesDailycollection();
    } else if (this.ReportID == 2) {
      this.getsalescollectionSummary();
    } else if (this.ReportID == 5) {
      this.getPrintsalesReturn();
    }
  }

  getsalescollectionSummary() {

    var D_data = {
      "FromDate": this.datePipe.transform(this._BrowsSalesBillService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "ToDate": this.datePipe.transform(this._BrowsSalesBillService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "StoreId": this.accountService.currentUserValue.user.storeId,
      "AddedById": 0,//this.accountService.currentUserValue.user.id,

    }
    this.FromDate=this.datePipe.transform(this._BrowsSalesBillService.userForm.get('startdate').value, "yyyy-MM-dd") || '01/01/1900';
    this.Todate =this.datePipe.transform(this._BrowsSalesBillService.userForm.get('enddate').value, "yyyy-MM-dd") || '01/01/1900';
   
    let printContents;
    this.subscriptionArr.push(
      this._BrowsSalesBillService.getSalesCollectionSummary(D_data).subscribe(res => {

        this.reportPrintObjList = res as Printsal[];
        console.log(this.reportPrintObjList);

        for (let i = 1; i <= this.reportPrintObjList.length; i++) {
          debugger
          var objreportPrint = this.reportPrintObjList[i - 1];
          let PackValue = '1200'

          if (objreportPrint.Label == 'Sales') {
            this.SalesBillAmount = (parseFloat(this.SalesBillAmount) + parseFloat(objreportPrint.TotalBillAmount)).toFixed(2);
            this.SalesDiscAmount = (parseFloat(this.SalesDiscAmount) + parseFloat(objreportPrint.DiscAmount)).toFixed(2);
            this.SalesNetAmount = (parseFloat(this.SalesNetAmount) + parseFloat(objreportPrint.NetAmount)).toFixed(2);
            this.SalesPaidAmount = (parseFloat(this.SalesPaidAmount) + parseFloat(objreportPrint.PaidAmount)).toFixed(2);
            this.SalesBalAmount = (parseFloat(this.SalesBalAmount) + parseFloat(objreportPrint.BalAmount)).toFixed(2);
            this.SalesCashAmount = (parseFloat(this.SalesCashAmount) + parseFloat(objreportPrint.CashPay)).toFixed(2);

          } else if (objreportPrint.Label == 'Sales Return') {
            this.SalesReturnBillAmount = (parseFloat(this.SalesReturnBillAmount) + parseFloat(objreportPrint.TotalBillAmount)).toFixed(2);
            this.SalesReturnDiscAmount = (parseFloat(this.SalesReturnDiscAmount) + parseFloat(objreportPrint.DiscAmount)).toFixed(2);
            this.SalesReturnNetAmount = (parseFloat(this.SalesReturnNetAmount) + parseFloat(objreportPrint.NetAmount)).toFixed(2);
            this.SalesReturnPaidAmount = (parseFloat(this.SalesReturnPaidAmount) + parseFloat(objreportPrint.PaidAmount)).toFixed(2);
            this.SalesReturnBalAmount = (parseFloat(this.SalesReturnBalAmount) + parseFloat(objreportPrint.BalAmount)).toFixed(2);
            this.SalesReturnCashAmount = (parseFloat(this.SalesReturnCashAmount) + parseFloat(objreportPrint.CashPay)).toFixed(2);
          }
        }
        this.TotalBillAmount = ((parseFloat(this.SalesBillAmount) - parseFloat(this.SalesReturnBillAmount))).toFixed(2);
        this.TotalDiscAmount = ((parseFloat(this.SalesDiscAmount) - parseFloat(this.SalesReturnDiscAmount))).toFixed(2);
        this.TotalNETAmount = ((parseFloat(this.SalesNetAmount) - parseFloat(this.SalesReturnNetAmount))).toFixed(2);
        this.TotalPaidAmount = ((parseFloat(this.SalesPaidAmount) - parseFloat(this.SalesReturnPaidAmount))).toFixed(2);
        this.TotalBalAmount = ((parseFloat(this.SalesBalAmount) - parseFloat(this.SalesReturnBalAmount))).toFixed(2);
        this.TotalCashAmount = ((parseFloat(this.SalesCashAmount) - parseFloat(this.SalesReturnCashAmount))).toFixed(2);
      

        this.reportPrintObj = res[0] as Printsal;

        setTimeout(() => {
          this._PrintPreviewService.PrintView(this.SalescollectiontSummaryemplate.nativeElement.innerHTML);
        }, 1000);

      })
    );
  }




  getPrintsalesDailycollection() {

    var D_data = {

      "FromDate": this.datePipe.transform(this._BrowsSalesBillService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "ToDate": this.datePipe.transform(this._BrowsSalesBillService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "StoreId": this.accountService.currentUserValue.user.storeId,
      "AddedById": 0,//this.accountService.currentUserValue.user.id,

    }
    this.FromDate=this.datePipe.transform(this._BrowsSalesBillService.userForm.get('startdate').value, "yyyy-MM-dd") || '01/01/1900';
    this.Todate =this.datePipe.transform(this._BrowsSalesBillService.userForm.get('enddate').value, "yyyy-MM-dd") || '01/01/1900';
   
    let printContents;
    this.subscriptionArr.push(
      this._BrowsSalesBillService.getSalesDailyCollection(D_data).subscribe(res => {

        this.reportPrintObjList = res as Printsal[];
        this.reportPrintObjList2 = res as Printsal[];
        console.log(this.reportPrintObjList);

        for (let i = 1; i <= this.reportPrintObjList.length; i++) {

          var objreportPrint = this.reportPrintObjList[i - 1];
          let PackValue = '1200'

          this.TotalCashpay = (parseFloat(this.TotalCashpay) + parseFloat(objreportPrint.CashPayAmount)).toFixed(2);
          this.TotalCardpay = (parseFloat(this.TotalCardpay) + parseFloat(objreportPrint.CardPayAmount)).toFixed(2);
          this.TotalChequepay = (parseFloat(this.TotalChequepay) + parseFloat(objreportPrint.ChequePayAmount)).toFixed(2);
          this.TotalNeftpay = (parseFloat(this.TotalNeftpay) + parseFloat(objreportPrint.NEFTPayAmount)).toFixed(2);
          this.TotalPayTmpay = (parseFloat(this.TotalPayTmpay) + parseFloat(objreportPrint.PayTMAmount)).toFixed(2);
          this.TotalBalancepay = (parseFloat(this.TotalBalancepay) + parseFloat(objreportPrint.BalanceAmount)).toFixed(2);
          this.TotalPaidAmount = (parseFloat(this.TotalPaidAmount) + parseFloat(objreportPrint.PaidAmount)).toFixed(2);
          this.TotalNETAmount = (parseFloat(this.TotalNETAmount) + parseFloat(objreportPrint.NetAmount)).toFixed(2);
        }

        this.reportPrintObj = res[0] as Printsal;

        setTimeout(() => {
          this._PrintPreviewService.PrintView(this.SalesDailycollectiontemplate.nativeElement.innerHTML);
        }, 1000);

      })
    );
  }



  getPrintsalesReturn() {

    var D_data = {

      "FromDate": '07-02-2023',// this.datePipe.transform(this._BrowsSalesBillService.userForm.get('start').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',                                           
      "ToDate": '07-20-2023',// this.datePipe.transform(this._BrowsSalesBillService.userForm.get('end').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',                                              
      "SalesFromNumber": 0,//this._loggedService.currentUserValue.user.id,
      "SalesToNumber": 0,//this._loggedService.currentUserValue.user.id,
      "StoreId": 10016,//this._BrowsSalesBillService.formReturn.get('StoreId').value.storeid || 0  ,


    }

    let printContents;
    this.subscriptionArr.push(
      this._BrowsSalesBillService.getSalesReturnPrint(D_data).subscribe(res => {

        this.reportPrintObjList1 = res as IndentList[];
        console.log(this.reportPrintObjList1);

        for (let i = 1; i <= this.reportPrintObjList1.length; i++) {

          var objreportPrint = this.reportPrintObjList1[i - 1];
          let PackValue = '1200'

          this.TotalAmount = (parseFloat(this.TotalAmount) + parseFloat(objreportPrint.TotalAmount)).toFixed(2);
          this.TotalVatAmount = (parseFloat(this.TotalVatAmount) + parseFloat(objreportPrint.VatAmount)).toFixed(2);
          this.TotalDiscAmount = (parseFloat(this.TotalDiscAmount) + parseFloat(objreportPrint.DiscAmount)).toFixed(2);
          this.TotalBalancepay = (parseFloat(this.TotalBalancepay) + parseFloat(objreportPrint.BalanceAmount)).toFixed(2);
          this.TotalNETAmount = (parseFloat(this.TotalNETAmount) + parseFloat(objreportPrint.NetAmount)).toFixed(2);
          this.TotalCGST = (parseFloat(this.TotalCGST) + parseFloat(objreportPrint.CGSTAmt)).toFixed(2);
          this.TotalSGST = (parseFloat(this.TotalSGST) + parseFloat(objreportPrint.SGSTAmt)).toFixed(2);
          this.TotalIGST = (parseFloat(this.TotalIGST) + parseFloat(objreportPrint.IGSTAmt)).toFixed(2);
        }

        this.reportPrintObj = res[0] as Printsal;

        setTimeout(() => {
          this.print5();
        }, 1000);

      })
    );
  }

  print5() {
    let popupWin, printContents;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');

    popupWin.document.write(` <html>
    <head><style type="text/css">`);
    popupWin.document.write(`
      </style>
      <style type="text/css" media="print">
    @page { size: portrait; }
  </style>
          <title></title>
      </head>
    `);
    popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.SalesReturntemplate.nativeElement.innerHTML}</body>
    <script>
      var css = '@page { size: portrait; }',
      head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');
      style.type = 'text/css';
      style.media = 'print';
  
      if (style.styleSheet){
          style.styleSheet.cssText = css;
      } else {
          style.appendChild(document.createTextNode(css));
      }
      head.appendChild(style);
    </script>
    </html>`);
    // popupWin.document.write(`<body style="margin:0;font-size: 16px;">${this.printTemplate}</body>
    // </html>`);

    // popupWin.document.close();
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