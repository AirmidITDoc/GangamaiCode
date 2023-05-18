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
            AgetypeSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createParameterageForm();
    }

    public getParameterAgeMasterList(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Rtrv_PathParameterAgewiseMaster_by_Name",
            param
        );
    }

    // Gender Master Combobox List
    public getGenderMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Cmb_GenderListForCombo",
            {}
        );
    }

    public getParameterMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Cmb_ParameterNameForCombo",
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
            "Pathology/ParameterAgeWiseMasterSave",
            param
        );
    }

    public updateParameterMasterAgeWise(param) {
        return this._httpClient.post(
            "Pathology/ParameterAgeWiseMasterUpdate",
            param
        );
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
