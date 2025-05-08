import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable()
export class DoctorMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createdDoctormasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createdDoctormasterForm(): FormGroup {
        return this._formBuilder.group({
            doctorId: [0],
            prefixId: [0,[ Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            // PrefixName: [""],
            firstName: ['', [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern("^[A-Za-z ]*$")
            ]],
            middleName: ['', [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern("^[A-Za-z ]*$")
            ]],
            lastName: ['', [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern("^[A-Za-z ]*$")
            ]],
            // DateOfBirth: [{ value: new Date() }],
            dateofBirth: [(new Date()).toISOString()],
            address: ["", Validators.required],
            city: [0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            pin:["0"],
            phone: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),                    
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            mobile:["0"],
            genderId: [0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            // GenderName: [""],
            education: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z ]*$")
                ]
            ],
            isConsultant: [true],
            isRefDoc: [false],
            isActive: [true],
            doctorTypeId: [0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            // DoctorType: [""],
            ageYear: ['0', [
                Validators.maxLength(3),
                Validators.pattern("^[0-9]*$")]],
            ageMonth: ['0', [
                Validators.pattern("^[0-9]*$")]],
            ageDay: ['0', [
                Validators.pattern("^[0-9]*$")]],
            passportNo: ["0"],
            esino: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            regNo: [
                "",
                [
                    Validators.required,
                    //    Validators.pattern("'^[a-zA-Z0-9]*$'"),
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            // RegDate: [{ value: new Date() }],
            // regDate: [(new Date()).toISOString()],
            regDate: [new Date()],
            mahRegNo: [
                "",
                [
                    Validators.required,
                    //    Validators.pattern("'^[a-zA-Z0-9]*$'"),
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            mahRegDate: [(new Date()).toISOString()],
            refDocHospitalName: [
                "",
                [
                    Validators.required
                ]
            ],
            isInHouseDoctor: true,
            isOnCallDoctor: true,
            panCardNo: ["", [Validators.required,Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
            aadharCardNo: ["",
                [
                    Validators.required,
                    Validators.pattern("^[0-9]*$"),
                    Validators.minLength(12),
                    Validators.maxLength(12),
                ]
            ],
            signature:"",
            mDoctorDepartmentDets: [[], Validators.required],
            // DepartmentName: [""],
            // AddedBy: [""],
            // UpdatedBy: [""],
            // AddedByName: [""],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            firstName: [""],
            lastName: [""],
            IsDeletedSearch: ["2"],
            IsConsultant: [true],
            IsRef: [false],
            FlagActive:["2"]
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
        if (Param.doctorId) {
            return this._httpClient.PutData("Doctor/Edit/" + Param.doctorId, Param);
        } else return this._httpClient.PostData("Doctor/InsertEDMX", Param);
    }

    public doctortMasterUpdate(param) {
        return this._httpClient.PostData("DoctorMaster/DoctorUpdate", param);
    }
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
