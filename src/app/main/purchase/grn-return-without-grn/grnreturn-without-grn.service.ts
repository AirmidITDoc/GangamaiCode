import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GRNReturnWithoutGRNService {
  GRNReturnSearchFrom:UntypedFormGroup;
  NewGRNReturnFrom:UntypedFormGroup;
  GRNReturnStoreFrom:UntypedFormGroup;
  ReturnFinalForm:UntypedFormGroup;
  constructor(
    private _formBuilder: UntypedFormBuilder,
    public _httpClient:HttpClient
  )
   {
   this.GRNReturnSearchFrom = this.CreateReturnSearchForm();
   this.NewGRNReturnFrom = this.CreateNewGRNReturnForm();
   this.GRNReturnStoreFrom = this.CreateStoreForm();
   this.ReturnFinalForm = this.CreateFinalForm();
  }
  CreateReturnSearchForm() {
    return this._formBuilder.group({
      FromStoreId: '',
      SupplierId:[''],
      Status:['0'],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
  }
  CreateStoreForm() {
    return this._formBuilder.group({
      FromStoreId: '',
    });
  }
  CreateNewGRNReturnForm() {
    return this._formBuilder.group({
      FromStoreId: '',
      SupplierName:'',
      GSTType:['GST Return'],
      ReturnDate: [(new Date()).toISOString()],
      ItemName:[''],
      BatchNo:[''],
      ExpDates:[''],
      BalQty:[''],
      Qty:[''],
      Rate:[''],
      TotalAmount:[''],
      GST:[''],
      GSTAmount:[''],
      NetAmount:[''],
    });
  }
  CreateFinalForm() {
    return this._formBuilder.group({
      Remark: [''],
      FinalTotalAmt:[''],
      FinalDiscAmount:[''],
      FinalVatAmount:[''],
      FinalNetPayamt:[''],
      RoundingAmt:[''],
      BalQty:[''],
      Qty:[''],
      PurRate:[''],
      PurTotal:[''],
      GST:[''],
      GSTAmount:[''],
      NetAmount:[''],
    });
  }
  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }

    public getSupplierList(param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_SupplierName_list", param);
  }
  public getGRNReturnList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_GRNReturnList_by_Name",Param);
  }
  public getGRNReturnItemDetList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=getGRNReturnList",Param);
  }
  public getItemNameList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveItemName_GRN", Param);
  }
  public GRNReturnSave(Param){
    return this._httpClient.post("Pharmacy/InsertGRNReturn", Param);
  }
  public getVerifyGRNReturn(Param) {
    return this._httpClient.post("Pharmacy/VerifyGRNReturn", Param)
  }
  public getGRNreturnreportview(GRNReturnId) {
    return this._httpClient.get("Pharmacy/view-GRNReturnReport?GRNReturnId=" + GRNReturnId);
  }
  
}
