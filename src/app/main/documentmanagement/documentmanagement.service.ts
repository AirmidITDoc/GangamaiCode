import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { PatientFile } from 'app/core/models/documentmanagement/category.model';
import { ApiCaller } from 'app/core/services/apiCaller';
import { Observable } from 'rxjs';

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
    public getCategoryTree(id) {
        return this._httpClient.GetData("DocumentCategory/List?Id=" + id);
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

    /**
     * Fetch the file as a Blob through HttpClient so your auth interceptor
     * (Bearer token) is applied — a plain <iframe src> / <img src> would not send it.
     * TODO: adjust the endpoint to your backend.
     */
    getFileBlob(fileName: string): Observable<Blob> {
        return this._httpClient.GetDocumentFile(`DocumentUpload/get-file?FileName=${fileName}`);
    }



    public searchPatient(keyword) {
        return this._httpClient.GetData("DocumentUpload/search-patient?Keyword=" + keyword);
    }
    public getAdmissions(PatientId) {
        return this._httpClient.GetData("DocumentUpload/patient-admissions?PatientId=" + PatientId);
    }
    public saveDocument(Param) {
        return this._httpClient.PostFromData("DocumentUpload/upload-files", { model: Param });
    }
    public getDocuments() {
        return this._httpClient.GetData("DocumentUpload/get-files");
    }
    public getAdmissionDocuments(admissionId: number, categoryId: number) {
        return this._httpClient.GetData("DocumentUpload/get-admission-files?AdmissionId=" + admissionId + "&CategoryId=" + categoryId);
    }
    public getPatientFiles(patientId: number) {
        return this._httpClient.GetData("DocumentUpload/get-patient-files?PatientId=" + patientId);
    }

}
