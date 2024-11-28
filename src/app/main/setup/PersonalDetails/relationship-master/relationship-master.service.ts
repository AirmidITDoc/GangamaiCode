import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class RelationshipMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createRelationshipForm();
        this.myformSearch = this.createSearchForm();
    }

    createRelationshipForm(): FormGroup {
        return this._formBuilder.group({
            relationshipId: [""],
            relationshipName: [""],
            isActive: ["true"],
            // addBy: ["0"],
            // updatedBy: ["0"],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            RelationshipNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createRelationshipForm();
    }

    getValidationMessages() {
        return {
            relationshipName: [
                { name: "required", Message: "Relationship Name is required" },
                { name: "maxlength", Message: "Relationship name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public relationshipMasterSave(Param: any, showLoader = true) {
        if (Param.relationshipId) {
            return this._httpClient.PutData("RelationshipMaster/" + Param.relationshipId, Param, showLoader);
        } else return this._httpClient.PostData("RelationshipMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("RelationshipMaster?Id=" + m_data.toString());
    }
}
