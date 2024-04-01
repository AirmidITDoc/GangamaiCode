import { Component, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChargesList } from 'app/main/opd/op-search-list/opd-search-list/opd-search-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { IPSearchListService } from '../ip-search-list.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from '../../advance';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { IPAdvancePaymentComponent } from '../ip-advance-payment/ip-advance-payment.component';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdvanceDetail, AdvanceDetailObj } from '../ip-search-list.component';
import { Router } from '@angular/router';
import * as converter from 'number-to-words';
import { OPSearhlistService } from 'app/main/opd/op-search-list/op-searhlist.service';
import { OpPaymentNewComponent } from 'app/main/opd/op-search-list/op-payment-new/op-payment-new.component';
import { IpdAdvanceBrowseModel } from '../../browse-ipadvance/browse-ipadvance.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';


@Component({
  selector: 'app-ip-advance',
  templateUrl: './ip-advance.component.html',
  styleUrls: ['./ip-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPAdvanceComponent implements OnInit {

  msg: any;
  sIsLoading: string = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;
  currentDate = new Date();
  reportPrintObjList: IpdAdvanceBrowseModel[] = [];
  reportPrintsummaryObjList: IpdAdvanceBrowseModel[] = [];
  displayedColumns = [
    'Date',
    'AdvanceNo',
    'AdvanceAmount',
    'UsedAmount',
    'BalanceAmount',
    'RefundAmount',
    'CashPay',
    'ChequePay',
    'CardPay',
    'NeftPay',
    'PayTMPay',
    'UserName',
    'buttons'

  ];
  dataSource = new MatTableDataSource<AdvanceDetail>();
  menuActions: Array<string> = [];
  advanceAmount: any;
  isLoadingStr: string = '';
  AdvFormGroup: FormGroup;
  isLoading: string = '';
  selectedAdvanceObj: AdvanceDetailObj;
  screenFromString = 'advance';
  dateTimeObj: any;
  TotalAdvamt: any;
  Advavilableamt: any;
  vAdvanceId  :any;
  reportPrintObj: IpdAdvanceBrowseModel;
 reportPrintsummaryObj: IpdAdvanceBrowseModel;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  CashCounterList: any = [];
  PatientHeaderObj: any;
  constructor(public _IpSearchListService: IPSearchListService,
    public _opappointmentService: OPSearhlistService,
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    private dialogRef: MatDialogRef<IPAdvanceComponent>,
    private accountService: AuthenticationService,
    private formBuilder: FormBuilder) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.AdvFormGroup = this.formBuilder.group({
      advanceAmt: ['', [Validators.pattern('^[0-9]{2,8}$')]],
      comment: [''],
      CashCounterId: [0]
    });

    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
       this.PatientHeaderObj = this.advanceDataStored.storage;
      
    }

    let AdmissionId = this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value
    this.getAdvanceList();
    this.getCashCounterComboList();
  }

  getAdvanceList() {
    // debugger
    this.isLoadingStr = 'loading';
    var m_data = {
      "AdmissionID": this.selectedAdvanceObj.AdmissionID
    }
    setTimeout(() => {
      this.isLoadingStr = 'loading';
      this._IpSearchListService.getAdvanceList(m_data).subscribe(Visit => {
        this.dataSource.data = Visit as AdvanceDetail[];
        console.log(this.dataSource.data);
        if (this.dataSource.data.length > 0 ) {
          this.vAdvanceId=this.dataSource.data[0]['AdvanceId'];
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
        }
        else{
          this.vAdvanceId= 0;
          this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
        }
      },
        error => {
          this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
        });
    }, 500);

  }

  getCashCounterComboList() {
    this._opappointmentService.getCashcounterList().subscribe(data => {
      this.CashCounterList = data
    });
  }

  getAdvancetotal(element) {

    let netAmt;
    netAmt = element.reduce((sum, { AdvanceAmount }) => sum += +(AdvanceAmount || 0), 0);
    this.TotalAdvamt = netAmt;
    return netAmt;
  }

  getAdvavilable(element) {
    let netAmt;
    netAmt = element.reduce((sum, { BalanceAmount }) => sum += +(BalanceAmount || 0), 0);
    this.Advavilableamt = netAmt;
    return netAmt;
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onSave() {
    // debugger;
    if (this.vAdvanceId == 0) {
      this.isLoading = 'submit';

      let advanceHeaderObj = {};
      advanceHeaderObj['AdvanceId'] = 0;
      advanceHeaderObj['Date'] = this.dateTimeObj.date|| '01/01/1900'
      advanceHeaderObj['RefId'] = this.selectedAdvanceObj.RegId,
      advanceHeaderObj['OPD_IPD_Type'] = 1;
      advanceHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
      advanceHeaderObj['AdvanceAmount'] = this.advanceAmount;
      advanceHeaderObj['AdvanceUsedAmount'] = 0;
      advanceHeaderObj['BalanceAmount'] = this.advanceAmount;
      advanceHeaderObj['AddedBy'] = this.accountService.currentUserValue.user.id;
      advanceHeaderObj['IsCancelled'] = false;
      advanceHeaderObj['IsCancelledBy'] = '0';
      advanceHeaderObj['IsCancelledDate'] = '01/01/1900';

      let AdvanceDetObj = {};
      AdvanceDetObj['AdvanceDetailID'] = '0';
      AdvanceDetObj['Date'] = this.dateTimeObj.date|| '01/01/1900'
      AdvanceDetObj['Time'] = this.datePipe.transform(this.currentDate,'hh:mm:ss') || '01/01/1900'
      AdvanceDetObj['AdvanceId'] = 0;
      AdvanceDetObj['RefId'] = this.selectedAdvanceObj.RegId,
      AdvanceDetObj['transactionID'] = 2;
      AdvanceDetObj['OPD_IPD_Type'] = 1;
      AdvanceDetObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
      AdvanceDetObj['AdvanceAmount'] = this.advanceAmount;
      AdvanceDetObj['usedAmount'] = 0;
      AdvanceDetObj['BalanceAmount'] = this.advanceAmount;
      AdvanceDetObj['RefundAmount'] = 0;
      AdvanceDetObj['ReasonOfAdvanceId'] = 0;
      AdvanceDetObj['AddedBy'] = this.accountService.currentUserValue.user.id;
      AdvanceDetObj['IsCancelled'] = false;
      AdvanceDetObj['IsCancelledBy'] = 0;
      AdvanceDetObj['IsCancelledDate'] = '01/01/1900';
      AdvanceDetObj['Reason'] = this.AdvFormGroup.get("comment").value;
      // AdvanceDetObj['CashCounterId'] = 2;//this.AdvFormGroup.get('CashCounterId').value.CashCounterId;

      let PatientHeaderObj = {};
      PatientHeaderObj['Date'] = this.dateTimeObj.date|| '01/01/1900'
      PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
      PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
      PatientHeaderObj['NetPayAmount'] = this.advanceAmount;

      // const advanceHeaderInsert = new AdvanceHeader(advanceHeaderObj);
      // const advanceDetailInsert = new AdvanceDetails(AdvanceDetObj);

      const dialogRef = this._matDialog.open(OpPaymentNewComponent,
        {
          maxWidth: "100vw",
          height: '740px',
          width: '100%',
       
          data: {
            vPatientHeaderObj: PatientHeaderObj,
            FromName: "Advance"
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('==============================  Advance Amount ===========');
        let submitData = {
          "advanceHeaderInsert": advanceHeaderObj,
          "advanceDetailInsert": AdvanceDetObj,
          "ipPaymentInsert": result.submitDataPay.ipPaymentInsert
        };
        console.log(submitData);
        this._IpSearchListService.InsertAdvanceHeader(submitData).subscribe(response => {
          // debugger
          if (response) {
            Swal.fire('Congratulations !', 'IP Advance data saved Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this.getPrint(response);
                
                this._matDialog.closeAll();
              }
            });
          } else {
            Swal.fire('Error !', 'IP Advance data not saved', 'error');
          }
          this.isLoading = '';
        });

      });
    }
    else {
      this.isLoading = 'submit';
   
      let AdvanceDetObj = {};
      AdvanceDetObj['AdvanceDetailID'] = '0';
      AdvanceDetObj['Date'] = this.dateTimeObj.date|| '01/01/1900'
      AdvanceDetObj['Time'] = this.dateTimeObj.time || '01/01/1900'
      AdvanceDetObj['AdvanceId'] = this.vAdvanceId || 0;
      AdvanceDetObj['RefId'] = this.selectedAdvanceObj.RegId;
      AdvanceDetObj['transactionID'] = 2;
      AdvanceDetObj['OPD_IPD_Type'] = 1;
      AdvanceDetObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
      AdvanceDetObj['AdvanceAmount'] = this.advanceAmount;
      AdvanceDetObj['AdvanceUsedAmount'] = 0;
      AdvanceDetObj['BalanceAmount'] = this.advanceAmount;
      AdvanceDetObj['RefundAmount'] = 0;
      AdvanceDetObj['ReasonOfAdvanceId'] = 0;
      AdvanceDetObj['AddedBy'] = this.accountService.currentUserValue.user.id;
      AdvanceDetObj['IsCancelled'] = false;
      AdvanceDetObj['IsCancelledBy'] = 0;
      AdvanceDetObj['IsCancelledDate'] = '01/01/1900';
      AdvanceDetObj['Reason'] = this.AdvFormGroup.get("comment").value;
     // AdvanceDetObj['CashCounterId'] = 2;//this.AdvFormGroup.get('CashCounterId').value.CashCounterId;

      let advanceHeaderObj = {};
      advanceHeaderObj['AdvanceId'] = this.vAdvanceId;
      advanceHeaderObj['AdvanceAmount'] = parseInt(this.advanceAmount.toString());

      let PatientHeaderObj = {};

      PatientHeaderObj['Date'] = this.dateTimeObj.date|| '01/01/1900'
      PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
      PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
      PatientHeaderObj['NetPayAmount'] = this.advanceAmount;

      const advanceHeaderUpdate = new AdvanceHeaderUpdate(advanceHeaderObj);
      const advanceDetailInsert = new AdvanceDetails(AdvanceDetObj);

      const dialogRef = this._matDialog.open(OpPaymentNewComponent,
        {
          maxWidth: "100vw",
          height: '600px',
          width: '100%',
         
           data: {
            vPatientHeaderObj: PatientHeaderObj,
            FromName: "Advance"
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('==============================  Advance Amount ===========');
        
        let submitData = {
          "advanceHeaderUpdate": advanceHeaderUpdate,
          "advanceDetailInsert1": advanceDetailInsert,
          "ipPaymentInsert1": result.submitDataPay.ipPaymentInsert
        };
        console.log(submitData);
        this._IpSearchListService.InsertAdvanceHeaderUpdate(submitData).subscribe(response => {
          // debugger;
          if (response) {
            Swal.fire('Congratulations !', 'IP Advance data Updated Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this.getAdvanceList();
                this._matDialog.closeAll();
                this.viewgetAdvanceReceiptReportPdf(response);
                // this.getPrint(response);
              }
            });
          } else {
            Swal.fire('Error !', 'IP Advance data not Updated', 'error');
          }
          this.isLoading = '';
        });

      });
    }
    this.AdvFormGroup.get('advanceAmt').reset(0);
    this.AdvFormGroup.get('comment').reset('');
    this.AdvFormGroup.get('CashCounterId').reset(0);
  }

convertToWord(e){
  
  return converter.toWords(e);
}

getTemplate() {
  let query = 'select tempId,TempDesign,JSON_QUERY(TempKeys) as TempKeys from Tg_Htl_Tmp where TempId=1';
  this._IpSearchListService.getTemplate(query).subscribe((resData: any) => {
    console.log(resData);
    this.printTemplate = resData[0].TempDesign;
   
     let keysArray = ['HospitalName','HospitalAddress','Phone','EmailId','AdvanceNo','RegNo','AdvanceNo','Date','PatientName','AgeDay','AgeMonth','Age','IPDNo','AdmissionDate','PatientType','AdvanceAmount','reason','Addedby','Remark',
     'CardNo','CardPayAmount','CardDate','CardBankName','BankName','ChequeNo','ChequePayAmount','ChequeDate','CashPayAmount','NEFTPayAmount','PayTMAmount','TariffName'];// resData[0].TempKeys;
      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }

      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(this.reportPrintObj.AdvanceAmount));

      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform1(new Date().toString()));
      this.printTemplate = this.printTemplate.replace('StrAddmissionDate', this.transform1(this.reportPrintObj.AdmissionDate));
      // this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform1(this.reportPrintObj.Date));

      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      setTimeout(() => {
        this.print();
      }, 1000);
  });
}



transform1(value: string) {
  var datePipe = new DatePipe("en-US");
  value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
  return value;
}

transformpay(value: string) {
  var datePipe = new DatePipe("en-US");
  value = datePipe.transform(this.reportPrintObj.PaymentDate, 'dd/MM/yyyy');
  return value;
}
getPrint(el) {
  // debugger;
  var D_data = {
    "AdvanceDetailID": el,
  }
  console.log(D_data);
  let printContents;
  this.subscriptionArr.push(
    this._IpSearchListService.getAdvanceBrowsePrint(D_data).subscribe(res => {
      this.reportPrintObj = res[0] as IpdAdvanceBrowseModel;
      console.log(this.reportPrintObj);
      this.getTemplate();


    })
  );
}


  

viewgetAdvanceReceiptReportPdf(AdvanceDetailID) {
    
  this._IpSearchListService.getViewAdvanceReceipt(
    AdvanceDetailID
    ).subscribe(res => {
    const dialogRef = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Advance Viewer"
        }
      });
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

  if(this.reportPrintObj.CashPayAmount === 0) {
    popupWin.document.getElementById('idCashpay').style.display = 'none';
  }
  if(this.reportPrintObj.CardPayAmount === 0) {
    popupWin.document.getElementById('idCardpay').style.display = 'none';
  }
  if(this.reportPrintObj.ChequePayAmount === 0) {
    popupWin.document.getElementById('idChequepay').style.display = 'none';
  }
  if(this.reportPrintObj.NEFTPayAmount === 0) {
    popupWin.document.getElementById('idNeftpay').style.display = 'none';
  }
  if(this.reportPrintObj.PayTMAmount === 0) {
    popupWin.document.getElementById('idPaytmpay').style.display = 'none';
  }
  
  if(this.reportPrintObj.reason=== '') {
    popupWin.document.getElementById('idremark').style.display = 'none';
  }
  popupWin.document.close();
}
AdvSummaryPrint(){}

// AdvSummaryPrint(){
//     // debugger
//   var D_data = {
//     // "From_Dt" : "01/01/1900",//this.datePipe.transform(this._advanceService.myFilterform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
//     // "To_Dt" :"01/01/1900",// this.datePipe.transform(this._advanceService.myFilterform.get("end").value,"MM-dd-yyyy") || "01/01/1900",
//     "Reg_No": 26,//this.selectedAdvanceObj.RegNo || 0,
//     "PBillNo": '%'//this.selectedAdvanceObj.BillNo || '%'
//   }
//   console.log(D_data);
//   let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
//   this.subscriptionArr.push(
//     this._IpSearchListService.getIpdAdvanceSummaryPrint(D_data).subscribe(res => {
    
//       this.reportPrintsummaryObjList = res as ReportPrintObj[];
//       this.reportPrintsummaryObj = res[0] as ReportPrintObj;

//       console.log(this.reportPrintsummaryObj);
//       this.getTemplateadvsummary();


//     })
//   );
// }





// getTemplateadvsummary() {
//   // debugger
// let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=33';
// this._IpSearchListService.getTemplate(query).subscribe((resData: any) => {

// this.printTemplate = resData[0].TempDesign;
// let keysArray = ['HospitalName', 'HospitalAddress', 'Phone', 'EmailId', 'AdvanceNo', 'RegNo', 'Date', 'PatientName', 'AgeDay', 'AgeMonth', 'Age', 'IPDNo', 'AdmissionDate', 'PatientType','AdvanceNo', 'AdvanceAmount','PaymentTime','UsedAmount','BalanceAmount', 'reason', 'Addedby',
// 'CardNo', 'CardPayAmount', 'CardDate', 'CardBankName', 'BankName', 'ChequeNo', 'ChequePayAmount', 'ChequeDate', 'CashPayAmount', 'TariffName']; // resData[0].TempKeys;
// for (let i = 0; i < keysArray.length; i++) {
//   let reString = "{{" + keysArray[i] + "}}";
//   let re = new RegExp(reString, "g");
//   this.printTemplate = this.printTemplate.replace(re, this.reportPrintsummaryObj[keysArray[i]]);
// }
// var strrowslist = "";
// for (let i = 1; i <= this.reportPrintsummaryObjList.length; i++) {
//   var objreportPrint = this.reportPrintsummaryObjList[i - 1];
//   console.log(objreportPrint);
//   // var strabc = ` <hr >

//   var strabc = ` 
//      <div style="display:flex;margin:8px 0">
//          <div style="display:flex;width:60px;margin-left:20px;">
//              <div>`+ i + `</div> 
//          </div>
//          <div style="display:flex;width:100px;">
//              <div>`+ objreportPrint.AdvanceNo + `</div> 
//          </div>
//          <div style="display:flex;width:200px;">
//              <div>`+ objreportPrint.PaymentTime + `</div> 
//          </div>
//          <div style="display:flex;width:200px;justify-content: center;">
//          <div>`+ objreportPrint.AdvanceAmount + `</div>
//          </div>
//          <div style="display:flex;width:200px;justify-content: center;">
//          <div>`+ '₹' + objreportPrint.UsedAmount + `</div> 
//          </div>
//          <div style="display:flex;width:200px;justify-content: center;">
//              <div>`+ objreportPrint.BalanceAmount + `</div> 
//          </div>
//       </div>`;
//   strrowslist += strabc;
// }
// var objPrintWordInfo = this.reportPrintsummaryObjList[0];
// console.log(strrowslist);
// this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(this.TotalAdvamt));
// //  this.printTemplate = this.printTemplate.replace('StrBillDates', this.transformdraft2(objPrintWordInfo.BillDate));
// //  this.printTemplate = this.printTemplate.replace('StrBillDate', this.transformdraft(objPrintWordInfo.BillDate));
// //  this.printTemplate = this.printTemplate.replace('StrAdmissionDate', this.transformdraft1(objPrintWordInfo.AdmissionDate));
// //  this.printTemplate = this.printTemplate.replace('StrDischargeDate', this.transformdraft1(objPrintWordInfo.DischargeDate));
//  this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
// //  this.printTemplate = this.printTemplate.replace('StrTotalBillAmt', '₹' + (objPrintWordInfo.TotalBillAmt.toFixed(2)));
// //  this.printTemplate = this.printTemplate.replace('StrNetPayableAmt', '₹' + (objPrintWordInfo.NetPayableAmt.toFixed(2)));
// //  this.printTemplate = this.printTemplate.replace('StrConcessionAmount', '₹' + (objPrintWordInfo.ConcessionAmt.toFixed(2)));
//  this.printTemplate = this.printTemplate.replace('StrAdvanceAmount', '₹' + (this.TotalAdvamt.toFixed(2)));
// //  this.printTemplate = this.printTemplate.replace('StrBalanceAmount', '₹' + (parseInt(this.BalanceAmt).toFixed(2)));


// this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);

// this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
// setTimeout(() => {
//   this.print();
// }, 1000);
// });
// }


transform2(value: string) {
  var datePipe = new DatePipe("en-US");
  value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
  return value;
}



onClose() {
  this.dialogRef.close();
}
  

}

export class patientinfo {
  Date: Date;
  OPD_IPD_Id: number;
  NetPayAmount: number;
  AdvanceId: number;

  constructor(patientinfo) {
    this.Date = patientinfo.Date || 0;
    this.OPD_IPD_Id = patientinfo.OPD_IPD_Id || 0;
    this.NetPayAmount = patientinfo.NetPayAmount || 0;
    this.AdvanceId = patientinfo.AdvanceId || 0;
  }
}
export class AdvanceHeader {
  AdvanceId: number;
  AdvanceAmount: number;
  Date: Date;
  RefId: number;
  OPD_IPD_Type: any;
  OPD_IPD_Id: number;
  AdvanceUsedAmount: number;
  BalanceAmount: number;
  AddedBy: any;
  IsCancelled: boolean;
  IsCancelledBy: any;
  IsCancelledDate: Date;

  constructor(AdvanceHeaderObj) {
    this.AdvanceId = AdvanceHeaderObj.AdvanceId || '0';
    this.Date = AdvanceHeaderObj.Date || '0';
    this.RefId = AdvanceHeaderObj.RefId || '0';
    this.OPD_IPD_Type = AdvanceHeaderObj.OPD_IPD_Type || '';
    this.OPD_IPD_Id = AdvanceHeaderObj.OPD_IPD_Id || '0';
    this.AdvanceAmount = AdvanceHeaderObj.AdvanceAmount || '0';
    this.AdvanceUsedAmount = AdvanceHeaderObj.AdvanceUsedAmount || '0';
    this.BalanceAmount = AdvanceHeaderObj.BalanceAmount || '0';
    this.AddedBy = AdvanceHeaderObj.AddedBy || '';
    this.IsCancelled = AdvanceHeaderObj.IsCancelled || false;
    this.IsCancelledBy = AdvanceHeaderObj.IsCancelledBy || '';
    this.IsCancelledDate = AdvanceHeaderObj.IsCancelledDate || '';
  }

}
export class AdvanceHeaderUpdate {
  AdvanceId: number;
  AdvanceAmount: number;

  constructor(AdvanceHeaderObj) {
    this.AdvanceId = AdvanceHeaderObj.AdvanceId || '0';
    this.AdvanceAmount = AdvanceHeaderObj.AdvanceAmount || '0';
  }

}
export class AdvanceDetails {
  AdvanceDetailID: number;
  Date: any;
  Time: any;
  AdvanceId: number;
  RefId: number;
  TransactionID: number;
  OPD_IPD_Type: any;
  OPD_IPD_Id: number;
  AdvanceAmount: number;
  UsedAmount: any;
  BalanceAmount: number;
  RefundAmount: any;
  ReasonOfAdvanceId: any;
  AddedBy: any;
  IsCancelled: boolean;
  IsCancelledBy: any;
  IsCancelledDate: Date;
  Reason: any;
  CashCounterId:any;

  constructor(AdvanceDetailsObj) {
    this.AdvanceDetailID = AdvanceDetailsObj.AdvanceDetailID || '0';
    this.Date = AdvanceDetailsObj.Date;
    this.Time = AdvanceDetailsObj.Time;
    this.AdvanceId = AdvanceDetailsObj.AdvanceId;
    this.RefId = AdvanceDetailsObj.RefId;
    this.TransactionID = AdvanceDetailsObj.TransactionID || '0';
    this.OPD_IPD_Type = AdvanceDetailsObj.OPD_IPD_Type || 1;
    this.OPD_IPD_Id = AdvanceDetailsObj.OPD_IPD_Id || '0';
    this.AdvanceAmount = AdvanceDetailsObj.AdvanceAmount || '0';
    this.UsedAmount = AdvanceDetailsObj.UsedAmount || '0';
    this.BalanceAmount = AdvanceDetailsObj.BalanceAmount || '0';
    this.RefundAmount = AdvanceDetailsObj.RefundAmount || '0';
    this.ReasonOfAdvanceId = AdvanceDetailsObj.ReasonOfAdvanceId || '0';
    this.Reason = AdvanceDetailsObj.Reason || '';
    this.AddedBy = AdvanceDetailsObj.AddedBy || 0;
    this.IsCancelled = AdvanceDetailsObj.IsCancelled || false;
    this.IsCancelledBy = AdvanceDetailsObj.IsCancelledBy || 0;
    this.IsCancelledDate = AdvanceDetailsObj.IsCancelledDate || '01/01/1900';
    this.CashCounterId = AdvanceDetailsObj.CashCounterId || 0;
  }

}