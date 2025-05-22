import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { GSTCalculation, GSTCalculationResult, GSTType, GSTValidation, ToastType } from '../good-receiptnote/new-grn/types';
import { ToastrService } from 'ngx-toastr';
import { ItemNameList } from './purchase-order.component';
import { PurchaseFormModel } from './update-purchaseorder/types';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private readonly GST_VALIDATION: GSTValidation = {
    // Provide all valid GST rates
    VALID_GST_RATES: [2.5, 6, 9, 14],
    GST_ERROR_MESSAGE: 'Please enter GST percentage as 2.5%, 6%, 9% or 14%'
  };
  // userFormGroup: FormGroup;
  // PurchaseSearchGroup: FormGroup;
  // FinalPurchaseform: FormGroup;
  // StoreFormGroup: FormGroup;
  POEmailFrom: FormGroup;
  IgstPercentage = 0
  CgstPercentage = 0
  SgstPercentage = 0
  normalizeValues(obj: ItemNameList | PurchaseFormModel): GSTCalculationResult {
    debugger
    // Get all required values with proper type conversion
    const finalTotalQty = Number(obj.Qty || 0);
    const values = {
      totalAmount: Number(obj.TotalAmount || 0),
      discAmount: Number(obj.DiscAmount || 0),
      cgst: Number(obj.CGSTPer || 0),
      sgst: Number(obj.SGSTPer || 0),
      igst: Number(obj.IGSTPer || 0),
      gst: Number(obj.GSTAmount || 0),

      finalTotalQty,
      conversionFactor: Number(obj.ConversionFactor || 1),
      mrp: Number(obj.MRP || 0),
      rate: Number(obj.Rate || 0)
    };
    return values;
  }


  constructor(
    public _httpClient: HttpClient, public _httpClient1: ApiCaller, private toastr: ToastrService,
    private _formBuilder: UntypedFormBuilder, private _FormvalidationserviceService: FormvalidationserviceService, private accountService: AuthenticationService,
  ) { }

  PurchaseSearchFrom() {
    return this._formBuilder.group({
      StoreId: [this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      SupplierId:  [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      startdate: [new Date().toISOString()],
      enddate: [new Date().toISOString()],
      Status: [0],
    });
  }


  getPurchaseOrderForm() {
    return this._formBuilder.group({
      purchaseId: [''],
      purchaseNo: [''],
      StoreId: [this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      SupplierId: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      TotalAmount: [''],
      DiscAmount: [''],
      Disc: [''],

      grandTotal: [''],
      ItemName: ['', [Validators.required]],
      ConversionFactor: [''],
      Qty: [0, [Validators.required]],
      UOM: [''],
      Rate: ['', [Validators.required]],

      HSNcode: '',
      GST: [''],
      GSTPer: [''],
      GSTAmount: [''],
      NetAmount: [''],
      MRP: [''],
      Specification: [''],
      SupplierID: '',
      Address: [''],
      Mobile: '',
      Contact: '',
      GSTNo: '',
      Email: '',
      PurchaseDate: [new Date()],
      DefRate: '',

      CGSTPer: [''],
      CGSTAmount: [''],
      SGSTPer: [''],
      SGSTAmount: [''],
      IGSTPer: [''],
      IGSTAmount: [''],
      GSTType: [16],
      UOMId: [''],

      PurchaseId: [0],

    });

  }

  getPurchaseOrderFinalForm() {
    return this._formBuilder.group({

      TransportCharges: [''],
      HandlingCharges: [''],
      Freight: [''],
      OctriAmount: [''],
      Worrenty: [''],
      roundVal: [''],
      NetAmount: [''],
      Remark: ['', [Validators.required]],
      PaymentTerm: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      PaymentMode: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

    });
  }
  createPOEmailFrom() {
    return this._formBuilder.group({
      ToMailId: [''],
      Subject: [''],
      Body: [''],
      CCName: [''],
      bccName: ['']
    })
  }


  public getLastThreeItemInfo(Param) {
    return this._httpClient1.PostData("Purchase/LastThreeItemList", Param);
  }

  public getPurchaseOrderDetail(Param) {
    return this._httpClient1.PostData("Purchase/OldPurchaseOrderList", Param);
  }

  public InsertPurchaseSave(Param) {

    if (Param.purchaseId) {
      return this._httpClient1.PutData("Purchase/Edit/" + Param.purchaseId, Param)
    } else return this._httpClient1.PostData("Purchase/Insert", Param);
  }


  public InsertPurchaseUpdate(Param) {
    return this._httpClient1.PutData("Purchase/Edit/" + Param.purchaseId, Param)
  }
  public getVerifyPurchaseOrdert(Param) {
    return this._httpClient1.PostData("Purchase/Verify", Param)
  }
  public getSupplierRateList(data) {
    return this._httpClient1.PostData("Purchase/SupplierrateList", data);
  }

  public EmailSendInsert(emp) {
    return this._httpClient.post("WhatsappEmail/EmailSave", emp);
  }


  showToast(message: string, type: ToastType = ToastType.SUCCESS) {
    if (type === ToastType.SUCCESS) {
      this.toastr.success(message, `${type} !`, {
        toastClass: `tostr-tost custom-toast-${ToastType.SUCCESS}`,
      });
    }

    if (type === ToastType.WARNING) {
      this.toastr.warning(message, `${type} !`, {
        toastClass: `tostr-tost custom-toast-${ToastType.WARNING}`,
      });
    }
    if (type === ToastType.ERROR) {
      this.toastr.error(message, `${type} !`, {
        toastClass: `tostr-tost custom-toast-${ToastType.ERROR}`,
      });
    }

  }

  public getSupplierById(Id) {
    return this._httpClient1.GetData("Supplier/" + Id);
  }

  populateForm(employee) {
    // this.PurchaseStoreFrom.patchValue(employee);
  }


  public getPurchaseOrder(Param) {
    return this._httpClient1.PostData("Common", Param);
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

  public calculateBasicValues(contact: ItemNameList): void {
    debugger
    contact.TotalQty = (Number(contact.Qty || 0)) * Number(contact.ConversionFactor || 1);
    this.calculateCellTotalAmount(contact);
    const discountAmount = ((Number(contact.TotalAmount || 0) * Number(contact.DiscPer || 0)) / 100).toFixed(4);
    contact.DiscAmount = discountAmount;

  }
  public calculateCellTotalAmount(contact: ItemNameList): void {
    contact.TotalAmount = (Number(contact.Qty || 0) * Number(contact.Rate || 0)).toFixed(4);
  }

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

}

