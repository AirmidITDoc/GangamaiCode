import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { MaterialConsumptionService } from '../material-consumption.service';
import { MatTableDataSource } from '@angular/material/table';

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
    'BatchExpDate',
    'IssueQty',
    'PerUnitLandedRate',
    'VatPercentage',
    'LandedTotalAmount',
    'StkId'
  ];
  dateTimeObj:any;
  StoreList:any=[];
  filteredOptions: any;
  filteredOptionsItem:any;
  noOptionFound: boolean = false;
  isItemIdSelected:boolean=false;
  screenFromString:'addmision-form';
  dsNewmaterialList = new MatTableDataSource<ItemList>();
  constructor(
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewMaterialConsumptionComponent>,
    public _loggedService:AuthenticationService,
    public toastr: ToastrService,
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
    console.log(m_data)
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
    // this.ItemID = obj.ItemId;
    // this.ItemName = obj.ItemName;
    // this.vConversionFactor = obj.ConversionFactor;
    // this.vQty = 0
    // this.vUOM = obj.UnitofMeasurementId;
    // this.vHSNCode = obj.HSNcode;
    // this.vRate = obj.PurchaseRate;
    // this.vTotalAmount = (parseInt(this.vQty) * parseFloat(this.vRate)).toFixed(2);
    // this.vDisc = 0;
    // this.vDisc2 = 0;
    // this.vDisAmount = 0;
    // this.vDisAmount2 = 0;
    // this.vNetAmount = this.vTotalAmount;
    // this.VatPercentage = obj.VatPercentage;
    // this.vSGST = obj.SGSTPer || 0;
    // this.vCGST = obj.CGSTPer || 0;
    // this.vIGST = obj.IGSTPer || 0;
    // this.GSTPer = obj.GSTPer || 0;
    // this.vGSTAmount = 0;
    // this.vMRP = obj.UnitMRP;
    // this.Specification = obj.Specification;
    // this.batchno.nativeElement.focus();
    // this.getLastThreeItemInfo();
  }
  getOptionItemText(option) {
   // this.ItemId = option.ItemID;
    if (!option) return '';
    return option.ItemID + ' ' + option.ItemName ;
  }
  getSelectedObjItem(obj) {
   // console.log(obj);
 
  }
  OnAdd(){
    
  }
  onClose(){
    this._matDialog.closeAll();
  }
}
export class ItemList{

}
