import { Injectable } from '@angular/core';
import { RegInsert } from './appointment.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentSreviceService {

  public afterMethodFileSelect: Subject<any> = new Subject();
   myFilterform: FormGroup;
   mySaveForm:FormGroup;

  now = Date.now();
  sIsLoading: string = '';
  constructor(public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) {
    this.myFilterform = this.filterForm();
   
  }

  filterForm(): FormGroup {
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
      IsMark: 2,
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
    });
  }

 

  //---Regi starrt-------
  // saveForm(): FormGroup {
  //   return this._formBuilder.group({

  //     RegId: '',
  //     RegDate: '',
  //     RegTime: '',
  //     PrefixId: '',
  //     PrefixID: '',
  //     FirstName: ['', [
  //       Validators.required,
  //       Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
  //     ]],
  //     MiddleName: ['', [
  //       Validators.required,
  //       Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
  //     ]],
  //     LastName: ['', [
  //       Validators.required,
  //       Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
  //     ]],
  //     Address: '',
  //     City: '',
  //     PinNo: ['', [Validators.minLength(6), Validators.maxLength(6)]],
  //     DateofBirth:  [(new Date()).toISOString()],
  //     Age: '',
  //     GenderId: '',
  //     GenderName: '',
  //     PhoneNo: ['', [
       
  //       Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
  //       Validators.minLength(10),
  //       Validators.maxLength(10),
  //     ]],
  //     MobileNo: ['', [
  //       Validators.required,
  //       Validators.pattern("^[0-9]*$"),
  //       Validators.minLength(10),
  //       Validators.maxLength(10),
  //     ]],
  //     AddedBy: '',
  //     RegNo: '',
  //     AgeYear: ['', Validators.pattern("[0-9]+")],
  //     AgeMonth: ['', Validators.pattern("[0-9]+")],
  //     AgeDay: ['', Validators.pattern("[0-9]+")],
  //     CountryId: '',
  //     StateId: '',
  //     CityId: '',
  //     CityName: '',
  //     MaritalStatusId: '',
  //     IsCharity: '',
  //     ReligionId: '',
  //     AreaId: '',
  //     VillageId: '',
  //     TalukaId: '',
  //     PatientWeight: '',
  //     AreaName: '',
  //     AadharCardNo: ['', [
  //       Validators.required,
  //       Validators.pattern("^[0-9]*$"),
  //       Validators.minLength(12),
  //       Validators.maxLength(12),
  //     ]],
  //     PanCardNo: '',
  //     VisitId: '',
  //     RegID: '',
  //     VisitDate: [(new Date()).toISOString()],
  //     VisitTime: [(new Date()).toISOString()],
  //     UnitId: '',
  //     PatientTypeID: '',
  //     PatientType: '',
  //     ConsultantDocId: '',
  //     RefDocId: '',
  //     DoctorId: '',
  //     DoctorName: '',
  //     OPDNo: '',
  //     TariffId: '',
  //     CompanyId: '',
  //     CompanyName: '',
  //     //AddedBy :'',
  //     IsCancelledBy: '',
  //     IsCancelled: '',
  //     IsCancelledDate: '',
  //     ClassId: '',
  //     ClassName: '',
  //     DepartmentId: '',
  //     DepartmentName: '',
  //     PatientOldNew: '',
  //     FirstFollowupVisit: '',
  //     AppPurposeId: '',
  //     FollowupDate: '',
  //     IsMark: '',
  //     IsXray: '',
  //     HospitalID: '',
  
  //     ServiceID: '',
  //     TotalAmt: '',
  //     ConcessionAmt: '',
  //     NetPayableAmt: '',

  //   });
  // }

  initializeFormGroup() {
    // this.saveForm();
}

  // Add new registration
  public regInsert(employee) {
    return this._httpClient.post("OutPatient/OPDRegistrationSave", employee);
}

  // update registration
  public regUpdate(employee) {
    return this._httpClient.post("OutPatient/OPDAppointmentInsert", employee);
}

  // Add new Appointment
  public appointregInsert(employee) {
    return this._httpClient.post("OutPatient/AppointmentInsert", employee);
}

  // Update  registration
  public appointregupdate(employee) {
    return this._httpClient.post("OutPatient/AppointmentVisitUpdate", employee);
}
  
public Appointmentcancle(employee) {
  return this._httpClient.post("OutPatient/AppointmentCancle", employee);
}
public documentuploadInsert(employee){
  return this._httpClient.post("InPatient/DocAttachment", employee);
}


public getVisitedList(employee) {
  //  return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_OpVisitDetailsList",employee)
  return this._httpClient.post("Generic/GetByProc?procName=M_VisitDetail",employee)
  }
  
public documentdownloadInsert(employee){
  return this._httpClient.post("File/UploadFile", employee);
}
  // display Appointment list
  public getAppointmentList(employee) {
    return this._httpClient.post("Generic/GetDataSetByProc?procName=m_Rtrv_VisitDetailsList_1_Pagi", employee)
  }

  public getAppointmentListold(employee) {
    return this._httpClient.post("Generic/GetDataSetByProc?procName=m_Rtvr_VisitDetailsList_1", employee)
  }


  public getRegIdDetail(data){
    return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
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
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientRegistrationList", employee)
  }

  public getDocPatientRegList(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientVisitedListSearch", employee)
  }
  //registration list 
  public getPhoneAppointmentList1(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PhoneAppointmentListSearch", employee)
  }
  getuploadeddocumentsList(query){
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  }
  getfile(Id){
    return this._httpClient.get("InPatient/get-file?Id="+Id)
  }

  public UpdateQueryByStatement(query) {
    return this._httpClient.post("Generic/ExecByQueryStatement?query="+query, {})
  }

  public getdeleteddocument(query) {
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
  public getOPDPrecriptionPrint(VisitId) {
    return this._httpClient.post("Generic/GetByProc?procName=rptAppointmentPrint1", VisitId)
  }
  
  public getOPPatient(employee) {

    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RegistrationList", employee)
  }

    // Doctor Master Combobox List
    public getDoctorMasterComboA() {
      return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
    }
    public CrossConsultationInsert(element){

      return this._httpClient.post("OutPatient/OPDCrossConsultationInsert",element)
    }

    public getAppointmentReport(VisitId){
      return this._httpClient.get("OutPatient/view-PatientAppointment?VisitId=" + VisitId);
    }
    
}
