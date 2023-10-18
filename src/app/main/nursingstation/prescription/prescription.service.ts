import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  mysearchform: FormGroup;
  
  constructor(
    public _httpClient:HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.mysearchform= this.SearchFilterFrom();
  }

  SearchFilterFrom(): FormGroup{
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo:''
     
      

      
    })  
  }

  public getPrecriptionlist(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PrescriptionListFromWard",Param)
  }

  public getPrecriptiondetlist(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_IP_Prescriptio_Det",Param)
  }


  public getItemlist(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_IPDrugName",Param)
  }

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }

  public getWardList(){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveRoomMasterForCombo",{});
  }

  public getRegistrationList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PatientRegistrationList", employee)
  }
  public presciptionSave(employee) {
    return this._httpClient.post("InPatient/InsertIPPrescription", employee);
  }
   
 

}
