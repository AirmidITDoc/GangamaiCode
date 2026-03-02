import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InvestigationListService {

  constructor(private _formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    private handler: HttpBackend, private _httpClient: HttpClient, private _httpClient1: ApiCaller,) {
    this.myformSearch = this.createSearchForm();
    this.ResultmyformSearch = this.ResultcreateSearchForm();
  }

  //////////////// Sample Collection ///////////////////
  myformSearch: FormGroup;

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: [],
      FirstName: ['', [
        Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
      ]],
      LastName: ['', [
        Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
      ]],
      // BillNo:[''],
      // BillDate:[''],
      PatientTypeSearch: ['5'],
      StatusSearch: ['2'],
      PBillNo: '',
      CompanyId: 0,
      Istype: ['2'],
      CategoryId: [''],
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      TestStatusSearch: ['1'],
      UnitId: [this.accountService.currentUserValue.user.unitId]
    });
  }

  public getSampleCollectionlist(employee) {
    return this._httpClient1.PostData("LabPatientRegistration/LabSampleCollectionList", employee)
  }
  public getReportHtml(Param) {
    return this._httpClient1.PostData("Report/get-report-html", Param);
  }

  // Result entry api ///////////
  ResultmyformSearch: FormGroup;

  ResultcreateSearchForm(): FormGroup {
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
      StatusSearch: ['0'],
      CategoryId: [''],
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      TestStatusSearch: ['1'],
      UnitId: [this.accountService.currentUserValue.user.unitId],
      // CategoryId:0
    });
  }

  ////// Approval 
  ApprovalcreateSearchForm(): FormGroup {
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
      StatusSearch: ['0'],
      CategoryId: [''],
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      TestStatusSearch: ['1'],
      UnitId: [this.accountService.currentUserValue.user.unitId],
      // CategoryId:0
    });
  }

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
    return this._httpClient1.PostData("LabPatientRegistration/LabResultDetailsList", employee);
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

  public getPathTemplatePrint(No) {
    return this._httpClient.post("Generic/GetByProc?procName=rptPrintPathologyReportTemplate", No)
  }
  public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + query, {})
  }

  public getSampleList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PathResultEntryList_Test_Dtls", employee)
  }

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
  // populateForm(employee) {
  //   this.myform.patchValue(employee);
  // }

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
    return this._httpClient1.PostData("LabPatientRegistration/LabResultList", employee)
  }

  public gettemplatebyService(ServiceId) {
    return this._httpClient1.GetData("Pathology/search-GetServicewiseTemplate?ServiceId=" + ServiceId)
  }

  public getarrovallist(employee) {
    return this._httpClient1.PostData("LabApproval/LabResultCompletedList", employee)
    // return this._httpClient1.PostData("LabPatientRegistration/LabApprovaltList", employee)
  }

  public getBillrevenudetailList(param) {

    return this._httpClient1.PostData("Branch/UnitBranchWiseRevenueSummary", param)
  }
}
