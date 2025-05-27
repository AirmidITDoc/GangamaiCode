import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class PharAdvanceService {
  SearchGroupForm : FormGroup;
  NewAdvanceForm : FormGroup;
  SearchRefundForm : FormGroup;
  NewRefundForm : FormGroup

  constructor(
    public _formbuilder:UntypedFormBuilder,
    public _httpClient:HttpClient,
    private _loaderService: LoaderService
  )
   { 
    this.SearchGroupForm = this.CreaterSearchForm();
    this.NewAdvanceForm = this.CreaterNewAdvanceForm();
    this.SearchRefundForm = this.CreaterSearchRefundForm();
    this.NewRefundForm = this.CreaterNewRefundForm();
   }
   
   CreaterSearchForm(){
    return this._formbuilder.group({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      RegNo: [''],
      F_Name: [''],
      L_Name: [''],
      AdvanceNo: ['']
    });
   }
   CreaterNewAdvanceForm(){
    return this._formbuilder.group({
      RegID: [''],
      Op_ip_id: ['1'],
      advanceAmt:[''],
      comment:['']
    });
   }
   CreaterSearchRefundForm(){
    return  this._formbuilder.group({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      RegNo: [''],
      F_Name: ['',[
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      L_Name: ['',[
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      AdvanceNo: ['']
    });
   }
   CreaterNewRefundForm(){
    return this._formbuilder.group({
      RegID: [''],
      Op_ip_id: ['1'],
      advanceAmt:[''],
      comment:[''],
      ToatalRefunfdAmt:[''], 
      BalanceAmount:[''],
    });
   }

   public getIPAdvanceList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_BrowseIPPharAdvanceReceipt", Param);
  }
  public getIPAdvanceRefList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_BrowseT_PhAdvRefundReceipt", Param);
  }
  public getRefundAdvanceList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_Phar_RefundOfAdvance", Param);
  }
  public getAdmittedpatientlist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }
  public getAdvanceList(employee)
  {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_Phar_AdvanceList",employee)
  }
  public getAdvanceOldList(data) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
  }
  public InsertIpPharmaAdvance(data,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Pharmacy/Insert_PhAdvance",data)
  }
  public UpdateIpPharmaAdvance(data,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Pharmacy/Update_PhAdvance",data)
  }
  public InsertRefundOfAdv(data,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Pharmacy/InsertPharRefundofAdvance",data)
  }
  public getPreRefundofAdvance(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  }

  public getViewPahrmaAdvanceReceipt(AdvanceDetailID){
    return this._httpClient.get("Pharmacy/view-IP-PharmaAdvanceReceipt?AdvanceDetailID=" + AdvanceDetailID);
  }

  public getViewPahrmaRefundAdvanceReceipt(RefundId,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("Pharmacy/view-IP-PharmaAdvanceReturnReceipt?RefundId=" + RefundId);
  }

  
}
