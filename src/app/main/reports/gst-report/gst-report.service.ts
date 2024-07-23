import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GstReportService {
  userForm:FormGroup;
  constructor(public _formBuilder:FormBuilder,
    public _httpClient:HttpClient) {this.userForm=this.createUserFormGroup();}




      createUserFormGroup(){
        return this._formBuilder.group({
          startdate: [(new Date()).toISOString()],
          enddate: [(new Date()).toISOString()],
          UserId:'',
          DoctorId:'',
          StoreId:'',
          // VisitId:'',
          // PaymentId:'',
          // RefundId:'',
          // DoctorID:'',
          // ServiceId:'',
          // GroupId:''
          // Radio:['1']
  
        })
      }
    public getDataByQuery(emp) {
          return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ReportList",emp)
    }
  
    public getUserdetailList(data){
      return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_loginManagerUserForCombo",data)
    }

    
  public getSalesprofitsummaryReport(FromDate,ToDate){
  
    return this._httpClient.get("GSTReport/view-SalesProfitSummaryReport?FromDate="+FromDate+"&ToDate="+ToDate);
  }

  public getSalesprofitbillReport(FromDate,ToDate,StoreId){
  
    return this._httpClient.get("GSTReport/view-SalesProfitBillReport?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }

  public getProfititemwisesummaryReport(FromDate,ToDate,StoreId){
  
    return this._httpClient.get("GSTReport/view-SalesProfitItemWiseSummaryReport?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }
  getStoreList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName",{})
  }
}
