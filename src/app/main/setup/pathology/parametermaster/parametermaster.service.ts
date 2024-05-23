import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class ParametermasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myformSearch = this.createSearchForm();
        this.myform = this.createParameterForm();
    }

    createParameterForm(): FormGroup {
        return this._formBuilder.group({
            ParameterID: [""],
            ParameterName: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
                ],
            ],
            ParameterShortName: [
                "",
                [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")],
            ],
            PrintParameterName: [
                "",
                [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")],
            ],
            UnitId: [""],
            UnitName: [""],
            IsNumeric: [""],
            IsDeleted: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            IsPrintDisSummary: ["false"],
            MethodName: ["", Validators.pattern("[a-zA-Z]+$")],
            ParaMultipleRange: [""],
            PathparaRangeId: [""],
            ParaId: [""],
            SexId: [""],
            IsDescriptive: [""],
            DefaultValue: ["", [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")]],
            parameterValues: ["", [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")]],
            IsDefaultValue: [""],
            SexID:[""],
            MinAge:[""],
            MaxAge: [""],
            MinValue: [""],
            Maxvalue: [""],
            AgeType: [""]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ParameterNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createParameterForm();
    }

    //parameter detail
    public getParameterMasterList(m_data) { 
        return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathParameterMaster_by_Name",
            m_data);
    }
     // Unit Master Combobox List
     public getUnitMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_UnitMasterForCombo",{});
    }
     // Gender Master Combobox List
     public getGenderMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=RetrieveGenderMasterForCombo",{}
        );
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.post(
            "Generic/ExecByQueryStatement?query=" + m_data, {});
    }



   

    public insertParameterMaster(param) {
        return this._httpClient.post("PathologyMaster/ParameterAgeWiseMasterSave", param);
    }

    public updateParameterMaster(param) {
        return this._httpClient.post("PathologyMaster/ParameterAgeWiseMasterUpdate", param);
    }

    //detail of Range Master

    // public getParameteragewiseMasterList() {
    //     return this._httpClient.post(
    //         "Generic/GetByProc?procName=ps_Rtrv_PathParameteragewiseMaster",
    //         { ParameterName: "" }
    //     );
    // }

    // Gender Master Combobox List
    public getParameterMaster1Combo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_PathParameterList_by_Name",
            {}
        );
    }

   

    public deleteAssignParameterToRange(param) {
        return this._httpClient.post("Pathology/ParameterUpdate", param);
    }

    //Descriptive

    public getDescriptiveMasterList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_PathParameterDescriptiveMaster_by_Name",
            { ParameterName: "%" }
        );
    }

    public InsertParameterRangeMaster(param) {
        return this._httpClient.post("ParameterAgeWiseMasterSave", param);
    }

    public getParameterMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_PathParameterList_by_Name",
            {}
        );
    }

    public deleteAssignParameterToDescriptive(param) {
        return this._httpClient.post("Pathology/ParameterUpdate", param);
    }

    public insertDescriptiveMaster(param) {
        return this._httpClient.post("Pathology/DescriptiveSave", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
