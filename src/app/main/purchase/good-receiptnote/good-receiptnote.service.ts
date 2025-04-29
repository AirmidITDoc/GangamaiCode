import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class GoodReceiptnoteService {
  GRNStoreForm: FormGroup;
  GRNFirstForm: FormGroup;
  userFormGroup: FormGroup;
  GRNSearchGroup: FormGroup;
  GRNFinalForm: FormGroup;
  POFrom: FormGroup;
  GRNEmailFrom: FormGroup;

  constructor(
    public _httpClient: HttpClient,
    private _loaderService: LoaderService,
    private _formBuilder: UntypedFormBuilder,
    public _httpClient1:ApiCaller
  ) {
    this.GRNStoreForm = this.createStoreFrom();
    // this.GRNFirstForm=this.getGRNfirstForm();
    this.userFormGroup = this.getGRNForm();
    this.GRNSearchGroup = this.GRNSearchFrom();
    this.GRNFinalForm = this.getGrnFinalformForm();
    this.POFrom = this.CreatePOFrom();
    this.GRNEmailFrom = this.createGRNEmailFrom();

  }
  createStoreFrom() {
    return this._formBuilder.group({
      StoreId: [''],
    })
  }
  //   getGRNfirstForm() {
  //     return this._formBuilder.group({
  //       SupplierId:[''],
  //       Contact:'',
  //       Mobile:'',
  //       InvoiceNo:[''],
  //       DateOfInvoice:[new Date()],
  //       GateEntryNo:[''],
  //       GRNType:['true'],
  //       GSTType:[''],
  //       PaymentType:['true'],
  //       PaymentDate:[new Date()]
  //  });
  //   }

  GRNSearchFrom() {
    return this._formBuilder.group({
      ToStoreId: [2], 
      SupplierId: '',
      Status: 0,
      Status1: [0],
      Status2: [true],
      Status3: 0,
      Verify: 0,
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],

    });
  }
  getGRNForm() {
    return this._formBuilder.group({
      PurchaseId: [''],
      poBalQty: [''],
      itemName: ['', [Validators.required]],
      uomId: [''],
      HSNCode: [''],
      batchNo: ['', [Validators.required]],
      conversionFactor: [''],
      receiveQty: [1, [Validators.required,]],
      ExpDate: [''],
      mrp: [0, [Validators.required]],
      freeQty: [0],
      rate: [0, [Validators.required]],
      totalAmount: [0],
      discPercentage: [0],
      Disc2: [0],
      DisAmount: [0],
      DisAmount2: [0],
      GST: [0],
      GSTAmount: [0],
      CGST: [0],
      CGSTAmount: [0],
      SGST: [0],
      SGSTAmount: [0],
      IGST: [0],
      IGSTAmount: [0],
      NetAmount: [0],
      SupplierId: [''],
      Contact: [''],
      Mobile: [''],
      InvoiceNo: [''],
      DateOfInvoice: [new Date()],
      GateEntryNo: [''], 
      GSTType: ['2'], 
      PaymentDate: [new Date()],
      GRNType1:['1'], 
      PaymentType1:['0'],
      StoreId:['2']
    });
  }

  getGrnFinalformForm() {
    return this._formBuilder.group({
      Status3: [''],
      Remark: [''],
      ReceivedBy: ['',Validators.required],
      DebitAmount: [''],
      CreditAmount: [''],
      DiscAmount: [''],
      TotalAmt: ['',Validators.required],
      VatAmount: [''],
      NetPayamt: ['',Validators.required],
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
  createGRNEmailFrom() {
    return this._formBuilder.group({
      ToMailId: [''],
      Subject: [''],
      Body: [''],
    })
  }
  public getLastThreeItemInfo(ID) {
    return this._httpClient1.GetData("GRN/"+ID);
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

  public GRNSave(Param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient1.PostData("GRN/Insert", Param);
  }
  public POtoGRNSave(Param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("Pharmacy/InsertGRNPurchase", Param);
  }
  public POtoGRNUpated(Param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("Pharmacy/UpdateGRNPurchase", Param);
  }

  public GRNEdit(Param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("Pharmacy/updateGRN", Param);
  }
  public getGRNrtrvItemlist(Param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient1.PostData("GRN/GRNUpdateList", Param);
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
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + data, {});
  }

  public getSupplierdetails(Id) { 
    return this._httpClient1.GetData("Supplier/" + Id);
  }
}
