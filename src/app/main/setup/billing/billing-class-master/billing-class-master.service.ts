import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class BillingClassMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createClassForm();
        this.myformSearch = this.createSearchForm();
    }

    createClassForm(): FormGroup {
        return this._formBuilder.group({
            classId: [0],
            className: ["", 
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isActive:[true,[Validators.required]]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ClassNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createClassForm();
    }

    public classMasterSave(Param: any, showLoader = true) {
        if (Param.classId) {
            return this._httpClient.PutData("ClassMaster/" + Param.classId, Param, showLoader);
        } else return this._httpClient.PostData("ClassMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ClassMaster?Id=" + m_data.toString());
    }
    
}
