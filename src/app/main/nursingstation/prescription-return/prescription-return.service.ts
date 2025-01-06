import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionReturnService {
  PrecReturnSearchGroup :UntypedFormGroup;
  constructor(
    public _httpClient:HttpClient,   public _httpClient1:ApiCaller,
    private _FormBuilder:UntypedFormBuilder
  ) { this.mySearchForm=this.SearchFilterForm();
    this.PrecReturnSearchGroup= this.PrescriptionRetSearchFrom();
  }

  mySearchForm:UntypedFormGroup;

  SearchFilterForm():UntypedFormGroup{
    return this._FormBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo:'',
      PrescriptionStatus:['Pending']
    })
  }

  
  PrescriptionRetSearchFrom() {
    return this._FormBuilder.group({
      StoreId: '',
      ItemId:'',
      ItemName:'',
      BatchNo:'',
      BatchExpDate:'',
      BalanceQty:'',
      UnitMRP:'',
      Qty: [' ', [Validators.pattern("^^[1-9]+[0-9]*$")] ],
      IssQty:'',
      Bal:'',
      StoreName:'',
      GSTPer:'',
      GSTAmt:'',
      MRP:'',
      TotalMrp:'',
      DiscAmt: [' ', [Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")] ],
      NetAmt:'',
      DiscPer:'',
      MarginAmt:'0'
      // ItemName:'',
      // start: [(new Date()).toISOString()],
      // end: [(new Date()).toISOString()],
    });
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

  public getItemlist(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IPDrugName",Param)
  }


  public presciptionreturnSave(emp){
    return this._httpClient.post("InPatient/InsertIPPrescriptionReturn",emp)
  }

  public getAdmittedPatientList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch", employee)
  }
  public getRegistrationList(employee)
{
  return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PatientRegistrationList",employee)
}  



public getIpPrescriptionreturnview(PresReId){
  return this._httpClient.get("InPatient/view-IP_PrescriptionReturn?PresReId=" + PresReId);
}

public deactivateTheStatus(m_data) {
  return this._httpClient1.PostData("PhoneApp", m_data);
}

}


 


 
 
 