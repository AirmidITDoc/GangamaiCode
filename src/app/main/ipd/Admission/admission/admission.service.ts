import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { RegInsert } from 'app/main/opd/registration/registration.component';

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
        public _formBuilder: UntypedFormBuilder, private _loaderService: LoaderService,
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
            RegId: [0],
            RegNo: "0",
            PrefixId:[0, [Validators.required, notEmptyOrZeroValidator()]],
            FirstName: ['', [
                Validators.required,
                // Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            MiddleName: ['', [
                //  Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            LastName: ['', [
                Validators.required,
                // Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            GenderId: new FormControl('', [Validators.required, notEmptyOrZeroValidator()]),
            Address: '',
            DateOfBirth: [(new Date()).toISOString()],
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
            MaritalStatusId:0,
            ReligionId: 0,
            AreaId: 0,
            CityId:[0, [Validators.required, notEmptyOrZeroValidator()]],
            City: [''],
            StateId:[0, [Validators.required, notEmptyOrZeroValidator()]],
            CountryId:[0, [Validators.required, notEmptyOrZeroValidator()]],
            IsCharity: false,
            IsSeniorCitizen: false,
            AddedBy: this.accountService.currentUserValue.userId,
            updatedBy:this.accountService.currentUserValue.userId,
            RegDate: [(new Date()).toISOString()],
            RegTime: [(new Date()).toISOString()],
            Photo: [''],
            PinNo: [''],
        });
    }

    createAdmissionForm() {
        return this._formBuilder.group({
            AdmissionId: 0,
            RegId: 0,
            AdmissionDate: [(new Date()).toISOString()],
            AdmissionTime: [(new Date()).toISOString()],
            PatientTypeId: 1,
            hospitalId: 1,
            DocNameId:[0, [Validators.required, notEmptyOrZeroValidator()]],
            RefDocNameId: 0,
            DischargeDate: "1900-01-01",
            DischargeTime: "1900-01-01T11:24:02.655Z",
            IsDischarged: 0,
            IsBillGenerated: 0,
            CompanyId: 0,
            TariffId:[1, [Validators.required, notEmptyOrZeroValidator()]],
            ClassId:[0, [Validators.required, notEmptyOrZeroValidator()]],
            wardId:[0, [Validators.required, notEmptyOrZeroValidator()]],
            bedId:[0, [Validators.required, notEmptyOrZeroValidator()]],

            DepartmentId:[0, [Validators.required, notEmptyOrZeroValidator()]],
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
            RelationshipId: 0,
            AddedBy:this.accountService.currentUserValue.userId,
            IsMlc: [false],
            MotherName: "",
            AdmittedDoctor1:0,// [0, [Validators.required]],
            AdmittedDoctor2: 0,
            RefByTypeId: 0,
            RefByName: 0,
            SubTpaComId: 0,
            PolicyNo: "",
            AprovAmount: 0,
            compDOd: [(new Date()).toISOString()],
            IsOpToIpconv: false,
            RefDoctorDept: "",
            AdmissionType: 1,
          
            // unitId:1,
            // IsMLC: [false],
            // OPIPChange: [false],
            // IsCharity: [false],
            // IsSenior: [false],
            // Citizen: [false],
            // Emergancy: [false],
            // template: [false]
        });
    }
   
    createEditAdmissionForm() {
        return this._formBuilder.group({
            AdmissionId: 0,
            RegId: 0,
            AdmissionDate: [(new Date()).toISOString()],
            AdmissionTime: [(new Date()).toISOString()],
            PatientTypeId: 1,
            hospitalId: 1,
            DocNameId:[0, [Validators.required, notEmptyOrZeroValidator()]],
            RefDocNameId: 0,
            DischargeDate: "1900-01-01",
            DischargeTime: "1900-01-01T11:24:02.655Z",
            IsDischarged: 0,
            IsBillGenerated: 0,
            CompanyId: 0,
            TariffId: [1, [Validators.required]],
            ClassId: [0],
            wardId: [0],
            bedId: [0],

            DepartmentId:[0, [Validators.required, notEmptyOrZeroValidator()]],
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
            RelationshipId: 0,
            AddedBy:this.accountService.currentUserValue.userId,
            IsMlc: [false],
            MotherName: "",
            AdmittedDoctor1:0,
            AdmittedDoctor2: 0,
            RefByTypeId: 0,
            RefByName: 0,
            SubTpaComId: 0,
            PolicyNo: "",
            AprovAmount: 0,
            compDOd: [(new Date()).toISOString()],
            IsOpToIpconv: false,
            RefDoctorDept: "",
            AdmissionType: 1,
          
       
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


function notEmptyOrZeroValidator(): any {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return value > 0 ? null : { greaterThanZero: { value: value } };
      };
}