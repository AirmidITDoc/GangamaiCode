import { ChangeDetectorRef, Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; 
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IPSearchListService } from '../ip-search-list.service'; 
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common'; 
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations'; 
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr'; 
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component'; 
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest'; 
import { PrintserviceService } from 'app/main/shared/services/printservice.service';

  
@Component({
  selector: 'app-ip-refundof-bill',
  templateUrl: './ip-refundof-bill.component.html',
  styleUrls: ['./ip-refundof-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPRefundofBillComponent implements OnInit {
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
  AdmissionId:any='0'
        @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;  
    
   AllColumns= [
    { heading: "Bil Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA' , width: 200,type: 9 },
    { heading: "PBill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA',width: 120 },
    { heading: "Bill Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA',width: 160},
    { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA',width: 160 }, 
  ]
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "RefundOfBill/IPBillListforRefundList",
        columnsList:this.AllColumns,
        sortField: "BillNo",
        sortOrder: 0,
        filters: [
            { fieldName: "AdmissionId", fieldValue: String(this.AdmissionId), opType: OperatorComparer.Equals }
        ]
    } 

    

  searchFormGroup: FormGroup;
  screenFromString = 'Common-form';
  RefundOfBillFormGroup: FormGroup;  
  isLoading: String = '';
  selectedAdvanceObj: any;  
  dateTimeObj: any; 
  BillNo: number;
  NetBillAmount: number=0;
  TotalRefundAmount:any;
  RefundBalAmount: number=0;
  BillDate: any; 
  RefundAmount: number; 
  currentDate = new Date();  
  isLoadingStr: string = '';  
  totalAmtOfNetAmt: any;
  netPaybleAmt:any; 
  RefAmt1:any=0;  
  vAdmissionId:any;
  PatientName: any = "";
  RegId: any = 0;
  registerObj:any

  autocompleteModeCashCounter: string = "CashCounter";


 
  dataSource2 = new MatTableDataSource<InsertRefundDetail>();


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(public _IpSearchListService: IPSearchListService, 
    public _matDialog: MatDialog, 
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    private formBuilder: UntypedFormBuilder,
    public _WhatsAppEmailService:WhatsAppEmailService,
      private commonService: PrintserviceService,
    public toastr: ToastrService, 
    private dialogRef: MatDialogRef<IPRefundofBillComponent>,
    private _formBuilder: UntypedFormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { } 

  ngOnInit(): void { 
    this.RefundOfBillFormGroup = this.refundForm();
    this.searchFormGroup = this.createSearchForm();
    if (this.data) {
      console.log(this.data)
      this.selectedAdvanceObj = this.data 
      this.getData(this.selectedAdvanceObj.admissionId) 
    } 
  
  } 
createSearchForm() {
  return this.formBuilder.group({
  RegId: [''],

  });
}
refundForm(): FormGroup {
  return this._formBuilder.group({  
    TotalRefundAmount: [ ],
    Remark: [''],
    CashCounterID:[7]   
  });
} 
 Chargelist:any=[];
getSelectedRow(contact){
  debugger
  console.log(contact)
  if(contact.netPayableAmt == contact.refundAmount){ 
    this.toastr.warning('Selected Bill already Refunded.!', 'warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return
  }
  this.BillNo=contact.billNo;
  this.BillDate =  this.datePipe.transform(contact.billDate, 'dd/MM/yyyy hh:mm a'); 
  this.NetBillAmount=contact.netPayableAmt;
  this.RefundAmount=contact.refundAmount;
  this.RefundBalAmount = (parseInt(this.NetBillAmount.toString()) - parseInt(this.RefundAmount.toString()));


  var vdata = {
    "first": 0,
    "rows": 10,
    "sortField": "ChargesId",
    "sortOrder": 0,
    "filters": [
      {
        "fieldName": "BillNo",
        "fieldValue":String(contact.billNo),
        "opType": "Equals"
      }

    ],
    "exportType": "JSON"
  }
  this._IpSearchListService.getRefundofBillServiceList(vdata).subscribe((response) => {  
    this.dataSource2.data = response.data
    this.Chargelist = this.dataSource2.data 
    console.log(this.dataSource2.data) 
  }) 
}
  
  //new code 
  getSelectedObj(obj) {
    console.log(obj) 
       this.RegId = obj.value; 
       if ((this.RegId ?? 0) > 0) {
          // console.log(this.data)
           setTimeout(() => {
               this._IpSearchListService.getRegistraionById(this.RegId).subscribe((response) => {
                   this.registerObj = response;
                   this.PatientName = this.registerObj.firstName + " " + this.registerObj.middleName + " " + this.registerObj.lastName

                   console.log(this.registerObj)
               });

           }, 500);
       }

   } 
    
gettablecalculation(element, RefundAmt) {
  debugger 
  if(RefundAmt > 0 && RefundAmt <= element.balAmt){
    element.balanceAmount= ((element.balAmt) - (RefundAmt));   
    element.previousRefundAmt = RefundAmt;
  } 
  else if (RefundAmt > element.balAmt) {
    this.toastr.warning('Enter Refund Amount Less than Balance Amount ', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    element.refundAmount = '';  
    element.balanceAmount =element.balAmt;
  }
  else if(RefundAmt == 0 || RefundAmt == '' || RefundAmt == null || RefundAmt == undefined){
    element.refundAmount = '';  
    element.balanceAmount =element.balAmt;
  }
  else if(this.RefundAmount < this.NetBillAmount){
    this.toastr.warning('Bill Amount Already Refund .', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    element.refundAmount = '';  
    element.balanceAmount =element.balAmt;
  } 
  this.getServicetotSum()
} 
  getServicetotSum() {  
    let totalRefundAmt=  this.Chargelist.reduce((sum, { refundAmount }) => sum += +(refundAmount || 0), 0);
    let netAmt = this.Chargelist.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0);  
    this.RefundOfBillFormGroup.patchValue({
      TotalRefundAmount:totalRefundAmt
    })
  } 
 

onSave() {

  const formControl = this.RefundOfBillFormGroup.value
  if(formControl.TotalRefundAmount == ' ' || formControl.TotalRefundAmount == null || formControl.TotalRefundAmount == undefined){
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
 
  let InsertRefundObj = {}; 
  InsertRefundObj['refundId'] = 0;
  InsertRefundObj['refundDate'] =this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1900-01-01';
  InsertRefundObj['refundTime'] = this.dateTimeObj.time;
  InsertRefundObj['refundNo'] ='0'; 
  InsertRefundObj['billId'] =this.BillNo || 0;
  InsertRefundObj['advanceId'] = 0;
  InsertRefundObj['opdipdtype'] = 1;
  InsertRefundObj['opdipdid'] =  this.selectedAdvanceObj.admissionId || 0
  InsertRefundObj['refundAmount'] = this.RefundOfBillFormGroup.get('TotalRefundAmount').value || 0;
  InsertRefundObj['remark'] = this.RefundOfBillFormGroup.get('Remark').value || '';
  InsertRefundObj['transactionId'] = 2;
  InsertRefundObj['addedBy'] = this.accountService.currentUserValue.userId,
  InsertRefundObj['isCancelled'] = 0;
  InsertRefundObj['isCancelledBy'] = 0;
  InsertRefundObj['isCancelledDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1900-01-01';
 
  let RefundDetailarr = [];
  this.dataSource2.data.forEach((element) => { 
  let InsertRefundDetailObj = {}; 
    InsertRefundDetailObj['refundId'] = 0;
    InsertRefundDetailObj['serviceId'] = element.serviceId || 0;
    InsertRefundDetailObj['serviceAmount'] = element.netAmount || 0;
    InsertRefundDetailObj['refundAmount'] =element.refundAmount || 0;
    InsertRefundDetailObj['doctorId'] = element.doctorId || 0; 
    InsertRefundDetailObj['remark'] = this.RefundOfBillFormGroup.get('Remark').value || '';
    InsertRefundDetailObj['AdaddBydBy'] = this.accountService.currentUserValue.userId,
    InsertRefundDetailObj['chargesId'] = element.chargesId || 0;  
    RefundDetailarr.push(InsertRefundDetailObj); 
  });

  let updateAddChargesDetails = []; 
  this.dataSource2.data.forEach((element) => {
    let AddchargesRefundAmountObj = {}; 
    AddchargesRefundAmountObj['chargesId'] =  element.chargesId || 0;  
    AddchargesRefundAmountObj['refundAmount'] = element.refundAmount || 0;
    updateAddChargesDetails.push(AddchargesRefundAmountObj);
  }); 

  let PatientHeaderObj = {}; 
  PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
  PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.patientName ;
  PatientHeaderObj['RegNo'] =this.selectedAdvanceObj.regNo,
  PatientHeaderObj['DoctorName'] = this.selectedAdvanceObj.doctorname;
  PatientHeaderObj['CompanyName'] = this.selectedAdvanceObj.companyName;
  PatientHeaderObj['DepartmentName'] = this.selectedAdvanceObj.departmentName;
  PatientHeaderObj['OPD_IPD_Id'] =  this.selectedAdvanceObj.admissionId;
  PatientHeaderObj['Age'] =  this.selectedAdvanceObj.ageYear;
  PatientHeaderObj['NetPayAmount'] = this.RefundOfBillFormGroup.get('TotalRefundAmount').value || 0

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
      "refund": InsertRefundObj,
      "tRefundDetails": RefundDetailarr,
      "addCharges": updateAddChargesDetails, 
      "payment": result.submitDataPay.ipPaymentInsert
    }; 
    console.log(submitData);
    this._IpSearchListService.InsertRefundOfBill(submitData).subscribe(response => {
      console.log(response)
     this.toastr.success(response.message);
     this.viewgetRefundofBillReportPdf(response)
     this.grid.bindGridData(); 
     this.onClose();
   }, (error) => {
     this.toastr.error(error.message);
   });
  }
  });
  
}

viewgetRefundofBillReportPdf(RefundId) {
  this.commonService.Onprint("RefundId",RefundId,"IpBillRefundReceipt");
} 


onClose() { 
this.dialogRef.close();
this.dataSource2.data = [];
this.RefundOfBillFormGroup.reset();
} 

getStatementPrint(){

}
getDateTime(dateTimeObj) {
  this.dateTimeObj = dateTimeObj;
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
getData(AdmissionId) { 
  this.gridConfig = {
    apiUrl: "RefundOfBill/IPBillListforRefundList",
    columnsList:this.AllColumns,
    sortField: "BillNo",
    sortOrder: 0,
    filters: [
        { fieldName: "AdmissionId", fieldValue: String(AdmissionId), opType: OperatorComparer.Equals }
    ]
  }
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
  serviceId: number;
  serviceName:any;
  netAmount: number;
  refundAmount: number;
  doctorId: number;
  Remark: String;
  AddBy: number;
  chargesId: number;
  chargesDate:Date;
  price:number;
  qty:number;
  totalAmt:number;
  NetAmount:number;
  chargesDocName:any;
  RefundAmt:any;
  
  constructor(InsertRefundDetailObj) {
    {
      this.RefundID = InsertRefundDetailObj.RefundID || 0;
      this.serviceId = InsertRefundDetailObj.serviceId || 0;
      this.serviceName = InsertRefundDetailObj.serviceName || 0;
      this.netAmount = InsertRefundDetailObj.netAmount || 0;
      this.refundAmount = InsertRefundDetailObj.refundAmount || 0;
      this.doctorId = InsertRefundDetailObj.doctorId || 0;
      this.Remark = InsertRefundDetailObj.Remark || '';
      this.AddBy = InsertRefundDetailObj.AddBy || 0;
      this.chargesId = InsertRefundDetailObj.chargesId || 0;
      this.chargesDate = InsertRefundDetailObj.chargesDate || '';
      this.price = InsertRefundDetailObj.price || 0;
      this.qty = InsertRefundDetailObj.qty || 0;
      this.totalAmt = InsertRefundDetailObj.totalAmt || 0;
      this.NetAmount = InsertRefundDetailObj.NetAmount || '';
      this.chargesDocName = InsertRefundDetailObj.chargesDocName || 0; 
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

