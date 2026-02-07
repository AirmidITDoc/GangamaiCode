import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class SalesInPatientService { 
  SearchGroupForm : FormGroup;
  IPFinalform :FormGroup;
  constructor(
    public _formbuilder: UntypedFormBuilder,
    public _httpClient: HttpClient,
    private _loaderService: LoaderService,
    public _httpClient1:ApiCaller
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
      
      PatientType: ['1'],
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
     public InsertSalesInPatientCreditSales(employee,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
      return this._httpClient1.PostData("Sales/SaveSalesInpatient", employee)
    }

    
}
