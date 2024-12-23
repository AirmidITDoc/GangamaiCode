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
            InstructionId: [0],
            InstructionName: ["", 
                [
                    Validators.required, 
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
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
        return this._httpClient.DeleteData("Instruction?Id=" + m_data.toString());
    }
}
