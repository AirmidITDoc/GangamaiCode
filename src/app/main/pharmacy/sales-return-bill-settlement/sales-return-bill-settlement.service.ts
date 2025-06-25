import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class SalesReturnBillSettlementService { 
  constructor(
    public _httpClient: HttpClient, public _httpClient1: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _loaderService: LoaderService,
  ) {}  
  public getRegistraionById(Id) {
        return this._httpClient1.GetData("OutPatient/" + Id);
    }

  public getConcessionCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ConcessionReasonMasterForCombo", {});
  }

  public getAdmittedpatientlist(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }
 
  public getItemDetailList(Param) {

    return this._httpClient.post("Generic/GetByProc?procName=Ret_PrescriptionDet", Param);
  }
  public getAdmittedPatientList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch", employee)
  }

  public getPatientVisitedListSearch(employee) {//m_Rtrv_PatientVisitedListSearch
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientVisitedListSearch", employee)
  }
  public InsertSalessettlement(emp) { 
    return this._httpClient1.PostData("Sales/PaymentSettlement", emp);
  }
}
