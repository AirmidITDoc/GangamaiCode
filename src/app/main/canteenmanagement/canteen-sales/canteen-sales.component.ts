import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostBinding, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
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

@Component({
  selector: 'app-canteen-sales',
  templateUrl: './canteen-sales.component.html',
  styleUrls: ['./canteen-sales.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class CanteenSalesComponent implements OnInit {
  // card?
  @HostBinding('style.display') display = 'flex';
  @HostBinding('style.flex') flex = '1 1 auto';
  @HostBinding('style.minHeight') minH = '0';
  @HostBinding('style.flexDirection') dir = 'column';


  // Add view mode and user data for card view
  viewMode: 'table' | 'card' = 'table';
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

  // ward data
  @ViewChild('BillGrid', { static: false }) grid: AirmidTableComponent;

  myFilterbillform: FormGroup;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  allBillfilters = [
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },

    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },

  ];

  allbillcolumns = [
    // { heading: "", key: "patientType", sort: true, align: 'left', type: gridColumnTypes.template, emptySign: 'NA', width: 45 },
    // { heading: "", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    // { heading: "", key: "refundAmount1", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    // { heading: "", key: "balanceAmt1", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    // { heading: "BillDate", key: "billTime", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
    // { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
    // { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Customer Name", key: "customerName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    // { heading: "Total Amount", key: "totalAmt", sort: true, align: 'right', emptySign: 'NA', type: gridColumnTypes.amount }, // It is just example of apply color based on condition
    // { heading: "Disc Amount", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    // { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    // { heading: "Paid Amount", key: "paidAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    // { heading: "Balance Amount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, columnClass: (element) => element["balanceAmt"] > 0 ? Color.RED : "" },
    // { heading: "Cash Pay", key: "cashPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    // { heading: "Cheque Pay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    // { heading: "Card Pay", key: "cardPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

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
    { fieldName: "ItemName", fieldValue: "%", opType: OperatorComparer.Equals  },

  ];
  allcardcolumns = [{ heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
  { heading: "Price", key: "price", sort: true, align: 'left', emptySign: 'NA', width: 80 }

  ]

  gridConfigcard: gridModel = {
    apiUrl: "CanteenRequest/GetItemListforCanteen",
    columnsList: this.allcardcolumns,
    sortField: "ItemID",
    sortOrder: 1,
    filters: this.allcardFilters,
    row: 50
  }

  displayedColumns = [
    'Code',
    'ItemName',
    'Price'
    //'Qty'
  ];
  displayedColumns1 = [
    'ItemName',
    'Price',
    'Qty',
    //'ReturnQty',
    'Amount'
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
  vDiscAmt: any;
  vDisc: any;

  dsItemTable1 = new MatTableDataSource<ItemTable1List>();
  dsItemDetTable2 = new MatTableDataSource<ItemDetTable2List>();
  dsBillList = new MatTableDataSource<BillList>();
  dsBillDetailList = new MatTableDataSource<BillDetailList>();
  dsNursingBillList = new MatTableDataSource<NursingBillList>();

  f_name = '%'
  l_name = '%'
  regNo = '0'
  fromdate = '2025-01-01'// this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  todate = '2025-12-01'//this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    public _CanteenmanagementService: CanteenmanagementService, public toastr: ToastrService,
    private _loggedService: AuthenticationService, private _FormBuilder: UntypedFormBuilder,
    public datePipe: DatePipe, private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  ngOnInit(): void {
    this.getItemTable1List();
    this.myFilterbillform = this._CanteenmanagementService.myFilterbrowseform();


    this.CanteenForm = this.createCanteenform()
    this.CanteenForm.markAllAsTouched();

    this.canteendetailform = this.tCanteenRequestDetails();
    this.canteendetailform.markAllAsTouched();
    this.canteendetailArray.push(this.tCanteenRequestDetails());

    this.getBillListData()
  }

  autocompleteModeCashcounter: string = "CashCounter";
  RegId = 20
  Opipid = 241330

  createCanteenform(): FormGroup {

    return this._FormBuilder.group({
      "reqId": this.RegId,
      "date": [(new Date()).toISOString()],
      "time": [(new Date()).toISOString()],
      "reqNo": "string",
      "opIpId": this.Opipid,
      "opIpType": 0,
      "wardId": [this.RoomId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      "cashCounterId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      "isFree": false,
      "unitId": [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
      "isBillGenerated": true,
      "isPrint": true,
      tCanteenRequestDetails: this._FormBuilder.array([]),
    })
  }


  tCanteenRequestDetails(element: any = {}): FormGroup {
    return this._FormBuilder.group({
      reqDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      requestId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      itemId: [Number(element.ItemID) ?? 0],
      unitMrp: [element.Price ?? 0],
      qty: element.Qty,
      totalAmount: this.vTotalFinalAmount || 0,
      isBillGenerated: true,
      isCancelled: false
    });
  }


  get canteendetailArray(): FormArray {
    return this.CanteenForm.get('tCanteenRequestDetails') as FormArray;
  }


  applyFilter() {
    this.dsItemTable1.filter = this.Itemsearch.trim().toLowerCase();
  }

  Save() {
    console.log(this.CanteenForm.value)

    if (this._CanteenmanagementService.userFormGroup.get('CustomerName').value == '') {
      this.toastr.warning('Please select a Customer Name .', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning'
      });
      return;
    }

    // if (!this.CanteenForm.invalid) {

    this.canteendetailArray.clear();
    if (this.dsItemDetTable2.data.length === 0) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning');
      return;
    }
    this.dsItemDetTable2.data.forEach(item => {
      this.canteendetailArray.push(this.tCanteenRequestDetails(item));
    });

    this.CanteenForm.get("wardId").setValue(this.RoomId)
    // this.CanteenForm.get("opIpId").setValue(this._CanteenmanagementService.userFormGroup.get('Code').value)
    // this.CanteenForm.get("tCanteenRequestDetails.totalAmount").setValue(this._CanteenmanagementService.userFormGroup.get('TotalAmount').value)

    console.log(this.CanteenForm.value)


    this._CanteenmanagementService.canteenrequestSave(this.CanteenForm.value).subscribe(response => {
      //  this.viewgetLabrequestReportPdf(response)
      // this.d.closeAll();

    });
    // } else {
    //   let invalidFields: string[] = [];

    //   if (this.CanteenForm.invalid) {
    //     for (const controlName in this.CanteenForm.controls) {
    //       const control = this.CanteenForm.get(controlName);

    //       if (control instanceof FormGroup || control instanceof FormArray) {
    //         for (const nestedKey in control.controls) {
    //           if (control.get(nestedKey)?.invalid) {
    //             invalidFields.push(`Nested: ${controlName}.${nestedKey}`);
    //           }
    //         }
    //       } else if (control?.invalid) {
    //         invalidFields.push(`MainForm: ${controlName}`);
    //       }
    //     }
    //   }
    //   if (invalidFields.length > 0) {
    //     invalidFields.forEach(field => {
    //       this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
    //       );
    //     });
    //   }
    // }
  }



  getItemTable1List() {

    var vdata = this._CanteenmanagementService.userFormGroup.get('ItemID').value

    this._CanteenmanagementService.getItemTable1List(vdata).subscribe(data => {
      this.dsItemTable1.data = data as ItemTable1List[];
      console.log(data)
      this.dsItemTable1.sort = this.sort;
      this.dsItemTable1.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }



  getItemDetailList(row) {
    // console.log(row);
    this.sIsLoading = 'loading-data';
    this.sIsLoading = 'save';
    this.dsItemDetTable2.data = [];
    // if (this.chargeslist && this.chargeslist.length > 0) {
    //   let duplicateItem = this.chargeslist.filter((con, index) => con.ItemID === row.ItemID);
    //   if (duplicateItem && duplicateItem.length == 0) {
    //     this.addChargList(row);
    //     return;
    //   }
    //   this.sIsLoading = '';
    //   this.dsItemDetTable2.data = this.chargeslist;
    // } else if (this.chargeslist && this.chargeslist.length == 0) {
    this.addChargList(row);
    // }
  }

  addChargList(row) {
    // 

    this.chargeslist.push(
      {
        ItemID: row.itemID,
        ItemName: row.itemName,
        Price: row.price || 0,
        Qty: 1,
        Amount: row.price
      });
    this.sIsLoading = '';
    //  console.log(this.chargeslist);
    this.dsItemDetTable2.data = this.chargeslist;

    this.getTotalAmount()
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
    return this.vTotalFinalAmount;

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
      this.vTotalFinalAmount.toFixed(2);
    }
    if (disc) {
      let dis = this._CanteenmanagementService.userFormGroup.get('Discount').value;
      this.vDiscAmt = ((dis * parseInt(this.vTotalFinalAmount)) / 100).toFixed(2);
      this.vTotalFinalAmount = this.vTotalFinalAmount - this.vDiscAmt;
      //  total = this.vTotalFinalAmount.toFixed(2);
      // this.CalculateDisAmt();
    }

  }
  CalculateDisAmt() {
    this.vTotalFinalAmount = (parseInt(this.vTotalFinalAmount) - parseInt(this.vDiscAmt));
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
    console.log(data);
    this._CanteenmanagementService.getBillList(data).subscribe(data => {
      this.dsBillList.data = data.data as BillList[];
      console.log(data)

    },
      error => {
        this.sIsLoading = '';
      });
  }
  //BillDetailList ReqId
  getBillDetList(Param) {

    let filters: any[] = [];


    filters.push(

      {
        "fieldName": "ReqId",
        "fieldValue": String(Param.reqId),
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
    this._CanteenmanagementService.getBillDetList(data).subscribe(data => {
      this.dsBillDetailList.data = data.data as BillDetailList[];
      console.log(this.dsBillDetailList.data)

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
      // console.log(this.dsNursingBillList.data)
      this.dsNursingBillList.sort = this.sort;
      this.dsNursingBillList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  RoomId = 0
  onChangeWard(e) {
    // debugger
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
    debugger
    this.fromDate = this.datePipe.transform(this.myFilterbillform.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilterbillform.get('enddate').value, "yyyy-MM-dd")
    this.f_name = this.myFilterbillform.get('FirstName').value + "%"
    this.l_name = this.myFilterbillform.get('LastName').value + "%"
    this.regNo = this.myFilterbillform.get('RegNo').value || "0"
    this.getfilterdataBill();
  }

  getfilterdataBill() {
    debugger
    this.gridConfig = {
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
    this.grid.gridConfig = this.gridConfig;
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
  onEdit(element) { }
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

  ItemName: string;
  Qty: any;
  Price: number;
  Amount: number;

  constructor(ItemTable1List) {
    {
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