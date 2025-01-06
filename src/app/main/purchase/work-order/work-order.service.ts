import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  myFormGroup:UntypedFormGroup;
  NewWorkForm:UntypedFormGroup
  WorkorderItemForm:UntypedFormGroup
  WorkorderFinalForm:UntypedFormGroup;
  WorkOrderStoreForm:UntypedFormGroup;


  constructor(
    public _formBuilder:UntypedFormBuilder,
    public _httpClient:HttpClient
  ) 
  { this.WorkOrderStoreForm = this.createStoreFrom();
    this.myFormGroup=this.createMyFormGroup();
  this.NewWorkForm=this.createNewWorkForm()
  this.WorkorderItemForm=this.getWorOrderItemForm()
  this.WorkorderFinalForm=this.getWorkOrderFinalForm();
}
createStoreFrom() {
  return this._formBuilder.group({
    StoreId: [''],
  })
}
  createMyFormGroup(){
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      StoreId:'',
      SupplierName:'',
      Id:'',
    })
  }
  createNewWorkForm(){
    return this._formBuilder.group({
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
      SupplierName:'',
      GSTType:'',
      WorkId:'',
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

  getWorkOrderFinalForm() {
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
 
public getWorkOrderPrint(Param){
  return this._httpClient.post("Generic/GetByProc?procName=rptWorkOrderPrint", Param);
}


public getWorkorderreportview(WOID){
  return this._httpClient.get("Pharmacy/view-Workorder?WOID="+WOID);
 }
  


  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  public getSupplierList(param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_SupplierName_list", param);
  }
  public getGSTtypeList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_Constants",Param);
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

  public getItemListUpdates(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ItemDetailsForWorkOrderUpdate",Param);
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
