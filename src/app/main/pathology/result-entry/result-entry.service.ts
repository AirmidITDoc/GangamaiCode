import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class ResultEntryService {
  myformSearch: FormGroup;

  myform: FormGroup;
  constructor(
    private _httpClient: HttpClient,
    private _httpClient1: ApiCaller,
     private _formBuilder: UntypedFormBuilder) { 
    this.myformSearch = this.createSearchForm();
    this.myform = this.createtemplateForm();
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      RegNoSearch: [],
      FirstNameSearch:  ['', [
        Validators.maxLength(50),
        // Validators.pattern("^[a-zA-Z._ -]*$"),
        Validators.pattern('^[a-zA-Z () ]*$')
      ]],
      LastNameSearch: ['', [
        Validators.maxLength(50),
        // Validators.pattern("^[a-zA-Z._ -]*$"),
        Validators.pattern('^[a-zA-Z () ]*$')
      ]],
      // BillNo:[''],
      // BillDate:[''],
      PatientTypeSearch: ['2'],
      StatusSearch: ['0'],
      CategoryId: [''],
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      TestStatusSearch:['1']
    });
  }

  createtemplateForm(): FormGroup {
    return this._formBuilder.group({
      TemplateId: [''],
      TemplateName: [''],
      TemplateDesc: [''],
      IsDeleted: ['false'],
      AddedBy: ['0'],
      UpdatedBy: ['0'],
      AddedByName: ['']
    });
  }

  // m_Rtrv_PathPatientList_Ptnt_Dtls
  public getPatientList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PathPatientList_Ptnt_Dtls", employee)
  }

  public getPathologyResultList(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + query, {})
  }
  public getHelpresultData(query){
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + query, {})
  }
  public PathResultentryInsert(employee) {
    return this._httpClient1.PostData("Pathology/InsertResultEntry", employee);
  }
  public PathResultentryDetailList(employee) {
    return this._httpClient1.PostData("Pathology/PathologyTestList", employee);
  }

  public getPathologyDoctorCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PathologistDoctorMasterForCombo", {})
  }

  public getDoctorMaster1Combo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }

  // public getPathologyResultListforIP(query){
  //   return this._httpClient.post("Generic/GetBySelectQuery?query=" + query, {})

  // }
  public getPathologyResultListforIP(param){
    return this._httpClient1.PostData("Common",param)
  }
  // public getPathologyResultListforOP(query){
  //   return this._httpClient.post("Generic/GetBySelectQuery?query=" + query, {})
  // }

  public getPathologyResultListforOP(param){
    return this._httpClient1.PostData("Common",param)
  }


  public getPathologyTemplateforIP(query){
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + query, {})

  }
  public getPathologyTemplateforOP(query){
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + query, {})

  }

  public getPathTemplatePrint(No) {
    return this._httpClient.post("Generic/GetByProc?procName=rptPrintPathologyReportTemplate", No)
  }
  public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + query, {})
  }

  public getSampleList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PathResultEntryList_Test_Dtls", employee)
  }

  public getInsertStatementQuery(query) {
    return this._httpClient.post("Generic/ExecByQueryStatement?query=" + query, {})
  }

  getPathologyPrint(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=rptPathologyReportPrintMultiple", employee)
  }
  public getTestList(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PathResultEntryList_Test_Dtls", employee)
  }
  // Rtrv_PathResultEntryList_Test_Dtls1
  public PathTemplateResultentryInsert(employee) {
    return this._httpClient1.PostData("Pathology/PathologyTemplateSave", employee);
  }

  public getPathTempReport(PathReportId,OP_IP_Type){
    return this._httpClient.get("Pathology/view-PathTemplate?PathReportId=" + PathReportId + "&OP_IP_Type=" + OP_IP_Type);
  }

  
  public PathPrintResultentryInsert(employee) {
    return this._httpClient.post("Pathology/PathPrintResultentryInsert", employee);
  }

  public getPathTestReport(OP_IP_Type){
    return this._httpClient.get("Pathology/view-PathReportMultiple?OP_IP_Type=" + OP_IP_Type);
  }

  public getPathologyTempReport(PathReportId,OP_IP_Type){
    return this._httpClient.get("Pathology/view-PathTemplate?PathReportId=" + PathReportId + "&OP_IP_Type="+OP_IP_Type);
  }

  getTemplateCombo(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PathTemplateMasterForCombo", employee)
  }
  
  
  public RoolbackStatus(employee) {
    return this._httpClient1.PostData("Pathology/PathResultentryrollback", employee);
  }

  public deactivateTheStatus(m_data) {
    return this._httpClient.post(
        "Generic/ExecByQueryStatement?query=" + m_data, {});
}
  populateForm(employee) {
    this.myform.patchValue(employee);
  }

  public getReportView(Param) {
    return this._httpClient1.PostData("Report/ViewReport", Param);
  }
}
