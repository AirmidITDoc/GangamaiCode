import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

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
    public _httpClient1:ApiCaller,
    public _FormvalidationserviceService:FormvalidationserviceService
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
      ToStoreId: ['2',[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]], 
      SupplierId: '', 
      Status1: [0],   
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],

    });
  }
  getGRNForm() {
    return this._formBuilder.group({
      PurchaseId: [''],
      poBalQty: [''],
      ItemName: ['', [Validators.required]],
       UOMId: ['',], 
      HSNCode: ['',[Validators.required]],
      BatchNo: ['', [Validators.required]],
      ConversionFactor: ['',[Validators.required, Validators.min(1)]],
      Qty: ['', [Validators.required, Validators.min(1),Validators.max(9)]],
      ExpDate: ['',[Validators.required]],
      MRP: ['', [Validators.required, Validators.min(1)]],
      FreeQty: [0],
      Rate: ['',  [Validators.required, Validators.min(1)]],
      TotalAmount: [0, [Validators.required, Validators.min(1)]],
      Disc: [0, [Validators.min(0),Validators.max(100)]],
      Disc2:  [0, [Validators.min(0),Validators.max(100)]],
      DisAmount: [0],
      DisAmount2: [0],
      GST: [0],
      GSTAmount: [0],
      CGST:[0, [Validators.min(0),Validators.max(100)]],
      CGSTAmount: [0],
      SGST: [0, [Validators.min(0),Validators.max(100)]],
      SGSTAmount: [0],
      IGST:[0, [Validators.min(0),Validators.max(100)]],
      IGSTAmount: [0],
      NetAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]],
      SupplierId: ['', [Validators.required]],
      Contact:  ['', [Validators.required]],
      Mobile: [''],
      InvoiceNo: ['',Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)],
      DateOfInvoice: [new Date()],
      GateEntryNo: [''], 
      GSTType: [16,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]], // 16 is a value of first GST Type   
      PaymentDate: [new Date()],
      GRNType:['true'], 
      PaymentType:['false'],
      StoreId:['2',[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]]
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
      TotalAmt: ['', [Validators.required, Validators.min(1)]],
      VatAmount: [''],
      NetPayamt: ['', [Validators.required, Validators.min(1)]],
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
    return this._httpClient1.PostData("Purchase/LastThreeItemList",ID);
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
  public GRNEdit(employee,Id, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
  return this._httpClient1.PutData("GRN/Edit/"+Id,employee) 
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
    return this._httpClient1.PostData("GRN/Verify", Param)
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
