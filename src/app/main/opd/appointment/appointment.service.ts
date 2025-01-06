import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  public afterMethodFileSelect: Subject<any> = new Subject();
  
  myFilterform: UntypedFormGroup;
  mySaveForm: UntypedFormGroup;
  now = Date.now();
  sIsLoading: string = '';
  getRegistrationSearchList: any;
  constructor(public _httpClient: HttpClient,
    private _formBuilder: UntypedFormBuilder
  ) {
    this.myFilterform = this.filterForm();
      }

  filterForm(): UntypedFormGroup {
    return this._formBuilder.group({
      RegNo:'',
      FirstName:['', [
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      LastName:['', [
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      DoctorId:'',
      DoctorName:'',
      MobileNo:'',
      IsMark: 2,
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],

    });
  }


  initializeFormGroup() {
    
  }

  // Add new registration
  public regInsert(employee) {
    return this._httpClient.post("OutPatient/RegistrationInsert", employee);
  }

  // update registration
  public regUpdate(employee) {
    return this._httpClient.post("OutPatient/RegistrationUpdate", employee);
  }

  // Add new Appointment
  public appointregInsert(employee) {
    return this._httpClient.post("OutPatient/RegistrationInsert", employee);
  }

  // Update  registration
  public appointregupdate(employee) {
    return this._httpClient.post("OutPatient/RegistrationUpdate", employee);
  }
  

  // Feeback 
  public feedbackInsert(employee) {
    return this._httpClient.post("OutPatient/PatientFeedback", employee);
  }

  // display Appointment list
  public getAppointmentList(employee) {
    // return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_VisitDetailsList", employee)
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveVisitDetailsList_1", employee)
  }
  // Doctor Master Combobox List
  public getAdmittedDoctorCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }


  // Admission Form Combobox old

  //Prefix Combobox List
  public getPrefixCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrievePrefixMasterForCombo", {})
  }

  //Gender Combobox List
  public getGenderCombo(Id) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SexMasterForCombo_Conditional", { "Id": Id })
  }


  public getGenderMasterCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveGenderMasterForCombo", {})
  }

  // Classmaster List
  public getClassMasterCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_WardClassMasterForCombo", {})
  }

  //Area Combobox List
  public getAreaCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_AreaMasterForCombo", {})
  }

  //Area Combobox List
  public getPurposeList() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PurposeMasterForCombo", {})
  }
  

  //Marital Combobox List
  public getMaritalStatusCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_MaritalStatusMasterForCombo", {})
  }
  //Religion Combobox List
  public getReligionCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ReligionMasterForCombo", {})
  }
  //Hospital Combobox List
  public getHospitalCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=rtrv_UnitMaster_1", {})
  }
  //Patient Type Combobox List
  public getPatientTypeCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrievePatientTypeMasterForCombo", {})
  }
  //Tariff Combobox List
  public getTariffCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveTariffMasterForCombo", {})
  }
  //company Combobox List
  public getCompanyCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveCompanyMasterForCombo", {})
  }
  //subtpa Combobox List
  public getSubTPACompCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveM_SubTPACompanyMasterForCombo", {})
  }
  //relationship Combobox List
  public getRelationshipCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveRelationshipMasterForCombo", {})
  }
  //Deartment Combobox List
  public getDepartmentCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveDepartmentMasterForCombo", {})
  }
  //Doctor Master Combobox List
  public getDoctorMasterCombo(Id) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo_Conditional", { "Id": Id })
  }
  //Doctor 1 Combobox List
  public getDoctorMaster1Combo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorListForCombo", {})
  }
  //Doctor 2 Combobox List
  public getDoctorMaster2Combo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }
  //Ward Combobox List
  public getWardCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RoomMasterForCombo", {})
  }
  //Bed Combobox List
  public getBedCombo(Id) {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveBedMasterForCombo_Conditional", { "Id": Id })
  }

  //  city list
  public getCityList() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveCityMasterForCombo", {})
  }
  //state Combobox List
  public getStateList(CityId) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StateMasterForCombo_Conditional", { "Id": CityId })
  }
  //country Combobox List
  public getCountryList(StateId) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_CountryMasterForCombo_Conditional", { "Id": StateId })
  }
  //service Combobox List
  public getServiceList() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ServiceMasterForCombo", {})
  }
  //registration list 
  public getRegistrationList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PatientRegistrationList", employee)
  }

  public UpdateQueryByStatement(query) {
    return this._httpClient.post("Generic/ExecByQueryStatement?query="+query, {})
  }

  // public getDeptwiseDoctorMaster(){
  //   return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo", {})
  // }

  public getDeptwiseDoctorMaster(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo", {})
  }
  populateForm(employee) {
    this.mySaveForm.patchValue(employee);
  }

  getregisterListByRegId(employee){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RegbyRegID", employee)
  }

  public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  } 
  public getOPDPrecriptionPrint(PrecriptionId) {
    return this._httpClient.post("Generic/GetByProc?procName=rptOPDPrecriptionPrint ", PrecriptionId)
  }

  public getappschdulelist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RegbyRegID", employee)
  }

 
  populateFormpersonal(employee) {
    // this.personalFormGroup.patchValue(employee);
  }

  // public documentuploadInsert(employee){
  //   return this._httpClient.post("OutPatient/OPDAppointmentUpdate", employee);
  // }

  public CrossConsultationInsert(element){

    return this._httpClient.post("OutPatient/OPDCrossConsultationInsert",element)
  }
}
