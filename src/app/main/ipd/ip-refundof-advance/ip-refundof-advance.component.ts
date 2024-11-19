import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
// import { AdvanceDetailObj } from '../ip-search-list.component';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { AdvanceDataStored } from '../../advance';
// import { IPSearchListService } from '../ip-search-list.service';
import Swal from 'sweetalert2';
// import { IPAdvancePaymentComponent } from '../ip-advance-payment/ip-advance-payment.component';
import { fuseAnimations } from '@fuse/animations';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
// import { RegInsert } from '../../Admission/admission/admission.component';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { OPAdvancePaymentComponent } from 'app/main/opd/op-search-list/op-advance-payment/op-advance-payment.component';
// import { IpAdvancePaymentInsert } from '../ip-paymentwith-advance/ip-paymentwith-advance.component';
import { ToastrService } from 'ngx-toastr';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { RegInsert } from '../Admission/admission/admission.component';
import { IPSearchListService } from '../ip-search-list/ip-search-list.service';
import { AdvanceDataStored } from '../advance';
import { AdvanceDetailObj } from '../ip-search-list/ip-search-list.component';
import { element } from 'protractor';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-ip-refundof-advance',
  templateUrl: './ip-refundof-advance.component.html',
  styleUrls: ['./ip-refundof-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPRefundofAdvanceComponent implements OnInit {

  icon_disable = false;
  screenFromString = 'refund-of-advance';
  RefundOfAdvanceFormGroup: FormGroup;
  dateTimeObj: any;
  BillNo: number;
  NetBillAmount: number;
  TotalRefundAmount: number;
  RefundBalAmount: number;
  BillDate: Date;
  RefundAmount: number;
  AdvanceAmount: number;
  UsedAmount: number;
  BalanceAdvance: number = 0;
  NewRefundAmount: number = 0;
  TotRefundAmount: number = 0;
  TotRefundAmt: number = 0;
  BalanceAmount: number = 0;
  Remark: string;
  isLoading: string = '';
  isLoadingStr: string = '';
  AdmissionId: number;
  advId: any;
  AdvanceId: any;
  pay_balance_Data: any;
  advDetailId: any;
  AdvanceDetailID: any;
  isCashCounterSelected:boolean=false;
  filteredOptionsCashCounter:Observable<string[]>;
  vOPIPId: any;
  vRegId: any;
  Age:any;
  vMobileNo:any;


  printTemplate: any;
  reportPrintObj: BrowseIpdreturnadvanceReceipt;
  subscriptionArr: Subscription[] = [];
  displayedColumns = [
    'Date',
    'AdvanceAmount',
    'UsedAmount',
    'BalanceAmount',
    'RefundAmt', 
    // 'action'
  ];
  dataSource = new MatTableDataSource<IPRefundofAdvance>();

  dsrefundlist = new MatTableDataSource<IPRefundofAdvance>();


  displayedColumns1 = [
    'RefundDate',
    // 'AdvanceAmount',
    // 'UsedAmount',
    // 'BalanceAmount',
    'RefundAmount',
    // 'AdvanceId'
    // // 'action'
  ];
  dataSource1 = new MatTableDataSource<IPRefundofAdvance>();


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;
  currentDate = new Date();
  selectedAdvanceObj: AdvanceDetailObj;
  searchFormGroup: FormGroup;
  City: any;
  CompanyName: any;
  Tarrifname: any;
  Doctorname: any;
  Paymentdata: any;
  // vOPIPId: any = 0;
  vOPDNo: any = 0;
  vTariffId: any = 0;
  vClassId: any = 0;
  RegNo: any = 0;
  PatientName: any = "";
  RegId: any = 0;
  noOptionFound: boolean = false;
  PatientListfilteredOptions: any;
  isRegIdSelected: boolean = false;
  registerObj = new RegInsert({});

  constructor(public _IpSearchListService: IPSearchListService,
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    private advanceDataStored: AdvanceDataStored,
    public toastr: ToastrService, 
    public _WhatsAppEmailService:WhatsAppEmailService,
    //private dialogRef: MatDialogRef<IPRefundofAdvanceComponent>,
    private formBuilder: FormBuilder) {
    // dialogRef.disableClose = true;
    
  }
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

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();
    this.RefundOfAdvanceFormGroup = this.formBuilder.group({
      advanceAmt: ['', [Validators.pattern('^[0-9]{2,8}$')]],
      UsedAmount: [''],
      TotalRefundAmount: [''],
      RefundAmount: [0, Validators.required],
      BalanceAmount: [''],// ['',Validators.required],
      BalanceAdvance: [0, Validators.required],
      AdvanceDetailID: [''],
      NewRefundAmount: ['0'],
      Remark: [''],
    });


    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj);
      this.vRegId =this.selectedAdvanceObj.RegID;
      this.vOPIPId = this.selectedAdvanceObj.AdmissionID;
      this.PatientName = this.selectedAdvanceObj.PatientName;
      this.Doctorname = this.selectedAdvanceObj.Doctorname
      this.Tarrifname= this.selectedAdvanceObj.TariffName
      this.Age= this.selectedAdvanceObj.AgeYear
      this.AgeMonth = this.selectedAdvanceObj.AgeMonth
      this.AgeDay = this.selectedAdvanceObj.AgeDay
      this.CompanyName= this.selectedAdvanceObj.CompanyName
      this.RegNo= this.selectedAdvanceObj.RegNo
      this.GenderName = this.selectedAdvanceObj.GenderName
      this.RefDocName = this.selectedAdvanceObj.RefDocName
      this.vMobileNo=this.selectedAdvanceObj.MobileNo
      this.DepartmentName  = this.selectedAdvanceObj.DepartmentName
      this.RoomName =  this.selectedAdvanceObj.RoomName
      this.BedName = this.selectedAdvanceObj.BedName
      this.PatientType = this.selectedAdvanceObj.PatientType
      this.DOA = this.selectedAdvanceObj.DOA 
      this.IPDNo = this.selectedAdvanceObj.IPDNo 
      //this.getRefundofAdvanceListRegIdwise();
    }
   
   // this.getRefundofAdvanceListRegIdwise();
    // this.getReturndetails();
    // this.getCashCounterComboList();
  }

  createSearchForm() {
    return this.formBuilder.group({
      RegId: [''],
      CashCounterID:['']
    });
  }


  getRefundtotSum1(element) {
    let netAmt1;
    netAmt1 = element.reduce((sum, { RefundAmount }) => sum += +(RefundAmount || 0), 0);
    this.TotRefundAmount = netAmt1;
    return netAmt1; 
  }

  getRefundSum(element) {
    let netAmt1;
    netAmt1 = element.reduce((sum, { AdvanceAmount }) => sum += +(AdvanceAmount || 0), 0);
    let netAmt2 = element.reduce((sum, { RefundAmt }) => sum += +(RefundAmt || 0), 0);
    let balAmt = element.reduce((sum, { BalanceAmount }) => sum += +(BalanceAmount || 0), 0);
    this.NewRefundAmount = netAmt2;
    this.BalanceAdvance = balAmt ;
    return netAmt1; 
  }


  // Patient Search;
  getSearchList() {

    var m_data = {
      "Keyword": `${this.searchFormGroup.get('RegId').value}%`
    }

    this._IpSearchListService.getPatientVisitedListSearch(m_data).subscribe(data => {
      this.PatientListfilteredOptions = data;
      console.log(this.PatientListfilteredOptions)
      if (this.PatientListfilteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });

  }

  getSelectedObj1(obj) {
    console.log(obj)
    this.dataSource.data = [];
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
    this.onEdit(obj);
    //this.getRefundofAdvanceListRegIdwise();
  }

  getOptionText1(option) {
    if (!option)
      return '';
    return option.FirstName + ' ' + option.MiddleName + ' ' + option.LastName;

  }

  getReturndetails() {
    // debugger
    // var m_data = {
    //   "AdmissionId": this.vOPIPId
    // }
    // this.isLoading = 'list-loading';
    // this._IpSearchListService.getAdvReturndetails(m_data).subscribe(data => {
    //   this.dataSource1.data = data as IPRefundofAdvance[];
    //   console.log(this.dataSource1.data);
    // });
  }

  getRefundofAdvanceListRegIdwise() {
    var m_data = {
      "RegID":this.vRegId
    }
    console.log(m_data)
    //this.isLoadingStr = 'loading';
    // this._IpSearchListService.getRefundofAdvanceList(m_data).subscribe(data => {
    //   this.dsrefundlist.data = data as IPRefundofAdvance[];
    //   console.log(this.dsrefundlist.data)
    //   this.dsrefundlist.sort = this.sort;
    //   this.dsrefundlist.paginator = this.paginator;
    //   this.isLoadingStr = this.dsrefundlist.data.length == 0 ? 'no-data' : '';
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

  RefundAmt: any;
  getCellCalculation(element, RefundAmt) { 

      if(RefundAmt > 0 && RefundAmt <= element.NetBallAmt){
        element.BalanceAmount = ((element.NetBallAmt) - (RefundAmt));
      }
      else if (parseInt(RefundAmt) > parseInt(element.NetBallAmt)){
        this.toastr.warning('Enter Refund Amount Less than Balance Amount ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        element.RefundAmt = ''
        element.BalanceAmount = element.NetBallAmt ;
      }
      else if(RefundAmt == 0 || RefundAmt == '' || RefundAmt == undefined || RefundAmt == null){
        element.RefundAmt = ''
        element.BalanceAmount = element.NetBallAmt ;
      }

  }


  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  populateForm2(employee) {
    this.RefundOfAdvanceFormGroup.patchValue(employee);

  }

 
 
  onEdit(row) {

    console.log(row);

    this.BalanceAdvance = 0;
    this.RefundAmount = 0;
    this.UsedAmount = row.UsedAmount;
    this.advId = row.AdvanceId;
    this.advDetailId = row.AdvanceDetailID;
    this.BalanceAmount = row.BalanceAmount;
    
    //this.NewRefundAmount = 0;
    console.log(row);
    let Query = "select RefundDate,RefundAmount from refund where AdvanceId=" + row.AdvanceId
    
    this._IpSearchListService.getPreRefundofAdvance(Query).subscribe(Visit => {
      this.dataSource1.data =  Visit as IPRefundofAdvance[]; 
    }); 
 
    // if (row.BalanceAmount == 0) {
    //   this.icon_disable = true;
    // }
    // else {
    //   this.icon_disable = false;
    //   var m_data = { "AdvanceDetailID": row.AdvanceDetailID, "BalanceAmount": row.BalanceAmount, "AdvanceId": row.AdvanceId }
      

    //   console.log(m_data);
    //   this.advId = row.AdvanceId;
    //   this.advDetailId = row.AdvanceDetailID;
    // }

    // this.BalanceAmount = row.BalanceAmount;
    // this.BalanceAdvance = parseInt(row.BalanceAmount) - parseInt(row.RefundAmount);
    // this.RefundAmount = row.RefundAmount;


    // if (this.UsedAmount != 0) {
    //   this.BalanceAdvance = parseInt(row.RefundAmount) - parseInt(row.UsedAmount);
    // }

  }
  onSave() {
 
    this.isLoading = 'submit';

    let IPRefundofAdvanceObj = {};
    IPRefundofAdvanceObj['RefundDate'] = this.dateTimeObj.date;
    IPRefundofAdvanceObj['RefundTime'] = this.dateTimeObj.time;
    IPRefundofAdvanceObj['BillId'] = this.BillNo || 0;
    IPRefundofAdvanceObj['AdvanceId'] = this.advId;
    IPRefundofAdvanceObj['OPD_IPD_Type'] = 1;
    IPRefundofAdvanceObj['OPD_IPD_ID'] = this.vOPIPId,
      IPRefundofAdvanceObj['BalanceAmount'] = this.BalanceAdvance;
    IPRefundofAdvanceObj['UsedAmount'] = this.UsedAmount;
    IPRefundofAdvanceObj['RefundAmount'] = this.NewRefundAmount;
    IPRefundofAdvanceObj['Remark'] = this.RefundOfAdvanceFormGroup.get("Remark").value;
    IPRefundofAdvanceObj['TransactionId'] = 2;
    IPRefundofAdvanceObj['AddedBy'] = this.accountService.currentUserValue.user.id,
      IPRefundofAdvanceObj['IsCancelled'] = false;
    IPRefundofAdvanceObj['IsCancelledBy'] = 0;
    IPRefundofAdvanceObj['IsCancelledDate'] = '01/01/1900';
    IPRefundofAdvanceObj['RefundId'] = 0;


    let UpdateAdvanceHeaderObj = {};
    UpdateAdvanceHeaderObj['AdvanceId'] = this.advId;
    UpdateAdvanceHeaderObj['advanceUsedAmount'] = this.UsedAmount;
    UpdateAdvanceHeaderObj['BalanceAmount'] = this.BalanceAdvance;

    let InsertIPRefundofAdvanceDetail = [];
    this.dsrefundlist.data.forEach((element) =>{
      let InsertIPRefundofAdvanceDetailObj = {}; 
      InsertIPRefundofAdvanceDetailObj['AdvRefId'] =0;
      InsertIPRefundofAdvanceDetailObj['AdvDetailId'] = element.AdvanceId || 0;
      InsertIPRefundofAdvanceDetailObj['RefundDate'] = this.dateTimeObj.date;
      InsertIPRefundofAdvanceDetailObj['RefundTime'] = this.dateTimeObj.time;
      InsertIPRefundofAdvanceDetailObj['AdvRefundAmt'] =element.RefundAmt || 0;
      InsertIPRefundofAdvanceDetail.push(InsertIPRefundofAdvanceDetailObj)
    });

    let UpdateAdvanceDetailBalAmount = [];
    this.dsrefundlist.data.forEach((element) =>{
      let UpdateAdvanceDetailBalAmountObj = {}; 
      UpdateAdvanceDetailBalAmountObj['AdvanceDetailID'] = element.AdvanceDetailID || 0;
      UpdateAdvanceDetailBalAmountObj['RefundAmount'] = element.RefundAmt || 0;
      UpdateAdvanceDetailBalAmountObj['BalanceAmount'] = element.BalanceAmount || 0;
      UpdateAdvanceDetailBalAmount.push(UpdateAdvanceDetailBalAmountObj)
    });


    const IPRefundofAdvanceInsert = new IPRefundofAdvance(IPRefundofAdvanceObj);
    const advanceHeaderUpdate = new AdvanceHeader(UpdateAdvanceHeaderObj); 

    let PatientHeaderObj = {};

    // PatientHeaderObj['Date'] = this.dateTimeObj.date; 
    // PatientHeaderObj['NetPayAmount'] = this.NewRefundAmount;
    // PatientHeaderObj['PatientName'] = this.PatientName;
    // PatientHeaderObj['BillId'] = 0; 
    // PatientHeaderObj['IPDNo'] = this.vOPIPId
    // PatientHeaderObj['Doctorname'] = this.Doctorname;  
    // PatientHeaderObj['UHIDNO'] =  this.RegNo

    PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
    PatientHeaderObj['PatientName'] = this.PatientName;
    PatientHeaderObj['RegNo'] = this.RegNo;
    PatientHeaderObj['DoctorName'] = this.Doctorname;
    PatientHeaderObj['CompanyName'] = this.CompanyName;
    PatientHeaderObj['DepartmentName'] = this.DepartmentName;
    PatientHeaderObj['OPD_IPD_Id'] =  this.IPDNo;
    PatientHeaderObj['Age'] =  this.Age;
    PatientHeaderObj['NetPayAmount'] =  this.NewRefundAmount;

    // const dialogRef = this._matDialog.open(OPAdvancePaymentComponent,
    //   {
    //     maxWidth: "75vw",
    //     maxHeight: "93vh", width: '100%', height: "100%",
    //     data: {

    //       advanceObj: PatientHeaderObj,
    //       FromName: "Advance-Refund"
    //     }
    //   });
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
          "insertIPRefundofAdvance": IPRefundofAdvanceInsert,
          "updateAdvanceHeader": advanceHeaderUpdate,
          "insertIPRefundofAdvanceDetail": InsertIPRefundofAdvanceDetail,
          "updateAdvanceDetailBalAmount":UpdateAdvanceDetailBalAmount,
          "insertPayment": result.submitDataPay.ipPaymentInsert
        };

        console.log(submitData);
        this._IpSearchListService.insertIPRefundOfAdvance(submitData).subscribe(response => {
          console.log(response);
          if (response) {
            Swal.fire('Congratulations !', 'Refund Of Advance data saved Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this.getRefundofAdvanceListRegIdwise(); 
                this.viewgetRefundofAdvanceReportPdf(response);
                this.getWhatsappsRefundAdvance(response,this.vMobileNo)
                this._matDialog.closeAll();   
              }
            });
          } else {
            Swal.fire('Error !', 'Refund Of Advance data not saved', 'error');
          }
          this.isLoading = '';
        });
      }
    });

  }

  sIsLoading: string = '';
  viewgetRefundofAdvanceReportPdf(RefundId) {
    setTimeout(() => {
      // this.SpinLoading =true;
      this.sIsLoading = 'loading-data';
      //  this.AdList=true;
      this._IpSearchListService.getRefundofAdvanceview(
        RefundId
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
          this.sIsLoading = '';
          // this.SpinLoading = false;
        });

      });

    }, 100);
  }

  getWhatsappsRefundAdvance(el, vmono) {
    debugger
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
  onClose() {
    this._IpSearchListService.myRefundAdvanceForm.reset();

    this._matDialog.closeAll();
  }
  CashCounterList:any=[];
  getCashCounterComboList() {
    this._IpSearchListService.getCashcounterList().subscribe(data => {
      this.CashCounterList = data
      console.log(this.CashCounterList)
      this.searchFormGroup.get('CashCounterID').setValue(this.CashCounterList[7])
      this.filteredOptionsCashCounter = this.searchFormGroup.get('CashCounterID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCashCounter(value) : this.CashCounterList.slice()),
      ); 
    });
  }
  private _filterCashCounter(value: any): string[] {
    if (value) {
      const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
      return this.CashCounterList.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
    } 
  } 
  getOptionTextCashCounter(option){ 
    if (!option)
      return '';
    return option.CashCounterName;
  }
}

export class IPRefundofAdvance {
  RefundDate: Date;
  RefundTime: any;
  BillId: number;
  AdvanceId: number;
  OPD_IPD_Type: number;
  OPD_IPD_ID: number;
  UsedAmount: number;
  BalanceAmount: number;
  RefundAmount: number;
  Remark: string;
  TransactionId: number;
  AddedBy: number;
  IsCancelled: boolean;
  IsCancelledBy: number;
  IsCancelledDate: Date;
  RefundId: number;
  Date: any;
  RefundAmt:any;
  AdvanceDetailID:any;

  constructor(IPRefundofAdvanceObj) {

    this.RefundDate = IPRefundofAdvanceObj.RefundDate || '0';
    this.RefundTime = IPRefundofAdvanceObj.RefundTime || '0';
    this.BillId = IPRefundofAdvanceObj.BillId || 0;
    this.AdvanceId = IPRefundofAdvanceObj.AdvanceId || '0';
    this.OPD_IPD_Type = IPRefundofAdvanceObj.OPD_IPD_Type || '0';
    this.OPD_IPD_ID = IPRefundofAdvanceObj.OPD_IPD_ID || '0';
    this.UsedAmount = IPRefundofAdvanceObj.UsedAmount || '0';
    this.BalanceAmount = IPRefundofAdvanceObj.BalanceAmount || '0';
    this.RefundAmount = IPRefundofAdvanceObj.RefundAmount || '0';
    this.Remark = IPRefundofAdvanceObj.Remark || '';
    this.TransactionId = IPRefundofAdvanceObj.TransactionId || 0;
    this.AddedBy = IPRefundofAdvanceObj.AddedBy || 0;
    this.IsCancelled = IPRefundofAdvanceObj.IsCancelled || false;
    this.IsCancelledBy = IPRefundofAdvanceObj.IsCancelledBy || 0;
    this.IsCancelledDate = IPRefundofAdvanceObj.IsCancelledDate || '';
    this.RefundId = IPRefundofAdvanceObj.RefundId || '0';
    this.Date = IPRefundofAdvanceObj.Date || ''; 
    this.RefundAmt = IPRefundofAdvanceObj.RefundAmt || 0;
    this.AdvanceDetailID = IPRefundofAdvanceObj.AdvanceDetailID || '0';
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
// Relatedquery
// select * from AdvRefundDetail order by 1 desc
// select * from AdvanceHeader order by 1 desc
// select * from AdvRefundDetail order by 1 desc



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