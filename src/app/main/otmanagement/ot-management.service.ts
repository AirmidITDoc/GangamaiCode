import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class OTManagementService {

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
       Surgeryname :['', [
        Validators.required,
        ]],
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
       Assistant:'',
       operativeDiagnosis:'',
       operativeFindings:'',
      operativeProcedure:'',
      extraProPerformed:'',
      closureTechnique:'',
      postOpertiveInstru:'',
      detSpecimenForLab:'',
      Prepost:'',
      Extra:'',
      Circulatingstaff:'',
      Pre:'',
      AnathesticName:'',
      OtNote:''
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
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_OTBookingList",employee)
  }

  public getSurgeryCombo(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SurgeryMasterForCombo", {})
  }
  
  
  public getOTtableCombo(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_OTTableMaster_ForCombo", {})
  }
  
  public getDoctorMaster() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo", {})
  }
  public getDoctorMaster1Combo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveDoctorMasterForCombo", {})
  }
  
  //Deartment Combobox List
  public getDepartmentCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveDepartmentMasterForCombo", {})
   
  }

  public getSiteCombo(){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_M_SiteDescriptionMasterForCombo_Conditional",{"Id":1})
  }
  //Doctor Master Combobox List
  public getDoctorMasterCombo(Id) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo_Conditional", {"Id":Id})
  }
  
  public getCategoryCombo(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SurgeryCategoryMasterForCombo", {})
  }
  public OTreservationInsert(employee)
  {
    return this._httpClient.post("InPatient/OTBookingInsert", employee);
  }

  public NeuroSurgeryNoteInsert(employee)
  {
    return this._httpClient.post("InPatient/NeroSurgeryOTNotesInsert", employee);

  }

  public NeuroSurgeryNoteUpdate(employee)
  {
    return this._httpClient.post("InPatient/NeroSurgeryOTNotesUpdate", employee);

  }


  public OTreservationUpdate(employee){
    return this._httpClient.post("InPatient/OTBookingUpdate", employee);
  }
  public getAnesthestishDoctorCombo(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_AnesthestishDoctor_ForCombo", {})
  }
  
  public getDoctorMaster2Combo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }
  
  populateForm2(employee) {
    this.otreservationFormGroup.patchValue(employee);
  }
  
  //CATLAB

 
  public CathLabBookInsert(employee){
    return this._httpClient.post("InPatient/CathLabBookingInsert", employee);
  }
  
  public CathLabBookUpdate(employee){
    return this._httpClient.post("InPatient/CathLabBookingUpdate", employee);
  }

  public getLabRequestList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_LabRequest_Nursing", employee)
  }

  public populateFormpersonal(employee){
    this.otreservationFormGroup.patchValue(employee);
  }
  ///OTTrequest

  public getOTRequestList(employee){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BrowseOTlist", employee)
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



  
  public RequestInsert(employee){
    return this._httpClient.post("InPatient/OTRequestInsert", employee);
  }

  public RequestUpdate(employee){
    return this._httpClient.post("InPatient/OTBookingInsert", employee);
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
}