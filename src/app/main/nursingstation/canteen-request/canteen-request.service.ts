import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class CanteenRequestService {
  MyForm:FormGroup;
  SearchMyForm:FormGroup;
  ItemForm:FormGroup;
  
  constructor(
    public _formbuilder:UntypedFormBuilder,
    public _httpClient:HttpClient, public _httpClient1:ApiCaller
  )
   { this.MyForm = this.createMyForm(),
     this.SearchMyForm = this.createsearchForm(),
     this.ItemForm = this.createItemorm()
   }

   createMyForm(){
      return this._formbuilder.group({
        RegId: '',
        PatientName: '',
        WardName: '',
        StoreId: '',
        RegID: [''],
        Op_ip_id: ['1'],
        AdmissionID: 0
      })
    }
    createItemorm(){
      return this._formbuilder.group({
        ItemId: '',
        ItemName: '',
        Qty: ['', [
          Validators.required,
          Validators.pattern("^[0-9]*$")]],
        Remark: ['', [
          Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
        ]]
      })
    }
    createsearchForm(){
      return this._formbuilder.group({
        start: [(new Date()).toISOString()],
        end: [(new Date()).toISOString()],
        RegNo:['']
      })
    }

    public getCanteenList(Param){
      return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CanteenRequestListFromWard",Param);
    }
    public getCanteenDetList(Param){
      return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CanteenRequestDet",Param);
    }
    public getAdmittedpatientlist(employee){
      return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
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
    public getItemlist(Param){ 
      return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CanteenItemList",Param)
    }
    public CanteenReqSave(param){
      return this._httpClient.post('InPatient/CanteenRequest',param);
    }
    public deactivateTheStatus(m_data) {
      return this._httpClient1.PostData("PhoneApp", m_data);
    }
}
