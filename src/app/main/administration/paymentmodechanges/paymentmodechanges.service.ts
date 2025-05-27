import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class PaymentmodechangesService {

  UseFormGroup:FormGroup
  constructor(
    public _formBuilder:UntypedFormBuilder,
    public _httpClient:ApiCaller
  ) 
  { this.UseFormGroup=this.createUserFormGroup() }

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
    debugger
    return this._httpClient.PutData("Administration/UpdatePaymentdatetime"+ m_data.paymentId,m_data);
}
}
