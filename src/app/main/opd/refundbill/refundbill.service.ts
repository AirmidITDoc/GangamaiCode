import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class RefundbillService {

    myformSearch: FormGroup;
    myform: FormGroup;

    constructor(private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder) 
    {
        // this.myformSearch = this.createSearchForm();
        // this.myform = this.createForm(); 
    }
   

    createForm(): FormGroup {
        return this._formBuilder.group({
            
            companyName: [""],
            patientType: [""],
            billDate: [""],
            pBillNo: [""],
            totalAmt: [""],
            concessionAmt: [""],
            netPayableAmt: [""],
            paidAmount: [""], // 123.54 point madeh
            balanceAmt: [""],

            billNo: [""],
            opD_IPD_ID: [""],
            regID: [""],
            opD_IPD_Type: [""],
            isCancelled: 0,
            transactionType: 0,
            advanceId: 0,
            refundId: 0,
            addedBy: 1,
            cashCounterId: [""],
            paymentBillNo: [""],
            companyId: [""],
            cashPay: [""],
            chequePay: [""],
            cardPay: [""],
            neftPay: [""],
            payTMPay: [""],
            advUsdPay: [""],
            opdNo: [""], //"OP-38"
            departmentName: [""],
            // isActive:[true,[Validators.required]],



        });
    }
    
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            StoreNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    
    initializeFormGroup() {
        this.createForm();
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("CurrencyMaster?Id=" + m_data.toString());
    }

    public getRegistraionById(Id) {
        return this._httpClient.GetData("OutPatient/" + Id);
    }

    public getRegisteredList(employee) {
        return this._httpClient.PostData("Generic/GetByProc?procName=m_Rtrv_PatientRegistrationList", employee)
    }

    public getRefundofBillOPDList(employee) {
        console.log(employee)
        debugger
     return this._httpClient.PostData("RefundOfBill/OPBilllistforrefundList",employee);

    }

    public getRefundofBillServiceList(employee) {
       return this._httpClient.PostData("RefundOfBill/OPBillservicedetailList",employee);
    }

    public InsertOPRefundBilling(Param) {
      
            return this._httpClient.PostData("RefundOfBill/OPInsert" ,Param);
      }

    getOprefundofbillview(RefundId) {
        return this._httpClient.GetData("OutPatient/view-OPRefundofBill?RefundId=" + RefundId)
    }

    public getClassList(employee) {
        return this._httpClient.PostData("Generic/GetByProc?procName=ps_rtrv_BillingClassName_1", employee)
    }

    public getserviceCombo() {
        return this._httpClient.PostData("Generic/GetByProc?procName=ps_Retrieve_ServiceMasterForCombo", {})
    }

    // Get billing Service List 
    public getBillingServiceList(employee) {
        // return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_ServicesList", employee)
        return this._httpClient.PostData("BillingService/BillingList", employee)
    }

    public getVisitById(Id) {
        return this._httpClient.GetData("VisitDetail/" + Id);
    }
}
