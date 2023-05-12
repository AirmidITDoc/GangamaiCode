import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class RelationshipMasterService {
    myform: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createRelationshipForm();
    }

    createRelationshipForm(): FormGroup {
        return this._formBuilder.group({
            RelationshipId: [""],
            RelationshipName: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }

    initializeFormGroup() {
        this.createRelationshipForm();
    }

    public getrelationshipMasterList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Rtrv_M_RelationshipMaster_by_Name",
            { RelationshipName: "%" }
        );
    }

    public relationshipMasterInsert(employee) {
        return this._httpClient.post(
            "PersonalDetails/RelationshipSave",
            employee
        );
    }

    public relationshipMasterUpdate(employee) {
        return this._httpClient.post(
            "PersonalDetails/RelationshipUpdate",
            employee
        );
    }

    populateForm(employee) {
        this.myform.patchValue(employee);
    }
}
