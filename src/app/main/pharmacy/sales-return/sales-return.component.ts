import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Printsal } from '../sales/sales.component';
import { SalesReturnService } from './sales-return.service';
import { OperatorComparer } from 'app/core/models/gridRequest';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';


@Component({
  selector: 'app-sales-return',
  templateUrl: './sales-return.component.html',
  styleUrls: ['./sales-return.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class SalesReturnComponent implements OnInit {
    displayedColumns = [ 
    'Date',
    'SalesNo',
    'RegNo',
    'PatientName',
    'patientType',
    'TotalAmount',
    'PaidType',
  ]; 
  dspSalesDetColumns = [ 
    'ItemName',
    'BatchNo', 
    'Qty', 
    'TotalAmount', 
    'DiscPer', 
  ] 
  dspSalesDetselectedColumns = [ 
    'ItemName',
    'BatchNo',
    'BatchExpDate',
    'Qty',
    'ReturnQty', 
    'UnitMRP',
    'TotalAmount',
    'DiscPer',
    'DiscAmount', 
    'VatPer', 
    'GrossAmount',
    'LandedPrice',
    'TotalLandedAmount', 
    'CGSTPer',
    'CGSTAmount',
    'SGSTPer',
    'SGSTAmount',
    'IGSTPer',
    'IGSTAmount', 
    "buttons", 
  ]

  isLoadingStr: string = '';
  isLoading: String = ''; 
  @ViewChild('billSalesReturn') billSalesReturn:ElementRef; 
  autocompletestore: string = "Store"; 
  dateTimeObj: any; 
  Itemselectedlist: any = [];   
  screenFromString = 'payment-form';  
  reportPrintObj: Printsal; 
  subscriptionArr: Subscription[] = [];
  reportPrintObjList: Printsal[] = []; 
  currentDate =new Date();   
  PaymentType: any; 
  SearchForm: FormGroup;
  IPSalesRetFooterform: FormGroup;

    //   // sales bill lsit
  FromDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")
  ToDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")
  StoreId1 =this._loggedService.currentUserValue.user.storeId || 0;
  isShowDetailTable: boolean = false;
  OpIpType: any = "0";
  salesNo: any = "0";
  regNo: any = "0"; 
  firstName: any = "%";
  LastName: any = "%";
  selcteditemObj:any;

  dssaleList = new MatTableDataSource<SaleBillList>();
  dssaleDetailList = new MatTableDataSource<SalesDetailList>();
  selectedssaleDetailList = new MatTableDataSource<SalesDetailList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(
    public _SalesReturnService: SalesReturnService,
    public _matDialog: MatDialog, 
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private _loggedService: AuthenticationService,
    public toastr : ToastrService,
    public _FormvalidationserviceService:FormvalidationserviceService
  ) { this.SearchForm = this.SearchFilter();
    this.IPSalesRetFooterform = this.Returnform();}

  ngOnInit(): void {
    this.SearchForm.markAllAsTouched();
     this.IPSalesRetFooterform.markAllAsTouched(); 
    this.getSalesList(); 
  } 
    SearchFilter(): FormGroup {
    return this.formBuilder.group({ 
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo: '',
      F_Name: '',
      L_Name: '',
      SalesNo: '',
     StoreId: [this._loggedService.currentUserValue.user.storeId],
    })
  } 
  Returnform() {
    return this.formBuilder.group({
      NetAmt:[0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]] ,
      ReturnAmt: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]] ,
      TotDiscAmount:0,
      TotalAmt:[0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]] ,
      GSTAmount:0
    });
  } 
  IpSalesReturnForm:FormGroup;
    CreateSalesReturnForm() {
      return this.formBuilder.group({
        //sales return header  
        salesReturn: this.formBuilder.group({
          salesReturnId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          date: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
          time: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
          salesId: [this.selcteditemObj.SalesId, [this._FormvalidationserviceService.onlyNumberValidator()]],
          opIpId: [this.selcteditemObj.OP_IP_ID, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
          opIpType: [1],
          totalAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
          vatAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          discAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          netAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
          paidAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          balanceAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          isSellted: false,
          isPrint: true,
          isFree: false,
          unitId: [1, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
          addedBy: [this._loggedService.currentUserValue.userId],
          storeId: [this._loggedService.currentUserValue.user.storeId, [this._FormvalidationserviceService.onlyNumberValidator()]],
          narration: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],//need to set concession reason
        }),
        // sales return details in array
        salesReturnDetails: this.formBuilder.array([]),
        // Current stock in array
        currentStock: this.formBuilder.array([]),
        // sales details update in array
        salesDetail: this.formBuilder.array([]),
        //Payment form
        payment: this.formBuilder.group({
          paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          billNo: [this.selcteditemObj.SalesId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
          paymentDate: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
          paymentTime: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
          cashPayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          chequePayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          chequeNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
          bankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
          chequeDate: ['1999-01-01'],
          cardPayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          cardNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
          cardBankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
          cardDate: ['1999-01-01'],
          advanceUsedAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          transactionType: [5, [this._FormvalidationserviceService.onlyNumberValidator()]],
          remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
          addBy: [this._loggedService.currentUserValue.userId],
          isCancelled: [false],
          isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          isCancelledDate: ['1999-01-01'],
          opdipdType: [3, [this._FormvalidationserviceService.onlyNumberValidator()]],
          neftpayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          neftno: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
          neftbankMaster: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
          neftdate: ['1999-01-01'],
          payTmamount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          payTmtranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
          payTmdate: ['1999-01-01'],
        })
      });
    }
    createSalesretDetails(element: any): FormGroup {
      return this.formBuilder.group({
        salesReturnID: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        itemId: [element.ItemId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        batchNo: [element.BatchNo, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        batchExpDate: [this.datePipe.transform(element.BatchExpDate, "yyyy-MM-dd"), [this._FormvalidationserviceService.onlyNumberValidator()]],
        unitMrp: [element.UnitMRP, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        qty: [element.ReturnQty, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        totalAmount: [element.TotalAmount, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        vatPer: [element.VatPer, [this._FormvalidationserviceService.onlyNumberValidator()]],
        vatAmount: [element.VatAmount, [this._FormvalidationserviceService.onlyNumberValidator()]],
        discPer: [element.DiscPer, [this._FormvalidationserviceService.onlyNumberValidator()]],
        discAmount: [element.DiscAmount, [this._FormvalidationserviceService.onlyNumberValidator()]],
        grossAmount: [element.GrossAmount, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        landedPric: [element.LandedPrice, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        totalLandedAmount: [element.TotalLandedAmount, [this._FormvalidationserviceService.onlyNumberValidator()]],
        purRate: [element.PurRateWf, [this._FormvalidationserviceService.onlyNumberValidator()]],
        purTot: [element.PurTotAmt, [this._FormvalidationserviceService.onlyNumberValidator()]],
        salesId: [this.selcteditemObj.SalesId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        salesDetId: [element.SalesDetId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        isCashOrCredit: [element.isCashOrCredit, [this._FormvalidationserviceService.onlyNumberValidator()]],
        cgstper: [element.CGSTPer, [this._FormvalidationserviceService.onlyNumberValidator()]],
        cgstamt: [element.CGSTAmount, [this._FormvalidationserviceService.onlyNumberValidator()]],
        sgstper: [element.SGSTPer,[this._FormvalidationserviceService.onlyNumberValidator()]],
        sgstamt: [element.SGSTAmount,[this._FormvalidationserviceService.onlyNumberValidator()]],
        igstper: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        igstamt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        stkId: [element.StkID, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      })   
    }
    createcurrentStock(element: any): FormGroup {
      return this.formBuilder.group({
        itemId: [element?.ItemId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        issueQty: [element?.ReturnQty ?? 0, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        storeId: [this._loggedService.currentUserValue.storeId],
        istkId: [element?.StkID ?? 0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      });
    }
    createSalesDetails(element: any): FormGroup {
      return this.formBuilder.group({
        salesDetId: [element.SalesDetId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        returnQty: [element.ReturnQty, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      });
    }
    // Getters 
    get SaleRetDetailsArray(): FormArray {
      return this.IpSalesReturnForm.get('salesReturnDetails') as FormArray;
    }
    get currentStockArray(): FormArray {
      return this.IpSalesReturnForm.get('currentStock') as FormArray;
    }
    get SalesDetArray(): FormArray {
      return this.IpSalesReturnForm.get('salesDetail') as FormArray;
    }
getbillllist(){  
    this.firstName = this.SearchForm.get('F_Name').value + '%' || '%',
    this.LastName = this.SearchForm.get('L_Name').value + '%' || '%',
    this.StoreId1 =this.SearchForm.get('StoreId').value || 0,
    this.FromDate = this.datePipe.transform(this.SearchForm.get('startdate').value, "yyyy-MM-dd") || '1900-01-01',
    this.ToDate = this.datePipe.transform(this.SearchForm.get('enddate').value, "yyyy-MM-dd") || '1900-01-01',
    this.regNo = this.SearchForm.get('RegNo').value || 0,
    this.salesNo =this.SearchForm.get('SalesNo').value || 0  
    this.getSalesList();
}
  getSalesList() {
    this.dssaleDetailList.data = [];
    this.selectedssaleDetailList.data = []; 
    this.Itemselectedlist = [];  
    debugger
    var vdata = { 
    "first": 0,
    "rows": 10,
    "sortField": "SalesId",
    "sortOrder": 0,
    "filters": [
      { "fieldName": "FName", "fieldValue":  this.firstName, "opType": "Equals" },
      { "fieldName": "LName", "fieldValue": this.LastName, "opType": "Equals" },
      { "fieldName": "FromDt", "fieldValue": this.FromDate, "opType": "Equals" },
      { "fieldName": "ToDt", "fieldValue":this.ToDate, "opType": "Equals" },
      { "fieldName": "RegNo", "fieldValue":String(this.regNo), "opType": "Equals" },
      { "fieldName": "SalesNo", "fieldValue": String(this.salesNo), "opType": "Equals" },
      { "fieldName": "OPIPType", "fieldValue": "3", "opType": "Equals" },
      { "fieldName": "StoreId", "fieldValue": String(this.StoreId1), "opType": "Equals" }
    ],
    "exportType": "JSON",
    "columns": [
      { "data": "string",  "name": "string" }
    ] 
    }
    setTimeout(() => {
      this.isLoadingStr = 'loading';
      this._SalesReturnService.getSalesBillList(vdata).subscribe((response) => {
          this.dssaleList.data = response.data as SaleBillList[];
          console.log(this.dssaleList.data);
          this.dssaleList.sort = this.sort;
          this.dssaleList.paginator = this.paginator;
          this.isLoadingStr = this.dssaleList.data.length == 0 ? 'no-data' : '';
        },
        (error) => {
          this.isLoading = 'list-loaded';
        }
      );
    }, 1000);
  }
 onSelect(Parama) {  
    console.log(Parama);
    this.dssaleDetailList.data = [];
    this.selectedssaleDetailList.data = []; 
    this.Itemselectedlist =[]; 
    this.PaymentType=Parama.paidType
 
    let storeID = this.SearchForm.get('StoreId').value 
    const Filters = [
      { "fieldName": "SalesId", "fieldValue": String(Parama.regNo), "opType": "Equals" },
      { "fieldName": "StoreId", "fieldValue": String(storeID), "opType": "Equals" },
      { "fieldName": "SalesNo", "fieldValue": "%", "opType": "Equals" },
      { "fieldName": "CashCounterId", "fieldValue": "0", "opType": "Equals" }


      //  { "fieldName": "SalesId", "fieldValue": String(Parama?.salesId), "opType": "Equals" },
      // { "fieldName": "StoreId", "fieldValue": String(storeID), "opType": "Equals" },
      // { "fieldName": "SalesNo", "fieldValue": String(Parama?.salesNo), "opType": "Equals" },
      // { "fieldName": "CashCounterId", "fieldValue": String(Parama?.cashCounterID), "opType": "Equals" }
      //SalesReturnCash
      //SalesReturnCredit 
    ]
  
    if (Parama.paidType == 'Paid') {
      var vdata = {
        "searchFields": Filters,
        "mode": "IPSalesReturnCash"
      }
    }
    else {
      var vdata = {
        "searchFields": Filters,
        "mode": "IPSalesReturnCredit"
      }
    } 
      setTimeout(() => {
      this.isLoadingStr = 'loading';
      this._SalesReturnService.getSalesDetCash_CreditList(vdata).subscribe((data) => {
          this.dssaleDetailList.data = data as SalesDetailList[];
          console.log(this.dssaleDetailList.data)
          this.isLoadingStr = this.dssaleDetailList.data.length == 0 ? 'no-data' : '';
        },
        (error) => {
          this.isLoading = 'list-loaded';
        }
      );
    }, 1000);
  } 

  SelectedItem(contact) { 
    this.selcteditemObj = contact

    if (parseInt(contact.Qty) == 0) {
      Swal.fire({
        icon: "warning",
        title: "Selected Item Qty is '0'",
        showConfirmButton: false,
        timer: 2000
      });
      return
    }
    if (this.selectedssaleDetailList.data.length > 0) {
      if (this.selectedssaleDetailList.data.find(item => item.ItemId == contact.ItemId)) {
        Swal.fire({
          icon: "warning",
          title: "Selected Item already added in list",
          showConfirmButton: false,
          timer: 2000
        });
        return
      }
    }
    let CGSTAmount = (((parseFloat(contact.UnitMRP) * (parseFloat(contact.CGSTPer))) / 100) * parseInt(contact.Qty)).toFixed(2);
    let SGSTAmount = (((parseFloat(contact.UnitMRP) * (parseFloat(contact.SGSTPer))) / 100) * parseInt(contact.Qty)).toFixed(2);
    let IGSTAmount = ((((parseFloat(contact.UnitMRP) * (parseFloat(contact.IGSTPer))) / 100)) * parseInt(contact.Qty)).toFixed(2);
    this.Itemselectedlist.push(
      {
        ItemId: contact.ItemId,
        ItemName: contact.ItemName,
        BatchNo: contact.BatchNo,
        BatchExpDate: contact.BatchExpDate,
        Qty: contact.Qty,
        ReturnQty: contact.Qty,
        UnitMRP: contact.UnitMRP,
        TotalAmount: contact.TotalAmount,
        VatPer: contact.VatPer,
        VatAmount: contact.VatAmount,
        DiscPer: contact.DiscPer,
        DiscAmount: contact.DiscAmount,
        GrossAmount: contact.GrossAmount,
        LandedPrice: contact.LandedPrice,
        TotalLandedAmount: contact.TotalLandedAmount,
        PurRateWf: contact.PurRateWf,
        PurTotAmt: contact.PurTotAmt,
        CGSTPer: contact.CGSTPer,
        CGSTAmount: CGSTAmount,
        SGSTPer: contact.SGSTPer,
        SGSTAmount: SGSTAmount,
        IGSTPer: contact.IGSTPer,
        IGSTAmount: IGSTAmount,
        IsPurRate: contact.IsPurRate,
        SalesNo: contact.SalesNo,
        SalesId: contact.SalesId,
        SalesDetId: contact.SalesDetId,
        OP_IP_ID: contact.OP_IP_ID,
        StkID: contact.StkID
      });
    this.selectedssaleDetailList.data = this.Itemselectedlist;
    this.getUpdateTotalAmtSum()
    this.IpSalesReturnForm = this.CreateSalesReturnForm();
  }
  deleteTableRow(element) {
    let index = this.Itemselectedlist.indexOf(element);
    if (index >= 0) {
      this.Itemselectedlist.splice(index, 1);
      this.selectedssaleDetailList.data = [];
      this.selectedssaleDetailList.data = this.Itemselectedlist;
    }
    Swal.fire('Success !', 'Item Row Deleted Successfully', 'success');
    this.getUpdateTotalAmtSum()
  }
  getUpdateTotalAmtSum() {
    const itemlist = this.selectedssaleDetailList.data
    let TotalAmt= itemlist.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0).toFixed(2);
    let NetAmt = itemlist.reduce((sum, { GrossAmount }) => sum += +(GrossAmount || 0), 0).toFixed(2);
    let DiscAmount = itemlist.reduce((sum, { DiscAmount }) => sum += +(DiscAmount || 0), 0).toFixed(2);
    let GSTAmount = itemlist.reduce((sum, { VatAmount }) => sum += +(VatAmount || 0), 0).toFixed(2);
    this.IPSalesRetFooterform.patchValue({
      NetAmt: NetAmt,
      ReturnAmt: NetAmt,
      TotDiscAmount:DiscAmount,
      TotalAmt:TotalAmt,
      GSTAmount:GSTAmount
    }) 
  }
  //table calculation
  getCellCalculation(contact, ReturnQty) { 
    if ((ReturnQty) > (contact.Qty)) { 
      contact.ReturnQty = '';
      contact.TotalAmount = 0;
      contact.DiscAmount =  0;
      contact.VatAmount =  0;
      contact.CGSTAmount =  0;
      contact.SGSTAmount =  0;
      contact.IGSTAmount =  0;
      contact.GrossAmount =  0;
      contact.TotalLandedAmount =  0;
      Swal.fire({
        icon: "warning",
        title: "Return Qty cannot be greater than BalQty",
        showConfirmButton: false,
        timer: 2000
      });
      return 
    }
    else if((ReturnQty) <= (contact.Qty)) {  
      contact.TotalAmount = (parseFloat(contact.UnitMRP) * parseInt(ReturnQty)).toFixed(2);
      contact.DiscAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.DiscPer)) / 100).toFixed(2);
      contact.VatAmount =  ((parseFloat(contact.TotalAmount) * (parseFloat(contact.VatPer)) / 100)).toFixed(2);
      contact.CGSTAmount = (((parseFloat(contact.TotalAmount) * (parseFloat(contact.CGSTPer))) / 100)).toFixed(2);
      contact.SGSTAmount = (((parseFloat(contact.TotalAmount) * (parseFloat(contact.SGSTPer))) / 100)).toFixed(2);
      contact.IGSTAmount = ((((parseFloat(contact.TotalAmount)* (parseFloat(contact.IGSTPer))) / 100))).toFixed(2); 
      contact.GrossAmount = (parseFloat(contact.TotalAmount) - (parseFloat(contact.DiscAmount))).toFixed(2);
      contact.TotalLandedAmount = (parseFloat(contact.LandedPrice) * parseInt(ReturnQty)).toFixed(2); 
     // this.PurAmt = (parseFloat(contact.PurRateWf) * parseInt(this.RQty)).toFixed(2); 
    }
    else if(ReturnQty == '' || ReturnQty == null || ReturnQty == undefined || ReturnQty == 0 ) {
      contact.TotalAmount = 0;
      contact.DiscAmount =  0;
      contact.VatAmount =  0;
      contact.CGSTAmount =  0;
      contact.SGSTAmount =  0;
      contact.IGSTAmount =  0;
      contact.GrossAmount =  0;
      contact.TotalLandedAmount =  0;

        Swal.fire({
        icon: "warning",
        title: "Return Qty cannot be greater than BalQty",
        showConfirmButton: false,
        timer: 2000
      });
      return 
    } 
  }  
   //Save code 
   onSave() {
 debugger
     const formValues = this.IPSalesRetFooterform.value
     if (!(this.dssaleList.data.length>0)) {
       this.toastr.warning('Please select bill', 'Warning !', {
         toastClass: 'tostr-tost custom-toast-warning',
       });
       return
     } 
        if ((!this.dssaleDetailList.data.length)) {
       this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
         toastClass: 'tostr-tost custom-toast-warning',
       });
       return;
     }  
     if (!(this.selcteditemObj.SalesId > 0 && this.selcteditemObj.OP_IP_ID > 0)) {
       this.toastr.warning('Please select item name', 'Warning !', {
         toastClass: 'tostr-tost custom-toast-warning',
       });
       return;
     } 
     if (!this.isValidForm()) {
       Swal.fire({
         icon: "warning",
         title: "Please enter ReturnQty Without ReturnQty Cannot perform save operation.",
         showConfirmButton: false,
         timer: 2000
       });
       return;
     }  
     Swal.fire({
       title: 'Do you want to Save the Sales Return',
       text: "You won't be able to revert this!",
       icon: "warning",
       showCancelButton: true,
       confirmButtonColor: "#3085d6",
       cancelButtonColor: "#d33",
       confirmButtonText: "Yes, Save !"
 
     }).then((result) => {
       /* Read more about isConfirmed, isDenied below */
       if (result.isConfirmed) {
         this.onSavePayment();
       }
     })
   } 
     onSavePayment() {
     const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');  

    this.IpSalesReturnForm.get('salesReturn.date').setValue(formattedDate)
    this.IpSalesReturnForm.get('salesReturn.time').setValue(formattedTime)
    this.IpSalesReturnForm.get('salesReturn.totalAmount')?.setValue(Number(Math.round(this.IPSalesRetFooterform.get('TotalAmt').value)))
    this.IpSalesReturnForm.get('salesReturn.vatAmount')?.setValue(Number(Math.round(this.IPSalesRetFooterform.get('GSTAmount').value)))
    this.IpSalesReturnForm.get('salesReturn.discAmount')?.setValue(Number(Math.round(this.IPSalesRetFooterform.get('TotDiscAmount').value)))
    this.IpSalesReturnForm.get('salesReturn.netAmount')?.setValue(Number(Math.round(this.IPSalesRetFooterform.get('NetAmt').value)))

    if (this.IpSalesReturnForm.valid) {
      this.SaleRetDetailsArray.clear()
      this.currentStockArray.clear()
      this.SalesDetArray.clear()
      this.selectedssaleDetailList.data.forEach((element) => {
        this.SaleRetDetailsArray.push(this.createSalesretDetails(element));
        this.currentStockArray.push(this.createcurrentStock(element));
        this.SalesDetArray.push(this.createSalesDetails(element));
      });
      if (this.PaymentType == 'Paid') {
        this.IpSalesReturnForm.get('salesReturn.paidAmount').setValue(Number(Math.round(this.IPSalesRetFooterform.get('NetAmt').value)))
        this.IpSalesReturnForm.get('salesReturn.balanceAmount').setValue(0)
        this.IpSalesReturnForm.get('payment.paymentDate').setValue(formattedDate)
        this.IpSalesReturnForm.get('payment.paymentTime').setValue(formattedTime)
        this.IpSalesReturnForm.get('payment.cashPayAmount').setValue(Number(Math.round(this.IPSalesRetFooterform.get('NetAmt').value)))

        console.log(this.IpSalesReturnForm.value);
        this._SalesReturnService.InsertCashSalesReturn(this.IpSalesReturnForm.value).subscribe(response => {
          this.OnReset();
        });
      }
      else {
        this.IpSalesReturnForm.get('salesReturn.paidAmount').setValue(0)
        this.IpSalesReturnForm.get('salesReturn.balanceAmount').setValue(Number(Math.round(this.IPSalesRetFooterform.get('NetAmt').value)))
        this.IpSalesReturnForm.get('payment.paymentDate').setValue(formattedDate)
        this.IpSalesReturnForm.get('payment.paymentTime').setValue(formattedTime)

        console.log(this.IpSalesReturnForm.value);
        this._SalesReturnService.InsertCreditSalesReturn(this.IpSalesReturnForm.value).subscribe(response => {
          this.OnReset();
        });
      }
    } else {
      let invalidFields = [];
      if (this.IpSalesReturnForm.invalid) {
        for (const controlName in this.IpSalesReturnForm.controls) {
          const control = this.IpSalesReturnForm.get(controlName);
          if (control instanceof FormGroup || control instanceof FormArray) {
            for (const nestedKey in control.controls) {
              if (control.get(nestedKey)?.invalid) {
                invalidFields.push(`Sales Return Data : ${controlName}.${nestedKey}`);
              }
            }
          } else if (control?.invalid) {
            invalidFields.push(`Sales Return From: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
          );
        });
        return
      }
    }
  } 
   onSavePaymentold() {
     const currentDate = new Date();
     const datePipe = new DatePipe('en-US');
     const formattedTime = datePipe.transform(currentDate, 'shortTime');
     const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
 
     let salesReturnHeader = {};
     salesReturnHeader['date'] = formattedDate;
     salesReturnHeader['time'] = formattedTime;
     salesReturnHeader['salesId'] = this.selcteditemObj.SalesId || 0;
     salesReturnHeader['opIpId'] =  this.selcteditemObj.OP_IP_ID || 0;
     salesReturnHeader['opIpType'] = 1;
     salesReturnHeader['totalAmount'] = this.IPSalesRetFooterform.get('TotalAmt').value || 0;
     salesReturnHeader['vatAmount'] = this.IPSalesRetFooterform.get('GSTAmount').value || 0;
     salesReturnHeader['discAmount'] = this.IPSalesRetFooterform.get('TotDiscAmount').value || 0;
     salesReturnHeader['netAmount'] = Math.round(this.IPSalesRetFooterform.get('ReturnAmt').value) || 0;
     if (this.PaymentType == 'Paid') {
       salesReturnHeader['paidAmount'] = Math.round(this.IPSalesRetFooterform.get('ReturnAmt').value ) || 0;
       salesReturnHeader['balanceAmount'] = 0;
     } else {
       salesReturnHeader['paidAmount'] = 0;
       salesReturnHeader['balanceAmount'] = Math.round(this.IPSalesRetFooterform.get('ReturnAmt').value ) || 0;
     }
     salesReturnHeader['isSellted'] = false;
     salesReturnHeader['isPrint'] = true,
     salesReturnHeader['isFree'] = false;
     salesReturnHeader['unitId'] = 1;
     salesReturnHeader['addedBy'] = this._loggedService.currentUserValue.userId;
     salesReturnHeader['storeId'] = this._loggedService.currentUserValue.user.storeId,
     salesReturnHeader['narration'] = "";
     salesReturnHeader['salesReturnId'] = 0  
     
  
     let salesReturnDetailInsertCreditarr = [];
     this.selectedssaleDetailList.data.forEach((element) => {
       let salesReturnDetailCredit = {}; 
       salesReturnDetailCredit['salesReturnID'] = 0;
       salesReturnDetailCredit['itemId'] = element.ItemId || 0;
       salesReturnDetailCredit['batchNo'] = element.BatchNo || '';
       salesReturnDetailCredit['batchExpDate'] =this.datePipe.transform(element.BatchExpDate , "yyyy-MM-dd") || '1900-01-01'; 
       salesReturnDetailCredit['unitMRP'] = element.UnitMRP || 0;
       salesReturnDetailCredit['qty'] = element.ReturnQty || 0;
       salesReturnDetailCredit['totalAmount'] = element.TotalAmount || 0;
       salesReturnDetailCredit['vatPer'] = element.VatPer || 0;
       salesReturnDetailCredit['vatAmount'] = element.VatAmount || 0;
       salesReturnDetailCredit['discPer'] = element.DiscPer || 0;
       salesReturnDetailCredit['discAmount'] = element.DiscAmount || 0;
       salesReturnDetailCredit['grossAmount'] = element.GrossAmount || 0;
       salesReturnDetailCredit['landedPrice'] = element.LandedPrice || 0;
       salesReturnDetailCredit['totalLandedAmount'] = element.TotalLandedAmount || 0;
       salesReturnDetailCredit['purRate'] = element.PurRateWf || 0;
       salesReturnDetailCredit['purTot'] = element.PurTotAmt || 0;
       salesReturnDetailCredit['salesId'] =  element.SalesId || 0;
       salesReturnDetailCredit['salesDetId'] = element.SalesDetId || 0;
       let isCashOrCredit
       if (this.PaymentType == 'Paid') {
         isCashOrCredit = 0;
       } else {
         isCashOrCredit = 1;
       }
       salesReturnDetailCredit['isCashOrCredit'] = isCashOrCredit;
       salesReturnDetailCredit['cgstPer'] =  element.CGSTPer  || 0;
       salesReturnDetailCredit['cgstAmt'] =  element.CGSTAmount || 0;
       salesReturnDetailCredit['sgstPer'] = element.SGSTPer || 0;
       salesReturnDetailCredit['sgstAmt'] = element.SGSTAmount || 0;
       salesReturnDetailCredit['igstPer'] = 0;
       salesReturnDetailCredit['igstAmt'] = 0;
       salesReturnDetailCredit['stkId'] = element.StkID || 0;
       salesReturnDetailInsertCreditarr.push(salesReturnDetailCredit);
     }); 

     let updateCurrStkSales = [];
     this.selectedssaleDetailList.data.forEach((element) => {
       let updateCurStkSalesObj = {};
       updateCurStkSalesObj['itemId'] = element.ItemId;
       updateCurStkSalesObj['issueQty'] = element.ReturnQty;
       updateCurStkSalesObj['storeId'] = this._loggedService.currentUserValue.storeId,
       updateCurStkSalesObj['istkId'] = element.StkID;
       updateCurrStkSales.push(updateCurStkSalesObj);
     });
 
     let Update_SalesReturnQtySalesTblarray = [];
     this.selectedssaleDetailList.data.forEach((element) => {
       let Update_SalesReturnQtySalesTbl = {};
       Update_SalesReturnQtySalesTbl['salesDetId'] = element.SalesDetId;
       Update_SalesReturnQtySalesTbl['returnQty'] = element.ReturnQty;
       Update_SalesReturnQtySalesTblarray.push(Update_SalesReturnQtySalesTbl);
     });
 
     let Update_SalesRefundAmt_SalesHeader = {};
     Update_SalesRefundAmt_SalesHeader['salesReturnId'] = 0;
 
     let Cal_GSTAmount_SalesReturn = {};
     Cal_GSTAmount_SalesReturn['salesReturnId'] = 0;
 
     let Insert_ItemMovementReport_Cursor = {};
     Insert_ItemMovementReport_Cursor['id'] = 0;
     Insert_ItemMovementReport_Cursor['typeId'] = 2;
 
     let PaymentInsertobj = {};
     PaymentInsertobj['paymentId'] = 0
     PaymentInsertobj['billNo'] = this.selcteditemObj.SalesId || 0,
     PaymentInsertobj['paymentDate'] = formattedDate;
     PaymentInsertobj['paymentTime'] = formattedTime;
     PaymentInsertobj['cashPayAmount'] = this.IPSalesRetFooterform.get('ReturnAmt').value  || 0;
     PaymentInsertobj['chequePayAmount'] = 0,
     PaymentInsertobj['chequeNo'] = '0',
     PaymentInsertobj['bankName'] = '',
     PaymentInsertobj['chequeDate'] = '1900-01-01',
     PaymentInsertobj['cardPayAmount'] = 0,
     PaymentInsertobj['cardNo'] = '0',
     PaymentInsertobj['cardBankName'] = '',
     PaymentInsertobj['cardDate'] ='1900-01-01',
     PaymentInsertobj['advanceUsedAmount'] = 0;
     PaymentInsertobj['advanceId'] = 0;
     PaymentInsertobj['refundId'] = 0;
     PaymentInsertobj['transactionType'] = 5;
     PaymentInsertobj['remark'] = '',
     PaymentInsertobj['addBy'] = this._loggedService.currentUserValue.userId,
     PaymentInsertobj['isCancelled'] = false;
     PaymentInsertobj['isCancelledBy'] = 0;
     PaymentInsertobj['isCancelledDate'] = '1900-01-01',
     PaymentInsertobj['opdipdType'] = 3;
     PaymentInsertobj['neftpayAmount'] = 0,
     PaymentInsertobj['neftno'] = '0',
     PaymentInsertobj['neftbankMaster'] = '',
     PaymentInsertobj['neftdate'] = '1900-01-01',
     PaymentInsertobj['payTmamount'] = 0,
     PaymentInsertobj['payTmtranNo'] = '0',
     PaymentInsertobj['payTmdate'] = '1900-01-01'
 
     if(this.PaymentType == 'Paid') {
       let submitData = {
         "salesReturn": salesReturnHeader,
         "salesReturnDetails": salesReturnDetailInsertCreditarr,
         "currentStock": updateCurrStkSales,
         "salesDetail": Update_SalesReturnQtySalesTblarray,
         "tSalesReturn": Update_SalesRefundAmt_SalesHeader,
         "tSalesReturns": Cal_GSTAmount_SalesReturn,
         "salesHeader": Insert_ItemMovementReport_Cursor,
         "payment": PaymentInsertobj
       };
       console.log(submitData);
       this._SalesReturnService.InsertCashSalesReturn(submitData).subscribe(response => {
         if (response) {
           console.log(response);
           this.getSalesRetPrint(response); 
            this.OnReset();
         }
       }); 
     }
     else {
       let submitData = {
         "salesReturn": salesReturnHeader,
         "salesReturnDetails": salesReturnDetailInsertCreditarr,
         "currentStock": updateCurrStkSales,
         "salesDetail": Update_SalesReturnQtySalesTblarray,
         "tSalesReturn": Update_SalesRefundAmt_SalesHeader,
         "tSalesReturns": Cal_GSTAmount_SalesReturn,
         "salesHeader": Insert_ItemMovementReport_Cursor
       };
       console.log(submitData);
       this._SalesReturnService.InsertCreditSalesReturn(submitData).subscribe(response => {
         if (response) {
           console.log(response);
           this.getSalesRetPrint(response); 
           this.OnReset();
         }
       });
     }
   }
  
  onClose() {
    this.Itemselectedlist = [];
    this.selectedssaleDetailList.data = [];
  }
  OnReset() {
    this.IPSalesRetFooterform.reset(); 
    this.selectedssaleDetailList.data = [];
    this.Itemselectedlist = [];  
    this.dssaleDetailList.data = [];
    this.selcteditemObj = '' ; 
    this.IPSalesRetFooterform.markAllAsTouched(); 
  } 
   isValidForm(): boolean {
    return this.selectedssaleDetailList.data.every((i) => i.ReturnQty > 0);
  } 


  transform2(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    return value;
  } 
  //print
  getSalesRetPrint(el) {
    var D_data = {
      "SalesID": el,
      "OP_IP_Type": 2//this.OP_IP_Type,
    }
    let printContents;
    this.subscriptionArr.push(
      this._SalesReturnService.getSalesReturnPrint(D_data).subscribe(res => {
        this.reportPrintObjList = res as Printsal[];
        // console.log(this.reportPrintObjList);
        this.reportPrintObj = res[0] as Printsal;
        console.log(this.reportPrintObj);
        setTimeout(() => {
          this.print3();
        }, 1000);
      })
    );
  }
  print3() {
    let popupWin, printContents;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');

    popupWin.document.write(` <html>
    <head><style type="text/css">`);
    popupWin.document.write(`
      </style>
      <style type="text/css" media="print">
    @page { size: portrait; }
  </style>
          <title></title>
      </head>
    `);
    popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.billSalesReturn.nativeElement.innerHTML}</body>
    <script>
      var css = '@page { size: portrait; }',
      head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');
      style.type = 'text/css';
      style.media = 'print';
  
      if (style.styleSheet){
          style.styleSheet.cssText = css;
      } else {
          style.appendChild(document.createTextNode(css));
      }
      head.appendChild(style);
    </script>
    </html>`);
    // popupWin.document.write(`<body style="margin:0;font-size: 16px;">${this.printTemplate}</body>
    // </html>`);

    popupWin.document.close();
  } 

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }  
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }  

    getValidationMessages() {
    return {
      RegNo: [
        // { name: "required", Message: "SupplierId is required" }
      ],
      IPDNo: [
        // { name: "required", Message: "SupplierId is required" }
      ],
      F_Name: [
        // { name: "required", Message: "Item Name is required" }
      ],
      M_Name: [
        // { name: "required", Message: "Batch No is required" }
      ],
      L_Name: [
        // { name: "required", Message: "Invoice No is required" }
      ],
      SalesNo: [
        // { name: "required", Message: "Invoice No is required" }
      ],
      StoreId: [
        // { name: "required", Message: "Invoice No is required" }
      ]

    };
  }
}

export class SaleBillList {
  SalesId: number;
  Date: Date;
  SalesNo: number;
  RegNo: number;
  PatientName: string;
  TotalAmount: any;
  VatAmount: any;
  DiscAmount: any;
  NetAmount: any;
  BalanceAmount: any;
  PaidAmount: any;
  OP_IP_Type: any;
  PatientType: any;
  PaidType: any;
  IsPrescription: boolean;
  CashCounterID: any;
  /**
   * Constructor
   *
   * @param SaleBillList
   */
  constructor(SaleBillList) {
    {
      this.SalesId = SaleBillList.SalesId || "";
      this.Date = SaleBillList.Date || 0;
      this.SalesNo = SaleBillList.SalesNo || 0;
      this.RegNo = SaleBillList.RegNo || 0;
      this.PatientName = SaleBillList.PatientName || 0;
      this.TotalAmount = SaleBillList.TotalAmount || 0;
      this.VatAmount = SaleBillList.VatAmount || 0;
      this.DiscAmount = SaleBillList.DiscAmount || 0;
      this.NetAmount = SaleBillList.NetAmount || 0;
      this.BalanceAmount = SaleBillList.BalanceAmount || 0;
      this.PaidAmount = SaleBillList.PaidAmount || 0;
      this.OP_IP_Type = SaleBillList.OP_IP_Type || 0;
      this.PatientType = SaleBillList.PatientType || '';
      this.PaidType = SaleBillList.PaidType || '';
      this.IsPrescription = SaleBillList.IsPrescription || '';
      this.CashCounterID = SaleBillList.CashCounterID || 0;
    }
  }
}
export class SalesDetailList {
  SalesId: Number;
  SalesDetId: number;
  SalesNo: string;
  OP_IP_ID: string;
  ItemId: number;
  ItemName: string;
  BatchNo: any;
  BatchExpDate: Date;
  UnitMRP: any;
  Qty: any;
  TotalAmount: any;
  VatPer
  VatAmount: any;
  DiscPer: any;
  DiscAmount: any;
  GrossAmount: any;
  LandedPrice: any;
  TotalLandedAmount: any;
  IsBatchRequired: any;
  PurRateWf: any;
  PurTotAmt: any;
  IsPrescription: any;
  CGSTPer: any;
  CGSTAmount: any;
  SGSTPer: any;
  SGSTAmount: any;
  IGSTPer: any;
  IGSTAmount: any;
  Narration: any;
  IsPurRate: any;
  StkID: any;
  ReturnQty:any;
  /**
   * Constructor
   *
   * @param SalesDetailList
   */
  constructor(SalesDetailList) {
    {
      this.SalesId = SalesDetailList.SalesId || 0;
      this.SalesDetId = SalesDetailList.SalesDetId || 0;
      this.SalesNo = SalesDetailList.SalesNo || 0;
      this.OP_IP_ID = SalesDetailList.OP_IP_ID || 0;
      this.ItemId = SalesDetailList.ItemId || 0;
      this.ItemName = SalesDetailList.ItemName || 0;
      this.BatchNo = SalesDetailList.BatchNo || 0;
      this.BatchExpDate = SalesDetailList.BatchExpDate || 0;
      this.UnitMRP = SalesDetailList.UnitMRP || 0;
      this.Qty = SalesDetailList.Qty || 0;
      this.TotalAmount = SalesDetailList.TotalAmount || 0;
      this.VatPer = SalesDetailList.VatPer || 0;
      this.VatAmount = SalesDetailList.VatAmount || 0;
      this.DiscPer = SalesDetailList.DiscPer || 0;
      this.DiscAmount = SalesDetailList.DiscAmount || 0;
      this.GrossAmount = SalesDetailList.GrossAmount || 0;
      this.LandedPrice = SalesDetailList.LandedPrice || 0;
      this.TotalLandedAmount = SalesDetailList.TotalLandedAmount || 0;
      this.IsBatchRequired = SalesDetailList.IsBatchRequired || 0;
      this.PurRateWf = SalesDetailList.PurRateWf || 0;
      this.PurTotAmt = SalesDetailList.PurTotAmt || 0;
      this.IsPrescription = SalesDetailList.IsPrescription || 0;
      this.CGSTPer = SalesDetailList.CGSTPer || 0;
      this.CGSTAmount = SalesDetailList.CGSTAmount || 0;
      this.SGSTPer = SalesDetailList.SGSTPer || 0;
      this.SGSTAmount = SalesDetailList.SGSTAmount || 0.0;
      this.IGSTPer = SalesDetailList.IGSTPer || 0;
      this.IGSTAmount = SalesDetailList.IGSTAmount || 0;
      this.Narration = SalesDetailList.Narration || '';
      this.IsPurRate = SalesDetailList.IsPurRate || 0;
      this.StkID = SalesDetailList.StkID || 0;
      this.ReturnQty = SalesDetailList.ReturnQty || 0;
    }
  }
}


// If lngQty < lngReturnQty Then
//             MessageBox.Show("Return Qty cannot be greater than Qty.")
//             'dgvReturnItemList.Item(6, j).Value = 0
//             dgvReturnItemList.Item(10, j).Value = 0

//             dgvReturnItemList.Item(11, j).Value = dgvReturnItemList.Item(8, j).Value * dgvReturnItemList.Item(10, j).Value
//             dgvReturnItemList.Item(16, j).Value = dgvReturnItemList.Item(8, j).Value * dgvReturnItemList.Item(10, j).Value

//             ' Gross Amt = MRP * Return Qty
//             dgvReturnItemList.Item(16, j).Value = dgvReturnItemList.Item(8, j).Value * dgvReturnItemList.Item(10, j).Value
//             'Disc Amt = Gross Amt * Dis Per /100
//             dgvReturnItemList.Item(15, j).Value = Format(((dgvReturnItemList.Item(8, j).Value * dgvReturnItemList.Item(10, j).Value) * dgvReturnItemList.Item(14, j).Value / 100), "0.00")
//             'Vat Amount = (Val(txtPerMRP.Text) * Val(txtVatPer.Text) / 100) * Val(txtIssueQty.Text)
//             dgvReturnItemList.Item(13, j).Value = Format((Val(dgvReturnItemList.Item(8, j).Value * dgvReturnItemList.Item(12, j).Value) / 100) * dgvReturnItemList.Item(10, j).Value, "0.00")

//             'CGST Amount = (Val(txtPerMRP.Text) * Val(txtCGSTPer.Text) / 100) * Val(txtIssueQty.Text)
//             dgvReturnItemList.Item(24, j).Value = Format((Val(dgvReturnItemList.Item(8, j).Value * dgvReturnItemList.Item(23, j).Value) / 100) * dgvReturnItemList.Item(10, j).Value, "0.00")

//             'SGST Amount = (Val(txtPerMRP.Text) * Val(txtSGSTPer.Text) / 100) * Val(txtIssueQty.Text)
//             dgvReturnItemList.Item(26, j).Value = Format((Val(dgvReturnItemList.Item(8, j).Value * dgvReturnItemList.Item(25, j).Value) / 100) * dgvReturnItemList.Item(10, j).Value, "0.00")

//             'IGST Amount = (Val(txtPerMRP.Text) * Val(txtIGSTPer.Text) / 100) * Val(txtIssueQty.Text)
//             dgvReturnItemList.Item(28, j).Value = Format((Val(dgvReturnItemList.Item(8, j).Value * dgvReturnItemList.Item(27, j).Value) / 100) * dgvReturnItemList.Item(10, j).Value, "0.00")

//             ' Total Amt = MRP * Return Qty
//             dgvReturnItemList.Item(11, j).Value = (dgvReturnItemList.Item(8, j).Value * dgvReturnItemList.Item(10, j).Value) - dgvReturnItemList.Item(15, j).Value
//             ' Land Amt = Landed Price * Return Qty
//             dgvReturnItemList.Item(18, j).Value = dgvReturnItemList.Item(17, j).Value * dgvReturnItemList.Item(10, j).Value
//             ' Pur Amt = Pur Price * Return Qty
//             dgvReturnItemList.Item(21, j).Value = dgvReturnItemList.Item(20, j).Value * dgvReturnItemList.Item(10, j).Value
//             Exit For
//         End If