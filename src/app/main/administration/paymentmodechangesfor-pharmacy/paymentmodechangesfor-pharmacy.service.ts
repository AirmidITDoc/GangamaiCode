import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentmodechangesforpharmacyService {

    userFormGroup:FormGroup;
    paymentform:FormGroup;
    paymentInsertform:FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) 
    {       
      this.userFormGroup=this.createUseForm()
      this.paymentform=this.createpaymentForm();
      this.paymentInsertform=this.createpaymentInsertForm();
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

    createpaymentInsertForm(){
      return this._formBuilder.group({
        PaymentId:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        BillNo:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        ReceiptNo:[],
        PaymentDate:[new Date()],
        PaymentTime:[new Date()],
        CashPayAmount:["0"],
        ChequePayAmount:["0"],
        ChequeNo:['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        BankName:'',
        ChequeDate:'',
        CardPayAmount:'',
        CardNo:['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        CardBankName :'',
        CardDate:'',
        AdvanceUsedAmount:'',
        AdvanceId:'',
        RefundId:'',
        TransactionType:'',
        Remark:'',
        AddBy:'',
        IsCancelled:false,
        IsCancelledBy:0,
        IsCancelledDate:'1900-01-01',
        NeftpayAmount:'',
        Neftno:['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        NeftbankMaster:'',
        Neftdate: "1900-01-01",
        PayTmamount:'',
        PayTmtranNo:['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        PayTmdate: "1900-01-01",    
        Tdsamount: 0,

        // extra fields
        
        PaidAmount:'',
        BalAmount:'',
        IsPayTMpay:'',
        NEFTBankName:'',
        IsNEFTpay:'',
        IsCardpay:'',
        IsChequepay:'',
        ChequeBankName:'',
        IsCashpay:'',
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
