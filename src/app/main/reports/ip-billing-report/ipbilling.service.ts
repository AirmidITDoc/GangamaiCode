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
        // FirstName:'',
        // LastName:'',
        // BillNo:'',
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

  

}