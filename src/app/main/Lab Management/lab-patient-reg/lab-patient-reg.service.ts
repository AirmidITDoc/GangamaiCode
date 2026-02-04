import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { first } from 'lodash';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabPatientRegService {
  myFilterform: FormGroup;
  MyForm: FormGroup;

  constructor(
    public _frombuilder: UntypedFormBuilder,
    public _httpClient: ApiCaller,
    private accountService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  CreateSearchGroup() {
    return this._frombuilder.group({
      fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      FirstName: [''],
      LastName: [''],
      PBillNo: [''],
      DoctorID: [''],
      UnitId: [this.accountService.currentUserValue.user.unitId]
    })
  }

  createAbhadetailForm() {
    return this._frombuilder.group({
      hipCode: ['', this._FormvalidationserviceService.onlyNumberValidator()],
      abhaAddress: ['', this._FormvalidationserviceService.allowEmptyStringValidator()],
      abhaNumber: ['', this._FormvalidationserviceService.onlyNumberValidator()],
      fullName: ['', this._FormvalidationserviceService.allowEmptyStringValidator()],
      token: [''],
      nameFormat: ['F_M_L']
    });
  }

  public getDoctorsByDepartment(deptId) {
    return this._httpClient.GetData("VisitDetail/DeptDoctorList?DeptId=" + deptId)
  }
  public getexecByCompany(compId) {
    return this._httpClient.GetData("CompanyMaster/CompanyRepresentativeList?CompanyId=" + compId)
  }
  public getstateId(Id) {
    return this._httpClient.GetData("StateMaster/" + Id);
  }
  public getLabRegistraionById(Id) {
    return this._httpClient.GetData("LabPatientRegistration/" + Id);
  }
  public getCompanyById(Id) {
    return this._httpClient.GetData("CompanyMaster/" + Id);
  }
  public getLabRegistraionMasterById(Id) {
    return this._httpClient.GetData("LabPatientRegistration/GetLabPatientRegisteredMaster?id=" + Id);
  }
  public getserviceList(param) {
    return this._httpClient.PostData("PathlogySampleCollection/PathRadServiceList", param);
  }

  public labPatientSave(Param: any) {
    if (Param.LabPatRegId) {
      return this._httpClient.PutData("LabPatientRegistration/Edit/" + Param.LabPatRegId, Param);
    }
  }

  public InsertIPBillingCredit(employee, loader = true) {

    return this._httpClient.PostData("IPBill/IPBilllCreditInsert", employee)
  }
  public InsertIPDraftBilling(e, loader = true) {

    return this._httpClient.PostData("IPBill/InsertIPDraftBill", e)
  }
  public InsertIPBilling(employee, loader = true) {

    return this._httpClient.PostData("IPBill/IPBilllwithCashCounterInsert", employee)
  }

  public InsertlabregCredit(param) {
    return this._httpClient.PostData("LabPatientRegistration/PatientRegistrationcreditbill", param)
  }
  public InsertLabRegBilling(param) {
    // debugger
    return this._httpClient.PostData("LabPatientRegistration/PatientRegistrationPaidBill", param)
  }
  public InsertLabBillingsettlement(param) {
    return this._httpClient.PostData("OPSettlement/InsertSettlement", param)
  }

  public getReportView(Param) {
    return this._httpClient.PostData("Report/ViewReport", Param);
  }
  public getlabSuggestions(apiUrl: string, inputValue: string): Observable<any[]> {
    // debugger
    return this._httpClient.GetData(apiUrl + inputValue);
  }
  public getMaster(mode, Id) {
    return this._httpClient.GetData("Dropdown/GetBindDropDown?mode=" + mode + "&Id=" + Id);
  }
  public LabBillDiscountAfter(employee) {
    return this._httpClient.PostData("IPBill/BillDiscountAfter", employee);
  }
  public InsertOPRefundBilling(Param) {
    return this._httpClient.PostData("RefundOfBill/InsertOPRefundOfBill", Param);
  }
  public getRefundofBillServiceList(employee) {
    return this._httpClient.PostData("RefundOfBill/OPBillservicedetailList", employee);
  }

  public InsertEstimate(employee) {
    return this._httpClient.PostData("Estimate/Insert", employee);
  }
  public LastCreditList(Param) {
    return this._httpClient.PostData("Common", Param);
  }
  public getRtevPackageDetList(param) {
    return this._httpClient.PostData("BillingService/PackageDetailList", param);
  }

  public getSuggestions(apiUrl: string, inputValue: string): Observable<any[]> {
    debugger
    return this._httpClient.GetData(apiUrl + inputValue);
}

public getRegistraionById(Id) {
  return this._httpClient.GetData("LabPatientRegistration/" + Id);
}
}
