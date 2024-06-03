import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { GRNReturnWithoutGRNService } from '../grnreturn-without-grn.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';
import { MatTableDataSource } from '@angular/material/table';
import { ItemList } from 'app/main/pharmacy/brows-sales-return-bill/brows-sales-return-bill.component';
import { ItemNameList } from '../grn-return-withoutgrn.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-new-grnreturn',
  templateUrl: './new-grnreturn.component.html',
  styleUrls: ['./new-grnreturn.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class NewGRNReturnComponent implements OnInit {
  displayedColumns2 = [
    'ItemName',
    'BatchNo',
    'ConversionFactor',
    'ExpDate',
    'BalQty',
    'Qty',
    'LandedRate',
    'TotalAmount',
    'UnitMRP',
    'PurchaseRate',
    "GST",
    'GSTAmount',
    'NetAmount',
    'BalanceQty',
    'StockId',
    'buttons',
  ];

  dateTimeObj:any;
  StoreList:any=[];
  isSupplierIdSelected:boolean=false;
  filteredOptionssupplier:any;
  noOptionFoundsupplier:any;
  isItemIdSelected:boolean=false;
  vItemName:any;
  vBatchNo:any;
  vExpDates:any;
  vBalQty:any;
  vQty:any;
  vLandedRate:any;
  vTotalAmount:any;
  vGST:any;
  vGSTAmount:any;
  vNetAmount:any;
  vSupplierId:any;
  filteredOptions:any;
  noOptionFound:any;
  ItemId:any;
  sIsLoading: string = '';
  ItemName:any;
  chargeslist:any=[];
  vGSTType:any;
  screenFromString:'GrnReturn-Form'
  SpinLoading: boolean = false;
  vGSTTpe:any;
 dsItemList = new MatTableDataSource<ItemNameList>();
 dsTempItemNameList = new MatTableDataSource<ItemNameList>();

  constructor(
    public _GRNReturnService: GRNReturnWithoutGRNService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.gePharStoreList();
    this.vGSTTpe = 'GST Return';
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._GRNReturnService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      console.log(this.StoreList)
      this._GRNReturnService.GRNReturnStoreFrom.get('FromStoreId').setValue(this.StoreList[0]);
    });
  }

  getSuppliernameList() {
    // if(this.vSupplierId){
    //   this.vsupplierName = this._WorkOrderService.WorkorderItemForm.get('SupplierName').value ;
    //  }
    //  else{
    //    this.vsupplierName = this.registerObj.SupplierName;
    //  }
    var m_data = {
      'SupplierName': `${this._GRNReturnService.NewGRNReturnFrom.get('SupplierName').value}%`
    }
    this._GRNReturnService.getSupplierList(m_data).subscribe(data => {
      this.filteredOptionssupplier = data;
      console.log(this.filteredOptionssupplier)
      if (this.filteredOptionssupplier.length == 0) {
        this.noOptionFoundsupplier = true;
      } else {
        this.noOptionFoundsupplier = false;
      }
      // if (this.registerObj.SupplierId > 0) { 
      //   const toSelectSUpplierId = this.filteredOptionssupplier.find(c => c.SupplierId == this.registerObj.SupplierId);
      //   this._GRNReturnService.NewGRNReturnFrom.get('SupplierName').setValue(toSelectSUpplierId);
      //   console.log(toSelectSUpplierId)
      //   this._GRNReturnService.NewGRNReturnFrom.get('SupplierName').setValue(this.filteredOptionssupplier[0]);
      // }
    })
    this.vGSTTpe = 'GST Return';
  }
  getOptionTextSupplier(option) {
    return option && option.SupplierName ? option.SupplierName : '';
  }
  getGRNReturnItemList() {
    var m_data = {
      "ItemName": `${this._GRNReturnService.NewGRNReturnFrom.get('ItemName').value}%`,
      "StoreId": this._GRNReturnService.GRNReturnStoreFrom.get('FromStoreId').value.storeid
    }
    this._GRNReturnService.getItemNameList(m_data).subscribe(data => {
      this.filteredOptions = data;
      if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
  getOptionText(option) {
    if (!option)
      return '';
    return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';
  }
  getSelectedObj(obj) {
    console.log(obj)
    this.ItemId = obj.ItemID;
    this.ItemName = obj.ItemName;
    this.vBalQty = obj.BalQty;
    if(this.vBalQty > 0){
      this.getBatch();
    }
  }
  vLandedrate:any;
  vUnitMRP:any;
  vStockId:any;
  vConversionFactor:any;
  vPurchaseRate:any;

  getBatch() {
    this.setFocus('Qty');
    const dialogRef = this._matDialog.open(SalePopupComponent,
        {
            maxWidth: "800px",
            minWidth: '800px',
            width: '800px',
            height: '380px',
            disableClose: true,
            data: {
                "ItemId": this._GRNReturnService.NewGRNReturnFrom.get('ItemName').value.ItemID,
                "StoreId": this._GRNReturnService.GRNReturnStoreFrom.get('FromStoreId').value.storeid
            }
        });
    dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        result = result.selectedData
        this.vBatchNo = result.BatchNo;
        this.vExpDates = this.datePipe.transform(result.BatchExpDate, "MM-dd-yyyy");
        this.vQty = '';
        this.vBalQty = result.BalanceQty;
        this.vLandedRate = result.LandedRate;
        this.vTotalAmount = 0;
        this.vGST = result.VatPercentage;
        this.vGSTAmount = 0;
        this.vNetAmount = 0; 
        this.vUnitMRP = result.UnitMRP;
        this.vStockId = result.StockId;
        this.vConversionFactor = result.ConversionFactor;
        this.vPurchaseRate = result.PurchaseRate;

    });
}
  onAdd(){
    if ((this.vQty == '' || this.vQty == null || this.vQty == undefined)) {
      this.toastr.warning('Please enter a Qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const isDuplicate = this.dsItemList.data.some(item => item.BatchNo === this._GRNReturnService.NewGRNReturnFrom.get('BatchNo').value);

    if (!isDuplicate) {
      this.dsItemList.data = [];
      this.chargeslist = this.dsTempItemNameList.data;
      this.chargeslist.push(
        {
          ItemId: this._GRNReturnService.NewGRNReturnFrom.get('ItemName').value.ItemID || 0,
          ItemName: this._GRNReturnService.NewGRNReturnFrom.get('ItemName').value.ItemName || '',
          BatchNo: this.vBatchNo || '',
          ConversionFactor: this.vConversionFactor || 0,
          ExpDate: this.vExpDates,
          BalQty: this.vBalQty || 0,
          Qty: this.vQty || 0,
          LandedRate: this.vLandedRate || 0,
          TotalAmount: this.vTotalAmount || 0,
          UnitMRP:this.vUnitMRP || 0,
          PurchaseRate:this.vPurchaseRate || 0,
          VatPercentage: this.vGST || 0,
          VatAmount: this.vGSTAmount || 0,
          NetAmount: this.vNetAmount || 0,
          BalanceQty:(parseFloat(this.vBalQty) - parseFloat(this.vQty)),
          StockId:this.vStockId || 0
        });
      this.dsItemList.data = this.chargeslist
    }
    else {
      this.toastr.warning('Selected Item already added in the list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
    this.ItemReset();
    this.setFocus('ItemName');
    //this.date.setValue(new Date());
    //this._GRNReturnService.userFormGroup.get('ItemName').setValue('');
    //this.vNetAmount = 0;
    //this.itemid.nativeElement.focus();
    //this.vlastDay = '';
  }
  deleteTableRow(element) {
      let index = this.chargeslist.indexOf(element);
      if (index >= 0) {
        this.chargeslist.splice(index, 1);
        this.dsItemList.data = [];
        this.dsItemList.data = this.chargeslist;
      }
      this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
    }
  ItemReset() {
    this.vItemName = '';
    this.ItemName= '';
    this.ItemId = 0;
    this.vBatchNo = '';
    this.vExpDates = '';
    this.vBalQty = 0;
    this.vQty =  0;
    this.vLandedRate = 0;
    this.vTotalAmount = 0;
    this.vGST = 0;
    this.vGSTAmount = 0;
    this.vNetAmount = 0;
  }
 
  CalculateTotalAmt(){
    if(this.vQty > 0 && this.vBalQty >= this.vQty){
      this.vTotalAmount = (parseFloat(this.vQty) * parseFloat(this.vLandedRate)).toFixed(2);
      this.vNetAmount = this.vTotalAmount;
    }else{
      this.vQty = '';
      this.vTotalAmount = 0;
      this.vGSTAmount =0;
      this.vNetAmount = 0;
      this.toastr.warning('Please enter Qty lessthan BalQty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
    let RadioValue = this._GRNReturnService.NewGRNReturnFrom.get('GSTType').value || 1 ;
    console.log(RadioValue);
    if(RadioValue == 'GST Return'){
      this.vGSTAmount = ((parseFloat(this.vGST) * parseFloat(this.vTotalAmount)) / 100).toFixed(2);
      this.vNetAmount = (parseFloat(this.vTotalAmount) + parseFloat(this.vGSTAmount)).toFixed(2);
    }else{
      this.vGSTAmount = 0;
    }
  }
  vTotalFinalAmount:any;
  vFinalDisAmount:any;
  vFinalVatAmount:any;
  vFinalNetAmount:any;
  vNetRoundAmt:any;
  mrpTotalAmount:any;

  getGSTTotalAmt(element) {
    this.vFinalVatAmount = (element.reduce((sum, { VatAmount }) => sum += +(VatAmount || 0), 0)).toFixed(2);
    return this.vFinalVatAmount;
  }
  getTotalAmt(element) {
    this.vTotalFinalAmount = (element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(2);
    return this.vTotalFinalAmount;
  }

  getNetTotalAmt(element) {
     let FinalRoundAmt = (element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0)).toFixed(2);
     this.mrpTotalAmount =  (element.reduce((sum, { UnitMRP }) => sum += +(UnitMRP || 0), 0)).toFixed(2);
     this.vFinalNetAmount = Math.round(FinalRoundAmt).toFixed(2); 
     this.vNetRoundAmt = (parseFloat(this.vFinalNetAmount) - (FinalRoundAmt)).toFixed(2);

    return this.vFinalNetAmount;
  }
  Savebtn:boolean=false;
  OnSave(){
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    if ((!this.dsItemList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vSupplierId == '' || this.vSupplierId == null || this.vSupplierId == undefined)) {
      this.toastr.warning('Please Select Supplier name.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.Savebtn = true;
    let grnReturnSave = {};
    grnReturnSave['grnId'] = 0;
    grnReturnSave['grnReturnDate'] = formattedDate;
    grnReturnSave['grnReturnTime'] = formattedTime;
    grnReturnSave['storeId'] =this._loggedService.currentUserValue.user.storeId || 0;
    grnReturnSave['supplierID'] =this._GRNReturnService.NewGRNReturnFrom.get('SupplierName').value.SupplierId;
    grnReturnSave['totalAmount'] =  this._GRNReturnService.ReturnFinalForm.get('FinalTotalAmt').value|| 0;
    grnReturnSave['grnReturnAmount'] = this._GRNReturnService.ReturnFinalForm.get('FinalTotalAmt').value || 0;
    grnReturnSave['totalDiscAmount'] = 0;
    grnReturnSave['totalVATAmount'] =  this._GRNReturnService.ReturnFinalForm.get('FinalVatAmount').value || 0;
    grnReturnSave['totalOtherTaxAmount'] =0;
    grnReturnSave['totalOctroiAmount'] = 0;
    grnReturnSave['netAmount'] =  this._GRNReturnService.ReturnFinalForm.get('FinalNetPayamt').value || 0;
    grnReturnSave['cash_Credit'] = true//this._GRNReturnService.NewGRNReturnFrom.get('CashType').value;
    grnReturnSave['remark'] = this._GRNReturnService.ReturnFinalForm.get('Remark').value || '';
    grnReturnSave['isVerified'] = false;
    grnReturnSave['isClosed'] = false;
    grnReturnSave['addedby'] =this._loggedService.currentUserValue.user.id || 0;
    grnReturnSave['isCancelled'] =false;
    grnReturnSave['grnType'] = this._GRNReturnService.NewGRNReturnFrom.get('GSTType').value || '';
    grnReturnSave['isGrnTypeFlag'] = true;
    grnReturnSave['grnReturnId'] =0;
  
    let grnReturnDetailSavearray=[];
    this.dsItemList.data.forEach((element) => {

      let totalQty = (parseFloat(element.Qty) * parseFloat(element.ConversionFactor))
  
      let grnDetailSaveObj = {};
      grnDetailSaveObj['grnReturnId'] = 0;
      grnDetailSaveObj['itemId'] = element.ItemId || 0;
      grnDetailSaveObj['batchNo'] = element.BatchNo || '';
      grnDetailSaveObj['batchExpiryDate'] = element.ExpDate || 0;
      grnDetailSaveObj['returnQty'] = element.Qty || 0;
      grnDetailSaveObj['landedRate'] =  element.LandedRate ||  0;
      grnDetailSaveObj['mrp'] = element.UnitMRP || 0;
      grnDetailSaveObj['unitPurchaseRate'] = element.PurchaseRate || 0;
      grnDetailSaveObj['vatPercentage'] = element.VatPercentage || 0;
      grnDetailSaveObj['vatAmount'] = element.VatAmount || 0;
      grnDetailSaveObj['taxAmount'] = 0;
      grnDetailSaveObj['otherTaxAmount'] = 0;
      grnDetailSaveObj['octroiPer'] =  0;
      grnDetailSaveObj['octroiAmt'] =  0;
      grnDetailSaveObj['landedTotalAmount'] =  element.TotalAmount || 0;
      grnDetailSaveObj['mrpTotalAmount'] = this.mrpTotalAmount || 0; 
      grnDetailSaveObj['purchaseTotalAmount'] =  0;
      grnDetailSaveObj['conversion'] = element.ConversionFactor || 0;
      grnDetailSaveObj['remarks'] = ''; 
      grnDetailSaveObj['stkId'] = element.StockId || 0;
      grnDetailSaveObj['cf'] = element.ConversionFactor || 0;
      grnDetailSaveObj['totalQty'] =totalQty || 0;
      grnDetailSaveObj['grnId'] =  0
      grnReturnDetailSavearray.push(grnDetailSaveObj); 
  
    });
  
    let grnReturnUpdateCurrentStockarray = [];
    this.dsItemList.data.forEach((element) => {
      let grnReturnUpdateCurrentStockObj = {};
      grnReturnUpdateCurrentStockObj['itemId'] = element.ItemId || 0;
      grnReturnUpdateCurrentStockObj['issueQty'] = element.Qty || 0;
      grnReturnUpdateCurrentStockObj['stkId'] = element.StockId || 0;
      grnReturnUpdateCurrentStockObj['storeID'] = this._loggedService.currentUserValue.user.storeId || 0;
      grnReturnUpdateCurrentStockarray.push(grnReturnUpdateCurrentStockObj);
    });
  
    let grnReturnUpateReturnQtyarray = [];
    this.dsItemList.data.forEach((element) => {
      let grnReturnUpateReturnQty = {};
      
      let issueqty = element.BalQty - element.Qty
      grnReturnUpateReturnQty['grnDetID'] = 0;
      grnReturnUpateReturnQty['returnQty'] = issueqty || 0;
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
        this.viewgetgrnreturnReportPdf(response);
        this.Savebtn = true;
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
  OnReset(){
    this.dsItemList.data = [];
    this.chargeslist.data = [];
    this.dsTempItemNameList .data = [];
    this._GRNReturnService.NewGRNReturnFrom.reset();
    this._GRNReturnService.ReturnFinalForm.reset();
    this._matDialog.closeAll();
  }
  onClose(){
    this._matDialog.closeAll();
  }
  public setFocus(nextElementId): void {
    document.querySelector<HTMLInputElement>(`#${nextElementId}`)?.focus();
  }


  viewgetgrnreturnReportPdf(GRNReturnId) {
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
}

