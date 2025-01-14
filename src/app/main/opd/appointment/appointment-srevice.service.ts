import { Injectable } from '@angular/core';
import { RegInsert } from './appointment.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentSreviceService {

  public afterMethodFileSelect: Subject<any> = new Subject();
   myFilterform: FormGroup;
   mySaveForm:FormGroup;
   mycertificateForm: FormGroup;

  now = Date.now();
  sIsLoading: string = '';
  constructor(public _httpClient: HttpClient,
    private _loaderService: LoaderService,
    private _formBuilder: FormBuilder
  ) {
    this.myFilterform = this.filterForm();
    this.mycertificateForm = this.CreatePatientCertiform();
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

  CreatePatientCertiform() {
    return this._formBuilder.group({
      RegID: [''],
      PatientType: ['OP'],
      MobileNo: '',
      PatientName: '',
      ConsentName: '',
      ConsentText: [''],
      Template: [''],
      Department: [''],
      Language: ['1'],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      certificateId:''
    })
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

  // code by raksha
  //template list
  public getCertificateCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_CertificateMasterCombo", {})
  }

  public CertificateInsert(employee) {
    return this._httpClient.post("OutPatient/TCertificateInformationSave", employee);
  }

  public CertificateUpdate(employee) {
    return this._httpClient.post("OutPatient/TCertificateInformationUpdate", employee);
  }

  public getCertificateList(param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_T_CertificateInformation_List", param)
  }
  editCertficateForm(param){
    this.mycertificateForm.patchValue(param);
  }

  initializeFormGroup() {
    // this.saveForm();
}

  // Add new registration
  public regInsert(employee,loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("OutPatient/OPDRegistrationSave", employee);
}

  // update registration
  public regUpdate(employee,loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("OutPatient/OPDAppointmentInsert", employee);
}

  // Add new Appointment
  public appointregInsert(employee, loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("OutPatient/AppointmentInsert", employee);
}

  // Update  registration
  public appointregupdate(employee, loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("OutPatient/AppointmentVisitUpdate", employee);
}
  
public Appointmentcancle(employee, loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("OutPatient/AppointmentCancle", employee);
}
public documentuploadInsert(employee, loader = true){
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("InPatient/DocAttachment", employee);
}


public getVisitedList(employee,loader = true) {
    if (loader) {
        this._loaderService.show();
    }
  //  return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_OpVisitDetailsList",employee)
  return this._httpClient.post("Generic/GetByProc?procName=M_VisitDetail",employee)
}
  
public documentdownloadInsert(employee,loader = true){
    if (loader) {
        this._loaderService.show();
    }
  return this._httpClient.post("File/UploadFile", employee);
}
  // display Appointment list
  public getAppointmentList(employee, loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetDataSetByProc?procName=m_Rtrv_VisitDetailsList_1_Pagi", employee)
  }

  public getAppointmentListold(employee, loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetDataSetByProc?procName=m_Rtvr_VisitDetailsList_1", employee)
  } 
  public getRegIdDetail(data,loader = true){
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
  }
  // Doctor Master Combobox List
  public getAdmittedDoctorCombo(loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }


  // Admission Form Combobox old

  //Prefix Combobox List
  public getPrefixCombo(loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=RetrievePrefixMasterForCombo", {})
  }

  //Gender Combobox List
  public getGenderCombo(Id,loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SexMasterForCombo_Conditional", { "Id": Id })
  }

  public getGenderMasterCombo(loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveGenderMasterForCombo", {})
  }

  // Classmaster List
  public getClassMasterCombo(loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_WardClassMasterForCombo", {})
  }

  //Area Combobox List
  public getAreaCombo(loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_AreaMasterForCombo", {})
  }

  //Area Combobox List
  public getPurposeList(loader=true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PurposeMasterForCombo", {})
  }

  //Marital Combobox List
  public getMaritalStatusCombo(loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_MaritalStatusMasterForCombo", {})
  }
  //Religion Combobox List
  public getReligionCombo(loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ReligionMasterForCombo", {})
  }
  //Hospital Combobox List
  public getHospitalCombo(loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=rtrv_UnitMaster_1", {})
  }
  //Patient Type Combobox List
  public getPatientTypeCombo(loader=true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=RetrievePatientTypeMasterForCombo", {})
  }
  //Tariff Combobox List
  public getTariffCombo(loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveTariffMasterForCombo", {})
  }
  //company Combobox List
  public getCompanyCombo(loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveCompanyMasterForCombo", {})
  }
  //subtpa Combobox List
  public getSubTPACompCombo(loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveM_SubTPACompanyMasterForCombo", {})
  }
  //relationship Combobox List
  public getRelationshipCombo(loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveRelationshipMasterForCombo", {})
  }
  //Deartment Combobox List
  public getDepartmentCombo(loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_RetrieveDepartmentMasterForCombo", {})
  }
  //Doctor Master Combobox List
  public getDoctorMasterCombo(Id,loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo_Conditional",Id)
  }
  //Doctor 1 Combobox List
  public getDoctorMaster1Combo(loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorListForCombo", {})
  }
  //Doctor 2 Combobox List
  public getDoctorMaster2Combo(loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }

  public getRefDoctorMasterCombo(loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorListForCombo", {})
  }

  //Ward Combobox List
  public getWardCombo(loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RoomMasterForCombo", {})
  }
  //Bed Combobox List
  public getBedCombo(Id,loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveBedMasterForCombo_Conditional", { "Id": Id })
  }

  //  city list
  public getCityList(loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveCityMasterForCombo", {})
  }
  //state Combobox List
  public getStateList(CityId,loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StateMasterForCombo_Conditional", { "Id": CityId })
  }
  //country Combobox List
  public getCountryList(StateId,loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_CountryMasterForCombo_Conditional", { "Id": StateId })
  }
  //service Combobox List
  public getServiceList(loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ServiceMasterForCombo", {})
  }
  //registration list 
  public getRegistrationList(employee,loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientRegistrationList", employee)
  }

  public getDocPatientRegList(employee,loader = true){
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientVisitedListSearch", employee)
  }
  //registration list 
  public getPhoneAppointmentList1(employee, loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PhoneAppointmentListSearch", employee)
  }
  getuploadeddocumentsList(query,loader = true){
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  }
  getfile(Id,loader = true){
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.get("InPatient/get-file?Id="+Id)
  }

  public UpdateQueryByStatement(query,loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/ExecByQueryStatement?query="+query, {})
  }

  public getdeleteddocument(query,loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/ExecByQueryStatement?query="+query, {})
  }

  

  // public getDeptwiseDoctorMaster(){
  //   return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo", {})
  // }

  public getDeptwiseDoctorMaster(loader = true){
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo", {})
  }
  populateForm(employee,loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    this.mySaveForm.patchValue(employee);
  }

  getregisterListByRegId(employee,loader = true){
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RegbyRegID", employee)
  }

  public getTemplate(query,loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  } 
  public getOPDPrecriptionPrint(VisitId, loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=rptAppointmentPrint1", VisitId)
  }
  
  public getOPPatient(employee,loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RegistrationList", employee)
  }

    // Doctor Master Combobox List
    public getDoctorMasterComboA(loader = true) {
        if (loader) {
            this._loaderService.show();
        }
        return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
    }
    public getDoctorMasterComboList(param,loader = true) {
      if (loader) {
          this._loaderService.show();
      }
      return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_DoctorListMasterForCombo",param)
  } 
  
    public CrossConsultationInsert(element,loader = true){
        if (loader) {
            this._loaderService.show();
        }
      return this._httpClient.post("OutPatient/OPDCrossConsultationInsert",element)
    }

    public getAppointmentReport(VisitId, loader = true){
        if (loader) {
            this._loaderService.show();
        }
      return this._httpClient.get("OutPatient/view-PatientAppointment?VisitId=" + VisitId);
    }

    
    public getAppointmenttemplateReport(VisitId, loader = true){
      if (loader) {
          this._loaderService.show();
      }
    return this._httpClient.get("OutPatient/view-AppointmentTemplate?VisitId=" + VisitId);
  }

    public getDoctorMasterNew(loader = true) {
        if (loader) {
            this._loaderService.show();
        }
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartCombo_Conditional", {})
    }
    public InsertVitalInfo(element,loader = true){
      if(loader){
        this._loaderService.show();
      } 
      return this._httpClient.post("OutPatient/UpdateVitalInformation",element)
    }
    public getLastVisitDoctorList(param,loader = true) {
      if (loader) {
          this._loaderService.show();
      }
      return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PreviousDoctorVisitList", param)
  }
}
