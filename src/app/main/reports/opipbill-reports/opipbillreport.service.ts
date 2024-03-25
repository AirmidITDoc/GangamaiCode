import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class OPIPBillreportService {
  userForm:FormGroup;
  constructor( public _formBuilder:FormBuilder,
  public _httpClient:HttpClient) {this.userForm=this.createUserFormGroup()}



  createUserFormGroup(): FormGroup {
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      DcotorId: '',
     
      UserId:'',
      // PaymentMode:''

    })
  }
  public getUserdetailList(data){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_loginManagerUserForCombo",data)
  }

  getDoctorList(){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo",{})
  }

  public getDataByQuery() {
    // return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ReportList",{})
  }


  

  
  public getOPDailyCollection(FromDate,ToDate,AddedById,DoctorId){
    return this._httpClient.get("OPReport/view-OPDailyCollectionReport?FromDate=" +  FromDate + "&ToDate=" + ToDate+"&AddedById="+AddedById+"&DoctorId="+DoctorId );
  }

  public getIPDailyCollection(FromDate,ToDate,AddedById){
    return this._httpClient.get("IPReport/view-IPDailyCollectionReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&AddedById="+AddedById);
  }

  public getOPIPCommanSummary(FromDate,ToDate,AddedById,DoctorId){
    return this._httpClient.get("IPReport/view-CommanDailyCollectionReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&AddedById="+AddedById +"&DoctorId="+DoctorId) ;
  }

  public getOPIPBILLINgSummary(FromDate,ToDate){
    return this._httpClient.get("IPReport/view-OPIPBILLSummaryReport?FromDate=" + FromDate + "&ToDate="+ToDate);
  }
}
