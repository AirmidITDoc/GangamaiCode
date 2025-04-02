import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class SalesReturnBillSettlementService {

  userFormGroup: FormGroup;
 ItemSubform: FormGroup;

  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder,
    private _loaderService: LoaderService,
  ) { 
    this.userFormGroup = this.CreateUseFrom();
    this.ItemSubform = this.getItemSubform(); 
  }

  CreateUseFrom() {
    return this._formBuilder.group({
      RegID: [''],
      Op_ip_id: ['1'],
      advanceAmt:[''],
      comment:['']
    });
  }

  getItemSubform() {
    return this._formBuilder.group({
      RegID:'',
      PatientName: '',
      DoctorName: '',
      extAddress: '',
      MobileNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10),]],
      PatientType: ['IP'], 
      NetAmount:[0],
      PaidAmount:[0],
      BalanceAmount:[0]
    });
  }
  public getConcessionCombo()
  {
    return this._httpClient.post("Generic/GetByProc?procName=m_Retrieve_ConcessionReasonMasterForCombo", {});
  } 

  public getAdmittedpatientlist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }
  public getSalesList(Param ,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_Phar_Bill_List_Settlement",Param);
  }
  public getItemDetailList(Param){
    
    return this._httpClient.post("Generic/GetByProc?procName=Ret_PrescriptionDet",Param);
  }
  public getAdmittedPatientList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch", employee)
  }

  public getPatientVisitedListSearch(employee) {//m_Rtrv_PatientVisitedListSearch
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientVisitedListSearch", employee)
  }
  public InsertSalessettlement(emp, loader = true) {
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Pharmacy/PaymentSettlement", emp);
  }
  public BillDiscountAfter(emp, loader = true) {
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("InPatient/Update_PhBillDiscountAfter", emp);
  }
  public getDischargepatientlist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientDischargedListSearch ", employee)
  }
}
