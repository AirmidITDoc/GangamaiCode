import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class BedMasterService {
    
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createBedForm();
        this.myformSearch = this.createSearchForm();
    }

    createBedForm(): FormGroup {
        return this._formBuilder.group({
            bedId:[0],
            bedName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            roomId: ["",
                Validators.required
            ],
            isAvailible: true,
            isActive:[false,[Validators.required]]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            BedNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createBedForm();
    }

    public bedMasterSave(Param: any, showLoader = true) {
        if (Param.bedId) {
            return this._httpClient.PutData("BedMaster/" + Param.bedId, Param, showLoader);
        } else return this._httpClient.PostData("BedMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("BedMaster?Id=" + m_data.toString());
    }
}
