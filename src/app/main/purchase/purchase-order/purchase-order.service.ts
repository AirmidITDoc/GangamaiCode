import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import {  GSTCalculation, GSTCalculationResult, GSTType, GSTValidation, ToastType } from '../good-receiptnote/new-grn/types';
import { ToastrService } from 'ngx-toastr';
import { ItemNameList } from './purchase-order.component';
import { PurchaseFormModel } from './update-purchaseorder/types';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private readonly GST_VALIDATION: GSTValidation = {
        // Provide all valid GST rates
        VALID_GST_RATES: [2.5, 6, 9, 14],
        GST_ERROR_MESSAGE: 'Please enter GST percentage as 2.5%, 6%, 9% or 14%'
    };
  userFormGroup: FormGroup;
  PurchaseSearchGroup: FormGroup;
  FinalPurchaseform: FormGroup;
  StoreFormGroup: FormGroup;
  POEmailFrom: FormGroup;
  //PurchaseOrderHeader:FormGroup;
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
    private _formBuilder: UntypedFormBuilder
  ) {
    // this.userFormGroup = this.getPurchaseOrderForm();
    // this.PurchaseSearchGroup = this.PurchaseSearchFrom();
    // this.FinalPurchaseform = this.getPurchaseOrderFinalForm();
    // this.StoreFormGroup = this.createStoreFrom();
    // this.POEmailFrom = this.createPOEmailFrom();
    // this.PurchaseOrderHeader=this.createHeaderFrom();
  }

   

  PurchaseSearchFrom() {
    return this._formBuilder.group({
      StoreId: [0],
      ToStoreId: "2",
      // FromStoreId: 0,
      SupplierId: "0",
      startdate: [new Date().toISOString()],
      enddate: [new Date().toISOString()],
      Status: [0],
    });
  }

  createStoreFrom() {
    return this._formBuilder.group({
      StoreId: [''],
      ToStoreId: '',
      FromStoreId: '',
      SupplierId: '',
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      Status: ['1'],
    });
  }
  // createHeaderFrom(){
  //   return this._formBuilder.group({
  //     Status3: [''],
  //     SupplierId: [''],
  //     SupplierID:'',
  //     Address:'',
  //     Mobile:'',
  //     Contact:'',
  //     GSTNo:'',
  //     Email:''
  //   })
  // }

  getPurchaseOrderForm() {
    return this._formBuilder.group({
      // purchaseId: [''],
      // purchaseNo: [''],
      // StoreId: [1],
      // SupplierId: [''],
      // TotalAmount: [''],
      // DiscAmount: [''],
      // Disc:[''],
      // taxAmount: [''],
      // freightAmount: [''],
      // octriAmount: [''],
      // grandTotal: [''],
      // isclosed: [''],
      // isVerified: [''],
      // remarks: [''],
      // taxId: [''],
      // paymentTermId: ['14'],
      // modeofPayment: ['1'],
      // worrenty: [''],
      // roundVal: [''],
      // prefix: [''],
      // isVerifiedId: [''],
      // verifiedDateTime: [''],
      // totCgstamt: [''],
      // totSgstamt: [''],
      // totIgstamt: [''],
      // transportChanges: [''],
      // handlingCharges: [''],
      // freightCharges: [''],

      // ItemName:   ['', [Validators.required]],
      // ConversionFactor: [''],
      // Qty:   [1, [Validators.required]],
      // UOM: [''],
      // Rate:  ['', [Validators.required]],

      // HSNcode: '',
      // GST: [''],
      // GSTPer: [''],
      // GSTAmount: [''],
      // NetAmount: [''],
      // MRP: [''],
      // Specification: [''],
      // SupplierID: '',
      // Address: '',
      // Mobile: '',
      // Contact: '',
      // GSTNo: '',
      // Email: '',
      // PurchaseDate: [new Date()],
      // DefRate: '',
      
      // CGSTPer: [''],
      // CGSTAmount: [''],
      // SGSTPer: [''],
      // SGSTAmount: [''],
      // IGSTPer: [''],
      // IGSTAmount: [''],
      // GSTType: [''],
      // UOMId:['']

      PurchaseId:[0],
      UOMId:[''],
      Disc:[''],
      // GSt:[''],
      StoreId: [2, [Validators.required]],
      ItemName:  ['', [Validators.required]],
      ConversionFactor: [''],
      Qty:  ['', [Validators.required]],
      UOM: [''],
      Rate:  ['', [Validators.required]],
      TotalAmount: ['', [Validators.required]],
      HSNcode:'',
      Dis: [''],
      DiscAmount: [''],
      GST: [''],
      GSTPer: [''],
      GSTAmount: [''],
      NetAmount: ['', [Validators.required]],
      MRP: [''],
      Specification: [''],
      purchaseId: [''],
      Status3: [''],
      SupplierId: [''],
      SupplierID:'',
      Address:'',
      Mobile:'',
      Contact:'',
      GSTNo:'',
      Email:'',
      PurchaseDate: [new Date()],
      DefRate:'',
      CGSTPer: [''],
      CGSTAmount: [''],
      SGSTPer: [''],
      SGSTAmount: [''],
      IGSTPer: [''],
      IGSTAmount: [''],
      GSTType: [16]
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
      Remark: [''],
      PaymentMode: [''],
      PaymentTerm: [''],

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

  PurchaseOrder() {
    return this._formBuilder.group({

    });
  }
  public getLastThreeItemInfo(Param) {
    return this._httpClient1.PostData("Purchase/LastThreeItemList", Param);
  }
  public getPaymentTermList() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_termsofpaymentMaster", {});
  }
  public getModeOfPaymentList() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_modeofpaymentForcombo", {});
  }
  public getGSTtypeList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_Constants", Param);
  }
  public getSupplierSearchList(param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_SupplierName_list", param);
  }
  public getLoggedStoreList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional", Param);
  }
  public getPurchaseOrderDetail(Param) {
    return this._httpClient1.PostData("Purchase/OldPurchaseOrderList", Param);
  }
  public getItemList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ItemNameList_GRN", Param);
  }


  public InsertPurchaseSave(Param) {
       
    if (Param.purchaseId) {
      return this._httpClient1.PutData("Purchase/Edit/" + Param.purchaseId, Param)
      } else return this._httpClient1.PostData("Purchase/Insert", Param);
  }

  
  public InsertPurchaseUpdate(Param) {
    return this._httpClient1.PutData("Purchase/Edit/" + Param.purchaseId, Param)
  }
  public getPrintPurchaseOrdert(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=rptPrintPurchaseOrder", Param);
  }
  public getVerifyPurchaseOrdert(Param) {
    return this._httpClient1.PostData("Purchase/Verify", Param)
  }

  public getItemNameList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveItemName_GRN", Param);
  }

  public getSupplierRateList(data) {
    return this._httpClient1.PostData("Purchase/SupplierrateList", data);
  }


  public getPurchaseorderreportview(PurchaseID) {
    return this._httpClient.get("Pharmacy/view-Purchaseorder?PurchaseID=" + PurchaseID);
  }



  public InsertWhatsappPurchaseorder(emp) {
    return this._httpClient.post("WhatsappEmail/WhatsappSalesSave", emp);
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
      public calculateItemTotalValues(contact: ItemNameList): GSTCalculationResult {
          // Calculate total quantity with free qty
          const finalTotalQty = this.calculateTotalQuantity(
              Number(contact.Qty || 0),
              // Number(contact.FreeQty || 0),
              Number(contact.ConversionFactor || 1)
          );
  
          // Calculate total amount
          const totalAmount = Number(contact.Qty || 0) * Number(contact.Rate || 0);
  
          // Calculate discount
          const discAmount = (totalAmount * Number(contact.DiscPer || 0)) / 100;
  
          return {
              totalAmount,
              discAmount,
              cgst: Number(contact.CGSTPer || 0),
              sgst: Number(contact.SGSTPer || 0),
              igst: Number(contact.IGSTPer || 0),
              gst: Number(contact.CGSTPer || 0) + Number(contact.SGSTPer || 0) + Number(contact.IGSTPer || 0),
              finalTotalQty,
              conversionFactor: Number(contact.ConversionFactor || 1),
              mrp: Number(contact.MRP || 0),
              rate: Number(contact.Rate || 0)
          };
      }
      public calculateBasicValues(contact: ItemNameList): void {
        debugger
          contact.TotalQty = (Number(contact.Qty || 0)) * Number(contact.ConversionFactor || 1);
          this.calculateCellTotalAmount(contact);
          const discountAmount = (Number(contact.TotalAmount || 0) * Number(contact.DiscPer || 0)) / 100;
          contact.DiscAmount = discountAmount;
          
      }
      public calculateCellTotalAmount(contact: ItemNameList): void {
          contact.TotalAmount = Number(contact.Qty || 0) * Number(contact.Rate || 0);
      }

      calculateTotalQuantity(receiveQty: number,conversionFactor: number): number {
        if (!conversionFactor || conversionFactor <= 0) {
            this.showToast('Packing cannot be 0', ToastType.WARNING);
            conversionFactor = 1;
        }
        return ((receiveQty || 0) ) * conversionFactor;
    }

    public calculateGSTAfterDisc(values: GSTCalculationResult): GSTCalculation {
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
      
        const baseAmount = values.totalAmount;

        const cgstAmount = (baseAmount * values.cgst) / 100;
        const sgstAmount = (baseAmount * values.sgst) / 100;
        const igstAmount = (baseAmount * values.igst) / 100;

        const totalGSTAmount = cgstAmount + sgstAmount + igstAmount;
        const netAmount = baseAmount - values.discAmount + totalGSTAmount;
        debugger
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

    //Cell Cal
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
                item.GST = Number(item.CGST) + Number(item.SGST) + Number(item.IGST);
                const rates = [
                    { value: item.CGST, type: 'CGST' },
                    { value: item.SGST, type: 'SGST' },
                    { value: item.IGST, type: 'IGST' }
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

