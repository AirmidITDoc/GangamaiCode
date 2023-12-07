import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  myFormGroup:FormGroup;
  NewWorkForm:FormGroup
  WorkorderItemForm:FormGroup
  WorkorderFinalForm:FormGroup


  constructor(
    public _formBuilder:FormBuilder,
    public _httpClient:HttpClient
  ) 
  { this.myFormGroup=this.createMyFormGroup();
  this.NewWorkForm=this.createNewWorkForm()
  this.WorkorderItemForm=this.getWorOrderItemForm()
  this.WorkorderFinalForm=this.getPurchaseOrderFinalForm();
}

  createMyFormGroup(){
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      StoreId:'',
      SupplierName:''
    })
  }
  createNewWorkForm(){
    return this._formBuilder.group({
      StoreId:'',
      SupplierName:'',
      ItemName:'',
      ItemID:'',
      Qty:'',
      UnitRate:'',
      TotalAmount:'',
      Disc:'',
      DiscAmt:'',
      GST:'',
      GSTAmount:'',
      VatAmt:'',
      NetAmount:'',
      Specification:'',
      Remark:[''],
      FinalTotalAmt:'',
      FinalDiscAmt:'',
      FinalGSTAmt:'',
      FinalNetAmount:''
    })
  }

  
  getWorOrderItemForm() {
    return this._formBuilder.group({
      ItemName:'',
      ItemID:'',
      Qty:'',
      UnitRate:'',
      TotalAmount:'',
      Disc:'',
      DiscAmt:'',
      GST:'',
      GSTAmount:'',
      VatAmt:'',
      NetAmount:'',
      Specification:'',

    });

  }

  getPurchaseOrderFinalForm() {
    return this._formBuilder.group({
      FinalNetAmount:[''],
      VatAmount:[''],
      FinalTotalAmount:[''],
      GSTAmount:[''],
      FinalDiscAmount:[''],
      Remark:[''],
    });

  }

  initializeFormGroup() {
    this.createNewWorkForm();
}
 

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  public getSupplierList( ){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SupplierName", {});
  }
  public getWorkOrderList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_WorkOrderList_by_Name", Param);
  }
  public getItemlist(Param){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveItemMasterForCombo",Param)
  }
  
  public getItemList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemName_BalanceQty",Param);
  }

  public InsertWorkorderSave(Param){
    return this._httpClient.post("Pharmacy/InsertWorkorder", Param)
  }

  public WorkorderUpdate(Param){
    return this._httpClient.post("Pharmacy/updateWorkorder", Param)
  }
  populateForm(param) {
    this.NewWorkForm.patchValue(param);
}
}
