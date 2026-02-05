import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: 'root'
})
export class DoctorMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller, private formBuilder: FormBuilder,
        private _formBuilder: UntypedFormBuilder, private accountService: AuthenticationService,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        // this.myform = this.createdDoctormasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DoctorNameSearch: ["", Validators.pattern("^[A-Za-z/() ]*$")],
            lastName: ["", Validators.pattern("^[A-Za-z/() ]*$")],
            // IsDeletedSearch: ["2"],
            FlagActive: ["1"],
            // IsConsultant: [true],
            // IsRef: [false]
            DoctorType: ["0"],       
            IsInHouseDoctor: [0],
            IsConsultant: [0],
            IsRefDoc: [0]
        });
    }

    createExectiveForm(): FormGroup {
        return this._formBuilder.group({
            id: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            doctorId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            employeId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            createdBy: this.accountService.currentUserValue.userId,
            modifiedBy: this.accountService.currentUserValue.userId
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
        return this._httpClient.PostData("Doctor/DoctorScheduleDetailList", employee);
    }

    public getexperienceList(employee) {
        return this._httpClient.PostData("Doctor/DoctorExperienceDetailList", employee);
    }

    public getEducationList(employee) {
        return this._httpClient.PostData("Doctor/DoctorQualificationDetailList", employee);
    }

    public getChargesList(employee) {
        return this._httpClient.PostData("Doctor/DoctorChargesDetailList", employee);
    }

    public getleaveList(employee) {
        return this._httpClient.PostData("Doctor/DoctorLeaveDetailList", employee);
    }


    public getsignpageById(data) {
        return this._httpClient.PostData("Doctor/DoctorSignpagelist", data);
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

    public getSignData(refId, refType) {
        return this._httpClient.GetData("Files/get-signature?RefId=" + refId + "&RefType=" + refType);
    }
    public doctorExecSave(Param: any) {
        if (Param.id) {
            return this._httpClient.PutData("Doctor/DoctorExecutiveLinkInfo/" + Param.id, Param);
        } else return this._httpClient.PostData("Doctor/DoctorExecutiveLinkInfo", Param);
    }
}
