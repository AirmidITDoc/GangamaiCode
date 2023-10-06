import { ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, Injector, Input, OnInit, Pipe, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { BrowsePaymentListService } from './browse-payment-list.service';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { ViewOPBrowsePaymentListComponent } from './view-opbrowse-payment-list/view-opbrowse-payment-list.component';
import { PrintPaymentComponent } from './print-payment/print-payment.component';
import * as converter from 'number-to-words';
import { DomSanitizer } from '@angular/platform-browser';
import { ComponentPortal, DomPortalOutlet, PortalInjector } from '@angular/cdk/portal';
import { HeaderComponent } from 'app/main/shared/componets/header/header.component';


@Component({
  selector: 'app-browse-payment-list',
  templateUrl: './browse-payment-list.component.html',
  styleUrls: ['./browse-payment-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BrowsePaymentListComponent implements OnInit {
  click : boolean = false;
  MouseEvent=true;
  msg:any;
  currentDate=new Date();
  reportPrintObj: BrowseOpdPaymentReceipt;
  reportPrintObj1:HospitalMaster;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  sIsLoading: string = '';
  TempKeys:any;
  data:any;

  @Input() dataArray: any; 
  hasSelectedContacts: boolean;
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  displayedColumns = [
  
    'RegNo',
    'PatientName',
    // 'Remark',
    'PaymentDate',
    'PBillNo',
    'ReceiptNo',
    'PayDate',
    'UserName',
    'TotalAmt',
    'BalanceAmt',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'AdvanceUsedAmount',
    'PaidAmount',
    'NEFTPayAmount',
     'PayTMAmount',
     'buttons'
  ];
  dataSource = new MatTableDataSource<BrowseOpdPaymentReceipt>();

  constructor( private _fuseSidebarService: FuseSidebarService,
    public _BrowseOpdPaymentReceiptService:BrowsePaymentListService,
    public datePipe: DatePipe,
    private sanitizer:DomSanitizer,
    private advanceDataStored: AdvanceDataStored,
    public _matDialog: MatDialog,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef) { }

  ngOnInit(): void {
    this.getBrowseOpdPaymentReceiptList();
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
}



onShow(event:MouseEvent)
  {   
     
    this.click=!this.click;
     setTimeout(() => {
       {
        this.sIsLoading = 'loading-data';
        this.getBrowseOpdPaymentReceiptList();
      }
    }, 10);
    this.MouseEvent=true;
  }
  
  
    
    onClear() {
    
      this._BrowseOpdPaymentReceiptService.myFilterform.get('FirstName').reset();
      this._BrowseOpdPaymentReceiptService.myFilterform.get('LastName').reset();
      this._BrowseOpdPaymentReceiptService.myFilterform.get('RegNo').reset();
      this._BrowseOpdPaymentReceiptService.myFilterform.get('PBillNo').reset();
      this._BrowseOpdPaymentReceiptService.myFilterform.get('ReceiptNo').reset();
    }


getBrowseOpdPaymentReceiptList(){
  this.sIsLoading = 'loading-data';
  var D_data= {
    "F_Name": this._BrowseOpdPaymentReceiptService.myFilterform.get("FirstName").value + '%' || "%",
    "L_Name": this._BrowseOpdPaymentReceiptService.myFilterform.get("LastName").value+ '%' || "%",
    "From_Dt" : this.datePipe.transform(this._BrowseOpdPaymentReceiptService.myFilterform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
    "To_Dt" : this.datePipe.transform(this._BrowseOpdPaymentReceiptService.myFilterform.get("end").value,"MM-dd-yyyy") || "01/01/1900",
    "Reg_No":this._BrowseOpdPaymentReceiptService.myFilterform.get("RegNo").value || 0,
    "PBillNo":this._BrowseOpdPaymentReceiptService.myFilterform.get("PBillNo").value || 0,
    "ReceiptNo":this._BrowseOpdPaymentReceiptService.myFilterform.get("ReceiptNo").value || 0,

  }
   
  this._BrowseOpdPaymentReceiptService.getBrowseOpdPaymentReceiptList(D_data).subscribe(Visit=> {
      
      this.dataSource.data =Visit as BrowseOpdPaymentReceipt[];
      
      this.dataSource.sort =this.sort;
      this.dataSource.paginator=this.paginator;
      this.sIsLoading = '';
      this.click=false;
     
    },
    error => {
      this.sIsLoading = '';
    });
}

ngOnChanges(changes: SimpleChanges) {

  this.dataSource.data = changes.dataArray.currentValue as BrowseOpdPaymentReceipt[];
  this.dataSource.sort =this.sort;
  this.dataSource.paginator=this.paginator;
}



  getRecord(el,i) {
    // console.log(el,i);
    // this._matDialog.open(SmsEmailTemplateComponent, {
    //   data: i,
    //   width: '40%',
    //   height: "fit-content",
    //   autoFocus: false
    // });

  }
  convertToWord(e){
    
     return converter.toWords(e);
       }
       val = 1;

getTemplate() {

  let query = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=8';
  this._BrowseOpdPaymentReceiptService.getTemplates(query).subscribe((resData: any) => {
      this.printTemplate = resData[0].TempDesign;
   
    let  keysArray = ['HospitalName','HospitalAddress','Phone','EmailId','BillDate','RegId','BillNo','PatientName','ConsultantDr','Department',"Address",'MobileNo','ReferDr','PaidAmount','CashPayAmount','CardPayAmount','ChequePayAmount','NEFTPayAmount','PayTMAmount','Remark','UserName','CardNo','CardBankName']; // resData[0].TempKeys;
   

   for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }

      this.printTemplate = this.printTemplate.replace('strheaderName',this.reportPrintObj1.HospitalName);
      this.printTemplate = this.printTemplate.replace('strheaderAdd',this.reportPrintObj1.HospitalAddress);
      this.printTemplate = this.printTemplate.replace('strheaderPhone',this.reportPrintObj1.Phone);
      this.printTemplate = this.printTemplate.replace('strheaderEmail',this.reportPrintObj1.EmailId);
      this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(this.reportPrintObj.BillDate));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      this.printTemplate = this.printTemplate.replace('StrPaidAmountInWords', this.convertToWord(this.reportPrintObj.PaidAmount));
      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      
      console.log(this.printTemplate )
      setTimeout(() => {
        this.print();
      }, 50);
  });

}


transform2(value: string) {
  var datePipe = new DatePipe("en-US");
  value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
  return value;
}

getPrint(el) {
  
   var D_data = {
     "PaymentId": el.PaymentId,
   }
  
   let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
   this.subscriptionArr.push(
     this._BrowseOpdPaymentReceiptService.getBrowseOpdPaymentReceiptPrint(D_data).subscribe(res => {
       if(res){
       this.reportPrintObj = res[0] as BrowseOpdPaymentReceipt;
       this.getPrint1();
      this.getTemplate();
      }
              
     })
   );
 }

 getTemplateheader(){
  let query = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=21';
  this._BrowseOpdPaymentReceiptService.getTemplates(query).subscribe((resData: any) => {
      this.printTemplate = resData[0].TempDesign;
   
    let  keysArray = ['HospitalName','HospitalAddress','Phone','EmailId']; // resData[0].TempKeys;
   
   for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj1[keysArray[i]]);
      }
   
      setTimeout(() => {
        }, 50);
  });
 }

 getPrint1() {
  
  let printContents;
  this.subscriptionArr.push(
    this._BrowseOpdPaymentReceiptService.getHospital().subscribe(res => {
      if(res){
      this.reportPrintObj1 = res[0] as HospitalMaster;
      
     this.getTemplateheader();
     }
             
    })
  );
}


print() {
  
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
  popupWin.document.write(`<body onload="window.print();window.close()"></body> 
  </html>`);

  // if(this.reportPrintObj.CashPayAmount === 0) {
  //   popupWin.document.getElementById('idCashpay').style.display = 'none';
  // }
  // if(this.reportPrintObj.CardPayAmount === 0) {
  //   popupWin.document.getElementById('idCardpay').style.display = 'none';
  // }
  // if(this.reportPrintObj.ChequePayAmount === 0) {
  //   popupWin.document.getElementById('idChequepay').style.display = 'none';
  // }
  // if(this.reportPrintObj.NEFTPayAmount === 0) {
  //   popupWin.document.getElementById('idNeftpay').style.display = 'none';
  // }
  // if(this.reportPrintObj.PayTMAmount === 0) {
  //   popupWin.document.getElementById('idPaytmpay').style.display = 'none';
  // }
  // if(this.reportPrintObj.PayTMAmount === 0) {
  //   popupWin.document.getElementById('idPaytmpay').style.display = 'none';
  // }
  // if(this.reportPrintObj.Remark === '') {
  //   popupWin.document.getElementById('idremark').style.display = 'none';
  // }
  this.createCDKPortal({}, popupWin);
  popupWin.document.close();
}

  createCDKPortal(data, windowInstance) {
    if (windowInstance) {
      const outlet = new DomPortalOutlet(windowInstance.document.body, this.componentFactoryResolver, this.applicationRef, this.injector);
      const injector = this.createInjector(data);
      let componentInstance;
      componentInstance = this.attachHeaderContainer(outlet, injector);
      // console.log(windowInstance.document)
      let template = windowInstance.document.createElement('div'); // is a node
      template.innerHTML = this.printTemplate;
      windowInstance.document.body.appendChild(template);
    }
  }
  createInjector(data): any {
    const injectionTokens = new WeakMap();
    injectionTokens.set({}, data);
    return new PortalInjector(this.injector, injectionTokens);
  }

  attachHeaderContainer(outlet, injector) {
    const containerPortal = new ComponentPortal(HeaderComponent, null, injector);
    const containerRef: ComponentRef<HeaderComponent> = outlet.attach(containerPortal);
    return containerRef.instance;
  }


getViewbill(contact)
{
  
    let xx = {
      PaymentId:contact.PaymentId,
      HospitalName:contact.HospitalName,
      HospitalAddress:contact.HospitalAddress,
      BillNo:contact.BillNo,
      RegNo:contact.RegNo,
      RegId: contact.RegId,
      PatientName: contact.PatientName,
      FirstName: contact.FirstName,
      MiddleName: contact.MiddleName, 
      LastName:contact.LastName,
      TotalAmt:contact.TotalAmt,
      BalanceAmt: contact.BalanceAmt,
      Remark: contact.Remark,
      PaymentDate: contact.PaymentDate,
      CashPayAmount : contact.CashPayAmount,
      ChequePayAmount :contact.ChequePayAmount,
      CardPayAmount :contact.CardPayAmount,
      AdvanceUsedAmount: contact.AdvanceUsedAmount,
      AdvanceId:contact.AdvanceId,
      RefundId: contact.RefundId,
      IsCancelled: contact.IsCancelled,
      AddBy: contact.AddBy,
      UserName:contact.UserName,
      PBillNo: contact.PBillNo,
      ReceiptNo: contact.ReceiptNo,
      TransactionType:contact.TransactionType,
      PayDate:contact.PayDate,
      PaidAmount: contact.PaidAmount,
      NEFTPayAmount:contact.NEFTPayAmount,
      PayTMAmount:contact.PayTMAmount,
   

     
    };

    this.advanceDataStored.storage = new BrowseOpdPaymentReceipt(xx);
   
      const dialogRef = this._matDialog.open(PrintPaymentComponent, 
       {  maxWidth: "95vw",
          maxHeight: "130vh", width: '100%', height: "100%",
          data : {
            registerObj : xx,
          }
     });
     dialogRef.afterClosed().subscribe(result => {
      
     });
  }



}


export class HospitalMaster{
  HospitalName:any;
 HospitalAddress:any;
 Phone:any;
 EmailId:any;
}

export class ReportPrintObj {
  AdvanceNo: any;
  Address: any;
  BillDate:any;
  BillNo:any;
  ReceiptNo:any;
  HospitalName: any;
  RegNo: any;
  RegId:any;
  GenderName:any;
  PatientName: any;
  IPDNo: any;
  Date: any;
  PatientType: any;
  AdvanceAmount: any;
  ConsultantDr:any;
  ReferDr:any;
  Age:any;
  PaidAmount:any;
  CashPayAmount:any;
  CardPayAmount:any;
  ChequePayAmount:any;
  NEFTPayAmount:any;
  PayTMAmount:any;
  Remark:any;
  UserName:any;
  CardNo:any;
CardBankName:any;
  
}


export class BrowseOpdPaymentReceipt
{
    PaymentId: Number;
    BillNo: Number;
    BillDate:any;
    RegNo: number;
    RegId: number;
    Age:any;
    AgeDay:any;
    AgeMonth:any;
    PatientName: string;
    FirstName: string;
    MiddleName: string; 
    Department:any;
    MobileNo:any;
    ConsultantDr:string;
    ReferDr:string;
    LastName: string;
    TotalAmt: number;
    BalanceAmt: number;
    GenderName:any;
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
    CardNo: any;
    CardBankName:any;
    ChequeNo:any;
    HospitalName:any;
    HospitalAddress:any;
    EmailId:any;
    Phone:any;
    /**
     * Constructor
     *
     * @param BrowseOpdPaymentReceipt
     */
    constructor(BrowseOpdPaymentReceipt) {
        {
            this.PaymentId = BrowseOpdPaymentReceipt.PaymentId || '';
            this.BillNo = BrowseOpdPaymentReceipt.BillNo || '';
            this.BillDate = BrowseOpdPaymentReceipt.BillDate || '';
            this.RegNo = BrowseOpdPaymentReceipt.RegNo || '';
            this.RegId = BrowseOpdPaymentReceipt.RegId || '';
            this.Age = BrowseOpdPaymentReceipt.Age || '';
            this.AgeDay = BrowseOpdPaymentReceipt.AgeDay || '';
            this.AgeMonth = BrowseOpdPaymentReceipt.AgeMonth || '';
            this.PatientName = BrowseOpdPaymentReceipt.PatientName || '';
            this.FirstName = BrowseOpdPaymentReceipt.FirstName || '';
            this.MiddleName = BrowseOpdPaymentReceipt.MiddleName || '';
            this.ConsultantDr = BrowseOpdPaymentReceipt.ConsultantDr || '';
            this.ReferDr = BrowseOpdPaymentReceipt.ReferDr || '';
            this.LastName = BrowseOpdPaymentReceipt.LastName || '';
            this.TotalAmt = BrowseOpdPaymentReceipt.TotalAmt || '';
            this.BalanceAmt = BrowseOpdPaymentReceipt.BalanceAmt || '';
            this.GenderName = BrowseOpdPaymentReceipt.GenderName || '';
            this.Remark = BrowseOpdPaymentReceipt.Remark || '';
            this.PaymentDate = BrowseOpdPaymentReceipt.PaymentDate || '';
            this.CashPayAmount = BrowseOpdPaymentReceipt.CashPayAmount || '';
            this.ChequePayAmount = BrowseOpdPaymentReceipt.ChequePayAmount || '';
            this.CardPayAmount = BrowseOpdPaymentReceipt.CardPayAmount || '';
            this.AdvanceUsedAmount = BrowseOpdPaymentReceipt.AdvanceUsedAmount || '';
            this.AdvanceId = BrowseOpdPaymentReceipt.AdvanceId || '';
            this.RefundId = BrowseOpdPaymentReceipt.RefundId || '';
            this.IsCancelled = BrowseOpdPaymentReceipt.IsCancelled || '';
            this.AddBy = BrowseOpdPaymentReceipt.AddBy || '';
            this.Department=BrowseOpdPaymentReceipt.Department || '';
            this.UserName = BrowseOpdPaymentReceipt.UserName || '';
            this.ReceiptNo = BrowseOpdPaymentReceipt.ReceiptNo || '';
            this.PBillNo = BrowseOpdPaymentReceipt.PBillNo || '';
            this.TransactionType = BrowseOpdPaymentReceipt.TransactionType || '';
            this.PayDate = BrowseOpdPaymentReceipt.PayDate || '';
            this.PaidAmount = BrowseOpdPaymentReceipt.PaidAmount || '';
            this.NEFTPayAmount = BrowseOpdPaymentReceipt.NEFTPayAmount || '';
            this.PayTMAmount = BrowseOpdPaymentReceipt.PayTMAmount || '';
            this.CardNo = BrowseOpdPaymentReceipt.CardNo || '';
            this.CardBankName = BrowseOpdPaymentReceipt.CardBankName || '';
            this.ChequeNo=BrowseOpdPaymentReceipt.ChequeNo || 0;
             this.MobileNo=BrowseOpdPaymentReceipt.MobileNo || '';
            this.HospitalName = BrowseOpdPaymentReceipt.HospitalName || '';
            this.HospitalAddress = BrowseOpdPaymentReceipt.HospitalAddress || '';
            this.EmailId = BrowseOpdPaymentReceipt.EmailId || '';
            this.Phone=BrowseOpdPaymentReceipt.Phone || 0;
        }

    }
}
