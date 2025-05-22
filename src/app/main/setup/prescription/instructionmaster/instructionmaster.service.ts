import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoaderService } from "app/core/components/loader/loader.service";

@Injectable({
    providedIn: "root",
})
export class InstructionmasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder,
                private _loadService:LoaderService
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

    public getInstructionMasterList(param,loader = true) {
        if(loader){
            this._loadService.show()
        }
        return this._httpClient.post(
            "Generic/GetByProc?procName=m_Rtrv_PrescriptionInstructionMaster_list",
            param
        );
    }

    public insertInstructionMaster(param,loader = true) {
        if(loader){
            this._loadService.show()
        }
        return this._httpClient.post("Prescription/InstructionSave", param);
    }

    public updateInstructionMaster(param,loader = true) {
        if(loader){
            this._loadService.show()
        }
        return this._httpClient.post("Prescription/InstructionUpdate", param);
    }

    populateForm(param) {
        this.myForm.patchValue(param);
    }
}
