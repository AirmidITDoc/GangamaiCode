import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class InstructionmasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myForm = this.createInstructionForm();
        this.myformSearch = this.createSearchForm();
    }

    createInstructionForm(): FormGroup {
        return this._formBuilder.group({
            InstructionId: [""],
            InstructionName: ["", 
                [
                    Validators.required, 
                    Validators.pattern("^[A-Za-z0-9]+$")
                ]
            ],

            IsDeleted: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    getValidationMessages(){
        return{
            InstructionName: [
                { name: "required", Message: "Instruction Name is required" },
                { name: "maxlength", Message: "Instruction name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        }
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

    // public getInstructionMasterList(param) {
    //     return this._httpClient.PostData(
    //         "Generic/GetByProc?procName=Rtrv_M_PrescriptionInstructionMaster",
    //         param
    //     );
    // }

    public instructionMasterInsert(Param: any, showLoader = true) {
        if (Param.InstructionId) {
            return this._httpClient.PutData("InstructionMastere/" + Param.InstructionId, Param, showLoader);
        } else
        
        return this._httpClient.PostData("InstructionMastere", Param, showLoader);
    }

    public updateInstructionMaster(param) {
        return this._httpClient.PostData("Prescription/InstructionUpdate", param);
    }

    populateForm(param) {
        this.myForm.patchValue(param);
    }
    public deactivateTheStatus(m_data) {
        //return this._httpClient.delete("generic?Id=" + m_data, {});
        return this._httpClient.PostData("generic", m_data);
    }
}
