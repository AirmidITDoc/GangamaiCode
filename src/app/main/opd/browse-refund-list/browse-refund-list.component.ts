import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Subscription } from 'rxjs';
import { BrowseRefundlistService } from './browse-refundlist.service';
import { BrowseOPDBill, ViewBrowseOPDRefundComponent } from './view-browse-opdrefund/view-browse-opdrefund.component';
import { fuseAnimations } from '@fuse/animations';
import * as converter from 'number-to-words';


@Component({
  selector: 'app-browse-refund-list',
  templateUrl: './browse-refund-list.component.html',
  styleUrls: ['./browse-refund-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations

})
export class BrowseRefundListComponent implements OnInit {

  
  msg: any;
  sIsLoading: string = '';
  reportPrintObj: BrowseIpdreturnadvanceReceipt;
  currentDate=new Date();
  subscriptionArr: Subscription[] = [];
  printTemplate: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;
  click: boolean = false;
  MouseEvent = true;
  displayedColumns = [
    'RefundDate',
    'PatientName',
    // 'PaymentDate',
    'RefundAmount',
    'TotalAmt',
    'MobileNo',
    // 'CashPayAmount',
    // 'ChequePayAmount',
    // 'CardPayAmount',
    'buttons'

    // 'action'
  ];
  dataSource = new MatTableDataSource<RefundMaster>();

  hasSelectedContacts: boolean;


  constructor(private _fuseSidebarService: FuseSidebarService,
    public _BrowseOPDReturnsService: BrowseRefundlistService,
    
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getBrowseOPDReturnList();
   
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

 

  onShow(event: MouseEvent) {
    //debugger;

    this.click = !this.click;
    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data';
        this.getBrowseOPDReturnList();
      }
    }, 200);
    this.MouseEvent = true;
  }



  onClear() {

    this._BrowseOPDReturnsService.myFilterform.get('FirstName').reset();
    this._BrowseOPDReturnsService.myFilterform.get('LastName').reset();
    this._BrowseOPDReturnsService.myFilterform.get('RegNo').reset();

  }

  getBrowseOPDReturnList() {
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name": this._BrowseOPDReturnsService.myFilterform.get("FirstName").value + '%' || '%',
      "L_Name": this._BrowseOPDReturnsService.myFilterform.get("LastName").value + '%' || '%',
      "From_Dt": this.datePipe.transform(this._BrowseOPDReturnsService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      "To_Dt": this.datePipe.transform(this._BrowseOPDReturnsService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
      "Reg_No": this._BrowseOPDReturnsService.myFilterform.get("RegNo").value || 0,

    }

    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      console.log(D_data);
      this._BrowseOPDReturnsService.getBrowseOPDReturnReceiptList(D_data).subscribe(Visit => {
        this.dataSource.data = Visit as RefundMaster[];
        
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.sIsLoading = '';
        this.click = false;
      },
        error => {
          this.sIsLoading = '';
        });
    }, 500);

  }



  getViewbill(contact)
  {
    
      let xx = {

        RefundNo:contact.RefundNo,
        PaymentDate: contact.PaymentDate,
        PaymentId :contact.PaymentId,
        RegNo: contact.RegNo,
        RegId:contact.RegId,
        GenderName:contact.GenderName,
        PatientName: contact.PatientName,
        BillNo: contact.BillNo,
        BillId:contact.BillId,
        BillDate:contact.BillDate,
        RefundAmount:contact.RefundAmount,
        BillAmount:contact.BillAmount,
        RefundId: contact.RefundId,
        Remark: contact.Remark,
        AddedBy:contact.AddedBy,
        PBillNo:contact.PBillNo,
      
      };
  
      this.advanceDataStored.storage = new BrowseOPDBill(xx);
     
        const dialogRef = this.matDialog.open(ViewBrowseOPDRefundComponent, 
         {  maxWidth: "95vw",
            maxHeight: "130vh", width: '100%', height: "100%"
       });
       dialogRef.afterClosed().subscribe(result => {
        
       });
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
  ngOnChanges(changes: SimpleChanges) {
   
    this.dataSource.data = changes.dataArray.currentValue as RefundMaster[];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  convertToWord(e){
    
     return converter.toWords(e);
       }

  getTemplate() {
    let query = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=9';
    this._BrowseOPDReturnsService.getTemplate(query).subscribe((resData: any) => {
      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['HospitalName','HospitalAddress','Phone','EmailId','PBillNo','BillDate','RegNo','OPDNo','RefundNo','RefundAmount','RefundDate','PaymentDate','PatientName','AgeYear','AgeDay','AgeMonth','GenderName','ConsultantDoctorName','Remark','Addedby','NetPayableAmt']; // resData[0].TempKeys;
        for (let i = 0; i < keysArray.length; i++) {
          let reString = "{{" + keysArray[i] + "}}";
          let re = new RegExp(reString, "g");
          this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
        }
        this.printTemplate = this.printTemplate.replace('StrRefundAmountInWords', this.convertToWord(this.reportPrintObj.RefundAmount));
        this.printTemplate = this.printTemplate.replace('StrRefundDate', this.transform1(this.reportPrintObj.RefundTime));
        this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform(this.reportPrintObj.BillDate));

        
        // this.printTemplate = this.printTemplate.replace('StrBillAmount','₹' + (this.reportPrintObj.NetPayableAmt.toFixed(2)));
        // this.printTemplate = this.printTemplate.replace('StrRefundAmount','₹' + (this.reportPrintObj.RefundAmount.toFixed(2)));
        // this.printTemplate = this.printTemplate.replace('StrPaymentDates', this.transformBilld(this.reportPrintObj.PaymentDate));

        this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
        this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
        setTimeout(() => {
          this.print();
        }, 1000);
    });
  }


  transform(value: string) {
    var datePipe = new DatePipe("en-US");
     value = datePipe.transform(value, 'dd/MM/yyyy ');
     return value;
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

transformBilld(value: string) {
  var datePipe = new DatePipe("en-US");
  value = datePipe.transform(value, 'dd/MM/yyyy');
  return value;
}
getPrint(el) {
 
  var D_data = {
    "RefundId":3// el.RefundId,
  }
  
  let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
  this.subscriptionArr.push(
    this._BrowseOPDReturnsService.getRefundBrowsePrint(D_data).subscribe(res => {
      if(res){
      this.reportPrintObj = res[0] as BrowseIpdreturnadvanceReceipt;
      // console.log(this.reportPrintObj);
     }
        
      this.getTemplate();
            
    })
  );
}



  print() {
    
    let popupWin, printContents;

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

}



// export class ReportPrintObj {
//   AdvanceNo: any;
//   Address: any;
//   HospitalName: any;
//   RegNo: any;
//   PatientName: any;
//   IPDNo: any;
//   Date: any;
//   PatientType: any;
//   AdvanceAmount: any;
//   BillDate:any;
//   PaymentDate:any;
//   AgeYear:any;
//   GenderName:any;
// }

export class RefundMaster {
  RefundId: number;
  RegId: number;
  RefundDate: Date;
  RefundAmount: number;
  PBillNo: number;
  PatientName: Date;
  Total: number;
  PaymentId: number;
  PaymentDate: any;
  CashPayAmount:number;
  ChequePayAmount:number;
  CardPayAmount:number;
  TransactionType:number;
  PhoneNo:number;
  Remark:string;
  GenderName:string;
  AddedBy:string;
  AgeYear:number;
  BillDate:any;
  OPDNO:any;

  AdvanceNo: any;
  HospAddress: any;
  HospitalName: any;
  Phone:any;
  VisitDate:any;
  OPDNo:any;
EmailId:any;
  RegNo: any;
  IPDNo: any;
  Date: any;
  PatientType: any;
  AdvanceAmount: any;
  
  constructor(RefundMaster) {
    {
      this.RefundId = RefundMaster.RefundId || 0;
      this.RegId = RefundMaster.RegId || '';
      this.BillDate = RefundMaster.BillDate || '';
      this.RefundDate = RefundMaster.RefundDate || '';
      this.RefundAmount = RefundMaster.RefundAmount || 0;
      this.PatientName = RefundMaster.PatientName || '';
      this.Total = RefundMaster.Total || 0 ;
      this.PBillNo = RefundMaster.PBillNo || '';
      this.PaymentId = RefundMaster.PaymentId || 0;
      this.PaymentDate = RefundMaster.PaymentDate || 0;
      this.CashPayAmount = RefundMaster.CashPayAmount || 0 ;
      this.ChequePayAmount = RefundMaster.ChequePayAmount || 0;
      this.CardPayAmount = RefundMaster.CardPayAmount || 0;
      this.TransactionType = RefundMaster.TransactionType || 0;
      this.PhoneNo = RefundMaster.PhoneNo || 0;
      this.Remark = RefundMaster.Remark || '';
      this.GenderName = RefundMaster.GenderName || '';
      this.AddedBy = RefundMaster.AddedBy || '';
      this.AgeYear=RefundMaster.AgeYear || 0; 
      this.OPDNO=RefundMaster.OPDNO || '';

      this.AdvanceNo = RefundMaster.AdvanceNo || 0;
      this.HospAddress = RefundMaster.HospAddress || 0;
      this.HospitalName = RefundMaster.HospitalName || '';
      this.RegNo = RefundMaster.RegNo || '';
      this.IPDNo = RefundMaster.IPDNo || '';
      this.PatientType=RefundMaster.PatientType || 0; 
      this.AdvanceAmount=RefundMaster.AdvanceAmount || '';
      this.Phone=RefundMaster.Phone || '';
      this.VisitDate =RefundMaster.VisitDate ||'';
      this.OPDNo=RefundMaster.OPDNo ||'';
      this.EmailId=RefundMaster.EmailId||'';
    }
  }
}



export class BrowseIpdreturnadvanceReceipt
{
    PaymentId: Number;
    BillNo: Number;
    BillDate:any;
    RegNo: number;
    RegId: number;
    RefundTime:any;
    PatientName: string;
    FirstName: string;
    MiddleName: string; 
    LastName: string;
    TotalAmt: number;
    BalanceAmt: number;
    GenderName:string;
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
    AddedBy:string;
    HospitalName:string;
    RefundAmount:number;
    RefundNo:number;
    HospitalAddress:string;
    MobileNo:any;
    EmailId:any;
     Age:number;
     AgeYear:number;
     IPDNo:any;
     NetPayableAmt:any;
    /**
     * Constructor
     *
     * @param BrowseIpdreturnadvanceReceipt
     */
    constructor(BrowseIpdreturnadvanceReceipt) {
        {
            this.PaymentId = BrowseIpdreturnadvanceReceipt.PaymentId || '';
            this.BillNo = BrowseIpdreturnadvanceReceipt.BillNo || '';
            this.BillDate=BrowseIpdreturnadvanceReceipt.BillDate || '';
            this.RefundTime=BrowseIpdreturnadvanceReceipt.RefundTime || '';
            this.RegNo = BrowseIpdreturnadvanceReceipt.RegNo || '';
            this.RegId = BrowseIpdreturnadvanceReceipt.RegId || '';
            this.PatientName = BrowseIpdreturnadvanceReceipt.PatientName || '';
            this.FirstName = BrowseIpdreturnadvanceReceipt.FirstName || '';
            this.MiddleName = BrowseIpdreturnadvanceReceipt.MiddleName || '';
            this.LastName = BrowseIpdreturnadvanceReceipt.LastName || '';
            this.TotalAmt = BrowseIpdreturnadvanceReceipt.TotalAmt || '';
            this.BalanceAmt = BrowseIpdreturnadvanceReceipt.BalanceAmt || '';
            this.Remark = BrowseIpdreturnadvanceReceipt.Remark || '';
            this.PaymentDate = BrowseIpdreturnadvanceReceipt.PaymentDate || '';
            this.CashPayAmount = BrowseIpdreturnadvanceReceipt.CashPayAmount || '';
            this.ChequePayAmount = BrowseIpdreturnadvanceReceipt.ChequePayAmount || '';
            this.CardPayAmount = BrowseIpdreturnadvanceReceipt.CardPayAmount || '';
            this.AdvanceUsedAmount = BrowseIpdreturnadvanceReceipt.AdvanceUsedAmount || '';
            this.AdvanceId = BrowseIpdreturnadvanceReceipt.AdvanceId || '';
            this.RefundId = BrowseIpdreturnadvanceReceipt.RefundId || '';
            this.IsCancelled = BrowseIpdreturnadvanceReceipt.IsCancelled || '';
            this.AddBy = BrowseIpdreturnadvanceReceipt.AddBy || '';
            this.UserName = BrowseIpdreturnadvanceReceipt.UserName || '';
            this.ReceiptNo = BrowseIpdreturnadvanceReceipt.ReceiptNo || '';
            this.PBillNo = BrowseIpdreturnadvanceReceipt.PBillNo || '';
            this.TransactionType = BrowseIpdreturnadvanceReceipt.TransactionType || '';
            this.PayDate = BrowseIpdreturnadvanceReceipt.PayDate || '';
            this.PaidAmount = BrowseIpdreturnadvanceReceipt.PaidAmount || '';
            this.NEFTPayAmount = BrowseIpdreturnadvanceReceipt.NEFTPayAmount || '';
            this.PayTMAmount = BrowseIpdreturnadvanceReceipt.PayTMAmount || '';
            this.HospitalName=BrowseIpdreturnadvanceReceipt.HospitalName;
            this.RefundAmount = BrowseIpdreturnadvanceReceipt.  RefundAmount|| '';
            this. RefundNo = BrowseIpdreturnadvanceReceipt. RefundNo|| ''; 
            this. GenderName = BrowseIpdreturnadvanceReceipt. GenderName || ''; 
            this. AddedBy = BrowseIpdreturnadvanceReceipt. AddedBy|| '';
            this. HospitalAddress = BrowseIpdreturnadvanceReceipt. HospitalAddress || '';
           this.AgeYear=BrowseIpdreturnadvanceReceipt.AgeYear || ''
           this.IPDNo=BrowseIpdreturnadvanceReceipt.IPDNo || '';
           this.MobileNo=BrowseIpdreturnadvanceReceipt.MobileNo || ''
           this.EmailId=BrowseIpdreturnadvanceReceipt.EmailId || '';

           this.NetPayableAmt=BrowseIpdreturnadvanceReceipt.NetPayableAmt || 0;
        }

    }
}