import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionReturnService {
  PrecReturnSearchGroup :FormGroup;
  constructor(
    public _httpClient:HttpClient,
          private _loaderService: LoaderService,
    private _FormBuilder:FormBuilder
  ) { this.mySearchForm=this.SearchFilterForm();
    this.PrecReturnSearchGroup= this.PrescriptionRetSearchFrom();
  }

  mySearchForm:FormGroup;

  SearchFilterForm():FormGroup{
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
  

  public getPriscriptionretList(Param,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IPPrescriptionReturnListFromWard",Param)
  }

  public getPreiscriptionretdetList(Param,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IPPrescReturnItemDet",Param)
  }

  public getBatchList(Param,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_ItemNameBatchPOP_IPPresRet",Param)
  }

  public getItemlist(Param,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IPSalesReturnDrugForNursing",Param)
  }


  public presciptionreturnSave(emp,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("InPatient/InsertIPPrescriptionReturn",emp)
  }

  public getAdmittedPatientList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch", employee)
  }
  public getRegistrationList(employee)
{
  return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PatientRegistrationList",employee)
}  



public getIpPrescriptionreturnview(PresReId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("InPatient/view-IP_PrescriptionReturn?PresReId=" + PresReId);
}
}


 


 
 
 