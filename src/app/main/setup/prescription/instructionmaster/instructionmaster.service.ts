import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class InstructionmasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myForm = this.createInstructionForm();
        this.myformSearch = this.createSearchForm();
    }

    // {
    //     "instructionId": 0,
    //     "instructionDescription": "string",
    //     "instructioninMarathi": "string"
    //   }
    createInstructionForm(): FormGroup {
        return this._formBuilder.group({
            instructionId: [0],
            instructionDescription: ["", 
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            instructioninMarathi: "string",
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

    public instructionMasterInsert(Param: any, showLoader = true) {
        if (Param.instructionId) {
            return this._httpClient.PutData("InstructionMastere/" + Param.instructionId, Param, showLoader);
        } else
        return this._httpClient.PostData("InstructionMastere", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("Instruction?Id=" + m_data.toString());
    }
}
