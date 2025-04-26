import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class CancellationService {
  getIpdreturnAdvancepaymentreceipt(D_data: { F_Name: string; L_Name: string; From_Dt: string; To_Dt: string; Reg_No: any; }) {
      throw new Error('Method not implemented.');
  }
  UserFormGroup: FormGroup;
  MyForm: FormGroup;
  constructor(
    public _formBuilder: UntypedFormBuilder,
    public _httpClient: ApiCaller
  ) { this.UserFormGroup = this.createUserFormGroup() }

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
  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("StoreMaster?Id=" + m_data.toString());
    }
  public getIpBillList(param) {
    return this._httpClient.PostData("Generic/GetDataSetByProc?procName=m_Rtrv_BrowseIPDBill", param) 
  }
  public getOPDBillsList(param) {
    return this._httpClient.PostData("Generic/GetDataSetByProc?procName=m_Rtrv_BrowseOPDBill_Pagi", param) 
  }
  public OpCancelBill(param) {
    
    return this._httpClient.PutData("BillCancellation/OPCancelBill", param) 
  }
  public IpCancelBill(param) {
    
    return this._httpClient.PutData("BillCancellation/IPCancelBill", param) 
  }
  public getDateTimeChangeBill(m_data) {
    return this._httpClient.PutData("Administration/UpdateBilldatetime" + m_data.billNo,m_data);
}

public getDateTimeChangeAdvanceDetId(m_data) {
  // return this._httpClient.PutData("Advance/UpdateAdvance" + m_data.advanceDetailId,m_data);
  return this._httpClient.PutData("Advance/UpdateAdvance",m_data);
}

public getDateTimeChangeRefundId(m_data) {
  // return this._httpClient.PutData("Billing/UpdateRefund" + m_data.refundId,m_data);
  return this._httpClient.PutData("Billing/UpdateRefund",m_data);
}

public getDateTimeChangeSalesId(m_data) {
  return this._httpClient.PutData("paymentpharmacy/UpdatePharmSales",m_data);
  // return this._httpClient.PutData("paymentpharmacy/UpdatePharmSales" + m_data.salesNo,m_data);
}
}
