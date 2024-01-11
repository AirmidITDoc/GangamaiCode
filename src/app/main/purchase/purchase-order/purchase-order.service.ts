import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  userFormGroup: FormGroup;
  PurchaseSearchGroup: FormGroup;
  PurchaseOrderForm: FormGroup;
  FinalPurchaseform: FormGroup;
  PurchaseStoreform: FormGroup;
  StoreFormGroup:FormGroup;
  
  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) {
    this.userFormGroup = this.getPurchaseOrderForm();
    this.PurchaseSearchGroup = this.PurchaseSearchFrom();
    this.FinalPurchaseform = this.getPurchaseOrderFinalForm();
     this.StoreFormGroup=this.createStoreFrom();
  }

  PurchaseSearchFrom() {
    return this._formBuilder.group({
      StoreId: [''],
      ToStoreId: '',
      FromStoreId: '',
      SupplierId: '',
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      Status:['0']


      // ItemName:'',
    });
  }

  createStoreFrom() {
    return this._formBuilder.group({
      FromStoreId:[''],
    });
  }

  getPurchaseOrderForm() {
    return this._formBuilder.group({

      ItemName: [''],
      Qty: [''],
      UOM: [''],
      Rate: [''],
      TotalAmount: [''],
      Dis: [''],
      DiscAmount: [''],
      GSTPer: [''],
      GSTAmount: [''],
      NetAmount: [''],
      MRP: [''],
      Specification: [''],
      purchaseId: [''],
     // FromStoreId: [''],
      Status3: [''],
      SupplierId: [''],

    });

  }

  getPurchaseOrderFinalForm() {
    return this._formBuilder.group({

      TransportCharges: [''],
      HandlingCharges: [''],
      Freight: [''],
      Worrenty: [''],
      roundVal: [''],
      Remark: [''],
      PaymentMode: [''],
      PaymentTerm: [''],
    });

  }

  PurchaseOrder() {
    return this._formBuilder.group({

    });
  }

  public getPaymentTermList() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_termsofpaymentMaster", {});
  }
  public getModeOfPaymentList() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_modeofpaymentForcombo", {});
  }
  public getGSTtypeList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_Constants",Param);
  }
  public getSupplierSearchList() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SupplierName", {});
  }
  public getLoggedStoreList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional", Param);
  }
  public getPurchaseOrderDetail(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ItemDetailsForPurchasepdate", Param);
  }
  public getItemList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ItemNameList_GRN", Param);
  }







  public getPurchaseOrder(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PurchaseOrderList_by_Name", Param);
  }

  public getPurchaseItemList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PurchaseItemList", Param);
  }

  public getToStoreSearchList() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName", {});
  }

 

  public getFromStoreSearchList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional", Param);
  }

 

  public getItemNameList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveItemName_GRN", Param);
  }

  public InsertPurchaseSave(Param) {
    return this._httpClient.post("Pharmacy/InsertPurchaseOrder", Param)
  }

 
  public PurchaseUpdate(Param) {
    return this._httpClient.post("Pharmacy/UpdatePurchaseOrder", Param)
  }

  public PurchaseInsert(Param) {
    return this._httpClient.post("Pharmacy/InsertPurchaseOrder", Param)
  }
  public InsertPurchaseUpdate(Param) {
    return this._httpClient.post("Pharmacy/UpdatePurchaseOrder", Param)
  }


 
  public getPrintPurchaseOrdert(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=rptPrintPurchaseOrder", Param);
  }
  public getVerifyPurchaseOrdert(Param) {
    return this._httpClient.post("Pharmacy/VerifyPurchaseOrder", Param)
  }

  
  populateForm(employee) {
    // this.PurchaseStoreFrom.patchValue(employee);
  }
}


// Rtrv_Purchasedetail_BuPurchaseId