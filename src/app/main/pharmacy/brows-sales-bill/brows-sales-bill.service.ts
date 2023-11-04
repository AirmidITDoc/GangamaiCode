import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BrowsSalesBillService {

  userForm: FormGroup;
   formReturn :FormGroup;


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { this.userForm=this.SearchFilter();
      this.formReturn=this.SearchFilterReturn();  }

  SearchFilter():FormGroup{
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo:'',
      F_Name:'',                                           
      L_Name: '',                                                      
      SalesNo : '',
      OP_IP_Type:['1'],
      StoreId :'',
       IPNo :''

    })
  }
  SearchFilterReturn():FormGroup{
    return this._formBuilder.group({
      startdate1: [(new Date()).toISOString()],
      enddate1: [(new Date()).toISOString()],
      RegNo:'',
      F_Name:'',                                           
      L_Name: '',                                                      
      SalesNo : '',
      OP_IP_Types:['2'],
      StoreId :''

    })
  }

 
  
 
  public getStoreFromList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName",{});
  }


  public getSalesList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_SalesBillList",Param);
  }

  public getSalesDetList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_SalesDetails",Param);
  }
  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }

  public getSalesReturnList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_SalesReturnBillList", Param);
  }
  public getSalesReturnDetList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_SalesReturnDetails", Param);
  }

  public InsertSalessettlement(emp){
    return this._httpClient.post("Pharmacy/PaymentSettlement", emp);
  }
  
  
}
