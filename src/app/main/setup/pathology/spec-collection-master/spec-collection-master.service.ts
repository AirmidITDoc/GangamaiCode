import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: 'root'
})
export class SpecCollectionMasterService {

    currentStatus = 0
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _loggedService: AuthenticationService,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createSpecmasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createSpecmasterForm(): FormGroup {
        return this._formBuilder.group({
            specimenCollectionId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            collectionMethod: ["",
                [
                    Validators.required,
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            unitId: [this._loggedService.currentUserValue.user.unitId],
            isActive: [true, [Validators.required]]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            NameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    initializeFormGroup() {
        this.createSpecmasterForm();
    }

    public specMasterSave(Param: any) {
        if (Param.specimenCollectionId) {
            return this._httpClient.PutData("PathSpecimenCollectionMaster/" + Param.specimenCollectionId, Param);
        } else return this._httpClient.PostData("PathSpecimenCollectionMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("PathSpecimenCollectionMaster?Id=" + m_data.toString());
    }
}
