import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { MaterialConsumptionService } from '../material-consumption.service';
import { MatTableDataSource } from '@angular/material/table';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-new-material-consumption',
  templateUrl: './new-material-consumption.component.html',
  styleUrls: ['./new-material-consumption.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewMaterialConsumptionComponent implements OnInit {
  displayedColumns = [
    'ItemName',
    'BatchNo',
    'ExpDate',
    'BalQty',
    'UsedQty',
    'Rate',
    'MRPTotalAmt',
    'LandedTotalAmt',
    'PurTotalAmt',
    'Remark',
    'StockId',
    'action'
  ];
  dateTimeObj: any;
  StoreList: any = [];
  filteredOptions: any;
  filteredOptionsItem: any;
  noOptionFound: boolean = false;
  isItemIdSelected: boolean = false;
  screenFromString: 'addmision-form';
  vBalQty: any;
  vUsedQty: any;
  vRate: any;
  vRemark: any;
  vItemID: any;
  vbatchNo:any;
  vTotalAmount:any;
  vStockId:any;
  vExpDate:any;
  vItemName:any;
  chargeslist: any = [];
  ItemID:any;
  ItemName:any;
  vPurchaseRate:any;
  vUnitMRP:any;
  vMRP:any;
  vTotalMRP:any;
  vMRPTotalAmt:any;
  vLandedTotalAmt:any;
  vPurTotalAmt:any;

  dsNewmaterialList = new MatTableDataSource<ItemList>();
  dsTempItemNameList = new MatTableDataSource<ItemList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;

  constructor(
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewMaterialConsumptionComponent>,
    public _loggedService: AuthenticationService,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    public _MaterialConsumptionService: MaterialConsumptionService,
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
    this._MaterialConsumptionService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._MaterialConsumptionService.userFormGroup.get('FromStoreId').setValue(this.StoreList[0]);
    });
  }

  getSearchItemList() {
    var m_data = {
      "ItemName": `${this._MaterialConsumptionService.userFormGroup.get('ItemID').value}%`,
      "StoreId": this._MaterialConsumptionService.userFormGroup.get('FromStoreId').value.storeid
    }
    this._MaterialConsumptionService.getItemlist(m_data).subscribe(data => {
      this.filteredOptions = data;
      //console.log(this.filteredOptions)
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
    //console.log(obj)
    this.ItemName = obj.ItemName;
    this.ItemID = obj.ItemId;
    this.vBalQty = obj.BalanceQty;
    if (this.vBalQty > 0) {
      this.getBatch();
    }
  }
  getBatch() {
    this.usedQty.nativeElement.focus();
    const dialogRef = this._matDialog.open(SalePopupComponent,
      {
        maxWidth: "800px",
        minWidth: '800px',
        width: '800px',
        height: '380px',
        disableClose: true,
        data: {
          "ItemId": this._MaterialConsumptionService.userFormGroup.get('ItemID').value.ItemId,
          "StoreId": this._MaterialConsumptionService.userFormGroup.get('FromStoreId').value.storeid
        }
      });
    dialogRef.afterClosed().subscribe(result => {
       console.log(result);

       result=result.selectedData
       debugger
       this.vbatchNo = result.BatchNo;
       this.vMRP = result.UnitMRP;
       this.vTotalMRP = this.vUsedQty * this.vMRP;
       this.vStockId = result.StockId
       this.vRate = result.LandedRate;
       this.vPurchaseRate = result.PurchaseRate;
    });
  }

  onAdd() {
    if ((this.vItemID == '' || this.vItemID == null || this.vItemID == undefined)) {
      this.toastr.warning('Please enter a item', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vUsedQty == '' || this.vUsedQty == null || this.vUsedQty == undefined)) {
      this.toastr.warning('Please enter a Qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
   
    const isDuplicate = this.dsNewmaterialList.data.some(item => item.ItemId === this._MaterialConsumptionService.userFormGroup.get('ItemID').value.ItemId);
    if (!isDuplicate) {

      this.chargeslist = this.dsTempItemNameList.data;
      this.chargeslist.push(
        {
          ItemId: this.ItemID ,//this._MaterialConsumptionService.userFormGroup.get('ItemID').value.ItemId || 0,
          ItemName: this.ItemName, //this._MaterialConsumptionService.userFormGroup.get('ItemID').value.ItemName || '',
          BatchNo: this.vbatchNo || " ",
          BatchExpDate:this.datePipe.transform(this._MaterialConsumptionService.userFormGroup.get("Date").value, "yyyy-MM-dd") || '01/01/1900',
          BalQty: this.vBalQty || 0,
          UsedQty: this.vUsedQty || 0,
          Rate:this.vRate || 0,
          MRPTotalAmt: this.vUsedQty * this.vMRP || 0,
          LandedTotalAmt :this.vUsedQty * this.vRate || 0,
          PurTotalAmt: this.vUsedQty * this.vRate || 0,
          Remark: this.vRemark ||  " ",
          StockId:this.vStockId || 0
        });
      console.log(this.chargeslist);
        this.ItemReset();
      this.dsNewmaterialList.data = this.chargeslist
    } else {
      this.toastr.warning('Selected Item already added in the list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this.ItemReset();
      this.itemid.nativeElement.focus();
    }
  }
  deleteTableRow(element) {
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dsNewmaterialList.data = [];
      this.dsNewmaterialList.data = this.chargeslist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }
  ItemReset() {
    this.ItemName = " ";
    this.vItemID = 0;
    this.vBalQty = 0;
    this.vUsedQty = 0;
    this.vRemark = " ";
    this._MaterialConsumptionService.userFormGroup.get('Date').setValue('');
  }

  getTotalamt(element) {
    this.vMRPTotalAmt = (element.reduce((sum, { MRPTotalAmt }) => sum += +(MRPTotalAmt || 0), 0)).toFixed(2);
    this.vLandedTotalAmt = (element.reduce((sum, { LandedTotalAmt }) => sum += +(LandedTotalAmt || 0), 0)).toFixed(2);
    this.vPurTotalAmt = (element.reduce((sum, { PurTotalAmt }) => sum += +(PurTotalAmt || 0), 0)).toFixed(2);
    return this.vMRPTotalAmt;
}
  QtyCondition(){
    if(this.vBalQty < this.vUsedQty){
      this.toastr.warning('Enter UsedQty less than BalQty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      }); 
      this.vUsedQty = 0;
    }
  }
  OnSave(){
    if ((!this.dsNewmaterialList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
   
    let materialConsumptionObj = {};
    materialConsumptionObj['materialConsumptionId'] = 0;
    materialConsumptionObj['consumptionDate'] = this.dateTimeObj.data;
    materialConsumptionObj['consumptionTime'] =this.dateTimeObj.time;
    materialConsumptionObj['fromStoreId'] =this._loggedService.currentUserValue.user.storeId;
    materialConsumptionObj['landedTotalAmount'] =  this.vLandedTotalAmt || 0;
    materialConsumptionObj['purchaseTotal'] =  this.vPurTotalAmt || 0;
    materialConsumptionObj['mrpTotal'] = this.vMRPTotalAmt || 0;
    materialConsumptionObj['remark'] = this._MaterialConsumptionService.userFormGroup.get('FooterRemark').value || '';
    materialConsumptionObj['addedby'] =this.accountService.currentUserValue.user.id || 0;

    let submitdata={
      'materialconsumptionInsert':materialConsumptionObj
    }
    console.log(submitdata)
    this._MaterialConsumptionService.MaterialconsSave(submitdata).subscribe(response => {
      if (response) {
        this.toastr.success('Record New Material Consumption Saved Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.OnReset();
      } else {
        this.toastr.error('New Material Consumption Data not saved !, Please check validation error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    }, error => {
      this.toastr.error('New Material Consumption Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });
  }
  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('usedQty') usedQty: ElementRef;
  @ViewChild('remark') remark: ElementRef;
  @ViewChild('date') date: ElementRef;

  public onEnterFromstore(event): void {
    if (event.which === 13) {
      this.itemid.nativeElement.focus();
    }
  }
  public onEnteritemid(event): void {
    if (event.which === 13) {
      this.usedQty.nativeElement.focus();
    }
  }
  public onEnterUsedQty(event): void {
    if (event.which === 13) {
      this.remark.nativeElement.focus();
    }
  }
  public onEnterRemark(event): void {
    if (event.which === 13) {
      this.date.nativeElement.focus();
    }
  }
  onClose() {
    this._matDialog.closeAll();
  }
  OnReset(){
   this.ItemReset();
   this.dsNewmaterialList.data = []; 
   this.chargeslist.data = [];
   this.dsTempItemNameList.data =[];
  }
}
export class ItemList {
  ItemName: string;
  BatchNo: any;
  ExpDate: number;
  BalQty: number;
  UsedQty: number;
  Rate: number;
  TotalAmount: number;
  Remark: number;
  StockId: any;
  ItemId:any;
  MRPTotalAmt:any;
  LandedTotalAmt :any;
  PurTotalAmt:any;

  constructor(ItemList) {
    {
      this.ItemName = ItemList.ItemName || '';
      this.BatchNo = ItemList.BatchNo || '';
      this.ExpDate = ItemList.ExpDate || 0;
      this.BalQty = ItemList.BalQty || 0;
      this.UsedQty = ItemList.UsedQty || 0;
      this.Rate = ItemList.Rate || 0;
      this.MRPTotalAmt = ItemList.MRPTotalAmt || 0;
      this.Remark = ItemList.Remark || '';
      this.StockId = ItemList.StockId || 0;
      this.ItemId = ItemList.itemId || 0;
      this.LandedTotalAmt = ItemList.LandedTotalAmt || 0;
      this.PurTotalAmt = ItemList.PurTotalAmt || 0;
    }
  }
}
