import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, FormGroup, Validators } from '@angular/forms';
import { AdvanceDetailObj } from '../ip-search-list.component'; 
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IPSearchListService } from '../ip-search-list.service';
import { Router } from '@angular/router';
import { AdvanceDataStored } from '../../advance';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { IPAdvancePaymentComponent } from '../ip-advance-payment/ip-advance-payment.component';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { RegInsert } from '../../Admission/admission/admission.component';
import { OPAdvancePaymentComponent } from 'app/main/opd/op-search-list/op-advance-payment/op-advance-payment.component';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
import { BrowseIpdreturnadvanceReceipt } from '../../ip-refundof-advance/ip-refundof-advance.component';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { map, startWith } from 'rxjs/operators';

type NewType = Observable<any[]>;
@Component({
  selector: 'app-ip-refundof-bill',
  templateUrl: './ip-refundof-bill.component.html',
  styleUrls: ['./ip-refundof-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPRefundofBillComponent implements OnInit {

  searchFormGroup: FormGroup;
  screenFromString = 'app-op-refund-bill';
  RefundOfBillFormGroup: FormGroup; 
  myserviceForm: FormGroup;
  isLoading: String = '';
  selectedAdvanceObj: AdvanceDetailObj;
  filteredOptions: NewType;
  myControl = new UntypedFormControl();
  dateTimeObj: any;
  billNo: number;
  BillNo: number;
  NetBillAmount: number=0;
  TotalRefundAmount:any;
  RefundBalAmount: number=0;
  BillDate: any; 
  RefundAmount: number;
  Remark: string;
  b_price = '0';
  b_qty = '1';
  b_totalAmount = '0';
  billingServiceList = [];
  showAutocomplete = false;
  BillingClassCmbList: any = [];
  b_netAmount = '0';
  b_disAmount = '0';
  b_DoctorName = '';
  b_traiffId = '';
  b_isPath = '';
  b_isRad = '';
  b_IsEditable = '';
  b_IsDocEditable = '';
  serviceId: number;
  serviceName: any;
  ServiceAmount:number;
  ChargeId:any;
  isFilteredDateDisabled: boolean = true;
  currentDate = new Date();
  doctorNameCmbList: any = [];
  serviceNameCmbList: any = [];
  refundremain:any=[];
  isLoadingStr: string = '';
  reportPrintObj: BrowseIpdreturnadvanceReceipt;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  totalAmtOfNetAmt: any;
  netPaybleAmt:any;
  totalAmtOfNetAmt1: any;
  netPaybleAmt1:any;
  serselamttot:any =0;
  RefAmt:any=0;
  RefAmt1:any=0;
  sIsLoading: string = '';

  City: any;
  CompanyName: any;
  Tarrifname: any;
  Doctorname: any;
  Paymentdata: any;
  vOPIPId: any = 0;
  vOPDNo: any = 0;
  vTariffId: any = 0;
  vClassId: any = 0;
  vRegId: any = 0;
  vAdmissionId:any;
  PatientName: any = "";
  RegId: any = 0;
  Age: any = 0;
  RegNo: any = 0;
  VisitId: any = 0;
  vMobileNo: any = 0;
  noOptionFound: boolean = false;
  PatientListfilteredOptions: any;
  isRegIdSelected: boolean = false;
  registerObj = new RegInsert({});
  isCashCounterSelected:boolean=false;
  filteredOptionsCashCounter:Observable<string[]>;

  displayedColumns1 = [
    'ServiceName',
    'Qty',
    'Price',
    'NetAmount',
    'ChargesDocName',
    'RefundAmount',
    'BalanceAmount',
    'PreviousRefundAmt'
  ];

  displayedColumns = [
    'BillDate',
    'BillNo',
    'NetPayableAmt',
    'RefundAmt'
    // 'action'
  ];

  displayedColumns2 = [
    'RefundDate',
    'RefundAmount'
  ];

  
  dataSource = new MatTableDataSource<InsertRefundDetail>();
  dataSource3 = new MatTableDataSource<RegRefundBillMaster>();
  dataSource1 = new MatTableDataSource<BillRefundMaster>();
  
  dataSource2 = new MatTableDataSource<InsertRefundDetail>();


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(public _IpSearchListService: IPSearchListService, 
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    private formBuilder: UntypedFormBuilder,
    public _WhatsAppEmailService:WhatsAppEmailService,
    public toastr: ToastrService, 
    private dialogRef: MatDialogRef<IPRefundofBillComponent>,
    private _formBuilder: UntypedFormBuilder
    ) { } 

  ngOnInit(): void { 
    this.RefundOfBillFormGroup = this.refundForm();
    this.searchFormGroup = this.createSearchForm();
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj);
      this.vOPIPId=this.selectedAdvanceObj.AdmissionID
      this.vRegId=this.selectedAdvanceObj.RegId
      this.PatientName=this.selectedAdvanceObj.PatientName;
      this.Doctorname=this.selectedAdvanceObj.Doctorname
      this.RegNo=this.selectedAdvanceObj.RegNo
      this.Department = this.selectedAdvanceObj.DepartmentName;
      this.DOA = this.selectedAdvanceObj.DOA;
      this.IPDNo = this.selectedAdvanceObj.IPDNo;
      this.Age = this.selectedAdvanceObj.AgeYear
      this.AgeMonth = this.selectedAdvanceObj.AgeMonth;
      this.AgeDay = this.selectedAdvanceObj.AgeDay;
      this.GenderName = this.selectedAdvanceObj.GenderName;
      this.vAdmissionId =this.selectedAdvanceObj.AdmissionID
      this.Tarrifname= this.selectedAdvanceObj.TariffName;
      this.WardName= this.selectedAdvanceObj.RoomName;
      this.CompanyName= this.selectedAdvanceObj.CompanyName;
      this.RefDoctorName= this.selectedAdvanceObj.RefDocName;
      this.BedName = this.selectedAdvanceObj.BedName;
      this.PatientType = this.selectedAdvanceObj.PatientType;
    }
    // this.myControl = new FormControl();
    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   debounceTime(20),
    //   startWith(''),
    //   map((value) => (value && value.length >= 1 ? this.filterStates(value) : this.billingServiceList.slice()))
    // );
 
    this.getRefundofBillIPDList(); 
    this.getCashCounterComboList();
  } 
createSearchForm() {
  return this.formBuilder.group({
  RegId: [''],
  CashCounterID:['']
  });
}
refundForm(): FormGroup {
  return this._formBuilder.group({  
    TotalRefundAmount: [ ],
    Remark: [''],   
  });
} 
  filterStates(name: string) {
    let tempArr = [];

    this.billingServiceList.forEach((element) => {
      if (element.ServiceName.toString().toLowerCase().search(name) !== -1) {
        tempArr.push(element);
      }
    });
    return tempArr;
  } 
  // Patient Search;
  getSearchList() { 
    var m_data = {
      "Keyword": `${this.searchFormGroup.get('RegId').value}%`
    } 
    this._IpSearchListService.getPatientVisitedListSearch(m_data).subscribe(data => {
      this.PatientListfilteredOptions = data;
      console.log(this.PatientListfilteredOptions )
      if (this.PatientListfilteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    }); 
  }
  AgeMonth:any;
  AgeDay:any;
  GenderName:any;
  Department:any;
  DOA:any;
  IPDNo:any;
  RefDoctorName:any;
  WardName:any;
  BedName:any;
  PatientType:any;
  getSelectedObj1(obj) {
    console.log(obj)
     this.dataSource3.data = []; 
    this.registerObj = obj;
    this.RegNo=obj.RegNo
    this.PatientName = obj.FirstName + " " + obj.LastName; 
    this.Doctorname = obj.DoctorName;
    this.Department = obj.Department
    this.RegId = obj.RegId;
    this.DOA = obj.DOA;
    this.IPDNo = obj.IPDNo
    this.RefDoctorName = obj.RefDoctorName;
    this.Age=obj.AgeYear;
    this.AgeMonth = obj.AgeMonth;
    this.AgeDay = obj.AgeDay;
    this.GenderName = obj.GenderName;
    this.WardName = obj.RoomName;
    this.BedName = obj.BedName;
    this.PatientType = obj.PatientType;
    this.Tarrifname = obj.TariffName;
    this.CompanyName = obj.CompanyName; 
    this.vOPIPId = obj.RegId;
    this.vRegId = obj.RegId;
    this.vOPDNo = obj.OPDNo;
    this.vTariffId = obj.TariffId;
    this.vClassId = obj.classId
    this.VisitId=obj.VisitId 
    this. getRefundofBillIPDList();
  }

  getOptionText1(option) {
    if (!option)
      return '';
      return option.FirstName + ' ' + option.MiddleName  + ' ' + option.LastName ; 
  }



  RefundAmt:any; 
  
  getRefundofBillIPDList() { 
    var m_data = {
      "AdmissionId ": this.vAdmissionId 
    }
    //console.log(m_data)
    this._IpSearchListService.getRefundofBillIPDList(m_data).subscribe(Visit => {
      this.dataSource3.data = Visit as RegRefundBillMaster[]; 
      console.log( this.dataSource3.data) 
    });
  }
 
getServiceList(param){  
  var m_data1 = {
    "BillNo": param.BillNo
  }
  console.log(m_data1)
  this.isLoadingStr = 'loading';
  this._IpSearchListService.getRefundofBillServiceList(m_data1).subscribe(Visit => { 
    this.dataSource2.data = Visit as InsertRefundDetail[];
    console.log(this.dataSource2.data)
    this.dataSource1.sort = this.sort;
    this.dataSource1.paginator = this.paginator;
    this.isLoadingStr = this.dataSource2.data.length == 0 ? 'no-data' : '';
  });
}  
OnEdit(row) { 
  console.log(row);
  debugger
  if(row.NetPayableAmt == row.RefundAmount){
    Swal.fire('Selected Bill already Refunded.') 
    return
  }
  var datePipe = new DatePipe("en-US");
  this.BillNo=row.BillNo;
  this.BillDate =  datePipe.transform(row.BillDate, 'dd/MM/yyyy hh:mm a'); 
  this.NetBillAmount=row.NetPayableAmt;
  this.RefundAmount=row.RefundAmount;
  this.RefundBalAmount = (parseInt(this.NetBillAmount.toString()) - parseInt(this.RefundAmount.toString()));

  this.getServiceList(row);

  var Query = 'select RefundDate,RefundAmount from refund where billid='+row.BillNo
  this.isLoadingStr = 'loading';
  this._IpSearchListService.getPreRefundofBill(Query).subscribe(Visit => {
    this.dataSource1.data = Visit as BillRefundMaster[]; 
    this.isLoadingStr = this.dataSource1.data.length == 0 ? 'no-data' : '';
  }); 
  this.RefAmt1=this.RefundBalAmount;
}    
gettablecalculation(element, RefundAmt) {
  debugger 
  if(RefundAmt > 0 && RefundAmt <= element.BalAmt){
    element.BalanceAmount= ((element.BalAmt) - (RefundAmt));   
    element.PrevRefAmount = RefundAmt;
  } 
  else if (RefundAmt > element.BalAmt) {
    this.toastr.warning('Enter Refund Amount Less than Balance Amount ', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    element.RefundAmount = '';  
    element.BalanceAmount =element.BalAmt;
  }
  else if(RefundAmt == 0 || RefundAmt == '' || RefundAmt == null || RefundAmt == undefined){
    element.RefundAmount = '';  
    element.BalanceAmount =element.BalAmt;
  }
  else if(this.RefundAmount < this.NetBillAmount){
    this.toastr.warning('Bill Amount Already Refund .', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    element.RefundAmount = '';  
    element.BalanceAmount =element.BalAmt;
  } 
}
 
  getRefundtotSum(element){
    let netAmt1;
    netAmt1 = element.reduce((sum, { RefundAmount }) => sum += +(RefundAmount || 0), 0);
    return netAmt1;
    console.log(netAmt1);
  } 
  getRefundtotSum1(element){
    let netAmt1;
    netAmt1 = element.reduce((sum, { RefundAmount }) => sum += +(RefundAmount || 0), 0);
    return netAmt1;
    console.log(netAmt1);
  } 
  getServicetotSum(element) { 
    let netAmt;
    this.TotalRefundAmount =  element.reduce((sum, { RefundAmount }) => sum += +(RefundAmount || 0), 0);
    netAmt = element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
    this.totalAmtOfNetAmt = netAmt;
    this.netPaybleAmt = netAmt;
    return netAmt; 
  } 

// Serviceselect(row,event){

// console.log(row);
// this.RefAmt=this.RefundBalAmount;

// this.TotalRefundAmount=0;
// // this.RefundBalAmount=0;
// this.Remark='';
// this.serviceId=row.ServiceId;
// this.ServiceAmount=row.NetAmount;
// this.ChargeId=row.ChargeId;

// this.serselamttot = parseInt(row.NetAmount) + parseInt(this.serselamttot);
// console.log(this.RefundBalAmount);
// console.log(this.serselamttot);

// if(this.RefAmt1 >= this.serselamttot){
// this.TotalRefundAmount=row.Price;
// this.RefundBalAmount = (parseInt(this.RefundBalAmount.toString()) - parseInt(this.TotalRefundAmount.toString()));
// this.TotalRefundAmount=this.serselamttot;
// }
// else{
// Swal.fire("Select service total more than Bill Amount");
// this.TotalRefundAmount = 0;
// this.serselamttot=0;
// this.RefundBalAmount=this.RefAmt1;
// }
// }


onSave() {
  if(this.TotalRefundAmount == ' ' || this.TotalRefundAmount == null || this.TotalRefundAmount == undefined){
    this.toastr.warning('Please check refund amount .', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return
  }
  if(!this.dataSource2.data.length){
    this.toastr.warning('Please check service list is blank .', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return
  }

  this.isLoading = 'submit'; 
  let InsertRefundObj = {}; 
  InsertRefundObj['refundId'] = 0;
  InsertRefundObj['RefundDate'] =this.dateTimeObj.date;
  InsertRefundObj['RefundTime'] = this.dateTimeObj.time;
  InsertRefundObj['BillId'] =this.BillNo || 0;
  InsertRefundObj['AdvanceId'] = 0;
  InsertRefundObj['OPD_IPD_Type'] = 1;
  InsertRefundObj['OPD_IPD_ID'] =  this.vOPIPId || 0
  InsertRefundObj['RefundAmount'] = this.RefundOfBillFormGroup.get('TotalRefundAmount').value || 0;
  InsertRefundObj['Remark'] = this.RefundOfBillFormGroup.get('Remark').value || '';
  InsertRefundObj['TransactionId'] = 2;
  InsertRefundObj['AddedBy'] = this.accountService.currentUserValue.userId,
  InsertRefundObj['IsCancelled'] = 0;
  InsertRefundObj['IsCancelledBy'] = 0;
  InsertRefundObj['IsCancelledDate'] = this.dateTimeObj.date;
  InsertRefundObj['RefundNo'] =0 ; 

  let RefundDetailarr = [];
  this.dataSource2.data.forEach((element) => { 
  let InsertRefundDetailObj = {}; 
    InsertRefundDetailObj['RefundID'] = 0;
    InsertRefundDetailObj['ServiceId'] = element.ServiceId || 0;
    InsertRefundDetailObj['ServiceAmount'] = element.NetAmount || 0;
    InsertRefundDetailObj['RefundAmount'] =element.RefundAmount || 0;
    InsertRefundDetailObj['DoctorId'] = element.DoctorId || 0; 
    InsertRefundDetailObj['Remark'] = this.RefundOfBillFormGroup.get('Remark').value || '';
    InsertRefundDetailObj['AddBy'] = this.accountService.currentUserValue.userId,
    InsertRefundDetailObj['ChargesId'] = element.ChargesId || 0;  
    RefundDetailarr.push(InsertRefundDetailObj); 
  });

  let updateAddChargesDetails = []; 
  this.dataSource2.data.forEach((element) => {
    let AddchargesRefundAmountObj = {}; 
    AddchargesRefundAmountObj['ChargesId'] =  element.ChargesId || 0;  
    AddchargesRefundAmountObj['RefundAmount'] = element.RefundAmount || 0;
    updateAddChargesDetails.push(AddchargesRefundAmountObj);
  }); 

  let PatientHeaderObj = {};

  // PatientHeaderObj['Date'] = this.dateTimeObj.date;
  // PatientHeaderObj['UHIDNO'] =this.RegNo
  // // PatientHeaderObj['OPD_IPD_Id'] =this.vOPIPId || 0
  // PatientHeaderObj['NetPayAmount'] = this.TotalRefundAmount;
  // PatientHeaderObj['IPDNo'] = this.selectedAdvanceObj.IPDNo ;
  // PatientHeaderObj['PatientName'] =  this.PatientName 
  // PatientHeaderObj['Doctorname'] = this.Doctorname
  PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
  PatientHeaderObj['PatientName'] = this.PatientName ;
  PatientHeaderObj['RegNo'] =this.RegNo,
  PatientHeaderObj['DoctorName'] = this.Doctorname;
  PatientHeaderObj['CompanyName'] = this.CompanyName;
  PatientHeaderObj['DepartmentName'] = this.Department;
  PatientHeaderObj['OPD_IPD_Id'] =  this.IPDNo;
  PatientHeaderObj['Age'] =  this.Age;
  PatientHeaderObj['NetPayAmount'] = this.TotalRefundAmount;
 
  // const dialogRef = this._matDialog.open(OPAdvancePaymentComponent,
  //   {
  //     maxWidth: "75vw",
  //     maxHeight: "93vh", width: '100%', height: "100%",
  //     data: { 
  //       advanceObj: PatientHeaderObj, 
  //       FromName: "Advance-Refund",
  //     }
  //   });
  const dialogRef = this._matDialog.open(OpPaymentComponent,
    {
      maxWidth: "80vw",
      height: '650px',
      width: '80%',
      data: {
        vPatientHeaderObj: PatientHeaderObj,
        FromName: "IP-RefundOfBill",
        advanceObj: PatientHeaderObj,
      }
    });
  dialogRef.afterClosed().subscribe(result => {
    if(result.IsSubmitFlag){
    // console.log('============================== Return Adv ===========');
    let submitData = {
      "insertIPRefundofNew": InsertRefundObj,
      "insertRefundDetails": RefundDetailarr,
      "updateAddChargesDetails": updateAddChargesDetails, 
      "ipdInsertPayment": result.submitDataPay.ipPaymentInsert
    };

    console.log(submitData);
    this._IpSearchListService.InsertIPRefundBilling(submitData).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'IP Refund Bill data saved Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            
          let m=response
            this.viewgetRefundofbillReportPdf(response);
            this.getWhatsappshareIPrefundBill(response,this.vMobileNo)
            this.dialogRef.close();
          }
        });
      } else {
        Swal.fire('Error !', 'IP Refund Bill data not saved', 'error');
      }
      this.isLoading = '';
    });
  }
  });
  
}

onClose() { 
this.dialogRef.close();
} 

populateiprefund(employee) {
  this.RefundOfBillFormGroup.patchValue(employee);
      
} 
getDateTime(dateTimeObj) {
  this.dateTimeObj = dateTimeObj;
}
viewgetRefundofbillReportPdf(RefundId) {
  setTimeout(() => {
    // this.SpinLoading =true;
    this.sIsLoading = 'loading-data';
  //  this.AdList=true;
  this._IpSearchListService.getRefundofbillview(
    RefundId
  ).subscribe(res => {
    const dialogRef = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Refund Of Bill  Viewer"
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = '';
        // this.SpinLoading = false;
      });
    
  });
 
  },100);
}
getWhatsappshareIPrefundBill(el, vmono) {
  debugger
  var m_data = {
    "insertWhatsappsmsInfo": {
      "mobileNumber": vmono || 0,
      "smsString": '',
      "isSent": 0,
      "smsType": 'IPREFBILL',
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
      this.toastr.success('IP Refund Of Bill Receipt Sent on WhatsApp Successfully.', 'Save !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
    } else {
      this.toastr.error('API Error!', 'Error WhatsApp!', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    }
  });
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
CashCounterList:any=[];
getCashCounterComboList() {
  this._IpSearchListService.getCashcounterList().subscribe(data => {
    this.CashCounterList = data
    console.log(this.CashCounterList)
    this.searchFormGroup.get('CashCounterID').setValue(this.CashCounterList[6])
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



export class InsertRefund {
  RefundId: number;
  RefundDate: any;
  RefundTime: any;
  BillId: number;
  AdvanceId: number;
  OPD_IPD_Type: number;
  OPD_IPD_ID: number;
  RefundAmount: any;
  Remark: String;
  TransactionId: number;
  AddedBy: number;
  IsCancelled: boolean;
  IsCancelledBy: number;
  IsCancelledDate: any;
  RefundNo:string;
  // BillNo: number;
  // BillDate: any;
  // PatientName: String;
  // IsRefundFlag : boolean;

  constructor(InsertRefundObj) {
    {
      this.RefundId = InsertRefundObj.RefundId || 0;
      this.RefundDate = InsertRefundObj.RefundDate || '';
      this.RefundTime = InsertRefundObj.RefundTime || '';
      this.BillId = InsertRefundObj.BillId || 0;
      this.AdvanceId = InsertRefundObj.AdvanceId || 0;
      this.OPD_IPD_Type = InsertRefundObj.OPD_IPD_Type || 0;
      this.OPD_IPD_ID = InsertRefundObj.OPD_IPD_ID || 0;
      this.RefundAmount = InsertRefundObj.RefundAmount || 0;
      this.Remark = InsertRefundObj.Remark || '';
      this.TransactionId = InsertRefundObj.TransactionId || 0;
      this.AddedBy = InsertRefundObj.AddedBy || 0;
      this.IsCancelled = InsertRefundObj.IsCancelled || false;
      this.IsCancelledBy = InsertRefundObj.IsCancelledBy || 0;
      this.IsCancelledDate = InsertRefundObj.IsCancelledDate || '';
      this.RefundNo = InsertRefundObj.RefundNo || '';

      // this.BillNo = InsertRefundObj.BillNo || 0;
      // this.BillDate = InsertRefundObj.BillDate || '';
      // this.PatientName = InsertRefundObj.PatientName || '';
      
      // this.IsRefundFlag  = InsertRefundObj.IsRefundFlag  || 0;

    }
  }
}



export class InsertRefundDetail {
  RefundID: any;;
  ServiceId: number;
  ServiceName:any;
  ServiceAmount: number;
  RefundAmount: number;
  DoctorId: number;
  Remark: String;
  AddBy: number;
  ChargesId: number;
  ChargesDate:Date;
  Price:number;
  Qty:number;
  TotalAmt:number;
  NetAmount:number;
  ChargesDocName:any;
  RefundAmt:any;
  
  constructor(InsertRefundDetailObj) {
    {
      this.RefundID = InsertRefundDetailObj.RefundID || 0;
      this.ServiceId = InsertRefundDetailObj.ServiceId || 0;
      this.ServiceName = InsertRefundDetailObj.ServiceName || 0;
      this.ServiceAmount = InsertRefundDetailObj.ServiceAmount || 0;
      this.RefundAmount = InsertRefundDetailObj.RefundAmount || 0;
      this.DoctorId = InsertRefundDetailObj.DoctorId || 0;
      this.Remark = InsertRefundDetailObj.Remark || '';
      this.AddBy = InsertRefundDetailObj.AddBy || 0;
      this.ChargesId = InsertRefundDetailObj.ChargesId || 0;
      this.ChargesDate = InsertRefundDetailObj.ChargesDate || '';
      this.Price = InsertRefundDetailObj.Price || 0;
      this.Qty = InsertRefundDetailObj.Qty || 0;
      this.TotalAmt = InsertRefundDetailObj.TotalAmt || 0;
      this.NetAmount = InsertRefundDetailObj.NetAmount || '';
      this.ChargesDocName = InsertRefundDetailObj.ChargesDocName || 0;
      this.Qty = InsertRefundDetailObj.Qty || 0;
      this.RefundAmt = InsertRefundDetailObj.RefundAmt || 0;
    }
  }
}

export class AddchargesRefundAmount {
  chargesId: number;
  refundAmount: number;

  constructor(AddchargesRefundAmountObj) {
    {
      this.chargesId = AddchargesRefundAmountObj.chargesId || 0;
      this.refundAmount = AddchargesRefundAmountObj.refundAmount || 0;

    }
  }
}

export class DocShareGroupwise {
  refundId: number;

  constructor(DocShareGroupwiseObj) {
    {
      this.refundId = DocShareGroupwiseObj.refundId || 0;

    }
  }
}

export class BillMaster {
 
  BillNo: number;
  TotalAmt: number;
  ConcessionAmt: number;
  NetPayableAmt: number;
  PBillNo: number;
  RefundAmount: number;
  OPD_IPD_Type: number;
  OPD_IPD_ID: number;
  AdmissionID: number;
  ChargesID: number;
  BillDate: Date;
  PaidAmt: number;
  BalanceAmt: number;
  IsCancelled: number;
  RegID: number;
  RegId: number;

  constructor(BillMaster) {
    {
      this.BillNo = BillMaster.BillNo || 0;
      this.TotalAmt = BillMaster.TotalAmt || 0;
      this.ConcessionAmt = BillMaster.ConcessionAmt || 0;
      this.NetPayableAmt = BillMaster.NetPayableAmt || 0;
      this.PBillNo = BillMaster.PBillNo || 0;
      this.RefundAmount = BillMaster.RefundAmount || 0;
      this.OPD_IPD_Type = BillMaster.OPD_IPD_Type || 0;
      this.OPD_IPD_ID = BillMaster.OPD_IPD_ID || 0;
      this.AdmissionID = BillMaster.AdmissionID || 0;
      this.ChargesID = BillMaster.ChargesID || 0;
      this.BillDate = BillMaster.BillDate || 0;
      this.PaidAmt = BillMaster.PaidAmt || 0;
      this.BalanceAmt = BillMaster.BalanceAmt || 0;
      this.IsCancelled = BillMaster.IsCancelled || '';
      this.RegID = BillMaster.RegID || 0;
      this.RegId = BillMaster.RegId || 0;
      
    }
  }
}

export class RegRefundBillMaster {
 
  NetPayableAmt: number;
  RefundAmount: number;
  BillDate: any;
  BillNo: any;
  
  constructor(RegRefundBillMaster) {
    {
      
      this.NetPayableAmt = RegRefundBillMaster.NetPayableAmt || 0;
      this.RefundAmount = RegRefundBillMaster.RefundAmount || 0;
      this.BillDate = RegRefundBillMaster.BillDate || 0;
      this.BillNo = RegRefundBillMaster.BillNo || 0;
      
    }
  }
}

export class BillRefundMaster {
 
  RefundDate: Date;
  RefundAmount: number;
  // ConcessionAmt: number;
  // NetPayableAmt: number;

constructor(BillRefundMaster) {
  {
    this.RefundDate = BillRefundMaster.RefundDate || '';
    this.RefundAmount = BillRefundMaster.RefundAmount || 0;
    // this.ConcessionAmt = BillRefundMaster.ConcessionAmt || 0;
    // this.NetPayableAmt = BillRefundMaster.NetPayableAmt || 0;
  }
}
}

