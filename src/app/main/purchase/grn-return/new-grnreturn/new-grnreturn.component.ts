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
    "checkbox",
    "ItemName",
    "BatchNo",
    "BatchExpDate",
    "ConversionFactor",
    "BalanceQty",
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
  screenFromString = 'admission-form';
  labelPosition: 'before' | 'after' = 'after';
  sIsLoading: string;
  filteredoptionsToStore: Observable<string[]>;
  filteredoptionsSupplier: Observable<string[]>; 
  vGRNReturnItemFilter: any;
  VsupplierId:any=0
  vFinalTotalAmount:any=0
  vFinalNetAmount:any=0
  vFinalVatAmount:any=0
  vFinalDiscAmount:any=0;
  vRoundingAmt:any;

  
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

    this.getStoreList();
    this.getSupplierSearchCombo(); 
  
    this.filteredoptionsSupplier = this._GRNReturnService.NewGRNReturnFrom.get('SupplierId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterSupplier(value)),
    );
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._GRNReturnService.getLoggedStoreList(vdata).subscribe(data => {
      this.ToStoreList = data;
      //console.log(this.ToStoreList) 
      this._GRNReturnService.GRNReturnStoreFrom.get('ToStoreId').setValue(this.ToStoreList[0]);
    });
  }
  vsupplierName:any;
  getSupplierSearchCombo() { 
    if (this.VsupplierId > 0) {
      this.vsupplierName = this.VsupplierName;
    } 
    else {
      this.vsupplierName = this._GRNReturnService.NewGRNReturnFrom.get('SupplierId').value;
    }
    var vdata={
      'SupplierName':`${this.vsupplierName}%`,
    }
    this._GRNReturnService.getSupplierSearchList(vdata).subscribe(data => {
      this.SupplierList = data;
      //console.log(this.SupplierList) 
      if(this.VsupplierId != 0){
        const ddValue = this.SupplierList.find(c => c.SupplierId == this.VsupplierId);
       // console.log(ddValue.SupplierName)
        this._GRNReturnService.NewGRNReturnFrom.get('SupplierId').setValue(ddValue.SupplierName);
        this._GRNReturnService.NewGRNReturnFrom.get('SupplierId').setValue(this.SupplierList[0]);
       
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

  getGrnItemDetailList(Params) {
    this.sIsLoading = 'loading-data';
    var Param = {
      "GrnId": Params.GRNID
    }
    this._GRNReturnService.getGrnItemList(Param).subscribe(data => {
      this.dsItemNameList1.data = data as ItemNameList[];
      console.log(this.dsItemNameList1.data)
      this.dsItemNameList1.data.forEach((element) => {
        this.chargeslist.push(
          {
            ItemId: element.ItemId || 0,
            ItemName: element.ItemName || '',
            BatchNo: element.BatchNo || 0,
            BatchExpDate: element.BatchExpDate,
            ConversionFactor: element.ConversionFactor,
            BalanceQty: element.BalanceQty,
            ReturnQty: 0,
            MRP: element.MRP || 0,
            //Rate: element.Rate || 0,
            TotalAmount: 0,
            VatPer: element.VatPer || 0,
            VatAmount: 0,
            DiscPercentage: element.DiscPercentage || 0,
            DiscAmount: 0,
            LandedRate: element.Rate || 0,
            NetAmount: 0,
            StkID: element.StkID || 0 ,
            GRNID:element.GRNID || 0,
            GRNDetID:element.GRNDetID || 0,
            TotalQty:0
          });
         // console.log(this.chargeslist)
        this.dsGrnItemList.data = this.chargeslist
        this.dsGrnItemList.sort = this.sort;
        this.dsGrnItemList.paginator = this.paginator;
        this.sIsLoading = '';
      }); 
    },
      error => {
        this.sIsLoading = '';
      });
  }
  deleteTableRow(elm) {
    this.dsGrnItemList.data = this.dsGrnItemList.data
      .filter(i => i !== elm)
      .map((i, idx) => (i.position = (idx + 1), i));
      this.toastr.success('Record Deleted Successfully', 'Success !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
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
    this.vFinalTotalAmount = (element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(2);
    this.vFinalVatAmount = (element.reduce((sum, { VatAmount }) => sum += +(VatAmount || 0), 0)).toFixed(2);
    this.vFinalDiscAmount = (element.reduce((sum, { DiscAmount }) => sum += +(DiscAmount || 0), 0)).toFixed(2);
    return this.vFinalTotalAmount;
  }
  
  getNetamt(element) {
   let finalAmt = (element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0)).toFixed(2);
   this.vFinalNetAmount = Math.round(finalAmt).toFixed(2); 
   this.vRoundingAmt = (parseFloat(this.vFinalNetAmount) - (finalAmt)).toFixed(2);
  
    return this.vFinalNetAmount;
  }
  RQty:any; 
  getCellCalculation(contact, ReturnQty) {
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
 
interimArray: any = [];
tableElementChecked(event, element) {
  if (event.checked) {
    this.interimArray.push(element);
  }
}
 
 
Savebtn:boolean=false;
OnSave(){
  if ((!this.dsGrnItemList.data.length)) {
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
  if ((!this.interimArray.length)) {
    this.toastr.warning('Please select Check Box & enter ReturnQty.', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  } 
  this.Savebtn = true;
  let grnReturnSave = {};
  grnReturnSave['grnId'] = this.vGRNID || 0;
  grnReturnSave['grnReturnDate'] = this.dateTimeObj.date;
  grnReturnSave['grnReturnTime'] =this.dateTimeObj.time;
  grnReturnSave['storeId'] =this._loggedService.currentUserValue.user.storeId || 0;
  grnReturnSave['supplierID'] =this._GRNReturnService.NewGRNReturnFrom.get('SupplierId').value.SupplierId;
  grnReturnSave['totalAmount'] = this.vFinalTotalAmount || 0;
  grnReturnSave['grnReturnAmount'] = this.vFinalTotalAmount || 0;
  grnReturnSave['totalDiscAmount'] = this.vFinalDiscAmount || 0;
  grnReturnSave['totalVATAmount'] = this.vFinalVatAmount || 0;
  grnReturnSave['totalOtherTaxAmount'] =0;
  grnReturnSave['totalOctroiAmount'] = 0;
  grnReturnSave['netAmount'] = this.vFinalNetAmount || 0;
  let checkcashtype
  if(this.CashCredittype == false){
    checkcashtype = false; 
  }else{
    checkcashtype = true;
  }

  grnReturnSave['cash_Credit'] = checkcashtype;
  grnReturnSave['remark'] = this._GRNReturnService.NewGRNRetFinalFrom.get('Remark').value || '';
  grnReturnSave['isVerified'] = false;
  grnReturnSave['isClosed'] = false;
  grnReturnSave['addedby'] =this._loggedService.currentUserValue.user.id || 0;
  grnReturnSave['isCancelled'] =false;
  grnReturnSave['grnType'] = 0, 
  grnReturnSave['isGrnTypeFlag'] = true;
  grnReturnSave['grnReturnId'] =0;

  let grnReturnDetailSavearray=[];
  this.interimArray.forEach((element) => {
  //console.log(element)  
  let mrpTotal = element.ReturnQty * element.MRP;
  let PurchaseTotalAmt =element.ReturnQty * element.Rate;

    let grnDetailSaveObj = {};
    grnDetailSaveObj['grnReturnId'] = 0;
    grnDetailSaveObj['itemId'] = element.ItemId || 0;
    grnDetailSaveObj['batchNo'] = element.BatchNo || 0;
    grnDetailSaveObj['batchExpiryDate'] = element.BatchExpDate || 0;
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
    grnDetailSaveObj['stkId'] = element.StkID || 0;
    grnDetailSaveObj['cf'] = element.ConversionFactor || 0;
    grnDetailSaveObj['totalQty'] = element.TotalQty || 0;
    grnDetailSaveObj['grnId'] = element.GRNID || 0
    grnReturnDetailSavearray.push(grnDetailSaveObj);

  });

  let grnReturnUpdateCurrentStockarray = [];
  this.interimArray.forEach((element) => {
    let grnReturnUpdateCurrentStockObj = {};
    let issueqty = element.BalanceQty - element.ReturnQty
    grnReturnUpdateCurrentStockObj['itemId'] = element.ItemId || 0;
    grnReturnUpdateCurrentStockObj['issueQty'] =element.ReturnQty || 0;
    grnReturnUpdateCurrentStockObj['stkId'] = element.StkID || 0;
    grnReturnUpdateCurrentStockObj['storeID'] = this._loggedService.currentUserValue.user.storeId || 0;
    grnReturnUpdateCurrentStockarray.push(grnReturnUpdateCurrentStockObj);
  });

  let grnReturnUpateReturnQtyarray = [];
  this.interimArray.forEach((element) => { 
    let grnReturnUpateReturnQty = {};
    let issueqty = element.BalanceQty - element.ReturnQty
    grnReturnUpateReturnQty['grnDetID'] = element.GRNDetID || 0
    grnReturnUpateReturnQty['returnQty'] =element.issueqty || 0;
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
  debugger
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
        maxWidth: "100%",
        height: '95%',
        width: '95%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
       //console.log(result) 
      this.dsNewGRNReturnItemList.data = result as ItemNameList[];
      this.VsupplierId = this.dsNewGRNReturnItemList.data[0]['SupplierId']
      this.VsupplierName = this.dsNewGRNReturnItemList.data[0]['SupplierName']
      this.vGRNID = this.dsNewGRNReturnItemList.data[0].GRNID
      this.CashCredittype = this.dsNewGRNReturnItemList.data[0].Cash_CreditType
      this.getSupplierSearchCombo(); 
  
      this.getGrnItemDetailList(this.dsNewGRNReturnItemList.data[0]) 
      if(this.dsNewGRNReturnItemList.data[0].Cash_CreditType == false){
        this.isChecked = true;
      }else{
        this.isChecked = false;
      }
    });
  }
}
