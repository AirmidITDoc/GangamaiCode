import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
    providedIn: 'root'
})
export class AppointmentlistService {
    myCrossConsulteForm: FormGroup;
    myformSearch: FormGroup;
    personalFormGroup: FormGroup;
    VisitFormGroup: FormGroup;

    constructor(public _httpClient1: ApiCaller, private _formBuilder: UntypedFormBuilder, private _loaderService: LoaderService,
        public _httpClient: HttpClient,
    ) {
        this.myformSearch = this.filterForm();
        // this.myCrossConsulteForm = this.createConsultatDrForm();
    }


    // new APi

    filterForm(): FormGroup {
        return this._formBuilder.group({
            RegNo: '',
            FirstName: ['', [
                Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
            ]],
            LastName: ['', [
                Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
            ]],
            DoctorId: '',
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            patientNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }


 

    createRefranceDrForm() {
        return this._formBuilder.group({
            visitId: 0,
            // regId:0,
            refDocId: ['', [
                Validators.required]],

        });
    }

   
    createPesonalForm() {
        return this._formBuilder.group({
                RegId: [0],
                RegNo: "0",
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
                GenderId: new FormControl('', [Validators.required]),
                Address: '',
                DateOfBirth: [(new Date()).toISOString()],
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
                MaritalStatusId:0,
                ReligionId: 0,
                AreaId: 0,
                CityId: ['', [Validators.required]],
                City: [''],
                StateId:  ['', [Validators.required]],
                CountryId:  [0, [Validators.required]],
                IsCharity: false,
                IsSeniorCitizen: false,
                AddedBy: 1,
                updatedBy: 1,
                RegDate: [(new Date()).toISOString()],
                RegTime: [(new Date()).toISOString()],
                Photo: [''],
                PinNo: ['']

        });

    }
    createVisitdetailForm() {
        return this._formBuilder.group({

            visitId: 0,
            regId: 0,
            visitDate: [(new Date()).toISOString()],
            visitTime: [(new Date()).toISOString()],
            UnitId: 1,
            PatientTypeId: [1, Validators.required],
            ConsultantDocId: ['',Validators.required],
            RefDocId: [0],
            TariffId: [1, Validators.required],
            CompanyId: 0,
            SubCompanyId:0,
            addedBy: 0,
            updatedBy: 0,
            isCancelledBy: 0,
            isCancelled: true,
            isCancelledDate: [(new Date()).toISOString()],
            ClassId: 1,
            DepartmentId: ['',Validators.required],
            patientOldNew: 1,
            firstFollowupVisit: 0,
            AppPurposeId: [0],
            followupDate: [(new Date()).toISOString()],
            crossConsulFlag: 0,
            phoneAppId: 0

        });
    }

    public documentuploadInsert(employee, loader = true) {
        if (loader) {
            this._loaderService.show();
        }
        return this._httpClient1.PutData("InPatient/DocAttachment", employee);
    }

    public NewappointmentSave(Param: any) {
       return this._httpClient1.PostData("VisitDetail/Insert", Param);
       
    }

    public RregisteredappointmentSave(Param: any) {

        return this._httpClient1.PostData("VisitDetail/Update", Param);
    }

    public EditConDoctor(Param: any) {

        return this._httpClient1.PutData("ConsRefDoctor/Edit/" + Param.visitId, Param);
    }

    public EditRefDoctor(Param: any) {

        return this._httpClient1.PostData("ConsRefDoctor/RefDoctorUpdate", Param);
    }
    
    public RefDoctorCancle(Param: any) {

        return this._httpClient1.PostData("ConsRefDoctor/RefDoctorUpdate", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient1.PostData("VisitDetail", m_data);
    }

    public crossconsultSave(Param: any) {
        return this._httpClient1.PostData("CrossConsultation/CrossConsultationInsert", Param);

    }

    
    // new API?

    public getAppointmentList(employee) {
        return this._httpClient1.PostData("VisitDetail/Insert", employee)
    }

    public Appointmentcancle(employee, loader = true) {

        return this._httpClient1.PostData("VisitDetail/Cancel", employee);
    }

    public getdoctorList(employee) {
        return this._httpClient1.PostData("DoctoreMaster/List", employee)
    }

    public getVisitById(Id) {
        return this._httpClient1.GetData("VisitDetail/" + Id);
    }
    public getPatientListView(mode) {
        return this._httpClient1.PostData("Report/ViewReport", mode);

    }

    public getMaster(mode, Id) {
        return this._httpClient1.GetData("Dropdown/GetBindDropDown?mode=" + mode + "&Id=" + Id);
    }

    public getAppointmenttemplateReport(Param: any) {
        return this._httpClient1.PostData("Report/ViewReport", Param);
    }

    public getRegistraionById(Id) {
        return this._httpClient1.GetData("OutPatient/" + Id);
    }

    
    public doctordepartmentData(Id) {
        return this._httpClient1.GetData("OutPatient/" + Id);
    }

    public getRegistrations(keyword) {
        return this._httpClient1.GetData("OutPatient/auto-complete?Keyword=" + keyword);
    }

    
    public getRegVisitdetail(keyword) {
        return this._httpClient1.GetData("VisitDetail/search-patient?Keyword=" + keyword);
    }

    public getReportView(Param) {
        return this._httpClient1.PostData("Report/ViewReport", Param);
      }

    

      public getDoctorsByDepartment(deptId) {
        return this._httpClient1.GetData("VisitDetail/DeptDoctorList?DeptId="+deptId)
    }
 // Get billing Service List 
//  public getBillingServiceList(employee) {
//    return this._httpClient1.PostData("VisitDetail/GetServiceListwithTraiff", employee)
// }

public getBillingServiceList(employee) {
    return this._httpClient1.PostData("VisitDetail/GetServiceListwithTraiff", employee)
 }

public InsertOPBillingCredit(employee) {
    return this._httpClient1.PostData("OPBill/OPCreditBillingInsert",employee)
}


public InsertOPBillingpayment(employee) {
    return this._httpClient1.PostData("Payment/PaymentInsert", employee)
}

  public InsertOPBilling(employee) {
        return this._httpClient1.PostData("OPBill/OPBillingInsert", employee)
    }

    public InsertVitalInfo(element){
       
        return this._httpClient1.PostData("OutPatient/UpdateVitalInformation",element)
      }

      public getLastVisitDoctorList(param) {
      
        return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PreviousDoctorVisitList", param)
    }

  
    public getstateId(Id) {
        return this._httpClient1.GetData("StateMaster/" + Id);
    }
}
