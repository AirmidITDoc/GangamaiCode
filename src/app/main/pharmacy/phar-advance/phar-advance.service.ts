import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

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
    public _httpClient1:ApiCaller,
    private _FormvalidationserviceService: FormvalidationserviceService,
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
      fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo: [''],
      FirstName: ['', [
        Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
      ]],
      LastName: ['', [
        Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
      ]],
      AdvanceNo: ['']
    });
   }
   CreaterNewAdvanceForm(){
    return this._formbuilder.group({
      RegID: [''],
      Op_ip_id: ['1'],
      advanceAmt:['',[this._FormvalidationserviceService.onlyNumberValidator(),Validators.minLength(1),
          this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
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
      comment:['',this._FormvalidationserviceService.allowEmptyStringValidatorOnly()],
      ToatalRefunfdAmt:['',[this._FormvalidationserviceService.AllowDecimalNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]], 
      BalanceAmount:['',this._FormvalidationserviceService.AllowDecimalNumberValidator()],
      advanceId:0
    });
   }
   
  public getAdvanceList(employee)
  {
    return this._httpClient1.PostData("Sales/PharAdvanceList",employee)
  }

   public getIPAdvanceList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_BrowseIPPharAdvanceReceipt", Param);
  }
  public getIPAdvanceRefList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_BrowseT_PhAdvRefundReceipt", Param);
  }
  public getRefundAdvanceList(Param) {
    return this._httpClient1.PostData("Sales/PhARefundOfAdvanceList", Param);
  }
  public getAdmittedpatientlist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }
  public getAdvanceOldList(data) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
  }
  public InsertIpPharmaAdvance(Param: any) {
    return this._httpClient1.PostData("Sales/PharmacyAdvanceInsert", Param)
  }
   public UpdateIpPharmaAdvance(Param: any) {
    if (Param.pharmacyHeader.advanceId) {
      // return this._httpClient1.PutData("Sales/PharmacyAdvanceUpdate/" + Param.pharmacyAdvance.advanceId, Param);
      return this._httpClient1.PutData("Sales/PharmacyAdvanceUpdate", Param);
    }
  }
  
  public InsertRefundOfAdv(data,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient1.PostData("Sales/PharmacyRefundInsert",data)
  }
  public getPreRefundofAdvance(data) {
    return this._httpClient1.PostData("Sales/GetRefundByAdvanceList",data)
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
