import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoaderService } from "app/core/components/loader/loader.service";
import { HttpService } from "app/core/http/http.service";

@Injectable()
export class GenderMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpService,
        private _formBuilder: FormBuilder,
                public loaderService: LoaderService
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
                // Validators.required,
                // Validators.maxLength(50),
                // Validators.pattern('^[a-zA-Z () ]*$')
              ]],
            IsDeleted: [true],
        });
    }

    initializeFormGroup() {
        this.createGenderForm();
    }

    populateForm(Param) {
        this.myform.patchValue(Param);
    }

    public getGenderMasterList(Param) {
        return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_DB_GenderMaster", Param);
    }

    public genderMasterInsert(Param: any) {
        return this._httpClient.post("PersonalDetails/GenderSave", Param);
    }

    public genderMasterUpdate(Param: any) {
        return this._httpClient.post("PersonalDetails/GenderUpdate", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.post(
            "Generic/ExecByQueryStatement?query=" + m_data,{}
        );
      }
}
