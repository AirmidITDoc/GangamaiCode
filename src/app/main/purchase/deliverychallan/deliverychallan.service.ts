import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DeliverychallanService {
  DeliveryStoreForm: UntypedFormGroup;
  userFormGroup: UntypedFormGroup;
  DeliverySearchGroup :UntypedFormGroup;
  DeliveryFinalForm:UntypedFormGroup;
  DeliveryEmailFrom:UntypedFormGroup;
  POFrom:UntypedFormGroup;
  

  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: UntypedFormBuilder
  ) { 
    this.DeliverySearchGroup= this.DeliverySearchFrom();  
    this.DeliveryStoreForm = this.createStoreFrom();
    this.userFormGroup = this.getDeliveryForm();
    this.DeliveryFinalForm=this.getDeliveryFinalformForm();
    this.DeliveryEmailFrom = this.createDeliveryEmailFrom();
    this.POFrom = this.CreatePOFrom();

  }
  DeliverySearchFrom() {
    return this._formBuilder.group({
      ToStoreId: '',
     // FromStoreId:'',
     // StoreId:'',
      SupplierId:'',
      Status:0,
      Status1:['0'],
      Status2:[true],
      Status3:0,
      Verify:0,
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
    });
  }

  createStoreFrom(){
    return this._formBuilder.group({
      StoreId:[''],
    })
  }
  getDeliveryForm() {
    return this._formBuilder.group({
      PurchaseId: [''],
      poBalQty: [''],
      ItemName: [''],
      UOM: [''],
      HSNCode: [''],
      BatchNo: [''],
      ConversionFactor: [''],
      Qty: [''],
      ExpDatess: [''],
      MRP: [''],
      FreeQty: [''],
      Rate: [''],
      TotalAmount: [''],
      Disc: [''],
      Disc2: [''],
      DisAmount: [''],
      DisAmount2: [''],
      GST: [''],
      GSTAmount: [''],
      CGST: [''],
      CGSTAmount: [''],
      SGST: [''],
      SGSTAmount: [''],
      IGST: [''],
      IGSTAmount: [''],
      NetAmount: [''],
      SupplierId: [''],
      Contact: '',
      Mobile: '',
      InvoiceNo: [''],
      DateOfInvoice: [new Date()],
      GateEntryNo: [''],
      GRNType: ['1'],
      GSTType: [''],
      PaymentType: ['0'],
      PaymentDate: [new Date()]
    });
  }

  getDeliveryFinalformForm() {
    return this._formBuilder.group({
      Status3: [''],
      Remark: [''],
      ReceivedBy: [''],
      DebitAmount: [''],
      CreditAmount: [''],
      DiscAmount: [''],
      TotalAmt: [''],
      VatAmount: [''],
      NetPayamt: [''],
      OtherCharge: [''],
      RoundingAmt: [''],
      EwayBillNo: [""],
      EwalBillDate: [new Date()],
      DiscAmount2: ['']
    });
  }
  CreatePOFrom() {
    return this._formBuilder.group({
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      StoreId: [''],
      SupplierId: [''],
      Status: ['0'],
      Verify: 0,
    })
  }
  createDeliveryEmailFrom() {
    return this._formBuilder.group({
      ToMailId: [''],
      Subject: [''],
      Body: [''],
    })
  }
  public getLastThreeItemInfo(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_LastThreeItemInfo", Param);
  }
  public getGSTtypeList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_Constants", Param);
  }
  public getDirectPOList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_DirectPOList_by_Name", Param);
  }
  public getPurchaseItemList(Param) { //Rtrv_ItemList_by_Supplier_Name
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_ItemList_by_Supplier_Name", Param);
  }
  public getGRNList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_GRNList_by_Name", Param);
  }
  public getGrnItemList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_GrnItemList", Param);
  }
  public getGrnItemDetailList(Param) {//Rtrv_ItemDetailsForGRNUpdate //m_Rtrvv_ItemDetailsForGRNUpdate
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_ItemDetailsForGRNUpdate", Param);
  }
  public getToStoreSearchList() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName", {});
  }
  public getFromStoreSearchList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional", Param);
  }
  public getSupplierSearchList(param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_SupplierName_list", param);
  }
  public getItemNameList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveItemName_GRN", Param);
  }
  public GRNSave(Param) {
    return this._httpClient.post("Pharmacy/InsertGRNDirect", Param);
  }
  public POtoGRNSave(Param) {
    return this._httpClient.post("Pharmacy/InsertGRNPurchase", Param);
  }
  public POtoGRNUpated(Param) {
    return this._httpClient.post("Pharmacy/UpdateGRNPurchase", Param);
  }
  public GRNEdit(Param) {
    return this._httpClient.post("Pharmacy/updateGRN", Param);
  }
  public getLoggedStoreList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional", Param);
  }
  public getPrintGRNList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=rptPrintGRN", Param);
  }
  public getVerifyGRN(Param) {
    return this._httpClient.post("Pharmacy/VerifyGRN", Param)
  }
  public getGRNreportview(GRNID) {
    return this._httpClient.get("Pharmacy/view-GRNReport?GRNID=" + GRNID);
  }
  public InsertWhatsappGRN(emp) {
    return this._httpClient.post("WhatsappEmail/WhatsappSalesSave", emp);
  }
  public getPdfGRN(GRNID) {
    return this._httpClient.get("Pharmacy/view-GRNReport?GRNID=" + GRNID);
  }
  public getCheckInvoiceNo(data) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+data,  {});
  }
}

