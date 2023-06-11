import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class NursingstationService {

  myFilterform: FormGroup;
  myform: FormGroup;
  Prscreturn: FormGroup;

  constructor(public _httpClient: HttpClient,
    public _formBuilder: FormBuilder) {
    this.myFilterform = this.filterForm();
    this.myform = this.createtemplateForm();
    this.Prscreturn = this.createPrescreturnForm();
    
  }



  filterForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: '',
      // IPDNo: '',
      FirstName: '',
      LastName: '',
      // AdmDisFlag:0,
      // OP_IP_Type:1,
      // IPNumber:1,
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
    });
  }


  createPrescreturnForm(): FormGroup {
    return this._formBuilder.group({
      PresDate: [new Date().toISOString()],
      PresTime: [new Date().toISOString()],
      ToStoreId: [''],
      StoreId:[''],
      IsDeleted: ['false'],
      Isclosed:['',Validators.required],
      PresReId: [0],
      CompanyId:[''],
      CompanyName:[''],
      IPMedID:[''],
      OP_IP_Id:[''],
      OP_IP_Type:[''],
      BatchNo:[''],
      Qty:[''],
      ItemId:[''],
      ItemName:[''],
      drugController:['']
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
      AddedByName: [''],

      DoctorsNotes: ['', Validators.required],
      DoctNoteId: [0],
      DoctorID: [0],

      NursTempName: '',
    });
  }

  
 


  public getAdmittedPatientList(employee) {

    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_Admtd_Ptnt_Dtls", employee)
  }

  public getStoreCombo() {
        return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForCombo", {})
  }
  public getpatientwisematerialconsumptionList(employee) {
    // return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_Admtd_Ptnt_Dtls", employee)
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PatMaterialConsumption_ByName", employee)
  }
  public getLabrequestDetailList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_NursingLabRequestDetails", employee)
  }

  public getLabRequestList(employee) {

    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_LabRequest_Nursing", employee)
  }

  
  public getprescriptionList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_IP_Prescriptio_Det", employee)
     
  }

  public getOPIPPatientList(employee) {

    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_OPIPPatientList", employee)
  }

  public PathResultentryInsert(employee) {
    return this._httpClient.post("InPatient/IPPathOrRadiRequest", employee)
  }
  public getchargesList(data) {
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + data, {})
  }

  // Get billing Service List 
  public getBillingServiceList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathRadServiceList", employee)
  }


  public getServicelistpathradio(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathRadServiceList", employee)

  }

  public PrescriptionInsert(employee) {
    return this._httpClient.post("InPatient/InsertIPPrescription", employee)
  }

  public PrescriptionReturnInsert(employee) {
    return this._httpClient.post("InPatient/InsertIPPrescriptionReturn", employee)
  }
  public PrescriptionReturnUpdate(employee) {
    return this._httpClient.post("InPatient/InsertIPPrescriptionReturn", employee)
  }
  public getOTRequestList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BrowseOTlist", employee)
  }

  // DocNote

  public getDoctorCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }
  public DoctorNoteInsert(employee) {
    return this._httpClient.post("InPatient/DoctorNoteInsert", employee)
  }
 public NursingNoteInsert(employee)
  {
    return this._httpClient.post("InPatient/NursingTemplateInsert", employee)
  }

  public InsertNewmaterialconsumption(employee)
  {
    return this._httpClient.post("InPatient/MaterialConsumption", employee)
  }
  // IPPrescription

  public getDrugList(drugValue) {
    return this._httpClient.post("Generic/GetByProc?procName=ps_RtvrDrugName", { "ItemName": drugValue })
  }

  public getDoseList() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_DoseMasterList", {});
  }

  //CharityList
 
  public getCharitypatientList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_CharityPatientList", employee)
  }

  public getdischargepatientcasepaper(employee){
    return this._httpClient.post("Generic/GetByProc?procName=rptDischargePatientListforMRD", employee)
  }

  public getPharmacySummaryList(employee){
    return this._httpClient.post("Generic/GetByProc?procName=rptIPPharmacySummaryAboveOneLakh", employee)
  }

  public getDoctorMaster1Combo(){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {});
  }

  public getDepartmentCombo(){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveDepartmentMasterForCombo", {})
  }
    
  populateFormpersonal(employee) {
    this.Prscreturn.patchValue(employee);
  }  //Doctor Master Combobox List

  // extra
  public getDoctorMasterCombo(Id) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo_Conditional", { "Id": Id })
  }

  public getappschdulelist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RegbyRegID", employee)
  }



}