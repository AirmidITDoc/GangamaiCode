import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { parseInt } from 'lodash';
import Swal from 'sweetalert2';
import { CanteenmanagementService } from '../canteenmanagement.service';
import { FormArray, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { AirmidCardViewComponent } from 'app/main/shared/componets/airmid-card-view/airmid-card-view.component';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { MatDialog } from '@angular/material/dialog';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-canteen-sales',
  templateUrl: './canteen-sales.component.html',
  styleUrls: ['./canteen-sales.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class CanteenSalesComponent implements OnInit {

  IsWard: boolean = false
  autocompleteModeward: string = "Room";
  // card?
  @HostBinding('style.display') display = 'flex';
  @HostBinding('style.flex') flex = '1 1 auto';
  @HostBinding('style.minHeight') minH = '0';
  @HostBinding('style.flexDirection') dir = 'column';


  // Add view mode and user data for card view
  viewMode: 'table' | 'card' = 'card';
  userList: any[] = [];

  // Card view config and pagination
  cardConfig = {
    fields: [
      { label: 'Item Name', key: 'itemName' },
      { label: 'Price', key: 'price' },

    ],
    actions: [
      { icon: 'delete', tooltip: 'Delete', action: 'delete' }
    ]
  };

  @Input() config: any;



  // ward data
  @ViewChild('BillGrid', { static: false }) grid: AirmidTableComponent;
  @ViewChild('WardGrid', { static: false }) wardgrid: AirmidTableComponent;
  // @ViewChild('ItemGrid', { static: false }) grid1: AirmidTableComponent;
  @ViewChild(AirmidTableComponent) grid1: AirmidTableComponent;
  myFilterbillform: FormGroup;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")


  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

  }
  allBillfilters = [
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },

    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "WardId", fieldValue: "0", opType: OperatorComparer.Equals }

  ];

  allbillcolumns = [
    { heading: "Customer Name", key: "customerName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    {
      heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate
    }  // Assign ng-template to the column

  ];

  gridConfig: gridModel = {

    apiUrl: "CanteenRequest/CanteenRequestHeaderList",
    columnsList: this.allbillcolumns,
    sortField: "ReqId",
    sortOrder: 0,
    filters: this.allBillfilters
  }

  allcardFilters = [
    { fieldName: "ItemName", fieldValue: "%", opType: OperatorComparer.Equals },

  ];
  allcardcolumns = [{ heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
  { heading: "Price", key: "price", sort: true, align: 'left', emptySign: 'NA', width: 80 },

  ]

  gridConfigcard: gridModel = {
    apiUrl: "CanteenRequest/CanteenItemList",
    columnsList: this.allcardcolumns,
    sortField: "ItemID",
    sortOrder: 1,
    filters: this.allcardFilters,
    row: 150
  }

  allcolumns = [

    // { heading: "-", key: "isBillGenerated", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },

    { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA', width: 60 },
    { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 180 },

  ]


  gridConfig1: gridModel = {
    apiUrl: "CanteenRequest/CanteenRequestHeaderList",
    columnsList: this.allcolumns,
    sortField: "ReqId",
    sortOrder: 0,
    filters: [
      { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Equals },
      { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Equals },
      { fieldName: "WardId", fieldValue: "0", opType: OperatorComparer.Equals }

    ]
  }


  displayedColumns = [
    'Code',
    'ItemName',
    'Price',
    'Action'
  ];
  displayedColumns1 = [
    'ItemName',
    'Price',
    'Qty',
    //'ReturnQty',
    'Amount',
    'Action'
  ];
  displayedColumns2 = [
    'Date',
    'WardName',
  ];
  displayedBillListColumns = [
    'PBillNo',
    'BDate',
    'CustomerName',
    'NetAmount',
    'PaidAmount',
    'BalanceAmount',
  ];
  displayedBillDetListColumns = [
    'ItemName',
    'Qty',
    'NetAmount',
  ];

  CanteenForm: FormGroup;
  canteendetailform: FormGroup;
  sIsLoading: string;
  isItemIdSelected: boolean = false;
  chargeslist: any = [];
  Itemsearch: string;
  vTotalFinalAmount: any;
  vDiscAmt: any = 0;
  vDisc = 0;

  dsItemTable1 = new MatTableDataSource<ItemTable1List>();
  dsItemDetTable2 = new MatTableDataSource<ItemDetTable2List>();
  dsBillList = new MatTableDataSource<BillList>();
  dsBillDetailList = new MatTableDataSource<BillDetailList>();
  dsNursingBillList = new MatTableDataSource<NursingBillList>();

  f_name = '%'
  l_name = '%'
  regNo = '0'
  fromdate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  todate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    public _CanteenmanagementService: CanteenmanagementService, public toastr: ToastrService, private commonService: PrintserviceService,
    private _loggedService: AuthenticationService, private _FormBuilder: UntypedFormBuilder, private _matDialog: MatDialog,
    public datePipe: DatePipe, private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  ngOnInit(): void {

    this.myFilterbillform = this._CanteenmanagementService.myFilterbrowseform();
debugger
    this.CanteenForm = this.createCanteenform()
    this.billdetailArray.push(this.CanteenBillDetails());
    this.getItemTable1List();
    // this.getBillListData()
  }

  autocompleteModeCashcounter: string = "CashCounter";
  RegId = 0
  Opipid = 0
  ReqId = 0


  createCanteenform() {
    
    return this._FormBuilder.group({
      billNo: 0,
      date: [(new Date()).toISOString()],
      time: [(new Date()).toISOString()],
      storeId: this._loggedService.currentUserValue.user.storeId,
      opIpId: this.Opipid,
      customerName: this.CustomerName,
      pBillNo: "0",
      totalAmount: 0,
      gstper: 0,
      gstamount: 0,
      discAmount: this.vDiscAmt || 0,
      netAmount: this.vTotalFinalAmount || 0,
      paidAmount: this.vTotalFinalAmount || 0,
      balanceAmount: 0,
      concessionReasonId: 0,
      concessionAuthorizationId: 0,
      cashCounterId: 0,
      isPrint: true,
      isFree: true,
      unitId: [this._loggedService.currentUserValue.user.unitId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isCancelled: false,
      reqId: this.ReqId,
      isOtherOrIsEmpBill: false,
      tCanteenBillDetails: this._FormBuilder.array([]),
    });
  }

  CanteenBillDetails(element: any = {}): FormGroup {
    
    return this._FormBuilder.group({
      cdetId: [0],
      billNo: 0,
      itemId: [element.ItemID],
      itemName: [element.ItemName ?? ''],
      batchNo: '',
      batchExpDate: new Date(),
      unitMrp: [element.Price ?? 0],
      qty: element.Qty,
      totalAmount: this.vTotalFinalAmount || 0,
      gstper: [0],
      gstamount: [0],
      discPer: [0],
      discAmount: [0],
      grossAmount: [0],
      landedPrice: [0],
      totalLandedAmount: [0],
      returnQty: [0],
      reqId: [0],
      reqDetId: [0],
    });
  }


  get billdetailArray(): FormArray {
    
    return this.CanteenForm.get('tCanteenBillDetails') as FormArray;
  }


  applyFilter() {
    this.dsItemTable1.filter = this.Itemsearch.trim().toLowerCase();
  }

  vTotalTotAmount: any

  Save() {

    if (this._CanteenmanagementService.userFormGroup.get('CustomerName').value == '') {
      this.toastr.warning('Please select a Customer Name .', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning'
      });
      return;
    }

    
    if (this.dsItemDetTable2.data.length == 0) {
      this.toastr.warning('Please select a Item Name .', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning'
      });
      return;
    }
    
    if (this.vDiscAmt == 0)
      this.vTotalTotAmount = this.vTotalFinalAmount
    else
      this.vTotalTotAmount = this.vTotalFinalAmount + this.vDiscAmt

    if (this._CanteenmanagementService.userFormGroup.get('Type').value == '0')
      this.CanteenForm.get('isOtherOrIsEmpBill').setValue(true)
    else
      this.CanteenForm.get('isOtherOrIsEmpBill').setValue(false)

    this.CanteenForm.get("date").setValue(this.datePipe.transform(new Date(), "yyyy-MM-dd"))
    this.CanteenForm.get("time").setValue(new Date(), "HH:mm:ss")
    this.CanteenForm.get('reqId').setValue(this.ReqId)
    this.CanteenForm.get('discAmount')?.setValue(this.vDiscAmt)

    this.CanteenForm.get('totalAmount')?.setValue(this.vTotalTotAmount)

    this.CanteenForm.get('netAmount')?.setValue(this.vTotalFinalAmount)
    this.CanteenForm.get('customerName').setValue(this._CanteenmanagementService.userFormGroup.get('CustomerName').value)
    this.CanteenForm.get('opIpId')?.setValue(this.Opipid)


    // if (!this.CanteenForm.invalid) {
    this.billdetailArray.clear();
    this.dsItemDetTable2.data.forEach(item => {
      this.billdetailArray.push(this.CanteenBillDetails(item));

    });

    console.log("form values", this.CanteenForm.value)

    // if (this._CanteenmanagementService.userFormGroup.get('Status').value == 'PayOption') {
    //   let PatientHeaderObj = {};
    //   PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
    //     PatientHeaderObj['PatientName'] = this.CustomerName;
    //   PatientHeaderObj['RegNo'] = this.regNo || 0;
    //   PatientHeaderObj['OPD_IPD_Id'] = this.Opipid;
    //   PatientHeaderObj['CashCounterId'] = this._CanteenmanagementService.userFormGroup.get('CashCounterID')?.value || 0;
    //   PatientHeaderObj['TransactionLabel'] = 'CANTEEN-Bill';
    //   PatientHeaderObj['NetPayAmount'] = Math.round(this._CanteenmanagementService.userFormGroup.get('netPayableAmt').value);
    //   const dialogRef = this._matDialog.open(OpPaymentComponent,
    //     {
    //       maxWidth: "80vw",
    //       height: '750px',
    //       width: '80%',
    //       data: {
    //         vPatientHeaderObj: PatientHeaderObj,
    //         FromName: "CANTEEN-Bill",
    //         advanceObj: PatientHeaderObj,
    //       }
    //     });
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result && result.IsSubmitFlag == true) {
    //       console.log(this.CanteenForm.value)
    //       console.log(result.submitDataPay.ipPaymentInsert)
    //       console.log(result.BillBalanceAmount)
    //       this.CanteenForm.get('balanceAmt').setValue(result.BillBalanceAmount || 0)
    //       this.CanteenForm.get('payments').setValue(result.submitDataPay.ipPaymentInsert)

    //       // this.ModeOfPaymentsArray.clear();
    //       // result.submitDataPay.ipModePaymentInsert.forEach(item => {
    //       //     this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item as ChargesList));
    //       // });

    //       console.log(this.CanteenForm.value)
    //       this._CanteenmanagementService.canteenBillSave(this.CanteenForm.value).subscribe(response => {
    //         this.resetform();
    //         this.viewgetBillThermalReportPdf(response)

    //       });
    //     }
    //   });
    // }else 

    if (this._CanteenmanagementService.userFormGroup.get('Status').value == 'CashPay') {//Cash pay  

      this.CanteenForm.get('balanceAmount').setValue(0)
      this.CanteenForm.get('paidAmount')?.setValue(this.vTotalFinalAmount)

    } else if (this._CanteenmanagementService.userFormGroup.get('Status').value == 'CreditPay') {

      this.CanteenForm.get('balanceAmount').setValue(this.vTotalFinalAmount)
      this.CanteenForm.get('paidAmount')?.setValue(0)

    }
    
    console.log(this.CanteenForm.value)
    this._CanteenmanagementService.canteenBillSave(this.CanteenForm.value).subscribe(response => {
      console.log(response)
      this.viewgetBillThermalReportPdf(response)
      this.resetform();
    });

    // else if (this._CanteenmanagementService.userFormGroup.get('Status').value == 'OnlinePay') {
    //     let ModePaymentObj = [];
    //     ModePaymentObj.push({
    //         paymentDate: formattedDate,
    //         paymentTime: formattedTime,
    //         payAmount: this.OPFooterForm.get('netPayableAmt')?.value ?? 0,
    //         tranNo: this.OPFooterForm.get('UpiNo')?.value || 0,
    //         bankName: "",
    //         validationDate: this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
    //         comments: "",
    //         payMode: "UPI",
    //         onlineTranNo: "0",
    //         onlineTranResponse: "0",
    //         companyId: this.patientDetail?.CompanyId ?? 0,
    //         cashCounterId: this.searchForm.get('CashCounterID')?.value || 0,
    //         transactionType: 0,
    //         isSelfOrcompany: this.patientDetail?.CompanyId ? 1 : 0,
    //     });
    //     
    //     this.CanteenForm.get('balanceAmt').setValue(0)
    //     this.CanteenForm.get('paidAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
    //     this.CanteenForm.get('payments.payTmamount')?.setValue(Number(this.OPFooterForm.get('netPayableAmt')?.value))
    //     this.CanteenForm.get('payments.paymentDate')?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
    //     this.CanteenForm.get('payments.paymentTime')?.setValue(this.dateTimeObj.time)
    //     this.CanteenForm.get('payments.payTmtranNo')?.setValue(this.OPFooterForm.get('UpiNo')?.value || 0)
    //     this.CanteenForm.get('payments.payTmdate')?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
    //     this.CanteenForm.get('payments.companyId')?.setValue(this.patientDetail?.companyId || 0)

    //     this.ModeOfPaymentsArray.clear();
    //     ModePaymentObj.forEach(item => {
    //         this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item as ChargesList));
    //     });

    //     console.log(this.CanteenForm.value)
    //     this._AppointmentlistService.InsertOPBilling(this.CanteenForm.value).subscribe(response => {

    //         console.log(response)
    //         this.mpesaResponse = response.data;
    //         // this.startPolling();
    //         this._matDialog.closeAll();
    //         this.savebtn = true
    //         this.resetform();
    //         if (ThermalPrint != 1) {
    //             this.viewgetOPBillReportPdf(response)
    //         } else {
    //             if (this.data?.FormName != 'Appointment-OPBill') {
    //                 this.viewgetOPBillThermalReportPdf(response)
    //             } else {
    //                 this.dialogRef.close(response)
    //             }
    //         }
    //     });
    // }
    // else if (this._CanteenmanagementService.userFormGroup.get('Status').value == 'CreditPay') {//Credit pay 
    //     this.CanteenForm.get('paidAmt').setValue(0)
    //     this.CanteenForm.get('balanceAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
    //     this.CanteenForm.removeControl('payments')
    //     console.log(this.CanteenForm.value)
    //     this._AppointmentlistService.InsertOPBillingCredit(this.CanteenForm.value).subscribe(response => {
    //         this._matDialog.closeAll();
    //         this.savebtn = true
    //         this.resetform();
    //         if (ThermalPrint != 1) {
    //             this.viewgetOPBillReportPdf(response)
    //         } else {
    //             if (this.data?.FormName != 'Appointment-OPBill') {
    //                 this.viewgetOPBillThermalReportPdf(response)
    //             } else {
    //                 this.dialogRef.close(response)
    //             }
    //         }
    //     });
    // }

    // }
    // else {
    //   let invalidFields = [];
    //   if (this.CanteenForm.invalid) {
    //     for (const controlName in this.CanteenForm.controls) {
    //       const control = this.CanteenForm.get(controlName);

    //       if (control instanceof FormGroup || control instanceof FormArray) {
    //         for (const nestedKey in control.controls) {
    //           if (control.get(nestedKey)?.invalid) {
    //             invalidFields.push(`OP Bill Data : ${controlName}.${nestedKey}`);
    //           }
    //         }
    //       } else if (control?.invalid) {
    //         invalidFields.push(`OpBill From: ${controlName}`);
    //       }
    //     }
    //   }
    //   if (invalidFields.length > 0) {
    //     invalidFields.forEach(field => {
    //       this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
    //       );
    //     });
    //     return
    //   }
    // }
  }

  getItemTable1List() {

    debugger
    var vdata = this._CanteenmanagementService.userFormGroup.get('ItemID').value || '%'

    this._CanteenmanagementService.getItemTable1ListData(vdata).subscribe(data => {
      this.dsItemTable1.data = data as ItemTable1List[];
      console.log(data)
      this.dsItemTable1.sort = this.sort;
      this.dsItemTable1.paginator = this.paginator;

    });

    this.getLatestIemList(vdata)
  }
  
  resetform() {
    this._CanteenmanagementService.userFormGroup.reset()
    this._CanteenmanagementService.userFormGroup.get('Type').setValue('2')
    this._CanteenmanagementService.userFormGroup.get('Status').setValue('CashPay')
    this.dsItemDetTable2.data = []
    this.chargeslist = []
  }


  viewgetBillThermalReportPdf(BillNo) {
    
    const param = {
      "searchFields": [
        {
          "fieldName": 'BillNo',
          "fieldValue": String(BillNo),
          "opType": "13"
        }
      ],
      "mode": 'CanteenBillReceiptT'
    }
    this._CanteenmanagementService.getReportView(param).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: res + " " + "Viewer"
          }
        });
      matDialog.afterClosed().subscribe(result => {
      });
    });
  }

  getItemDetailList(row) {
    console.log(row);
    this.sIsLoading = 'loading-data';
    this.sIsLoading = 'save';
    this.dsItemDetTable2.data = [];

    this.addChargList(row);

  }
  @ViewChild(AirmidCardViewComponent) cardView: AirmidCardViewComponent;

  getLatestIemList(Param) {
    
    this.gridConfigcard = {
      apiUrl: "CanteenRequest/CanteenItemList",
      columnsList: this.allcardcolumns,
      sortField: "ItemID",
      sortOrder: 0,
      filters: [
        { fieldName: "ItemName", fieldValue: Param + "%", opType: OperatorComparer.Equals }

      ]
    }

    this.cardView.gridConfig = this.gridConfigcard;
    this.cardView.bindGridData();

  }


  addChargList(row) {
    const existingItem = this.dsItemDetTable2.data.find(
      item => item.ItemID === row.itemID
    );

    if (existingItem) {
      // Item already exists → Increase quantity
      existingItem.Qty += 1;
      existingItem.Amount = existingItem.Qty * (existingItem.Price || 0);
      this.getTotalAmount()
    } else {
      // New item → Add to list
      this.chargeslist.push({
        ItemID: row.itemID,
        ItemName: row.itemName,
        Price: row.price || 0,
        Qty: 1,
        Amount: row.price || 0
      });
      this.sIsLoading = '';
      this.dsItemDetTable2.data = this.chargeslist;

      this.getTotalAmount()
    }
  }
  onQtyEdit(event: any, contact: ItemDetTable2List) {
    const editedQty = parseFloat(event.target.textContent) || 0;
    contact.Qty = editedQty;
    contact.Amount = (contact.Qty * contact.Price);
    this.getTotalAmount();
  }
  getTotalAmount(): number {
    this.vTotalFinalAmount = 0;
    for (let i = 0; i < this.chargeslist.length; i++) {
      this.vTotalFinalAmount += this.chargeslist[i].Amount;
    }
    this.CalculateDiscount();

    //this._CanteenmanagementService.userFormGroup.get('Discount').setValue('');
    return this.vTotalFinalAmount.toFixed(2);

  }
  dateTimeObj: any;
  screenFromString = 'Common-form';
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  CalculateDiscount() {
    let disc = this._CanteenmanagementService.userFormGroup.get('Discount').value;

    if (disc >= 100 && disc > 0) {
      Swal.fire('Enter Disount Less Than 100')
      this._CanteenmanagementService.userFormGroup.get('Discount').setValue(0);
      this._CanteenmanagementService.userFormGroup.get('DiscAmt').setValue(0);
      //this._CanteenmanagementService.userFormGroup.get('TotalAmount').setValue(this.vTotalFinalAmount);
      this.vTotalFinalAmount = this.vTotalFinalAmount.toFixed(2);
    }
    if (disc) {
      let dis = this._CanteenmanagementService.userFormGroup.get('Discount').value;
      this.vDiscAmt = ((dis * parseInt(this.vTotalFinalAmount)) / 100).toFixed(2);
      this.vTotalFinalAmount = this.vTotalFinalAmount - this.vDiscAmt;
      this.vTotalFinalAmount = this.vTotalFinalAmount.toFixed(2);
      // this.CalculateDisAmt();
    }

  }

  CalculateDisAmt() {
    this.vTotalFinalAmount = (parseInt(this.vTotalFinalAmount) - parseInt(this.vDiscAmt));
    this.vTotalFinalAmount = this.vTotalFinalAmount.toFixed(2)
  }

  @ViewChild('Code') Code: ElementRef;
  @ViewChild('CustomerName') CustomerName: ElementRef;
  public onEnterCode(event): void {
    if (event.which === 13) {
      this.CustomerName.nativeElement.focus()
    }
  }
  public onEnterCustomer(event): void {
    if (event.which === 13) {
      this.CustomerName.nativeElement.focus()
    }
  }


  //BillList
  getBillListData() {

    let filters: any[] = [];


    filters.push(

      {
        "fieldName": "FromDate",
        "fieldValue": String(this.fromdate),
        "opType": "Contains"
      },
      {
        "fieldName": "ToDate",
        "fieldValue": String(this.todate),
        "opType": "Contains"
      },
      {
        "fieldName": "Reg_No",
        "fieldValue": String(this.regNo),
        "opType": "Equals"
      },
      {
        "fieldName": "F_Name ",
        "fieldValue": String(this.f_name),
        "opType": "Equals"
      },
      {
        "fieldName": "L_Name",
        "fieldValue": this.l_name,
        "opType": "GreaterThanOrEqual"
      },
      {
        "fieldName": "WardId",
        "fieldValue": "0",
        "opType": "Equals"
      },
    );

    let data = {
      "first": 0,
      "rows": 999999,
      "sortField": "ReqId",
      "sortOrder": 0,
      "filters": filters,
      "exportType": "JSON",
      "columns": []
    };
    console.log(data);
    this._CanteenmanagementService.getBillList(data).subscribe(data => {
      this.dsBillList.data = data.data as BillList[];
      console.log(data)

    });
  }
  ReqLength = 0
  //BillDetailList ReqId
  getBillDetList(Param) {
    
    let filters: any[] = [];
    this.chargeslist = []
    filters.push(

      {
        "fieldName": "ReqId",
        "fieldValue": String(Param),
        "opType": "Equals"
      }
    );

    let data = {
      "first": 0,
      "rows": 999999,
      "sortField": "ReqId",
      "sortOrder": 0,
      "filters": filters,
      "exportType": "JSON",
      "columns": []
    };
    // console.log(vdata);
    this._CanteenmanagementService.getBillDetailsList(data).subscribe(data => {
      // this.dsBillDetailList.data = data.data as BillDetailList[];
      
      data.data.forEach(element => {
        this.chargeslist.push(
          {
            ItemID: element.itemId,
            ItemName: element.itemName,
            Price: element.unitMRP || 0,
            Qty: element.qty,
            Amount: element.unitMRP * element.qty
          });
      })
      this.dsItemDetTable2.data = this.chargeslist;

      console.log(this.dsItemDetTable2.data)
      this.getTotalAmount()

    },
      error => {
        this.sIsLoading = '';
      });
  }

  // //Nursing List
  getNursingBillList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
      'FromDate': this.datePipe.transform(this._CanteenmanagementService.userFormGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      'ToDate': this.datePipe.transform(this._CanteenmanagementService.userFormGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      'Reg_No': 0,
    }
    // console.log(vdata);
    this._CanteenmanagementService.getNursingBill(vdata).subscribe(data => {
      this.dsNursingBillList.data = data as NursingBillList[];
      this.dsNursingBillList.sort = this.sort;
      this.dsNursingBillList.paginator = this.paginator;
      this.sIsLoading = '';
    });
  }

  RoomId = 0
  onChangeWard(e) {
    this.RoomId = e.roomId

  }

  onClose() { }
  clearSearch() {
    this.Itemsearch = '';
    this.applyFilter();
  }
  getValidationMessages() {
    return {
      roomId: [],
      CashCounterID: []

    }
  }


  onChangeBill() {
    
    this.fromDate = this.datePipe.transform(this.myFilterbillform.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilterbillform.get('enddate').value, "yyyy-MM-dd")
    this.f_name = this.myFilterbillform.get('FirstName').value + "%"
    this.l_name = this.myFilterbillform.get('LastName').value + "%"
    this.regNo = this.myFilterbillform.get('RegNo').value || "0"
    this.getfilterdataBill();
  }

  getfilterdataBill() {
    
    this.gridConfig1 = {
      apiUrl: "CanteenRequest/CanteenRequestHeaderList",
      columnsList: this.allbillcolumns,
      sortField: "ReqId",
      sortOrder: 0,
      filters: [{ fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },

      { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
      { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains }

      ]
    }
    this.grid.gridConfig = this.gridConfig1;
    this.grid.bindGridData();
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

  ClearfilterOPbill(event) {
    console.log(event)
    if (event == 'FirstName')
      this.myFilterbillform.get('FirstName').setValue("")
    else
      if (event == 'LastName')
        this.myFilterbillform.get('LastName').setValue("")
    if (event == 'RegNo')
      this.myFilterbillform.get('RegNo').setValue("")


    this.onChangeBill();
  }

  //card


  resultsLength = 0;
  onAfterLoadData(data: any[]) {
    console.log(data)
    this.userList = data;//thia.dataSource
    this.resultsLength = data.length;
  }

  onCardAction(event: { action: string, item: any }) {
    if (event.action === 'viewPassword') {
      // this.PasswordView(event.item);
    } else if (event.action === 'edit') {
      this.onEdit(event.item);
    } else if (event.action === 'delete') {
    }
  }
  onEdit(element) {
    console.log(element)
    this.addChargList(element)
  }

  //
  @Output() action = new EventEmitter<{ action: string, item: any }>();
  onAction(action: string, item: any) {
    this.action.emit({ action, item });
  }

  getfilterdata() {

    
    let fromDate1 = this._CanteenmanagementService.userFormGroup.get("start").value || "";
    let toDate1 = this._CanteenmanagementService.userFormGroup.get("end").value || "";
    fromDate1 = fromDate1 ? this.datePipe.transform(fromDate1, "yyyy-MM-dd") : "";
    toDate1 = toDate1 ? this.datePipe.transform(toDate1, "yyyy-MM-dd") : "";
    this.gridConfig = {
      apiUrl: "CanteenRequest/CanteenRequestHeaderList",
      columnsList: this.allcolumns,
      sortField: "ReqId",
      sortOrder: 0,
      filters: [
        { fieldName: "FromDate", fieldValue: fromDate1, opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: toDate1, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Equals },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Equals },
        { fieldName: "WardId", fieldValue: "0", opType: OperatorComparer.Equals }

      ]
    }
    this.wardgrid.gridConfig = this.gridConfig;
    this.wardgrid.bindGridData();
  }
  wardId = 0
  GetDetails1(data) {
    console.log(data)
    
    this.IsWard = true

    this.ReqId = parseInt(data.reqId)
    this._CanteenmanagementService.userFormGroup.get('roomId').setValue(parseInt(data.bedName))
    this._CanteenmanagementService.userFormGroup.get('CustomerName').setValue(data.patientName)
    this._CanteenmanagementService.userFormGroup.get('Code').setValue(data.oP_IP_ID)

    this.getBillDetList(data.reqId)


  }


  Chargelist = []
  deleteTableRow(event, element) {
    this.Chargelist = this.dsItemDetTable2.data
    const index = this.Chargelist.indexOf(element);
    if (index >= 0) {
      this.Chargelist.splice(index, 1);
      this.dsItemDetTable2.data = [];
      this.dsItemDetTable2.data = this.Chargelist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
    this.getTotalAmount()
  }

}
export class ItemTable1List {

  ItemName: string;
  Code: Number;
  Price: number;
  Qty: any;
  // ReturnQty:any;

  constructor(ItemTable1List) {
    {
      this.Code = ItemTable1List.Code || 0;
      this.Price = ItemTable1List.Price || 0;
      this.ItemName = ItemTable1List.ItemName || "";
      this.Qty = ItemTable1List.Qty || 0;
      //this.ReturnQty = ItemTable1List.ReturnQty || 0;
    }
  }
}
export class ItemDetTable2List {
  ItemID: any;
  ItemName: string;
  Qty: any;
  Price: number;
  Amount: number;

  constructor(ItemTable1List) {
    {
      this.ItemID = ItemTable1List.ItemID || 0;
      this.Qty = ItemTable1List.Qty || 0;
      this.Amount = ItemTable1List.Amount || 0;
      this.Price = ItemTable1List.Price || 0;
      this.ItemName = ItemTable1List.ItemName || "";
    }
  }
}
export class BillList {

  CustomerName: string;
  PBillNo: Number;
  BDate: number;
  NetAmount: number;
  PaidAmount: number;
  BalanceAmount: number;

  constructor(BillList) {
    {
      this.PBillNo = BillList.PBillNo || 0;
      this.NetAmount = BillList.NetAmount || 0;
      this.BDate = BillList.BDate || 0;
      this.BalanceAmount = BillList.BalanceAmount || 0;
      this.PaidAmount = BillList.PaidAmount || 0;
      this.CustomerName = BillList.CustomerName || "";
    }
  }
}
export class BillDetailList {

  ItemName: string;
  Qty: Number;
  NetAmount: number;

  constructor(BillDetailList) {
    {
      this.NetAmount = BillDetailList.NetAmount || 0;
      this.Qty = BillDetailList.Qty || 0;
      this.ItemName = BillDetailList.ItemName || "";
    }
  }
}
export class NursingBillList {

  WardName: string;
  Date: Number;

  constructor(NursingBillList) {
    {
      this.Date = NursingBillList.Date || 0;
      this.WardName = NursingBillList.WardName || "";
    }
  }
}