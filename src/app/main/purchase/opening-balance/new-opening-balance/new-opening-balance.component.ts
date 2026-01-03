import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { GRNFormModel, GRNItemResponseType, ToastType } from '../../good-receiptnote/new-grn/types';
import { OpeningBalanceService } from '../opening-balance.service';

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
  ItemId: any;

  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  displayedColumns = [
    'ItemName',
    'BatchNo',
    'ExpDate',
    'pack',
    'qty',
    'totalQty',
    'CGST',
    'SGST',
    'IGST',
    'GST',
    "PerRate",
    'UnitMRP',
    'LandedRate',
    'buttons',
  ];

  autocompletestore: string = "Store";
  autocompleteModeGSTTypesValues: string = "GSTTypes";
  dateTimeObj: any;
  screenFromString: 'addmission-form';
  vstrQty: any;
  vGST: any;
  vRatePerUnit: any;
  vLandedRate: any;
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

    this.openingBalArray.push(this.createOpeningBalInsert());
  }

  CreateStorForm() {
    return this._formbuilder.group({
      storeId: [this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      openingBal: this._formbuilder.group({
        storeId: [
          this.accountService.currentUserValue.user.storeId,
          [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]
        ],
        openingDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
        openingTime: [this.datePipe.transform(new Date(), 'shortTime')],
        addedby: [this.accountService.currentUserValue.userId],
        openingHId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      }),
      openingTransaction: this._formbuilder.array([]),
    })
  }

  createOpeningBalInsert(element: any = {}): FormGroup {
    const openingDate = this.datePipe.transform(this.dateTimeObj?.date, "yyyy-MM-dd") || '1900-01-01';
    const openingTime = this.dateTimeObj?.time || '00:00';

    const openingDateTime = `${openingDate} ${openingTime}`;

    return this._formbuilder.group({
      storeId: [this.StoreId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      openingDate: openingDate,
      openingTime: openingDateTime,
      itemId: [element.ItemID || 0],
      batchNo: [element.BatchNo || ''],
      batchExpDate: [element.ExpDate ? this.datePipe.transform(new Date(element.ExpDate.split('/').reverse().join('-')), 'yyyy-MM-dd') : null],
      perUnitPurRate: [element.PerRate || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      perUnitMrp: [element.UnitMRP || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      perUnitLandedRate: [element.LandedRate || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      cgstPer: [element.CGST || 0],
      sgstPer: [element.SGST || 0],
      igstPer: [element.IGST || 0],
      gstper: [element.GST || 0],
      totalQty: [element.TotalQty],
      packing: [element.Pack],
      stripQty: [element.strQty],
      addedby: [this._loggedService.currentUserValue.userId],
      updatedby: [this._loggedService.currentUserValue.userId],
    });
  }

  get openingBalArray(): FormArray {
    return this.StoreForm.get('openingTransaction') as FormArray;
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  getSelectedItem(item: GRNItemResponseType): void {
    console.log(item)
    this.vItemId = item.itemId
    // if (this.mock) {
    //     return;
    // }
    this.OPeningtemForm.patchValue({
      UOMId: item.umoId,
      pack: isNaN(+item.converFactor) ? 1 : +item.converFactor,
      // stripQty: item.stripQty,
      CGST: item.cgstPer,
      // SGST: item.sgstPer,
      // IGST: item.igstPer,
      // GST: item.cgstPer + item.sgstPer + item.igstPer,
      HSNcode: item.hsNcode
    });
    // this.calculateTotalamt();
  }

  StoreSelction(event) {
    this.StoreId = event.value
  }
  vlastDay: string = '';
  lastDay2: string = '';
  calculateLastDay() {
    const inputDate = this.OPeningtemForm.get("ExpDate").value;
    const numericPattern = /^[0-9]+$/;
    const CurrentDate = new Date();
    const Currentmonths = new Date();
    const currentMonth = Currentmonths.getMonth();
    console.log(currentMonth)
    const currentYear = CurrentDate.getFullYear();
    console.log(currentYear)
    if ((inputDate && inputDate.length === 6) && numericPattern.test(inputDate)) {
      const month = +inputDate.substring(0, 2);
      const year = +inputDate.substring(2, 6);

      if (year >= currentYear) {
        if (month <= currentMonth && year == currentYear) {
          Swal.fire({
            icon: "warning",
            title: "This item is already expired",
            showConfirmButton: false,
            timer: 1500
          });
          this.vlastDay = '';
          this.OPeningtemForm.get('ExpDate').setValue(this.vlastDay)
          return
        }
        if (month > 12 && month <= 0) {
          this.vlastDay = '';
          this.OPeningtemForm.get('ExpDate').setValue(this.vlastDay)
          this.toastr.warning('Invalid month. Month should be between 01 and 12', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
        const lastDay = this.getLastDayOfMonth(month, year);
        this.vlastDay = `${lastDay}/${this.pad(month)}/${year}`;
        this.lastDay2 = `${year}/${this.pad(month)}/${lastDay}`;
        const newuserDate = this.datePipe.transform(this.lastDay2, 'dd/MM/YYYY')
        this.OPeningtemForm.get('ExpDate').setValue(this.vlastDay)
        const QtyElement = document.querySelector(`[name='stripQty']`) as HTMLElement;
        if (QtyElement) {
          QtyElement.focus();
        }

      } else {
        Swal.fire({
          icon: "warning",
          title: "This item is already expired",
          showConfirmButton: false,
          timer: 1500
        });
        this.vlastDay = '';
        this.OPeningtemForm.get('ExpDate').setValue(this.vlastDay)
        return

      }
    } else {
      this.vlastDay = '';
      this.OPeningtemForm.get('ExpDate').setValue(this.vlastDay)
      this.toastr.warning('Please enter only numbers in MMYYYY format', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    const ExpDateElement = document.querySelector(`[name='ExpDate']`) as HTMLElement;
    if (ExpDateElement) {
      ExpDateElement.focus();
    }
  }

  onExpDateInput(event: any) {
    const value = event.target.value;
    if (value && value.length === 6) {
      this.calculateLastDay();
    }
  }

  getLastDayOfMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }
  pad(n: number): string {
    return n < 10 ? '0' + n : n.toString();
  }


  getchangegstper(rate: any): void {
    debugger
    if (Number(rate?.value) > 0) {
      this.OPeningtemForm.patchValue({
        SGST: Number((rate.value) / 2),
        IGST: 0,
        GST: Number(rate.value)
      })
      this.OPeningtemForm.get('IGST').reset();
      this.OPeningtemForm.get('IGST').clearValidators();
      this.OPeningtemForm.get('IGST').updateValueAndValidity();
      this.OPeningtemForm.get('IGST').disable();
    } else {  
             this.OPeningtemForm.get('CGST').reset(0);
            this.OPeningtemForm.get('SGST').reset(0);
            this.OPeningtemForm.get('IGST').enable();
            this.OPeningtemForm.get('IGST').reset();
    }
    // this.calculateTotalamt();
  }

  getchangeIgstper(rate: any): void {
    debugger
    if (Number(rate?.text) > 0) {
      this.OPeningtemForm.patchValue({
        SGST: 0,
        CGST: 0,
        GST: Number(rate.text),
      })
      this.OPeningtemForm.get('CGST').reset();
      this.OPeningtemForm.get('CGST').clearValidators();
      this.OPeningtemForm.get('CGST').updateValueAndValidity();
      this.OPeningtemForm.get('CGST').disable();
    } else {
      this.OPeningtemForm.get('IGST').reset(0);
      this.OPeningtemForm.get('CGST').enable();
      this.OPeningtemForm.get('CGST').reset();
    }
    //  this.calculateTotalamt();
  }

  calculateTotalQty() {
    const pack = this.OPeningtemForm.get('pack')?.value || 0;
    const qty = this.OPeningtemForm.get('stripQty')?.value || 0;

    // Total = packs * strips per pack
    const totalQty = qty * pack;

    this.OPeningtemForm.patchValue({
      totalQty: totalQty
    });
       this.CalculatePerUnit();
  }

  isBatchSelected: boolean = false;
  onBatchChange(event) {
    console.log(event)
    const expDate = this.datePipe.transform(event.batchExpDate, 'MMYYYY')
    this.OPeningtemForm.patchValue({
      ExpDate: expDate,
      MRP: event?.unitMRP || 0,
      RatePerUnit: event?.unitPurRate || 0,
      LandedRate: event?.unitLandedRate || 0
    })
    const QtyElement = document.querySelector(`[name='Qty']`) as HTMLElement;
    if (QtyElement) {
      QtyElement.focus();
    }

    if ((event?.cgstPer ?? 0) > 0) {
      this.OPeningtemForm.patchValue({
        CGST: event?.gst,
        SGST: event?.sgstPer,
        IGST: 0,
        GST: event?.gst
      });

      this.OPeningtemForm.get('CGST').enable();
      this.OPeningtemForm.get('IGST').reset();
      this.OPeningtemForm.get('IGST').clearValidators();
      this.OPeningtemForm.get('IGST').updateValueAndValidity();
      this.OPeningtemForm.get('IGST').disable();

    } else if ((event?.igstPer ?? 0) > 0) {
      this.OPeningtemForm.patchValue({
        CGST: 0,
        SGST: 0,
        IGST: event?.igstPer,
        GST: event?.gst
      });

      this.OPeningtemForm.get('IGST').enable();
      this.OPeningtemForm.get('CGST').reset();
      this.OPeningtemForm.get('CGST').clearValidators();
      this.OPeningtemForm.get('CGST').updateValueAndValidity();
      this.OPeningtemForm.get('CGST').disable();

    } else {
      // ✅ Both missing → don’t disable any, keep them editable
      this.OPeningtemForm.patchValue({
        CGST: 0,
        SGST: 0,
        IGST: 0,
        GST: 0
      });

      this.OPeningtemForm.get('CGST').enable();
      this.OPeningtemForm.get('IGST').enable();
    }
    const hasBatchNo = !!event?.batchNo;
    this.isBatchSelected = hasBatchNo;
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
          BatchNo: this.OPeningtemForm.get('BatchNo').value.batchNo || this.OPeningtemForm.get('BatchNo').value || "",
          ExpDate: this.vlastDay, //this.OPeningtemForm.get('ExpDate').value || "",
          Pack: this.OPeningtemForm.get('pack').value || 0,
          TotalQty: this.OPeningtemForm.get('totalQty').value || 0,
          strQty: this.OPeningtemForm.get('stripQty').value || 0,
          PerRate: this.OPeningtemForm.get('RatePerUnit').value || 0,
          UnitMRP: this.OPeningtemForm.get('MRP').value || 0,
          LandedRate: this.OPeningtemForm.get('LandedRate').value || 0,
          CGST: this.OPeningtemForm.get('SGST').value || 0, //div data pass here from dd
          SGST: this.OPeningtemForm.get('SGST').value || 0,
          IGST: this.OPeningtemForm.get('IGST').value || 0,
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
      pack: "",
      totalQty: "",
      stripQty: "",
      CGST: "",
      SGST: "",
      IGST: "",
      GST: "",
      MRP: "",
      RatePerUnit: "",
      LandedRate: ""
    });
    this.isBatchSelected = false;
    form.get('CGST')?.enable();
    form.get('SGST')?.enable();
    form.get('IGST')?.enable();
    form.get('MRP')?.enable();
    form.get('LandedRate')?.enable();
    form.get('RatePerUnit')?.enable();
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
    if (!this.StoreForm.invalid) {
      if (!(this.StoreForm.get("storeId").value > 0)) {
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
      this.openingBalArray.clear();
      this.dsItemNameList.data.forEach(item => {
        this.openingBalArray.push(this.createOpeningBalInsert(item));
      });
      this.StoreForm.removeControl('storeId')
      console.log(this.StoreForm.value)
      this._OpeningBalanceService.InsertOpeningBalSave(this.StoreForm.value).subscribe(response => {
        this.viewgetReportPdf(response)
        this._matDialog.closeAll();
      });
    } else {
      let invalidFields = [];

      if (this.StoreForm.invalid) {
        for (const controlName in this.StoreForm.controls) {
          if (this.StoreForm.controls[controlName].invalid) {
            invalidFields.push(`Form: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }
    }

  }

  viewgetReportPdf(element) {
    var Param = {
      "searchFields": [
        {
          "fieldName": "OpeningHId",
          "fieldValue": String(element),
          "opType": "Equals"
        }
      ],
      "mode": "OpeningBalance"
    }
    this._OpeningBalanceService.getReportView(Param).subscribe(res => {

      const matDialog = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "OpeningBalance" + " " + "Viewer"
          }
        });
      matDialog.afterClosed().subscribe(result => {
      });
    });
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

  onRatePerUnitInput(event: any) {
    this.validateFormValues()
  }

  onMRPInput(event: any) {
    this.validateFormValues()
  }

  onLandedRateInput(event: any) { 
    this.validateFormValues()
      this.CalculatePerUnit();
  }
CalculatePerUnit(){
 const formvalues= this.OPeningtemForm.value
    if((formvalues?.MRP || 0)> 0){
    const perunit = (formvalues?.MRP || 0) / (formvalues?.pack || 0).toFixed(2)
    this.OPeningtemForm.patchValue({
      RatePerUnit : perunit || 0
    })
    } 
}
  validateFormValues() {
    const form = this.OPeningtemForm;
    const values = form.getRawValue() as GRNFormModel;
    if (+values.MRP < 0) {
      this._OpeningBalanceService.showToast('MRP should be greater than 0', ToastType.WARNING);
      form.patchValue({
        MRP: 0,
      });
    }
    if (+values.RatePerUnit < 0) {
      this._OpeningBalanceService.showToast('RatePerUnit should be greater than 0', ToastType.WARNING);
      form.patchValue({
        RatePerUnit: 0,
      });
    }
    if (+values.LandedRate < 0) {
      this._OpeningBalanceService.showToast('LandedRate should be greater than 0', ToastType.WARNING);
      form.patchValue({
        LandedRate: 0,
      });
    }
    if (+values.RatePerUnit > +values.MRP) {
      this._OpeningBalanceService.showToast('RatePerUnit should be less than MRP', ToastType.WARNING);
      form.patchValue({
        RatePerUnit: 0,
      });
    }
    if (+values.RatePerUnit >= +values.LandedRate) {
      this._OpeningBalanceService.showToast('RatePerUnit should be less than LandedRate', ToastType.WARNING);
      form.patchValue({
        RatePerUnit: 0,
      });
    }
    if (+values.LandedRate > +values.MRP ) {
      this._OpeningBalanceService.showToast('LandedRate should be less than MRP', ToastType.WARNING);
      form.patchValue({
        LandedRate: 0,
      });
    }
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
         // it allowed only Digit & decimal
       keyPressDigitDecimalOnly(event) {
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
  strQty: number;
  PerRate: number;
  UnitMRP: number;
  GST: number;

  constructor(dsItemNameList) {
    {

      this.ItemName = dsItemNameList.ItemName || "";
      this.BatchNo = dsItemNameList.BatchNo || 0;
      this.ExpDate = dsItemNameList.ExpDate || 0;
      this.strQty = dsItemNameList.strQty || 0;
      this.PerRate = dsItemNameList.PerRate || 0;
      this.UnitMRP = dsItemNameList.UnitMRP || 0;
      this.GST = dsItemNameList.GST || 0;
    }
  }
}