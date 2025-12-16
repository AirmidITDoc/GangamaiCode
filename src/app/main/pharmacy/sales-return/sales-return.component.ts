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
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';


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
    // 'LandedPrice',
    // 'TotalLandedAmount', 
    // 'CGSTPer',
    // 'CGSTAmount',
    // 'SGSTPer',
    // 'SGSTAmount',
    // 'IGSTPer',
    // 'IGSTAmount', 
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
    this.IpSalesReturnForm = this.CreateSalesReturnForm();
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
          date: [''],
          time: [''],
          salesId: [this.selcteditemObj?.SalesId, [this._FormvalidationserviceService.onlyNumberValidator()]],
          opIpId: [this.selcteditemObj?.OP_IP_ID, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
          opIpType: [1],
          totalAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
          vatAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
          discAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
          netAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
          paidAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
          balanceAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
          isSellted: false,
          isPrint: true,
          isFree: false,
          unitId: [this._loggedService.currentUserValue.user.unitId, [this._FormvalidationserviceService.onlyNumberValidator()]],
          addedBy: [this._loggedService.currentUserValue.userId],
          storeId: [this._loggedService.currentUserValue.user.storeId, [this._FormvalidationserviceService.onlyNumberValidator()]],
          narration: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],//need to set concession reason
          isPurBill: [false]
          // mobileNo: [0],
          // patientName: [''],
          // address: [''],
          // doctorId:[this.selcteditemObj?.docNameID || 0],
          // doctorName:[this.selcteditemObj?.doctorName || ''],
          // returnType: [0]
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
          billNo: [this.selcteditemObj?.SalesId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
          paymentDate: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
          paymentTime: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
          cashPayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
          chequePayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
          chequeNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
          bankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
          chequeDate: ['1999-01-01'],
          cardPayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
          cardNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
          cardBankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
          cardDate: ['1999-01-01'],
          advanceUsedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
          advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          transactionType: [5, [this._FormvalidationserviceService.onlyNumberValidator()]],
          remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
          addBy: [this._loggedService.currentUserValue.userId],
          isCancelled: [false],
          isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          isCancelledDate: ['1999-01-01'],
          opdipdType: [3, [this._FormvalidationserviceService.onlyNumberValidator()]],
          neftpayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
          neftno: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
          neftbankMaster: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
          neftdate: ['1999-01-01'],
          payTmamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
          payTmtranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
          payTmdate: ['1999-01-01'],
          tdsamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
          unitId: [this._loggedService.currentUserValue.user.unitId],
          wfamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]], 
        }),
               //New Payments
      // ✅ Fixed: should be FormArray
      tPayments: this.formBuilder.array([]),
      });
    }
    createSalesretDetails(element: any): FormGroup {
      return this.formBuilder.group({
        salesReturnId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        itemId: [element?.ItemId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        batchNo: [element?.BatchNo, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        batchExpDate: [this.datePipe.transform(element.BatchExpDate, "yyyy-MM-dd")],
        unitMrp: [element?.UnitMRP, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        qty: [element?.ReturnQty, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        totalAmount: [element?.TotalAmount, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        vatPer: [element?.VatPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        vatAmount: [element?.VatAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        discPer: [element?.DiscPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        discAmount: [element?.DiscAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        grossAmount: [element?.GrossAmount, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        landedPrice: [element?.LandedPrice, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        totalLandedAmount: [element?.TotalLandedAmount, [this._FormvalidationserviceService.onlyNumberValidator()]],
        purRate: [element?.PurRateWf, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        purTot: [element?.PurTotAmt, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        salesId: [element?.SalesId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        salesDetId: [element?.SalesDetId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        isCashOrCredit: [element?.isCashOrCredit, [this._FormvalidationserviceService.onlyNumberValidator()]],
        cgstper: [element?.CGSTPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        cgstamt: [element?.CGSTAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        sgstper: [element?.SGSTPer || 0,[this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        sgstamt: [element?.SGSTAmount || 0,[this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        igstper: [element?.IGSTPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        igstamt: [element?.IGSTAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        stkId: [element?.StkID, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      })   
    }
    createcurrentStock(element: any): FormGroup {
      return this.formBuilder.group({
        itemId: [element?.ItemId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        issueQty: [element?.ReturnQty ?? 0, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        storeId: [this._loggedService.currentUserValue.user.storeId],
        istkId: [element?.StkID ?? 0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      });
    }
    createSalesDetails(element: any): FormGroup {
      return this.formBuilder.group({
        salesDetId: [element?.SalesDetId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        returnQty: [element?.ReturnQty, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      });
    }
    CreateModePaymentform(item: any): FormGroup {
      return this.formBuilder.group({
        paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        unitId: [this._loggedService.currentUserValue.user.unitId],
        billNo: [item?.billNo ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        opdipdtype: [3, [this._FormvalidationserviceService.onlyNumberValidator()]],
        paymentDate: [item?.paymentDate ?? ''],
        paymentTime: [item?.paymentTime ?? ''],
        payAmount: [item?.payAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        tranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        bankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        validationDate: [item?.validationDate ?? ''],
        advanceUsedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        comments: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        payMode: [item?.payMode ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        onlineTranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        onlineTranResponse: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        companyId: [item?.companyId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        cashCounterId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        transactionType: [5, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isSelfOrcompany: [item?.isSelfOrcompany ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        tranMode: ['PHAR', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        createdBy: [this._loggedService.currentUserValue.userId],
        transactionLabel: ['SALES_RETURN', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      });
  }
    // Getters 
    get ModeOfPaymentsArray(): FormArray {
      return this.IpSalesReturnForm.get('tPayments') as FormArray;
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
    var vdata = { 
    "first": 0,
    "rows": 200,
    "sortField": "SalesId",
    "sortOrder": 0,
    "filters": [ 
      { "fieldName": "LName", "fieldValue": this.LastName, "opType": "Equals" },
      { "fieldName": "FName", "fieldValue":  this.firstName, "opType": "Equals" },
      { "fieldName": "FromDt", "fieldValue": this.FromDate, "opType": "Equals" },
      { "fieldName": "ToDt", "fieldValue":this.ToDate, "opType": "Equals" }, 
      { "fieldName": "StoreId", "fieldValue": String(this.StoreId1), "opType": "Equals" },
      { "fieldName": "RegNo", "fieldValue":String(this.regNo), "opType": "Equals" },
      { "fieldName": "SalesNo", "fieldValue": String(this.salesNo), "opType": "Equals" },
      { "fieldName": "OPIPType", "fieldValue": "3", "opType": "Equals" },
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
      { "fieldName": "SalesId", "fieldValue": String(Parama?.salesId), "opType": "Equals" },
      { "fieldName": "StoreId", "fieldValue": String(storeID), "opType": "Equals" },
      { "fieldName": "SalesNo", "fieldValue": String(Parama?.salesNo), "opType": "Equals" },
      { "fieldName": "CashCounterId", "fieldValue": String(Parama?.cashCounterID), "opType": "Equals" },
      { "fieldName": "Start", "fieldValue": String(0), "opType": "Equals" },
      { "fieldName": "Length", "fieldValue": String(250), "opType": "Equals" } 
    ] 
    if (Parama.paidType == 'Paid') {
      var vdata = {
        "searchFields": Filters,
        "mode": "SalesReturnCash"
      }
    }
    else {
      var vdata = {
        "searchFields": Filters,
        "mode": "SalesReturnCredit"
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
    debugger
    if (this.selectedssaleDetailList.data.length > 0) {
      if (this.selectedssaleDetailList.data.find(item => item.ItemId == contact.ItemId && item.BatchNo == contact.BatchNo &&
        Number(item.UnitMRP).toFixed(2) === Number(contact.UnitMRP).toFixed(2)
 
      )) {
        Swal.fire({
          icon: "warning",
          title: "Selected Item already added in list",
          showConfirmButton: false,
          timer: 2000
        });
        return
      }
    }

    let totalAmt = contact?.Qty *  contact?.UnitMRP || 0
    let NetAmount = totalAmt -  contact?.DiscAmount || 0
    let TotalLandedAmount = contact?.Qty *  contact?.LandedPrice || 0
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
        TotalAmount: totalAmt,
        VatPer: contact.VatPer,
        VatAmount: contact.VatAmount,
        DiscPer: contact.DiscPer,
        DiscAmount: contact.DiscAmount,
        GrossAmount: NetAmount,
        LandedPrice: (contact.LandedPrice).toFixed(2),
        TotalLandedAmount: TotalLandedAmount,
        PurRateWf: (contact.PurRateWf).toFixed(2),
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
        StkID: contact.StkID,
        isCashOrCredit:contact.isCashOrCredit
      });
    this.selectedssaleDetailList.data = this.Itemselectedlist; 
    this.IpSalesReturnForm = this.CreateSalesReturnForm();
      this.getCellCalculation(contact, contact.Qty)
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
    if ((ReturnQty > 0)) {
      if ((ReturnQty) <= (contact.Qty)) {
        contact.TotalAmount = (contact.UnitMRP * ReturnQty).toFixed(2);
        contact.DiscAmount = ((contact.TotalAmount * contact.DiscPer) / 100).toFixed(2);
        contact.VatAmount = ((contact.TotalAmount * contact.VatPer) / 100).toFixed(2);
        contact.CGSTAmount = ((contact.TotalAmount * contact.CGSTPer) / 100).toFixed(2);
        contact.SGSTAmount = ((contact.TotalAmount * contact.SGSTPer) / 100).toFixed(2);
        contact.IGSTAmount = ((contact.TotalAmount * contact.IGSTPer) / 100).toFixed(2);
        contact.GrossAmount = (contact.TotalAmount - contact.DiscAmount).toFixed(2);
        contact.TotalLandedAmount = (contact.LandedPrice * ReturnQty).toFixed(2);
        // this.PurAmt = (parseFloat(contact.PurRateWf) * parseInt(this.RQty)).toFixed(2); 
      } else if ((ReturnQty) > (contact.Qty)) {
        contact.ReturnQty = '';
        contact.TotalAmount = 0;
        contact.DiscAmount = 0;
        contact.VatAmount = 0;
        contact.CGSTAmount = 0;
        contact.SGSTAmount = 0;
        contact.IGSTAmount = 0;
        contact.GrossAmount = 0;
        contact.TotalLandedAmount = 0;
        Swal.fire({
          icon: "warning",
          title:  "Enter Return qty less than BalQty and greater than 0",
          showConfirmButton: false,
          timer: 2000
        }); 
      }
    }
    else if (ReturnQty == '' || ReturnQty == null || ReturnQty == undefined || ReturnQty == 0) {
      contact.TotalAmount = 0;
      contact.DiscAmount = 0;
      contact.VatAmount = 0;
      contact.CGSTAmount = 0;
      contact.SGSTAmount = 0;
      contact.IGSTAmount = 0;
      contact.GrossAmount = 0;
      contact.TotalLandedAmount = 0; 
      Swal.fire({
        icon: "warning",
        title: "Enter Return qty less than BalQty and greater than 0",
        showConfirmButton: false,
        timer: 2000
      }); 
    }
    this.getUpdateTotalAmtSum()
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
     if (!(this.selcteditemObj.SalesId > 0)) {
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
    const formattedTime = this.dateTimeObj.time;
    const formattedDate = this.datePipe.transform(this.dateTimeObj.date,'yyyy-MM-dd');
    const FormattedDateTime = formattedDate + ' ' + formattedTime 

    this.IpSalesReturnForm.get('salesReturn.date').setValue(formattedDate)
    this.IpSalesReturnForm.get('salesReturn.time').setValue(FormattedDateTime)
    this.IpSalesReturnForm.get('salesReturn.totalAmount')?.setValue(this.IPSalesRetFooterform.get('TotalAmt')?.value)
    this.IpSalesReturnForm.get('salesReturn.vatAmount')?.setValue(this.IPSalesRetFooterform.get('GSTAmount')?.value)
    this.IpSalesReturnForm.get('salesReturn.discAmount')?.setValue(this.IPSalesRetFooterform.get('TotDiscAmount')?.value)
    this.IpSalesReturnForm.get('salesReturn.netAmount')?.setValue(this.IPSalesRetFooterform.get('NetAmt')?.value)
    this.IpSalesReturnForm.get('salesReturn.opIpType').setValue(this.selcteditemObj?.OP_IP_Type);
    this.IpSalesReturnForm.get('salesReturn.isPurBill').setValue(this.selcteditemObj?.IsPurRate || false);
    if( this.selcteditemObj.OP_IP_Type == 2 ){
      this.IpSalesReturnForm.get('salesReturn.opIpId').clearValidators();
      this.IpSalesReturnForm.get('salesReturn.opIpId').updateValueAndValidity();
    }else{
      this.IpSalesReturnForm.get('salesReturn.opIpId').setValidators(Validators.required);
      this.IpSalesReturnForm.get('salesReturn.opIpId').updateValueAndValidity();
    }

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
        this.IpSalesReturnForm.get('payment.paymentTime').setValue(FormattedDateTime)
        this.IpSalesReturnForm.get('payment.cashPayAmount').setValue(Number(Math.round(this.IPSalesRetFooterform.get('NetAmt').value)))

                        let ModePaymentObj = [];
                ModePaymentObj.push({ 
                     billNo: this.selcteditemObj?.SalesId,
                     paymentDate: formattedDate,
                     paymentTime: formattedTime,
                     payAmount: (Math.round(this.IPSalesRetFooterform.get('NetAmt')?.value || 0)),
                     validationDate: formattedDate, 
                     payMode: "CASH",
                     companyId: this.selcteditemObj?.companyId ?? 0,
                     isSelfOrcompany: this.selcteditemObj?.companyId ? 1 : 0, 
                   }); 
                this.ModeOfPaymentsArray.clear();
                ModePaymentObj.forEach(item => {
                    this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item));
                });

        console.log(this.IpSalesReturnForm.value);
        this._SalesReturnService.InsertCashSalesReturn(this.IpSalesReturnForm.value).subscribe(response => { 
            this.OnSalesReturnprint(response, this.selcteditemObj?.OP_IP_Type)
            this.OnReset(); 
        });
      }
      else {
        this.IpSalesReturnForm.get('salesReturn.paidAmount').setValue(0)
        this.IpSalesReturnForm.get('salesReturn.balanceAmount').setValue(Number(Math.round(this.IPSalesRetFooterform.get('NetAmt').value)))
        this.IpSalesReturnForm.get('payment.paymentDate').setValue(formattedDate)
        this.IpSalesReturnForm.get('payment.paymentTime').setValue(FormattedDateTime)

        console.log(this.IpSalesReturnForm.value);
        this._SalesReturnService.InsertCreditSalesReturn(this.IpSalesReturnForm.value).subscribe(response => { 
            this.OnSalesReturnprint(response, this.selcteditemObj?.OP_IP_Type)
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
      }
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
  //print 
  OnSalesReturnprint(SalesID, OP_IP_Type) {
    setTimeout(() => {
      let param = {
        "searchFields": [
          { "fieldName": "SalesID", "fieldValue": String(SalesID || 0), "opType": "13" },
          { "fieldName": "OP_IP_Type", "fieldValue": String(OP_IP_Type), "opType": "13" }
        ],
        "mode": "PharamcySalesReturn"
      }
      this._SalesReturnService.getReportView(param).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Sales Return" + " " + "Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
        });
      });
    }, 100);
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