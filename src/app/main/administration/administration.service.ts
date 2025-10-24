import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {
  myDocShrformSearch: FormGroup;
  UserFormGroup: FormGroup;
  constructor(private _httpClient: ApiCaller, private _formBuilder: UntypedFormBuilder,
  ) {
    this.myDocShrformSearch = this.BillListForDocShr();
    this.UserFormGroup=this.createUserFormGroup()
  }



  BillListForDocShr(): FormGroup {
    return this._formBuilder.group({

      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      DoctorId: '',
      PBillNo: '',


    });
  }
//Admin task
    createUserFormGroup() {
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo: '',
      FirstName: '',
      LastName: '',
      PBillNo: '',
      OP_IP_Type: ['0'],
      IsIntrimOrFinal:"2"
    })
  }

  public getUserList(employee) {
    return this._httpClient.PostData("Generic/GetByProc?procName=RtrvUserList", employee)
  }
  public getRegistraionById(Id) {
    return this._httpClient.GetData("OutPatient/" + Id);
  }
 public OpCancelBill(param) {
    
    return this._httpClient.PutData("BillCancellation/OPCancelBill", param) 
  }
  public IpCancelBill(param) {    
    return this._httpClient.PutData("BillCancellation/IPCancelBill", param) 
  }

  public SaveCancelAdvance(param) {    
    return this._httpClient.PostData("Advance/Cancel", param) 
  }
  
  public getDateTimeChangeBill(m_data) {
    return this._httpClient.PutData("Administration/UpdateBilldatetime" + m_data.billNo,m_data);
}

  public OPBillDetailList(m_data) {
    return this._httpClient.PostData("OPBill/BrowseOPDBillPagiList",m_data);
}

  public IPBillDetailList(m_data) {
    return this._httpClient.PostData("Billing/BrowseIPBillList",m_data);
}
  public OPPaymentList(m_data) {
    return this._httpClient.PostData("OPBill/BrowseOPDBillPagiList",m_data);
}  
  public IPPaymentList(m_data) {
    return this._httpClient.PostData("paymentpharmacy/IPDPaymentReceiptList",m_data);
} 
public AdvanceList(m_data) {
    return this._httpClient.PostData("Advance/BrowseAdvanceList",m_data);
}  public refundList(m_data) {
    return this._httpClient.PostData("Billing/BrowseIPRefundlist",m_data);
}

}
