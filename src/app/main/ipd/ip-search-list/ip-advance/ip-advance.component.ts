import { Component, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportPrintObj } from '../../ip-bill-browse-list/ip-bill-browse-list.component';
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
TotalAdvamt:any;
Advavilableamt:any;
  
  reportPrintObj: ReportPrintObj;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  
  constructor(public _IpSearchListService: IPSearchListService,
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
      comment: ['']
    });

    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj);
    }

    let AdmissionId = this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value
    this.getAdvanceList();
  }

  getAdvanceList() {
    debugger;
    this.sIsLoading = 'loading-data';
    var m_data = {
      "AdmissionID": this.selectedAdvanceObj.AdmissionID// this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value || 0,
    }
    // this.isLoadingStr = 'loading';
    console.log(m_data);


    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this._IpSearchListService.getAdvanceList(m_data).subscribe(Visit => {
        this.dataSource.data = Visit as AdvanceDetail[];

        console.log(this.dataSource.data);
        this.dataSource.sort= this.sort;
        this.dataSource.paginator=this.paginator;
        this.sIsLoading = ' ';
     
      },
        error => {
          this.sIsLoading = '';
        });
    }, 500);
  
  }

  getAdvancetotal(element) {
    // debugger;

    // console.log(element);
    let netAmt;
    netAmt = element.reduce((sum, { AdvanceAmount }) => sum += +(AdvanceAmount || 0), 0);
    // this.totalAmtOfNetAmt = netAmt;
    this.TotalAdvamt = netAmt;

    
// Advavilableamt:any;
    return netAmt;
  }

  getAdvavilable(element) {
    // debugger;
    let netAmt;
    netAmt = element.reduce((sum, { BalanceAmount }) => sum += +(BalanceAmount || 0), 0);
    // this.totalAmtOfNetAmt = netAmt;
    this.Advavilableamt = netAmt;
    return netAmt;
  }

  getDateTime(dateTimeObj) {
    
    this.dateTimeObj = dateTimeObj;
  }

  onSave() {
debugger;
    if(this.advanceAmount!=0){
      
    this.isLoading = 'submit';
    let advanceHeaderObj = {};
    advanceHeaderObj['AdvanceID'] = '0';
    advanceHeaderObj['Date'] = this.dateTimeObj.date;
    advanceHeaderObj['RefId'] =  this.selectedAdvanceObj.RegId,//this._IpSearchListService.myShowAdvanceForm.get("RegId").value || 0,
    advanceHeaderObj['OPD_IPD_Type'] = 1;
    advanceHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
    advanceHeaderObj['AdvanceAmount'] = this.advanceAmount;
    advanceHeaderObj['AdvanceUsedAmount'] = 0;
    advanceHeaderObj['BalanceAmount'] = this.advanceAmount;
    advanceHeaderObj['AddedBy'] =  this.accountService.currentUserValue.user.id ;
    advanceHeaderObj['IsCancelled'] = false;
    advanceHeaderObj['IsCancelledBy'] = '0';
    advanceHeaderObj['IsCancelledDate'] = '01/01/1900';

    let AdvanceDetObj = {};
    AdvanceDetObj['AdvanceDetailID'] ='0';
    AdvanceDetObj['Date'] = this.dateTimeObj.date;
    AdvanceDetObj['Time'] = this.dateTimeObj.time;
    AdvanceDetObj['AdvanceId'] = 0;
    AdvanceDetObj['RefId'] = this.selectedAdvanceObj.RegId,//this._IpSearchListService.myShowAdvanceForm.get("RegId").value || 0,
    AdvanceDetObj['OPD_IPD_Type'] = 1;
    AdvanceDetObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
    AdvanceDetObj['AdvanceAmount'] = this.advanceAmount;
    AdvanceDetObj['AdvanceUsedAmount'] = 0;
    AdvanceDetObj['BalanceAmount'] =  this.advanceAmount;
    AdvanceDetObj['RefundAmount'] = 0;
    AdvanceDetObj['ReasonOfAdvanceId'] = 0;
    AdvanceDetObj['AddedBy'] =  this.accountService.currentUserValue.user.id ;
    AdvanceDetObj['IsCancelled'] = false;
    AdvanceDetObj['IsCancelledBy'] = 0;
    AdvanceDetObj['IsCancelledDate'] = '01/01/1900';
    AdvanceDetObj['Reason'] = this.AdvFormGroup.get("comment").value;
    AdvanceDetObj['CashCounterId'] = 0;//
    let PatientHeaderObj = {};

    PatientHeaderObj['Date'] = this.dateTimeObj.date;
    PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
    PatientHeaderObj['PatientName'] =  this.selectedAdvanceObj.PatientName;
    PatientHeaderObj['NetPayAmount'] =  this.advanceAmount;
    // PatientHeaderObj['AdvanceId'] =  this.advanceAmount;


    const advanceHeaderInsert = new AdvanceHeader(advanceHeaderObj);
    const advanceDetailInsert = new AdvanceDetails(AdvanceDetObj);

    
    const dialogRef = this._matDialog.open(IPAdvancePaymentComponent,
      {
        maxWidth: "85vw",
        height: '540px',
        width: '100%',
        data: {
          patientName: this._IpSearchListService.myShowAdvanceForm.get("PatientName").value,
          advanceObj: PatientHeaderObj,
          FromName: "Advance"
        }
      });
    dialogRef.afterClosed().subscribe(result => {
          console.log('==============================  Advance Amount ===========');
          let submitData = {
            "advanceHeaderInsert": advanceHeaderInsert,
            "advanceDetailInsert": advanceDetailInsert,
            "ipPaymentInsert": result.submitDataPay.ipPaymentInsert
          };
        console.log(submitData);
          this._IpSearchListService.InsertAdvanceHeader(submitData).subscribe(response => {
            debugger
            if (response) {
              Swal.fire('Congratulations !', 'IP Advance data saved Successfully !', 'success').then((result) => {
                if (result.isConfirmed) {
                  // this.getAdvanceList();
                   console.log(response);
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
//   }
//   else{

//     this.isLoading = 'submit';
   
//     let AdvanceDetObj = {};
//     AdvanceDetObj['AdvanceDetailID'] ='0';
//     AdvanceDetObj['Date'] = this.dateTimeObj.date;
//     AdvanceDetObj['Time'] = this.dateTimeObj.time;
//     AdvanceDetObj['AdvanceId'] = this.dataSource.data[0]['AdvanceId'];
//     AdvanceDetObj['RefId'] = this.selectedAdvanceObj.RegId;
//     AdvanceDetObj['OPD_IPD_Type'] = 1;
//     AdvanceDetObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
//     AdvanceDetObj['AdvanceAmount'] = this.advanceAmount;
//     AdvanceDetObj['AdvanceUsedAmount'] = 0;
//     AdvanceDetObj['BalanceAmount'] =  this.advanceAmount;
//     AdvanceDetObj['RefundAmount'] = 0;
//     AdvanceDetObj['ReasonOfAdvanceId'] = 0;
//     AdvanceDetObj['AddedBy'] =  this.accountService.currentUserValue.user.id ;
//     AdvanceDetObj['IsCancelled'] = false;
//     AdvanceDetObj['IsCancelledBy'] = 0;
//     AdvanceDetObj['IsCancelledDate'] = '01/01/1900';
//     AdvanceDetObj['Reason'] = this.AdvFormGroup.get("comment").value;

// debugger;
//     let advanceHeaderObj = {};
//     advanceHeaderObj['AdvanceId'] = parseInt(this.dataSource.data[0]['AdvanceId'].toString());
//     advanceHeaderObj['AdvanceAmount'] = parseInt(this.advanceAmount.toString());
    
//     let PatientHeaderObj = {};

//     PatientHeaderObj['Date'] = this.dateTimeObj.date;
//     PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
//     PatientHeaderObj['PatientName'] =  this.selectedAdvanceObj.PatientName;
//     PatientHeaderObj['NetPayAmount'] =  this.advanceAmount;
//     // PatientHeaderObj['AdvanceId'] =  this.advanceAmount;


//     const advanceHeaderUpdate = new AdvanceHeaderUpdate(advanceHeaderObj);
//     const advanceDetailInsert = new AdvanceDetails(AdvanceDetObj);

    
//     const dialogRef = this._matDialog.open(IpAdvancePaymentComponent,
//       {
//         maxWidth: "85vw",
//         height: '540px',
//         width: '100%',
//         data: {
//           patientName: this._IpSearchListService.myShowAdvanceForm.get("PatientName").value,
//           advanceObj: PatientHeaderObj,
//           FromName: "Advance"
//         }
//       });
//     dialogRef.afterClosed().subscribe(result => {
//           console.log('==============================  Advance Amount ===========');
//           let submitData = {
//             "advanceHeaderUpdate": advanceHeaderUpdate,
//             "advanceDetailInsert1": advanceDetailInsert,
//             "ipPaymentInsert1": result.submitDataPay.ipPaymentInsert
//           };
//         console.log(submitData);
//           this._IpSearchListService.InsertAdvanceHeaderUpdate(submitData).subscribe(response => {
//             debugger;
//             if (response) {
//               Swal.fire('Congratulations !', 'IP Advance data Updated Successfully !', 'success').then((result) => {
//                 if (result.isConfirmed) {
//                   this.getAdvanceList();
//                   this._matDialog.closeAll();
//                   console.log(response);
                
//                   this.getPrint(response);
//                 }
//               });
//             } else {
//               Swal.fire('Error !', 'IP Advance data not Updated', 'error');
//             }
//             this.isLoading = '';
//           });
        
//     });
//   }
    this.AdvFormGroup.get('advanceAmt').reset(0);
    this.AdvFormGroup.get('comment').reset('');
  }
  }

  
 convertToWord(e){
    // this.numberInWords= converter.toWords(this.mynumber);
    //  return converter.toWords(e);
       }

  getTemplate() {
    let query = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=1';
    this._IpSearchListService.getTemplate(query).subscribe((resData: any) => {
       this.printTemplate = resData[0].TempDesign;
      // let keysArray = ['HospitalName','HospAddress','AdvanceNo','RegNo','Date','PatientName','AgeDay','AgeMonth','Age','TariffName','CompanyName','IPDNo','AdmissionDate','PatientType','AdvanceAmount','reason','Addedby']; // resData[0].TempKeys;
      let keysArray = ['HospitalName','HospAddress','Phone','EmailId','AdvanceNo','RegNo','Date','PatientName','AgeDay','AgeMonth','Age','IPDNo','AdmissionDate','PatientType','AdvanceAmount','reason','Addedby',
      'CardNo','CardPayAmount','CardDate','CardBankName','BankName','ChequeNo','ChequePayAmount','ChequeDate','CashPayAmount','TariffName']; // resData[0].TempKeys;
      for (let i = 0; i < keysArray.length; i++) {
          let reString = "{{" + keysArray[i] + "}}";
          let re = new RegExp(reString, "g");
          this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
        }
        // this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(this.reportPrintObj.AdvanceAmount));
        // this.printTemplate = this.printTemplate.replace('StrAdvanceAmount','₹' + (this.reportPrintObj.AdvanceAmount.toFixed(2)));
        // this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform1(this.reportPrintObj.Date));
        // this.printTemplate = this.printTemplate.replace('StrAdmissionDate', this.transform(this.reportPrintObj.AdmissionDate));
        // this.printTemplate = this.printTemplate.replace('StrPaymentDate', this.transform(this.reportPrintObj.PaymentDate));
       
        this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(this.reportPrintObj.AdvanceAmount));
        // this.printTemplate = this.printTemplate.replace('StrAdvanceAmount','₹' + (this.reportPrintObj.AdvanceAmount.toFixed(2)));
        this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform1(this.reportPrintObj.Date));
        // this.printTemplate = this.printTemplate.replace('StrDate', this.transform(this.reportPrintObj.Date));
        // this.printTemplate = this.printTemplate.replace('StrAdmissionDate', this.transform(this.reportPrintObj.AdmissionDate));
        // this.printTemplate = this.printTemplate.replace('StrPaymentDate', this.transformpay(this.reportPrintObj.PaymentDate));
       
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
  value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
  return value;
}

transformpay(value: string) {
  var datePipe = new DatePipe("en-US");
  value = datePipe.transform(this.reportPrintObj.PaymentDate, 'dd/MM/yyyy');
  return value;
}
  getPrint(el) {
    debugger;
    var D_data = {
      "AdvanceDetailID": el,
    }
    console.log(D_data);
    let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
    this.subscriptionArr.push(
      this._IpSearchListService.getAdvanceBrowsePrint(D_data).subscribe(res => {
        this.reportPrintObj = res[0] as ReportPrintObj;
        console.log(this.reportPrintObj);
        this.getTemplate();
     
        
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

  onClose() {
    this.dialogRef.close();
  }
  

}

export class patientinfo{
  Date:Date;
  OPD_IPD_Id:number;
  NetPayAmount:number;
  AdvanceId:number;

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

  constructor(AdvanceDetailsObj) {
    this.AdvanceDetailID = AdvanceDetailsObj.AdvanceDetailID || '0';
    this.Date = AdvanceDetailsObj.Date;
    this.Time = AdvanceDetailsObj.Time;
    this.AdvanceId= AdvanceDetailsObj.AdvanceId;
    this.RefId= AdvanceDetailsObj.RefId;
    this.TransactionID = AdvanceDetailsObj.TransactionID || '0';
    this.OPD_IPD_Type = AdvanceDetailsObj.OPD_IPD_Type || 1;
    this.OPD_IPD_Id = AdvanceDetailsObj.OPD_IPD_Id || '0';
    this.AdvanceAmount = AdvanceDetailsObj.AdvanceAmount || '0';
    this.UsedAmount = AdvanceDetailsObj.UsedAmount|| '0';
    this.RefundAmount = AdvanceDetailsObj.RefundAmount || '0';
    this.ReasonOfAdvanceId = AdvanceDetailsObj.ReasonOfAdvanceId || '0';
    this.Reason = AdvanceDetailsObj.Reason || '';
    this.AddedBy = AdvanceDetailsObj.AddedBy || 0;
    this.IsCancelled = AdvanceDetailsObj.IsCancelled || false;
    this.IsCancelledBy = AdvanceDetailsObj.IsCancelledBy || 0;
    this.IsCancelledDate = AdvanceDetailsObj.IsCancelledDate || '01/01/1900';

  }

}