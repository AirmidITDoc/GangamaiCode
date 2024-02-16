import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  userFormGroup: FormGroup;
  PurchaseSearchGroup: FormGroup;
  FinalPurchaseform: FormGroup;
  StoreFormGroup:FormGroup;
  POEmailFrom : FormGroup;
  //PurchaseOrderHeader:FormGroup;
  
  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) {
    this.userFormGroup = this.getPurchaseOrderForm();
    this.PurchaseSearchGroup = this.PurchaseSearchFrom();
    this.FinalPurchaseform = this.getPurchaseOrderFinalForm();
     this.StoreFormGroup=this.createStoreFrom();
     this.POEmailFrom = this.createPOEmailFrom();
    // this.PurchaseOrderHeader=this.createHeaderFrom();
  }

  PurchaseSearchFrom() {
    return this._formBuilder.group({
      StoreId: [''],
      ToStoreId: '',
      FromStoreId: '',
      SupplierId: '',
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      Status:['0'],
    });
  }

  createStoreFrom() {
    return this._formBuilder.group({
      StoreId:['']
    });
  }
  // createHeaderFrom(){
  //   return this._formBuilder.group({
  //     Status3: [''],
  //     SupplierId: [''],
  //     SupplierID:'',
  //     Address:'',
  //     Mobile:'',
  //     Contact:'',
  //     GSTNo:'',
  //     Email:''
  //   })
  // }

  getPurchaseOrderForm() {
    return this._formBuilder.group({

      ItemName: [''],
      ConversionFactor: [''],
      Qty: [''],
      UOM: [''],
      Rate: [''],
      TotalAmount: [''],
      HSNcode:'',
      Dis: [''],
      DiscAmount: [''],
      GSTPer: [''],
      GSTAmount: [''],
      NetAmount: [''],
      MRP: [''],
      Specification: [''],
      purchaseId: [''],
      Status3: [''],
      SupplierId: [''],
      SupplierID:'',
      Address:'',
      Mobile:'',
      Contact:'',
      GSTNo:'',
      Email:''
      
    });

  }

  getPurchaseOrderFinalForm() {
    return this._formBuilder.group({

      TransportCharges: [''],
      HandlingCharges: [''],
      Freight: [''],
      OctriAmount:[''],
      Worrenty: [''],
      roundVal: [''],
      Remark: [''],
      PaymentMode: [''],
      PaymentTerm: [''],
      
    });
  }
  createPOEmailFrom(){
    return this._formBuilder.group({
      ToMailId: [''],
      Subject: [''],
      Body: [''],
    })
  }

  PurchaseOrder() {
    return this._formBuilder.group({

    });
  }
  public getLastThreeItemInfo(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_LastThreeItemInfo", Param);
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
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_SupplierName_list", {});
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
  public getFromStoreSearchList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional", Param);
  }
  public InsertPurchaseSave(Param) {
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
  
  public getItemNameList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveItemName_GRN", Param);
  }




  // public getToStoreSearchList() {
  //   return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName", {});
  // }

  // public PurchaseUpdate(Param) {
  //   return this._httpClient.post("Pharmacy/UpdatePurchaseOrder", Param)
  // }

  // public PurchaseInsert(Param) {
  //   return this._httpClient.post("Pharmacy/InsertPurchaseOrder", Param)
  // }
 


 


  
  populateForm(employee) {
    // this.PurchaseStoreFrom.patchValue(employee);
  }
}

 