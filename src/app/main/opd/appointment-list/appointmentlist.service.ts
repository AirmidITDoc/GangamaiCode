import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class AppointmentlistService {
    myCrossConsulteForm: FormGroup;
    myformSearch: FormGroup;
    personalFormGroup: FormGroup;
    VisitFormGroup: FormGroup;

    constructor(public _httpClient1: ApiCaller, private _formBuilder: UntypedFormBuilder, private _loaderService: LoaderService,
        public _httpClient: HttpClient,  private accountService: AuthenticationService , private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myformSearch = this.filterForm();
       
    }


    filterForm(): FormGroup {
        return this._formBuilder.group({
            RegNo: '',
            FirstName: ['', [
                     Validators.maxLength(50),
             Validators.pattern("^[A-Za-z / () ]*$")
                
            ]],
            LastName: ['', [
                     Validators.maxLength(50),
           Validators.pattern("^[A-Za-z / () ]*$")
            ]],
            DoctorId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            fromDate:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
            enddate:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            patientNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
 createPesonalForm() {
        return this._formBuilder.group({
                RegId: [0],
                RegNo: "0",
                PrefixId: ['', [Validators.required]],
                FirstName: ['', [
                    Validators.required,
                 Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z/() ]*$")          
                ]],
                MiddleName: ['', [
                   Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z/() ]*$")
                ]],
                LastName: ['', [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z/() ]*$")
                ]],
                GenderId: new FormControl('', [Validators.required]),
                Address: ['',[this._FormvalidationserviceService.allowEmptyStringValidator()]],
                DateOfBirth:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
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
                aadharCardNo: ['', [
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
                AddedBy:this.accountService.currentUserValue.userId,
                updatedBy: this.accountService.currentUserValue.userId,
                RegDate: [(new Date()).toISOString()],
                RegTime: [(new Date()).toISOString()],
                Photo: [''],
                PinNo: ['']

        });

    }

    createVisitdetailForm() {
        return this._formBuilder.group({

            visitId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            regId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            visitDate:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
            visitTime:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
            PatientTypeId:  [1, [Validators.required]],// this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            UnitId: [this.accountService.currentUserValue.user.unitId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            ConsultantDocId:  [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            RefDocId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            TariffId:  [1, [Validators.required]],// this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            CompanyId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            SubCompanyId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            addedBy: [this.accountService.currentUserValue.userId,this._FormvalidationserviceService.notEmptyOrZeroValidator()],
            updatedBy: [this.accountService.currentUserValue.userId,this._FormvalidationserviceService.notEmptyOrZeroValidator()],
            isCancelledBy: 0,
            isCancelled: true,
            isCancelledDate: [(new Date()).toISOString()],
            ClassId: [1, [Validators.required]],// this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            DepartmentId:  [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            patientOldNew: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            firstFollowupVisit: 0,
            AppPurposeId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            followupDate: [(new Date()).toISOString()],
            crossConsulFlag: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            phoneAppId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],

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

        return this._httpClient1.PutData("VisitDetail/ConsultantDoctorUpdate/" + Param.visitId, Param);
    }

    public EditRefDoctor(Param: any) {

        return this._httpClient1.PutData("VisitDetail/RefDoctorUpdate", Param);
    }
    
    public RefDoctorCancle(Param: any) {

        return this._httpClient1.PutData("VisitDetail/RefDoctorUpdate", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient1.PostData("VisitDetail", m_data);
    }

    public crossconsultSave(Param: any) {
        return this._httpClient1.PostData("VisitDetail/CrossConsultationInsert", Param);

    }


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

    public getPhoneappById(Id) {
        return this._httpClient1.GetData("PhoneAppointment2/" + Id);
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

    public InsertVitalInfo(visitId,element){
        
           return this._httpClient1.PutData("VisitDetail/EditVital/"+visitId,element);
    } 
    
    
    public getLastVisitDoctorList(param) {
      
        return this._httpClient1.PostData("VisitDetail/OPprevDoctorVisitList", param)
    }

  
    public getstateId(Id) {
        return this._httpClient1.GetData("StateMaster/" + Id);
    }
}
