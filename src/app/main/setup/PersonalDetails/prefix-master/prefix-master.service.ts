
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class PrefixMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
     
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createPrefixForm();
        this.myformSearch = this.createSearchForm();
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            PrefixNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    createPrefixForm(): FormGroup {
        return this._formBuilder.group({
           
            prefixId: 0,
            prefixName: ["",
                [
                    Validators.required,Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            sexId:["",
                Validators.required
            ] ,
        });
    }
    initializeFormGroup() {
        this.createPrefixForm();
    }

    public getPrefixMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("PrefixMaster/List", param, showLoader);
    }


    public prefixMasterSave(Param: any, showLoader = true) {
        if (Param.prefixId) {
            return this._httpClient.PutData("PrefixMaster/" + Param.prefixId, Param, showLoader);
        } else return this._httpClient.PostData("PrefixMaster", Param, showLoader);
    }


    public deactivateTheStatus(m_data) {
      return this._httpClient.DeleteData("PrefixMaster?Id=" + m_data.toString());
    }
}
