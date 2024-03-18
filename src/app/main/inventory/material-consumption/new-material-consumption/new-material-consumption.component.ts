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
import { debug } from 'console';

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
    'TotalAmount',
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
  vlandedTotalAmount:any;
  vPureTotalAmount:any;
  vStoreId:any;
  vfinalTotalAmount
  vStockId:any;
  vExpDate:any;
  vItemName:any;
  chargeslist: any = [];
  vConsumDate=new Date();
  vsaveflag:boolean=false
  vLandedRate:any=0
  vPurchaseRate:any=0
  vVatPercentage:any=0
  vadd:boolean=false

  dsNewmaterialList = new MatTableDataSource<ItemList>();
  dsTempItemNameList = new MatTableDataSource<ItemList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;

  constructor(
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewMaterialConsumptionComponent>,
    // public _loggedService: AuthenticationService,
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
      Id: this.accountService.currentUserValue.user.storeId
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

  ItemID:any;
  ItemName:any;
  getSelectedObj(obj) {
    this.ItemName = obj.ItemName;
    this.ItemID = obj.ItemId;
    this.vBalQty = obj.BalanceQty;
    if (this.vBalQty > 0) {
      this.getBatch();
    }
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
          TotalAmount: this.vTotalAmount || 0,
          Remark: this.vRemark ||  " ",
          StockId:this.vStockId || 0,
          StoreId:this.vStoreId ,
          LandedRate:this.vLandedRate,
          PurchaseRate:this.vPurchaseRate,
          VatPercentage:this.vVatPercentage,
          
        });
      console.log(this.chargeslist);
      
      this.dsNewmaterialList.data = this.chargeslist
    } else {
      this.toastr.warning('Selected Item already added in the list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      // this.ItemReset();
    
    }
    this.ItemReset();
    this.vadd=false;
    this.itemid.nativeElement.focus();
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
    this._MaterialConsumptionService.userFormGroup.get('ItemID').setValue('');
    // this._MaterialConsumptionService.userFormGroup.get('Date').setValue('');
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
      result=result.selectedData
      
       console.log(result);
      this.vbatchNo = result.BatchNo;
      this.vBalQty = result.BalanceQty;
      this.vExpDate = result.BatchExpDate;
      this.vRate = result.LandedRate;
     this.vStoreId=result.StoreId;
      this.vStockId = result.StockId;


      this.vLandedRate=result.LandedRate;
      this.vPurchaseRate=result.PurchaseRate;
      this.vVatPercentage=result.VatPercentage;
    });
  }


  QtyCondition(){
    
    if(this.vBalQty < this.vUsedQty){
      this.toastr.warning('Enter UsedQty less than BalQty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      }); 
      this.vUsedQty = 0;
    }else{
    this.vTotalAmount= this.vUsedQty * this.vRate
    this.vBalQty = this.vBalQty - this.vUsedQty
    }
    this.remark.nativeElement.focus()
  }

  OnSave(){
    if ((!this.dsNewmaterialList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    let insertMaterialConsumption = {};
    insertMaterialConsumption['materialConsumptionId'] = 0;
    insertMaterialConsumption['consumptionDate'] = this.dateTimeObj.date;
    insertMaterialConsumption['consumptionTime'] =this.dateTimeObj.time;
    insertMaterialConsumption['fromStoreId'] =this.accountService.currentUserValue.user.storeId;
    insertMaterialConsumption['landedTotalAmount'] = parseFloat(this.vlandedTotalAmount);
    insertMaterialConsumption['purchaseTotal'] = parseFloat(this.vPureTotalAmount);
    insertMaterialConsumption['mrpTotal'] = parseFloat(this.vfinalTotalAmount);
    insertMaterialConsumption['remark'] = '';
    insertMaterialConsumption['addedby'] =this.accountService.currentUserValue.user.id || 0;

    let insertMaterialConsDetailarray = [];
    let updateCurrentStockarray = [];
    this.dsNewmaterialList.data.forEach(element => {

      let vtotalMRPAmount = ((element.UsedQty) * (element.Rate)).toFixed(2);
      let vatAmount = ((parseFloat(vtotalMRPAmount) * (element.VatPercentage)) / 100).toFixed(2)
      let TotalNet = vtotalMRPAmount + vatAmount
      let vtotalLandedRate = ((element.UsedQty) * (element.LandedRate)).toFixed(2);
      let totalPurAmount = ((element.UsedQty) * (element.PurchaseRate)).toFixed(2);

      let insertMaterialConsDetail = {};
      insertMaterialConsDetail['materialConsumptionId'] = 0;
      insertMaterialConsDetail['itemId'] = element.ItemId;
      insertMaterialConsDetail['batchNo'] = this.accountService.currentUserValue.user.storeId;
     
      insertMaterialConsDetail['batchExpDate'] = element.BatchExpDate;
      insertMaterialConsDetail['qty'] = (element.UsedQty);//element.BalQty;
      insertMaterialConsDetail['perUnitLandedRate'] = element.LandedRate;
      insertMaterialConsDetail['parUnitPurchaseRate'] = element.PurchaseRate;
      insertMaterialConsDetail['perUnitMRPRate'] = element.Rate;
      insertMaterialConsDetail['landedRateTotalAmount'] = parseFloat(vtotalLandedRate);
      insertMaterialConsDetail['purchaseRateTotalAmount'] = parseFloat(totalPurAmount);
      insertMaterialConsDetail['mrpTotalAmount'] = parseFloat(vtotalMRPAmount);
      insertMaterialConsDetail['startDate'] = this.dateTimeObj.date;
      insertMaterialConsDetail['endDate'] = this.dateTimeObj.date;
      insertMaterialConsDetail['remark'] =  this._MaterialConsumptionService.userFormGroup.get('Remark').value || '';
      insertMaterialConsDetailarray.push(insertMaterialConsDetail);
     
      let updateCurrentStock ={}

      updateCurrentStock['itemId']=element.ItemId;
      updateCurrentStock['issueQty']=element.UsedQty;
      updateCurrentStock['storeID']=element.StoreId;
      updateCurrentStock['stkId']=element.StockId;

      updateCurrentStockarray.push(updateCurrentStock);
  });



    let submitdata={
      'insertMaterialConsumption':insertMaterialConsumption,
      'insertMaterialConsDetail':insertMaterialConsDetailarray,
      'updateCurrentStock':updateCurrentStockarray
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

  getTotalamt(element) {
    this.vfinalTotalAmount = (element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(2);
   this.vlandedTotalAmount = (element.reduce((sum, { LandedRate }) => sum += +(LandedRate || 0), 0)).toFixed(2);
  this.vPureTotalAmount = (parseFloat(this.vPurchaseRate) + parseFloat(this.vPurchaseRate)).toFixed(2);
    return this.vfinalTotalAmount;
  
  }

  


  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('usedQty') usedQty: ElementRef;
  @ViewChild('remark') remark: ElementRef;
  @ViewChild('date') date: ElementRef;
  @ViewChild('addbutton') addbutton: ElementRef;


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
      // this.vadd=false;
      this.date.nativeElement.focus();
    }
  }
  onEnterdate(event): void {
    if (event.which === 13) {
      this.addbutton.nativeElement.focus();
      setTimeout(() => {
      this.vadd=true;
     
  }, 10);
    }
    // this.vadd=false;
     
  }
  onClose() {
    this._matDialog.closeAll();
  }


  OnReset(){
   this.ItemReset();
  //  this._MaterialConsumptionService.userFormGroup.reset();
   this.dsNewmaterialList.data = []; 
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

  
  StoreId:any;
  
  BalanceQty:any;
  LandedRate:any;
  UnitMRP:any;
  PurchaseRate:any;
  VatPercentage:any;
  IsBatchRequired:any;
  BatchExpDate: Date;
  ConversionFactor:any;
  CGSTPer:any;
  SGSTPer:any;
  IGSTPer:any;
  IsNarcotic:any;
  ManufactureName:any;
  StockId1:any;
  // IsHighRisk:any;
  // isEmgerency:any;
  // IsLASA:any;
  // IsH1Drug:any;
  // GrnRetQty:any;
  // ExpDays:any;
  // DaysFlag:any;
  // position:any;

  constructor(ItemList) {
    {
      this.ItemName = ItemList.ItemName || '';
      this.BatchNo = ItemList.BatchNo || '';
      this.ExpDate = ItemList.ExpDate || 0;
      this.BalQty = ItemList.BalQty || 0;
      this.UsedQty = ItemList.UsedQty || 0;
      this.Rate = ItemList.Rate || 0;
      this.TotalAmount = ItemList.TotalAmount || 0;
      this.Remark = ItemList.Remark || '';
      this.StockId = ItemList.StockId || 0;
      this.ItemId = ItemList.itemId || 0;


      this.StoreId = ItemList.StoreId || '';
      this.BalanceQty = ItemList.BalanceQty || '';
      this.LandedRate = ItemList.LandedRate || 0;
      this.UnitMRP = ItemList.UnitMRP || 0;
      this.PurchaseRate = ItemList.PurchaseRate || 0;
      this.VatPercentage = ItemList.VatPercentage || 0;
      this.IsBatchRequired = ItemList.IsBatchRequired || 0;
      this.BatchExpDate = ItemList.BatchExpDate || '01/01/1900';
      this.ConversionFactor = ItemList.ConversionFactor || 0;
      this.CGSTPer = ItemList.CGSTPer || 0;

      this.SGSTPer = ItemList.SGSTPer || 0;
      this.IGSTPer = ItemList.IGSTPer || 0;
      this.IsNarcotic = ItemList.IsNarcotic || 0;
      this.ManufactureName = ItemList.ManufactureName || 0;
      this.StockId1 = ItemList.StockId1 || 0;
      // this.IsHighRisk = ItemList.IsHighRisk || 0;
      // this.TotalAmount = ItemList.TotalAmount || 0;
      // this.Remark = ItemList.Remark || '';
      // this.StockId = ItemList.StockId || 0;
      // this.ItemId = ItemList.itemId || 0;
    }
  }
}

