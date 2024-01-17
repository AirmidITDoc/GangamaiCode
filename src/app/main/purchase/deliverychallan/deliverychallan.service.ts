import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DeliverychallanService {
  GRNStoreForm: FormGroup;
  GRNFirstForm:FormGroup;
  userFormGroup: FormGroup;
  GRNSearchGroup :FormGroup;
  GRNForm:FormGroup;
  GRNFinalForm:FormGroup;
  

  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.GRNStoreForm = this.createStoreFrom();
    this.GRNFirstForm=this.getGRNfirstForm();
    this.userFormGroup = this.getGRNForm();
    this.GRNSearchGroup= this.GRNSearchFrom();  
    this.GRNFinalForm=this.getGrnFinalformForm();
   


  }
  createStoreFrom(){
    return this._formBuilder.group({
      StoreId:[''],
    })
  }
  getGRNfirstForm() {
    return this._formBuilder.group({
      SupplierId:[''],
      Contact:'',
      Mobile:'',
      InvoiceNo:[''],
      DateOfInvoice:[(new Date())],
      GateEntryNo:[''],
      GRNType:['true'],
      GSTType:[''],
      PaymentType:['true'],
      PaymentDate:[(new Date())]
 });
  }

  GRNSearchFrom() {
    return this._formBuilder.group({
      ToStoreId: '',
      FromStoreId:'',
      StoreId:'',
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


  
  getGRNForm() {
    return this._formBuilder.group({
      ItemName:[''],
      UOM:[''],
      HSNCode:[''],
      BatchNo:[''],
      ConversionFactor:[''],
      Qty:[''],
      ExpDate:[''],
      MRP:[''],
      FreeQty:[''],
      Rate:[''],
      TotalAmount:[''],
      Disc:[''],
      DisAmount:[''],
      GST:[''],
      GSTAmount:[''],
      CGST:[''],
      CGSTAmount:[''],
      SGST:[''],
      SGSTAmount:[''],
      IGST:[''],
      IGSTAmount:[''],
      NetAmount:[''],
      
      
    });
  }

  getGrnFinalformForm() {
    return this._formBuilder.group({
      Status3:[''],
      Remark:[''],
      ReceivedBy:[''],
      DebitAmount:[''],
      CreditAmount:['true'],
      DiscAmount:[''],
      TotalAmt:[''],
      VatAmount:[''],
      NetPayamt:[''],
      OtherCharges:[''],
      RoundingAmt:[''],
      // TotalAmount:[''],
      // Disc:[''],
      // DisAmount:[''],
      // GST:[''],
      // GSTAmount:[''],
      // CGST:[''],
      // CGSTAmount:[''],
      // SGST:[''],
      // SGSTAmount:[''],
      // IGST:[''],
      // IGSTAmount:[''],
      // NetAmount:[''],
      EwayBillNo:[""],
      EwalBillDate:[new Date()]
      
    });
  }

  public getLastThreeItemInfo(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_LastThreeItemInfo", Param);
  }
  public getGSTtypeList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_Constants",Param);
  }
  public getGRNList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_GRNList_by_Name",Param);
  }

  public getGrnItemList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_GrnItemList",Param);
  }

  public getGrnItemDetailList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ItemDetailsForGRNUpdate",Param);
  }


  public getToStoreSearchList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName",{});
  }

  public getFromStoreSearchList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  
  public getSupplierSearchList(){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_SupplierName_list",{});
  }

    public getItemNameList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveItemName_GRN", Param);
  }
  
  public GRNSave(Param){
    return this._httpClient.post("Pharmacy/InsertGRNDirect", Param);
  }

  public GRNEdit(Param){
    return this._httpClient.post("Pharmacy/updateGRN", Param);
  }
  
  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  public getPrintGRNList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=rptPrintGRN", Param);
  }
  public getVerifyGRN(Param) {
    return this._httpClient.post("Pharmacy/VerifyGRN", Param)
  } 

}

