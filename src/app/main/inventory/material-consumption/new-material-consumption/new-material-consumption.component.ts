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
import { element } from 'protractor';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-new-material-consumption',
  templateUrl: './new-material-consumption.component.html',
  styleUrls: ['./new-material-consumption.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewMaterialConsumptionComponent implements OnInit {

  vConsumDate=new Date()
  displayedColumns = [
    'ItemName',
    'BatchNo',
    'ExpDate',
    'BalQty',
    'UsedQty',
    'LandedRate',
    'PurchaseRate',
    'UnitMRP',
    'MRPTotalAmt',
    'LandedTotalAmt',
    'PurTotalAmt',
    'StartDate',
    'EndDate',
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
  ItemID:any;
  ItemName:any;
  vPurchaseRate:any;
  vUnitMRP:any;
  vMRP:any;
  vTotalMRP:any;
  vMRPTotalAmt:any;
  vLandedTotalAmt:any;
  vPurTotalAmt:any;
  vLandedRate:any;
  vVatPercentage:any;
  vbatchExpDate:any;
  sIsLoading: string = '';
  SpinLoading: boolean = false;
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

       result=result.selectedData
       this.vbatchNo = result.BatchNo;
       this.vBalQty = result.BalanceQty;
       this.vMRP = result.UnitMRP;
       this.vStockId = result.StockId
       this.vPurchaseRate = result.PurchaseRate;
       this.vbatchExpDate = result.BatchExpDate;
       this.vLandedRate = result.LandedRate;
       this.vPurchaseRate =result.PurchaseRate;
       this.vUnitMRP = result.UnitMRP;
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
          BatchExpDate: this.datePipe.transform(this.vbatchExpDate, "yyyy-MM-dd") || '01/01/1900',
          StartDate: this.datePipe.transform(this._MaterialConsumptionService.userFormGroup.get("start").value, "yyyy-MM-dd") || '01/01/1900',
          EndDate: this.datePipe.transform(this._MaterialConsumptionService.userFormGroup.get("end").value, "yyyy-MM-dd") || '01/01/1900',
          BalQty: this.vBalQty || 0,
          UsedQty: this.vUsedQty || 0,
          LandedRate:this.vLandedRate,
          PurchaseRate:this.vPurchaseRate,
          UnitMRP: this.vUnitMRP,
          MRPTotalAmt: this.vUsedQty *  this.vUnitMRP|| 0,
          LandedTotalAmt :this.vUsedQty * this.vLandedRate  || 0,
          PurTotalAmt:  this.vUsedQty * this.vPurchaseRate || 0,
          Remark: this.vRemark ||  " ",
          StockId:this.vStockId || 0,
          StoreId:this.vStoreId ,
          
          
        });
      //console.log(this.chargeslist);
      
      this.dsNewmaterialList.data = this.chargeslist
    } else {
      this.toastr.warning('Selected Item already added in the list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      // this.ItemReset();
    
    }
    this.ItemReset();
    //this.vadd=false;
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

  }

  QtyCondition(){
    
    if(this.vBalQty < this.vUsedQty){
      this.toastr.warning('Enter UsedQty less than BalQty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      }); 
      this.vUsedQty = '';
      return 
    } 
    //this.remark.nativeElement.focus()
  }
  vMRPTotalAmount:any;
  vPurTotalAmount:any;
  vLandedTotalAmount:any;
  Savebtn:boolean=false;

  getTotalamt(element) {
    this.vMRPTotalAmount = (element.reduce((sum, { MRPTotalAmt }) => sum += +(MRPTotalAmt || 0), 0)).toFixed(2);
    this.vPurTotalAmount = (element.reduce((sum, { PurTotalAmt }) => sum += +(PurTotalAmt || 0), 0)).toFixed(2);
    this.vLandedTotalAmount = (element.reduce((sum, { LandedTotalAmt }) => sum += +(LandedTotalAmt || 0), 0)).toFixed(2);
    return this.vLandedTotalAmount;
  }
  OnSave(){
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    if ((!this.dsNewmaterialList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.Savebtn=true;
    let materialConsumptionObj = {};
    materialConsumptionObj['materialConsumptionId'] = 0;
    materialConsumptionObj['consumptionDate'] =  formattedDate;
    materialConsumptionObj['consumptionTime'] = formattedTime;
    materialConsumptionObj['fromStoreId'] =this._loggedService.currentUserValue.user.storeId;
    materialConsumptionObj['landedTotalAmount'] = parseInt(this.vLandedTotalAmount) || 0;
    materialConsumptionObj['purchaseTotal'] = parseInt(this.vPurTotalAmount) || 0;
    materialConsumptionObj['mrpTotal'] =parseInt(this.vMRPTotalAmount) || 0;
    materialConsumptionObj['remark'] = this._MaterialConsumptionService.FinalMaterialForm.get('Remark').value;
    materialConsumptionObj['addedby'] =this.accountService.currentUserValue.user.id || 0;

    let insertMaterialConsDetail =[];
    this.dsNewmaterialList.data.forEach((element) =>{
      let insertMaterialConstDetailObj = {};
      insertMaterialConstDetailObj['materialConsumptionId'] = 0;
      insertMaterialConstDetailObj['itemId'] = element.ItemId;
      insertMaterialConstDetailObj['batchNo'] = element.BatchNo;
      insertMaterialConstDetailObj['batchExpDate'] = element.BatchExpDate;
      insertMaterialConstDetailObj['qty'] = element.UsedQty;
      insertMaterialConstDetailObj['perUnitLandedRate'] =element.LandedRate || 0
      insertMaterialConstDetailObj['parUnitPurchaseRate'] = element.PurchaseRate || 0;
      insertMaterialConstDetailObj['perUnitMRPRate'] = element.UnitMRP || 0;
      insertMaterialConstDetailObj['landedRateTotalAmount'] = element.LandedTotalAmt || 0;
      insertMaterialConstDetailObj['purchaseRateTotalAmount'] = element.PurTotalAmt || 0;
      insertMaterialConstDetailObj['mrpTotalAmount'] = element.MRPTotalAmt || 0;
      insertMaterialConstDetailObj['startDate'] = element.StartDate || 0;
      insertMaterialConstDetailObj['endDate'] = element.EndDate || 0;
      insertMaterialConstDetailObj['remark'] =element.Remark || 0;
      insertMaterialConsDetail.push(insertMaterialConstDetailObj);
    })

    let updateCurrentStock =[];
    this.dsNewmaterialList.data.forEach((element) =>{
      let updateCurrentStockObj = {};
      updateCurrentStockObj['itemId'] =element.ItemId;
      updateCurrentStockObj['issueQty'] =  element.UsedQty;
      updateCurrentStockObj['storeID'] =this._loggedService.currentUserValue.user.storeId;
      updateCurrentStockObj['stkId'] = element.StockId ;
      updateCurrentStock.push(updateCurrentStockObj);
    })

    let submitdata={
      'insertMaterialConsumption':materialConsumptionObj,
      'insertMaterialConsDetail':insertMaterialConsDetail,
      'updateCurrentStock':updateCurrentStock
    }
    console.log(submitdata)
    this._MaterialConsumptionService.MaterialconsSave(submitdata).subscribe(response => {
      if (response) {
        this.toastr.success('Record New Material Consumption Saved Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.OnReset();
        this.Savebtn=true;
        this.onClose();
        this.viewgetMaterialconsumptionReportPdf(response);
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

  
  viewgetMaterialconsumptionReportPdf(MaterialConsumptionId) {
    
    setTimeout(() => {
    this.SpinLoading =true;
   
  this._MaterialConsumptionService.getMaterialconsumptionview(MaterialConsumptionId).subscribe(res => {
     
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "95vw",
          height: '850px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Material Consumption Report Viewer"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.sIsLoading = '';
        });
    });
    },1000);
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
    } 
  }
  onClose() {
    this._matDialog.closeAll();
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
  OnReset(){
   this.ItemReset();
  //  this._MaterialConsumptionService.userFormGroup.reset();
   this.dsNewmaterialList.data = []; 
   this.chargeslist.data = [];
   this.dsTempItemNameList.data =[];
  }
}
export class ItemList {
  ItemName: string;
  BatchNo: any;
  BatchExpDate: number;
  BalQty: number;
  UsedQty: number;
  Rate: number;
  TotalAmount: number;
  Remark: number;
  StockId: any;
  ItemId:any;
  MRPTotalAmt:any;
  StartDate:any;
  EndDate:any;
  LandedTotalAmt:any;
  PurTotalAmt:any;
  UnitMRP:any;
  LandedRate:any;
  PurchaseRate:any;

  constructor(ItemList) {
    {
      this.ItemName = ItemList.ItemName || '';
      this.BatchNo = ItemList.BatchNo || '';
      this.BatchExpDate = ItemList.BatchExpDate || 0;
      this.BalQty = ItemList.BalQty || 0;
      this.UsedQty = ItemList.UsedQty || 0;
      this.Rate = ItemList.Rate || 0;
      this.MRPTotalAmt = ItemList.MRPTotalAmt || 0;
      this.Remark = ItemList.Remark || '';
      this.StockId = ItemList.StockId || 0;
      this.ItemId = ItemList.itemId || 0;
      this.LandedTotalAmt = ItemList.LandedTotalAmt || 0;
      this.PurTotalAmt = ItemList.PurTotalAmt || 0;
      this.UnitMRP = ItemList.UnitMRP || 0;
      this.LandedRate = ItemList.LandedRate || 0;
      this.PurchaseRate = ItemList.PurchaseRate || 0;
    }
  }
}

