import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class PrescriptionclassmasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myForm = this.createPrescriptionclassForm();
        this.myformSearch = this.createSearchForm();
    }

    createPrescriptionclassForm(): FormGroup {
        return this._formBuilder.group({
            TemplateId: [""],
            TemplateName: [""],
            TemplateDesc: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
          TemplateNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createPrescriptionclassForm();
    }

   
    public getgenericMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("GenericMaster/List", param, showLoader);
    }

    public genericMasterInsert(Param: any, showLoader = true) {
        return this._httpClient.PostData("Generic", Param, showLoader);
    }

    public genericMasterUpdate(id: number , Param: any, showLoader = true) {
        //return this._httpClient.put("generic/" + id , Param, showLoader);
        return this._httpClient.PostData("Generic", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        //return this._httpClient.delete("generic?Id=" + m_data, {});
        return this._httpClient.PostData("generic", m_data);
    }
    populateForm(param) {
        this.myForm.patchValue(param);
    }
}
