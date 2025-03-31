import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionReturnService {
  PrecReturnSearchGroup :FormGroup;
  constructor(
    public _httpClient:HttpClient,   public _httpClient1:ApiCaller,
    private _FormBuilder:UntypedFormBuilder
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
  
// new dropdown
public getRegistraionById(Id) {
  return this._httpClient1.GetData("OutPatient/" + Id);
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

  public getBatchList1(param: any) {
    const apiUrl = `ItemMaster/GetItemListForSalesBatchPop?StoreId=${param.StoreId}&ItemId=${param.ItemId}`;
    return this._httpClient1.GetData(apiUrl);
  }
  

  // public getItemlist(Param){
  //   return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IPDrugName",Param)
  // }


  public presciptionreturnSave(emp){
   
    return this._httpClient1.PostData("IPPrescription/PrescriptionReturnInsert",emp)    
    
  }

  public presciptionreturnUpdate(emp){
   return this._httpClient1.PutData("Nursing/PrescriptionReturnUpdate",emp)
  }

  public getAdmittedpatientlist(id){
    
    return this._httpClient1.GetData("Admission/" + id);
  }
  public getVisitById(Id) {
    return this._httpClient1.GetData("VisitDetail/" + Id);
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
  public getReportView(Param) {
    return this._httpClient1.PostData("Report/ViewReport", Param);
  }
}


 


 
 
 