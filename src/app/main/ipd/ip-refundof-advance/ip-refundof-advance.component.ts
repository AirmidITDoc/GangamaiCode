import { Component, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs'; 
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'; 
import Swal from 'sweetalert2'; 
import { fuseAnimations } from '@fuse/animations';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component'; 
import { AuthenticationService } from 'app/core/services/authentication.service';
import { OPAdvancePaymentComponent } from 'app/main/opd/op-search-list/op-advance-payment/op-advance-payment.component'; 
import { ToastrService } from 'ngx-toastr';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { RegInsert } from '../Admission/admission/admission.component';
import { IPSearchListService } from '../ip-search-list/ip-search-list.service';
import { AdvanceDataStored } from '../advance';
import { AdvanceDetailObj } from '../ip-search-list/ip-search-list.component';
import { element } from 'protractor';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { map, startWith } from 'rxjs/operators';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';

@Component({
  selector: 'app-ip-refundof-advance',
  templateUrl: './ip-refundof-advance.component.html',
  styleUrls: ['./ip-refundof-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPRefundofAdvanceComponent implements OnInit {
  displayedColumns = [
    'Date',
    'AdvanceAmount',
    'UsedAmount',
    'BalanceAmount',
    'RefundAmt',
    'PreRefundAmt'  
  ];
  displayedColumns1 = [
    'RefundDate', 
    'RefundAmount', 
  ];
 
  
  screenFromString = 'advance';
  RefundOfAdvanceFormGroup: FormGroup;
  dateTimeObj: any;   
  isLoadingStr: string = ''; 
  vOPIPId: any;
  vRegId: any;
  Age:any;
  vMobileNo:any;
  currentDate = new Date(); 
  searchFormGroup: FormGroup;
  CompanyName: any;
  Tarrifname: any;
  Doctorname: any; 
  vOPDNo: any = 0;
  vTariffId: any = 0;
  vClassId: any = 0;
  RegNo: any = 0;
  PatientName: any = "";
  RegId: any = 0; 
  registerObj:any;
  DepartmentName:any;
  AgeMonth:any;
  AgeDay:any;
  GenderName:any;
  RefDocName:any;
  RoomName:any;
  BedName:any;
  PatientType:any;
  DOA:any;
  IPDNo:any; 
  AdvanceId: any; 
  UsedAmount: number = 0;
  BalanceAdvance: number = 0; 
 
  autocompleteModeCashcounter: string = "CashCounter";
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dsrefundlist = new MatTableDataSource<IPRefundofAdvance>(); 
  dataSource1 = new MatTableDataSource<IPRefundofAdvance>(); 
  

  constructor(public _IpSearchListService: IPSearchListService,
    public _matDialog: MatDialog, 
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialogRef: MatDialogRef<IPRefundofAdvanceComponent>,
    private accountService: AuthenticationService,
     private commonService: PrintserviceService,
    private advanceDataStored: AdvanceDataStored,
    public toastr: ToastrService, 
    public _WhatsAppEmailService:WhatsAppEmailService, 
    private formBuilder: UntypedFormBuilder,) 
    {} 

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();
    this.RefundOfAdvanceFormGroup = this.createRefAdvForm();  

    if(this.data){
    this.registerObj = this.data
    console.log(this.registerObj)
    this.getRefundofAdvanceListRegIdwise();
    }
  }

  createSearchForm() {
    return this.formBuilder.group({
      RegId: [''],
      CashCounterID:['8']
    });
  } 
  createRefAdvForm() {
    return this.formBuilder.group({
      BalanceAdvance: [0], 
      NewRefundAmount: [0,Validators.required],
      Remark: [''],
      CashCounterID:['8']
    });
  } 
 
  getValidationMessages() {
    return {
      serviceName: [
        { name: "required", Message: "Service Name is required" },
      ],
      cashCounterId: [
        { name: "required", Message: "First Name is required" },
  
        { name: "pattern", Message: "only Number allowed." }
      ], 
      NewRefundAmount: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ], 
      BalanceAdvance: [{ name: "pattern", Message: "only Number allowed." }],  
    }
  }
    //new code 
    getSelectedObj(obj) {
      console.log(obj)
      this.PatientName = obj.PatientName;
         this.RegId = obj.value; 
         if ((this.RegId ?? 0) > 0) {
            // console.log(this.data)
             setTimeout(() => {
                 this._IpSearchListService.getRegistraionById(this.RegId).subscribe((response) => {
                     //this.registerObj = response;
                     this.PatientName = this.registerObj.firstName + " " + this.registerObj.middleName + " " + this.registerObj.lastName

                     console.log(this.registerObj)
                 });
  
             }, 500);
         }
  
     }
 
  getSelectedObj1(obj) {
    console.log(obj) 
    this.registerObj = obj; 
    this.vClassId = obj.classId 
    this.Age=obj.Age; 
    this.vRegId =obj.RegId;
    this.vOPIPId = obj.AdmissionID;
    this.PatientName =obj.FirstName + " " + obj.LastName;
    this.Doctorname = obj.DoctorName;
    this.Tarrifname= obj.TariffName;
    this.Age= obj.AgeYear
    this.AgeMonth = obj.AgeMonth
    this.AgeDay = obj.AgeDay
    this.CompanyName=  obj.CompanyName;
    this.RegNo= obj.RegNo;
    this.GenderName = obj.GenderName
    this.RefDocName = obj.RefDocName
    this.vMobileNo=obj.MobileNo
    this.DepartmentName  = obj.DepartmentName
    this.RoomName = obj.RoomName
    this.BedName =obj.BedName
    this.PatientType = obj.PatientType
    this.DOA = obj.DOA 
    this.IPDNo = obj.IPDNo 
    //this.getPreviousRefList(obj);
    this.getRefundofAdvanceListRegIdwise();
  } 

  getRefundofAdvanceListRegIdwise() {
    
    var m_data = { 
        "first": 0,
        "rows": 10,
        "sortField": "AdvanceId",
        "sortOrder": 0,
        "filters": [
          {
            "fieldName": "RegID",
            "fieldValue": String(this.registerObj.regId),
            "opType": "Equals"
          }
        ],
        "exportType": "JSON" 
    }
    console.log(m_data) 
    this._IpSearchListService.getRefundofAdvanceList(m_data).subscribe(response => {
      console.log(response)
      this.dsrefundlist.data = response.data 
      this.chargeList = this.dsrefundlist.data
      console.log(this.dsrefundlist.data)
      this.dsrefundlist.sort = this.sort;
      this.dsrefundlist.paginator = this.paginator;
      this.isLoadingStr = this.dsrefundlist.data.length == 0 ? 'no-data' : ''; 
      this.getRefundSum(); 
    });
  } 
  RefundAmt: any;
  chargeList:any=[];
  //Refund Amount calculation
  getCellCalculation(element, RefundAmt) {  
    console.log(element) 
      if(RefundAmt > 0 && RefundAmt <= element.netBallAmt){
        element.balanceAmount = ((element.netBallAmt) - (RefundAmt));
      }
      else if (parseInt(RefundAmt) > parseInt(element.netBallAmt)){
        this.toastr.warning('Enter Refund Amount Less than Balance Amount ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        element.refundAmt = ''
        element.balanceAmount = element.netBallAmt ;
      }
      else if(RefundAmt == 0 || RefundAmt == '' || RefundAmt == undefined || RefundAmt == null){
        element.refundAmt = ''
        element.balanceAmount = element.netBallAmt ;
      } 

      this.AdvanceId = element.advanceId
      this.UsedAmount += element.usedAmount
      this.BalanceAdvance += element.balanceAmount 

      this.getRefundSum();
  } 
  getRefundSum() {   
    let totalRefAmt = this.chargeList.reduce((sum, { refundAmt }) => sum += +(refundAmt || 0), 0);
    let totalBalAmt = this.chargeList.reduce((sum, { balanceAmount }) => sum += +(balanceAmount || 0), 0);
 
    this.RefundOfAdvanceFormGroup.patchValue({
      NewRefundAmount: totalRefAmt,
      BalanceAdvance: totalBalAmt 
    }) 
  } 
  onSave() {
        const currentDate = new Date();
        const datePipe = new DatePipe('en-US');
        const formattedTime = datePipe.transform(currentDate, 'shortTime');
        const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');  
        const formValue = this.RefundOfAdvanceFormGroup.value;

    if(formValue.NewRefundAmount == '' || formValue.NewRefundAmount == 0 || formValue.NewRefundAmount == null || formValue.NewRefundAmount == undefined){
      this.toastr.warning('Enter a Refund Amount', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    
    let IPRefundofAdvanceObj = {};
    IPRefundofAdvanceObj['refundDate'] = formattedDate;
    IPRefundofAdvanceObj['refundTime'] = formattedTime;
    IPRefundofAdvanceObj['billId'] =  0;
    IPRefundofAdvanceObj['advanceId'] = this.AdvanceId;
    IPRefundofAdvanceObj['opdipdType'] = true;
    IPRefundofAdvanceObj['opdipdid'] = this.registerObj.admissionId || 0, 
    IPRefundofAdvanceObj['refundAmount'] = this.RefundOfAdvanceFormGroup.get('NewRefundAmount').value || 0; 
    IPRefundofAdvanceObj['remark'] = this.RefundOfAdvanceFormGroup.get("Remark").value;
    IPRefundofAdvanceObj['transactionId'] = 2;
    IPRefundofAdvanceObj['addedBy'] = this.accountService.currentUserValue.userId,
    IPRefundofAdvanceObj['isCancelled'] = false;
    IPRefundofAdvanceObj['isCancelledBy'] = 0;
    IPRefundofAdvanceObj['isCancelledDate'] = '1900-01-01';
    IPRefundofAdvanceObj['refundId'] = 0;
 
    let advanceHeaderupdate = {};
    advanceHeaderupdate['advanceId'] = this.AdvanceId;
    advanceHeaderupdate['advanceUsedAmount'] = this.UsedAmount;
    advanceHeaderupdate['balanceAmount'] = this.BalanceAdvance;
   
    let advDetailRefundObj = [];
    this.dsrefundlist.data.forEach((element) =>{
      let advDetailRefund = {};  
      advDetailRefund['advDetailId'] = element.advanceDetailID || 0;
      advDetailRefund['refundDate'] = formattedDate;
      advDetailRefund['refundTime'] = formattedTime;
      advDetailRefund['advRefundAmt'] =element.refundAmt || 0;
      advDetailRefundObj.push(advDetailRefund)
    }); 
 
    let adveDetailupdateObj = [];
    this.dsrefundlist.data.forEach((element) =>{
      let adveDetailupdate = {}; 
      adveDetailupdate['advanceDetailID'] = element.advanceDetailID || 0;
      adveDetailupdate['balanceAmount'] = element.balanceAmount || 0;
      adveDetailupdate['refundAmount'] = element.refundAmt || 0;
      adveDetailupdateObj.push(adveDetailupdate)
    });  

      let PatientHeaderObj = {};   
      PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '1900-01-01',
      PatientHeaderObj['PatientName'] = this.registerObj.patientName;
      PatientHeaderObj['RegNo'] = this.registerObj.regNo,
      PatientHeaderObj['DoctorName'] = this.registerObj.doctorname;
      PatientHeaderObj['CompanyName'] = this.registerObj.companyName;
      PatientHeaderObj['DepartmentName'] = this.registerObj.departmentName;
      PatientHeaderObj['OPD_IPD_Id'] = this.registerObj.ipdno;
      PatientHeaderObj['Age'] = this.registerObj.ageYear;
      PatientHeaderObj['NetPayAmount'] = this.RefundOfAdvanceFormGroup.get('NewRefundAmount').value || 0; 
  
    const dialogRef = this._matDialog.open(OpPaymentComponent,
      {
        maxWidth: "80vw",
        height: '650px',
        width: '80%',
        data: {
          vPatientHeaderObj: PatientHeaderObj,
          FromName: "IP-RefundOfAdvance",
          advanceObj: PatientHeaderObj,
        }
      }); 
    dialogRef.afterClosed().subscribe(result => {
      if (result.IsSubmitFlag) {
        console.log('============================== Return RefAdv ===========');
        let submitData = {
          "refund": IPRefundofAdvanceObj,
          "advanceHeaderupdate": advanceHeaderupdate,
          "advDetailRefund": advDetailRefundObj,
          "adveDetailupdate":adveDetailupdateObj,
          "payment": result.submitDataPay.ipPaymentInsert
        }; 
        console.log(submitData); 
        this._IpSearchListService.insertIPRefundOfAdvance(submitData).subscribe(response => { 
          console.log(response)
          this.toastr.success(response.message);
          this.viewgetRefundofAdvanceReportPdf(response);
          this.getWhatsappsRefundAdvance(response, this.vMobileNo);
          this.onClose()
          this._matDialog.closeAll();
        }, (error) => {
          this.toastr.error(error.message);
        });
      }
    });  
}
  onClose(){
    this._IpSearchListService.myRefundAdvanceForm.reset(); 
    this.dsrefundlist.data = []
    this._matDialog.closeAll();
  }
  sIsLoading: string = '';
  viewgetRefundofAdvanceReportPdf(RefundId) {
    this.commonService.Onprint("RefundId",RefundId,"IpAdvanceRefundReceipt");
  } 
  getWhatsappsRefundAdvance(el, vmono) { 
    var m_data = {
      "insertWhatsappsmsInfo": {
        "mobileNumber": vmono || 0,
        "smsString": '',
        "isSent": 0,
        "smsType": 'IPREFADVANCE',
        "smsFlag": 0,
        "smsDate": this.currentDate,
        "tranNo": el,
        "PatientType": 2,//el.PatientType,
        "templateId": 0,
        "smSurl": "info@gmail.com",
        "filePath": '',
        "smsOutGoingID": 0
      }
    }
    this._WhatsAppEmailService.InsertWhatsappSales(m_data).subscribe(response => {
      if (response) {
        this.toastr.success('IP Refund Of Advance Receipt Sent on WhatsApp Successfully.', 'Save !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
      } else {
        this.toastr.error('API Error!', 'Error WhatsApp!', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    });
  } 
  getPreviousRefList(row) { 
    // console.log(row); 
    // this.BalanceAdvance = 0;
    // this.RefundAmount = 0;
    // this.UsedAmount = row.UsedAmount;
    // this.advId = row.AdvanceId;
    // this.advDetailId = row.AdvanceDetailID;
    // this.BalanceAmount = row.BalanceAmount; 
    // //this.NewRefundAmount = 0;
    // console.log(row);
    // let Query = "select RefundDate,RefundAmount from refund where AdvanceId=" + row.AdvanceId
    
    // this._IpSearchListService.getPreRefundofAdvance(Query).subscribe(Visit => {
    //   this.dataSource1.data =  Visit as IPRefundofAdvance[]; 
    // });  
  }
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  keyPressCharater(event){
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  } 
}

export class IPRefundofAdvance {
  RefundDate: Date;
  RefundTime: any;
  BillId: number;
  advanceId: number;
  OPD_IPD_Type: number;
  OPD_IPD_ID: number;
  usedAmount: number;
  balanceAmount: number;
  RefundAmount: number;
  Remark: string;
  TransactionId: number;
  AddedBy: number;
  IsCancelled: boolean;
  IsCancelledBy: number;
  IsCancelledDate: Date;
  RefundId: number;
  Date: any;
  refundAmount:any;
  advanceDetailID:any; 
  refundAmt:any;


  constructor(IPRefundofAdvanceObj) {

    this.RefundDate = IPRefundofAdvanceObj.RefundDate || '0';
    this.RefundTime = IPRefundofAdvanceObj.RefundTime || '0';
    this.BillId = IPRefundofAdvanceObj.BillId || 0;
    this.advanceId = IPRefundofAdvanceObj.advanceId || '0';
    this.OPD_IPD_Type = IPRefundofAdvanceObj.OPD_IPD_Type || '0';
    this.OPD_IPD_ID = IPRefundofAdvanceObj.OPD_IPD_ID || '0';
    this.usedAmount = IPRefundofAdvanceObj.usedAmount || '0';
    this.balanceAmount = IPRefundofAdvanceObj.balanceAmount || '0';
    this.RefundAmount = IPRefundofAdvanceObj.RefundAmount || '0';
    this.Remark = IPRefundofAdvanceObj.Remark || '';
    this.TransactionId = IPRefundofAdvanceObj.TransactionId || 0;
    this.AddedBy = IPRefundofAdvanceObj.AddedBy || 0;
    this.IsCancelled = IPRefundofAdvanceObj.IsCancelled || false;
    this.IsCancelledBy = IPRefundofAdvanceObj.IsCancelledBy || 0;
    this.IsCancelledDate = IPRefundofAdvanceObj.IsCancelledDate || '';
    this.RefundId = IPRefundofAdvanceObj.RefundId || '0';
    this.Date = IPRefundofAdvanceObj.Date || ''; 
    this.refundAmount = IPRefundofAdvanceObj.refundAmount || 0;
    this.advanceDetailID = IPRefundofAdvanceObj.advanceDetailID || '0';
    this.refundAmt = IPRefundofAdvanceObj.refundAmt || '0';
  }

}

export class AdvanceHeader {

  AdvanceId: number;
  BalanceAmount: number;

  constructor(UpdateAdvanceHeaderObj) {

    this.AdvanceId = UpdateAdvanceHeaderObj.AdvanceId || 0;
    this.BalanceAmount = UpdateAdvanceHeaderObj.BalanceAmount || 0;
  }

}

export class IPRefundofAdvanceDetail {

  AdvRefId: number;
  AdvDetailId: number;
  RefundDate: Date;
  RefundTime: any;
  AdvRefundAmt: number;
  

  constructor(InsertIPRefundofAdvanceDetailObj) {

    this.AdvRefId = InsertIPRefundofAdvanceDetailObj.AdvRefId || 0;
    this.AdvDetailId = InsertIPRefundofAdvanceDetailObj.AdvDetailId || 0;
    this.RefundDate = InsertIPRefundofAdvanceDetailObj.RefundDate || '';
    this.RefundTime = InsertIPRefundofAdvanceDetailObj.RefundTime || '';
    this.AdvRefundAmt = InsertIPRefundofAdvanceDetailObj.AdvRefundAmt || 0;

  }

}

export class AdvanceDetailBalAmount {

  AdvanceDetailID: number;
  RefundAmount: number;
  BalanceAmount: number;

  constructor(UpdateAdvanceDetailBalAmountObj) {

    this.AdvanceDetailID = UpdateAdvanceDetailBalAmountObj.AdvanceDetailID || 0;
    this.BalanceAmount = UpdateAdvanceDetailBalAmountObj.BalanceAmount || 0;
    this.RefundAmount = UpdateAdvanceDetailBalAmountObj.RefundAmount || 0; 
  } 
} 
export class BrowseIpdreturnadvanceReceipt {
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
  GenderName: string;
  Remark: string;
  PaymentDate: any;
  CashPayAmount: number;
  ChequePayAmount: number;
  CardPayAmount: number;
  AdvanceUsedAmount: number;
  AdvanceId: number;
  RefundId: number;
  IsCancelled: boolean;
  AddBy: number;
  UserName: string;
  PBillNo: string;
  ReceiptNo: string;
  TransactionType: number;
  PayDate: Date;
  PaidAmount: number;
  NEFTPayAmount: number;
  PayTMAmount: number;
  AddedBy: string;
  HospitalName: string;
  RefundAmount: number;
  RefundNo: number;
  HospitalAddress: string;
  Phone: any;
  EmailId: any;
  Age: number;
  AgeYear: number;
  IPDNo: any;
  NetPayableAmt: any;
  RefundDate: any;
AdvanceAmount: any;
BalanceAmount: any;
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
      this.HospitalName = BrowseIpdreturnadvanceReceipt.HospitalName;
      this.RefundAmount = BrowseIpdreturnadvanceReceipt.RefundAmount || '';
      this.RefundNo = BrowseIpdreturnadvanceReceipt.RefundNo || '';
      this.GenderName = BrowseIpdreturnadvanceReceipt.GenderName || '';
      this.AddedBy = BrowseIpdreturnadvanceReceipt.AddedBy || '';
      this.HospitalAddress = BrowseIpdreturnadvanceReceipt.HospitalAddress || '';
      this.AgeYear = BrowseIpdreturnadvanceReceipt.AgeYear || ''
      this.IPDNo = BrowseIpdreturnadvanceReceipt.IPDNo || '';
      this.Phone = BrowseIpdreturnadvanceReceipt.Phone || ''
      this.EmailId = BrowseIpdreturnadvanceReceipt.EmailId || '';

      this.NetPayableAmt = BrowseIpdreturnadvanceReceipt.NetPayableAmt || 0;
      this.RefundDate = BrowseIpdreturnadvanceReceipt.RefundDate || '';
      this.AdvanceAmount = BrowseIpdreturnadvanceReceipt.AdvanceAmount || 0;
      this.BalanceAmount = BrowseIpdreturnadvanceReceipt.BalanceAmount || 0;
    }

  }
}