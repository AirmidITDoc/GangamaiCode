import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AdvanceDetailObj } from '../opd-search-list/opd-search-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { OPSearhlistService } from '../op-searhlist.service';
import Swal from 'sweetalert2';
import { BrowseRefundlistService } from '../../browse-refund-list/browse-refundlist.service';
import { RefundMaster } from '../../browse-refund-list/browse-refund-list.component';
import { AdvancePaymentComponent } from '../advance-payment/advance-payment.component';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
type NewType = Observable<any[]>;
@Component({
  selector: 'app-op-refund-of-bill',
  templateUrl: './op-refund-of-bill.component.html',
  styleUrls: ['./op-refund-of-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OPRefundOfBillComponent implements OnInit {

  reportPrintObj: RefundMaster;

      click:boolean=false;
   subscriptionArr: Subscription[] = [];
   printTemplate: any;
   reportPrintObjList: RefundMaster[] = [];


  screenFromString = 'app-op-refund-bill';
  RefundOfBillFormGroup: FormGroup;
  myRefundBillForm: FormGroup;
  myserviceForm: FormGroup;
  isLoading: String = '';
  selectedAdvanceObj: AdvanceDetailObj;
  filteredOptions: NewType;
  myControl = new FormControl();
  dateTimeObj: any;
  billNo: number;
  BillNo: number;
  NetBillAmount:'0';
  TotalRefundAmount:'0';
  RefundBalAmount:any;
  BillDate: Date; 
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
  serviceName: String;
  isFilteredDateDisabled: boolean = true;
  currentDate = new Date();
  doctorNameCmbList: any = [];
  serviceNameCmbList: any = [];
  refundbalance:any =[];
  RegId:number;
  isLoadingStr: string = '';
  

  displayedColumns = [
    'BillNo',
    'BillDate',
    'TotalAmt',
    'RefundAmount',
    'action'
  ];
  

  dataSource = new MatTableDataSource<BillMaster>();
  menuActions: Array<string> = [];
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public _opsearchlistService: OPSearhlistService,
    public _BrowseOPDReturnsService: BrowseRefundlistService,
    private _ActRoute: Router,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<OPRefundOfBillComponent>,
    private changeDetectorRefs: ChangeDetectorRef,
    private _formBuilder: FormBuilder
    ) 
    {
      dialogRef.disableClose = true;

    }
  



  ngOnInit(): void {
    this.RefundOfBillFormGroup = this.refundForm();

    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log( this.selectedAdvanceObj);
    }
    this.myControl = new FormControl();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(100),
      startWith(''),
      map((value) => (value && value.length >= 1 ? this.filterStates(value) : this.billingServiceList.slice()))
    );

  
    this.getAdmittedDoctorCombo();
    this.getServiceListCombobox();
    this.getBilldetailList();
    // this.serviceDetailForm();
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


  refundForm(): FormGroup {
    return this._formBuilder.group({
      advanceAmt: [Validators.pattern("^[0-9]*$")],
      BillNo: [''],
      NetBillAmount: [Validators.pattern("^[0-9]*$")],
      TotalRefundAmount: ['', [
        Validators.required,
        Validators.pattern("^[0-9]*$")
      
      ]],
      RefundBalAmount: [Validators.pattern("^[0-9]*$")],
      BillDate: [''],
      RefundAmount: [Validators.pattern("^[0-9]*$")],
      Remark: [''],
      // AdmissionId: '',
      RegNo: [''],
      PatientName: [''],
      DoctorId: [''],
      serviceName: [''],
      serviceId: [''],
      Price: [Validators.pattern("^[0-9]*$")],
      Qty: [Validators.pattern("^[0-9]*$")],
      totalAmount: [Validators.pattern("^[0-9]*$")],
      BillingClassId: [''],
      price: [Validators.pattern("^[0-9]*$")],
      qty: [Validators.pattern("^[0-9]*$")],
      DoctorName: [''],
    });
  }



  getBilldetailList() {
    var m_data = {
      "RegId":this.selectedAdvanceObj.RegId
    }
    this.isLoadingStr = 'loading';
    let Query = "Select * from lvwRefundOfBillOPDList where Regid=" + this.selectedAdvanceObj.RegId
    this._opsearchlistService.getOPBillListForRefund(Query).subscribe(Visit => {
      this.dataSource.data = Visit as BillMaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
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
      Price: [''],
      Qty: [''],
      totalAmount: [''],
      advanceAmt: [''],
      BillingClassId: [''],
      price: [''],
      qty: [''],
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
      //  this.calculatePersc();
    }
  }

  onSave() {
    //  debugger;

    this.click=true;
    this.isLoading = 'submit';

    let InsertRefundObj = {};

    InsertRefundObj['RefundId'] = 0;
    InsertRefundObj['RefundDate'] = this.dateTimeObj.date;
    InsertRefundObj['RefundTime'] = this.dateTimeObj.date;
    InsertRefundObj['BillId'] = parseInt(this.RefundOfBillFormGroup.get('BillNo').value);
    InsertRefundObj['AdvanceId'] = 2;
    InsertRefundObj['OPD_IPD_Type'] = 0;
    InsertRefundObj['OPD_IPD_ID'] = this.selectedAdvanceObj.RegId;
    InsertRefundObj['RefundAmount'] = parseInt(this.RefundOfBillFormGroup.get('TotalRefundAmount').value);
    InsertRefundObj['Remark'] = this.RefundOfBillFormGroup.get('Remark').value;
    InsertRefundObj['TransactionId'] = 2;
    InsertRefundObj['AddedBy'] =this.accountService.currentUserValue.user.id,
    InsertRefundObj['IsCancelled'] = 0;
    InsertRefundObj['IsCancelledBy'] = 10;
    InsertRefundObj['IsCancelledDate'] = this.dateTimeObj.date;
    InsertRefundObj['PatientName'] = this.selectedAdvanceObj.PatientName;
    InsertRefundObj['RefundNo'] = 'REF101',//this.RefundOfBillFormGroup.get('BillNo').value;
    InsertRefundObj['BillDate'] = this.dateTimeObj.date;
  
    let RefundDetailarr = [];
    let InsertRefundDetailObj = {};
    console.log(this.dataSource.data);
    this.dataSource.data.forEach((element) => {
      InsertRefundDetailObj['RefundID'] = 0;
      InsertRefundDetailObj['ServiceId'] = 2;
      InsertRefundDetailObj['ServiceAmount'] =20;// parseInt(this.myRefundBillForm.get('totalAmount').value);
      InsertRefundDetailObj['RefundAmount'] = parseInt(this.RefundOfBillFormGroup.get('TotalRefundAmount').value);
      InsertRefundDetailObj['DoctorId'] =1;// this.myRefundBillForm.get('DoctorId').value;// this.selectedAdvanceObj.Doctorname;
      InsertRefundDetailObj['Remark'] = this.RefundOfBillFormGroup.get('Remark').value || '';
      InsertRefundDetailObj['AddBy'] = this.accountService.currentUserValue.user.id,
      InsertRefundDetailObj['ChargesId'] = 1;

      RefundDetailarr.push(InsertRefundDetailObj);
    });

    let AddchargesRefundAmountarr = [];
    let AddchargesRefundAmountObj = {};
    console.log(this.dataSource.data);
    this.dataSource.data.forEach((element) => {

      AddchargesRefundAmountObj['ChargesId'] = 1;
      AddchargesRefundAmountObj['RefundAmount'] =  this.TotalRefundAmount;// this.RefundOfBillFormGroup.get('RefundBalAmount').value;
      AddchargesRefundAmountarr.push(AddchargesRefundAmountObj);
    });
    let PatientHeaderObj = {};

    PatientHeaderObj['Date'] = this.dateTimeObj.date;
    PatientHeaderObj['OPD_IPD_Id'] = this._opsearchlistService.myShowAdvanceForm.get("AdmissionID").value;
    PatientHeaderObj['NetPayAmount'] = this.TotalRefundAmount;
    const insertRefund = new InsertRefund(InsertRefundObj);
    const dialogRef = this._matDialog.open(AdvancePaymentComponent,
      {
        maxWidth: "85vw",
        height: '540px',
        width: '100%',
        data: {
        //  patientName: this._opsearchlistService.myShowAdvanceForm.get("PatientName").value,
        advanceObj: PatientHeaderObj, //this.advanceAmount
        FromName: "Advance-Refund",
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('============================== Refund of Bill ===========');
      let submitData = {
        "insertRefund": insertRefund,
        "insertOPRefundDetails": RefundDetailarr,
        "update_AddCharges_RefundAmount": AddchargesRefundAmountarr,
         "insertOPPayment": result.submitDataPay.ipPaymentInsert
      };

      console.log(submitData);
      this._opsearchlistService.InsertOPRefundBilling(submitData).subscribe(response => {
          if (response) {
          Swal.fire('OP Refund Bill !', 'OP Refund Of Bill data saved Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              let m=response;
              this.getPrint(m);
               this._matDialog.closeAll();
            }
          });
        } else {
          Swal.fire('Error !', 'OP Bill Refund  data not saved', 'error');
        }
        this.isLoading = '';
      });
});
}


  onClose() {
      this.RefundOfBillFormGroup.reset();
      this._matDialog.closeAll();
    }
  getBillingClassCombo(){
      this._opsearchlistService.getClassList({ "Id": this.selectedAdvanceObj.ClassId }).subscribe(data => {
        this.BillingClassCmbList = data;
        this.myserviceForm.get('BillingClassId').setValue(this.BillingClassCmbList[0]);
      });
    }
  getAdmittedDoctorCombo(){
      this._opsearchlistService.getAdmittedDoctorCombo().subscribe(data => {
        this.doctorNameCmbList = data
      });
    }
  updatedVal(e) {
      if(e && e.length >= 2) {
      this.showAutocomplete = true;
    } else {
      this.showAutocomplete = false;
    }
    if (e.length == 0) { this.b_price = ''; this.b_totalAmount = '0'; this.b_netAmount = '0'; this.b_disAmount = '0'; this.b_isPath = ''; this.b_isRad = ''; this.b_IsEditable = '0'; }
  }
  getServiceListCombo() {
    this._opsearchlistService.getserviceCombo().subscribe(data => {
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
    this._opsearchlistService.getBillingServiceList(m_data).subscribe(data => {
      tempObj = data;
      this.billingServiceList = tempObj;
      // console.log(data, 'api data postttttttttt');
    });
  }

  //
  onEdit(row) {
    console.log(row);
        var m_data = {
      "BillNo": row.BillNo,
      "BillDate": row.BillDate,
      "NetBillAmount": row.NetPayableAmt,
      }
    console.log(m_data);
    this.populateoprefund(m_data);
  }

  populateoprefund(employee) {
    this.RefundOfBillFormGroup.patchValue(employee);
  }

  calculateTotalRefund() {
    debugger;
      this.RefundBalAmount = (parseInt(this.NetBillAmount.toString()) - parseInt(this.TotalRefundAmount.toString()))
      // this.b_netAmount = this.b_totalAmount;
      console.log( this.RefundBalAmount);
    
  }




  convertToWord(e){
    // this.numberInWords= converter.toWords(this.mynumber);
    //  return converter.toWords(e);
       }

  getTemplate() {
    let query = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=9';
    this._BrowseOPDReturnsService.getTemplate(query).subscribe((resData: any) => {
      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['HospitalName','HospitalAddress','Phone','PBillNo','RegNo','RefundNo','RefundAmount','RefundDate','PaymentDate','PatientName','Age','GenderName','Remark','AddedBy']; // resData[0].TempKeys;
        for (let i = 0; i < keysArray.length; i++) {
          let reString = "{{" + keysArray[i] + "}}";
          let re = new RegExp(reString, "g");
          this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
        }
        this.printTemplate = this.printTemplate.replace('StrRefundAmountInWords', this.convertToWord(this.reportPrintObj.RefundAmount));
        this.printTemplate = this.printTemplate.replace('StrBillDates', this.transform1(this.reportPrintObj.PaymentDate));
        this.printTemplate = this.printTemplate.replace('StrPaymentDate', this.transform1(this.reportPrintObj.PaymentDate));
        this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
        this.printTemplate = this.printTemplate.replace('StrBillAmount','₹' + (this.reportPrintObj.RefundAmount.toFixed(2)));
        this.printTemplate = this.printTemplate.replace('StrRefundAmount','₹' + (this.reportPrintObj.RefundAmount.toFixed(2)));
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
  value = datePipe.transform(value, 'dd/MM/yyyy');
   return value;
}

transform2(value: string) {
  var datePipe = new DatePipe("en-US");
  value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
  return value;
}


getPrint(el) {
 console.log(el);
 
  var D_data = {
   //"RefundId":el,
    "RefundId":el,
  }
  console.log(el);
  let printContents; 
  this.subscriptionArr.push(
    this._BrowseOPDReturnsService.getBrowseOPDReturnReceiptList(D_data).subscribe(res => {
      if(res){
      this.reportPrintObj = res[0] as RefundMaster;
      console.log(this.reportPrintObj);
     }
    
     console.log(this.reportPrintObj);
      this.getTemplate();
      
      
    })
  );
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
    popupWin.document.close();
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
  RefundID: any;
  ServiceId: number;
  ServiceAmount: number;
  RefundAmount: number;
  DoctorId: number;
  Remark: String;
  AddBy: number;
  ChargesId: number;

  constructor(InsertRefundDetailObj) {
    {
      this.RefundID = InsertRefundDetailObj.RefundID || 0;
      this.ServiceId = InsertRefundDetailObj.ServiceId || 0;
      this.ServiceAmount = InsertRefundDetailObj.ServiceAmount || 0;
      this.RefundAmount = InsertRefundDetailObj.RefundAmount || 0;
      this.DoctorId = InsertRefundDetailObj.DoctorId || 0;
      this.Remark = InsertRefundDetailObj.Remark || '';
      this.AddBy = InsertRefundDetailObj.AddBy || 0;
      this.ChargesId = InsertRefundDetailObj.ChargesId || 0;

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
  ChargesID: number;
  BillDate: any;
  PaidAmt: number;
  BalanceAmt: number;

  constructor(BillMaster) {
    {
      this.BillNo = BillMaster.BillNo || 0;
      this.TotalAmt = BillMaster.TotalAmt || 0;
      this.ChargesID = BillMaster.ChargesID || 0;
      this.BillDate = BillMaster.BillDate || '';
      this.PaidAmt = BillMaster.PaidAmt || 0;
      this.BalanceAmt = BillMaster.BalanceAmt || 0;
    }
  }
}
