import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class PaymentmodechangesService {

  UseFormGroup:FormGroup
   tpayFormGroup:FormGroup
   paymentform:FormGroup
  constructor(
    public _formBuilder:UntypedFormBuilder,
    public _httpClient:ApiCaller
  ) 
  { this.UseFormGroup=this.createUserFormGroup()
    this.tpayFormGroup=this.createUserFormGroup()
 this.paymentform = this.createpaymentForm();
   }

  createUserFormGroup(){
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo:'',
      FirstName:'',
      LastName:'',
      PBillNo:'',
      Radio:['0'],
      ReceiptNo:''
    })
  }
createpaymentForm() {
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      PaymentId: '',
      CashPayAmt: '',
      IsCashpay: '',
      CardPayAmt: '',
      CardNo: '',
      CardBankName: '',
      IsCardpay: '',
      ChequePayAmt: '',
      ChequeNo: '',
      ChequeBankName: '',
      IsChequepay: '',
      NEFTPayAmount: '',
      NEFTNo: '',
      NEFTBankName: '',
      IsNEFTpay: '',
      PayTMAmount: '',
      PayTMTranNo: '',
      IsPayTMpay: '',
      PaidAmount: '',
      BalAmount: ''

    })
  }
  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("StoreMaster?Id=" + m_data.toString());
    }

  public getOpReceiptList(Param){
    return this._httpClient.PostData("Generic/GetByProc?procName=Retrieve_BrowseOPDPaymentReceipt",Param)
  }
  public getIpReceiptList(Param){
    return this._httpClient.PostData("Generic/GetByProc?procName=Retrieve_BrowseIPDPaymentReceipt",Param)
  }
  public getIpAdvanceList(Param){
    return this._httpClient.PostData("Generic/GetByProc?procName=Retrieve_BrowseIPAdvPaymentReceipt",Param)
  }
  public getDateTimeChange(m_data) {
    return this._httpClient.PutData("Administration/UpdatePaymentdatetime"+ m_data.paymentId,m_data);
}
  public getDateTimeChange1(m_data) {
    return this._httpClient.PutData("Administration/TPaymentdatetime"+ m_data.paymentId,m_data);
}


  public PharDateTimeChange(m_data) {
    return this._httpClient.PutData("Administration/TPaymentPharmacydatetime"+ m_data.paymentId,m_data);
}

public getpaybBillBrowseList(m_data) {
    return this._httpClient.PostData("PaymentMode/OPBillListForPaymentModeChangeListBillNoWise",m_data);
}

public TPaymentUpdate(paymentId,m_data) {
    return this._httpClient.PutData("PaymentMode/PaymentMode"+paymentId,m_data);
}



public getpaymodeList(m_data) {
    return this._httpClient.PostData("Common", m_data)
}

public getBankNameList(m_data) {
    return this._httpClient.PostData("Common", m_data)
}



}
