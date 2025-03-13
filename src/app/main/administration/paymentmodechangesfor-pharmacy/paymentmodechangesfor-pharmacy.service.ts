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
        Radio:['0'],
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

    // public getBankMasterCombo() {
    //   return this._httpClient.PostData("Generic/GetByProc?procName=RetrieveBankMasterForCombo", {})
    // }
    
    public PaymentUpdate(employee) {
      
      if(employee.PaymentId)
      return this._httpClient.PutData("Payment/Edit/" + employee.PaymentId, employee);
    }

    public PaymentPhyUpdate(employee) {
      
      if(employee.PaymentId)
      return this._httpClient.PutData("paymentpharmacy/Edit/" + employee.PaymentId, employee);
    }
    
}
