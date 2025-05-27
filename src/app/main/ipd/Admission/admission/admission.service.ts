import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { RegInsert } from 'app/main/opd/registration/registration.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class AdmissionService {

    myFilterform: FormGroup;
    mySaveForm: FormGroup;
    populateFormpersonal(registerObj: RegInsert) {
        throw new Error('Method not implemented.');
    }

    constructor(public _httpClient: HttpClient, public _httpClient1: ApiCaller,  private accountService: AuthenticationService,
        public _formBuilder: UntypedFormBuilder, private _loaderService: LoaderService, private _FormvalidationserviceService: FormvalidationserviceService
    ) {this.myFilterform = this.filterForm();}

    filterForm(): FormGroup {
        return this._formBuilder.group({
            RegNo: '',
            IPDNo: '',
            FirstName: ['', [
                // Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            Validators.pattern("^[A-Za-z/() ]*$")
           ]],
            MiddleName:  ['', [
                // Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            Validators.pattern("^[A-Za-z/() ]*$")
           ]],
            LastName:  ['', [
                // Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            Validators.pattern("^[A-Za-z/() ]*$")
           ]],
            MobileNo:  ['', [
                Validators.minLength(10),
                Validators.maxLength(10),
                Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
                ]],
            searchDoctorId: 0,
            DoctorId: '0',
            DoctorID: '0',
            DoctorName: '',
            WardId: '0',
            RoomName: '',
            PatientType: '',
            patientstatus: '',
            fromDate:[],// [(new Date()).toISOString()],
            enddate:[],// [(new Date()).toISOString()],

        });
    }

    createPesonalForm() {
        return this._formBuilder.group({
            RegId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            RegNo:['',[this._FormvalidationserviceService.allowEmptyStringValidator()]],
            PrefixId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
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
            GenderId: new FormControl(0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]),
            Address:['',[this._FormvalidationserviceService.allowEmptyStringValidator(),Validators.maxLength(150)]],
            DateOfBirth:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
            Age: ['0'],
            AgeYear: ['0', [
               Validators.maxLength(3),
               ]
            ],
            AgeMonth: ['0'],
            AgeDay: ['0'],
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
            MaritalStatusId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            ReligionId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            AreaId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            CityId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            City: [''],
            StateId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            CountryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            IsCharity: false,
            IsSeniorCitizen: false,
            AddedBy:[this.accountService.currentUserValue.userId,this._FormvalidationserviceService.notEmptyOrZeroValidator()],
            updatedBy:[this.accountService.currentUserValue.userId,this._FormvalidationserviceService.notEmptyOrZeroValidator()],
            RegDate: [(new Date()).toISOString()],
            RegTime: [(new Date()).toISOString()],
            Photo: [''],
            PinNo: [''],
        });
    }
    // this.accountService.currentUserValue.user.unitId
    createAdmissionForm() {
        return this._formBuilder.group({
            AdmissionId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            RegId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            AdmissionDate: [(new Date()).toISOString()],
            AdmissionTime: [(new Date()).toISOString()],
            PatientTypeId: [1, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            hospitalId: [this.accountService.currentUserValue.user.unitId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            DocNameId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            RefDocNameId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            DischargeDate: "1900-01-01",
            DischargeTime: "1900-01-01T11:24:02.655Z",
            IsDischarged: 0,
            IsBillGenerated: 0,
            CompanyId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            TariffId:[1, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            ClassId:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            wardId:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            bedId:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

            DepartmentId:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            RelativeName: "",
            RelativeAddress: "",
            PhoneNo: ['', [
                Validators.minLength(10),
                Validators.maxLength(10),
                Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
                ]],
            MobileNo: ['', [
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
            ]],
            RelationshipId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            AddedBy:[this.accountService.currentUserValue.userId,[this._FormvalidationserviceService.onlyNumberValidator()]],
            IsMlc: [false],
            MotherName: "",
            AdmittedDoctor1:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            AdmittedDoctor2:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            RefByTypeId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            RefByName: 0,
            SubTpaComId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            PolicyNo: "",
            AprovAmount: 0,
            compDOd: [(new Date()).toISOString()],
            IsOpToIpconv: false,
            RefDoctorDept: "",
            AdmissionType: 0,
          
            // unitId:1,
            IsMLC: [false],
            OPIPChange: [false],
            IsCharity: [false],
            IsSenior: [false],
            // Citizen: [false],
            // Emergancy: [false],
            // template: [false]
        });
    }
   
  
    public AdmissionNewInsert(employee) {
        return this._httpClient1.PostData("Admission/AdmissionInsertSP", employee);
    }

    public AdmissionRegisteredInsert(employee) {
        return this._httpClient1.PostData("Admission/AdmissionRegInsertSP", employee);
    }


    public AdmissionUpdate(Id,employee) {
     return this._httpClient1.PutData("Admission/Edit/"+Id,employee);
    }


    populateForm(employee) {
        this.mySaveForm.patchValue(employee);
    }

    populateForm2(employee) {
        this.mySaveForm.patchValue(employee);
    }


    public deactivateTheStatus(m_data) {
        return this._httpClient1.PostData("VisitDetail", m_data);
    }
    //new admission api 
    public getMaster(mode, Id) {
        return this._httpClient1.GetData("Dropdown/GetBindDropDown?mode=" + mode + "&Id=" + Id);
    }


    // public InsertNewAdmission(Param: any) {
    //     if (Param.admissionId) {
    //         return this._httpClient1.PutData("Admission/AdmissionInsertSP" + Param.admissionId, Param);
    //     } else return this._httpClient1.PostData("Admission/AdmissionInsertSP", Param);
    // }


    public getAdmittedPatientListNew(employee) {
        return this._httpClient1.PostData("Admission/AdmissionList", employee)
    }

    public MlcInsert(Param: any) {
        if (Param.mlcid) {
            return this._httpClient1.PutData("MlcInformation/" + Param.mlcid, Param);
        } else return this._httpClient1.PostData("MlcInformation", Param);
    }
    
    public subcompanyTPAInsert(Param: any) {
        if (Param.subCompanyId) {
            return this._httpClient1.PutData("SubTpaCompany/" + Param.subCompanyId, Param);
        } else return this._httpClient1.PostData("SubTpaCompany", Param);
    }

    public getDoctorsByDepartment(deptId) {
        return this._httpClient1.GetData("VisitDetail/DeptDoctorList?DeptId="+deptId)
    }

    

    public getMLCById(Id) {
        return this._httpClient1.GetData("MlcInformation/" + Id);
    }

    public getstateId(Id) {
        return this._httpClient1.GetData("StateMaster/" + Id);
    }

    public getRegistraionById(Id) {
        return this._httpClient1.GetData("OutPatient/" + Id);
    }

    public getAdmissionById(Id) {
        return this._httpClient1.GetData("Admission/" + Id);
    }

    public getRegistrations(keyword) {
        return this._httpClient1.GetData("OutPatient/auto-complete?Keyword=" + keyword);
    }

    public CompanyUpdate(param) {
        return this._httpClient1.PostData("VisitDetail/DeptDoctorList",param)
    }
}


