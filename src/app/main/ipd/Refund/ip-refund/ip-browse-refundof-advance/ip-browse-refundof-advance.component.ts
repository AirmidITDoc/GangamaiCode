import { Component, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IPRefundService } from '../ip-refund.service';
import { Subscription } from 'rxjs';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { ViewIPRefundofAdvanceComponent } from './view-ip-refundof-advance/view-ip-refundof-advance.component';
import { IPBrowseRefundofAdvanceService } from './ip-browse-refundof-advance.service';
import { fuseAnimations } from '@fuse/animations';

import * as converter from 'number-to-words';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-ip-browse-refundof-advance',
  templateUrl: './ip-browse-refundof-advance.component.html',
  styleUrls: ['./ip-browse-refundof-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations

})
export class IPBrowseRefundofAdvanceComponent implements OnInit {

  BrowseOpdPaymentReceiptList:any;
  msg:any;
  currentDate = new Date();
  sIsLoading: string = '';
  click : boolean = false;
  MouseEvent=true;
 // reportPrintObjList: BrowseIpdreturnadvanceReceipt[] = [];
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  @Input() dataArray: any; 
  reportPrintObj: BrowseIpdreturnadvanceReceipt;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  SpinLoading:boolean=false;

  displayedColumns = [
    // 'checkbox',
    'RegNo',
    'RefundDate',
    'PatientName',
    'AdvanceAmount',
    'AdvanceUsedAmount',
    'BalanceAmount',
    // 'RefundNo',
    'RefundAmount',
    'PaymentDate',
    //  'GenderName',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'Remark',
    'UserName',
  
   
     'buttons'
  ];
  dataSource = new MatTableDataSource<BrowseIpdreturnadvanceReceipt>();
  hasSelectedContacts: boolean;
 
  constructor( private _fuseSidebarService: FuseSidebarService,
    public _IpReturnadvanceReceiptService:IPBrowseRefundofAdvanceService,
    private matDialog: MatDialog,
    private _matDialog: MatDialog,
    
    public datePipe: DatePipe,
        private advanceDataStored: AdvanceDataStored,) { }

  ngOnInit(): void {
    this.GetIpdreturnAdvancepaymentreceipt(); 
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    // console.log(changes.dataArray.currentValue, 'new arrrrrrr');
    this.dataSource.data = changes.dataArray.currentValue as BrowseIpdreturnadvanceReceipt[];
    this.dataSource.sort =this.sort;
    this.dataSource.paginator=this.paginator;
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
      this.GetIpdreturnAdvancepaymentreceipt(); 
    }
  }, 50);
  this.MouseEvent=true;
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
  //       "Refund Date" :this.dataSource.data[i]["RefundDate"] ? this.dataSource.data[i]["RefundDate"] :"N/A",
  //       "Patient Name" :this.dataSource.data[i]["PatientName"] ? this.dataSource.data[i]["PatientName"] : "N/A",
  //       "AdvanceAmount" :this.dataSource.data[i]["AdvanceAmount"] ? this.dataSource.data[i]["AdvanceAmount"]:"N/A",
  //       "AdvanceUsed Amount" :this.dataSource.data[i]["AdvanceUsedAmount"] ? this.dataSource.data[i]["AdvanceUsedAmount"]:"N/A",
  //       "Refund No" :this.dataSource.data[i]["RefundNo"] ? this.dataSource.data[i]["RefundNo"]:"N/A",
  //       "PaymentDate" :this.dataSource.data[i]["PaymentDate"]+" - "+this.dataSource.data[i]["PaymentDate"],
  //       "GenderName" :this.dataSource.data[i]["GenderName"]? this.dataSource.data[i]["GenderName"]:"N/A",
  //        "CashPay Amount" :this.dataSource.data[i]["CashPayAmount"] ? this.dataSource.data[i]["CardPayAmount"]:"N/A",
  //        "ChequePay Amount" :this.dataSource.data[i]["ChequePayAmount"] ? this.dataSource.data[i]["ChequePayAmount"]:"N/A",
  //        "CardPay Amount" :this.dataSource.data[i]["CardPayAmount"]+" - "+this.dataSource.data[i]["CardPayAmount"],
  //        "RefundAmount" :this.dataSource.data[i]["RefundAmount"] ? this.dataSource.data[i]["RefundAmount"]:"N/A",
  //        "Remark" :this.dataSource.data[i]["Remark"] ? this.dataSource.data[i]["Remark"]:"N/A",
  //        "UserName" :this.dataSource.data[i]["UserName"] ? this.dataSource.data[i]["UserName"]:"N/A"
        
  //     };
  //     excelData.push(singleEntry);
  //   }
  //   var fileName = "Indoor-Refund Advance-List " + new Date() +".xlsx";
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



viewgetRefundofbillReportPdf(row) {
  setTimeout(() => {
    this.SpinLoading =true;
  //  this.AdList=true;
  this._IpReturnadvanceReceiptService.getRefundofAdvanceview(
    row.RefundId
  ).subscribe(res => {
    const dialogRef = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Refund Of Advance  Viewer"
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.SpinLoading = false;
      });
      dialogRef.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.SpinLoading = false;
      });
  });
 
  },100);
}

getRecord(el,i) {
  // console.log(el,i);
  // this.matDialog.open(SmsEmailTemplateComponent, {
  //   data: i,
  //   width: '40%',
  //   height: "fit-content",
  //   autoFocus: false
  // });

}

 
  onClear() {
    this._IpReturnadvanceReceiptService.myFilterform.get('FirstName').reset();
    this._IpReturnadvanceReceiptService.myFilterform.get('LastName').reset();
    this._IpReturnadvanceReceiptService.myFilterform.get('RegNo').reset();
  }


  GetIpdreturnAdvancepaymentreceipt() {
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name": this._IpReturnadvanceReceiptService.myFilterform.get("FirstName").value + '%' || "%",
      "L_Name": this._IpReturnadvanceReceiptService.myFilterform.get("LastName").value + '%' || "%",
      "From_Dt": this.datePipe.transform(this._IpReturnadvanceReceiptService.myFilterform.get("start").value, "MM-dd-yyyy"), //"01/01/2018",
      "To_Dt": this.datePipe.transform(this._IpReturnadvanceReceiptService.myFilterform.get("end").value, "MM-dd-yyyy"), //"01/01/2020",
      "Reg_No": this._IpReturnadvanceReceiptService.myFilterform.get("RegNo").value || 0
    }
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      console.log(D_data);
      this._IpReturnadvanceReceiptService.getIpdreturnAdvancepaymentreceipt(D_data).subscribe(Visit => {
        this.dataSource.data = Visit as BrowseIpdreturnadvanceReceipt[];
        // console.log(this.dataSource.data)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.sIsLoading = ' ';
        this.click = false;

      },
        error => {
          this.sIsLoading = '';
        });
    }, 50);

  }
  convertToWord(e){
    // this.numberInWords= converter.toWords(this.mynumber);
     return converter.toWords(e);
       }

  getTemplate() {
    let query = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=4';
    this._IpReturnadvanceReceiptService.getTemplate(query).subscribe((resData: any) => {
      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['HospitalName','HospitalAddress','Phone','EmailId','RefundId','PaymentDate','RegNo','IPDNo','AgeDay','AgeMonth','AgeYear','ReceiptNo','GenderName','PatientName','RefundAmount','Remark','AddedBy'];
        for (let i = 0; i < keysArray.length; i++) {
          let reString = "{{" + keysArray[i] + "}}";
          let re = new RegExp(reString, "g");
          this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
          
        }

        
        this.printTemplate = this.printTemplate.replace('StrRefundAmountInWords', this.convertToWord(this.reportPrintObj.RefundAmount));
        this.printTemplate = this.printTemplate.replace('StrPaymentDate', this.transform2(this.reportPrintObj.PaymentTime));
        // this.printTemplate = this.printTemplate.replace('StrPaymentDate', this.transform(this.reportPrintObj.PaymentDate));
        // this.printTemplate = this.printTemplate.replace('StrRefundAmount','₹' + (this.reportPrintObj.RefundAmount.toFixed(2)));
        this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
        // this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
        setTimeout(() => {
          this.print();
        }, 50);
    });
  }

  transform(value: string) {
    var datePipe = new DatePipe("en-US");
     value = datePipe.transform(value, 'dd/MM/yyyy ');
     return value;
 }

//  transform1(value: string) {
//   var datePipe = new DatePipe("en-US");
//   value = datePipe.transform(value, 'dd/MM/yyyy hh:mm a');
//    return value;
// }

transform2(value: string) {
  var datePipe = new DatePipe("en-US");
  value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
  return value;
}


getPrint(el) {

  debugger;
 console.log(el);
  var D_data = {
    "RefundId": el.RefundId,
  }
  console.log(el);
  let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
  this.subscriptionArr.push(
    this._IpReturnadvanceReceiptService.getAdvanceRefundReceiptPrint(D_data).subscribe(res => {
      if(res){
      this.reportPrintObj = res[0] as BrowseIpdreturnadvanceReceipt;
      console.log(this.reportPrintObj);
     }
    
      this.getTemplate();
      // console.log(res);
      
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
     PaymentId :contact.PaymentId,
    BillNo: contact.BillNo,
   RegId: contact.RegId,
    RegNo: contact.RegNo,
    PatientName: contact.PatientName,
    FirstName: contact.FirstName,
    MiddleName: contact.MiddleName,
    GenderName:contact.GenderName,
    LastName: contact.LastName,
    TotalAmt:contact.TotalAmt,
    BalanceAmt:contact.BalanceAmt,
    Remark: contact.Remark,
    PaymentDate: contact.PaymentDate,
    CashPayAmount :contact.CashPayAmount,
    ChequePayAmount:contact.ChequePayAmount,
    CardPayAmount :contact.CardPayAmount,
    AdvanceUsedAmount: contact.AdvanceUsedAmount,
    AdvanceId: contact.AdvanceId,
    RefundId: contact.RefundId,
    IsCancelled: contact.IsCancelled,
    AddBy: contact.AddBy,
    UserName: contact.AddBy,
    PBillNo: contact.PBillNo,
    ReceiptNo: contact.ReceiptNo,
    TransactionType:contact.TransactionType,
    PayDate:contact.PayDate,
    PaidAmount:contact.PaidAmount,
    NEFTPayAmount:contact.NEFTPayAmount,
    PayTMAmount:contact.PayTMAmount,
    RefundAmount:contact.RefundAmount,
    RefundNo:contact.RefundNo,
    AddedBy:contact.AddedBy,
    HospitalName:contact.HospitalName,
    HospitalAddress:contact.HospitalAddress,
   Age:contact.Age,
    };

    this.advanceDataStored.storage = new BrowseIpdreturnadvanceReceipt(xx);
   
      const dialogRef = this.matDialog.open(ViewIPRefundofAdvanceComponent, 
       {  maxWidth: "75vw",
          maxHeight: "130vh", width: '100%', height: "100%"
     });
     dialogRef.afterClosed().subscribe(result => {
      //  console.log('The dialog was closed - Insert Action', result);
      //  this.getRadiologytemplateMasterList();
     });
  }



}

export class BrowseIpdreturnadvanceReceipt
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
    PaymentTime:any;
    RefundAmount:number;
    RefundNo:number;
    HospitalAddress:string;
    Phone:any;
    EmailId:any;
     Age:number;
     AgeYear:number;
     IPDNo:any;
    /**
     * Constructor
     *
     * @param BrowseIpdreturnadvanceReceipt
     */
    constructor(BrowseIpdreturnadvanceReceipt) {
        {
            this.PaymentId = BrowseIpdreturnadvanceReceipt.PaymentId || '';
            this.BillNo = BrowseIpdreturnadvanceReceipt.BillNo || '';
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
           this.Phone=BrowseIpdreturnadvanceReceipt.Phone || ''
           this.PaymentTime=BrowseIpdreturnadvanceReceipt.PaymentTime || '';
           this.EmailId=BrowseIpdreturnadvanceReceipt.EmailId || '';
        }

    }
}



