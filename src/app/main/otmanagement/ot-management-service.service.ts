import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class OTManagementServiceService {

  Otserachform:FormGroup;
  otreservationFormGroup:FormGroup;
  otRequestForm:FormGroup;
  
  constructor(private _httpClient: HttpClient,
    private _formBuilder: FormBuilder,
        private _loaderService: LoaderService,) {
      // this.Otserachform= this.filterForm();
      this.Otserachform=this.filterForm1();
      this.otreservationFormGroup = this.createOtreservationForm();      
    this.otRequestForm = this.createOtrequestForm();
     }
 

    filterForm(): FormGroup {
      return this._formBuilder.group({
  
        OTTableID:'',
        // DoctorName:'',
        start: [(new Date()).toISOString()],
        end: [(new Date()).toISOString()]
  
      });
    }

    createOtrequestForm() {
      return this._formBuilder.group({
        OTbookingDate: [new Date().toISOString()],
        OTbookingTime: [new Date().toISOString()],
        OP_IP_ID: '',
        OP_IP_Type: '',
        AddedDateTime: [new Date().toISOString()],        
        SurgeonId: '',

        RegID: '',
        PatientType: ['OP'],
        DepartmentId: '',
        SurgeryCategoryId:'',
        SiteDescId: '',
        SurgeryId: '',
        DoctorId: '',
        SurgeryType: ["0"],

        IsCancelled: '',
        WardName: '',
        BedNo: '',
        PatientName: '',
        GenderId: '',
        Age: '',
        MobileNo: '',
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
       Duration  : '',
       SurgeonId :['', [
        Validators.required
        ]],
       SurgeonId1 :' ',
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
      Extra:'',

      RegID: '',
      PatientType: ['OP'],
      MobileNo:'',
      PatientName:'',
      SurgeryId:'',
      DoctorId:'',
      DoctorId1:'',
      AnestheticsDr:'',
      AnestheticsDr1:'',
      OTTableId:'',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
           AnestheticsDr3:''
     });
   }

   createOtNoteForm() {
    return this._formBuilder.group({
      OTCathLabBokingID: '',
      TranDate: [new Date().toISOString()],
      TranTime: [new Date().toISOString()],
      OP_IP_ID: '',
      OP_IP_Type: '',
      OPDate: [new Date().toISOString()],
      OPTime: [new Date().toISOString()],
      SurgeryId: '',
      Duration: '',
      OTTableId: '',
      SurgeonId: '',
      SurgeonId1: ' ',
      AnestheticsDr: '',
      AnestheticsDr1: '',
      Surgeryname: '',
      ProcedureId: '',
      AnesthType: '',
      UnBooking: '',
      Instruction: '',
      IsAddedBy: '',
      OTBookingID: '',
      Assistantscrub:'',
      Circulatingstaff:'',
      AnathesticNAme:'',
      OtNote:'',
      Extra:'',
      Pre:'', 
      Description:'',
      DoctorId:'',
      BloodLoss:'',
      sorubNurse:'',
      histopathology:'',
      bostOPOrders:'',
      complicationMode:'',
      assistant:'',
      DoctorId1:'',
       AnestheticsDr3:'',
       RegID: '',
       PatientType: ['IP'],
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
  public getDoctorMasterList(Param) {
    return this._httpClient.post("Generic/GetDataSetByProc?procName=m_Rtrv_DoctorMasterList_Pagi", Param);
}

  public getDoctorMasterComboList(param) {
  //   if (loader) {
  //     this._loaderService.show();
  // }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_DoctorListMasterForCombo",param)
  } 
  // otbooking insert and update
  public otBookingRequestInsert(employee) {
    return this._httpClient.post("OT/SaveOTBookingRequest", employee);
  }

  public otBookingRequestUpdate(employee) {
    return this._httpClient.post("OT/UpdateOTBookingRequest", employee);
  }

  public getOTReservationlist(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_OTBookinglist",employee)
  }

  public getOTRequestList(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_T_OTBooking_Request_List", employee)
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
    return this._httpClient.post("Generic/GetByProc?procName=m_RetrieveConsultantDoctorMasterForCombo", {})
  }
    
  // public getDoctorMaster() {
  //   return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo", {})
  // }

  public getDoctorMaster() {
    return this._httpClient.post("Generic/GetByProc?procName=m_RetrieveConsultantDoctorMasterForCombo", {})
  }
  public getDoctorMaster1Combo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveDoctorMasterForCombo", {})
  }
  public getCategoryCombo(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SurgeryCategoryMasterForCombo", {})
  }

  public ReservationInsert(employee){
    return this._httpClient.post("OT/SaveOTBooking", employee);
  }
  public InsertOTNotes(employee,loader = true){
    if(loader){
      this._loaderService.show();
    }
    return this._httpClient.post("InPatient/OTNoteTemplateInsert", employee);
  }
  public UpdateOTNotes(employee,loader = true){
    if(loader){
      this._loaderService.show();
    }
    return this._httpClient.post("InPatient/OTNoteTemplateUpdate", employee);
  }

  public ReservationUpdate(employee,loader = true){
    if(loader){
      this._loaderService.show();
    }
    return this._httpClient.post("OT/UpdateOTBooking", employee);
  }

  public PrepostOTNoteInsert(employee,loader = true){
    if(loader){
      this._loaderService.show();
    }
    return this._httpClient.post("InPatient/PrepostOtNoteInsert", employee);
  }

  public PrepostOTNoteUpdate(employee,loader = true){
    if(loader){
      this._loaderService.show();
    }
    return this._httpClient.post("InPatient/OTNoteTemplateUpdate", employee);
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
// otTable List in Reservation
// public getOTRequestListInReser(employee){
//   return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_T_OTBooking_Request_List", employee)
// }

public getOTRequestListInReser(employee){
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_OTBookingRequestlist_EmergencyList", employee)
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
    return this._httpClient.post("OT/CancelOTBookingRequest", employee);
  }
  public BookingReservationCancle(employee)
  {
    return this._httpClient.post("OT/CancelOTBooking", employee);
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