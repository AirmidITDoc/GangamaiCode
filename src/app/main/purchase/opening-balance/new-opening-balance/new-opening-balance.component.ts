import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { OpeningBalanceService } from '../opening-balance.service';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { element } from 'protractor';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { GRNItemResponseType } from '../../good-receiptnote/new-grn/types';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import Swal from 'sweetalert2';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-new-opening-balance',
  templateUrl: './new-opening-balance.component.html',
  styleUrls: ['./new-opening-balance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewOpeningBalanceComponent implements OnInit {
  StoreForm: FormGroup;
  OPeningtemForm: FormGroup;
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
  screenFromString: 'addmission-form';
  vBalQty: any;
  vGST: any;
  vRatePerUnit: any;
  vMRP: any;
  vBatchNo: any;
  vExpDate: any;
  sIsLoading: string = '';
  chargeslist: any = [];
  StoreId = this._loggedService.currentUserValue.user.storeId
  vRemark: any;
  Savebtn: boolean = false;
  vItemName: any;
  vItemId: any;
  vExpDate1: any = '';

  dsItemNameList = new MatTableDataSource<dsItemNameList>();
  dsTempItemNameList = new MatTableDataSource<dsItemNameList>();

  constructor(
    public _OpeningBalanceService: OpeningBalanceService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewOpeningBalanceComponent>,
    private _loggedService: AuthenticationService,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    public _formbuilder: UntypedFormBuilder, private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  ngOnInit(): void {
    this.StoreForm = this.CreateStorForm();
    this.OPeningtemForm = this._OpeningBalanceService.createNewItemForm();
    this.StoreForm.markAllAsTouched();
    this.OPeningtemForm.markAllAsTouched();

  }

  CreateStorForm() {
    return this._formbuilder.group({
      StoreId: [this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      openingDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      openingTime: this.datePipe.transform(new Date(), 'shortTime'),
      // storeId
      addedby: this.accountService.currentUserValue.userId,
      openingHId: 0,
      // openingTransaction: '',
      // openingTranItemStock: '',
      // openingBal: ''
    })
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

  StoreSelction(event) {
    this.StoreId = event.value
  }
  vlastDay: string = '';
  lastDay2: string = '';
  calculateLastDay(inputDate: string) {
    // 
    // if (inputDate && inputDate.length === 6) {
    //   const month = +inputDate.substring(0, 2);
    //   const year = +inputDate.substring(2, 6);

    //   if (month >= 1 && month <= 12) {
    //     const lastDay = this.getLastDayOfMonth(month, year);
    //     this.vlastDay = `${lastDay}/${this.pad(month)}/${year}`;
    //     this.lastDay2 = `${year}/${this.pad(month)}/${lastDay}`;
    //     // console.log(this.vlastDay)

    //     this._OpeningBalanceService.NewUseForm.get('ExpDate').setValue(this.vlastDay)
    //     // this.BalanceQty.nativeElement.focus() 
    //   } else {
    //     this.vlastDay = 'Invalid month';
    //   }
    // } else {
    //   this.vlastDay = '';
    // }


    const CurrentDate = new Date();
    const Currentmonths = new Date();
    const currentMonth = Currentmonths.getMonth();
    const currentYear = CurrentDate.getFullYear();

    if (inputDate && inputDate.length === 6) {
      const month = +inputDate.substring(0, 2);
      const year = +inputDate.substring(2, 6);
      if (year <= currentYear) {
        if (month <= currentMonth) {
          Swal.fire({
            icon: "warning",
            title: "This item is already expired",
            showConfirmButton: false,
            timer: 1500
          });
          // contact.ExpDate = '';  
        } else {
          if (month >= 1 && month <= 12) {
            const lastDay = this.getLastDayOfMonth(month, year);
            this.vlastDay = `${lastDay}/${this.pad(month)}/${year}`;
            this.lastDay2 = `${year}/${this.pad(month)}/${lastDay}`;
            const newuserDate = this.datePipe.transform(this.lastDay2, 'dd/MM/YYYY')
            // contact.ExpDate = this.vlastDay; 
          } else {
            this.vlastDay = '';
          }
        }
      } else {
        if (month >= 1 && month <= 12) {
          const lastDay = this.getLastDayOfMonth(month, year);
          this.vlastDay = `${lastDay}/${this.pad(month)}/${year}`;
          this.lastDay2 = `${year}/${this.pad(month)}/${lastDay}`;
          // contact.ExpDate = this.vlastDay; 
        } else {
          this.vlastDay = '';
        }
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
  CheckValidation() {

  }

  Onadd() {

    const isDuplicate = this.dsItemNameList.data.some(item => item.BatchNo === this.vBatchNo);

    if (!isDuplicate) {
      this.dsItemNameList.data = [];
      this.chargeslist = this.dsTempItemNameList.data;
      this.chargeslist.push(
        {
          ItemID: this.OPeningtemForm.get('ItemName').value.itemId || 0,
          ItemName: this.OPeningtemForm.get('ItemName').value.formattedText || '',
          BatchNo: this.OPeningtemForm.get('BatchNo').value || "",
          ExpDate: this.vlastDay, //this.OPeningtemForm.get('ExpDate').value || "",
          BalQty: this.OPeningtemForm.get('BalanceQty').value || 0,
          PerRate: this.OPeningtemForm.get('RatePerUnit').value || 0,
          UnitMRP: this.OPeningtemForm.get('MRP').value || 0,
          GST: this.OPeningtemForm.get('GST').value || 0,
        });
      this.dsItemNameList.data = this.chargeslist
      this.ItemFromReset();
      console.log(this.chargeslist)
      const itemNameElement = document.querySelector(`[name='ItemName']`) as HTMLElement;
      if (itemNameElement) {
        itemNameElement.focus();
      }
    }
    else {
      this.toastr.warning('Selected Item already added in the list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
  }
  ItemFromReset() {
    const form = this.OPeningtemForm;

    form.patchValue({
      ItemName: "",
      BatchNo: "",
      ExpDate: "",
      BalanceQty: 0,
      GST: "",
      MRP: "",
      RatePerUnit: ""
    });

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

    if (!(this.StoreForm.get("StoreId").value > 0 || this.StoreForm.get("StoreId").value > 0)) {
      Swal.fire('Please enter To Store');
      return;
    }


    if ((!this.dsItemNameList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.Savebtn = true;


    // let insert_OpeningTransaction_Header_1 = {};
    // insert_OpeningTransaction_Header_1['openingDate'] = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd") || '1900-01-01',
    // insert_OpeningTransaction_Header_1['openingTime'] = this.dateTimeObj.time;
    // insert_OpeningTransaction_Header_1['storeId'] =  this.StoreId;
    // insert_OpeningTransaction_Header_1['addedby'] = this._loggedService.currentUserValue.userId,
    //   insert_OpeningTransaction_Header_1['openingHId'] = 0;


    let openingBalanceParamInsertdetail = [];
    this.dsItemNameList.data.forEach((element) => {
      if (element.ExpDate && element.ExpDate.length === 10) {
        const day = +element.ExpDate.substring(0, 2);
        const month = +element.ExpDate.substring(3, 5);
        const year = +element.ExpDate.substring(6, 10);

        this.vExpDate = `${year}/${this.pad(month)}/${day}`;
      }
      let openingBalanceParamInsertObj = {};
      openingBalanceParamInsertObj['storeId'] = this.StoreId;
      openingBalanceParamInsertObj['openingDate'] = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd") || '1900-01-01',
        openingBalanceParamInsertObj['openingTime'] = this.dateTimeObj.time;
      openingBalanceParamInsertObj['openingDocNo'] = 20;
      openingBalanceParamInsertObj['itemId'] = element.ItemID || 0,
        openingBalanceParamInsertObj['batchNo'] = element.BatchNo || ''
      openingBalanceParamInsertObj['batchExpDate'] = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd") || '1900-01-01',//this.vExpDate,// this.datePipe.transform(element.ExpDate, "yyyy-MM-dd") || '1900-01-01',
        openingBalanceParamInsertObj['perUnitPurRate'] = element.PerRate || 0
      openingBalanceParamInsertObj['perUnitMrp'] = element.UnitMRP || 0
      openingBalanceParamInsertObj['vatPer'] = element.GST || 0
      openingBalanceParamInsertObj['balQty'] = element.BalQty || 0
      openingBalanceParamInsertObj['addedby'] = this._loggedService.currentUserValue.userId,
        openingBalanceParamInsertObj['updatedby'] = this._loggedService.currentUserValue.userId,
        openingBalanceParamInsertObj['openingId'] = 0;
      openingBalanceParamInsertdetail.push(openingBalanceParamInsertObj);
    });

    let insert_Update_OpeningTran_ItemStock_1 = {};
    insert_Update_OpeningTran_ItemStock_1['openingHId'] = 0;


    console.log(this.StoreForm.value)

    // this.StoreForm.get("openingBal").setValue(this.StoreForm.value)
    // this.StoreForm.get("openingTransaction").setValue(openingBalanceParamInsertdetail)
    // this.StoreForm.get("openingTranItemStock").setValue(insert_Update_OpeningTran_ItemStock_1)

    let submitData = {
      "openingBal": this.StoreForm.value,
      "openingTransaction": openingBalanceParamInsertdetail,
      "openingTranItemStock": insert_Update_OpeningTran_ItemStock_1
    };
    console.log(submitData);
    this._OpeningBalanceService.InsertOpeningBalSave(submitData).subscribe(response => {
      this.toastr.success(response);
      // if (response) {
      //   this.viewgetReportPdf(response)
         this._matDialog.closeAll();
      // }
    });
  }

  viewgetReportPdf(element) {
    this.commonService.Onprint("OpeningHId", element.openingHId, "OpeningBalance");
  }


  OnReset() {
    this.OPeningtemForm.reset();
    this.dsItemNameList.data = [];
    this.dsTempItemNameList.data = [];
    this.chargeslist = [];
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
  keyPressCharater(event) {
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
  ExpDate: any;
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