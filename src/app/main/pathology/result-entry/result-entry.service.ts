import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class ResultEntryService {
  myformSearch: FormGroup;

  myform: FormGroup;
  constructor(
    private _httpClient: HttpClient,
    private _httpClient1: ApiCaller, private accountService: AuthenticationService, private _FormvalidationserviceService: FormvalidationserviceService,
    private _formBuilder: UntypedFormBuilder) {
    this.myformSearch = this.createSearchForm();
    this.myform = this.createtemplateForm();
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      RegNoSearch: [],
      FirstNameSearch: ['', [
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z () ]*$')
      ]],
      LastNameSearch: ['', [
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z () ]*$')
      ]],

      PatientTypeSearch: ['3'],
      StatusSearch: ['1'],
      CategoryId: [''],
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      TestStatusSearch: ['1'],
      UnitId: [this.accountService.currentUserValue.user.unitId]
    });
  }

  createtemplateForm(): FormGroup {
    return this._formBuilder.group({
      TemplateId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      TemplateName: [''],
      TemplateDesc: [''],
      IsDeleted: ['false'],
      AddedBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      UpdatedBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      AddedByName: ['']
    });
  }

  // m_Rtrv_PathPatientList_Ptnt_Dtls
  public getPatientList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PathPatientList_Ptnt_Dtls", employee)
  }

  public getPathologyResultList(employee) {
    return this._httpClient1.PostData("Common", employee);
  }
  public getHelpresultData(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + query, {})
  }
  public PathResultentryInsert(employee) {
    return this._httpClient1.PostData("Pathology/InsertResultEntry", employee);
  }
  public PathResultentryDetailList(employee) {
    return this._httpClient1.PostData("Pathology/PathologyTestList", employee);
  }

  public PathReportverifyMaster(employee) {
    return this._httpClient1.PostData("Pathology/Verify", employee);
  }
  // pathologyOutsourceUpdate
  public updatePathReportOutscourceMaster(employee) {
    return this._httpClient1.PostData("Pathology/Edit/Id" + employee.pathReportId, employee);
  }

  public updatelabourMaster(employee) {
    return this._httpClient1.PutData("Pathology/pathologyOutsourceUpdate/" + employee.pathReportId, employee);
  }

  public getPathologyDoctorCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PathologistDoctorMasterForCombo", {})
  }

  public getDoctorMaster1Combo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }


  public getPathologyResultListforIP(param) {
    return this._httpClient1.PostData("Common", param)
  }

  public getPathologyResultListforOP(param) {
    return this._httpClient1.PostData("Common", param)
  }

  public getPathologyResultListforLab(param) {
    return this._httpClient1.PostData("Common", param)
  }


  // public getPathologyTemplateforIP(query){
  //   return this._httpClient.post("Generic/GetBySelectQuery?query=" + query, {})

  // }
  // public getPathologyTemplateforOP(query){
  //   return this._httpClient.post("Generic/GetBySelectQuery?query=" + query, {})

  // }

  public getPathTemplatePrint(No) {
    return this._httpClient.post("Generic/GetByProc?procName=rptPrintPathologyReportTemplate", No)
  }
  public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + query, {})
  }

  public getSampleList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PathResultEntryList_Test_Dtls", employee)
  }

  // public getInsertStatementQuery(query) {
  //   return this._httpClient.post("Generic/ExecByQueryStatement?query=" + query, {})
  // }

  getPathologyPrint(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=rptPathologyReportPrintMultiple", employee)
  }
  public getTestList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PathResultEntryList_Test_Dtls", employee)
  }
  // Rtrv_PathResultEntryList_Test_Dtls1
  public PathTemplateResultentryInsert(employee) {
    return this._httpClient1.PostData("Pathology/PathologyTemplateSave", employee);
  }

  public getPathTempReport(PathReportId, OP_IP_Type) {
    return this._httpClient.get("Pathology/view-PathTemplate?PathReportId=" + PathReportId + "&OP_IP_Type=" + OP_IP_Type);
  }

  public getPathTestReport(OP_IP_Type) {
    return this._httpClient.get("Pathology/view-PathReportMultiple?OP_IP_Type=" + OP_IP_Type);
  }

  public getPathologyTempReport(PathReportId, OP_IP_Type) {
    return this._httpClient.get("Pathology/view-PathTemplate?PathReportId=" + PathReportId + "&OP_IP_Type=" + OP_IP_Type);
  }

  getTemplateCombo(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PathTemplateMasterForCombo", employee)
  }


  public RoolbackStatus(employee) {
    return this._httpClient1.PostData("Pathology/PathResultentryrollback", employee);
  }

  //   public deactivateTheStatus(m_data) {
  //     return this._httpClient.post(
  //         "Generic/ExecByQueryStatement?query=" + m_data, {});
  // }
  populateForm(employee) {
    this.myform.patchValue(employee);
  }

  public getReportView(Param) {
     return this._httpClient1.PostData("Report/ViewReportFromDB", Param);
  }

  public PathPrintResultentryInsert(employee) {
    return this._httpClient1.PostData("Pathology/PathPrintResultentryInsert", employee);
  }

  public getPathTemplateById(Id) {
    return this._httpClient1.GetData("PathologyTemplate/PathReportId /" + Id);
  }

  public getresultenterylist(employee) {
    return this._httpClient1.PostData("Pathology/PathologyPatientTestList", employee)
  }



  public gettemplatebyService(ServiceId) {
    return this._httpClient1.GetData("Pathology/search-GetServicewiseTemplate?ServiceId=" + ServiceId)
  }
  public getReportHtml(Param) {
    return this._httpClient1.PostData("Report/get-report-html", Param);
  }
}
