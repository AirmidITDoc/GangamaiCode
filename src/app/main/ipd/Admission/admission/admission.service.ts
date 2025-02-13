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

    constructor(public _httpClient: HttpClient, public _httpClient1: ApiCaller,
        public _formBuilder: UntypedFormBuilder, private _loaderService: LoaderService,
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
            RegNo: "0",
            PrefixId: ['', [Validators.required]],
            FirstName: ['', [
                Validators.required,
                // Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
            ]],
            MiddleName: ['', [
                // Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
            ]],
            LastName: ['', [
                Validators.required,
                // Validators.pattern("^[A-Za-z () ]*[a-zA-z() ]*$"),
            ]],
            GenderId: new FormControl('', [Validators.required]),
            Address: '',
            DateOfBirth: [(new Date()).toISOString()],
            Age: ['0'],
            AgeYear: ['0', [
                // Validators.required,
                Validators.maxLength(3),
                // Validators.pattern("^[0-9]*$")
            ]
            ],
            AgeMonth: ['0', [
                // Validators.pattern("^[0-9]*$")
            ]],
            AgeDay: ['0', [
                // Validators.pattern("^[0-9]*$")
            ]],
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
            CountryId:  [1, [Validators.required]],
            IsCharity: false,
            IsSeniorCitizen: false,
            AddedBy: 1,
            updatedBy: 1,
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
            HospitalID: 1,
            DocNameId: ['', [Validators.required]],
            RefDocNameId: 0,
            DischargeDate: "1900-01-01",
            DischargeTime: "1900-01-01T11:24:02.655Z",
            IsDischarged: 0,
            IsBillGenerated: 0,
            CompanyId: 0,
            TariffId: [1, [Validators.required]],
            ClassId: [1, [Validators.required]],
            DepartmentId: ['', [Validators.required]],
            RelativeName: "",
            RelativeAddress: "",
            PhoneNo: ['', [Validators.required,
                Validators.minLength(10),
                Validators.maxLength(10),
                Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
                ]],
            MobileNo: ['', [Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
            ]],
            RelationshipId: 0,
            AddedBy: 1,
            IsMlc: true,
            MotherName: "",
            AdmittedDoctor1: ['', [Validators.required]],
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

            wardId: [0, [Validators.required]],
            bedId: [0, [Validators.required]],
            
            unitId:1,

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
        return this._httpClient1.PostData("Admission/AdmissionRegisteredInsertSP", employee);
    }


    public AdmissionUpdate(Id,employee) {
        debugger
        // return this._httpClient1.PutData("Admission/AdmissionUpdateSP", employee);
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


    public InsertNewAdmission(Param: any) {
        if (Param.admissionId) {
            return this._httpClient1.PutData("Admission/AdmissionInsertSP" + Param.admissionId, Param);
        } else return this._httpClient1.PostData("Admission/AdmissionInsertSP", Param);
    }


    public getAdmittedPatientListNew(employee) {
        return this._httpClient1.PostData("Admission/AdmissionList", employee)
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
    public getAdmittedPatientCasepaaperView(Param) {
        return this._httpClient1.PostData("Report/ViewReport", Param);
    }

    public getReportView(Param) {
        return this._httpClient1.PostData("Report/ViewReport", Param);
    }


    public MlcInsert(Param: any) {
        debugger
            if (Param.mlcid) {
            return this._httpClient1.PutData("MlcInformation/" + Param.mlcid, Param);
        } else return this._httpClient1.PostData("MlcInformation", Param);
    }


    public getDoctorsByDepartment(deptId) {
        return this._httpClient1.GetData("VisitDetail/DeptDoctorList?DeptId="+deptId)
    }

    

    public getMLCById(Id) {
        return this._httpClient1.GetData("MlcInformation/" + Id);
    }
}

