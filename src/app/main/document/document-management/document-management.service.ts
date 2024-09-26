import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class DocumentManagementService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createdocumentnanagementForm();
        //this.myformSearch = this.createSearchForm();
    }

    createdocumentnanagementForm(): FormGroup {
        return this._formBuilder.group({
            Id: [""],
            UpId: [""],
            DocType: [""],
            ShortCode: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    // createSearchForm(): FormGroup {
    //     return this._formBuilder.group({
    //         documentnanagementNameSearch: [""],
    //         IsDeletedSearch: ["2"],
    //     });
    // }
    initializeFormGroup() {
        this.createdocumentnanagementForm();
    }

    public getdocumentnanagementList(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_documentnanagementNameList_by_Name",
            param
        );
    }

    public documentnanagementInsert(param) {
        return this._httpClient.post("Document/DocumentTypSave", param);
    }

    public documentnanagementUpdate(param) {
        return this._httpClient.post("Document/DocumentTypUpdate", param);
    }
    
    public documentnanagemenList() {
        return this._httpClient.post(`Generic/GetByProc?procName=Rtrv_DocTypeList`, {})
    };

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
