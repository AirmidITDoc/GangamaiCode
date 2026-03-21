import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
    providedIn: 'root'
})
export class AppointmentBillService {

    constructor(public _httpClient1: ApiCaller, private _formBuilder: UntypedFormBuilder, private _loaderService: LoaderService,
    ) { }


    public getRegistraionById(Id) {
        return this._httpClient1.GetData("OutPatient/" + Id);
    }
    public getVisitById(Id) {
        return this._httpClient1.GetData("VisitDetail/" + Id);
    }
    public getBillingServiceList(param) {
        return this._httpClient1.PostData("VisitDetail/GetServiceListwithTraiff", param)
    }
    public getAccessDetailList(param) {
        return this._httpClient1.PostData("LoginManager/loginAccessDetailsList", param)
    }

    public InsertOPBillingCredit(param) {
        return this._httpClient1.PostData("OPBill/OPCreditBillingInsert", param)
    }
    public InsertOPBilling(param) {
        return this._httpClient1.PostData("OPBill/OPBillingInsert", param)
    }
    public InsertOPDraftBilling(param) {
        return this._httpClient1.PostData("OPBill/OPDraftBillInsert", param)
    }
    public InsertEditOPDraftBilling(param) {
        return this._httpClient1.PostData("OPBill/OPDraftBillUpdate", param)
    }
    public getRtevPackageDetList(param) {
        return this._httpClient1.PostData("BillingService/PackageDetailList", param);
    }
    public getRtevIPPackageDetList(param) {
        return this._httpClient1.PostData("IPBill/IpPackageDetailsList", param);
    }
    public UpdatePacakgeDet(param, chargesId) {
        return this._httpClient1.PutData("IPBill/UpdateAddcharges/" + chargesId, param);
    }
    public InsertIPAddCharges(param) {
        return this._httpClient1.PostData("IPBill/InsertIPDPackageBill", param);
    }
    public AddchargesDelete(m_data, loader = true) {
        if (loader) {
            this._loaderService.show();
        }
        return this._httpClient1.PostData("IPBill/IPAddchargesdelete", m_data);
    }

    public getOPDEmrId(param) {
        return this._httpClient1.PostData("OPDPrescriptionMedical/OPRequestListFromEMR", param)
    }
    public checkStatus(mpesaResponse: any) {
        return this._httpClient1.GetData("MPesa/check-payment?MerchantRequestID=" + mpesaResponse?.merchantRequestID + "&CheckoutRequestID=" + mpesaResponse?.checkoutRequestID);
    }

    // public mpesaPay(param: any) {
    //     const params = `phone=${param.phone}&amount=${param.amount}&reference=${param.reference}`;
    //     return this._httpClient1.PostData("MPesa/pay?" + params, {});
    // }
    public postpayment(amount, phone, opdipdid) {
        return this._httpClient1.PostData("MPesa/pay", { amount: amount, phone: phone, opdipdid: opdipdid })
    }
    public getmPesaTranscationlist(param) {
        return this._httpClient1.PostData("MPesa/List", param)
    }

    public getReportView(Param, loader = true) {
        if (loader) {
            this._loaderService.show();
        }
        // return this._httpClient1.PostData("Report/ViewReportFromDB", Param);
        return this._httpClient1.PostData("Common", Param)
    }
    public getdraftchargeslist(param) {
        return this._httpClient1.PostData("OPBill/OPDraftAddChargeslList", param)
    }
    public getdraftlist(param) {
        return this._httpClient1.PostData("OPBill/OPDraftBillList", param)
    }
    public getDeleteDratfBill(param) {
        return this._httpClient1.PostData("OPBill/Cancel", param)
    }
}
