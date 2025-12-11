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

  public getDoctorsByDepartment(deptId) {
    return this._httpClient.GetData("VisitDetail/DeptDoctorList?DeptId=" + deptId)
  }
  public getstateId(Id) {
    return this._httpClient.GetData("StateMaster/" + Id);
  }
  public getLabRegistraionById(Id) {
    return this._httpClient.GetData("LabPatientRegistration/" + Id);
  }
  public getserviceList(param) {
    return this._httpClient.PostData("PathlogySampleCollection/PathRadServiceList", param);
  }


  public labPatientSave(Param: any) {
    if (Param.labPatientId) {
      return this._httpClient.PutData("LabPatientRegistration/Edit/" + Param.labPatientId, Param);
    } else return this._httpClient.PostData("LabPatientRegistration/Insert", Param);
  }

  public LabRequestSave(employee) {
    return this._httpClient.PostData("IPPrescription/LabRequestInsert", employee);
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
}
