import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class GenderMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myformSearch = this.createSearchForm();
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            GenderNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    createGenderForm() {
        return this._formBuilder.group({
            genderId: [0],
            genderName: ['', [
                Validators.required, Validators.maxLength(50),
                Validators.pattern('^[a-zA-Z () ]*$')
            ]],
        });
    }
  

    public genderMasterSave(Param: any, showLoader = true) {
        if (Param.genderId) {
            return this._httpClient.PutData("Gender/" + Param.genderId, Param, showLoader);
        } else return this._httpClient.PostData("Gender", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        debugger
        return this._httpClient.DeleteData("Gender?Id=" + m_data.toString());
    }
}
