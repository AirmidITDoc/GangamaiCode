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
      Email:'',
      PurchaseDate: [new Date()],
      DefRate:'',
      CGSTPer: [''],
      CGSTAmount: [''],
      SGSTPer: [''],
      SGSTAmount: [''],
      IGSTPer: [''],
      IGSTAmount: [''],
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
      CCName: [''],
      bccName: ['']
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
  public getSupplierSearchList(param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_SupplierName_list", param);
  }
  public getLoggedStoreList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional", Param);
  }
  public getPurchaseOrderDetail(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_ItemDetailsForPurchasepdate", Param);
  }
  public getItemList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ItemNameList_GRN", Param);
  }
  public getPurchaseOrder(Param) {
    return this._httpClient.post("Generic/GetDataSetByProc?procName=m_Rtrv_PurchaseOrderList_by_Name_Pagn", Param);
  }
  // m_Rtrv_PurchaseOrderList_by_Name m_Rtrv_PurchaseOrderList_by_Name_Pagn
  
  public getPurchaseItemList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PurchaseItemList", Param);
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

  public getSupplierRateList(data) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+data,  {});
  }

  // public PurchaseUpdate(Param) {
  //   return this._httpClient.post("Pharmacy/UpdatePurchaseOrder", Param)
  // }

  // public PurchaseInsert(Param) {
  //   return this._httpClient.post("Pharmacy/InsertPurchaseOrder", Param)
  // }
 

 public getPurchaseorderreportview(PurchaseID){
  return this._httpClient.get("Pharmacy/view-Purchaseorder?PurchaseID=" + PurchaseID);
 }
  
 

 public InsertWhatsappPurchaseorder(emp){
  return this._httpClient.post("WhatsappEmail/WhatsappSalesSave", emp);
}

public EmailSendInsert(emp){
  return this._httpClient.post("WhatsappEmail/EmailSave", emp);
}
  populateForm(employee) {
    // this.PurchaseStoreFrom.patchValue(employee);
  }
}

 