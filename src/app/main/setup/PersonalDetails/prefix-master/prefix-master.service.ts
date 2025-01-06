
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class PrefixMasterService {
    myform: UntypedFormGroup;
    myformSearch: UntypedFormGroup;

    constructor(
     
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _httpClient1: HttpClient
    ) {
        this.myform = this.createPrefixForm();
        this.myformSearch = this.createSearchForm();
    }

    createSearchForm(): UntypedFormGroup {
        return this._formBuilder.group({
            PrefixNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    createPrefixForm(): UntypedFormGroup {
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

    // Gender Master Combobox List
    // public getGenderMasterCombo() {
    //     debugger
    //     return this._httpClient1.post(
    //         "Generic/GetByProc?procName=RetrieveGenderMasterForCombo",
    //         {}
    //     );
    // }

    public prefixMasterSave(Param: any, showLoader = true) {
        if (Param.prefixId) {
            return this._httpClient.PutData("PrefixMaster/" + Param.prefixId, Param, showLoader);
        } else return this._httpClient.PostData("PrefixMaster", Param, showLoader);
    }


    public deactivateTheStatus(m_data) {
      return this._httpClient.DeleteData("PrefixMaster?Id=" + m_data.toString());
    }
}
