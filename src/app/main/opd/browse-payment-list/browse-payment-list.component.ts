import { Component, Input, OnInit, Pipe, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
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
@Pipe({
  name: 'numberToWords'
})
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
  // BrowseIPDPaymentReceiptList:any;
  msg:any;
  currentDate=new Date();
  reportPrintObj: BrowseOpdPaymentReceipt;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  sIsLoading: string = '';
  TempKeys:any;

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
    private advanceDataStored: AdvanceDataStored,
    public _matDialog: MatDialog) { }

  ngOnInit(): void {
    this.getBrowseOpdPaymentReceiptList();
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
}



onShow(event:MouseEvent)
  {   
    //debugger;
   
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
   console.log(D_data);
  this._BrowseOpdPaymentReceiptService.getBrowseOpdPaymentReceiptList(D_data).subscribe(Visit=> {
      
      this.dataSource.data =Visit as BrowseOpdPaymentReceipt[];
      console.log(this.dataSource.data);
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
  // changes.prop contains the old and the new value...
  // console.log(changes.dataArray.currentValue, 'new arrrrrrr');
  this.dataSource.data = changes.dataArray.currentValue as BrowseOpdPaymentReceipt[];
  this.dataSource.sort =this.sort;
  this.dataSource.paginator=this.paginator;
}



onExport(exprtType){
  // let columnList=[];
  // if(this.dataSource.data.length == 0){
  //   // this.toastr.error("No Data Found");
  //   Swal.fire('Error !', 'No Data Found', 'error');
  // }
  // else{
  //   var excelData = [];
  //   var a=1;
  //   for(var i=0;i<this.dataSource.data.length;i++){
  //     let singleEntry = {
  //       // "Sr No":a+i,
  //       "RegNo" :this.dataSource.data[i]["RegNo"] ? this.dataSource.data[i]["RegNo"]:"N/A",
         
  //         "Patient Name" :this.dataSource.data[i]["PatientName"] ? this.dataSource.data[i]["PatientName"] : "N/A",
  //         "PaymentDate" :this.dataSource.data[i]["PaymentDate"] ? this.dataSource.data[i]["PaymentDate"]:"N/A",
  //         "PBillNo" :this.dataSource.data[i]["PBillNo"] ? this.dataSource.data[i]["PBillNo"] :"N/A",
  //         "ReceiptNo" :this.dataSource.data[i]["ReceiptNo"] ? this.dataSource.data[i]["ReceiptNo"]:"N/A",
  //         "Pay Date" :this.dataSource.data[i]["PayDate"] ? this.dataSource.data[i]["PayDate"]:"N/A",
  //         "Total Amt" :this.dataSource.data[i]["TotalAmt"]+" - "+this.dataSource.data[i]["TotalAmt"],
  //         "Balance Amount" :this.dataSource.data[i]["BalanceAmt"] ? this.dataSource.data[i]["BalanceAmt"]:"N/A",
  //         "CashPay Amount" :this.dataSource.data[i]["CashPayAmount"] ? this.dataSource.data[i]["CardPayAmount"]:"N/A",
  //          "ChequePay Amount" :this.dataSource.data[i]["ChequePayAmount"] ? this.dataSource.data[i]["ChequePayAmount"]:"N/A",
  //          "CardPay Amount" :this.dataSource.data[i]["CardPayAmount"]+" - "+this.dataSource.data[i]["CardPayAmount"],
  //         "AdvanceUsedAmount" :this.dataSource.data[i]["AdvanceUsedAmount"] ? this.dataSource.data[i]["AdvanceUsedAmount"]:"N/A",
  //          "PaidAmount" :this.dataSource.data[i]["PaidAmount"] ? this.dataSource.data[i]["PaidAmount"]:"N/A",
  //          "NEFTPayAmount" :this.dataSource.data[i]["NEFTPayAmount"] ? this.dataSource.data[i]["NEFTPayAmount"]:"N/A",
  //          "PayTMAmount" :this.dataSource.data[i]["PayTMAmount"] ? this.dataSource.data[i]["PayTMAmount"]:"N/A",
  //           // "Remark" :this.dataSource.data[i]["Remark"] ? this.dataSource.data[i]["Remark"]:"N/A",
  //          "UserName" :this.dataSource.data[i]["UserName"] ? this.dataSource.data[i]["UserName"]:"N/A"
  //     };
  //     excelData.push(singleEntry);
  //   }
  //   var fileName = "OutDoor-Payment-Receipt-List " + new Date() +".xlsx";
  //   if(exprtType =="Excel"){
  //     const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(excelData);
  //     var wscols = [];
  //     if(excelData.length > 0){ 
  //       var columnsIn = excelData[0]; 
  //       console.log(columnsIn);
  //       for(var key in columnsIn){
  //         let headerLength = {wch:(key.length+1)};
  //         let columnLength = headerLength;
  //         try{
  //           columnLength = {wch: Math.max(...excelData.map(o => o[key].length), 0)+1}; 
  //         }
  //         catch{
  //           columnLength = headerLength;
  //         }
  //         if(headerLength["wch"] <= columnLength["wch"]){
  //           wscols.push(columnLength)
  //         }
  //         else{
  //           wscols.push(headerLength)
  //         }
  //       } 
  //     }
  //     ws['!cols'] = wscols;
  //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //     XLSX.writeFile(wb, fileName);
  //   }else{
  //     let doc = new jsPDF('p','pt', 'a4');
  //     doc.page = 0;
  //     var col=[];
  //     for (var k in excelData[0]) col.push(k);
  //       console.log(col.length)
  //     var rows = [];
  //     excelData.forEach(obj => {
  //       console.log(obj)
  //       let arr = [];
  //       col.forEach(col => {
  //         arr.push(obj[col]);
  //       });
  //       rows.push(arr);
  //     });
    
  //     doc.autoTable(col, rows,{
  //       margin:{left:5,right:5,top:5},
  //       theme:"grid",
  //       styles: {
  //         fontSize: 3
  //       }});
  //     doc.setFontSize(3);
  //     // doc.save("Indoor-Patient-List.pdf");
  //     window.open(URL.createObjectURL(doc.output("blob")))
  //   }
  // }
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
    // this.numberInWords= converter.toWords(this.mynumber);
    //  return converter.toWords(e);
       }


getTemplate() {
debugger;

  // let query1 = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=20';
  // this._BrowseOpdPaymentReceiptService.getTemplates(query1).subscribe((resData: any) => {
  //   console.log(this.printTemplate = resData[0].TempDesign);
  //   this.printTemplate = resData[0].TempDesign;


  let query = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=8';
  this._BrowseOpdPaymentReceiptService.getTemplates(query).subscribe((resData: any) => {
    console.log(this.printTemplate = resData[0].TempDesign);
    console.log(this.printTemplate = resData[0].TempKeys);
    this.printTemplate = resData[0].TempDesign;
    console.log(this.printTemplate)

    // this.TempKeys=resData[0].TempKeys;
    // let keysArray=resData[0].TempKeys.toString();
    // console.log(keysArray);
    
   let keysArray = ['HospitalName','HospitalAddress','Phone','EmailId','ReceiptNo','BillDate','RegId','GenderName','BillNo','PatientName','Age','AgeDay','AgeMonth','ConsultantDr','ReferDr','PaidAmount','CashPayAmount','CardPayAmount','ChequePayAmount','NEFTPayAmount','PayTMAmount','Remark','UserName','CardNo','CardBankName']; // resData[0].TempKeys;
  

  
   for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
   
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      // this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform1(this.reportPrintObj.BillDate));
      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      console.log(this.printTemplate.replace(/{{.*}}/g, ''));
      setTimeout(() => {
        this.print();
      }, 50);
  });
// });
}

transform(value: string) {
  var datePipe = new DatePipe("en-US");
   value = datePipe.transform(value, 'dd/MM/yyyy ');
   return value;
}

transform1(value: string) {
var datePipe = new DatePipe("en-US");
value = datePipe.transform(value, 'dd/MM/yyyy h:mm a');
 return value;
}

transform2(value: string) {
  var datePipe = new DatePipe("en-US");
  value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
  return value;
}

getPrint(el) {
  debugger
   var D_data = {
     "PaymentId": el.PaymentId,
   }
  // console.log(D_data);
   let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
   this.subscriptionArr.push(
     this._BrowseOpdPaymentReceiptService.getBrowseOpdPaymentReceiptPrint(D_data).subscribe(res => {
       if(res){
       this.reportPrintObj = res[0] as BrowseOpdPaymentReceipt;
       console.log(this.reportPrintObj);
      this.getTemplate();
      }
              
     })
   );
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



getViewbill(contact)
{
  console.log(contact);
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
      //  console.log('The dialog was closed - Insert Action', result);
      //  this.getRadiologytemplateMasterList();
     });
  }



 



// getBrowseOpdPaymentReceiptList(registrationValue){
//   this.sIsLoading = 'loading-data';
//   var D_data= {
//     "F_Name": this._BrowseOpdPaymentReceiptService.myFilterform.get("FirstName").value + '%' || "%",
//     "L_Name": this._BrowseOpdPaymentReceiptService.myFilterform.get("LastName").value + '%' || "%",
//     "From_Dt" : this.datePipe.transform(this._BrowseOpdPaymentReceiptService.myFilterform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
//     "To_Dt" : this.datePipe.transform(this._BrowseOpdPaymentReceiptService.myFilterform.get("end").value,"MM-dd-yyyy") || "01/01/1900",
//     "Reg_No":this._BrowseOpdPaymentReceiptService.myFilterform.get("RegNo").value || 0,
//     "PBillNo":this._BrowseOpdPaymentReceiptService.myFilterform.get("PBillNo").value || 0,
//     "ReceiptNo":this._BrowseOpdPaymentReceiptService.myFilterform.get("ReceiptNo").value || 0,

//   }
//   // console.log(D_data);
//   this._BrowseOpdPaymentReceiptService.getBrowseOpdPaymentReceiptList(D_data).subscribe(Visit=> {
//     this.dataArray = Visit;
     
//       this.sIsLoading = '';
//       console.log(this.dataSource.data);
     
//     },
//     error => {
//       this.sIsLoading = '';
//     });
// }

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

            this.HospitalName = BrowseOpdPaymentReceipt.HospitalName || '';
            this.HospitalAddress = BrowseOpdPaymentReceipt.HospitalAddress || '';
            this.EmailId = BrowseOpdPaymentReceipt.EmailId || '';
            this.Phone=BrowseOpdPaymentReceipt.Phone || 0;
        }

    }
}
