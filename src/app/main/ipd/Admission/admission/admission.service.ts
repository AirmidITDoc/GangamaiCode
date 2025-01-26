import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { RegInsert } from 'app/main/opd/registration/registration.component';

@Injectable({
  providedIn: 'root'
})
export class AdmissionService {

  populateFormpersonal(registerObj: RegInsert) {
    throw new Error('Method not implemented.');
  }

  myFilterform: FormGroup;
  mySaveForm: FormGroup;

  counter = 0;

  constructor(public _httpClient: HttpClient,public _httpClient1: ApiCaller,
    public _formBuilder: UntypedFormBuilder,  private _loaderService: LoaderService,
  ) {
    this.myFilterform = this.filterForm();
    this.mySaveForm = this.saveForm();
  }

  filterForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: '',
      IPDNo: '',
      FirstName: '',
      MiddleName: '',
      LastName: '',
      MobileNo: '',
      searchDoctorId: '',
      DoctorId: '0',
      DoctorID: '0',
      DoctorName: '',
      WardId: '0',
      RoomName: '',
      PatientType: '',
      patientstatus: '',
      start: [ ],
      end: [ ],

    });
  }

  saveForm(): FormGroup {
    return this._formBuilder.group({

      AdmissionID: '',
      RegID: '',
      AdmissionDate: '',
      AdmissionTime: '',
      PatientTypeID: '',
      HospitalID: '',
      DocNameID: '',
      RefDocNameID: '',
      RoomId: '',
      BedId: '',

      DischargeDate: '',
      DischargeTime: '',
      IsDischarged: '',
      IsBillGenerated: '',
      CompanyId: '',
      TariffId: '',
      ClassId: '',
      HospitalId: '',
      DepartmentId: '',
      Departmentid: '',
      RelativeName: '',
      RelativeAddress: '',
      PhoneNo: ['', [

        Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(15),
      ]],
      MobileNo: ['', [
        // Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]],
      RelationshipId: '',
      AddedBy: '',
      IsMLC: '',
      MotherName: '',
      AdmittedDoctor1: '',
      AdmittedDoctor2: '',
      SubCompanyId: '',
      SubTPAComp: '',
      IsReimbursement: '',
      RelatvieMobileNo: 0,
      PrefixID: '',
      PrefixName: '',
      DoctorID: '',
      PatientName: '',
      FirstName: ['', [
        // Validators.required,
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      MiddleName: ['', [

        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      LastName: ['', [
        // Validators.required,
        Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
      ]],
      DoctorId: '',
      DoctorName: '',
      IPDNo: '',
      DOA: '',
      DOT: '',
      RefDocName: '',
      PatientType: '',
      HospitalName: '',
      RegNoWithPrefix: '',
      AdmittedDoctor1ID: '',
      AdmittedDoctorId: '',
      AdmittedDoctorId1: '',
      // AdmittedDoctor1: string;
      // TariffId: number;
      TariffName: '',
      RoomName: '',
      BedName: '',
      GenderId: '',
      GenderName: '',
      //----Admission end

      //---Regi starrt-------

      RegId: '',
      RegDate: '',
      RegTime: '',
      //PrefixId : '',
      //FirstName : '',
      //MiddleName : '',
      //LastName : '',
      Address: '',
      City: '',
      PinNo: '',
      DateOfBirth: '',
      Age: '',
      //GenderId : '',
      //PhoneNo: '',
      //MobileNo: '',
      //AddedBy: '',
      AgeYear: '',
      AgeMonth: '',
      AgeDay: '',
      CountryId: '',
      StateId: '',
      CityId: '',
      MaritalStatusId: '',
      IsCharity: '',
      ReligionId: '',
      AreaId: '',
      VillageId: '',
      TalukaId: '',
      PatientWeight: '',
      AreaName: '',
      AadharCardNo: ['', [
        // Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(12),
        Validators.maxLength(12),
      ]],
      PanCardNo: '',
      //-----------End Regis-----

      //----bed----

      //BedId: ''
    });
  }
  //-------------------Insert methods-----------






  public AdmissionNewInsert(employee) {
    return this._httpClient1.PostData("Admission/AdmissionInsertSP", employee);
  }

  public AdmissionRegisteredInsert(employee) {
    return this._httpClient.post("InPatient/AdmissionRegistredInsert", employee);
  }


  public AdmissionUpdate(employee) {
    return this._httpClient.post("InPatient/AdmissionUpdate", employee);
  }



  // admission patient list
  public getAdmittedPatientList(employee) {
    // return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_Admtd_Ptnt_Dtls", employee)
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_Admtd_Ptnt_Dtls", employee)
  }

  public getAdmittedPatientList_1(Param,loader = true) {
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetDataSetByProc?procName=m_rtrv_Admtd_Ptnt_Dtls", Param);
  }

  // registration patient list
  public getRegistrationList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientRegistrationList", employee)
  }
  // Search Window Option

  // Doctor Master Combobox List
  public getAdmittedDoctorCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }

  // update registration
  public regUpdate(employee) {
    return this._httpClient.post("InPatient/UpdateRegisteredPatientAdmission", employee);
  }
  //Ward Master Combobox List
  public getWardNameCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_WardClassMasterForCombo", {})
  }


  //Prefix Combobox List
  public getPrefixCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrievePrefixMasterForCombo", {})
  }

  //Gender Combobox List
  public getGenderCombo(Id) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SexMasterForCombo_Conditional", { "Id": Id })
  }
  //Area Combobox List
  public getAreaCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_AreaMasterForCombo", {})
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
  public getCompanyCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveCompanyMasterForCombo", {})
  }
  public getSubTPACompCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveM_SubTPACompanyMasterForCombo", {})
  }
  public getRelationshipCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveRelationshipMasterForCombo", {})
  }
  //Deartment Combobox List
  public getDepartmentCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=m_RetrieveDepartmentMasterForCombo", {})

  }
  //Doctor Master Combobox List
  public getDoctorMasterCombo(Id) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo_Conditional", { "Id": Id })
  }
  //Doctor 1 Combobox List
  public getDoctorMaster1Combo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }

  public getDoctorMaster1() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }
  public getDoctorMaster() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }

  public getDoctorMasterNew() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartCombo_Conditional", {})
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
  //ClassName Combobox List
  public getBedClassCombo(Id) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ClassName_Conditional", { "Id": Id })
  }

  //CityName Combobox List
  public getCityList() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveCityMasterForCombo", {})
  }
  //StateName Combobox List
  public getStateList(CityId) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StateMasterForCombo_Conditional", { "Id": CityId })
  }
  //CountryName Combobox List
  public getCountryList(StateId) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_CountryMasterForCombo_Conditional", { "Id": StateId })
  }

  public getDrugList(drugValue) {
    return this._httpClient.post("Generic/GetByProc?procName=ps_RtvrDrugName", { "ItemName": drugValue })
  }

 

  public getDiagnosisList() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_M_DiagnosisMasterForCombo", {});
  }

  public getDoseList() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_DoseMasterList", {});
  }

  public onSaveCasepaper(param) {
    return this._httpClient.post("OutPatient/CasePaperPrescriptionSave", param);
  }
  populateForm(employee) {
    this.mySaveForm.patchValue(employee);
  }

  populateForm2(employee) {
    this.mySaveForm.patchValue(employee);
  }

  //new
  public casepaperVisitDetails(visitId) {
    return this._httpClient.post("Generic/GetByProc?procName=rtrv_CaseparVisitDetails", { "VisitId": visitId });
  }

  public prescriptionDetails(visitId) {
    return this._httpClient.post("Generic/GetByProc?procName=Get_PrescriptionDetailsVisitWise", { "VisitId": visitId });
  }

  public getHistoryList() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_M_PastHistoryMasterForCombo", {});
  }

  public getExaminationList() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_M_ExaminationMasterForCombo", {});
  }

  public getComplaintList() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_M_ComplaintMasterForCombo", {});
  }

  public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + query, {})
  }


  public getPrecriptionPrint(IPPreId) {
    return this._httpClient.post("Generic/GetByProc?procName=rptIPDPrecriptionPrint ", IPPreId)
  }

  public getOPDPrecriptionPrint(PrecriptionId) {
    return this._httpClient.post("Generic/GetByProc?procName=rptOPDPrecriptionPrint ", PrecriptionId)
  }
  public getAdmissionPrint(AdmissionId) {
    return this._httpClient.post("Generic/GetByProc?procName=rptAdmissionPrint1 ", AdmissionId)
  }
  public getAdmissionListPrint(AdmissionId) {
    return this._httpClient.post("Generic/GetByProc?procName=rptCurrentAdmittedList ", AdmissionId)
  }

  public GetMLCInsert(employee) {
    return this._httpClient.post("InPatient/IPMLCInsert", employee)

  }


  public GetMLCUpdate(employee) {
    return this._httpClient.post("InPatient/IPMLCUpdate", employee)

  }

  public subcompanyTPAInsert(employee) {
    return this._httpClient.post("InPatient/SubCompanyTPAInsert", employee)
  }

  public subcompanyTPAUpdate(employee) {
    return this._httpClient.post("InPatient/SubCompanyTPAUpdate", employee)
  }

  public EmergencyInsert(employee) {
    return this._httpClient.post("InPatient/IPDEmergencyRegInsert", employee)
  }
  public getVistdetailsList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Get_PrescriptionDetailsVisitWise ", employee)
  }

  public getGenderMasterCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Retrieve_GenderMasterForCombo", {})
  }

  public getOPIPPatientList(employee) {

    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_OPIPPatientList", employee)
  }

  getregisterListByRegId(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RegbyRegID", employee)
  }

  getRegdata(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_RegistrationByRegId", employee)
  }

  public getOPPatient(employee) {

    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RegistrationList", employee)
  }

  public getMLCCombo() {

    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_MLCType", {})
  }

  public getAdmittedPatientListView(FromDate, ToDate, DoctorId, WardId) {

    return this._httpClient.get("InPatient/view-Admitted_PatientList?FromDate=" + FromDate + "&ToDate=" + ToDate + "&DoctorId=" + DoctorId + "&WardId=" + WardId);
  }


  public getAdmittedPatientCasepaaperView(AdmissionId) {

    return this._httpClient.get("InPatient/view-Admitted_PatientCasepaper?AdmissionId=" + AdmissionId);
  }


  public getRegIdDetailforAdmission(data) {
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + data, {})
  }

  public getMLCDetail(data) {
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + data, {})
  }


  public getMLCDetailView(AdmissionId) {

    return this._httpClient.get("InPatient/view-IP_MLCReport?AdmissionId=" + AdmissionId);
  }

  public getCompanyIdDetail(data){
    return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
  }
  


  public CompanyUpdate(param) {
    return this._httpClient.post("InPatient/CompanyInformationUpdate", param);
  }
  public getCompanyDetailsView(AdmissionId) {

    return this._httpClient.get("InPatient/view-CompanyInformation?AdmissionId=" + AdmissionId);
  }
  
  public deactivateTheStatus(m_data) {
    return this._httpClient1.PostData("VisitDetail", m_data);
}
//new admission api 
public getMaster(mode,Id) {
  return this._httpClient1.GetData("Dropdown/GetBindDropDown?mode="+mode+"&Id="+Id);
}


public InsertNewAdmission(Param: any, showLoader = true) {
  if (Param.admissionId) {
      return this._httpClient1.PutData("Admission/AdmissionInsertSP" + Param.admissionId, Param, showLoader);
  } else return this._httpClient1.PostData("Admission/AdmissionInsertSP", Param, showLoader);
}


public getAdmittedPatientListNew(employee) {
  return this._httpClient1.PostData("Admission/AdmissionList", employee)
}  

}


// exec rptIPRefundofBillPrint 10268
// exec rptIPRefundofAdvancePrint 10043
// exec rptIPDPaymentReceiptPrint 156754

// exec rptAdmissionPrint1 10694