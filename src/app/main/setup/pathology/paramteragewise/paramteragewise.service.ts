import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class ParamteragewiseService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myformSearch = this.createSearchForm();
        this.myform = this.createParameterageForm();
    }

    createParameterageForm(): FormGroup {
        return this._formBuilder.group({
            PathparaRangeId: [""],
            ParaId: [""],
            ParameterName: [""],
            SexId: [""],
            GenderName: [""],
            MinAge: ["", Validators.pattern("[0-9]+")],
            MaxAge: ["", Validators.pattern("[0-9]+")],
            AgeType: [""],
            MinValue: ["", Validators.pattern("[0-9]+")],
            MaxValue: ["", Validators.pattern("[0-9]+")],
            IsDeleted: [""],
            AddedByName: [""],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ParameterIdSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createParameterageForm();
    }

    public getParameterAgeMasterList(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_PathParameterRangeWithAge",
            param
        );
    }

    // Gender Master Combobox List
    public getGenderMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=RetrieveGenderMasterForCombo",
            {}
        );
    }

    public getParameterMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_PathParameterList_by_Name",
            {}
        );
    }

    public deactivateTheStatus(param) {
        return this._httpClient.post(
            "Generic/ExecByQueryStatement?query=" + param,
            {}
        );
    }

    public insertParameterMasterAgeWise(param) {
        return this._httpClient.post(
            "PathologyMaster/ParameterAgeWiseMasterSave",
            param
        );
    }

    public updateParameterMasterAgeWise(param) {
        return this._httpClient.post(
            "PathologyMaster/ParameterAgeWiseMasterUpdate",
            param
        );
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
