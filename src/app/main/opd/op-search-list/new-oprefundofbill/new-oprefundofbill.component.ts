import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdvanceDetailObj, RegInsert } from '../../appointment/appointment.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { OPSearhlistService } from '../op-searhlist.service';
import { Router } from '@angular/router';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Observable, Subscription } from 'rxjs';
import { RefundMaster } from '../../browse-refund-list/browse-refund-list.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { OpPaymentNewComponent } from '../op-payment-new/op-payment-new.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
type NewType = Observable<any[]>;
@Component({
  selector: 'app-new-oprefundofbill',
  templateUrl: './new-oprefundofbill.component.html',
  styleUrls: ['./new-oprefundofbill.component.scss']
})
export class NewOPRefundofbillComponent implements OnInit {
  screenFromString = 'app-op-refund-bill';
  RefundOfBillFormGroup: FormGroup;
  searchFormGroup: FormGroup;
  myRefundBillForm: FormGroup;
  myserviceForm: FormGroup;
  isLoading: String = '';
  selectedAdvanceObj: AdvanceDetailObj;
  filteredOptions: NewType;
  myControl = new FormControl();
  dateTimeObj: any;
  billNo: number;
  BillNo: number;
  NetBillAmount: number;
  TotalRefundAmount:number=0;
  RefundBalAmount: number;
  BillDate: any; 
  RefundAmount: number=0;
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
  reportPrintObj: RefundMaster;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  totalAmtOfNetAmt: any;
  netPaybleAmt:any;
  totalAmtOfNetAmt1: any;
  netPaybleAmt1:any;
  serselamttot:any =0;
  RefAmt:any=0;
  RefAmt1:any=0;


  registerObj = new RegInsert({});
  PatientName: any = "";
  RegId: any;
  Regflag: boolean = false;
  RegDate: any;
  City: any;
  CompanyName: any;
  Tarrifname: any;
  Doctorname: any;
  Paymentdata: any;
  vOPIPId: any = 0;
  vOPDNo: any = 0;
  vTariffId: any = 0;
  vClassId: any = 0;

  PatientListfilteredOptions: any;
  isRegIdSelected: boolean = false;
  noOptionFound: boolean = false;


  displayedColumns1 = [
    // 'ChargesId',
    // 'ChargesDate',
    // "checkbox",
    'ServiceId',
    'ServiceName',
    'Qty',
    'Price',
    'NetAmount',
    'ChargesDocName',
    'RefundAmount'
  ];

  displayedColumns = [
    'BillNo',
    'BillDate',
    'NetPayableAmt',
    'RefundAmount'
    // 'action'
  ];

  displayedColumns2 = [
    'RefundDate',
    'RefundAmount'
  ];


  // Billdetail

  dataSource = new MatTableDataSource<InsertRefundDetail>();
  dataSource3 = new MatTableDataSource<RegRefundBillMaster>();
  dataSource1 = new MatTableDataSource<BillRefundMaster>();
    
  dataSource2 = new MatTableDataSource<InsertRefundDetail>();


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(public _OpSearchListService: OPSearhlistService,
    // public _IpSearchListService: IpSearchListService,
    private _ActRoute: Router,
    public _matDialog: MatDialog,
    // private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    private formBuilder: FormBuilder,

    private changeDetectorRefs: ChangeDetectorRef,
    // private dialogRef: MatDialogRef<NewOPRefundofbillComponent>,
    private _formBuilder: FormBuilder
    ) {
     
    }
    
   

  ngOnInit(): void {
    this.RefundOfBillFormGroup = this.refundForm();
    this.searchFormGroup = this.createSearchForm();
   

       
    this.refundBillForm();
    this.getRefundofBillIPDList();
    // this.getServiceListCombobox();
     
  }

  createSearchForm() {
    return this.formBuilder.group({
    RegId: ['']
    });
  }

  refundForm(): FormGroup {
    return this._formBuilder.group({
      advanceAmt: [Validators.pattern("^[0-9]*$")],
      BillNo: [''],
      NetBillAmount: [Validators.pattern("^[0-9]*$")],
      TotalRefundAmount: [Validators.pattern("^[0-9]*$")],
      RefundBalAmount: [Validators.pattern("^[0-9]*$")],
      BillDate: [''],
      RefundAmount: [Validators.pattern("^[0-9]*$")],
      Remark: [''],
      RegNo: [''],
      PatientName: [''],
      serviceName: [''],
      serviceId: [''],
      Price: [Validators.pattern("^[0-9]*$")],
      Qty: [Validators.pattern("^[0-9]*$")],
      totalAmount: [Validators.pattern("^[0-9]*$")],
      
    });
  }

  // Patient Search;
  getSearchList() {
    debugger
    var m_data = {
      "Keyword": `${this.searchFormGroup.get('RegId').value}%`
    }
    this._OpSearchListService.getPatientVisitedListSearch(m_data).subscribe(data => {
      this.PatientListfilteredOptions = data;
      console.log(data)
      if (this.PatientListfilteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });

  }

  getSelectedObj1(obj) {
    this.dataSource.data = [];
    console.log(obj)
    this.registerObj = obj;
    // this.PatientName = obj.FirstName + " " + obj.PatientName;
    this.PatientName = obj.FirstName + " " + obj.LastName;
    this.RegId = obj.RegId;
    this.City = obj.City;
    this.RegDate = this.datePipe.transform(obj.RegTime, 'dd/MM/yyyy hh:mm a');
    this.CompanyName = obj.CompanyName;
    this.Tarrifname = obj.TariffName;
    this.Doctorname = obj.DoctorName;
    this.vOPIPId = obj.VisitId;
    this.vOPDNo = obj.OPDNo;
    this.vTariffId = obj.TariffId;
    this.vClassId = obj.classId
  }

  getOptionText1(option) {
    if (!option)
      return '';
    return option.FirstName + ' ' + option.MiddleName  + ' ' + option.LastName ;

  }


  //Give BillNumber For List
  getRefundofBillIPDList() {
    debugger;
    
    var m_data = {
      "RegNo": 5,// this.vOPIPId || this.RegId
            
    }
    
    this._OpSearchListService.getRefundofBillOPDList(m_data).subscribe(Visit => {
      this.dataSource3.data = Visit as RegRefundBillMaster[];
      this.dataSource3.sort = this.sort;
      this.dataSource3.paginator = this.paginator;
      
    });
  }


// //Give BillNumber For List
//   getBilldetailList() {
//     debugger;
//     var m_data = {
//       "BillNo": 1212,//this._OpSearchListService.myRefundAdvanceForm.get("BillNo").value || 0,
//     }
//     // this.isLoadingStr = 'loading';
//     this._OpSearchListService.getRefundofBillList(m_data).subscribe(Visit => {
//       this.dataSource.data = Visit as InsertRefundDetail[];
//       this.dataSource.sort = this.sort;
//       this.dataSource.paginator = this.paginator;
//       // this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
//     });
//   }

  getserviceetailList() {
    var m_data = {
      "BillNo": this.BillNo
    }
    
    this.isLoadingStr = 'loading';
    this._OpSearchListService.getRefundofBillServiceList(m_data).subscribe(Visit => {
      this.dataSource2.data = Visit as InsertRefundDetail[];
      this.dataSource2.sort = this.sort;
      this.dataSource2.paginator = this.paginator;
      
      this.isLoadingStr = this.dataSource2.data.length == 0 ? 'no-data' : '';
    });
  }

  refundBillForm() {
    this.myRefundBillForm = this.formBuilder.group({
      BillId: [''],
      billId: [''], 
      ServiceId: [''],
      serviceId: [''],
      serviceName: [''],
      ServiceName: [''],
      Price: [Validators.pattern("^[0-9]*$")],
      Qty: [Validators.pattern("^[0-9]*$")],
      totalAmount: [Validators.pattern("^[0-9]*$")],
      advanceAmt: [Validators.pattern("^[0-9]*$")],
      BillingClassId: [''],
      price: [Validators.pattern("^[0-9]*$")],
      qty: [Validators.pattern("^[0-9]*$")],
      DoctorId: [''],
      DoctorName: [''],
    });
  }


  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  //  ===================================================================================


  onOptionSelected(selectedItem) {
    this.b_price = selectedItem.Price
    this.b_totalAmount = selectedItem.Price  //* parseInt(this.b_qty)
    this.b_disAmount = '0';
    this.b_netAmount = selectedItem.Price
    this.b_IsEditable = selectedItem.IsEditable
    this.b_IsDocEditable = selectedItem.IsDocEditable
    this.b_isPath = selectedItem.IsPathology
    this.b_isRad = selectedItem.IsRadiology
    this.serviceId = selectedItem.ServiceId;
    this.serviceName = selectedItem.ServiceName;
    this.calculateTotalAmt();
  }

  calculateTotalAmt() {
    if (this.b_price && this.b_qty) {
      this.b_totalAmount = (parseInt(this.b_price) * parseInt(this.b_qty)).toString();
      this.b_netAmount = this.b_totalAmount;
      // this.calculatePersc();
    }
  }


  getSelectedServicetotSum(element) {
    
    let netAmt1;
    netAmt1 = element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
    this.totalAmtOfNetAmt1 = netAmt1;
    this.netPaybleAmt1 = netAmt1;
    return netAmt1;
       
  }

  getRefundtotSum(element){
    let netAmt1;
    netAmt1 = element.reduce((sum, { RefundAmount }) => sum += +(RefundAmount || 0), 0);
    return netAmt1;
    
  }


  getRefundtotSum1(element){
    let netAmt1;
    netAmt1 = element.reduce((sum, { RefundAmount }) => sum += +(RefundAmount || 0), 0);
    return netAmt1;
    
  }



  getServicetotSum(element) {
    
    let netAmt;
    netAmt = element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
    this.totalAmtOfNetAmt = netAmt;
    this.netPaybleAmt = netAmt;
    return netAmt;
    
  }

  tableElementChecked(event, element) {
    // if (event.checked) {
    //   this.interimArray.push(element);
    // } else if (this.interimArray.length > 0) {
    //   let index = this.interimArray.indexOf(element);
    //   if (index !== -1) {
    //     this.interimArray.splice(index, 1);
    //   }
    // }
  }

  onSave() {
    debugger;
    this.isLoading = 'submit';

    if(this.TotalRefundAmount <= this.RefundBalAmount){
    let InsertRefundObj = {};

    InsertRefundObj['refundNo'] = '';
    InsertRefundObj['RefundDate'] =  this.dateTimeObj.date;
    InsertRefundObj['RefundTime'] =  this.dateTimeObj.date;
    InsertRefundObj['BillId'] = this.BillNo,//parseInt(this.RefundOfBillFormGroup.get('BillNo').value);
    InsertRefundObj['AdvanceId'] = 0;
    InsertRefundObj['OPD_IPD_Type'] = 0;
    InsertRefundObj['OPD_IPD_ID'] = this.vOPIPId,
    InsertRefundObj['RefundAmount'] = parseInt(this.RefundOfBillFormGroup.get('TotalRefundAmount').value);
    InsertRefundObj['Remark'] = this.RefundOfBillFormGroup.get('Remark').value;
    InsertRefundObj['TransactionId'] = 1;
    InsertRefundObj['AddedBy'] = this.accountService.currentUserValue.user.id,
    InsertRefundObj['IsCancelled'] = 0;
    InsertRefundObj['IsCancelledBy'] = 0;
    InsertRefundObj['IsCancelledDate'] = this.dateTimeObj.date;
    InsertRefundObj['refundId'] = 0;
    

    let RefundDetailarr = [];
    let InsertRefundDetailObj = {};
    
    debugger;
    // this.dataSource.data.forEach((element) => {
      InsertRefundDetailObj['RefundID'] = 0;
      InsertRefundDetailObj['ServiceId'] = this.serviceId || 0;
      InsertRefundDetailObj['ServiceAmount'] = this.ServiceAmount || 0;
      InsertRefundDetailObj['RefundAmount'] = parseInt(this.RefundOfBillFormGroup.get('TotalRefundAmount').value) || 0;
      InsertRefundDetailObj['DoctorId'] =1;// this.myRefundBillForm.get('DoctorId').value;// this.selectedAdvanceObj.Doctorname;
      InsertRefundDetailObj['Remark'] = this.RefundOfBillFormGroup.get('Remark').value || '';
      InsertRefundDetailObj['AddBy'] = this.accountService.currentUserValue.user.id,
      InsertRefundDetailObj['ChargesId'] = this.ChargeId;

      RefundDetailarr.push(InsertRefundDetailObj);
   
    let AddchargesRefundAmountarr = [];
    let AddchargesRefundAmountObj = {};
    
    this.dataSource.data.forEach((element) => {
      AddchargesRefundAmountObj['ChargesId'] = 1;
      AddchargesRefundAmountObj['RefundAmount'] =  parseInt(this.RefundOfBillFormGroup.get('TotalRefundAmount').value);
      AddchargesRefundAmountarr.push(AddchargesRefundAmountObj);
    });


    let PatientHeaderObj = {};

    PatientHeaderObj['Date'] = this.dateTimeObj.date;
    PatientHeaderObj['OPD_IPD_Id'] = this.vOPIPId;
    PatientHeaderObj['NetPayAmount'] =   this.TotalRefundAmount;
    PatientHeaderObj['PatientName'] = this.PatientName;
   
    const insertRefund = new InsertRefund(InsertRefundObj);
   
    const dialogRef = this._matDialog.open(OpPaymentNewComponent,
      {
        maxWidth: "100vw",
        height: '600px',
        width: '100%',
        data: {
          vPatientHeaderObj: PatientHeaderObj,
          FromName: "Advance-Refund"
        }
      });
      
    dialogRef.afterClosed().subscribe(result => {
      // console.log('============================== Return Adv ===========');
      let submitData = {
        "insertRefund": insertRefund,
        "insertOPRefundDetails": RefundDetailarr,
        "update_AddCharges_RefundAmount": AddchargesRefundAmountarr,
        "insertOPPayment": result.submitDataPay.ipPaymentInsert
      };

      
      this._OpSearchListService.InsertOPRefundBilling(submitData).subscribe(response => {
        if (response) {
          Swal.fire('Congratulations !', 'OP Refund Bill data saved Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              
            let m=response
            this.viewgetOPRefundofbillPdf(m);

              this._matDialog.closeAll();

            }
          });
        } else {
          Swal.fire('Error !', 'OP Refund Bill data not saved', 'error');
        }
        this.isLoading = '';
      });
      
    });
    }
    else{
Swal.fire("Refund Amount is More than RefundBalance")
    }

    this.dataSource.data=[];
    this.dataSource1.data=[];
    this.dataSource2.data=[];
    this.RefundOfBillFormGroup.reset();
  }


  
SpinLoading:boolean=false;
viewgetOPRefundofbillPdf(row) {
  debugger
  setTimeout(() => {
    this.SpinLoading =true;
  //  this.AdList=true;
  this._OpSearchListService.getOprefundofbillview(
    row.RefundId
  ).subscribe(res => {
    const dialogRef = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Op Refund Of Bill Receipt Viewer"
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

onClose() {
  
  this._matDialog.closeAll();
}
getBillingClassCombo(){
  this._OpSearchListService.getClassList({ "Id": this.selectedAdvanceObj.ClassId }).subscribe(data => {
    this.BillingClassCmbList = data;
    this.myserviceForm.get('BillingClassId').setValue(this.BillingClassCmbList[0]);
  });
}
getAdmittedDoctorCombo(){
  this._OpSearchListService.getAdmittedDoctorCombo().subscribe(data => {
    this.doctorNameCmbList = data
  });
}
updatedVal(e) {
  if (e && e.length >= 2) {
    this.showAutocomplete = true;
  } else {
    this.showAutocomplete = false;
  }
  if (e.length == 0) { this.b_price = ''; this.b_totalAmount = '0'; this.b_netAmount = '0'; this.b_disAmount = '0'; this.b_isPath = ''; this.b_isRad = ''; this.b_IsEditable = '0'; }
}
getServiceListCombo(){
  this._OpSearchListService.getserviceCombo().subscribe(data => {
    this.serviceNameCmbList = data
  });
}

getServiceListCombobox() {
  let tempObj;
  var m_data = {
    SrvcName: "%",
    TariffId: this.selectedAdvanceObj.TariffId,
    ClassId: this.selectedAdvanceObj.ClassId
  };
  this._OpSearchListService.getBillingServiceList(m_data).subscribe(data => {
    this.dataSource2.data = data as InsertRefundDetail[];
    console.log(data);
    this.billingServiceList = tempObj;
   
  });
}

Serviceselect(row,event){
debugger;
console.log(row);
this.RefAmt=this.RefundBalAmount;

this.TotalRefundAmount=0;
this.Remark='';
this.serviceId=row.ServiceId;
this.ServiceAmount=row.NetAmount;
this.ChargeId=row.ChargeId;

this.serselamttot = parseInt(row.NetAmount) + parseInt(this.serselamttot);
console.log(this.RefundBalAmount);
console.log(this.serselamttot);

if(this.RefAmt1 >= this.serselamttot){
this.TotalRefundAmount=row.Price;
this.RefundBalAmount = (parseInt(this.RefundBalAmount.toString()) - parseInt(this.TotalRefundAmount.toString()));
this.TotalRefundAmount=this.serselamttot;
}
else{
Swal.fire("Select service total more than Bill Amount");
this.TotalRefundAmount = 0;
this.serselamttot=0;
this.RefundBalAmount=this.RefAmt1;
}
}
//
onEdit(row) {
   console.log(row);
  var datePipe = new DatePipe("en-US");
  this.BillNo=row.BillNo;
  this.BillDate =  datePipe.transform(row.BillDate, 'dd/MM/yyyy hh:mm a'); 
  this.NetBillAmount=row.NetPayableAmt;
  this.RefundAmount=row.RefundAmount;
  this.RefundBalAmount = (parseInt(this.NetBillAmount.toString()) - parseInt(this.RefundAmount.toString()));

  this.getserviceetailList();

  debugger;
  //Testing
  var m_data1 = {
    "BillId": row.BillNo
  }
  this.isLoadingStr = 'loading';
  this._OpSearchListService.getRefundofBillDetailList(m_data1).subscribe(Visit => {
    this.dataSource1.data = Visit as BillRefundMaster[];
    
    this.dataSource1.sort = this.sort;
    this.dataSource1.paginator = this.paginator;
    this.isLoadingStr = this.dataSource1.data.length == 0 ? 'no-data' : '';
  });

  this.RefAmt1=this.RefundBalAmount;
} 


populateiprefund(employee) {
  this.RefundOfBillFormGroup.patchValue(employee);
      
}

calculateTotalRefund() {
    debugger
  this.RefundBalAmount = this.RefundAmount - this.TotalRefundAmount;
 

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
 

constructor(BillRefundMaster) {
  {
    this.RefundDate = BillRefundMaster.RefundDate || '';
    this.RefundAmount = BillRefundMaster.RefundAmount || 0;
   
  }
}
}
