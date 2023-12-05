import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class PrescriptionclassmasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
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

    public getPrescriptionclassMasterList(Param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_M_Prescription_TemplateMaster_By_Name",Param
        );
    }

    public prescriptionTemplateMasterInsert(param) {
        return this._httpClient.post(
            "Prescription/PrescriptionTemplateMasterSave",
            param
        );
    }

    public prescriptionTemplateMasterUpdate(param) {
        return this._httpClient.post(
            "Prescription/PrescriptionTemplateMasterUpdate",
            param
        );
    }

    populateForm(param) {
        this.myForm.patchValue(param);
    }
}
