import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GrnReturnService } from '../grn-return.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { GrnListComponent } from './grn-list/grn-list.component';
import { ItemNameList } from '../grn-return.component';
import { map, startWith } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

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
    "VatPercentage",
    'VatAmount',
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
  VReQty:number = 0;
  VsupplierName:any;
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
  VsupplierId:any=0
  vStoreId:any=2
  vFinalTotalAmount:any=0
  vFinalNetAmount:any=0
  vFinalVatAmount:any=0
  vFinalDiscAmount:any=0;
  vRoundingAmt:any;
  autocompletestore: string = "Store";
  autocompleteSupplier:string="SupplierMaster"
  
  dsGrnItemList = new MatTableDataSource<ItemNameList>();
  dsNewGRNReturnItemList = new MatTableDataSource<ItemNameList>();
  dsItemNameList1 = new MatTableDataSource<ItemNameList>();
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator; 

  constructor( 
    public _GRNReturnService: GrnReturnService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {

    // this.getStoreList();

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
        ReceiveQty: element.ReceiveQty || 0,
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
    this.sIsLoading = '';
  },
  error => {
    console.error("Error fetching GRN item list:", error);
    this.sIsLoading = '';
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
  
  parseDate(dateStr: string): Date | null {
    
    const parts = dateStr.split(' ');
    const dateParts = parts[0].split('-'); // ["31", "07", "2026"]
    const time = parts[1] || '00:00:00';
  
    if (dateParts.length === 3) {
      const formatted = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${time}`;
      return new Date(formatted);
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
  getTotalamt(element) {
    // console.log("getTotalamt:",element)
    this.vFinalTotalAmount = (element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(2);
    this.vFinalVatAmount = (element.reduce((sum, { VatAmount }) => sum += +(VatAmount || 0), 0)).toFixed(2);
    this.vFinalDiscAmount = (element.reduce((sum, { DiscAmount }) => sum += +(DiscAmount || 0), 0)).toFixed(2);
    return this.vFinalTotalAmount;
  }
  
  getNetamt(element) {
    // console.log("getNetamt:",element)
   let finalAmt = (element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0)).toFixed(2);
   this.vFinalNetAmount = Math.round(finalAmt).toFixed(2); 
   this.vRoundingAmt = (parseFloat(this.vFinalNetAmount) - (finalAmt)).toFixed(2);
  
    return this.vFinalNetAmount;
  }

  RQty:any; 
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
      contact.TotalQty = (parseInt(contact.ReturnQty) * parseInt(contact.ConversionFactor));
      contact.TotalAmount = (parseFloat(contact.ReturnQty) * parseFloat(contact.LandedRate)).toFixed(2);
      contact.VatAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.VatPer)) / 100).toFixed(2);
      contact.DiscAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.DiscPercentage)) / 100).toFixed(2);
      let GrossAmt = (parseFloat(contact.TotalAmount) - parseFloat(contact.DiscAmount)).toFixed(2);
      contact.NetAmount = (parseFloat(GrossAmt) + parseFloat(contact.VatAmount)).toFixed(2);
      
    }
  }
 
// interimArray: any = [];
// tableElementChecked(event, element) {
//   debugger
//   if (event.checked) {
//     this.interimArray.push(element);
//   }
// }
 
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
 
Savebtn:boolean=false;
OnSave(){
  debugger
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
  // if ((!this.interimArray.length)) {
  //   this.toastr.warning('Please select Check Box & enter ReturnQty.', 'Warning !', {
  //     toastClass: 'tostr-tost custom-toast-warning',
  //   });
  //   return;
  // } 

  const hasInvalidQty = this.dsGrnItemList.data.some(item => !item.ReturnQty || isNaN(item.ReturnQty) || Number(item.ReturnQty) <= 0);

  if (hasInvalidQty) {
    this.toastr.warning('ReturnQty must be greater than zero.', 'Warning', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }

  let checkcashtype
  if(this.CashCredittype == false){
    checkcashtype = false; 
  }else{
    checkcashtype = true;
  }

  this.Savebtn = true;

  let grnReturnDetailSavearray=[];
  // this.interimArray.forEach((element) => {
    this.dsGrnItemList.data.forEach((element)=>{
  console.log(element)  
  let mrpTotal = element.ReturnQty * element.MRP;
  let PurchaseTotalAmt =element.ReturnQty * element.Rate;

    let grnDetailSaveObj = {};
    grnDetailSaveObj['grnreturnDetailId'] = 0;
    grnDetailSaveObj['grnReturnId'] = 0;
    grnDetailSaveObj['grnId'] = element.GRNID || 0
    grnDetailSaveObj['itemId'] = element.ItemId || 0;
    grnDetailSaveObj['batchNo'] = element.BatchNo || 0;
    grnDetailSaveObj['batchExpiryDate'] = new Date(element.BatchExpDate.split(" ")[0].split("-").reverse().join("-") + "T00:00:00").toISOString().split('T')[0];
    // grnDetailSaveObj['batchExpiryDate'] = element.BatchExpDate || 0;
    grnDetailSaveObj['returnQty'] = element.ReturnQty || 0;
    grnDetailSaveObj['landedRate'] =  element.LandedRate ||  0;
    grnDetailSaveObj['mrp'] = element.MRP || 0;
    grnDetailSaveObj['unitPurchaseRate'] = element.Rate || 0;
    grnDetailSaveObj['vatPercentage'] = element.VatPer || 0;
    grnDetailSaveObj['vatAmount'] = element.VatAmount || 0;
    grnDetailSaveObj['taxAmount'] = 0;
    grnDetailSaveObj['otherTaxAmount'] = 0;
    grnDetailSaveObj['octroiPer'] =  0;
    grnDetailSaveObj['octroiAmt'] =  0;
    grnDetailSaveObj['landedTotalAmount'] =  element.TotalAmount || 0;
    grnDetailSaveObj['mrpTotalAmount'] = mrpTotal || 0;
    grnDetailSaveObj['purchaseTotalAmount'] = PurchaseTotalAmt || 0;
    grnDetailSaveObj['conversion'] = element.ConversionFactor || 0;
    grnDetailSaveObj['remarks'] = '';
    grnDetailSaveObj['stockId'] = element.StkID || 0;
    grnDetailSaveObj['cf'] = element.ConversionFactor || 0;
    grnDetailSaveObj['totalQty'] = element.TotalQty || 0;
    grnReturnDetailSavearray.push(grnDetailSaveObj);
  });

  let grnReturnSave ={
    "grnreturnId": 0,
    "grnreturnNo": "string",
    "grnid": this.vGRNID || 0,
    "grnreturnDate":new Date(this.dateTimeObj.date).toISOString().split('T')[0],
    "grnreturnTime": this.dateTimeObj.time,
    "storeId": this._loggedService.currentUserValue.storeId || this.vStoreId,
    "supplierId": this.VsupplierId || 0,
    "totalAmount": this.vFinalTotalAmount || 0,
    "grnReturnAmount": this.vFinalTotalAmount || 0,
    "totalDiscAmount": this.vFinalDiscAmount || 0,
    "totalVatAmount": this.vFinalVatAmount || 0,
    "totalOtherTaxAmount": 0,
    "totalOctroiAmount": 0,
    "netAmount": this.vFinalNetAmount || 0,
    "cashCredit": checkcashtype,
    "remark": this._GRNReturnService.NewGRNRetFinalFrom.get('Remark').value || '',
    "isVerified": false,
    "isClosed": false,
    "isCancelled": false,
    "grnType": "string",
    "isGrnTypeFlag": true,
    "tGrnreturnDetails": grnReturnDetailSavearray
  };

  let grnReturnUpdateCurrentStockarray = [];
  // this.interimArray.forEach((element) => {
  this.dsGrnItemList.data.forEach((element)=>{
    let grnReturnUpdateCurrentStockObj = {};
    let issueqty = element.BalanceQty - element.ReturnQty
    grnReturnUpdateCurrentStockObj['itemId'] = element.ItemId || 0;
    grnReturnUpdateCurrentStockObj['issueQty'] =element.ReturnQty || 0;
    grnReturnUpdateCurrentStockObj['stockId'] = element.StkID || 0;
    grnReturnUpdateCurrentStockObj['storeID'] = this._loggedService.currentUserValue.storeId || this.vStoreId;
    grnReturnUpdateCurrentStockarray.push(grnReturnUpdateCurrentStockObj);
  });

  let grnReturnUpateReturnQtyarray = [];
  // this.interimArray.forEach((element) => { 
  this.dsGrnItemList.data.forEach((element)=>{
    let grnReturnUpateReturnQty = {};
    let issueqty = element.BalanceQty - element.ReturnQty
    grnReturnUpateReturnQty['grndetId'] = element.GRNDetID || 0
    grnReturnUpateReturnQty['returnQty'] =element.issueqty || 0;
    grnReturnUpateReturnQtyarray.push(grnReturnUpateReturnQty);
  });

  let submitdata={
    'grnReturn':grnReturnSave,
    'grnReturnCurrentStock':grnReturnUpdateCurrentStockarray,
    'grnReturnReturnQt':grnReturnUpateReturnQtyarray
  }
  console.log(submitdata)
  this._GRNReturnService.GRNReturnSave(submitdata).subscribe(response => {
    if (response) {
      this.toastr.success('Record New GRN Return Saved Successfully.', 'Saved !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
      this.OnReset();
      this.viewgetGRNreturnReportPdf(response);
      this.Savebtn = true;
      this.isChecked = false;
    } else {
      this.toastr.error('New GRN Return Data not saved !, Please check validation error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    }
  }, error => {
    this.toastr.error('New GRN Return Data not saved !, Please check API error..', 'Error !', {
      toastClass: 'tostr-tost custom-toast-error',
    });
  }); 
}

viewgetGRNreturnReportPdf(GRNReturnId) {
  
  setTimeout(() => {
    this.SpinLoading = true;
    this._GRNReturnService.getGRNreturnreportview(
      GRNReturnId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "95vw",
          height: '850px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "GRN RETURN REPORT Viewer"
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

  }, 100);
}
OnReset() { 
  this._GRNReturnService.NewGRNReturnFrom.reset();
  this._GRNReturnService.NewGRNRetFinalFrom.reset();
  this.dsGrnItemList.data = [];
  this._matDialog.closeAll();
  this.chargeslist.data = [];
}
 
  vGRNID:any=0;
  CashCredittype:any;
  getGRNList() {  
    this.dsGrnItemList.data = [];
    this.chargeslist.data = [];
    const dialogRef = this._matDialog.open(GrnListComponent,
      {
        // maxWidth: "100%",
        maxHeight: '95vh',
        width: '85%',
      });
    // dialogRef.afterClosed().subscribe(result => {
    //   debugger
    //   console.log('The dialog was closed - Insert Action', result);
    //    console.log("ddddddaaaaaatttttaaa",result) 
    //   this.dsNewGRNReturnItemList.data = result as ItemNameList[];
    //   this.VsupplierId = this.dsNewGRNReturnItemList.data[0]['supplierId']
    //   this.vStoreId=this.dsNewGRNReturnItemList.data[0]['storeId']
    //   this.VsupplierName = this.dsNewGRNReturnItemList.data[0]['supplierName']
    //   this.vGRNID = this.dsNewGRNReturnItemList.data[0].grnid
    //   this.CashCredittype = this.dsNewGRNReturnItemList.data[0].cash_CreditType
    //   // this.getSupplierSearchCombo(); 
  
    //   this.getGrnItemDetailList(this.dsNewGRNReturnItemList.data[0]) 
    //   if(this.dsNewGRNReturnItemList.data[0].cash_CreditType == false){
    //     this.isChecked = true;
    //   }else{
    //     this.isChecked = false;
    //   }
    // });
    dialogRef.afterClosed().subscribe(result => {
  console.log('The dialog was closed - Insert Action', result);
  console.log("ddddddaaaaaatttttaaa", result);

  this.dsNewGRNReturnItemList.data = result as ItemNameList[];

  this.dsNewGRNReturnItemList.data.forEach(item => {
    debugger
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
    // this.CashCredittype = firstItem.cash_CreditType;
    // this.isChecked = firstItem.cash_CreditType === false;
  }
});

  }
}
