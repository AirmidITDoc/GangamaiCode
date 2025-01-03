import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class OTManagementServiceService {

  Otserachform:FormGroup;
  otreservationFormGroup:FormGroup;
  
  constructor(private _httpClient: HttpClient,
    private _formBuilder: FormBuilder) {
      // this.Otserachform= this.filterForm();
      this.Otserachform=this.filterForm1();
      this.otreservationFormGroup = this.createOtreservationForm();
     }
 

    filterForm(): FormGroup {
      return this._formBuilder.group({
  
        OTTableID:'',
        // DoctorName:'',
        start: [(new Date()).toISOString()],
        end: [(new Date()).toISOString()]
  
      });
    }

    createOtreservationForm() {
      return this._formBuilder.group({
       TranDate : [new Date().toISOString()],
       TranTime : [new Date().toISOString()],
       OP_IP_ID : '',
       OP_IP_Type : '',
       OTbookingDate:[new Date().toISOString()],
       OPDate : [new Date().toISOString()],
      //  OPTime : [new Date().toISOString()],
       SurgeryId: ['', [
        Validators.required]],
       Duration  : '',
       OTTableId  : '',
       SurgeonId :['', [
        Validators.required
        ]],
       SurgeonId1 :' ',
       AnestheticsDr :['', [
        Validators.required,
        ]],
       AnestheticsDr1 :'',
       Surgeryname :[''],
       ProcedureId :'',
       AnesthType :'',
       UnBooking :'',  
       Instruction :'',
       IsAddedBy :'',
       OTBookingID :'',
       OTCathLabBokingID:'',
       SurgeryCategoryId:'',
       SiteDescId:'',
       DoctorId:'',
       SurgeryType:'1',
       DepartmentId:'',
       DepartmentName:'',
       GenderName:'',
       GenderId:'',
       Assistant:'',
       operativeDiagnosis:'',
       operativeFindings:'',
      operativeProcedure:'',
      extraProPerformed:'',
      closureTechnique:'',
      postOpertiveInstru:'',
      detSpecimenForLab:'',
      Prepost:'',
      Extra:''
     });
   }


   filterForm1(): FormGroup {
    return this._formBuilder.group({
  
      OTTableID:'',
      // DoctorName:'',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()]
  
    });
  }
  
  public getOTReservationlist(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_OTBookinglist",employee)
  }

  public getOTRequestList(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_OTBookingRequestlist", employee)
  }
  public getOTtableCombo(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_OTTableMaster_ForCombo", {})
  }
  
  public getSurgeryCombo(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SurgeryMasterForCombo", {})
  }
  public getAnesthestishDoctorCombo(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_AnesthestishDoctor_ForCombo", {})
  }
  public getDoctorMaster2Combo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }
    
  // public getDoctorMaster() {
  //   return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo", {})
  // }

  public getDoctorMaster() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }
  public getDoctorMaster1Combo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveDoctorMasterForCombo", {})
  }
  public getCategoryCombo(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SurgeryCategoryMasterForCombo", {})
  }

  public ReservationInsert(employee){
    return this._httpClient.post("InPatient/OTBookingInsert", employee);
  }

  public ReservationUpdate(employee){
    return this._httpClient.post("InPatient/OTBookingUpdate", employee);
  }

  public PrepostOTNoteInsert(employee){
    return this._httpClient.post("InPatient/PrepostOtNoteInsert", employee);
  }

  public PrepostOTNoteUpdate(employee){
    return this._httpClient.post("InPatient/PrepostOtNoteUpdate", employee);
  }
    
  //Deartment Combobox List
  public getDepartmentCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveDepartmentMasterForCombo", {})
   
  }
  public getSiteCombo(param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_M_SiteDescriptionMasterForCombo_Conditional",param)
  }
    //Doctor Master Combobox List
    public getDoctorMasterCombo(Id) {
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo_Conditional", {"Id":Id})
    }
     
  public RequestInsert(employee){
    return this._httpClient.post("InPatient/OTRequestInsert", employee);
  }

  public RequestUpdate(employee){
    return this._httpClient.post("InPatient/OTBookingInsert", employee);
  }
  public populateFormpersonal(employee){
    this.otreservationFormGroup.patchValue(employee);
  }





  
  public CathLabBookInsert(employee){
    return this._httpClient.post("InPatient/CathLabBookingInsert", employee);
  }
  
  public CathLabBookUpdate(employee){
    return this._httpClient.post("InPatient/CathLabBookingUpdate", employee);
  }

  public getLabRequestList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_LabRequest_Nursing", employee)
  }

  

  public getcathlabBooking(employee){
    
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_T_OTCathLabBookingList", employee)

  }
  
  public getEndoscopylist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_EndoscopyBookingList", employee)
  }


  public EndoscopyrequestInsert(employee){
    return this._httpClient.post("InPatient/OTEndoscopyInsert", employee);
  }

  public EndoscopyrequestUpdate(employee){
    return this._httpClient.post("InPatient/OTEndoscopyUpdate", employee);
  }



  public getAdmittedpatientlist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }
  // ip
  public getAdmittedPatientList(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }
  // op
  public getPatientVisitedListSearch(employee) {//m_Rtrv_PatientVisitedListSearch
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientVisitedListSearch", employee)
  }
  public BookingCancle(employee)
  {
    return this._httpClient.post("CustomerInformation/CancelOTBookingRequest", employee);
  }
  public getGenderCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SexMasterForCombo_Conditional", {})
    }
  // public RequestInsert(employee){
  //   return this._httpClient.post("InPatient/OTRequestInsert", employee);
  // }

  // public RequestUpdate(employee){
  //   return this._httpClient.post("InPatient/OTBookingInsert", employee);
  // }

}