import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Subscription } from 'rxjs';
import { IPBrowseRefundofBillService } from './ip-browse-refundof-bill.service';
import { ViewIPReunfofBillComponent } from './view-ip-reunfof-bill/view-ip-reunfof-bill.component';

@Component({
  selector: 'app-ip-browse-refundof-bill',
  templateUrl: './ip-browse-refundof-bill.component.html',
  styleUrls: ['./ip-browse-refundof-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPBrowseRefundofBillComponent implements OnInit {

  click : boolean = false;
  MouseEvent=true;
  BrowseIPDRefundBillsList:any;
  msg:any;
  sIsLoading: string = '';
  
reportPrintObj: BrowseIpdreturnadvanceReceipt;
subscriptionArr: Subscription[] = [];
printTemplate: any;



  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  @Input() dataArray: any; 

    
  displayedColumns = [
    'RegNo',
    // 'RefundId',
    'RefundDate',
    // 'BillId',
    'PatientName',
    // 'PaymentDate',
    'RefundAmount',
    'TotalAmt', 
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'Remark',
    'buttons'
  
    
    // 'action'
  ];
  dataSource = new MatTableDataSource<RefundMaster>();
  hasSelectedContacts: boolean;
  

  constructor( private _fuseSidebarService: FuseSidebarService,
     public _IPBrowseRefundofBillService:IPBrowseRefundofBillService,
     private matDialog: MatDialog,
     private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getBrowseIPDRefundbillList(); 
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
}

ngOnChanges(changes: SimpleChanges) {
  // changes.prop contains the old and the new value...
  // console.log(changes.dataArray.currentValue, 'new arrrrrrr');
  this.dataSource.data = changes.dataArray.currentValue as RefundMaster[];
  this.dataSource.sort =this.sort;
  this.dataSource.paginator=this.paginator;
}



getBrowseIPDRefundbillList(){
  this.sIsLoading = 'loading-data';
  var D_data= {
    "F_Name":this._IPBrowseRefundofBillService.myFilterform.get("FirstName").value + '%' || "%",
    "L_Name":this._IPBrowseRefundofBillService.myFilterform.get("LastName").value + '%' || "%",
    "From_Dt" : this.datePipe.transform(this._IPBrowseRefundofBillService.myFilterform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
    "To_Dt" : this.datePipe.transform(this._IPBrowseRefundofBillService.myFilterform.get("end").value,"MM-dd-yyyy") || "01/01/1900",
    "Reg_No":this._IPBrowseRefundofBillService.myFilterform.get("RegNo").value || 0,
    // "PBillNo":this._IPBrowseRefundofBillService.myFilterform.get("PBillNo").value || "0",
  }

  setTimeout(() => {
    this.sIsLoading = 'loading-data';
    console.log(D_data);
      this._IPBrowseRefundofBillService.getIpdRefundBillBrowseList(D_data).subscribe(Visit=> {
      this.dataSource.data = Visit as RefundMaster[];
      console.log(this.dataSource.data);
      this.dataSource.sort= this.sort;
      this.dataSource.paginator=this.paginator;
      this.sIsLoading = ' ';
      this.click = false;
      
    },
      error => {
        this.sIsLoading = '';
      });
  }, 50);

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
  //       "RefundAmount" :this.dataSource.data[i]["RefundAmount"] ? this.dataSource.data[i]["RefundAmount"]:"N/A",
  //       "AdvanceAmount" :this.dataSource.data[i]["AdvanceAmount"] ? this.dataSource.data[i]["AdvanceAmount"]:"N/A",
  //       "TotalAmt" :this.dataSource.data[i]["TotalAmt"] ? this.dataSource.data[i]["TotalAmt"]:"N/A",
  //       "CashPay Amount" :this.dataSource.data[i]["CashPayAmount"]+" - "+this.dataSource.data[i]["CashPayAmount"],
  //       "ChequePayAmount" :this.dataSource.data[i]["ChequePayAmount"]? this.dataSource.data[i]["ChequePayAmount"]:"N/A",
  //        "CardPayAmount" :this.dataSource.data[i]["CardPayAmount"] ? this.dataSource.data[i]["CardPayAmount"]:"N/A",
  //       "Remark" :this.dataSource.data[i]["Remark"] ? this.dataSource.data[i]["Remark"]:"N/A"
        
  //     };
  //     excelData.push(singleEntry);
  //   }
  //   var fileName = "Indoor-Refund Bill-List " + new Date() +".xlsx";
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

getViewbill(contact)
{
  console.log(contact);
    let xx = {
     PaymentId :contact.PaymentId,
    BillNo: contact.BillNo,
    BillId:contact.BillId,
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
    AddedBy: contact.AddedBy,
    UserName: contact.AddedBy,
    PBillNo: contact.PBillNo,
    ReceiptNo: contact.ReceiptNo,
    TransactionType:contact.TransactionType,
    PayDate:contact.PayDate,
    PaidAmount:contact.PaidAmount,
    NEFTPayAmount:contact.NEFTPayAmount,
    PayTMAmount:contact.PayTMAmount,
    RefundAmount:contact.RefundAmount,
    RefundNo:contact.RefundNo,
    RefundDate:contact.RefundDate,
    };

    this.advanceDataStored.storage = new BrowseIpdreturnadvanceReceipt(xx);
   
      const dialogRef = this.matDialog.open(ViewIPReunfofBillComponent, 
       {  maxWidth: "95vw",
          maxHeight: "130vh", width: '100%', height: "100%"
     });
     dialogRef.afterClosed().subscribe(result => {
      //  console.log('The dialog was closed - Insert Action', result);
      //  this.getRadiologytemplateMasterList();
     });
  }


onShow(event:MouseEvent)
{   
  //debugger;
 
  this.click=!this.click;
   setTimeout(() => {
     {
      this.sIsLoading = 'loading-data';
      this.getBrowseIPDRefundbillList(); 
    }
  }, 50);
  this.MouseEvent=true;
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
convertToWord(e){
  // this.numberInWords= converter.toWords(this.mynumber);
  //  return converter.toWords(e);
     }
 
  getTemplate() {
    let query = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=5';
    this._IPBrowseRefundofBillService.getTemplate(query).subscribe((resData: any) => {
      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['HospitalName','HospitalAddress','Phone','EmailId','PBillNo','RegNo','OPDNo','RefundNo','RefundAmount','RefundDate','PaymentDate','PatientName','AgeDay','AgeMonth','Age','GenderName','Remark','AddedBy','BillDate']; // resData[0].TempKeys;
        for (let i = 0; i < keysArray.length; i++) {
          let reString = "{{" + keysArray[i] + "}}";
          let re = new RegExp(reString, "g");
          this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);

          console.log(this.reportPrintObj);
        }
       
        debugger;
        this.printTemplate = this.printTemplate.replace('StrRefundAmountInWords', this.convertToWord(this.reportPrintObj.RefundAmount));
        this.printTemplate = this.printTemplate.replace('StrBillAmount','₹' + (this.reportPrintObj.NetPayableAmt.toFixed(2)));
        this.printTemplate = this.printTemplate.replace('StrRefundAmount','₹' + (this.reportPrintObj.RefundAmount.toFixed(2)));
        this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform1(this.reportPrintObj.BillDate.toString()));
        this.printTemplate = this.printTemplate.replace('StrPaymentDate', this.transform2(this.reportPrintObj.PaymentDate.toString()));
        this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.reportPrintObj.PaymentDate.toString()));
        this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
        setTimeout(() => {
          this.print();
        }, 50);
    });
  }


  transform(value: string) {
    var datePipe = new DatePipe("en-US");
     value = datePipe.transform(value, 'dd/MM/yyyy');
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

getPrint(el) {
  debugger;
 console.log(el);
  var D_data = {
    "RefundId": el.RefundId,
  }
  console.log(el);
  let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
  this.subscriptionArr.push(
    this._IPBrowseRefundofBillService.getIPRefundBILLBrowsePrint(D_data).subscribe(res => {
      if(res){
      this.reportPrintObj = res[0] as BrowseIpdreturnadvanceReceipt;
      console.log(this.reportPrintObj);
     }
    
     console.log(this.reportPrintObj);
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
  onClear() {
  
    this._IPBrowseRefundofBillService.myFilterform.get('FirstName').reset();
    this._IPBrowseRefundofBillService.myFilterform.get('LastName').reset();
    this._IPBrowseRefundofBillService.myFilterform.get('RegNo').reset();
 
  }



}

export class RefundMaster {
  RefundId: number;
  RefundDate: Date;
  BillId:number;
  RefundAmt: number;
  RefundAmount:number;
  PatientName: Date;
  GenderName:String;
  Total: number;
  PaymentId: number;
  PaymentDate: any;
  CashPayAmount:number;
  ChequePayAmount:number;
  CardPayAmount:number;
  PBillNo:number;



  constructor(RefundMaster) {
    {
      this.RefundId = RefundMaster.RefundId || 0;
      this.RefundDate = RefundMaster.RefundDate || '';
      this.BillId = RefundMaster.BillId || '';
      this.RefundAmt = RefundMaster.RefundAmt || 0;
      this.RefundAmount=RefundMaster.RefundAmount || 0;
      this.PatientName = RefundMaster.PatientName || '';
      this.GenderName = RefundMaster.GenderName || '';
      this.Total = RefundMaster.Total || 0 ;
      this.PaymentId = RefundMaster.PaymentId || 0;
      this.PaymentDate = RefundMaster.PaymentDate || 0;
      this.CashPayAmount = RefundMaster.CashPayAmount || 0 ;
      this.ChequePayAmount = RefundMaster.ChequePayAmount || 0;
      this.CardPayAmount = RefundMaster.CardPayAmount || 0;
      this.PBillNo = RefundMaster.PBillNo || 0;
    }
  }
}

// export class ReportPrintObj {
//   HospitalName: any;
// HospitalAddress
// IPDNo: any;
// BillNo: any;
// PatientName: any;
// BillDate: any;
// Age:any;
// GenderName:any;
// AdmissionDate:any;
// AdmissionTime:any;
// DischargeDate:any;
// DischargeTime
// RefDocName: any;
// RoomName:any;
// BedName:any;
// PatientType:any;
// DepartmentName: any;
// ServiceName: any;
// Price: any;
// Qty:any;
// ChargesTotalAmt: any;
// TotalAmt:any;
// AdvanceUsedAmount: any;
// PaidAmount: any;
// PayTMPayAmount:any;
// CashPayAmount:any;
// ChequePayAmount:any;
// NEFTPayAmount:any;
// TotalAdvanceAmount:any;
// AdvanceBalAmount:any;
// AdvanceRefundAmount:any;
// AddedByName: any;
// }


export class BrowseIpdreturnadvanceReceipt
{
    PaymentId: Number;
    BillNo: Number;
    RegNo: number;
    RegId: number;
    IPDNo:any;
    PatientName: string;
    FirstName: string;
    MiddleName: string; 
    LastName: string;
    Age:number;
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
    AddedByName: number;
    UserName:string;
    PBillNo: string;
    ReceiptNo: string;
    TransactionType:number;
    PayDate:Date;
    PaidAmount: number;
    NEFTPayAmount:number;
    PayTMAmount: number;
    AddedBy:string;
    RefundDate:Date;
    RefundAmount:number;
    RefundNo:number;
    BillId:number;
     BillDate:any;
     NetPayableAmt:any;
     OPDNo:any;
     ConsultantDoctorName:any;
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
            this.IPDNo=BrowseIpdreturnadvanceReceipt.IPDNo||'';
            this.Age = BrowseIpdreturnadvanceReceipt.Age || '';
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
            this.AddedByName = BrowseIpdreturnadvanceReceipt.AddedByName || '';
            this.UserName = BrowseIpdreturnadvanceReceipt.UserName || '';
            this.ReceiptNo = BrowseIpdreturnadvanceReceipt.ReceiptNo || '';
            this.PBillNo = BrowseIpdreturnadvanceReceipt.PBillNo || '';
            this.TransactionType = BrowseIpdreturnadvanceReceipt.TransactionType || '';
            this.PayDate = BrowseIpdreturnadvanceReceipt.PayDate || '';
            this.PaidAmount = BrowseIpdreturnadvanceReceipt.PaidAmount || '';
            this.NEFTPayAmount = BrowseIpdreturnadvanceReceipt.NEFTPayAmount || '';
            this.PayTMAmount = BrowseIpdreturnadvanceReceipt.PayTMAmount || '';
            this.RefundDate = BrowseIpdreturnadvanceReceipt.RefundDate || '';
            this.RefundAmount = BrowseIpdreturnadvanceReceipt.RefundAmount|| '';
            this.RefundNo = BrowseIpdreturnadvanceReceipt.RefundNo || ''; 
            this.GenderName = BrowseIpdreturnadvanceReceipt.GenderName || ''; 
            this.AddedBy = BrowseIpdreturnadvanceReceipt.AddedBy || '';
            this.BillId = BrowseIpdreturnadvanceReceipt.BillId || '';
            this.BillDate = BrowseIpdreturnadvanceReceipt.BillDate || '';
            this.NetPayableAmt=BrowseIpdreturnadvanceReceipt.NetPayableAmt ||0;
            this.OPDNo =BrowseIpdreturnadvanceReceipt.OPDNo || 0;
           this.ConsultantDoctorName=BrowseIpdreturnadvanceReceipt.ConsultantDoctorName || 0;
        }

    }
}
