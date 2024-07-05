import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class OpBillingreportService {

  userForm:FormGroup;
  constructor( public _formBuilder:FormBuilder,
    public _httpClient:HttpClient) {this.userForm=this.createUserFormGroup()}

    createUserFormGroup(){
      return this._formBuilder.group({
        startdate: [(new Date()).toISOString()],
        enddate: [(new Date()).toISOString()],
        UserId:'',
        DoctorId:'',
        RefundId:'',
        // LastName:'',
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
 
  public getOpDailyCollection(FromDate,ToDate,AddedById,DoctorId){
    return this._httpClient.get("OPReport/view-OPDailyCollectionReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&AddedById="+AddedById+"&DoctorId="+DoctorId);
  }

  public getOpDailyCollectionsummary(FromDate,ToDate){
    return this._httpClient.get("OPReport/view-OPCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  
  public getOpBillReceipt(BillNo){
    return this._httpClient.get("OutPatient/view-Op-BillReceipt?BillNo="+BillNo);
  }

  ///change
  public getOPBillSummary(FromDate,ToDate,AddedById){
    return this._httpClient.get("OPReport/view-BillReportSummary?FromDate="+FromDate+"&ToDate="+ToDate+"&AddedById="+AddedById);
  }

  public getOpRefundofbillview(FromDate,ToDate){
    return this._httpClient.get("OPReport/view-OpRefundofbillList?FromDate="+FromDate+"&ToDate="+ToDate);
  }

  public getOPIPBillSummary(BillNo){
    return this._httpClient.get("OutPatient/view-Op-BillReceipt?BillNo="+BillNo);
  }
  public getOPcreditlist(FromDate,ToDate){
    return this._httpClient.get("OPReport/view-OpPatientCreditList?FromDate="+FromDate+"&ToDate="+ToDate);
  }
  
  public getOpDailyCollectionuserwise(FromDate,ToDate,AddedById){
    return this._httpClient.get("OPReport/view-OPDailyCollectionReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&AddedById="+AddedById);
  }

 
  }