import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
    providedIn: 'root'
})
export class DocumentmanagementService {
    categoryForm: FormGroup;

    constructor(
        public _frombuilder: UntypedFormBuilder,
        public _httpClient: ApiCaller
    ) {
        this.categoryForm = this.createCategoryFrom()
    }
    createCategoryFrom() {
        return this._frombuilder.group({
            id: 0,
            parentId: null,
            docCategory: ['', [Validators.required]],
            icon: '',
            sortOrder: null
        })
    }
    public getCategoryTree() {
        return this._httpClient.GetData("DocumentCategory/List");
    }
    public saveCategory(Param) {
        if (Param.id > 0)
            return this._httpClient.PutData("DocumentCategory/" + Param.id, Param);
        else
            return this._httpClient.PostData("DocumentCategory/", Param);
    }
    public getCategory(id) {
        return this._httpClient.GetData("DocumentCategory/" + id);
    }
    public deleteCategory(id) {
        return this._httpClient.DeleteData("DocumentCategory?Id=" + id);
    }



    public searchPatient(keyword) {
        return this._httpClient.GetData("DocumentUpload/search-patient?Keyword=" + keyword);
    }
    public getAdmissions(PatientId) {
        return this._httpClient.GetData("DocumentUpload/patient-admissions?PatientId=" + PatientId);
    }


}
