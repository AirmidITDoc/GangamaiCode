
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class PrescriptionclassmasterService {
    prescriptionForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        // this.prescriptionForm = this.createPrescriptionclassForm();
        this.myformSearch = this.createSearchForm();
    }

    createPrescriptionclassForm(): FormGroup {
        return this._formBuilder.group({
            ClassId: [""],
            ClassName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isActive: ["true"]
            // AddedBy: ["0"],
            // UpdatedBy: ["0"],
            // AddedByName: [""],
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

    getValidationMessages() {
        return {
            ClassName: [
                { name: "required", Message: "Class Name is required" },
                { name: "maxlength", Message: "Class Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public prescriptionClassMasterSave(Param: any, showLoader = true) {
        if (Param.classId) {
            return this._httpClient.PutData("Priscriptionclass/" + Param.ClassId, Param, showLoader);
        } else return this._httpClient.PostData("Priscriptionclass", Param, showLoader);
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
        this.prescriptionForm.patchValue(param);
    }
}
