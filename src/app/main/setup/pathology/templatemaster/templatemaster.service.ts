import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class TemplatemasterService {
    myform: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createTemplateForm();
    }

    createTemplateForm(): FormGroup {
        return this._formBuilder.group({
            PTemplateId: [""],
            TestId: [""],
            TestName: [""],
            TemplateId: [""],
        });
    }

    initializeFormGroup() {
        this.createTemplateForm();
    }

    public getTemplateMasterList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Rtrv_PathTemplateMaster_by_Name1",
            {}
        );
    }

    // Deactive the status
    public deactivateTheStatus(param) {
        return this._httpClient.post(
            "Generic/ExecByQueryStatement?query=" + param,
            {}
        );
    }

    // Test Master Combobox List
    public getTestMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Retrieve_TestMasterForCombo",
            {}
        );
    }

    // Insert Perfix Master
    public insertTemplateMaster(param) {
        return this._httpClient.post(
            "PathologyMaster/PathologyTemplateMasterSave",
            param
        );
    }

    // Update Perfix Master
    public updateTemplateMaster(param) {
        return this._httpClient.post(
            "PathologyMaster/PathologyTemplateMasterUpdate",
            param
        );
    }

    //Edit pop data
    populateForm(param) {
        this.myform.patchValue(param);
    }

    populatePrintForm(param) {
        this.myform.patchValue(param);
    }

    Print(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_rpt_radiologyTemplate",
            param
        );
    }
}
