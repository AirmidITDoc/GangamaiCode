import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class IPBillingService {

  userForm:FormGroup;
  constructor( public _formBuilder:FormBuilder,
    public _httpClient:HttpClient) {this.userForm=this.createUserFormGroup()}

    createUserFormGroup(){
      return this._formBuilder.group({
        startdate: [(new Date()).toISOString()],
        enddate: [(new Date()).toISOString()],
        UserId:'',
        DoctorId:'',
        AdvanceDetailID:'',
        RefundId:'',
        BillNo:'',
        // Radio:['1']

      })
    }
  public getDataByQuery(emp) {
        return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ReportList",emp)
  }

  public getUserdetailList(data){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_loginManagerUserForCombo",data)
  }

  public getDoctorList(){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo",{})
  }
 
  public getIPDailyCollection(FromDate,ToDate,AddedById){
    return this._httpClient.get("IPReport/view-IPDailyCollectionReport?FromDate=" +  FromDate + "&ToDate=" + ToDate+"&AddedById="+AddedById);
  }

 
  public getOPIPCommanCollectionSummary(FromDate,ToDate,AddedById,DoctorId){
    return this._httpClient.get("IPReport/view-CommanDailyCollectionReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&AddedById="+AddedById+"&DoctorId="+DoctorId);
  }

  public getOPIPBillSummary(FromDate,ToDate){
    return this._httpClient.get("IPReport/view-OPIPBILLSummaryReport?FromDate=" + FromDate + "&ToDate="+ToDate);
  }

  public getIpFinalBillReceipt(BillNo){
    return this._httpClient.get("InPatient/view-IP-BillReceipt?BillNo=" + BillNo);
  }
  public getViewAdvanceReceipt(AdvanceDetailID){
    return this._httpClient.get("InPatient/view-IP-AdvanceReceipt?AdvanceDetailID=" + AdvanceDetailID);
  }

  public getRefundofAdvanceview(RefundId){
    return this._httpClient.get("InPatient/view-IP-ReturnOfAdvanceReceipt?RefundId=" + RefundId);
  }

  public getRefundofbillview(RefundId){
    return this._httpClient.get("InPatient/view-IP-ReturnOfBillReceipt?RefundId=" + RefundId);
  }
  public getCreditReceipt(FromDate,ToDate){
    return this._httpClient.get("IPReport/view-IPCreditReport?FromDate=" + FromDate + "&ToDate="+ToDate);
  }
  
  public getBillgeneratepaymentdueview(FromDate,ToDate){
    return this._httpClient.get("IPReport/view-IPCreditReport?FromDate=" + FromDate + "&ToDate="+ToDate);
  }

  public getDischargeBillgeneratependingview(FromDate,ToDate){
    return this._httpClient.get("IPReport/view-IPCreditReport?FromDate=" + FromDate + "&ToDate="+ToDate);
  }

  
}