import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ItemNameList } from '../grn-return.component';
import { GrnReturnService } from '../grn-return.service';
import { GrnListComponent } from './grn-list/grn-list.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-new-grnreturn',
  templateUrl: './new-grnreturn.component.html',
  styleUrls: ['./new-grnreturn.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewGRNReturnComponent implements OnInit {
  displayedColumns3 = [
    // "checkbox",
    "ItemName",
    "BatchNo",
    "BatchExpDate",
    "ConversionFactor",
    "BalanceQty",
    'ReceivedQty',
    "ReturnQty",
    "MRP",
    //"Rate",
    "LandedRate",
    "TotalAmount",
    "GstPercentage",
    'GstAmount',
    "DiscPercentage",
    'DiscAmount',
    "NetAmount",
    "TotalQty",
    "stockid",
    "GRNID",
    'Action'
    // "IsVerified",
    // "IsVerifiedDatetime",
    // "IsVerifiedUserId"
  ];

  SpinLoading: boolean = false;
  ToStoreList: any = [];
  VReQty: number = 0;
  VsupplierName: any;
  SupplierList: any;
  optionsToStore: any;
  optionsSupplier: any;
  isPaymentSelected: boolean = false;
  isSupplierSelected: boolean = false;
  isChecked: boolean = true;
  chargeslist: any = [];
  dateTimeObj: any;
  screenFromString = 'GrnReturn-Form';
  labelPosition: 'before' | 'after' = 'after';
  sIsLoading: string;
  filteredoptionsToStore: Observable<string[]>;
  filteredoptionsSupplier: Observable<string[]>;
  vGRNReturnItemFilter: any;
  VsupplierId: any = 0
  vStoreId: any = this._loggedService.currentUserValue.user.storeId
  vFinalTotalAmount: any = 0
  vFinalNetAmount: any = 0
  vFinalVatAmount: any = 0
  vFinalDiscAmount: any = 0;
  vRoundingAmt: any;
  autocompletestore: string = "Store";
  autocompleteSupplier: string = "SupplierMaster"
  vGSTTpe = "GST Return";
  registerObj = new ItemNameList({});
  dsGrnItemList = new MatTableDataSource<ItemNameList>();
  dsNewGRNReturnItemList = new MatTableDataSource<ItemNameList>();
  dsItemNameList1 = new MatTableDataSource<ItemNameList>();
  CashCredittype: any;
  GrnReturnForm: FormGroup

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;

  constructor(
    public _GRNReturnService: GrnReturnService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    public toastr: ToastrService,
    private commonService: PrintserviceService,
    public _formbuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  ngOnInit(): void {

    console.log("GRN Return:", this.data)
    if (this.data?.grnReturnId) {
      this.registerObj = this.data
      this.VsupplierId = this.data.supplierId

      if (this.registerObj.isGrnTypeFlag == true) {
        this.vGSTTpe = 'GST Return';
      } else {
        this.vGSTTpe = 'Without GST';
      }
    }
    this.getGRNreturnlist();
    // this.getStoreList();    
    this.GrnReturnForm = this.CreateGrnReturnInsertForm();
    this.grnReturnDetArray.push(this.createGrnReturnDetInsert());
    this.grnReturnCurrentStockArray.push(this.createGrnReturnCurrentStockInsert());
    this.grnReturnQtyArray.push(this.createGrnReturnQtyInsert());
  }

  CreateGrnReturnInsertForm() {
    let checkcashtype
    if (this.CashCredittype == false) {
      checkcashtype = false;
    } else {
      checkcashtype = true;
    }
    return this._formbuilder.group({
      grnReturn: this._formbuilder.group({
        "grnreturnId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        "grnreturnNo": "string",
        "grnid": [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        "grnreturnDate": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        "grnreturnTime": this.datePipe.transform(new Date(), 'shortTime'),
        "storeId": [Number(this._loggedService.currentUserValue.user.storeId), [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        "supplierId": [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        "totalAmount": this.vFinalTotalAmount || 0,
        "grnReturnAmount": this.vFinalTotalAmount || 0,
        "totalDiscAmount": this.vFinalDiscAmount || 0,
        "totalVatAmount": this.vFinalVatAmount || 0,
        "totalOtherTaxAmount": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        "totalOctroiAmount": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        "netAmount": this.vFinalNetAmount || 0,
        "cashCredit": checkcashtype,
        "remark": [''],
        "isVerified": [false],
        "isClosed": [false],
        "isCancelled": [false],
        "grnType": this._GRNReturnService.NewGRNReturnFrom.get('GSTType').value,
        "isGrnTypeFlag": [true],
        "tGrnreturnDetails": this._formbuilder.array([]),
      }),
      grnReturnCurrentStock: this._formbuilder.array([]),
      grnReturnReturnQt: this._formbuilder.array([]),
    })
  }

  get grnReturnDetArray(): FormArray {
    return this.GrnReturnForm.get('grnReturn.tGrnreturnDetails') as FormArray;
  }

  createGrnReturnDetInsert(element: any = {}): FormGroup {
    let inputDate = element.BatchExpDate.split(" ")[0]; // take only date part
    let parts = inputDate.split("-");                   // ["08","07","2025"]
    let ExpDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // yyyy-MM-dd
    let mrpTotal = element.ReturnQty * element.MRP;
    let PurchaseTotalAmt = element.ReturnQty * element.Rate;

    return this._formbuilder.group({
      grnreturnDetailId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      grnReturnId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      grnId: [element.GRNID, [this._FormvalidationserviceService.onlyNumberValidator()]],
      itemId: [element.ItemId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      batchNo: [element.BatchNo || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      batchExpiryDate: [ExpDate, [this._FormvalidationserviceService.validDateValidator()]],
      returnQty: [element.ReturnQty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      landedRate: [element.LandedRate || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      mrp: [element.MRP || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      unitPurchaseRate: [element.Rate || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      vatPercentage: [element.VatPer || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      vatAmount: [element.VatAmount || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      taxAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otherTaxAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      octroiPer: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      octroiAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      landedTotalAmount: [element.TotalAmount || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      mrpTotalAmount: [mrpTotal || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      purchaseTotalAmount: [PurchaseTotalAmt || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      conversion: [element.ConversionFactor || 1, [this._FormvalidationserviceService.onlyNumberValidator()]],
      remarks: '',
      stkId: [element.StkID || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      cf: [element.ConversionFactor || 1, [this._FormvalidationserviceService.onlyNumberValidator()]],
      totalQty: [element.TotalQty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }

  get grnReturnCurrentStockArray(): FormArray {
    return this.GrnReturnForm.get('grnReturnCurrentStock') as FormArray;
  }

  createGrnReturnCurrentStockInsert(element: any = {}): FormGroup {
    return this._formbuilder.group({
      itemId: [element.ItemId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      issueQty: [element.ReturnQty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      stockId: [element.StkID || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      storeID: [this.vStoreId, [this._FormvalidationserviceService.onlyNumberValidator()]]
    });
  }

  get grnReturnQtyArray(): FormArray {
    return this.GrnReturnForm.get('grnReturnReturnQt') as FormArray;
  }

  createGrnReturnQtyInsert(element: any = {}): FormGroup {
    return this._formbuilder.group({
      grndetId: [element.GRNDetID || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      returnQty: [element.issueqty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]]
    });
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  selectChangeStore(obj: any) {
    console.log("Store:", obj);
    this.vStoreId = obj.value
  }

  selectChangeSupplier(obj: any) {
    console.log("Supplier:", obj);
    this.VsupplierId = obj.value
  }

  // dont delete commented code
  // getGrnItemDetailList(Params) {
  //   debugger
  //   var Param = {
  //     "first": 0,
  //     "rows": 10,
  //     "sortField": "GRNID",
  //     "sortOrder": 0,
  //     "filters": [
  //       {
  //         "fieldName": "GRNID",
  //         "fieldValue": String(Params.grnid),
  //         "opType": "Equals"
  //       }
  //     ],
  //     "exportType": "JSON",
  //     "columns": [
  //       {
  //         "data": "string",
  //         "name": "string"
  //       }
  //     ]
  //   }
  //   console.log(Param)
  //   this._GRNReturnService.getGrnItemList(Param).subscribe(data => {
  //     this.dsItemNameList1.data = data.data as ItemNameList[];
  //     console.log(this.dsItemNameList1.data)
  //     this.dsItemNameList1.data.forEach((element) => {
  //       this.chargeslist.push(
  //         {
  //           ItemId: element.itemId || 0,
  //           ItemName: element.itemName || '',
  //           BatchNo: element.batchNo || 0,
  //           BatchExpDate: element.batchExpDate,
  //           // BatchExpDate: new Date(element.batchExpDate.split("-").reverse().join("-") + "T00:00:00").toISOString(),
  //           ConversionFactor: element.conversionFactor,
  //           BalanceQty: element.balanceQty,
  //           ReturnQty: 0,
  //           MRP: element.mrp || 0,
  //           ReceiveQty: element.ReceiveQty || 0,
  //           //Rate: element.Rate || 0,
  //           TotalAmount: 0,
  //           VatPer: element.vatPer || 0,
  //           VatAmount: 0,
  //           DiscPercentage: element.discPercentage || 0,
  //           DiscAmount: 0,
  //           LandedRate: element.rate || 0,
  //           NetAmount: 0,
  //           StkID: element.stkId || 0 ,
  //           GRNID:element.grnid || 0,
  //           GRNDetID:element.grnDetID || 0,
  //           TotalQty:0
  //         });

  //           // TotalAmount: element.totalAmount || 0,// returnQty
  //           // VatAmount: element.vatAmount || 0,//
  //           // NetAmount: element.netAmount || 0, 
  //           // TotalQty:element.totalQty || 0//

  //        // console.log(this.chargeslist)
  //       this.dsGrnItemList.data = this.chargeslist
  //       console.log(this.dsGrnItemList.data)
  //       this.dsGrnItemList.sort = this.sort;
  //       this.dsGrnItemList.paginator = this.paginator;
  //       this.sIsLoading = '';
  //     }); 
  //   },
  //     error => {
  //       this.sIsLoading = '';
  //     });
  // }

  getGrnItemDetailList(Params) {
    // debugger;
    this.chargeslist = [];
    var Param = {
      "first": 0,
      "rows": 10,
      "sortField": "GRNID",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "GRNID",
          "fieldValue": String(Params.grnid),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]
    };

    console.log("Fetching GRN items with:", Param);

    this._GRNReturnService.getGrnItemList(Param).subscribe(data => {
      const itemList = data.data as ItemNameList[];
      console.log("Fetched item list:", itemList);

      itemList.forEach(element => {
        this.chargeslist.push({
          ItemId: element.itemId || 0,
          ItemName: element.itemName || '',
          BatchNo: element.batchNo || 0,
          BatchExpDate: element.batchExpDate,
          ConversionFactor: element.conversionFactor,
          BalanceQty: element.balanceQty,
          ReturnQty: 0,
          MRP: element.mrp || 0,
          ReceiveQty: element.receiveQty || 0,
          TotalAmount: 0,
          VatPer: element.vatPer || 0,
          VatAmount: 0,
          DiscPercentage: element.discPercentage || 0,
          DiscAmount: 0,
          LandedRate: element.rate || 0,
          NetAmount: 0,
          StkID: element.stkId || 0,
          GRNID: element.grnid || 0,
          GRNDetID: element.grnDetID || 0,
          TotalQty: 0
        });
      });

      // Assign after all items are processed
      this.dsGrnItemList.data = this.chargeslist;
      console.log("Updated data source:", this.dsGrnItemList.data);

      this.dsGrnItemList.sort = this.sort;
      this.dsGrnItemList.paginator = this.paginator;
      this.getTotalamt(this.dsGrnItemList.data);
      // this.getNetamt(this.dsGrnItemList.data);
    });
  }

  deleteTableRow(elm) {
    // debugger
    this.dsGrnItemList.data = this.dsGrnItemList.data
      .filter(i => i !== elm)
      .map((i, idx) => (i.position = (idx + 1), i));
    this.toastr.success('Record Deleted Successfully', 'Success !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
  }

  // parseDate(dateStr: string): Date | null {

  //   const parts = dateStr.split(' ');
  //   const dateParts = parts[0].split('-'); // ["31", "07", "2026"]
  //   const time = parts[1] || '00:00:00';

  //   if (dateParts.length === 3) {
  //     const formatted = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${time}`;
  //     return new Date(formatted);
  //   }

  //   return null;
  // }
  parseDate(dateStr: string | null | undefined): Date | null {
    if (!dateStr) return null;  // prevent split on undefined/null

    const parts = dateStr.split(' ');
    const dateParts = parts[0]?.split('-') ?? [];

    if (dateParts.length === 3) {
      const [day, month, year] = dateParts;
      const time = parts[1] || '00:00:00';
      // convert dd-MM-yyyy HH:mm:ss → yyyy-MM-ddTHH:mm:ss
      return new Date(`${year}-${month}-${day}T${time}`);
    }

    return null;
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

  getGRNreturnlist() {
    var vdata = {
      "first": 0,
      "rows": 10,
      "sortField": "GRNReturnId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "GRNReturnId",
          "fieldValue": String(this.registerObj.grnReturnId),
          "opType": "Contains"
        }
      ],
      "exportType": "JSON",
      "columns": []
    }
    this._GRNReturnService.getGRNReturnrtrvlist(vdata).subscribe(response => {
      // this.dsGrnItemList.data = response.data
      this.dsGrnItemList.data = response.data.map(item => ({
        ...item,
        NetAmount: (item.landedRate * item.returnQty) + item.vatAmount,
        VatAmount: item.vatAmount,
        TotalAmount: item.landedTotalAmount,    // or whichever your table uses
        PurchaseRate: item.unitPurchaseRate,
        ReturnQty: item.returnQty
      }));

        const row = this.dsGrnItemList.data

        // want for calculation
        this.getCellCalculation(row, row);

      console.log(this.dsGrnItemList.data)
      this.isGSTVisible = true;
    });
  }
  
  // getTotalamt(element) {
  //   debugger
  //   this.vFinalTotalAmount = (element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(2);
  //   this.vFinalVatAmount = (element.reduce((sum, { VatAmount }) => sum += +(VatAmount || 0), 0)).toFixed(2);
  //   this.vFinalDiscAmount = (element.reduce((sum, { DiscAmount }) => sum += +(DiscAmount || 0), 0)).toFixed(2);

  //   let finalAmt = (element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0)).toFixed(2);
  //   this.vFinalNetAmount = Math.round(finalAmt).toFixed(2);
  //   this.vRoundingAmt = (parseFloat(this.vFinalNetAmount) - (finalAmt)).toFixed(2);

  //   if (this.vGSTTpe === "Without GST") {
  //     this.vFinalVatAmount = "0.00";
  //   } else {
  //     this.vFinalVatAmount = (element.reduce((sum, { VatAmount }) => sum += +(VatAmount || 0), 0)).toFixed(2);
  //   }

  //   this._GRNReturnService.NewGRNRetFinalFrom.patchValue({
  //     FinalTotalAmount: this.vFinalTotalAmount,
  //     FinalDiscAmountt: this.vFinalDiscAmount,
  //     FinalVatAmount: this.vFinalVatAmount,
  //     FinalNetAmount: this.vFinalNetAmount,
  //     RoundingAmt: this.vRoundingAmt
  //   })
  //   // return this.vFinalTotalAmount;
  // }
   getTotalamt(element) {
    debugger
    this.vFinalTotalAmount = (element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(2);
    this.vFinalVatAmount = (element.reduce((sum, { VatAmount }) => sum += +(VatAmount || 0), 0)).toFixed(2);
    this.vFinalDiscAmount = (element.reduce((sum, { DiscAmount }) => sum += +(DiscAmount || 0), 0)).toFixed(2);

    let finalAmt = (element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0)).toFixed(2);
    this.vFinalNetAmount = Math.round(finalAmt).toFixed(2);
    this.vRoundingAmt = (parseFloat(this.vFinalNetAmount) - (finalAmt)).toFixed(2);

    if (this.vGSTTpe === "Without GST") {
      this.vFinalVatAmount = "0.00";
    } else {
      this.vFinalVatAmount = (element.reduce((sum, { VatAmount }) => sum += +(VatAmount || 0), 0)).toFixed(2);
    }

    this._GRNReturnService.NewGRNRetFinalFrom.patchValue({
      FinalTotalAmount: this.vFinalTotalAmount,
      FinalDiscAmountt: this.vFinalDiscAmount,
      FinalVatAmount: this.vFinalVatAmount,
      FinalNetAmount: this.vFinalNetAmount,
      RoundingAmt: this.vRoundingAmt
    })
    // return this.vFinalTotalAmount;
  }

  onGSTTypeChange() {
    if (this.dsGrnItemList && this.dsGrnItemList.data.length > 0) {
      this.dsGrnItemList.data.forEach(contact => {
        this.getCellCalculation(contact, contact.ReturnQty);
      });

      // refresh totals after recalculation
      this.getTotalamt(this.dsGrnItemList.data);
    }
  }

  RQty: any;
  // getCellCalculation(contact, ReturnQty) {
  //   // debugger
  //   if (parseInt(contact.ReturnQty) > parseInt(contact.BalanceQty)) {
  //     this.toastr.warning('Return Qty cannot be greater than BalQty', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     contact.ReturnQty = 0;
  //     contact.ReturnQty = '';
  //     contact.TotalQty = 0;
  //     contact.TotalAmount = 0;
  //     contact.VatAmount = 0;
  //     contact.DiscAmount = 0;
  //     contact.NetAmount = 0;
  //   }
  //   else {
  //     contact.TotalQty = (parseInt(contact.ReturnQty) * parseInt(contact.ConversionFactor));
  //     contact.TotalAmount = (parseFloat(contact.ReturnQty) * parseFloat(contact.LandedRate)).toFixed(2);
  //     contact.VatAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.VatPer)) / 100).toFixed(2);
  //     contact.DiscAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.DiscPercentage)) / 100).toFixed(2);
  //     let GrossAmt = (parseFloat(contact.TotalAmount) - parseFloat(contact.DiscAmount)).toFixed(2);
  //     contact.NetAmount = (parseFloat(GrossAmt) + parseFloat(contact.VatAmount)).toFixed(2);

  //     // ✅ GST condition
  //     if (this.vGSTTpe === "Without GST") {
  //       contact.VatAmount = 0;
  //       contact.NetAmount = GrossAmt;
  //     } else {
  //       contact.VatAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.VatPer)) / 100).toFixed(2);
  //       contact.NetAmount = (parseFloat(GrossAmt) + parseFloat(contact.VatAmount)).toFixed(2);
  //     }
  //   }
  //   this.getTotalamt(this.dsGrnItemList.data);
  // }
  getCellCalculation(contact, ReturnQty) {
    // debugger
    if (parseInt(contact.ReturnQty) > parseInt(contact.BalanceQty)) {
      this.toastr.warning('Return Qty cannot be greater than BalQty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      contact.ReturnQty = 0;
      contact.ReturnQty = '';
      contact.TotalQty = 0;
      contact.TotalAmount = 0;
      contact.VatAmount = 0;
      contact.DiscAmount = 0;
      contact.NetAmount = 0;
    }
    else {
      contact.TotalQty = (parseInt(contact.ReturnQty) * parseInt(contact.ConversionFactor ?? contact.conversion));
      contact.TotalAmount = (parseFloat(contact.ReturnQty) * parseFloat(contact.LandedRate ?? contact.landedRate)).toFixed(2);
      contact.VatAmount = ((parseFloat(contact.TotalAmount ?? contact.landedTotalAmount) * parseFloat(contact.VatPer ?? contact.vatPercentage)) / 100).toFixed(2);
      contact.DiscAmount = ((parseFloat(contact.TotalAmount ?? contact.landedTotalAmount) * parseFloat(contact.DiscPercentage)) / 100).toFixed(2);
      let GrossAmt = (parseFloat(contact.TotalAmount ?? contact.landedTotalAmount) - parseFloat(contact.DiscAmount)).toFixed(2);
      contact.NetAmount = (parseFloat(GrossAmt) + parseFloat(contact.VatAmount ?? contact.vatAmount)).toFixed(2);

      // ✅ GST condition
      if (this.vGSTTpe === "Without GST") {
        contact.VatAmount = 0;
        contact.NetAmount = (parseFloat(contact.TotalAmount ?? contact.landedTotalAmount)).toFixed(2);
        // contact.NetAmount = GrossAmt;
      } else {
        contact.VatAmount = ((parseFloat(contact.TotalAmount ?? contact.landedTotalAmount) * parseFloat(contact.VatPer ?? contact.vatPercentage)) / 100).toFixed(2);
        contact.NetAmount = (parseFloat(GrossAmt) + parseFloat(contact.VatAmount ?? contact.vatAmount)).toFixed(2);
      }
    }
    this.getTotalamt(this.dsGrnItemList.data);
  }

  getValidationMessages() {
    return {
      ToStoreId: [
        { name: "required", Message: "Store Name is required" }
      ],
      SupplierId: [
        { name: "required", Message: "Supplier Name is required" }
      ]
    };
  }

  Savebtn: boolean = false;

  OnSave() {
    debugger
    if (this._GRNReturnService.NewGRNReturnFrom.get('GSTType').value == 'GST Return') {
      this.GrnReturnForm.get('grnReturn.isGrnTypeFlag').setValue(true)
    } else
      this.GrnReturnForm.get('grnReturn.isGrnTypeFlag').setValue(false)

    this.GrnReturnForm.get('grnReturn.grnid').setValue(this.vGRNID)
    this.GrnReturnForm.get('grnReturn.supplierId').setValue(Number(this.VsupplierId))
    this.GrnReturnForm.get('grnReturn.totalAmount').setValue(this.vFinalTotalAmount)
    this.GrnReturnForm.get('grnReturn.grnReturnAmount').setValue(this.vFinalTotalAmount)
    this.GrnReturnForm.get('grnReturn.totalDiscAmount').setValue(this.vFinalDiscAmount)
    this.GrnReturnForm.get('grnReturn.totalVatAmount').setValue(this.vFinalVatAmount)
    this.GrnReturnForm.get('grnReturn.netAmount').setValue(this.vFinalNetAmount)
    this.GrnReturnForm.get('grnReturn.remark').setValue(this._GRNReturnService.NewGRNRetFinalFrom.get('Remark').value)
    this.GrnReturnForm.get('grnReturn.grnType').setValue(this._GRNReturnService.NewGRNReturnFrom.get('GSTType').value)
    if (!this.GrnReturnForm.invalid) {
      if ((!this.dsGrnItemList.data.length)) {
        this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if ((this.VsupplierId == '' || this.VsupplierId == '0' || this.VsupplierId == null || this.VsupplierId == undefined)) {
        this.toastr.warning('Please Select Supplier name.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }

      if ((this.vStoreId == '' || this.vStoreId == '0' || this.vStoreId == null || this.vStoreId == undefined)) {
        this.toastr.warning('Please Select Store Name.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      const hasInvalidQty = this.dsGrnItemList.data.some(item => !item.ReturnQty || isNaN(item.ReturnQty) || Number(item.ReturnQty) <= 0);

      if (hasInvalidQty) {
        this.toastr.warning('ReturnQty must be greater than zero.', 'Warning', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }

      let checkcashtype
      if (this.CashCredittype == false) {
        checkcashtype = false;
      } else {
        checkcashtype = true;
      }

      this.Savebtn = true;
      this.grnReturnDetArray.clear();
      this.dsGrnItemList.data.forEach(item => {
        this.grnReturnDetArray.push(this.createGrnReturnDetInsert(item));
      });

      this.grnReturnCurrentStockArray.clear();
      this.dsGrnItemList.data.forEach(item => {
        this.grnReturnCurrentStockArray.push(this.createGrnReturnCurrentStockInsert(item));
      });

      this.grnReturnQtyArray.clear();
      this.dsGrnItemList.data.forEach(item => {
        this.grnReturnQtyArray.push(this.createGrnReturnQtyInsert(item));
      });

      console.log(this.GrnReturnForm.value)
      this._GRNReturnService.GRNReturnSave(this.GrnReturnForm.value).subscribe(response => {
        if (response) {
          this.OnReset();
          this.viewgetGRNreturnReportPdf(response);
          this.Savebtn = true;
          this.isChecked = false;
        }
      });
    } else {
      let invalidFields: string[] = [];

      if (this.GrnReturnForm.invalid) {
        // Loop through top-level controls
        for (const controlName in this.GrnReturnForm.controls) {
          const control = this.GrnReturnForm.controls[controlName];

          if (control instanceof FormArray) {
            // Handle FormArray (in your case 'grn')
            control.controls.forEach((group: any, index: number) => {
              Object.keys(group.controls).forEach(key => {
                if (group.get(key)?.invalid) {
                  invalidFields.push(`Nested Form[${index + 1}] -> ${key}`);
                }
              });
            });
          } else {
            // Handle normal controls
            if (control.invalid) {
              invalidFields.push(`Form: ${controlName}`);
            }
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning');
        });
      }
    }

  }

  viewgetGRNreturnReportPdf(GRNReturnId) {
    this.commonService.Onprint("GRNReturnId", GRNReturnId, "GRNReturnReport");
  }
  OnReset() {
    this._GRNReturnService.NewGRNReturnFrom.reset();
    this._GRNReturnService.NewGRNRetFinalFrom.reset();
    this.dsGrnItemList.data = [];
    this._matDialog.closeAll();
    this.chargeslist.data = [];
  }

  vGRNID: any = 0;
  isGSTVisible: boolean = false;
  getGRNList() {
    this.dsGrnItemList.data = [];
    this.chargeslist.data = [];
    const dialogRef = this._matDialog.open(GrnListComponent,
      {
        // maxWidth: "100%",
        maxHeight: '95vh',
        width: '85%',
      });
    dialogRef.afterClosed().subscribe(result => {
      this.isGSTVisible = true;
      console.log("ddddddaaaaaatttttaaa", result);

      this.dsNewGRNReturnItemList.data = result as ItemNameList[];

      this.dsNewGRNReturnItemList.data.forEach(item => {
        console.log("Processing item:", item);

        this.getGrnItemDetailList(item);
        this.vGRNID = item.grnid
      });

      if (this.dsNewGRNReturnItemList.data.length > 0) {
        const firstItem = this.dsNewGRNReturnItemList.data[0];
        this.VsupplierId = firstItem.supplierId;
        this.vStoreId = firstItem.storeId;
        this.VsupplierName = firstItem.supplierName;
        // this.vGRNID = firstItem.grnid;
        this.CashCredittype = firstItem.cash_CreditType;
        // this.isChecked = firstItem.cash_CreditType === false;
      }
    });

  }
  onClose() {
    this._matDialog.closeAll();
  }
}
