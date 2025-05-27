import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class SalesReturnBillSettlementService {

  userFormGroup: FormGroup;
  ItemSubform: FormGroup;

  constructor(
    public _httpClient: HttpClient, public _httpClient1: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _loaderService: LoaderService,
  ) {
    // this.userFormGroup = this.CreateUseFrom();
    // this.ItemSubform = this.getItemSubform();
  }

  CreateUseFrom() {
    return this._formBuilder.group({
      RegID: [''],
      PatientType: ['OP'],
      DoctorName: '',
      PatientName: '',
      extAddress: '',
      advanceAmt: [''],
      comment: [''],
      MobileNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10),]],
    });
  }

  getItemSubform() {
    return this._formBuilder.group({
      RegID: '',
      PatientName: '',
      DoctorName: '',
      extAddress: '',
      MobileNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10),]],
      PatientType: ['IP'],
    });
  }

  public getRegistraionById(Id) {
        return this._httpClient1.GetData("OutPatient/" + Id);
    }

  public getConcessionCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ConcessionReasonMasterForCombo", {});
  }

  public getAdmittedpatientlist(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }
  public getSalesList(Param) {
  
    return this._httpClient1.PostData("Sales/PharSalesSettlemet", Param);
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
  
    return this._httpClient.post("Pharmacy/PaymentSettlement", emp);
  }
}
