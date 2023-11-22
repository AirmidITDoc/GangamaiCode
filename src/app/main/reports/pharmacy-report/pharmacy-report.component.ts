import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PharmacyreportService } from './pharmacyreport.service';
import { fuseAnimations } from '@fuse/animations';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import {MatTreeModule} from '@angular/material/tree';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BrowsSalesBillService } from 'app/main/pharmacy/brows-sales-bill/brows-sales-bill.service';
import { SalesService } from 'app/main/pharmacy/sales/sales.service';
import { Printsal } from 'app/main/pharmacy/sales/sales.component';
import { Subscription } from 'rxjs';
import * as converter from 'number-to-words';
import Swal from 'sweetalert2';

// interface FoodNode {
//   name: string;
//   children?: FoodNode[];
// }

// const TREE_DATA: FoodNode[] = [
//   {
//     name: 'Fruit',
//     children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }],
//   },
//   {
//     name: 'Vegetables',
//     children: [
//       {
//         name: 'Green',
//         children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
//       },
//       {
//         name: 'Orange',
//         children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
//       },
//     ],
//   },
// ];


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


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
  
  @ViewChild('billTemplate') billTemplate:ElementRef;
  sIsLoading: string = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  currentDate =new Date();
  reportPrintObjList: Printsal[] = [];
  printTemplate: any;
  reportPrintObj: Printsal;
  reportPrintObjTax: Printsal;
  subscriptionArr: Subscription[] = [];
  ReportID:any;
  TotalCashpay:any=0;
  TotalCardpay:any=0;
  TotalChequepay:any=0;
  TotalNeftpay:any=0;
  TotalPatTmpay:any=0;
  TotalBalancepay:any=0;
  
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
    public _BrowsSalesBillService:BrowsSalesBillService,
    public _BrowsSalesService :SalesService,
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    public datePipe: DatePipe,
    // private dialogRef: MatDialogRef<IPAdvanceComponent>,
    private accountService: AuthenticationService,
    private formBuilder: FormBuilder
  )
  {}

  // hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    this.bindReportData();
  }
  
  bindReportData() {
    // let qry = "SELECT * FROM ReportConfigMaster WHERE IsActive=1 AND IsDeleted=0 AND ReportType=1";

    this._PharmacyreportService.getDataByQuery().subscribe(data => {
      this.dataSource.data = data as any[];
      console.log(data)
    });
  }

  dateTimeObj:any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  ReportSelection(el){
   
    this.ReportID=el.ReportId;

    if(el.ReportId==1){
      this.getPrintsalesDailyCollection(el);
    }else if(el.ReportId==2){
      this.getPrintsalescollection(el);
    }
  }


  onClose(){}

    getPrintsalescollection(el){

    debugger
    var D_data = {

      "FromDate":'11/01/2023',// this.datePipe.transform(this._BrowsSalesBillService.userForm.get('start').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',                                           
      "ToDate":'11/30/2023',// this.datePipe.transform(this._BrowsSalesBillService.userForm.get('end').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',                                              
      "StoreId": 10016,//this._BrowsSalesBillService.formReturn.get('StoreId').value.storeid || 0  ,
      "AddedById": 0//this._loggedService.currentUserValue.user.id,
      
    }

    let printContents;
    this.subscriptionArr.push(
      this._BrowsSalesBillService.getSalesCollectionPrint(D_data).subscribe(res => {

        this.reportPrintObjList = res as Printsal[];
        console.log(this.reportPrintObjList);

        this.reportPrintObj = res[0] as Printsal;
        console.log(this.reportPrintObj);
        this.getTemplatesalescollection();

    
      })
    );
}
getTemplatesalescollection() {
    
  let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=38';
  this._BrowsSalesService.getTemplate(query).subscribe((resData: any) => {

    this.printTemplate = resData[0].TempDesign;
    let keysArray = ['PatientName', 'RegNo', 'IP_OP_Number', 'DoctorName', 'SalesNo', 'Date', 'Time', 'ItemName', 'OP_IP_Type', 'GenderName', 'AgeYear', 'BatchNo', 'BatchExpDate', 'UnitMRP', 'Qty', 'TotalAmount', 'GrossAmount', 'NetAmount', 'VatPer', 'VatAmount', 'DiscAmount', 'ConcessionReason', 'PaidAmount', 'BalanceAmount', 'UserName', 'HSNCode', 'CashPayAmount', 'CardPayAMount', 'ChequePayAmount', 'PayTMAmount', 'NEFTPayAmount', 'GSTPer', 'GSTAmt', 'CGSTAmt', 'CGSTPer', 'SGSTPer', 'SGSTAmt', 'IGSTPer', 'IGSTAmt', 'ManufShortName', 'StoreNo','StoreName', 'DL_NO', 'GSTIN', 'CreditReason', 'CompanyName','HTotalAmount','ExtMobileNo'];
    // ;
    for (let i = 0; i < keysArray.length; i++) {
      let reString = "{{" + keysArray[i] + "}}";
      let re = new RegExp(reString, "g");
      this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
    }
    var strrowslist = "";
    for (let i = 1; i <= this.reportPrintObjList.length; i++) {
      console.log(this.reportPrintObjList);


      var objreportPrint = this.reportPrintObjList[i - 1];
      let PackValue = '1200'
      console.log(objreportPrint)
      
    this.TotalCashpay= (parseFloat(this.TotalCashpay) +  parseFloat(objreportPrint.CashPayAmount)).toFixed(4);
    this.TotalCardpay= (parseFloat(this.TotalCardpay) +  parseFloat(objreportPrint.CardPayAmount)).toFixed(4);
    this.TotalChequepay= (parseFloat(this.TotalChequepay) +  parseFloat(objreportPrint.ChequePayAmount)).toFixed(4);
    this.TotalNeftpay= (parseFloat(this.TotalNeftpay) +  parseFloat(objreportPrint.NEFTPayAmount)).toFixed(4);
    this.TotalPatTmpay= (parseFloat(this.TotalPatTmpay) +  parseFloat(objreportPrint.PayTMAmount)).toFixed(4);
    this.TotalBalancepay = (parseFloat(this.TotalPatTmpay) +  parseFloat(objreportPrint.BalanceAmount)).toFixed(4);

    console.log( this.TotalCashpay,this.TotalCardpay,this.TotalChequepay,this.TotalNeftpay,this.TotalPatTmpay)

      // <div style="display:flex;width:60px;margin-left:20px;">
      //     <div>`+ i + `</div> 
      // </div>

      // <div style="display:flex;width:300px;margin-left:10px;">
      // <div>`+ this.datePipe.transform(objreportPrint.Date, 'dd/MM/yyyy') + `</div>
      // </div>
      var strabc = `
      <hr style="border-color:white" >
      <div style="display:flex;margin:8px 0">
      <div style="display:flex;width:50px;margin-left:20px;">
          <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
      </div>
      <div style="display:flex;width:100px;text-align:center;">
      <div>`+  this.datePipe.transform(objreportPrint.Date, 'dd/MM/yyyy') + `</div> 
      </div>
      <div style="display:flex;width:110px;text-align:left;">
      <div>`+objreportPrint.SalesNo + `</div> 
      </div>
       <div style="display:flex;width:260px;text-align:left;">
          <div>`+ objreportPrint.PatientName + `</div> 
      </div>
      <div style="display:flex;width:120px;text-align:left;">
      <div>`+ objreportPrint.CashPayAmount + `</div> 
       </div>
      <div style="display:flex;width:120px;text-align:left;">
      <div>`+objreportPrint.CardPayAmount + `</div> 
      </div>
      <div style="display:flex;width:120px;text-align:left;">
      <div>`+ objreportPrint.ChequePayAmount + `</div> 
      </div>
        <div style="display:flex;width:120px;text-align:left;">
      <div>`+ objreportPrint.NEFTPayAmount + `</div> 
      </div>
        <div style="display:flex;width:120px;text-align:left;">
      <div>`+ objreportPrint.PayTMAmount + `</div> 
      </div>
        <div style="display:flex;width:120px;text-align:left;">
      <div>`+ objreportPrint.AdvanceUsedAmount + `</div> 
      </div>
      <div style="display:flex;width:120px;margin-left:10px;text-align:left;">
          <div>`+ '₹' + objreportPrint.BalanceAmount.toFixed(2) + `</div> 
      </div>
      </div>`;
      strrowslist += strabc;
    }

   
    var objPrintWordInfo = this.reportPrintObjList[0];

    this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.NetAmount));
    this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
    this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.Time));
    this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);

    this.printTemplate = this.printTemplate.replace('SetTotalCashpay', this.TotalCashpay);
    this.printTemplate = this.printTemplate.replace('SetTotalCardpay', this.TotalCardpay);
    this.printTemplate = this.printTemplate.replace('SetTotalChequepay', this.TotalChequepay);
    this.printTemplate = this.printTemplate.replace('SetTotalNeftpay', this.TotalNeftpay);
    this.printTemplate = this.printTemplate.replace('SetTotalPatTmpay', this.TotalPatTmpay);
    this.printTemplate = this.printTemplate.replace('SetTotalBalancepay', this.TotalBalancepay);


    this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
    console.log(this.printTemplate);

    setTimeout(() => {
       this.print();
    }, 1000);
  });


}

  print() {
    let popupWin, printContents;
   
    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
    
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
  
  getPrintsalesDailyCollection(el){

    debugger
    var D_data = {

      "FromDate": this.datePipe.transform(this._BrowsSalesBillService.userForm.get('start').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',                                           
      "ToDate": this.datePipe.transform(this._BrowsSalesBillService.userForm.get('end').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',                                              
      "StoreId":this._BrowsSalesBillService.formReturn.get('StoreId').value.storeid || 0  ,
      "AddedById":this.accountService.currentUserValue.user.id,

    }

    let printContents;
    this.subscriptionArr.push(
      this._BrowsSalesBillService.getSalesCollectionPrint(D_data).subscribe(res => {

        this.reportPrintObjList = res as Printsal[];
        console.log(this.reportPrintObjList);

        this.reportPrintObj = res[0] as Printsal;
        console.log(this.reportPrintObj);
        this.getTemplatesalesDailyCollection();

    
      })
    );
}
getTemplatesalesDailyCollection() {
    debugger
    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=25';
    this._BrowsSalesService.getTemplate(query).subscribe((resData: any) => {
  
      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['PatientName', 'RegNo', 'IP_OP_Number', 'DoctorName', 'SalesNo', 'Date', 'Time', 'ItemName', 'OP_IP_Type', 'GenderName', 'AgeYear', 'BatchNo', 'BatchExpDate', 'UnitMRP', 'Qty', 'TotalAmount', 'GrossAmount', 'NetAmount', 'VatPer', 'VatAmount', 'DiscAmount', 'ConcessionReason', 'PaidAmount', 'BalanceAmount', 'UserName', 'HSNCode', 'CashPayAmount', 'CardPayAMount', 'ChequePayAmount', 'PayTMAmount', 'NEFTPayAmount', 'GSTPer', 'GSTAmt', 'CGSTAmt', 'CGSTPer', 'SGSTPer', 'SGSTAmt', 'IGSTPer', 'IGSTAmt', 'ManufShortName', 'StoreNo','StoreName', 'DL_NO', 'GSTIN', 'CreditReason', 'CompanyName','HTotalAmount','ExtMobileNo'];
      // ;
      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      var strrowslist = "";
      for (let i = 1; i <= this.reportPrintObjList.length; i++) {
        console.log(this.reportPrintObjList);
        var objreportPrint = this.reportPrintObjList[i - 1];
        let PackValue = '1200'
        // <div style="display:flex;width:60px;margin-left:20px;">
        //     <div>`+ i + `</div> 
        // </div>
  
        var strabc = `
          <div style="display:flex;width:300px;margin-left:10px;">
        <div>`+ this.datePipe.transform(objreportPrint.Date, 'dd/MM/yyyy') + `</div>
        </div>
            <hr style="border-color:white" >
        <div style="display:flex;margin:8px 0">
        <div style="display:flex;width:20px;margin-left:20px;">
            <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
        </div>
      
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+  this.datePipe.transform(objreportPrint.Date, 'dd/MM/yyyy') + `</div> 
        </div>
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+objreportPrint.SalesNo + `</div> 
        </div>
        <div style="display:flex;width:240px;text-align:left;margin-left:10px;">
            <div>`+ objreportPrint.MRNO + `</div> 
        </div>
         <div style="display:flex;width:60px;text-align:left;">
            <div>`+ objreportPrint.PatientName + `</div> 
        </div>
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.CashPayAmount + `</div> 
         </div>
        <div style="display:flex;width:90px;text-align:left;margin-left:10px;">
        <div>`+objreportPrint.CardPayAmount + `</div> 
        </div>
        <div style="display:flex;width:80px;text-align:left;margin-left:20px;">
        <div>`+ objreportPrint.ChequePayAmount + `</div> 
        </div>
          <div style="display:flex;width:80px;text-align:left;margin-left:20px;">
        <div>`+ objreportPrint.NEFTPayAmount + `</div> 
        </div>
          <div style="display:flex;width:80px;text-align:left;margin-left:20px;">
        <div>`+ objreportPrint.PayTMAmount + `</div> 
        </div>
          <div style="display:flex;width:80px;text-align:left;margin-left:20px;">
        <div>`+ objreportPrint.AdvanceUsedAmount + `</div> 
        </div>
        <div style="display:flex;width:100px;margin-left:10px;text-align:left;">
            <div>`+ '₹' + objreportPrint.BalanceAmount.toFixed(2) + `</div> 
        </div>
        </div>`;
        strrowslist += strabc;
      }
      var objPrintWordInfo = this.reportPrintObjList[0];
  
      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.NetAmount));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.Time));
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);
  
      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      console.log(this.printTemplate);
  
      setTimeout(() => {
         this.print2();
      }, 1000);
    });
  
  
  }
  convertToWord(e) {

    return converter.toWords(e);
  }
  print2() {
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
    popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.billTemplate.nativeElement.innerHTML}</body>
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


  transform2(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    return value;
  }
  
}


export class ReportDetail {
  ReportName:any;
  ReportId:any;
  constructor(ReportDetail){
this.ReportName = ReportDetail.ReportName || '';
this.ReportId = ReportDetail.ReportId || '';
  }
}