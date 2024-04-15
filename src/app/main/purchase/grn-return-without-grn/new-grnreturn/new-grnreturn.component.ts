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
    'ExpDate',
    'BalQty',
    'Qty',
    'PurRate',
    'TotalAmount',
    "GST",
    'GSTAmount',
    'NetAmount',
    'BalanceQty',
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
  vPurRate:any;
  vPurTotal:any;
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
        this.vPurRate = result.PurchaseRate;
        this.vPurTotal = 0;
        this.vGST = result.VatPercentage;
        this.vGSTAmount = 0;
        this.vNetAmount = 0;
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
          ExpDate: this.vExpDates,
          BalQty: this.vBalQty || 0,
          Qty: this.vQty || 0,
          PurRate: this.vPurRate || 0,
          TotalAmount: this.vPurTotal || 0,
          VatPercentage: this.vGST || 0,
          VatAmount: this.vGSTAmount || 0,
          NetAmount: this.vNetAmount || 0,
          BalanceQty:(parseFloat(this.vBalQty) - parseFloat(this.vQty))
        });
      this.dsItemList.data = this.chargeslist
    }
    else {
      this.toastr.warning('Selected Item already added in the list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
    this.ItemReset();
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
    this.vPurRate = 0;
    this.vPurTotal = 0;
    this.vGST = 0;
    this.vGSTAmount = 0;
    this.vNetAmount = 0;
  }
 
  CalculateTotalAmt(){
    if(this.vQty > 0 && this.vBalQty > this.vQty){
      this.vPurTotal = (parseFloat(this.vQty) * parseFloat(this.vPurRate)).toFixed(2);
      this.vNetAmount = this.vPurRate;
    }else{
      this.vQty = '';
      this.vPurTotal = 0;
      this.vGSTAmount =0;
      this.vNetAmount = 0;
      this.toastr.warning('Please Qty lessthan BalQty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
    let RadioValue = this._GRNReturnService.NewGRNReturnFrom.get('GSTType').value || 1 ;
    console.log(RadioValue);
    if(RadioValue == 0){
      this.vGSTAmount = ((parseFloat(this.vGST) * parseFloat(this.vPurTotal)) / 100).toFixed(2);
      this.vNetAmount = (parseFloat(this.vPurTotal) + parseFloat(this.vGSTAmount)).toFixed(2);
    }else{
      this.vGSTAmount = 0;
    }
  }
  vTotalFinalAmount:any;
  vFinalDisAmount:any;
  vFinalVatAmount:any;
  vFinalNetAmount:any;
  vNetRoundAmt:any;

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
     this.vFinalNetAmount = Math.round(FinalRoundAmt).toFixed(2); 
     this.vNetRoundAmt = (parseFloat(this.vFinalNetAmount) - (FinalRoundAmt)).toFixed(2);

    return this.vFinalNetAmount;
  }
  Savebtn:boolean=false;
  OnSave(){
    if ((this.vQty == '' || this.vQty == null || this.vQty == undefined)) {
      this.toastr.warning('Please enter a Qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }
  OnReset(){
    this.dsItemList.data = [];
    this.chargeslist.data = [];
    this.dsTempItemNameList .data = [];
    this._GRNReturnService.NewGRNReturnFrom.reset();
    this._GRNReturnService.ReturnFinalForm.reset();
  }
  onClose(){
    this._matDialog.closeAll();
  }
  public setFocus(nextElementId): void {
    document.querySelector<HTMLInputElement>(`#${nextElementId}`)?.focus();
  }
}

