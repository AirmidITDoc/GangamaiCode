import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class InstructionmasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myForm = this.createInstructionForm();
        this.myformSearch = this.createSearchForm();
    }

    createInstructionForm(): FormGroup {
        return this._formBuilder.group({
            InstructionId: [""],
            InstructionName: [""],

            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
          InstructionNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createInstructionForm();
    }

    public getInstructionMasterList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Rtrv_M_InstructionMaster_by_Name",
            { InstructionName: "%" }
        );
    }

    public insertInstructionMaster(param) {
        return this._httpClient.post("Prescription/InstructionSave", param);
    }

    public updateInstructionMaster(param) {
        return this._httpClient.post("Prescription/InstructionUpdate", param);
    }

    populateForm(param) {
        this.myForm.patchValue(param);
    }
}
