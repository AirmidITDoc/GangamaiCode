import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class DoctorMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createdDoctormasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createdDoctormasterForm(): FormGroup {
        return this._formBuilder.group({
            DoctorId: [0],
            PrefixID: ["", Validators.required],
            PrefixName: [""],
            FirstName: ['', [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
            ]],
            MiddleName: ['', [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
            ]],
            LastName: ['', [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
            ]],
            DateOfBirth: [{ value: new Date() }],
            Address: ["", Validators.required],
            Phone: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    Validators.minLength(10),
                    Validators.maxLength(15),
                ],
            ],
            GenderId: ["", Validators.required],
            GenderName: [""],
            Education: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            IsConsultant: [true],
            IsRefDoc: [false],
            isActive: [true],
            DoctorTypeId: ["", Validators.required],
            DoctorType: [""],
            PassportNo: [""],
            esino: [
                "",
                [
                    Validators.required,
                    // Validators.pattern("'^[a-zA-Z0-9]*$'"),
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            RegNo: [
                "",
                [
                    Validators.required,
                    //    Validators.pattern("'^[a-zA-Z0-9]*$'"),
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            RegDate: [new Date()],
            MahRegNo: [
                "",
                [
                    Validators.required,
                    //    Validators.pattern("'^[a-zA-Z0-9]*$'"),
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            MahRegDate: [new Date()],
            RefDocHospitalName: [
                "",
                [
                    Validators.required
                ]
            ],
            MDoctorDepartmentDets: ["", Validators.required],
            DepartmentName: [""],
            AddedBy: [""],
            UpdatedBy: [""],
            AddedByName: [""],
            Pancardno: ["", Validators.required],
            AadharCardNo: ["",
                [
                    Validators.required,
                    Validators.pattern("^[0-9]*$"),
                    Validators.minLength(12),
                    Validators.maxLength(12),
                ]
            ],
            City: ["", Validators.required]
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
        return this._httpClient.PostData("Generic/GetDataSetByProc?procName=m_Rtrv_DoctorMasterList_Pagi", Param);
    }
    public getDoctorById(Id) {
        return this._httpClient.GetData("Doctor/" + Id);
    }

    public getSignature(Param) {
        return this._httpClient.GetData("Doctor/get-file?FileName=" + Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData(
            "Generic/ExecByQueryStatement?query=" + m_data,
            {}
        );
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

    public doctortMasterInsert(Param: any, showLoader = true) {
        if (Param.DoctorId) {
            return this._httpClient.PutData("Doctor/Edit/" + Param.DoctorId, Param, showLoader);
        } else return this._httpClient.PostData("Doctor/InsertEDMX", Param, showLoader);
    }

    public doctortMasterUpdate(param) {
        return this._httpClient.PostData("DoctorMaster/DoctorUpdate", param);
    }

    //     public doctortMasterUpdate(Param: any, showLoader = true) {
    //       if (Param.regId) {
    //           return this._httpClient.PutData("DoctorMaster/DoctorUpdate" + Param.regId, Param, showLoader);
    //       } else return this._httpClient.PostData("DoctorMaster/DoctorUpdate", Param, showLoader);
    //   }

    public assignDoctorDepartmentDet(param) {
        return this._httpClient.PostData("Doctor/InsertEDMX", param);
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
}
