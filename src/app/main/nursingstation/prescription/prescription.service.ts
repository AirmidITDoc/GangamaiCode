import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  mysearchform: FormGroup;
  mypreretunForm: FormGroup;
  constructor(
    public _httpClient:HttpClient,
    private _loaderService: LoaderService,
    private _formBuilder: FormBuilder
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

  public getAdmittedpatientlist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }
  public presciptionSave(employee,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("InPatient/InsertIPPrescription", employee);
  }
   
  public getDoseList() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_DoseMasterList", {})
  }

  public getIpPrescriptionview(OP_IP_ID,PatientType,loader = true){
    if (loader) {
      this._loaderService.show();
  }
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
}
