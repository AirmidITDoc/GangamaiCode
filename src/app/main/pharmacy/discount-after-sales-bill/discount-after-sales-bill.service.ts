import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DiscountAfterSalesBillService {

  SearchGroupForm : FormGroup;
  IPFinalform :FormGroup;
  constructor(
    public _formbuilder: FormBuilder,
    public _httpClient: HttpClient
  ) {
    this.SearchGroupForm = this.CreaterSearchForm();
    this.IPFinalform= this.CreateaIpFinalform();
  }

  CreaterSearchForm() {
    return this._formbuilder.group({
      RegID: [''],
      Op_ip_id: ['1'],
      TypeodPay:['CashPay'],
      ItemName:'',
      ReturnQty:'',
      TotalQty:'', 
    });
  }
  CreateaIpFinalform() {
    return this._formbuilder.group({
      FinalNetAmount: '',
      FinalPaidAmt:'' ,
      FinalBalAmt:'',
      FinalDiscAmount:''
    });
  }
  public getAdmittedpatientlist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }
  public getSalesList(Param){ 
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_Phar_Bill_List_Settlement",Param);
  }
}
