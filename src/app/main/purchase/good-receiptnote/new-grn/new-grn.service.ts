import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { GSTCalculation } from './types';

@Injectable({
    providedIn: 'root'
})
export class NewGRNService {

    constructor() {
    }
    public calculateGSTAfterDisc(values: any): GSTCalculation {
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

    public calculateGSTBeforeDisc(values: any): GSTCalculation {
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

    public calculateGSTOnMRPPlusFreeQty(values: any): GSTCalculation {
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

    public calculateGSTOnPurPlusFreeQty(values: any): GSTCalculation {
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
}
