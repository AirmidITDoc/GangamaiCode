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

    createInstructionForm(): FormGroup {
        return this._formBuilder.group({
            instructionId: [0],
            instructionDescription: ["", 
                [
                    Validators.required, Validators.maxLength(50),
                   // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            instructioninMarathi: "string",
            isActive:[true,[Validators.required]]
        });
    }
    
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            InstructionNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    initializeFormGroup() {
        this.createInstructionForm();
    }

    public instructionMasterInsert(Param: any) {
        if (Param.instructionId) {
            return this._httpClient.PutData("InstructionMastere/" + Param.instructionId, Param);
        } else
        return this._httpClient.PostData("InstructionMastere", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("InstructionMastere?Id=" + m_data.toString());
    }
}
