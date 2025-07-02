import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class DoctorMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,    private formBuilder: FormBuilder,
        private _formBuilder: UntypedFormBuilder
    ) {
        // this.myform = this.createdDoctormasterForm();
        this.myformSearch = this.createSearchForm();
    }

    // createdDoctormasterForm(): FormGroup {
    //     return this._formBuilder.group({
    //         DoctorId: [0],
    //         PrefixID: ["", Validators.required],
    //         PrefixName: [""],
    //         FirstName: ['', [
    //             Validators.required,
    //             Validators.maxLength(50),
    //             Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
    //         ]],
    //         MiddleName: ['', [
    //             Validators.required,
    //             Validators.maxLength(50),
    //             Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
    //         ]],
    //         LastName: ['', [
    //             Validators.required,
    //             Validators.maxLength(50),
    //             Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
    //         ]],
    //         DateOfBirth: [{ value: new Date() }],
    //         Address: ["", Validators.required],
    //         Phone: [
    //             "",
    //             [
    //                 Validators.required,
    //                 Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
    //                 Validators.minLength(10),
    //                 Validators.maxLength(15),
    //             ],
    //         ],
    //         GenderId: ["", Validators.required],
    //         GenderName: [""],
    //         Education: ["",
    //             [
    //                 Validators.required,
    //                 Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
    //             ]
    //         ],
    //         IsConsultant: [true],
    //         IsRefDoc: [false],
    //         isActive: [true],
    //         DoctorTypeId: ["", Validators.required],
    //         DoctorType: [""],
    //         PassportNo: [""],
    //         esino: [
    //             "",
    //             [
    //                 Validators.required,
    //                 // Validators.pattern("'^[a-zA-Z0-9]*$'"),
    //                 Validators.minLength(10),
    //                 Validators.maxLength(10),
    //             ],
    //         ],
    //         RegNo: [
    //             "",
    //             [
    //                 Validators.required,
    //                 //    Validators.pattern("'^[a-zA-Z0-9]*$'"),
    //                 Validators.minLength(10),
    //                 Validators.maxLength(10),
    //             ],
    //         ],
    //         RegDate: [{ value: new Date() }],
    //         MahRegNo: [
    //             "",
    //             [
    //                 Validators.required,
    //                 //    Validators.pattern("'^[a-zA-Z0-9]*$'"),
    //                 Validators.minLength(10),
    //                 Validators.maxLength(10),
    //             ],
    //         ],
    //         MahRegDate: [{ value: new Date() }],
    //         RefDocHospitalName: [
    //             "",
    //             [
    //                 Validators.required
    //             ]
    //         ],

    //         MDoctorDepartmentDets: ["", Validators.required],
    //         DepartmentName: [""],
    //         AddedBy: [""],
    //         UpdatedBy: [""],
    //         AddedByName: [""],
    //         Pancardno: ["", Validators.required],
    //         AadharCardNo: ["",
    //             [
    //                 Validators.required,
    //                 Validators.pattern("^[0-9]*$"),
    //                 Validators.minLength(12),
    //                 Validators.maxLength(12),
    //             ]
    //         ],
    //         City: ["", Validators.required],
    //         ageYear: ['0', [
    //             Validators.maxLength(3),
    //             Validators.pattern("^[0-9]*$")]],
    //         ageMonth: ['0', [
    //             Validators.pattern("^[0-9]*$")]],
    //         ageDay: ['0', [
    //             Validators.pattern("^[0-9]*$")]],

    //         mDoctorDepartmentDets: this.formBuilder.array([]), // FormArray for details
    //         mDoctorQualificationDetails: this.formBuilder.array([]), // FormArray for charges
    //         mDoctorScheduleDetails: this.formBuilder.array([]), // FormArray for details
    //         mDoctorChargesDetails: this.formBuilder.array([]), // FormArray for charges
    //     });
    // }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DoctorNameSearch: ["",   Validators.pattern("^[A-Za-z/() ]*$")],
            lastName:["",   Validators.pattern("^[A-Za-z/() ]*$")],
            // IsDeletedSearch: ["2"],
            FlagActive:["1"],
            IsConsultant: [true],
            IsRef:[false]
        });
    }

    initializeFormGroup() {
        // this.createdDoctormasterForm();
    }

    public getDoctorMasterList(Param) {
        return this._httpClient.PostData("Generic/GetDataSetByProc?procName=m_Rtrv_DoctorMasterList_Pagi", Param);
    }
    public getDoctorById(Id) {
        return this._httpClient.GetData("Doctor/" + Id);
    }

    public getSignature(Param) {
        return this._httpClient.GetData("Doctor/get-file?FileName=" + Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("Doctor?Id=" + m_data.toString());
    }

    public getDepartmentCombobox() {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=m_Rtrv_DepartmentListDocMasterForCombo",
            {}
        );
    }

    // public getGenderCombo(Id) {
    //     return this._httpClient.post(
    //         "Generic/GetByProc?procName=Retrieve_SexMasterForCombo_Conditional",
    //         { Id: Id }
    //     );
    // }

    public getPrefixMasterCombo() {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=RetrievePrefixMasterForCombo",
            {}
        );
    }

    public getGenderCombo(Id) {
        return this._httpClient.PostData("Generic/GetByProc?procName=Retrieve_SexMasterForCombo_Conditional", { "Id": Id })
    }

    public getDoctortypeMasterCombo() {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=RetrieveDoctorTypeMasterForCombo",
            {}
        );
    }

    public doctortMasterInsert(Param: any) {
        debugger
        if (Param.DoctorId) {
            return this._httpClient.PutData("Doctor/Edit/" + Param.DoctorId, Param);
        } else 
        return this._httpClient.PostData("Doctor/InsertEDMX", Param);
    }

    public doctortMasterUpdate(param) {
        return this._httpClient.PostData("DoctorMaster/DoctorUpdate", param);
    }

    public deleteAssignSupplierToStore(param) {
        return this._httpClient.PostData("DoctorMaster/DoctorUpdate", param);
    }

    public getDocDeptwiseList(emp) {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=m_Rtrv_M_DoctorDepartmentDet",
            emp
        );
    }
    //  city list
    public getCityList() {

        return this._httpClient.PostData("Generic/GetByProc?procName=RetrieveCityMasterForCombo", {})
    }
    populateForm(param) {
        this.myform.patchValue(param);
    }


    public getSchduleList(employee) {
       return this._httpClient.PostData("Doctor/DoctorScheduleDetailList",employee);
    }

    public getexperienceList(employee) {
       return this._httpClient.PostData("Doctor/DoctorExperienceDetailList",employee);
    }

    public getEducationList(employee) {
       return this._httpClient.PostData("Doctor/DoctorQualificationDetailList",employee);
    }

    public getChargesList(employee) {
       return this._httpClient.PostData("Doctor/DoctorChargesDetailList",employee);
    }

    public EducationSave(Param: any) {
        if (Param.RegId) {
            return this._httpClient.PostData("OutPatient/RegistrationUpdate", Param);
        } else return this._httpClient.PostData("OutPatient/RegistrationInsert", Param);
    }
     public ExperienceSave(Param: any) {
        if (Param.RegId) {
            return this._httpClient.PostData("OutPatient/RegistrationUpdate", Param);
        } else return this._httpClient.PostData("OutPatient/RegistrationInsert", Param);
    }

  public schduleSave(Param: any) {
        if (Param.RegId) {
            return this._httpClient.PostData("OutPatient/RegistrationUpdate", Param);
        } else return this._httpClient.PostData("OutPatient/RegistrationInsert", Param);
    }
    
     public DrchargesSave(Param: any) {
        if (Param.RegId) {
            return this._httpClient.PostData("OutPatient/RegistrationUpdate", Param);
        } else return this._httpClient.PostData("OutPatient/RegistrationInsert", Param);
    }
}
