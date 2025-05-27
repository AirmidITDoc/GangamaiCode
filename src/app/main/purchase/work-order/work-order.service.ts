import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ItemNameList } from '../good-receiptnote/good-receiptnote.component';
import { GSTCalculation, GSTCalculationResult, GSTType, PurchaseFormModel, ToastType } from '../purchase-order/update-purchaseorder/types';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
 
  GST_VALIDATION: any;
constructor(
    public _formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    public _httpClient: HttpClient, public _httpClient1: ApiCaller, private _FormvalidationserviceService: FormvalidationserviceService
  ) {
   
  }
  createStoreFrom() {
    return this._formBuilder.group({
      workId: 0,
      StoreId: [this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      SupplierName: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      GSTType: ['16',[Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    })
  }
  

  getWorOrderItemForm() {
    return this._formBuilder.group({
    workId: '',
      ItemName: ['', [Validators.required]],
      ItemID: '',
      Qty: [0, [Validators.required]],
      UnitRate: ['', [Validators.required]],
      TotalAmount: '',
      Disc: '',
      DiscAmount: '',
      GST: '',
      GSTAmount: '',
      VatAmt: '',
      NetAmount: '',
      Specification: '',

    });
  }

  getWorkOrderFinalForm() {
    return this._formBuilder.group({
     
      woId: 0,
      date: new Date(),
      time: new Date(),
      totalAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]],
      vatAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]],
      discAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]],
      GSTAmount:  [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]],
      netAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]],
      isclosed: true,
      Remark: "",
      addedBy:[this.accountService.currentUserValue.userId,this._FormvalidationserviceService.notEmptyOrZeroValidator()],
       updatedBy:[this.accountService.currentUserValue.userId,this._FormvalidationserviceService.notEmptyOrZeroValidator()],
      isCancelled: true,
      isCancelledBy: 0
      // workOrderDetails: ''
    });

  }
    initializeFormGroup() {
    // this.createNewWorkForm();
  }

  public getWorkOrderPrint(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=rptWorkOrderPrint", Param);
  }


  public getWorkorderreportview(WOID) {
    return this._httpClient.get("Pharmacy/view-Workorder?WOID=" + WOID);
  }

  public getItemListUpdates(Param) {
    return this._httpClient1.PostData("WorkOrder/WorkOrderDetailsList", Param);
  }

  public getWorkOrderList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_WorkOrderList_by_Name", Param);
  }

  public InsertWorkorderSave(Param) {
   return this._httpClient1.PostData("WorkOrder/WorkOrderSave", Param);
  }
 

  public WorkorderUpdate(Param) {
    return this._httpClient1.PutData("WorkOrder/WorkOrderUpdate", Param)
  }

  normalizeValues(obj: ItemNameList | PurchaseFormModel): GSTCalculationResult {
    debugger
    // Get all required values with proper type conversion
    const finalTotalQty = Number(obj.Qty || 0);
    const values = {
      totalAmount: Number(obj.TotalAmount || 0),
      discAmount: Number(obj.Disc || 0),
      cgst: Number(obj.CGSTPer || 0),
      sgst: Number(obj.SGSTPer || 0),
      igst: Number(obj.IGSTPer || 0),
      gst: Number(obj.GST || 0),

      finalTotalQty,
      conversionFactor: Number(obj.ConversionFactor || 1),
      mrp: Number(obj.MRP || 0),
      rate: Number(obj.Rate || 0)
    };
    return values;
  }


  public getGSTCalculation(type: GSTType, values: GSTCalculationResult): GSTCalculation {
    debugger
    let calculation: GSTCalculation;
    switch (type) {
      case GSTType.GST_AFTER_DISC: {
        calculation = this.calculateGSTAfterDisc(values);
        break;
      }
      case GSTType.GST_BEFORE_DISC: {
        calculation = this.calculateGSTBeforeDisc(values);
        break;
      }
      case GSTType.GST_ON_MRP_PLUS_FREE_QTY: {
        calculation = this.calculateGSTOnMRPPlusFreeQty(values);
        break;
      }
      case GSTType.GST_ON_PUR_PLUS_FREE_QTY: {
        calculation = this.calculateGSTOnPurPlusFreeQty(values);
        break;
      }
      default: {
        // Default fallback to GST Before Disc
        calculation = this.calculateGSTBeforeDisc(values);
      }
    }
    return calculation;
  }

  //  public calculateBasicValues(contact: ItemNameList): void {
  //    debugger
  //    contact.TotalQty = (Number(contact.Qty || 0)) * Number(contact.ConversionFactor || 1);
  //    this.calculateCellTotalAmount(contact);
  //    const discountAmount = ((Number(contact.TotalAmount || 0) * Number(contact.DiscPer || 0)) / 100).toFixed(4);
  //    contact.DiscAmount = discountAmount;

  //  }
  //  public calculateCellTotalAmount(contact: ItemNameList): void {
  //    contact.TotalAmount = (Number(contact.Qty || 0) * Number(contact.Rate || 0)).toFixed(4);
  //  }

  public calculateGSTAfterDisc(values: GSTCalculationResult): GSTCalculation {
    debugger
    const baseAmount = values.totalAmount - values.discAmount;

    const cgstAmount = (baseAmount * values.cgst) / 100;
    const sgstAmount = (baseAmount * values.sgst) / 100;
    const igstAmount = 0; // IGST is 0 for GST after discount

    const totalGSTAmount = cgstAmount + sgstAmount + igstAmount;
    const netAmount = baseAmount + totalGSTAmount;

    return {
      baseAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      totalGSTAmount,
      netAmount
    };
  }

  public calculateGSTBeforeDisc(values: GSTCalculationResult): GSTCalculation {
    debugger
    const baseAmount = values.totalAmount;

    const cgstAmount = (baseAmount * values.cgst) / 100;
    const sgstAmount = (baseAmount * values.sgst) / 100;
    const igstAmount = (baseAmount * values.igst) / 100;

    const totalGSTAmount = cgstAmount + sgstAmount + igstAmount;
    const netAmount = baseAmount - values.discAmount + totalGSTAmount;

    return {
      baseAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      totalGSTAmount,
      netAmount
    };
  }

  public calculateGSTOnMRPPlusFreeQty(values: GSTCalculationResult): GSTCalculation {
    const mrpTotal = values.finalTotalQty * values.conversionFactor * values.mrp;
    const totalGST = values.cgst + values.sgst + values.igst;
    const baseAmount = (mrpTotal * 100) / (100 + totalGST);

    const cgstAmount = (baseAmount * values.cgst) / 100;
    const sgstAmount = (baseAmount * values.sgst) / 100;
    const igstAmount = (baseAmount * values.igst) / 100;

    const totalGSTAmount = cgstAmount + sgstAmount + igstAmount;
    const netAmount = values.totalAmount - values.discAmount + totalGSTAmount;

    return {
      baseAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      totalGSTAmount,
      netAmount
    };
  }

  public calculateGSTOnPurPlusFreeQty(values: GSTCalculationResult): GSTCalculation {
    const baseAmount = values.finalTotalQty * values.rate;

    const cgstAmount = (baseAmount * values.cgst) / 100;
    const sgstAmount = (baseAmount * values.sgst) / 100;
    const igstAmount = (baseAmount * values.igst) / 100;

    const totalGSTAmount = cgstAmount + sgstAmount + igstAmount;
    const netAmount = values.totalAmount + totalGSTAmount - values.discAmount;

    return {
      baseAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      totalGSTAmount,
      netAmount
    };
  }


  validateCellData(item: ItemNameList): boolean {
    if (+item.Disc < 0 || +item.Disc > 100) {
      this.showToast('Discount percentage should be between 0 and 100', ToastType.WARNING);
      item.Disc = 0;
      return false;
    }

    if (+item.MRP < 0) {
      this.showToast('MRP should be greater than 0', ToastType.WARNING);
      item.MRP = 0;
      return false;
    }
    if (+item.Rate < 0) {
      this.showToast('Rate should be greater than 0', ToastType.WARNING);
      item.Rate = 0;
      return false;
    }
    if (+item.Rate > +item.MRP) {
      this.showToast('Rate should be less than MRP', ToastType.WARNING);
      item.Rate = 0;
      return false;
    }

    if (+item.Qty < 0) {
      this.showToast('Quantity should be greater than 0', ToastType.WARNING);
      item.Qty = 0;
      return false;
    }
    if (+item.ConversionFactor < 1) {
      this.showToast('Conversion Factor should be greater than 0', ToastType.WARNING);
      item.ConversionFactor = 1;
      return false;
    }

  }
  validateGSTRate(rate: number): boolean {
    return this.GST_VALIDATION.VALID_GST_RATES.includes(parseFloat(rate?.toString()));
  }
  validateGSTRates(item: ItemNameList): boolean {
    debugger
    item.GST = Number(item.CGST) + Number(item.SGST) + Number(item.IGST);
    const rates = [
      { value: item.CGSTPer, type: 'CGSTPer' },
      { value: item.SGSTPer, type: 'SGSTPer' },
      { value: item.IGSTPer, type: 'IGSTPer' }
    ];

    for (const rate of rates) {
      if (!rate.value) {
        item[`${rate.type}`] = 0;
      }
      if (rate.value > 0 && !this.validateGSTRate(rate.value)) {
        this.showToast(this.GST_VALIDATION.GST_ERROR_MESSAGE, ToastType.WARNING);
        item[`${rate.type}`] = 0;
        return false;
      }
    }
    return true;
  }
  showToast(GST_ERROR_MESSAGE: any, WARNING: any) {
    throw new Error('Method not implemented.');
  }
}
