import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { GRNFormModel, GSTCalculation, GSTCalculationResult, GSTType, GSTValidation, ToastType } from './types';
import { ItemNameList } from '../good-receiptnote.component';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class NewGRNService {
    private readonly GST_VALIDATION: GSTValidation = {
        // Provide all valid GST rates
        VALID_GST_RATES: [2.5, 6, 9, 14],
        GST_ERROR_MESSAGE: 'Please enter GST percentage as 2.5%, 6%, 9% or 14%'
    };
    constructor(private toastr: ToastrService) {
    }
    normalizeValues(obj: ItemNameList | GRNFormModel): GSTCalculationResult {
        // Get all required values with proper type conversion
        const finalTotalQty = Number(obj.Qty || 0) + Number(obj.FreeQty || 0);
        const values = {
            totalAmount: Number(obj.TotalAmount || 0),
            discAmount: Number(obj.DisAmount || 0),
            cgst: Number(obj.CGST || 0),
            sgst: Number(obj.SGST || 0),
            igst: Number(obj.IGST || 0),
            gst: Number(obj.GST || 0),
            finalTotalQty,
            conversionFactor: Number(obj.ConversionFactor || 1),
            mrp: Number(obj.MRP || 0),
            rate: Number(obj.Rate || 0)
        };
        return values;
    }
    validatePOQuantity(contact: ItemNameList): boolean {
        if (contact.PurchaseId > 0 && contact.ReceiveQty > contact.POQty) {
            return false;
        }
        if (contact.PurchaseId > 0) {
            contact.POBalQty = contact.POQty - contact.ReceiveQty;
        }
        return true;
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
    validateCellData(item: ItemNameList): boolean {
        if (+item.Disc < 0 || +item.Disc > 100) {
            this.showToast('Discount percentage should be between 0 and 100', ToastType.WARNING);
            item.Disc = 0;
            return false;
        }
        if (+item.Disc2 < 0 || +item.Disc2 > 100) {
            this.showToast('Second Discount percentage should be between 0 and 100', ToastType.WARNING);
            item.Disc2 = 0;
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
        if (+item.FreeQty < 0) {
            this.showToast('Free Quantity should be greater than 0', ToastType.WARNING);
            item.FreeQty = 0;
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
        debugger
        const expDatePattern = /^(0[1-9]|1[0-2])\d{4}$/;
        if (!expDatePattern.test(item.ExpDate)) {
            this.showToast('Invalid Expiry Date format. Expected MMYYYY', ToastType.WARNING);
            return false;
        }
        return true;
    }
    calculateTotalQuantity(receiveQty: number, freeQty: number, conversionFactor: number): number {
        if (!conversionFactor || conversionFactor <= 0) {
            this.showToast('Packing cannot be 0', ToastType.WARNING);
            conversionFactor = 1;
        }
        return ((receiveQty || 0) + (freeQty || 0)) * conversionFactor;
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
            Number(contact.ReceiveQty || 0),
            Number(contact.FreeQty || 0),
            Number(contact.ConversionFactor || 1)
        );

        // Calculate total amount
        const totalAmount = Number(contact.ReceiveQty || 0) * Number(contact.Rate || 0);

        // Calculate discount
        const discAmount = (totalAmount * Number(contact.DiscPercentage || 0)) / 100;

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
        contact.TotalQty = (Number(contact.Qty || 0) + Number(contact.FreeQty || 0)) * Number(contact.ConversionFactor || 1);
        this.calculateCellTotalAmount(contact);
        const discountAmount = (Number(contact.TotalAmount || 0) * Number(contact.Disc || 0)) / 100;
        const discountAmount2 = (Number(contact.TotalAmount || 0) * Number(contact.Disc2 || 0)) / 100;
        contact.DisAmount = discountAmount;
        contact.DisAmount2 = discountAmount2;
    }
    public calculateCellTotalAmount(contact: ItemNameList): void {
        contact.TotalAmount = Number(contact.Qty || 0) * Number(contact.Rate || 0);
    }
    // Pending.
    validateGRNForm(form: FormGroup): boolean {
        const values = form.getRawValue() as GRNFormModel;

        if (!values.ItemName) {
            this.showToast('Please select an item', ToastType.WARNING);
            return false;
        }
        if (!values.BatchNo) {
            this.showToast('Please enter a Batch No', ToastType.WARNING);
            return false;
        }
        if (!values.ExpDate) {
            this.showToast('Please enter a Expiry Date', ToastType.WARNING);
            return false;
        }
        if (!values.Qty || +values.Qty < 0) {
            this.showToast('Please enter a valid Quantity', ToastType.WARNING);
            form.patchValue({ Qty: 0 });
            return false;
        }
        if (!values.Rate || +values.Rate < 0) {
            this.showToast('Please enter a rate greater than 0', ToastType.WARNING);
            form.patchValue({ Rate: 0 });
            return false;
        }
        if (+values.Rate > +values.MRP) {
            this.showToast('Rate should less than MRP', ToastType.WARNING);
            form.patchValue({ Rate: 0 });
            return false;
        }
        if (+values.Disc < 0 || +values.Disc > 100) {
            this.showToast('Discount percentage should be between 0 and 100', ToastType.WARNING);
            form.patchValue({ Disc: 0 });
            return false;
        }
        if (+values.ConversionFactor < 1) {
            this.showToast('Conversion Factor should be greater than 0', ToastType.WARNING);
            form.patchValue({ ConversionFactor: 1 });
            return false;
        }
        return true;
    }
    // You can create this method in a separate service for toast notifications.
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
}
