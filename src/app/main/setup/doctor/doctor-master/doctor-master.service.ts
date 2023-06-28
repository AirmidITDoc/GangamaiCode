import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
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
            FirstName: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
                ],
            ],
            MiddleName: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
                ],
            ],
            LastName: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
                ],
            ],
            DateofBirth: [""],
            Address: [""],
            City: ["", Validators.pattern("[a-zA-Z]+$")],
            Pin: ["", [Validators.minLength(6), Validators.maxLength(6)]],
            Phone: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    Validators.minLength(10),
                    Validators.maxLength(15),
                ],
            ],
            Mobile: [
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
            IsConsultant: ["true"],
            IsRefDoc: ["true"],
            IsDeleted: ["false"],
            DoctorTypeId: [""],
            DoctorType: [""],
            AgeYear: ["", Validators.pattern("[0-9]+")],
            AgeMonth: ["", Validators.pattern("[0-9]+")],
            AgeDay: ["", Validators.pattern("[0-9]+")],
            PassportNo: [
                "",
                Validators.pattern(
                    "^[A-PR-WYa-pr-wy][1-9]\\d" + "\\s?\\d{4}[1-9]$"
                ),
            ],
            ESINO: [""],
            RegNo: [""],
            RegDate: [""],
            MahRegNo: [""],
            MahRegDate: [""],
            RefDocHospitalName: [
                "",
                Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
            ],
            Departmentid: [""],
            DepartmentName: [""],
            AddedBy: [""],
            UpdatedBy: [""],
            AddedByName: [""],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DoctorNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createdDoctormasterForm();
    }

    public getDoctorMasterList(m_data) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Rtrv_Doctor_DoctorMaster_by_Name",
            m_data
        );
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.post(
            "Generic/ExecByQueryStatement?query=" + m_data,
            {}
        );
    }

    public getDepartmentCombobox() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=RetrieveDepartmentMasterForCombo",
            {}
        );
    }

    public getGenderCombo(Id) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_SexMasterForCombo_Conditional",
            { Id: Id }
        );
    }

    public getPrefixMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=RetrievePrefixMasterForCombo",
            {}
        );
    }

    public getGenderMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=RetrieveGenderMasterForCombo",
            {}
        );
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

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
