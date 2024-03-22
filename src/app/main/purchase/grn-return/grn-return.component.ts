import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { GrnReturnService } from './grn-return.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { RegInsert } from 'app/main/opd/appointment/appointment.component';
import { Observable } from 'rxjs/internal/Observable';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { GrnListComponent } from './grn-list/grn-list.component';
import { ToastrService } from 'ngx-toastr';
import { GrnItemList } from '../good-receiptnote/good-receiptnote.component';

@Component({
  selector: 'app-grn-return',
  templateUrl: './grn-return.component.html',
  styleUrls: ['./grn-return.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class GRNReturnComponent implements OnInit {
  VsupplierId:any=0
  vfinalTotalAmount:any=0
  vfinalNetAmount:any=0
  RQty:any=0;
  vvatAmount:any=0
  displayedColumns = [
    'GRNReturnId',
    'GRNReturnNo',
    'GRNReturnDate',
    'StoreName',
    'SupplierName',
    'UserName',
    'GSTAmount',
    'NetAmount',
    'Remark',
    'AddedBy',
    'action',
  ];
  


  displayedColumns1 = [
    // "Action",
    "ItemName",
    "BatchNo",
   
    // "BatchExpDate"
    // "ConversionFactor",
    // "ReceiveQty",
    "ReturnQty",
    // "FreeQty",
    "MRP"
    // "Rate"
    // "TotalAmount"
    // "VatPercentage",
    // "DiscPercentage",
    // "LandedRate",
    // "NetAmount"
    // "TotalQty",
    // "stockid"
    // "IsVerified",
    // "IsVerifiedDatetime",
    // "IsVerifiedUserId"
  ];

  displayedColumns2 = [
    "Action",
    "GRNNO",
    "GRNDate",
    "SupplierName",
    'TotalAmount',
    'NetAmount',
  ];
  ToStoreList: any = [];
  SupplierList: any;
  optionsToStore: any;
  optionsSupplier: any;
  isPaymentSelected: boolean = false;
  isSupplierSelected: boolean = false;
  isChecked: boolean = true;
  chargeslist: any = [];
  dateTimeObj: any;
  screenFromString = 'admission-form';
  labelPosition: 'before' | 'after' = 'after';
  sIsLoading: string;
  filteredoptionsToStore: Observable<string[]>;
  filteredoptionsSupplier: Observable<string[]>;
  filteredoptionsSupplier2: Observable<string[]>;
  vGRNReturnItemFilter: any;

  dsGRNReturnList = new MatTableDataSource<GRNReturnList>();
  dsGRNReturnItemDetList = new MatTableDataSource<GRNReturnItemDetList>();
  dsGRNReturnItemDetList1 = new MatTableDataSource<ItemNameList>();
  dsNewGRNReturnItemList = new MatTableDataSource<ItemNameList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('paginator1', { static: true }) public paginator1: MatPaginator;
  @ViewChild('paginator2', { static: true }) public paginator2: MatPaginator;
 
  constructor(
    public _GRNReturnService: GrnReturnService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getStoreList();
    this.getGRNReturnList();
    this.getSupplierSearchCombo();

    this.filteredoptionsSupplier = this._GRNReturnService.GRNReturnSearchFrom.get('SupplierId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterSupplier(value)),
    );


    this.filteredoptionsSupplier2 = this._GRNReturnService.NewGRNReturnFrom.get('SupplierId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterSupplier(value)),
    );

  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getStoreList() {
    var vdata = {
      Id: this.accountService.currentUserValue.user.storeId
    }
    this._GRNReturnService.getLoggedStoreList(vdata).subscribe(data => {
      this.ToStoreList = data;
      this._GRNReturnService.GRNReturnSearchFrom.get('ToStoreId').setValue(this.ToStoreList[0]);
      this._GRNReturnService.NewGRNReturnFrom.get('ToStoreId').setValue(this.ToStoreList[0]);
    });
  }
  


  getSupplierSearchCombo() {
    this._GRNReturnService.getSupplierSearchList().subscribe(data => {
      this.SupplierList = data;
      console.log(this.SupplierList )
// debugger
      if (this.VsupplierId !=0) {
        const ddValue = this.SupplierList.filter(c => c.SupplierId == this.VsupplierId);
        this._GRNReturnService.NewGRNReturnFrom.get('SupplierId').setValue(ddValue[0]);
        this._GRNReturnService.NewGRNReturnFrom.updateValueAndValidity();
        return;
      } 
      
    });
  }




  private _filterSupplier(value: any): string[] {
    if (value) {
      const filterValue = value && value.SupplierName ? value.SupplierName.toLowerCase() : value.toLowerCase();

      return this.SupplierList.filter(option => option.SupplierName.toLowerCase().includes(filterValue));
    }

  }
  getOptionTextSupplier(option) {
    return option && option.SupplierName ? option.SupplierName : '';
  }
  getOptionTextSupplier2(option) {
    return option && option.SupplierName ? option.SupplierName : '';
  }
  
  getTotalamt(element) {
    this.vfinalTotalAmount = (element.reduce((sum, { Totalamt }) => sum += +(Totalamt || 0), 0)).toFixed(2);
   this.vvatAmount = (element.reduce((sum, { VatAmount }) => sum += +(VatAmount || 0), 0)).toFixed(2);
  // this.vvatAmount = (parseFloat(this.vPurchaseRate) + parseFloat(this.vPurchaseRate)).toFixed(2);
    return this.vfinalTotalAmount;
  
  }

  getNetamt(element) {
    this.vfinalNetAmount = (element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0)).toFixed(2);
  
    return this.vfinalNetAmount;
  
  }

  getGRNReturnList() {
    this.sIsLoading = 'loading-data';
    var Param = {
      "ToStoreId": this.accountService.currentUserValue.user.storeId || 0,
      "From_Dt": this.datePipe.transform(this._GRNReturnService.GRNReturnSearchFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._GRNReturnService.GRNReturnSearchFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "SupplierId": this._GRNReturnService.GRNReturnSearchFrom.get('SupplierId').value.SupplierId || 0,
      "IsVerify": this._GRNReturnService.GRNReturnSearchFrom.get("Status").value || 0,
    }
    console.log(Param);
    this._GRNReturnService.getGRNReturnList(Param).subscribe(data => {
      this.dsGRNReturnList.data = data as GRNReturnList[];
      console.log(this.dsGRNReturnList.data);
      this.dsGRNReturnList.sort = this.sort;
      this.dsGRNReturnList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  getGRNReturnItemDetList(Params) {
    this.sIsLoading = 'loading-data';
    var Param = {
      "GRNReturnId": Params.GRNReturnId
    }
    this._GRNReturnService.getGRNReturnItemDetList(Param).subscribe(data => {
      this.dsGRNReturnItemDetList.data = data as GRNReturnItemDetList[];
      this.dsGRNReturnItemDetList.sort = this.sort;
      this.dsGRNReturnItemDetList.paginator = this.paginator1;
      this.sIsLoading = '';
      console.log(this.dsGRNReturnItemDetList.data)
    },
      error => {
        this.sIsLoading = '';
      });
  }

  deleteTableRow(elm) {
    this.dsNewGRNReturnItemList.data = this.dsNewGRNReturnItemList.data
      .filter(i => i !== elm)
      .map((i, idx) => (i.position = (idx + 1), i));
      this.toastr.success('Record Deleted Successfully', 'Success !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
  }


  OnReset() { 
    this._GRNReturnService.NewGRNReturnFrom.reset();
    this._GRNReturnService.NewGRNRetFinalFrom.reset();
    this.dsNewGRNReturnItemList.data = [];
  }

  onClear() { }
  getGRNList() {
    const dialogRef = this._matDialog.open(GrnListComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      console.log(result)
     
      this.dsNewGRNReturnItemList.data = result as ItemNameList[];
// debugger
      console.log(this.dsNewGRNReturnItemList.data)
      this.VsupplierId= this.dsNewGRNReturnItemList.data[0]['SupplierId']
      this.getSupplierSearchCombo()
     this.getGrnItemDetailList(this.dsNewGRNReturnItemList.data[0])



    });
}

dsGrnItemList = new MatTableDataSource<ItemNameList>();
getGrnItemDetailList(Params) {
  this.sIsLoading = 'loading-data';
  var Param = {
    "GrnId": Params.GRNID
  }
  this._GRNReturnService.getGrnItemList(Param).subscribe(data => {
    this.dsGrnItemList.data = data as ItemNameList[];

  //  this.VsupplierId=this.dsGrnItemList.data[0]['SupplierId'];
  //  this.getSupplierSearchCombo();
    this.sIsLoading = '';
  },
    error => {
      this.sIsLoading = '';
    });
}


SelectedArray: any = [];
tableElementChecked(event, element) {
  if (event.checked) {
    this.SelectedArray.push(element);
  }
  console.log(this.SelectedArray)
}

getCellCalculation(contact, ReturnQty) {

  this.SelectedArray.push(contact);

  console.log(this.SelectedArray)
  // debugger
  this.RQty = parseInt(ReturnQty);
  if ((parseInt(this.RQty)) > (parseInt(contact.ReceiveQty))) {
    Swal.fire("Return Qty cannot be greater than Qty")

    contact.ReturnQty = parseInt(contact.Qty);
    this.RQty = parseInt(contact.Qty);

    let GrossAmt = (parseFloat(contact.UnitMRP) * parseInt(this.RQty)).toFixed(2);

    // let GrossAmt = (parseFloat(contact.UnitMRP) * parseInt(this.RQty)).toFixed(2);
    let vPurAmt = (parseFloat(contact.PurchaseRate) * parseInt(this.RQty)).toFixed(2);


    let  vLandAmt = ((parseFloat(contact.landedRate) * parseFloat(contact.DiscPer)) / 100).toFixed(2);
    let  VatAmount = ((parseFloat(contact.landedRate) * (parseFloat(contact.VatPer)) / 100) * parseInt(this.RQty)).toFixed(2);
  
  
    let CGSTAmount = (((parseFloat(contact.UnitMRP) * (parseFloat(contact.CGSTPer))) / 100) * parseInt(this.RQty)).toFixed(2);
    let SGSTAmount = (((parseFloat(contact.UnitMRP) * (parseFloat(contact.SGSTPer))) / 100) * parseInt(this.RQty)).toFixed(2);
    let IGSTAmount = ((((parseFloat(contact.UnitMRP) * (parseFloat(contact.IGSTPer))) / 100)) * parseInt(this.RQty)).toFixed(2);
    let TotalAmt = (parseFloat(contact.UnitMRP) * parseInt(this.RQty)).toFixed(2);
    
    // this.TotalAmt = ((parseFloat(contact.UnitMRP) * parseInt(this.RQty)) - (parseFloat(this.DiscAmt))).toFixed(2);

    
      contact.SalesNo = contact.SalesNo,
      contact.SalesDetId = contact.SalesDetId,
      contact.OP_IP_ID = contact.OP_IP_ID,
      contact.ItemName = contact.ItemName,
      contact.BatchNo = contact.BatchNo,
      contact.UnitMRP = contact.UnitMRP,
      contact.Qty = contact.Qty,
      contact.ReturnQty = contact.ReturnQty
      contact.TotalAmount = TotalAmt,
      contact.VatPer = contact.VatPer,
      contact.VatAmount = VatAmount,
      contact.DiscPer = 0,//contact.DiscPer,
      contact.DiscAmount = 0,
      contact.GrossAmount = GrossAmt,
      contact.LandedPrice = contact.LandedPrice,
      contact.TotalLandedAmount = vLandAmt,
      contact.PurRateWf = contact.PurRateWf,
      contact.PurTotAmt = vPurAmt,
      contact.CGSTPer = contact.CGSTPer,
      contact.CGSTAmount = CGSTAmount,
      contact.SGSTPer = contact.SGSTPer,
      contact.SGSTAmount = SGSTAmount,
      contact.IGSTPer = contact.IGSTPer,
      contact.IGSTAmount = IGSTAmount,
      contact.IsPurRate = contact.IsPurRate,
      contact.StkID = contact.StkID,
      contact.conversionFactor=contact.ConversionFactor
      contact.GrnDetID=contact.GRNDetID

  }
  else {
    this.RQty = parseInt(ReturnQty);
    // this.GrossAmt = (parseFloat(contact.UnitMRP) * parseInt(this.RQty)).toFixed(2);
    // this.DiscAmt = ((parseFloat(this.GrossAmt) * parseFloat(contact.DiscPer)) / 100).toFixed(2);
    // this.VatAmount = ((parseFloat(contact.UnitMRP) * (parseFloat(contact.VatPer)) / 100) * parseInt(this.RQty)).toFixed(2);
    // this.CGSTAmount = (((parseFloat(contact.UnitMRP) * (parseFloat(contact.CGSTPer))) / 100) * parseInt(this.RQty)).toFixed(2);
    // this.SGSTAmount = (((parseFloat(contact.UnitMRP) * (parseFloat(contact.SGSTPer))) / 100) * parseInt(this.RQty)).toFixed(2);
    // this.IGSTAmount = ((((parseFloat(contact.UnitMRP) * (parseFloat(contact.IGSTPer))) / 100)) * parseInt(this.RQty)).toFixed(2);
    //this.TotalAmt = (parseFloat(contact.UnitMRP) * parseInt(this.RQty)).toFixed(2);
    
    // this.TotalAmt = ((parseFloat(contact.UnitMRP) * parseInt(this.RQty)) - (parseFloat(this.DiscAmt))).toFixed(2);

  
      contact.SalesNo = contact.SalesNo,
      contact.SalesDetId = contact.SalesDetId,
      contact.OP_IP_ID = contact.OP_IP_ID,
      contact.ItemName = contact.ItemName,
      contact.BatchNo = contact.BatchNo,
      contact.UnitMRP = contact.UnitMRP,
      contact.Qty = contact.Qty,
      contact.ReturnQty = this.RQty,
      // contact.TotalAmount = this.TotalAmt,
      // contact.VatPer = contact.VatPer,
      // contact.VatAmount = this.VatAmount,
      // contact.DiscPer = contact.DiscPer,
      // contact.DiscAmount = this.DiscAmt,
      // contact.GrossAmount = this.GrossAmt,
      // contact.LandedPrice = contact.LandedPrice,
      // contact.TotalLandedAmount = this.LandAmt,
      // contact.PurRateWf = contact.PurRateWf,
      // contact.PurTotAmt = this.PurAmt,
      // contact.CGSTPer = contact.CGSTPer,
      // contact.CGSTAmount = this.CGSTAmount,
      // contact.SGSTPer = contact.SGSTPer,
      // contact.SGSTAmount = this.SGSTAmount,
      // contact.IGSTPer = contact.IGSTPer,
      // contact.IGSTAmount = this.IGSTAmount,
      contact.IsPurRate = contact.IsPurRate,
      contact.StkID = contact.StkID
    // this.selectedssaleDetailList.data = this.Itemselectedlist;

  }
  
}

OnSave(){
  if ((!this.dsNewGRNReturnItemList.data.length)) {
    this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }
  if ((!this._GRNReturnService.NewGRNReturnFrom.get('SupplierId').value.SupplierId)) {
    this.toastr.warning('Please Select Supplier name.', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }

  
  let grnReturnSave = {};
  grnReturnSave['grnId'] = 0;
  grnReturnSave['grnReturnDate'] = this.dateTimeObj.date;
  grnReturnSave['grnReturnTime'] =this.dateTimeObj.time;
  grnReturnSave['storeId'] =this._GRNReturnService.NewGRNReturnFrom.get('ToStoreId').value.StoreId;
  grnReturnSave['supplierID'] =this._GRNReturnService.NewGRNReturnFrom.get('SupplierId').value.SupplierId
  grnReturnSave['totalAmount'] = parseFloat(this.vfinalTotalAmount);
  grnReturnSave['grnReturnAmount'] = parseFloat(this.vfinalTotalAmount);
  grnReturnSave['totalDiscAmount'] = 0;
 
  grnReturnSave['totalVATAmount'] = this.vvatAmount;
  grnReturnSave['totalOtherTaxAmount'] =1,// parseFloat(this.vlandedTotalAmount);
  grnReturnSave['totalOctroiAmount'] = 1,//parseFloat(this.vPureTotalAmount);
  grnReturnSave['netAmount'] = parseFloat(this.vfinalNetAmount);
  grnReturnSave['cash_Credit'] = parseInt(this._GRNReturnService.NewGRNReturnFrom.get('CashType').value)
  grnReturnSave['remark'] = this._GRNReturnService.NewGRNRetFinalFrom.get('Remark').value
  grnReturnSave['isVerified'] =this.accountService.currentUserValue.user.storeId;
  grnReturnSave['isClosed'] =1,
  grnReturnSave['addedby'] =this.accountService.currentUserValue.user.id || 0;
  grnReturnSave['isCancelled'] =1,// parseFloat(this.vPureTotalAmount);
  grnReturnSave['grnType'] = 1,//parseFloat(this.vfinalTotalAmount);
  grnReturnSave['isGrnTypeFlag'] = 0;
  grnReturnSave['grnReturnId'] =0

// debugger
  let grnReturnDetailSavearray=[];
  this.SelectedArray.forEach((element) => {
console.log(element)
    // let vtotalMRPAmount = ((element.UsedQty) * (element.Rate)).toFixed(2);
    // let vatAmount = ((parseFloat(vtotalMRPAmount) * (element.VatPercentage)) / 100).toFixed(2)
    // let TotalNet = vtotalMRPAmount + vatAmount

    // let vtotalLandedRate = ((element.UsedQty) * (element.LandedRate)).toFixed(2);
   
    // let totalPurAmount = ((element.UsedQty) * (element.PurchaseRate)).toFixed(2);
    let grnDetailSaveObj = {};
    grnDetailSaveObj['grnId'] = 0;
    grnDetailSaveObj['itemId'] = element.ItemId || 0;
    grnDetailSaveObj['uomId'] = element.UOMId || 0;
    grnDetailSaveObj['receiveQty'] = element.ReceiveQty || 0;
    grnDetailSaveObj['freeQty'] = element.FreeQty || 0;
    grnDetailSaveObj['mrp'] =  element.LandedRate ||element.UnitMRP || 0;
    grnDetailSaveObj['rate'] = element.Rate || 0;
    grnDetailSaveObj['totalAmount'] = element.TotalAmount || 0;
    grnDetailSaveObj['conversionFactor'] = element.ConversionFactor || 0;
    grnDetailSaveObj['vatPercentage'] = element.VatPercentage || 0;
    grnDetailSaveObj['vatAmount'] = element.VatAmount || 0;
    grnDetailSaveObj['discPercentage'] =0,// element.DiscPercentage || 0;
    grnDetailSaveObj['discAmount'] =0,// element.DiscAmount || 0;
    grnDetailSaveObj['discPerc2'] = 0,//element.DiscPer2 || 0;
    grnDetailSaveObj['discAmt2'] = 0,//element.DiscAmt2 || 0;
    grnDetailSaveObj['otherTax'] = 0; // this.CgstPer;
    grnDetailSaveObj['landedRate'] = element.LandedRate || 0;
    grnDetailSaveObj['netAmount'] = element.NetAmount || 0;
    grnDetailSaveObj['grossAmount'] = element.NetAmount || 0;
    grnDetailSaveObj['totalQty'] = element.TotalQty || 0;
    grnDetailSaveObj['poNo'] = element.PurchaseId || 0;
    grnDetailSaveObj['batchNo'] = element.BatchNo || "";
    grnDetailSaveObj['batchExpDate'] = this.datePipe.transform(element.BatchExpDate, "mm/dd/yyyy");
    grnDetailSaveObj['purUnitRate'] = element.PurUnitRate || 0;
    grnDetailSaveObj['purUnitRateWF'] = element.PurUnitRateWF || 0;
    grnDetailSaveObj['cgstPer'] = element.CGSTPer || 0;
    grnDetailSaveObj['cgstAmt'] = element.CGSTAmt || 0;
    grnDetailSaveObj['sgstPer'] = element.SGSTPer || 0;
    grnDetailSaveObj['sgstAmt'] = element.SGSTAmt || 0;
    grnDetailSaveObj['igstPer'] = element.IGSTPer || 0;
    grnDetailSaveObj['igstAmt'] = element.IGSTAmt || 0;
    grnDetailSaveObj['mrP_Strip'] = element.MRP || 0;
    grnDetailSaveObj['isVerified'] = element.IsVerified;
    grnDetailSaveObj['igstPer'] = element.IGST || 0;
    grnDetailSaveObj['isVerifiedDatetime'] = element.IsVerifiedDatetime || 0;
    grnDetailSaveObj['isVerifiedUserId'] = element.IsVerifiedUserId || 0;
    grnDetailSaveObj['StkID'] = element.StkID || 0;

    grnReturnDetailSavearray.push(grnDetailSaveObj);

  });

  let grnReturnUpdateCurrentStockarray = [];
  this.SelectedArray.forEach((element) => {
    let grnReturnUpdateCurrentStockObj = {};
    grnReturnUpdateCurrentStockObj['itemId'] = element.ItemId || 0;
    grnReturnUpdateCurrentStockObj['issueQty'] = element.ReceiveQty || 0;
    grnReturnUpdateCurrentStockObj['stkId'] = element.StkID || 0;
    grnReturnUpdateCurrentStockObj['storeID'] = element.StoreId || 0;
    
    grnReturnUpdateCurrentStockarray.push(grnReturnUpdateCurrentStockObj);
  });

  let grnReturnUpateReturnQtyarray = [];
  this.SelectedArray.forEach((element) => {
    let grnReturnUpateReturnQty = {};
    grnReturnUpateReturnQty['grnDetID'] = element.GRNDetID || 0;
    grnReturnUpateReturnQty['returnQty'] = element.ReturnQty || 0;
  
    grnReturnUpateReturnQtyarray.push(grnReturnUpateReturnQty);
  });



  let submitdata={
    'grnReturnSave':grnReturnSave,
    'grnReturnDetailSave':grnReturnDetailSavearray,
    'grnReturnUpdateCurrentStock':grnReturnUpdateCurrentStockarray,
    'grnReturnUpateReturnQty':grnReturnUpateReturnQtyarray
  }
  console.log(submitdata)
  this._GRNReturnService.GRNReturnSave(submitdata).subscribe(response => {
    if (response) {
      this.toastr.success('Record New GRN Return Saved Successfully.', 'Saved !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
      this.OnReset();
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
}

export class GRNReturnList {
  GRNReturnId: number;
  GRNReturnDate: number;
  StoreName: string;
  SupplierName: string;
  GSTAmount: number;
  NetAmount: number;
  Remark: string;
  AddedBy: number;
  action: number;
  GRNReturnNo: number;
  UserName: any;

  constructor(GRNReturnList) {
    {
      this.GRNReturnId = GRNReturnList.GRNReturnId || 0;
      this.GRNReturnDate = GRNReturnList.GRNReturnDate || 0;
      this.StoreName = GRNReturnList.StoreName || "";
      this.SupplierName = GRNReturnList.SupplierName || "";
      this.GSTAmount = GRNReturnList.GSTAmount || 0;
      this.NetAmount = GRNReturnList.NetAmount || 0;
      this.Remark = GRNReturnList.Remark || "";
      this.AddedBy = GRNReturnList.AddedBy || 0;
      this.GRNReturnNo = GRNReturnList.GRNReturnNo || 0;
      this.UserName = GRNReturnList.UserName || '';
    }
  }
}

export class GRNReturnItemDetList {

  ItemName: string;
  BatchNo: number;
  BatchExpiryDate: number;
  Conversion:any;
  BalQty: number;
  ReturnQty: number;
  PureRate: number;
  Amount: number;
  GST: number;
  GSTAmount: number;
  NetAmount: number;
  BQty: number;
  StkId: number;
  TotalQty:any;
  MRP:number;
  LandedRate: number;
  Totalamt:any;

  constructor(GRNReturnItemDetList) {
    {

      this.ItemName = GRNReturnItemDetList.ItemName || "";
      this.BatchNo = GRNReturnItemDetList.BatchNo || 0;
      this.BatchExpiryDate = GRNReturnItemDetList.BatchExpiryDate || 0;
      this.BalQty = GRNReturnItemDetList.BalQty || 0;
      this.ReturnQty = GRNReturnItemDetList.ReturnQty || 0;
      this.PureRate = GRNReturnItemDetList.PureRate || 0;
      this.Amount = GRNReturnItemDetList.Amount || 0;
      this.GST = GRNReturnItemDetList.GST || 0;
      this.GSTAmount = GRNReturnItemDetList.GSTAmount || 0;
      this.NetAmount = GRNReturnItemDetList.NetAmount || 0;
      this.BQty = GRNReturnItemDetList.BQty || 0;
      this.StkId = GRNReturnItemDetList.StkId || 0;
      this.Conversion = GRNReturnItemDetList.Conversion || 0;
      this.TotalQty = GRNReturnItemDetList.totalQty || 0;
      this.MRP = GRNReturnItemDetList.MRP || 0;
      this.LandedRate = GRNReturnItemDetList.LandedRate || 0;
      this.Totalamt = GRNReturnItemDetList.Totalamt || 0;
    }
  }
}

// export class NewGRNReturnItemList {

//   GRNNO: number;
//   ItemName: number;
//   BatchNo: number;
//   BalQty: number;
//   ReturnQty: number;
//   LandedRate: number;
//   TotalAmount: number;
//   GST: number;
//   GSTAmount: number;
//   NetAmount: number;
//   IsBatchRequired: number;
//   StkID: number;
//   CF: number;
//   TotalQty: number;
//   GrnId: number;
//   position:any;

//   constructor(NewGRNReturnItemList) {
//     {
//       this.GRNNO = NewGRNReturnItemList.GRNNO || 0;
//       this.ItemName = NewGRNReturnItemList.ItemName || 0;
//       this.BatchNo = NewGRNReturnItemList.BatchNo || 0;
//       this.BalQty = NewGRNReturnItemList.BalQty || 0;
//       this.ReturnQty = NewGRNReturnItemList.ReturnQty || 0;
//       this.LandedRate = NewGRNReturnItemList.LandedRate || 0;
//       this.TotalAmount = NewGRNReturnItemList.TotalAmount || 0;
//       this.GST = NewGRNReturnItemList.GST || 0;
//       this.GSTAmount = NewGRNReturnItemList.GSTAmount || 0;
//       this.NetAmount = NewGRNReturnItemList.NetAmount || 0;
//       this.IsBatchRequired = NewGRNReturnItemList.IsBatchRequired || 0;
//       this.StkID = NewGRNReturnItemList.StkID || 0;
//       this.CF = NewGRNReturnItemList.CF || 0;
//       this.TotalQty = NewGRNReturnItemList.TotalQty || 0;
//       this.GrnId = NewGRNReturnItemList.GrnId || 0;
//     }
//   }
// }
export class ItemNameList {
  // Action: string;

  ItemName: string;
  UOMId: number;
  HSNCode: number;
  BatchNo: number;
  ExpDate: number;
  Qty: number;
  FreeQty: number;
  MRP: number;
  Rate: number;
  TotalAmount: number;
  Disc: number;
  DisAmount: number;
  GSTNo: number;
  GSTAmount: number;
  CGST: number;
  CGSTAmount: number;
  SGST: number;
  SGSTAmount: number;
  IGST: number;
  IGSTAmount: number;
  NetAmount: number;
  position: number;
  ItemID: any;
  ItemId: any;
  VatPer: any;
  VatAmt: any;
  MRP_Strip: any;
  GRNId: any;
  GRNID: any;
  InvoiceNo: any;
  GateEntryNo: any;
  SupplierId: any;
  GrnNumber: any;
  OtherCharge: any;
  DebitNote: any;
  CreditNote: any;
  RoundingAmt: any;
  InvDate: Date;
  PaymentDate: Date;
  TotalDiscAmount: any;
  ReceivedBy: any;
  Remark: any;
  StoreId: any;
  totalVATAmount: any;
  ConversionFactor: any;
  ReceiveQty: any;
  CGSTAmt: number;
  CGSTPer: number;
  SGSTAmt: number;
  SGSTPer: number;
  IGSTPer: number;
  IGSTAmt: number;
  HSNcode: any;
  VatAmount: number;
  VatPercentage: number;
  id: number;
  ConstantId: number;
  discPercentage: number;
  discAmount: number;
  DiscPercentage: number;
  DiscAmount: number;
  DiscPer2: number;
  DiscAmt2: number;
  PaymentType: any;
  GRNType: any;
  DateOfInvoice: any;
  EwayBillDate: Date;
  CurrentDate = new Date();
  Tranprocessmode: any;
  Cash_CreditType: any;
  tranProcessMode: any;
  EwayBillNo: any;
  TotalQty: any;
  UnitofMeasurementName: number;
  UnitofMeasurementId: any;
  POBalQty: any;
  PurchaseId: any;
  IsClosed: boolean;
  PurDetId: any;
  LandedRate: any;
  PurUnitRate: any;
  PurUnitRateWF: any;
  BatchExpDate: any;
  POQty: any;
  ItemDiscAmount:any;
  DiscPer:any;
  ItemTotalAmount:any;
  UOMID:any;
  GrandTotalAmount:any;
  TranProcessId:any;
  UnitMRP:any;
  IsVerified:any;
  IsVerifiedDatetime:any;
  IsVerifiedUserId:any;
  StkID:any;
  IsVerifiedId:any
  VerifiedDateTime:any;
  PurchaseID:any;
  GrnDetID:any;
  ReturnQty:any;
  /**
   * Constructor
   *
   * @param ItemNameList
   */
  constructor(ItemNameList) {
    {
    
      this.ItemName = ItemNameList.ItemName || "";
      this.UOMId = ItemNameList.UOMId || 0;
      this.HSNCode = ItemNameList.HSNCode || 0;
      this.BatchNo = ItemNameList.BatchNo || 0;
      this.ExpDate = ItemNameList.ExpDate || 0;
      this.Qty = ItemNameList.Qty || 0;
      this.FreeQty = ItemNameList.FreeQty || 0;
      this.MRP = ItemNameList.MRP || 0;
      this.Rate = ItemNameList.Rate || 0;
      this.TotalAmount = ItemNameList.TotalAmount || 0;
      this.Disc = ItemNameList.Disc || '';
      this.DisAmount = ItemNameList.DisAmount || 0;
      this.DiscPer2 = ItemNameList.DiscPer2 || 0;
      this.DiscAmt2 = ItemNameList.DiscAmt2 || 0;
      this.GSTNo = ItemNameList.GSTNo || 0;
      this.GSTAmount = ItemNameList.GSTAmount || 0;
      this.CGST = ItemNameList.CGST || 0;
      this.CGSTAmount = ItemNameList.CGSTAmount || 0;
      this.SGST = ItemNameList.SGST || 0;
      this.SGSTAmount = ItemNameList.SGSTAmount || 0;
      this.IGST = ItemNameList.IGST || 0;
      this.IGSTAmount = ItemNameList.IGSTAmount || 0;
      this.NetAmount = ItemNameList.NetAmount || 0;
      this.ItemID = ItemNameList.ItemID || 0;
      this.ItemId = ItemNameList.ItemId || 0;
      this.VatPer = ItemNameList.VatPer || 0;
      this.VatAmt = ItemNameList.VatAmt || 0;
      this.MRP_Strip = ItemNameList.MRP_Strip || 0;
      this.GRNId = ItemNameList.GRNId || 0;
      this.GRNID = ItemNameList.GRNID || 0;
      this.InvoiceNo = ItemNameList.InvoiceNo || 0;
      this.GateEntryNo = ItemNameList.GateEntryNo || 0;
      this.SupplierId = ItemNameList.SupplierId || 0;
      this.GrnNumber = ItemNameList.GrnNumber || 0;
      this.OtherCharge = ItemNameList.OtherCharge || 0;
      this.DebitNote = ItemNameList.DebitNote || 0;
      this.CreditNote = ItemNameList.CreditNote || 0;
      this.RoundingAmt = ItemNameList.RoundingAmt || 0;
      this.InvDate = ItemNameList.InvDate || this.CurrentDate;;
      this.TotalDiscAmount = ItemNameList.TotalDiscAmount || 0;
      this.totalVATAmount = ItemNameList.totalVATAmount || 0;
      this.ReceivedBy = ItemNameList.ReceivedBy || ''
      this.Remark = ItemNameList.Remark || ''
      this.StoreId = ItemNameList.StoreId || 0;
      this.TotalQty = ItemNameList.TotalQty || 0;
      this.EwayBillNo = ItemNameList.EwayBillNo || 0;
      this.Tranprocessmode = ItemNameList.Tranprocessmode || "";
      this.EwayBillDate = ItemNameList.EwayBillDate || this.CurrentDate;
      this.PaymentDate = ItemNameList.PaymentDate || this.CurrentDate;
      this.DateOfInvoice = ItemNameList.DateOfInvoice || this.CurrentDate;
      this.LandedRate = ItemNameList.LandedRate || 0;
      this.PurUnitRate = ItemNameList.PurUnitRate || 0;
      this.PurUnitRateWF = ItemNameList.PurUnitRateWF || 0;
      this.BatchExpDate = ItemNameList.BatchExpDate || 0;
      this.PurchaseId = ItemNameList.PurchaseId || 0;
      this.ItemDiscAmount = ItemNameList.ItemDiscAmount || 0;
      this.DiscPer = ItemNameList.DiscPer || 0;
      this.ItemTotalAmount = ItemNameList.ItemTotalAmount || 0;
      this.UOMID = ItemNameList.UOMID || 0;
      this.GrandTotalAmount = ItemNameList.GrandTotalAmount || 0;
      this.UnitMRP = ItemNameList.UnitMRP || 0;
      this.IsVerified = ItemNameList.IsVerified || 0;
      this.IsVerifiedDatetime = ItemNameList.IsVerifiedDatetime || 0;
      this.IsVerifiedUserId = ItemNameList.IsVerifiedUserId || 0;
      this.StkID = ItemNameList.StkID || 0;
      this.IsVerifiedId = ItemNameList.IsVerifiedId || 0;
      this.VerifiedDateTime = ItemNameList.VerifiedDateTime || 0;
      this.GrnDetID = ItemNameList.GrnDetID || 0; 
       this.ReturnQty = ItemNameList.ReturnQty || 0;
    }
  }
}