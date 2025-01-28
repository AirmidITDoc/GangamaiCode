import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
    // this.mySaveForm = this.saveForm();
  }

  filterForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: '',
      IPDNo: '',
      FirstName: '',
      MiddleName: '',
      LastName: '',
      MobileNo: '',
      searchDoctorId: 0,
      DoctorId: '0',
      DoctorID: '0',
      DoctorName: '',
      WardId: '0',
      RoomName: '',
      PatientType: '',
      patientstatus: '',
      fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],

    });
  }

  createPesonalForm() {
    return this._formBuilder.group({
      RegId: [0],
      RegNo: '',
      PrefixId: ['', [Validators.required]],
      FirstName: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
      ]],
      MiddleName: ['', [
        Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
      ]],
      LastName: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z () ]*[a-zA-z() ]*$"),
      ]],
      GenderID: new FormControl('', [Validators.required]),
      Address: '',
      DateofBirth: [(new Date()).toISOString()],
      Age: ['0'],
      AgeYear: ['0', [
        // Validators.required,
        Validators.maxLength(3),
        Validators.pattern("^[0-9]*$")]],
      AgeMonth: ['0', [
        Validators.pattern("^[0-9]*$")]],
      AgeDay: ['0', [
        Validators.pattern("^[0-9]*$")]],
      PhoneNo: ['', [Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      MobileNo: ['', [Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      aadharCardNo: ['', [Validators.required,
      Validators.minLength(12),
      Validators.maxLength(12),
      Validators.pattern("^[0-9]*$")
      ]],
      panCardNo: '',
      MaritalStatusId: '',
      ReligionId: 0,
      AreaId: 0,
      CityId: 0,
      City: ['d'],
      StateId: 0,
      CountryId: 0,
      IsCharity: false,
      IsSeniorCitizen: false,
      AddedBy: 1,
      updatedBy: 1,
      RegDate: [(new Date()).toISOString()],
      RegTime: [(new Date()).toISOString()],
      Photo: [''],
      PinNo: [''],
      IsHealthCard: 0
    });
  }

  createAdmissionForm() {
    return this._formBuilder.group({
      AdmissionId: 0,
      RegId: 0,
      AdmissionDate:  [(new Date()).toISOString()],
      AdmissionTime:  [(new Date()).toISOString()],
      PatientTypeId: 1,
      HospitalID: 1,
      DocNameId:['', [Validators.required]],
      RefDocNameId: 0,
      DischargeDate: "2024-08-10",
      DischargeTime: "2024-09-18T11:24:02.655Z",
      IsDischarged: 0,
      IsBillGenerated: 0,
      CompanyId: 0,
      TariffId: ['', [Validators.required]],
      ClassId:['', [Validators.required]],
      DepartmentId: ['', [Validators.required]],
      RelativeName: "",
      RelativeAddress: "",
      PhoneNo: "",
      MobileNo: ['', [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
        ]],
      RelationshipId: 0,
      AddedBy: 1,
      IsMlc: true,
      MotherName: "",
      AdmittedDoctor1:['', [Validators.required]],
      AdmittedDoctor2: 0,
      RefByTypeId: 0,
      RefByName: 0,
      SubTpaComId: 0,
      PolicyNo: "",
      AprovAmount: 0,
      compDOd: [(new Date()).toISOString()],
      IsOpToIpconv: true,
      RefDoctorDept: "",
      AdmissionType: 1,

      wardId: ['', [Validators.required]],
      bedId: ['', [Validators.required]],
      // ClassId: ['', [Validators.required]],

     
      IsMLC: [false],
      OPIPChange: [false],
      IsCharity: [false],
      IsSenior: [false],
      Citizen: [false],
      Emergancy: [false],
      template: [false]
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
    return this._httpClient1.PostData("Admission/AdmissionUpdateSP", employee);
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


public getRegistraionById(Id,showLoader = true) {
  return this._httpClient1.GetData("OutPatient/" + Id,showLoader);
}

public getAdmissionById(Id,showLoader = true) {
  return this._httpClient1.GetData("Admission/" + Id,showLoader);
}
}

