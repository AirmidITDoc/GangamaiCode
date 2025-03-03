import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  mysearchform: FormGroup;
  mypreretunForm: FormGroup;
  constructor(
    public _httpClient:HttpClient, public _httpClient1:ApiCaller,
    private _formBuilder: UntypedFormBuilder,
  ) { 
    this.mysearchform= this.SearchFilterFrom();
    this.mypreretunForm=this.PrescriptionReturnFilterForm();
  }

  SearchFilterFrom(): FormGroup{
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      PrescriptionStatus:['Pending'],
      RegNo:''
    })  
  }

  PrescriptionReturnFilterForm():FormGroup{
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo:'',
      PrescriptionStatus:['Pending']
    })
  }
// new dropdown
public getRegistraionById(Id) {
  return this._httpClient1.GetData("OutPatient/" + Id);
}
  public getPrintPrecriptionlist(Param){
    return this._httpClient.post("Generic/GetByProc?procName=rptIPDPrecriptionPrint",Param)
  }

  public getPrecriptionlistmain(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PrescriptionListFromWard",Param)
  }

  public getPrecriptiondetlist(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_IP_Prescriptio_Det",Param)
  }

  public getItemlist(Param){//m_Rtrv_IPDrugName,Retrieve_ItemName_BalanceQty
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemName_BalanceQty",Param)
  }

  public getPharmacyStoreList(){
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_PharStoreList",{});
  }

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }

  public getWardList(){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveRoomMasterForCombo",{});
  }

  public getRegistrationList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientRegistrationList", employee)
  }

  public getAdmittedpatientlist(id){
    return this._httpClient1.GetData("Admission/" + id);
  }
  public presciptionSave(employee) {
    return this._httpClient.post("InPatient/InsertIPPrescription", employee);
  }
   
  public getDoseList() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_DoseMasterList", {})
  }

  public getIpPrescriptionview(OP_IP_ID,PatientType){
    return this._httpClient.get("InPatient/view-IP_Prescription?OP_IP_ID=" + OP_IP_ID+"&PatientType="+PatientType);
  }


  public getPriscriptionretList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_IPPrescriptionReturnListFromWard",Param)
  }

  public getPreiscriptionretdetList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_IPPrescReturnItemDet",Param)
  }

  public getBatchList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ItemNameBatchPOP_IPPresRet",Param)
  }

  public getIpPrescriptionreturnview(PresReId){
    return this._httpClient.get("InPatient/view-IP_PrescriptionReturn?PresReId=" + PresReId);
  }
  // public getItemlist(Param){
  //   return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IPDrugName",Param)
  // }

  public deactivateTheStatus(m_data) {
    return this._httpClient1.PostData("PhoneApp", m_data);
  }
}
