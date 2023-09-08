import { Component, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AdvanceDataStored } from '../advance';
import { DatePipe } from '@angular/common';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { PaymentReceiptService } from './payment-receipt.service';
import Swal from 'sweetalert2';
import { ViewBrowseIPDPaymentComponent } from './view-browse-ipdpayment/view-browse-ipdpayment.component';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';

import * as converter from 'number-to-words';

@Component({
  selector: 'app-browse-ipdpayment-receipt',
  templateUrl: './browse-ipdpayment-receipt.component.html',
  styleUrls: ['./browse-ipdpayment-receipt.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BrowseIPDPaymentReceiptComponent implements OnInit {

  BrowseOpdPaymentReceiptList: any;
  msg: any;
  sIsLoading: string = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;
  click: boolean = false;
  MouseEvent = true;



  reportPrintObj: BrowseIpdPaymentReceipt;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  displayedColumns = [
    // 'checkbox',
    'RegId',
    'PatientName',
    // 'PBillNo',
    // 'ReceiptNo',
    // 'PayDate',
    'TotalAmt',
    'BalanceAmt',
    'PaymentDate',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'AdvanceUsedAmount',
    'PaidAmount',
    'NEFTPayAmount',
    'PayTMAmount',
    'Remark',
    'UserName',
    'buttons'
  ];
  dataSource = new MatTableDataSource<BrowseIpdPaymentReceipt>();
  hasSelectedContacts: boolean;


  constructor(private _fuseSidebarService: FuseSidebarService,
    public _BrowseIPDPaymentReceiptService: PaymentReceiptService,
    public datePipe: DatePipe,
    private matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,) { }

  ngOnInit(): void {
    // debugger;
    this.getBrowseIPDPaymentReceiptList();
  }


  onShow(event: MouseEvent) {
    //debugger;

    this.click = !this.click;
    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data';
        this.getBrowseIPDPaymentReceiptList();
      }
    }, 50);
    this.MouseEvent = true;
  }

  getRecord(el, i) {
    // console.log(el,i);
    // this.matDialog.open(SmsEmailTemplateComponent, {
    //   data: i,
    //   width: '40%',
    //   height: "fit-content",
    //   autoFocus: false
    // });

  }

 
  onClear() {

    this._BrowseIPDPaymentReceiptService.myFilterform.get('FirstName').reset();
    this._BrowseIPDPaymentReceiptService.myFilterform.get('LastName').reset();
    this._BrowseIPDPaymentReceiptService.myFilterform.get('RegNo').reset();
    this._BrowseIPDPaymentReceiptService.myFilterform.get('PBillNo').reset();
    this._BrowseIPDPaymentReceiptService.myFilterform.get('ReceiptNo').reset();
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    // console.log(changes.dataArray.currentValue, 'new arrrrrrr');
    this.dataSource.data = changes.dataArray.currentValue as BrowseIpdPaymentReceipt[];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getBrowseIPDPaymentReceiptList() {
    debugger;
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name": this._BrowseIPDPaymentReceiptService.myFilterform.get("FirstName").value + '%' || "%",
      "L_Name": this._BrowseIPDPaymentReceiptService.myFilterform.get("LastName").value + '%' || "%",
      "From_Dt": this.datePipe.transform(this._BrowseIPDPaymentReceiptService.myFilterform.get("start").value, "MM-dd-yyyy"), //"01/01/2018",
      "To_Dt": this.datePipe.transform(this._BrowseIPDPaymentReceiptService.myFilterform.get("end").value, "MM-dd-yyyy"), //"01/01/2020",
      "Reg_No": this._BrowseIPDPaymentReceiptService.myFilterform.get("RegNo").value || "0",
      "PBillNo": this._BrowseIPDPaymentReceiptService.myFilterform.get("PBillNo").value || "0",
      "ReceiptNo": this._BrowseIPDPaymentReceiptService.myFilterform.get("ReceiptNo").value || "0",

    }
    console.log(D_data);
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this._BrowseIPDPaymentReceiptService.getIpdRefundpaymentreceiptBrowseList(D_data).subscribe(Visit => {
        this.dataSource.data = Visit as BrowseIpdPaymentReceipt[];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.sIsLoading = '';
        this.click = false;

      },
        error => {
          this.sIsLoading = '';
        });
    },5);

  }


  getViewbill(contact)
  {
     console.log(contact);
       let xx = {
        PaymentId:contact.PaymentId,
        BillNo: contact.BillNo,
        RegNo: contact.RegNo,
        RegId: contact.RegId,
        PatientName: contact.PatientName,
        FirstName:contact.FirstName,
        MiddleName: contact.MiddleName,
        LastName: contact.LastName,
        TotalAmt: contact.TotalAmt,
        BalanceAmt: contact.BalanceAmt,
        Remark: contact.Remark,
        PaymentDate: contact.PaymentDate,
        CashPayAmount :contact.CashPayAmount,
        ChequePayAmount : contact.ChequePayAmount,
        CardPayAmount : contact.CardPayAmount,
        AdvanceUsedAmount: contact.AdvanceUsedAmount,
        AdvanceId:contact.AdvanceId,
        RefundId: contact.RefundId,
        IsCancelled: contact.IsCancelled,
        AddBy:contact.AddBy,
        UserName:contact.UserName,
        PBillNo: contact.PBillNo,
        ReceiptNo: contact.ReceiptNo,
        TransactionType:contact.TransactionType,
        PayDate:contact.PayDate,
        PaidAmount:contact.PaidAmount,
        NEFTPayAmount:contact.NEFTPayAmount,
        PayTMAmount: contact.PayTMAmount,
        BillDate:contact.BillDate,
        HospitalAddress:contact.HospitalAddress,
        HospitalName:contact.HospitalName,
        OPIPNo:contact.IPDNo
  
      };
  
       this.advanceDataStored.storage = new BrowseIpdPaymentReceipt(xx);
     
        const dialogRef = this.matDialog.open(ViewBrowseIPDPaymentComponent, 
         {  maxWidth: "75vw",
            maxHeight: "130vh", width: '100%', height: "100%"
       });
       dialogRef.afterClosed().subscribe(result => {
         console.log('The dialog was closed - Insert Action', result);
        //  this.getRadiologytemplateMasterList();
       });
    }
  
  
  
  
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
  
  


getTemplate() {
  let query = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=19';
  this._BrowseIPDPaymentReceiptService.getTemplate(query).subscribe((resData: any) => {
    this.printTemplate = resData[0].TempDesign;
    let keysArray = ['HospitalName','HospitalAddress','Phone','EmailId','RegId','ConsultantDocName','ReceiptNo','PaymentDate','PatientName','AgeDay','AgeMonth','AgeYear','PBillNo','PaidAmount','Remark','BillDate','PaymentId','TotalAmt','CashPayAmount','UserName'
  ,'CashPayAmount','CardPayAmount','ChequePayAmount','NEFTPayAmount','PayTMAmount','Remark','UserName','CardNo','CardBankName'];
      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      this.printTemplate = this.printTemplate.replace('StrTotalTotalAmtInWords', this.convertToWord(this.reportPrintObj.PaidAmount));
      // this.printTemplate = this.printTemplate.replace('StrTotalAmt','₹' + (this.reportPrintObj.TotalAmt.toFixed(2)));
      // this.printTemplate = this.printTemplate.replace('StrPaymentAmount','₹' + (this.reportPrintObj.PaidAmount.toFixed(2)));
      // this.printTemplate = this.printTemplate.replace('StrCashPayAmount','₹' + (this.reportPrintObj.CashPayAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(new Date().toString()));
      this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform(this.reportPrintObj.BillDate));
      // this.printTemplate = this.printTemplate.replace('StrCashpay','₹' + (this.reportPrintObj.CashPayAmount.toFixed(2)));
      // this.printTemplate = this.printTemplate.replace('StrPaymentDate', this.transform(this.reportPrintObj.PaymentDate));
      // this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      setTimeout(() => {
        this.print();
      }, 5);
  });
}

convertToWord(e){
  // this.numberInWords= converter.toWords(this.mynumber);
   return converter.toWords(e);
     }

transform(value: string) {
  var datePipe = new DatePipe("en-US");
   value = datePipe.transform(value, 'dd/MM/yyyy ');
   return value;
}

transform2(value: string) {
  var datePipe = new DatePipe("en-US");
  value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
  return value;
}


transform1(value: string) {
var datePipe = new DatePipe("en-US");
value = datePipe.transform(value, 'dd/MM/yyyy hh:mm a');
 return value;
}






getPrint(el) {
console.log(el);
var D_data = {
  "PaymentId":206// el.PaymentId,
}
console.log(el);
let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
this.subscriptionArr.push(
  this._BrowseIPDPaymentReceiptService.getBrowseIPDPaymentReceiptPrint(D_data).subscribe(res => {
    if(res){
    this.reportPrintObj = res[0] as BrowseIpdPaymentReceipt;
    console.log(this.reportPrintObj);
   }
  
   console.log(this.reportPrintObj);
    this.getTemplate();
    // console.log(res);
    
  })
);
}





}

export class BrowseIpdPaymentReceipt
{
    PaymentId: Number;
    BillNo: Number;
    RegNo: number;
    RegId: number;
    PatientName: string;
    FirstName: string;
    MiddleName: string; 
    LastName: string;
    TotalAmt: number;
    BalanceAmt: number;
    Remark: string;
    PaymentDate: any;
    CashPayAmount : number;
    ChequePayAmount : number;
    CardPayAmount : number;
    AdvanceUsedAmount: number;
    AdvanceId:number;
    RefundId: number;
    IsCancelled: boolean;
    AddBy: number;
    UserName:string;
    PBillNo: string;
    ReceiptNo: string;
    TransactionType:number;
    PayDate:Date;
    PaidAmount: number;
    NEFTPayAmount:number;
    PayTMAmount: number;
    BillDate:any;
    HospitalAddress:string;
    HospitalName:string;
    OPIPNo:any;
        /**
     * Constructor
     *
     * @param BrowseIpdPaymentReceipt
     */
    constructor(BrowseIpdPaymentReceipt) {
        {
            this.PaymentId = BrowseIpdPaymentReceipt.PaymentId || '';
            this.BillNo = BrowseIpdPaymentReceipt.BillNo || '';
            this.RegNo = BrowseIpdPaymentReceipt.RegNo || '';
            this.RegId = BrowseIpdPaymentReceipt.RegId || '';
            this.PatientName = BrowseIpdPaymentReceipt.PatientName || '';
            this.FirstName = BrowseIpdPaymentReceipt.FirstName || '';
            this.MiddleName = BrowseIpdPaymentReceipt.MiddleName || '';
            this.LastName = BrowseIpdPaymentReceipt.LastName || '';
            this.TotalAmt = BrowseIpdPaymentReceipt.TotalAmt || '';
            this.BalanceAmt = BrowseIpdPaymentReceipt.BalanceAmt || '';
            this.Remark = BrowseIpdPaymentReceipt.Remark || '';
            this.PaymentDate = BrowseIpdPaymentReceipt.PaymentDate || '';
            this.CashPayAmount = BrowseIpdPaymentReceipt.CashPayAmount || '';
            this.ChequePayAmount = BrowseIpdPaymentReceipt.ChequePayAmount || '';
            this.CardPayAmount = BrowseIpdPaymentReceipt.CardPayAmount || '';
            this.AdvanceUsedAmount = BrowseIpdPaymentReceipt.AdvanceUsedAmount || '';
            this.AdvanceId = BrowseIpdPaymentReceipt.AdvanceId || '';
            this.RefundId = BrowseIpdPaymentReceipt.RefundId || '';
            this.IsCancelled = BrowseIpdPaymentReceipt.IsCancelled || '';
            this.AddBy = BrowseIpdPaymentReceipt.AddBy || '';
            this.UserName = BrowseIpdPaymentReceipt.UserName || '';
            this.ReceiptNo = BrowseIpdPaymentReceipt.ReceiptNo || '';
            this.PBillNo = BrowseIpdPaymentReceipt.PBillNo || '';
            this.TransactionType = BrowseIpdPaymentReceipt.TransactionType || '';
            this.PayDate = BrowseIpdPaymentReceipt.PayDate || '';
            this.PaidAmount = BrowseIpdPaymentReceipt.PaidAmount || '';
            this.NEFTPayAmount = BrowseIpdPaymentReceipt.NEFTPayAmount || '';
            this.PayTMAmount = BrowseIpdPaymentReceipt.PayTMAmount || '';
            this.BillDate= BrowseIpdPaymentReceipt.BillDate|| '';
            this.HospitalAddress= BrowseIpdPaymentReceipt.HospitalAddress|| '';
            this.HospitalName= BrowseIpdPaymentReceipt.HospitalName|| '';
            this.OPIPNo=BrowseIpdPaymentReceipt.OPIPNo || '';
        }

    }
}