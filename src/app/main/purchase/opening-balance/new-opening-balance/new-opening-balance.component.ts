import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { OpeningBalanceService } from '../opening-balance.service';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-opening-balance',
  templateUrl: './new-opening-balance.component.html',
  styleUrls: ['./new-opening-balance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewOpeningBalanceComponent implements OnInit {
  displayedColumns = [ 
    'ItemName',
    'BatchNo',
    'ExpDate', 
    'BalQty', 
    "PerRate",
    'UnitMRP', 
    'GST', 
    'buttons',
  ];

  StoreList:any=[];
  dateTimeObj: any;
  screenFromString:'addmission-form';
  vBalQty:any;
  vGST:any;
  vRatePerUnit:any;
  vMRP:any;
  vBatchNo:any;
  vExpDate:any;
  sIsLoading:string='';
  chargeslist:any=[];


  dsItemNameList = new MatTableDataSource<dsItemNameList>();
  dsTempItemNameList = new MatTableDataSource<dsItemNameList>();
  
  constructor(
    public _OpeningBalanceService:OpeningBalanceService,
    public _matDialog: MatDialog, 
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewOpeningBalanceComponent>, 
    private _loggedService: AuthenticationService, 
    public toastr: ToastrService,
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
    console.log(vdata);
    this._OpeningBalanceService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      // console.log(this.StoreList);
      this._OpeningBalanceService.StoreForm.get('StoreId').setValue(this.StoreList[0]); 
    });
  }
  isItemIdSelected:boolean=false;
  filteredOptions:any;
  noOptionFound:any;
  getItemList() {
    var m_data = {
      "ItemName": `${this._OpeningBalanceService.NewUseForm.get('ItemName').value}%`,
      "StoreId": this._OpeningBalanceService.StoreForm.get('StoreId').value.storeid
    }
    this._OpeningBalanceService.getItemNameList(m_data).subscribe(data => {
      this.filteredOptions = data;
      if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
  getSelectedObj(obj) {
     console.log(obj)
  }
  getOptionText(option) {
    if (!option)
      return '';
    return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';
  }
  Onadd(){
    if ((this.vBatchNo == '' || this.vBatchNo == null || this.vBatchNo == undefined)) {
      this.toastr.warning('Please enter a Batch No', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
   
    if ((this.vBalQty == '' || this.vBalQty == null || this.vBalQty == undefined)) {
      this.toastr.warning('Please enter a BalQty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vMRP == '' || this.vMRP == null || this.vMRP == undefined)) {
      this.toastr.warning('Please enter a MRP', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vRatePerUnit == '' || this.vRatePerUnit == null || this.vRatePerUnit == undefined)) {
      this.toastr.warning('Please enter a RatePerUnit', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    const isDuplicate = this.dsItemNameList.data.some(item => item.BatchNo === this.vBatchNo);

    if (!isDuplicate) {
      this.dsItemNameList.data = [];
      this.chargeslist = this.dsTempItemNameList.data;
      this.chargeslist.push(
        {
          ItemId: this._OpeningBalanceService.NewUseForm.get('ItemName').value.ItemID || 0,
          ItemName: this._OpeningBalanceService.NewUseForm.get('ItemName').value.ItemName || '',
          BatchNo: this.vBatchNo,
          ExpDate: this.vExpDate, 
          BalQty: this.vBalQty|| 0,
          PerRate: this.vRatePerUnit || 0,
          UnitMRP: this.vMRP || 0,
          GST: this.vGST || 0 
        });
      this.dsItemNameList.data = this.chargeslist
      this.ItemFromReset();
    }
    else {
      this.toastr.warning('Selected Item already added in the list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
  }
}
ItemFromReset(){
  this._OpeningBalanceService.NewUseForm.get('ItemName').setValue('');
  this.vBatchNo = '';
  this.vExpDate = '';
  this.vBalQty = 0;
  this.vRatePerUnit = 0;
  this.vMRP = 0;
  this.vGST = 0; 
}
deleteTableRow(element) { 
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dsItemNameList.data = [];
      this.dsItemNameList.data = this.chargeslist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    }); 
}
  OnSave(){

  }
  OnReset(){

  }
  onClose(){
    this._matDialog.closeAll();
  }
  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('BatchNo') BatchNo: ElementRef;
  @ViewChild('ExpDate') ExpDate: ElementRef;
  @ViewChild('BalanceQty') BalanceQty: ElementRef;
  @ViewChild('GST') GST: ElementRef;
  @ViewChild('MRP') MRP: ElementRef;
  @ViewChild('RatePerUnit') RatePerUnit: ElementRef; 

  public onEnteritemid(event): void {
    if (event.which === 13) {
      this.BatchNo.nativeElement.focus()
    }
  }

  public onEnterBatchno(event): void {
    if (event.which === 13) {
      this.ExpDate.nativeElement.focus()
    }
  }
  public onEnterExpDate(event): void {
    if (event.which === 13) {
      this.BalanceQty.nativeElement.focus()
    }
  }
  public onEnterbalQty(event): void {
    if (event.which === 13) {
      this.GST.nativeElement.focus()
    }
  }
  public onEntergst(event): void {
    if (event.which === 13) {
      this.MRP.nativeElement.focus()
    }
  }
  public onEntermrp(event): void {
    if (event.which === 13) {
      this.RatePerUnit.nativeElement.focus()
    }
  }
  public onEnterRatePerUnit(event): void {
    if (event.which === 13) {
      //this.RatePerUnit.nativeElement.focus()
    }
  }
}
export class dsItemNameList {
  ItemID: any;
  ItemName: string;
  BatchNo: number;
  ExpDate: number;
  BalQty: number;
  PerRate: number;
  UnitMRP: number;
  GST: number;  

  constructor(dsItemNameList) {
    {
 
      this.ItemName = dsItemNameList.ItemName || "";
      this.BatchNo = dsItemNameList.BatchNo || 0;
      this.ExpDate = dsItemNameList.ExpDate || 0;
      this.BalQty = dsItemNameList.BalQty || 0;
      this.PerRate = dsItemNameList.PerRate || 0;
      this.UnitMRP = dsItemNameList.UnitMRP || 0; 
      this.GST = dsItemNameList.GST || 0;
    }
  }
}