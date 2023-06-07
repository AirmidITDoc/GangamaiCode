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
import { BrowseIpdreturnadvanceReceipt } from 'app/main/ipd/ip-search-list/ip-refundof-advance/ip-refundof-advance.component';

@Component({
  selector: 'app-browse-refund-list',
  templateUrl: './browse-refund-list.component.html',
  styleUrls: ['./browse-refund-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations

})
export class BrowseRefundListComponent implements OnInit {

  // BrowseOPDBillsList: any;
  msg: any;
  sIsLoading: string = '';
  reportPrintObj: BrowseIpdreturnadvanceReceipt;
  currentDate=new Date();
 // reportPrintObj: ReportPrintObj;
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
    'PaymentDate',
    'RefundAmount',
    'TotalAmt',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'buttons'

    // 'action'
  ];
  dataSource = new MatTableDataSource<RefundMaster>();

  hasSelectedContacts: boolean;


  constructor(private _fuseSidebarService: FuseSidebarService,
    public _BrowseOPDReturnsService: BrowseRefundlistService,
    // public _BrowseOPDRefundsService:BrowseOpdRefundService,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getBrowseOPDReturnList();
    // var D_data= {
    //   "F_Name":this._BrowseOPDRefundsService.myFilterform.get("FirstName").value || '%',
    //   "L_Name":this._BrowseOPDRefundsService.myFilterform.get("LastName").value || '%',
    //   "From_Dt" : this.datePipe.transform(this._BrowseOPDRefundsService.myFilterform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
    //   "To_Dt" : this.datePipe.transform(this._BrowseOPDRefundsService.myFilterform.get("end").value,"MM-dd-yyyy") || "01/01/1900",
    //   "Reg_No":this._BrowseOPDRefundsService.myFilterform.get("RegNo").value || 0,

    // }
    // console.log(D_data);
    // this._BrowseOPDRefundsService.getBrowseOPDReturnReceiptList(D_data).subscribe(Visit=> {
    //     // this.dataArray = Visit;
    //     this.dataSource.data =Visit as RefundMaster[];
    //     this.dataSource.sort =this.sort;
    //     this.dataSource.paginator=this.paginator;
    //     this.sIsLoading = '';

    //   },
    //   error => {
    //     this.sIsLoading = '';
    //   });
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  // getBrowseOPDReturnList(registrationValue){
  //   var D_data= {
  //     "F_Name":this._BrowseOPDRefundsService.myFilterform.get("FirstName").value || '%',
  //     "L_Name":this._BrowseOPDRefundsService.myFilterform.get("LastName").value || '%',
  //     "From_Dt" : this.datePipe.transform(this._BrowseOPDRefundsService.myFilterform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
  //     "To_Dt" : this.datePipe.transform(this._BrowseOPDRefundsService.myFilterform.get("end").value,"MM-dd-yyyy") || "01/01/1900",
  //     "Reg_No":this._BrowseOPDRefundsService.myFilterform.get("RegNo").value || 0,

  //   }

  //   this._BrowseOPDRefundsService.getBrowseOPDReturnReceiptList(D_data).subscribe(Visit=> { 
  //       this.dataSource.data =Visit as RefundMaster[];
  //       this.dataSource.sort =this.sort;
  //       this.dataSource.paginator=this.paginator;
  //       this.sIsLoading = '';

  //     },
  //     error => {
  //       this.sIsLoading = '';
  //     });
  // }


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
    //       "RefundDate" :this.dataSource.data[i]["RefundDate"] ? this.dataSource.data[i]["RefundDate"]:"N/A",
           
    //         "Patient Name" :this.dataSource.data[i]["PatientName"] ? this.dataSource.data[i]["PatientName"] : "N/A",
    //         "PaymentDate" :this.dataSource.data[i]["PaymentDate"] ? this.dataSource.data[i]["PaymentDate"]:"N/A",
    //         "RefundAmount" :this.dataSource.data[i]["RefundAmount"] ? this.dataSource.data[i]["RefundAmount"] :"N/A",
    //         "TotalAmt" :this.dataSource.data[i]["TotalAmt"] ? this.dataSource.data[i]["TotalAmt"]:"N/A",
    //         "Pay Date" :this.dataSource.data[i]["PayDate"] ? this.dataSource.data[i]["PayDate"]:"N/A",
    //         "Total Amt" :this.dataSource.data[i]["TotalAmt"]+" - "+this.dataSource.data[i]["TotalAmt"],
    //         "CashPay Amount" :this.dataSource.data[i]["CashPayAmount"] ? this.dataSource.data[i]["CardPayAmount"]:"N/A",
    //          "ChequePay Amount" :this.dataSource.data[i]["ChequePayAmount"] ? this.dataSource.data[i]["ChequePayAmount"]:"N/A",
    //          "CardPay Amount" :this.dataSource.data[i]["CardPayAmount"]+" - "+this.dataSource.data[i]["CardPayAmount"],
         
    //     };
    //     excelData.push(singleEntry);
    //   }
    //   var fileName = "OutDoor-Refund-Receipt-List " + new Date() +".xlsx";
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
    console.log(contact);
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
        //  console.log('The dialog was closed - Insert Action', result);
        //  this.getRadiologytemplateMasterList();
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
    // changes.prop contains the old and the new value...
    // console.log(changes.dataArray.currentValue, 'new arrrrrrr');
    this.dataSource.data = changes.dataArray.currentValue as RefundMaster[];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  convertToWord(e){
    // this.numberInWords= converter.toWords(this.mynumber);
    //  return converter.toWords(e);
       }

  getTemplate() {
    let query = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=9';
    this._BrowseOPDReturnsService.getTemplate(query).subscribe((resData: any) => {
      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['HospitalName','HospAddress','Phone','PBillNo','BillDate','RegNo','OPDNo','RefundNo','RefundAmount','RefundDate','PaymentDate','PatientName','AgeYear','AgeDay','AgeMonth','GenderName','ConsultantDoctorName','Remark','Addedby']; // resData[0].TempKeys;
        for (let i = 0; i < keysArray.length; i++) {
          let reString = "{{" + keysArray[i] + "}}";
          let re = new RegExp(reString, "g");
          this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
        }
        // this.printTemplate = this.printTemplate.replace('StrRefundAmountInWords', this.convertToWord(this.reportPrintObj.RefundAmount));
        // // this.printTemplate = this.printTemplate.replace('StrBillDates', this.transform1(this.reportPrintObj.PaymentDate));
        // this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform(this.reportPrintObj.BillDate));
        // this.printTemplate = this.printTemplate.replace('StrBillAmount','₹' + (this.reportPrintObj.NetPayableAmt.toFixed(2)));
        // this.printTemplate = this.printTemplate.replace('StrRefundAmount','₹' + (this.reportPrintObj.RefundAmount.toFixed(2)));
        // this.printTemplate = this.printTemplate.replace('StrPaymentDates', this.transformBilld(this.reportPrintObj.PaymentDate));

        // this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
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
 console.log(el.RefundId);
  var D_data = {
    "RefundId": el.RefundId,
  }
  
  let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
  this.subscriptionArr.push(
    this._BrowseOPDReturnsService.getRefundBrowsePrint(D_data).subscribe(res => {
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

}



export class ReportPrintObj {
  AdvanceNo: any;
  Address: any;
  HospitalName: any;
  RegNo: any;
  PatientName: any;
  IPDNo: any;
  Date: any;
  PatientType: any;
  AdvanceAmount: any;
  BillDate:any;
  PaymentDate:any;
  AgeYear:any;
  GenderName:any;
}

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
    }
  }
}

