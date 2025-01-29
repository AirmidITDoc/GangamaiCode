import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class PrefixMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
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
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            sexId:["", Validators.required] ,
            isActive:[true,[Validators.required]],
        });
    }

    initializeFormGroup() {
        this.createPrefixForm();
    }

    public getPrefixMasterList(param: gridRequest) {
        return this._httpClient.PostData("PrefixMaster/List", param);
    }

    public prefixMasterSave(Param: any) {
        if (Param.prefixId) {
            return this._httpClient.PutData("PrefixMaster/" + Param.prefixId, Param);
        } else return this._httpClient.PostData("PrefixMaster", Param);
    }


    public deactivateTheStatus(m_data) {
      return this._httpClient.DeleteData("PrefixMaster?Id=" + m_data.toString());
    }
}
