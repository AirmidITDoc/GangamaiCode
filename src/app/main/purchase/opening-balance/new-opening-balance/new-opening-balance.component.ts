import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { OpeningBalanceService } from '../opening-balance.service';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { element } from 'protractor';
import { FormGroup } from '@angular/forms';
import { GRNItemResponseType } from '../../good-receiptnote/new-grn/types';

@Component({
  selector: 'app-new-opening-balance',
  templateUrl: './new-opening-balance.component.html',
  styleUrls: ['./new-opening-balance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewOpeningBalanceComponent implements OnInit {
  StoreForm:FormGroup;
  OPeningtemForm:FormGroup;
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

  autocompletestore: string = "Store";
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
StoreId=0
vRemark:any;
Savebtn:boolean=false;
vItemName:any;
vItemId:any; 
vExpDate1:any='';

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
    this.StoreForm=this._OpeningBalanceService.CreateStorForm();
    this.OPeningtemForm=this._OpeningBalanceService.createNewItemForm();

  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
   getSelectedItem(item: GRNItemResponseType): void {
      console.log(item)
      // if (this.mock) {
      //     return;
      // }
      this.OPeningtemForm.patchValue({
        UOMId: item.umoId,
        ConversionFactor: isNaN(+item.converFactor) ? 1 : +item.converFactor,
        Qty: item.balanceQty,
        CGSTPer: item.cgstPer,
        SGSTPer: item.sgstPer,
        IGSTPer: item.igstPer,
        GST: item.cgstPer + item.sgstPer + item.igstPer,
        HSNcode: item.hsNcode
  
      });
      // this.calculateTotalamt();
    }

    StoreSelction(event){
      this.StoreId=event.value
    }
  vlastDay: string = '';
  lastDay2: string = '';
  calculateLastDay(inputDate: string) {
    // 
    if (inputDate && inputDate.length === 6) {
      const month = +inputDate.substring(0, 2);
      const year = +inputDate.substring(2, 6);

      if (month >= 1 && month <= 12) {
        const lastDay = this.getLastDayOfMonth(month, year);
        this.vlastDay = `${lastDay}/${this.pad(month)}/${year}`;
        this.lastDay2 = `${year}/${this.pad(month)}/${lastDay}`;
        // console.log(this.vlastDay)

        this._OpeningBalanceService.NewUseForm.get('ExpDate').setValue(this.vlastDay)
        // this.BalanceQty.nativeElement.focus() 
      } else {
        this.vlastDay = 'Invalid month';
      }
    } else {
      this.vlastDay = '';
    }

  }

  getLastDayOfMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }
  pad(n: number): string {
    return n < 10 ? '0' + n : n.toString();
  }
  CheckValidation(){
    
  }
 
  Onadd(){
    // if ((this.vBatchNo == '' || this.vBatchNo == null || this.vBatchNo == undefined)) {
    //   this.toastr.warning('Please enter a Batch No', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    // if ((this.vlastDay == '' || this.vlastDay == null || this.vlastDay == undefined)) {
    //   this.toastr.warning('Please enter a Expairy Date', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    // if ((this.vBalQty == '' || this.vBalQty == null || this.vBalQty == undefined)) {
    //   this.toastr.warning('Please enter a BalQty', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    // if ((this.vMRP == '' || this.vMRP == null || this.vMRP == undefined)) {
    //   this.toastr.warning('Please enter a MRP', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    // if ((this.vRatePerUnit == '' || this.vRatePerUnit == null || this.vRatePerUnit == undefined)) {
    //   this.toastr.warning('Please enter a RatePerUnit', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // } 
    const isDuplicate = this.dsItemNameList.data.some(item => item.BatchNo === this.vBatchNo);

    if (!isDuplicate) {
      this.dsItemNameList.data = [];
      this.chargeslist = this.dsTempItemNameList.data;
      this.chargeslist.push(
        {
          ItemID: this.OPeningtemForm.get('ItemName').value || 0,
          ItemName: this.OPeningtemForm.get('ItemName').value.formattedText || '',
          BatchNo: this.vBatchNo,
          ExpDate: this.vlastDay, 
          BalQty: this.vBalQty|| 0,
          PerRate: this.vRatePerUnit || 0,
          UnitMRP: this.vMRP || 0,
          GST: this.vGST || 0 
        });
      this.dsItemNameList.data = this.chargeslist
      this.ItemFromReset();
      console.log(this.chargeslist)
      // this.itemid.nativeElement.focus(); 
    }
    else {
      this.toastr.warning('Selected Item already added in the list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
  }
}
ItemFromReset(){
  this.OPeningtemForm.get('ItemName').setValue('');
  this.vBatchNo = '';
  this.vlastDay = '';
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

  OnSave() {
    
    if ((!this.dsItemNameList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.Savebtn = true;

    let insert_OpeningTransaction_Header_1 = {};
    insert_OpeningTransaction_Header_1['openingDate'] = this.dateTimeObj.date;
    insert_OpeningTransaction_Header_1['openingTime'] = this.dateTimeObj.time;
    insert_OpeningTransaction_Header_1['storeId'] = this._loggedService.currentUserValue.storeId;
    insert_OpeningTransaction_Header_1['addedby'] = this._loggedService.currentUserValue.userId,
      insert_OpeningTransaction_Header_1['openingHId'] = 0;


    let openingBalanceParamInsertdetail = [];
    this.dsItemNameList.data.forEach((element) => {
      
      let openingBalanceParamInsertObj = {};
      openingBalanceParamInsertObj['storeId'] = this._loggedService.currentUserValue.storeId;
      openingBalanceParamInsertObj['openingDate'] = this.dateTimeObj.date;
      openingBalanceParamInsertObj['openingTime'] = this.dateTimeObj.time;
      openingBalanceParamInsertObj['openingDocNo'] = 0;
      openingBalanceParamInsertObj['itemId'] = this.vItemId || 0,
      openingBalanceParamInsertObj['batchNo'] = this.vBatchNo || ''
      openingBalanceParamInsertObj['batchExpDate'] = this.vExpDate1 || '01/01/1900',
      openingBalanceParamInsertObj['perUnitPurRate'] = this.vRatePerUnit || 0
      openingBalanceParamInsertObj['perUnitMrp'] = this.vMRP || 0
      openingBalanceParamInsertObj['vatPer'] = this.vGST || 0
      openingBalanceParamInsertObj['balQty'] = this.vBalQty || 0
      openingBalanceParamInsertObj['addedby'] = this._loggedService.currentUserValue.userId,
      openingBalanceParamInsertObj['updatedby'] = 0;
      openingBalanceParamInsertObj['openingId'] = 0;
      openingBalanceParamInsertdetail.push(openingBalanceParamInsertObj);
    });

    let insert_Update_OpeningTran_ItemStock_1 = {};
    insert_Update_OpeningTran_ItemStock_1['openingHId'] = 0;


    let submitData = {
      "insert_OpeningTransaction_Header_1": insert_OpeningTransaction_Header_1,
      "openingTransactionInsert": openingBalanceParamInsertdetail,
      "insert_Update_OpeningTran_ItemStock_1": insert_Update_OpeningTran_ItemStock_1
    };
    console.log(submitData);
    this._OpeningBalanceService.InsertOpeningBalSave(submitData).subscribe(response => {
      this.toastr.success(response);
      if (response) {
        // this.viewgetPurchaseorderReportPdf(response)
        this._matDialog.closeAll();
      }
    });
  }

  OnReset() {
    this.OPeningtemForm.reset();
    this.dsItemNameList.data = [];
    this.dsTempItemNameList.data = [];
    this.chargeslist = [];
  }
  onClose(){
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
  keyPressCharater(event){
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
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