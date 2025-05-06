import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class RelationshipMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createRelationshipForm();
        this.myformSearch = this.createSearchForm();
    }

    createRelationshipForm(): FormGroup {
        return this._formBuilder.group({
            relationshipId: [0],
            relationshipName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    //Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            isActive:[true,[Validators.required]]
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

    public relationshipMasterSave(Param: any) {
        if (Param.relationshipId) {
            return this._httpClient.PutData("RelationshipMaster/" + Param.relationshipId, Param);
        } else return this._httpClient.PostData("RelationshipMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("RelationshipMaster?Id=" + m_data.toString());
    }
}
