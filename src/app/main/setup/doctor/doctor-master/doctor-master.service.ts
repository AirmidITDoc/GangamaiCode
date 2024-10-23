import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable()
export class DoctorMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createdDoctormasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createdDoctormasterForm(): FormGroup {
        return this._formBuilder.group({
            DoctorId: [""],
            PrefixID: ["", Validators.required],
            PrefixName: [""],
            FirstName: ['', [
                Validators.required,
                Validators.maxLength(50),
                // Validators.pattern("^[a-zA-Z._ -]*$"),
                Validators.pattern('^[a-zA-Z () ]*$')
            ]],
            MiddleName: ['', [
                Validators.required,
                Validators.maxLength(50),
                // Validators.pattern("^[a-zA-Z._ -]*$"),
                Validators.pattern('^[a-zA-Z () ]*$')
            ]],
            LastName:['', [
                Validators.required,
                Validators.maxLength(50),
                // Validators.pattern("^[a-zA-Z._ -]*$"),
                Validators.pattern('^[a-zA-Z () ]*$')
            ]],
            DateOfBirth: [{ value: new Date() }],
            Address: [""],
            Phone: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    Validators.minLength(10),
                    Validators.maxLength(15),
                ],
            ],
            MobileNo: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^[0-9]*$"),
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            GenderId: ["", Validators.required],
            GenderName: [""],
            Education: ["", Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")],
            IsConsultant: ["1"],
            IsRefDoc: ["0"],
            isActive: ['1'],
            DoctorTypeId: [""],
            DoctorType: [""],
            PassportNo: [""],
            ESINO: [
                "",
                [
                    Validators.required,
                    //Validators.pattern("'^[a-zA-Z0-9]*$'"),
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            RegNo: [
                "",
                [
                    Validators.required,
                  //  Validators.pattern("'^[a-zA-Z0-9]*$'"),
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            RegDate: [{ value: new Date() }],
            MahRegNo: [
                "",
                [
                    Validators.required,
                  //  Validators.pattern("'^[a-zA-Z0-9]*$'"),
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            MahRegDate: [{ value: new Date() }],
            RefDocHospitalName: [
                "",
                Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
            ],
            Departmentid: [""],
            DepartmentName: [""],
            AddedBy: [""],
            UpdatedBy: [""],
            AddedByName: [""],
            Pancardno: [""],
            AadharCardNo: [""],
            AgeYear:[""],
            AgeMonth:[""],
            AgeDay:[""],
            CityId:[""]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DoctorNameSearch: [""],
            IsDeletedSearch: ["2"],
            IsConsultant: ["1"]
        });
    }

    initializeFormGroup() {
        this.createdDoctormasterForm();
    }

    public getDoctorMasterList(Param) {
        return this._httpClient.post("Generic/GetDataSetByProc?procName=m_Rtrv_DoctorMasterList_Pagi", Param);
    }

    public getSignature(Param) {
        return this._httpClient.get("DoctorMaster/get-file?FileName=" + Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.post(
            "Generic/ExecByQueryStatement?query=" + m_data,
            {}
        );
    }

    public getDepartmentCombobox() {
        return this._httpClient.post(
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
        return this._httpClient.post(
            "Generic/GetByProc?procName=RetrievePrefixMasterForCombo",
            {}
        );
    }

    public getGenderCombo(Id) {
        return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SexMasterForCombo_Conditional", { "Id": Id })
    }

    public getDoctortypeMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=RetrieveDoctorTypeMasterForCombo",
            {}
        );
    }

    public doctortMasterInsert(param) {
        return this._httpClient.post("DoctorMaster/DoctorSave", param);
    }

    public doctortMasterUpdate(param) {
        return this._httpClient.post("DoctorMaster/DoctorUpdate", param);
    }

    public assignDoctorDepartmentDet(param) {
        return this._httpClient.post("DoctorMaster/DoctorSave", param);
    }

    public deleteAssignSupplierToStore(param) {
        return this._httpClient.post("DoctorMaster/DoctorUpdate", param);
    }

    public getDocDeptwiseList(emp) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=m_Rtrv_M_DoctorDepartmentDet",
            emp
        );
    }
    //  city list
    public getCityList() {

        return this._httpClient.post("Generic/GetByProc?procName=RetrieveCityMasterForCombo", {})
    }
    populateForm(param) {
        this.myform.patchValue(param);
    }
}
