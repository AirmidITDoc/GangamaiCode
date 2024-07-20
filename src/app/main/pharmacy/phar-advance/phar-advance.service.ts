import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PharAdvanceService {
  SearchGroupForm : FormGroup;
  NewAdvanceForm : FormGroup;
  SearchRefundForm : FormGroup;
  NewRefundForm : FormGroup

  constructor(
    public _formbuilder:FormBuilder,
    public _httpClient:HttpClient
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
  public InsertIpPharmaAdvance(data) {
    return this._httpClient.post("Pharmacy/Insert_PhAdvance",data)
  }
  public UpdateIpPharmaAdvance(data) {
    return this._httpClient.post("Pharmacy/Update_PhAdvance",data)
  }
  public InsertRefundOfAdv(data) {
    return this._httpClient.post("/api/Pharmacy/InsertPharRefundofAdvance",data)
  }
}
