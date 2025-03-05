import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class PatientwiseMaterialConsumptionService {

  mySearchForm:FormGroup;
  registeredForm: FormGroup;
  
  constructor(public _httpClient: HttpClient,public _httpClient1: ApiCaller,
    public _formBuilder: UntypedFormBuilder) { 
      this.mySearchForm = this.SearchFilterForm();
      this.registeredForm = this.createMyForm();
    }

    SearchFilterForm():FormGroup{
        return this._formBuilder.group({
          startdate :[(new Date()).toISOString()],
          enddate :[(new Date()).toISOString()],
        })
    }

    createMyForm():FormGroup{
        return this._formBuilder.group({
            itemName:[],
            balqty: [],
            usedqty: [],
            remark: [],
            PatientType: ['OP'],
            OP_IP_Type: ['1'] ,
            RegID:[],
            IsHealthCard: false,
            startdate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
            consumption: false,
            HealthCardNo: false,
            MobileNo:[],
            PatientName:[],
            regRadio:['OP'],
            Remark:[],
            MRPTotalAmount:[],
            PurTotalAmount:[],
            LandedTotalAmount:[],
            storeId:[],

        })
    }
  
  // Get billing Service List 
  public getBillingServiceList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathRadServiceList", employee)
  }
  public getpatientwisematerialconsumptionList(employee) {
    // return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_Admtd_Ptnt_Dtls", employee)
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PatMaterialConsumption_ByName", employee)
  }

  public getStoreCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=rtrv_StoreMast_List_1", {})
  }

  public getDepartmentCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveDepartmentMasterForCombo", {})
  }

  public MaterialConsumptionSave(employee){
    return this._httpClient.post("InPatient/MaterialConsumption", employee);
  }

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }

  public deactivateTheStatus(m_data) {
    return this._httpClient1.PostData("PhoneApp", m_data);
  }
}
