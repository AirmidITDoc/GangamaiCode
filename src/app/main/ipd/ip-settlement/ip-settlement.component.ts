import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdvanceDetailObj } from '../ip-search-list/ip-search-list.component';
import { Subscription } from 'rxjs';
import { IpBillBrowseList, ReportPrintObj } from '../ip-bill-browse-list/ip-bill-browse-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from '../advance';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { IPSearchListService } from '../ip-search-list/ip-search-list.service';
import { IpPaymentInsert } from '../ip-search-list/ip-advance-payment/ip-advance-payment.component';
import { BrowseOpdPaymentReceipt } from 'app/main/opd/browse-payment-list/browse-payment-list.component';
import { IPSettlementViewComponent } from './ipsettlement-view/ipsettlement-view.component';

@Component({
  selector: 'app-ip-settlement',
  templateUrl: './ip-settlement.component.html',
  styleUrls: ['./ip-settlement.component.scss']
})
export class IPSettlementComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  sIsLoading: string = '';
  selectedAdvanceObj: AdvanceDetailObj;
  regId:any;
  screenFromString = 'OP-billing';
  reportPrintObj: ReportPrintObj;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  reportPrintObjList: IpBillBrowseList[] = [];
  currentDate = new Date();
  FinalAmt:any;
  balanceamt: any;
  reportPrintbillObj: ReportPrintObj;
  reportPrintbillObjList: ReportPrintObj[] = [];


  dataSource = new MatTableDataSource<PaidBilldetail>();
  displayedColumns: string[] = [
    'BillNo',
    'TotalAmt',
    'ConcessionAmt',
    'NetPayableAmt',
    'PaidAmount',
    'BalanceAmt',
    'BillDate',
    'action',

  ];

  dataSource1 = new MatTableDataSource<CreditBilldetail>();
  @ViewChild(MatPaginator) PathTestpaginator: MatPaginator;
  paymentFormGroup: FormGroup;
  displayedColumns1: string[] = [
    'BillNo',
    'TotalAmt',
    'ConcessionAmt',
    'NetPayableAmt',
    'PaidAmount',
    'BalanceAmt',
    'BillDate',
    'action',
   
  ];

  hasSelectedContacts: boolean;
  constructor(public _IpSearchListService: IPSearchListService,
    private accountService: AuthenticationService,
    // public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<IPSettlementComponent>,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    
debugger;
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      this.regId = this.selectedAdvanceObj.RegId;
     
    }
    this.getPaidBillDetails();
    this.getCreditBillDetails();

  }

  createForm() {
    this.paymentFormGroup = this.formBuilder.group({
    
      IsCompany: [0]

      });
    }


  getPaidBillDetails() {
debugger
    this.sIsLoading = 'loading-data';
  
    let query ="Select * from lvwBillIPD  where RegID=" + this.regId + " and BalanceAmt=0";
   console.log(query);
    this._IpSearchListService.getPaidBillList(query).subscribe(Visit => {
     this.dataSource.data = Visit as PaidBilldetail[];
     this.dataSource.sort =this.sort;
    this.dataSource.paginator=this.paginator;
    console.log(this.dataSource.data);
   this.sIsLoading = '';
      
  },
  error => {
    this.sIsLoading = '';
  });

  }


  getCreditBillDetails(){
    debugger
    this.sIsLoading = 'loading-data';
  
    let query = "Select * from lvwBillIPD  where TransactionType =0 and companyid = 0 and RegID= " + this.regId + " and BalanceAmt>0";
    console.log(query);
    this._IpSearchListService.getCreditBillList(query).subscribe(Visit => {
     this.dataSource1.data = Visit as CreditBilldetail[];
     this.dataSource1.sort =this.sort;
    this.dataSource1.paginator=this.paginator;
   //  console.log(this.dataSource.data);
   this.sIsLoading = '';
      
  },
  error => {
    this.sIsLoading = '';
  });
  }

  getCompanyCreditBillDetails(event){
    debugger
    this.dataSource1.data =[];
    this.sIsLoading = 'loading-data';
  if(event == true){
    let query = "Select * from lvwBill where companyid != 0  and BalanceAmt>0";
    console.log(query);
    this._IpSearchListService.getCreditBillList(query).subscribe(Visit => {
     this.dataSource1.data = Visit as CreditBilldetail[];
     this.dataSource1.sort =this.sort;
    this.dataSource1.paginator=this.paginator;
   //  console.log(this.dataSource.data);
   this.sIsLoading = '';
      
  },
  error => {
    this.sIsLoading = '';
  });
}
  }
  
  addpayment(contact) {
    debugger;
   console.log(contact);
    this.FinalAmt = contact.NetPayableAmt;
   
    let PatientHeaderObj = {};

    PatientHeaderObj['Date'] = this.dateTimeObj.date;
    PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
    PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
    PatientHeaderObj['NetPayAmount'] = this.FinalAmt; //this.netPaybleAmt1; //this.registeredForm.get('FinalAmt').value;//this.TotalnetPaybleAmt,//this.FinalAmt || 0,//

    const dialogRef = this._matDialog.open(IppaymentWithAdvanceComponent,
      {
        maxWidth: "85vw",
        height: '540px',
        width: '100%',
        data: {
          advanceObj: PatientHeaderObj,
          FromName: "IP-Payment"
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      let BillUpdateObj = {};

      BillUpdateObj['BillNo'] = contact.BillNo;
      BillUpdateObj['BillBalAmount'] = result.BalAmt;

        console.log("Procced with Payment Option");
        let UpdateAdvanceDetailarr1: IpPaymentInsert[] = [];


        UpdateAdvanceDetailarr1 = result.submitDataAdvancePay;
        console.log(UpdateAdvanceDetailarr1);
        debugger
        // new
      

        let UpdateAdvanceDetailarr = [];
        if (result.submitDataAdvancePay > 0) {
          result.submitDataAdvancePay.forEach((element) => {
            let UpdateAdvanceDetailObj = {};
            UpdateAdvanceDetailObj['AdvanceDetailID'] = element.AdvanceDetailID;
            UpdateAdvanceDetailObj['UsedAmount'] = element.UsedAmount;
            UpdateAdvanceDetailObj['BalanceAmount'] = element.BalanceAmount;
            UpdateAdvanceDetailarr.push(UpdateAdvanceDetailObj);
          });
          
        }
        else {
          let UpdateAdvanceDetailObj = {};
          UpdateAdvanceDetailObj['AdvanceDetailID'] = 0,
            UpdateAdvanceDetailObj['UsedAmount'] = 0,
            UpdateAdvanceDetailObj['BalanceAmount'] = 0,
            UpdateAdvanceDetailarr.push(UpdateAdvanceDetailObj);
        }

        let UpdateAdvanceHeaderObj = {};
        if (result.submitDataAdvancePay > 0) {
          UpdateAdvanceHeaderObj['AdvanceId'] = UpdateAdvanceDetailarr1[0]['AdvanceNo'],
            UpdateAdvanceHeaderObj['AdvanceUsedAmount'] = UpdateAdvanceDetailarr1[0]['AdvanceAmount'],
            UpdateAdvanceHeaderObj['BalanceAmount'] = UpdateAdvanceDetailarr1[0]['BalanceAmount']
        }
        else {

          UpdateAdvanceHeaderObj['AdvanceId'] = 0,
            UpdateAdvanceHeaderObj['AdvanceUsedAmount'] = 0,
            UpdateAdvanceHeaderObj['BalanceAmount'] = 0
        }
        let submitData = {
          "ipPaymentCreditUpdate": result.submitDataPay.ipPaymentInsert,
           "updateIpBill": BillUpdateObj,
           "iPsettlementAdvanceDetailUpdate": UpdateAdvanceDetailarr,
           "iPsettlementAdvanceHeaderUpdate": UpdateAdvanceHeaderObj
          
        };
         console.log(submitData);
        this._IpSearchListService.InsertIPSettlementPayment(submitData).subscribe(response => {
          if (response) {
            Swal.fire('Payment Done  !', 'Ip Settlemet Done Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                let m = response;
                // this.getPrint(m);
                this._matDialog.closeAll();
              }
            });
          } else {
            Swal.fire('Error !', 'IP Settlement data not saved', 'error');
          }
         
        });
     
    });
  }

  // getTemplate() {
  //   let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=2';
  //   this._IpSearchListService.getTemplate(query).subscribe((resData: any) => {

  //     this.printTemplate = resData[0].TempDesign;
  //     let keysArray = ['HospitalName', 'HospitalAddress', 'Phone', 'PhoneNo', 'RegNo', 'BillNo', 'PBillNo', 'PatientName', 'BillDate', 'VisitDate', 'ConsultantDocName', 'DepartmentName', 'ServiceName', 'ChargesDoctorName', 'Price', 'Qty', 'ChargesTotalAmount', 'TotalBillAmount', 'NetPayableAmt', 'NetAmount', 'ConcessionAmt', 'PaidAmount', 'BalanceAmt', 'AddedByName']; // resData[0].TempKeys;

  //     for (let i = 0; i < keysArray.length; i++) {
  //       let reString = "{{" + keysArray[i] + "}}";
  //       let re = new RegExp(reString, "g");
  //       this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
  //     }
  //     var strrowslist = "";
  //     for (let i = 1; i <= this.reportPrintObjList.length; i++) {
  //       var objreportPrint = this.reportPrintObjList[i - 1];

  //       console.log(objreportPrint);
  //       // Chargedocname
  //       let docname;
  //       if (objreportPrint.ChargesDoctorName)
  //         docname = objreportPrint.ChargesDoctorName;
  //       else
  //         docname = '';


  //       var strabc = `<hr style="border-color:white" >
  //       <div style="display:flex;margin:8px 0">
  //       <div style="display:flex;width:60px;margin-left:20px;">
  //           <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
  //       </div>
  //       <div style="display:flex;width:370px;margin-left:10px;text-align:left;">
  //           <div>`+ objreportPrint.ServiceName + `</div> <!-- <div>BLOOD UREA</div> -->
  //       </div>
  //       <div style="display:flex;width:370px;margin-left:30px;text-align:left;">
  //       <div>`+ docname + `</div> <!-- <div>BLOOD UREA</div> -->
  //       </div>
  //       <div style="display:flex;width:90px;margin-left:40px;text-align:right;">
  //           <div>`+ '₹' + objreportPrint.Price.toFixed(2) + `</div> <!-- <div>450</div> -->
  //       </div>
  //       <div style="display:flex;width:60px;margin-left:40px;text-align:right;">
  //           <div>`+ objreportPrint.Qty + `</div> <!-- <div>1</div> -->
  //       </div>
  //       <div style="display:flex;width:140px;margin-left:45px;text-align:left;">
  //           <div>`+ '₹' + objreportPrint.NetAmount.toFixed(2) + `</div> <!-- <div>450</div> -->
  //       </div>
  //       </div>`;
  //       strrowslist += strabc;
  //     }
  //     var objPrintWordInfo = this.reportPrintObjList[0];

  //     this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.PaidAmount));

  //     this.printTemplate = this.printTemplate.replace('StrBalanceAmt', '₹' + (objPrintWordInfo.BalanceAmt.toFixed(2)));
  //     this.printTemplate = this.printTemplate.replace('StrTotalBillAmount', '₹' + (objPrintWordInfo.TotalBillAmount.toFixed(2)));
  //     this.printTemplate = this.printTemplate.replace('StrConcessionAmt', '₹' + (objPrintWordInfo.ConcessionAmt.toFixed(2)));
  //     this.printTemplate = this.printTemplate.replace('StrNetPayableAmt', '₹' + (objPrintWordInfo.NetPayableAmt.toFixed(2)));
  //     this.printTemplate = this.printTemplate.replace('StrPaidAmount', '₹' + (objPrintWordInfo.PaidAmount.toFixed(2)));
  //     // this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(objPrintWordInfo.BillDate));
  //     this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
  //     // this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform1(objPrintWordInfo.BillDate));
  //     this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);
  //     this.printTemplate = this.printTemplate.replace('StrBillDate', this.transformBilld(this.reportPrintObj.BillDate));
  //     this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
  //     setTimeout(() => {
  //       this.print();
  //     }, 1000);
  //   });
  // }


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
  // transformBilld(value: string) {
  //   var datePipe = new DatePipe("en-US");
  //   value = datePipe.transform(this.reportPrintObj.BillDate, 'dd/MM/yyyy');
  //   return value;
  // }

  transformpay(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(this.reportPrintObj.PaymentDate, 'dd/MM/yyyy');
    return value;
  }
  convertToWord(e) {
    // this.numberInWords= converter.toWords(this.mynumber);
    // return converter.toWords(e);
  }
  
  getPrint(el) {
    debugger;
    // if (el.InterimOrFinal == 0) {
      var D_data = {
        "BillNo":  el.BillNo,
      }
      el.bgColor = 'red';

      let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
      this.subscriptionArr.push(
        this._IpSearchListService.getIPBILLBrowsePrint(D_data).subscribe(res => {
          console.log(res);
          this.reportPrintbillObjList = res as ReportPrintObj[];
          this.reportPrintbillObj = res[0] as ReportPrintObj;

          console.log(this.reportPrintbillObj);
          // this.getTemplate();
          // console.log(res);

        })
      );
    // }
    // else {

    //   this.getIPIntreimBillPrint(el);
    // }
  }

  // getTemplate() {
  //   let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=2';
  //   this._IpSearchListService.getTemplate(query).subscribe((resData: any) => {

  //     this.printTemplate = resData[0].TempDesign;
  //     let keysArray = ['HospitalName', 'HospitalAddress', 'Phone', 'PhoneNo', 'RegNo', 'BillNo', 'PBillNo', 'PatientName', 'BillDate', 'VisitDate', 'ConsultantDocName', 'DepartmentName', 'ServiceName', 'ChargesDoctorName', 'Price', 'Qty', 'ChargesTotalAmount', 'TotalBillAmount', 'NetPayableAmt', 'NetAmount', 'ConcessionAmt', 'PaidAmount', 'BalanceAmt', 'AddedByName']; // resData[0].TempKeys;

  //     for (let i = 0; i < keysArray.length; i++) {
  //       let reString = "{{" + keysArray[i] + "}}";
  //       let re = new RegExp(reString, "g");
  //       this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
  //     }
  //     var strrowslist = "";
  //     for (let i = 1; i <= this.reportPrintObjList.length; i++) {
  //       var objreportPrint = this.reportPrintObjList[i - 1];

  //       console.log(objreportPrint);
     
  //       var strabc = `<hr style="border-color:white" >
  //       <div style="display:flex;margin:8px 0">
  //       <div style="display:flex;width:60px;margin-left:20px;">
  //           <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
  //       </div>
  //       <div style="display:flex;width:370px;margin-left:10px;text-align:left;">
  //           <div>`+ objreportPrint.ServiceName + `</div> <!-- <div>BLOOD UREA</div> -->
  //       </div>
  //       <div style="display:flex;width:370px;margin-left:30px;text-align:left;">
  //       <div>`+ docname + `</div> <!-- <div>BLOOD UREA</div> -->
  //       </div>
  //       <div style="display:flex;width:90px;margin-left:40px;text-align:right;">
  //           <div>`+ '₹' + objreportPrint.Price.toFixed(2) + `</div> <!-- <div>450</div> -->
  //       </div>
  //       <div style="display:flex;width:60px;margin-left:40px;text-align:right;">
  //           <div>`+ objreportPrint.Qty + `</div> <!-- <div>1</div> -->
  //       </div>
  //       <div style="display:flex;width:140px;margin-left:45px;text-align:left;">
  //           <div>`+ '₹' + objreportPrint.NetAmount.toFixed(2) + `</div> <!-- <div>450</div> -->
  //       </div>
  //       </div>`;
  //       strrowslist += strabc;
  //     }
  //     var objPrintWordInfo = this.reportPrintObjList[0];

  //     this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.PaidAmount));

  //     this.printTemplate = this.printTemplate.replace('StrBalanceAmt', '₹' + (objPrintWordInfo.BalanceAmt.toFixed(2)));
  //     this.printTemplate = this.printTemplate.replace('StrTotalBillAmount', '₹' + (objPrintWordInfo.TotalBillAmount.toFixed(2)));
  //     this.printTemplate = this.printTemplate.replace('StrPaidAmount', '₹' + (objPrintWordInfo.PaidAmount.toFixed(2)));
  //     // this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(objPrintWordInfo.BillDate));
  //     this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
  //     // this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform1(objPrintWordInfo.BillDate));
  //   //  this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);
  //     this.printTemplate = this.printTemplate.replace('StrBillDate', this.transformBilld(this.reportPrintObj.BillDate));
  //     this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
  //     setTimeout(() => {
  //       this.print();
  //     }, 1000);
  //   });
  // }
  // GET DATA FROM DATABASE 
  getPrintreceipt(el) {

    var D_data = {
      // "PaymentId": el.PaymentId,
      "PaymentId": 728974
    }
    el.bgColor = 'red';
    //console.log(el);
    let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
    this.subscriptionArr.push(
      this._IpSearchListService.getIPsettlementPrint(D_data).subscribe(res => {
        this.reportPrintObj = res[0] as ReportPrintObj;
        this.getSettlementTemplate();
        console.log(this.reportPrintObj.PaidAmount);

      })
    );
  }

  getSettlementTemplate() {
    let query = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=6';
    this._IpSearchListService.getTemplate(query).subscribe((resData: any) => {
       this.printTemplate = resData[0].TempDesign;
       let keysArray= ["HospitalName","HospAddress","PaymentId","ReceiptNo","RegNo","IPDNo","PBillNo","BillDate","PaymentDate","PaidAmount","CashPayAmount","PatientName","AgeDay","AgeMonth","AgeYear","CashPayAmount","Remark","UserName"];
      // let keysArray = ['HospitalName','HospitalAddress','PBillNo','RegNo','Date','PatientName','Age','IPDNo','AdmissionDate','PatientType','PaidAmount','reason','Addedby']; // resData[0].TempKeys;
      for (let i = 0; i < keysArray.length; i++) {
          let reString = "{{" + keysArray[i] + "}}";
          let re = new RegExp(reString, "g");
          this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
        }

        this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
        this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform(this.reportPrintObj.BillDate));
        this.printTemplate = this.printTemplate.replace('StrPaymentAmount','₹' + (this.reportPrintObj.PaidAmount.toFixed(2)));
        this.printTemplate = this.printTemplate.replace('StrPaymentDate', this.transform(this.reportPrintObj.PaymentDate));
        this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(this.reportPrintObj.PaidAmount));
        this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
        
        // console.log(this.printTemplate);


        setTimeout(() => {
          this.print();
        }, 1000);
    });
  }

  // PRINT 
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
      AddedBy: 1,
      AdvBalanceAmount: contact.AdvBalanceAmount,
      AdvanceAmount:contact.AdvanceAmount,
      AdvanceUsedAmount:contact.AdvanceUsedAmount,
      BalanceAmt:contact.BalanceAmt,
      BillDate:contact.BillDate,
      BillNo:contact.BillNo,
      BillTime: contact.BillTime,
      CashCounterId:contact.CashCounterId,
      CompanyId:contact.CompanyId,
      ConcessionAmt:contact.ConcessionAmt,
      IsCancelled:contact.IsCancelled,
      NetPayableAmt:contact.NetPayableAmt,
      OPD_IPD_ID: contact.OPD_IPD_ID,
      OPD_IPD_Type: contact.OPD_IPD_Type,
      PBillNo: contact.PBillNo,
      PaidAmount: contact.PaidAmount,
      PaymentBillNo:contact.PaymentBillNo,
      RegID:contact.RegID,
      RegNo: contact.RegNo,
      TotalAmt:contact.TotalAmt,
      TransactionType:contact.TransactionType,
   
     
    };

    this.advanceDataStored.storage = new BrowseOpdPaymentReceipt(xx);
   
    //   const dialogRef = this._matDialog.open(PaymentViewComponent, 
    //    {  maxWidth: "95vw",
    //       maxHeight: "130vh", width: '100%', height: "100%"
    //  });
    //  dialogRef.afterClosed().subscribe(result => {
    //   //  console.log('The dialog was closed - Insert Action', result);
    //   //  this.getRadiologytemplateMasterList();
    //  });
  }

  getViewbill1(contact)
{
  console.log(contact);
    let xx = {
      AddedBy: 1,
      AdvBalanceAmount: contact.AdvBalanceAmount,
      AdvanceAmount:contact.AdvanceAmount,
      AdvanceUsedAmount:contact.AdvanceUsedAmount,
      BalanceAmt:contact.BalanceAmt,
      BillDate:contact.BillDate,
      BillNo:contact.BillNo,
      BillTime: contact.BillTime,
      CashCounterId:contact.CashCounterId,
      CompanyId:contact.CompanyId,
      ConcessionAmt:contact.ConcessionAmt,
      IsCancelled:contact.IsCancelled,
      NetPayableAmt:contact.NetPayableAmt,
      OPD_IPD_ID: contact.OPD_IPD_ID,
      OPD_IPD_Type: contact.OPD_IPD_Type,
      PBillNo: contact.PBillNo,
      PaidAmount: contact.PaidAmount,
      PaymentBillNo:contact.PaymentBillNo,
      RegID:contact.RegID,
      RegNo: contact.RegNo,
      TotalAmt:contact.TotalAmt,
      TransactionType:contact.TransactionType,
   
     
    };

    this.advanceDataStored.storage = new BrowseOpdPaymentReceipt(xx);
   
      const dialogRef = this._matDialog.open(IPSettlementViewComponent, 
       {  maxWidth: "95vw",
          maxHeight: "130vh", width: '100%', height: "100%"
     });
     dialogRef.afterClosed().subscribe(result => {
      //  console.log('The dialog was closed - Insert Action', result);
      //  this.getRadiologytemplateMasterList();
     });
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  onClose() {
    this.dialogRef.close();
  }

}



export class PaidBilldetail {
  
  BillNo: any;
  TotalAmt: number;
  ConcessionAmt: number;
  NetPayableAmt: number;
  PaidAmount: number;
  BalanceAmt: number;
  BillDate: Date;

  constructor(PaidBilldetail) {
    this.BillDate = PaidBilldetail.BillDate || '';
    this.BillNo = PaidBilldetail.BillNo || '';
    this.TotalAmt = PaidBilldetail.TotalAmt || 0;
    this.ConcessionAmt = PaidBilldetail.ConcessionAmt || '';
    this.NetPayableAmt = PaidBilldetail.NetPayableAmt || 0;
    this.PaidAmount = PaidBilldetail.PaidAmount || 0;
    this.BalanceAmt = PaidBilldetail.BalanceAmt || '';
  
  }
}

export class CreditBilldetail {
  
  BillNo: any;
  TotalAmt: number;
  ConcessionAmt: number;
  NetPayableAmt: number;
  PaidAmount: number;
  BalanceAmt: number;
  BillDate: Date;

  constructor(CreditBilldetail) {
    this.BillDate = CreditBilldetail.BillDate || '';
    this.BillNo = CreditBilldetail.BillNo || '';
    this.TotalAmt = CreditBilldetail.TotalAmt || 0;
    this.ConcessionAmt = CreditBilldetail.ConcessionAmt || '';
    this.NetPayableAmt = CreditBilldetail.NetPayableAmt || 0;
    this.PaidAmount = CreditBilldetail.PaidAmount || 0;
    this.BalanceAmt = CreditBilldetail.BalanceAmt || '';
  
  }

}
