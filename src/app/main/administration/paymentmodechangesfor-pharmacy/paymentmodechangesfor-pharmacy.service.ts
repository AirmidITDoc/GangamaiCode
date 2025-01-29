import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class PaymentmodechangesforpharmacyService {

    userFormGroup:FormGroup;
    paymentform:FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) 
    { 
      
      this.userFormGroup=this.createUseForm()
      this.paymentform=this.createpaymentForm();
    }

    createUseForm(){
      return this._formBuilder.group({
        startdate: [(new Date()).toISOString()],
        enddate: [(new Date()).toISOString()],
        RegNo:'',
        FirstName:'',
        LastName:'',
        SalesNo:'',
        Radio:['1'],
        StoreId:''

      })
    }

    createpaymentForm(){
      return this._formBuilder.group({
        startdate: [(new Date()).toISOString()],
        enddate: [(new Date()).toISOString()],
        PaymentId:'',
        CashPayAmt:'',
        IsCashpay:'',
        CardPayAmt:'',
        CardNo:'',
        CardBankName :'',
        IsCardpay:'',
        ChequePayAmt:'',
        ChequeNo:'',
        ChequeBankName:'',
        IsChequepay:'',
        NEFTPayAmount:'',
        NEFTNo:'',
        NEFTBankName:'',
        IsNEFTpay:'',
        PayTMAmount:'',
        PayTMTranNo:'',
        IsPayTMpay:'',
        PaidAmount:'',
        BalAmount:''
        
      })
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("StoreMaster?Id=" + m_data.toString());
    }


    public getIpPharAdvanceList(Param){
      return this._httpClient.PostData("Generic/GetByProc?procName=Retrieve_BrowseIPAdvPayPharReceipt",Param)
    }
    public getSalesNoList(Param){
      return this._httpClient.PostData("Generic/GetByProc?procName=Rtrv_BrowsePharmacyPayReceipt",Param)
    }

    public getBankMasterCombo() {
      return this._httpClient.PostData("Generic/GetByProc?procName=RetrieveBankMasterForCombo", {})
    }
    
    public PaymentmodeUpdate(employee) {//Administration/UpdateLoginUser
      return this._httpClient.PostData("Pharmacy/UpdatePharmPaymentMode", employee);
    }
    
}
