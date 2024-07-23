import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable()
export class GenderMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createGenderForm();
        this.myformSearch = this.createSearchForm();
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            GenderNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    createGenderForm(): FormGroup {
        return this._formBuilder.group({
            GenderId: [""],
            GenderName: ['', [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern('^[a-zA-Z () ]*$')
              ]],
            IsDeleted: [""],
        });
    }

    initializeFormGroup() {
        this.createGenderForm();
    }

    public getGenderMasterList(param) {
        return this._httpClient.post("Generic/GetByProc?procName=Rtrv_DB_GenderMaster",param
        );
    }

    public genderMasterInsert(Param) {
        return this._httpClient.post("PersonalDetails/GenderSave", Param);
    }

    public genderMasterUpdate(Param) {
        return this._httpClient.post("PersonalDetails/GenderUpdate", Param);
    }

    populateForm(Param) {
        this.myform.patchValue(Param);
    }
}
