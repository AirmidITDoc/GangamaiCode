import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { gridRequest } from 'app/core/models/gridRequest';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class RadiologyTestMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    AddParameterFrom: FormGroup;

    constructor( private _httpClient: ApiCaller, private _formBuilder: UntypedFormBuilder) {
        this.myform = this.createRadiologytestForm();
        this.myformSearch = this.createSearchForm();
        this.AddParameterFrom = this.createAddparaFrom();
    }

    createRadiologytestForm(): FormGroup {
        return this._formBuilder.group({
            testId: [0],
            testName: [""],
            printTestName: [""],
            categoryId: [0],
            serviceId: [0],
            templateName:[""],
            mRadiologyTemplateDetails: [
                {
                    ptemplateId: 0,
                    testId: 0,
                    templateId: 0
                }
            ],
            isActive:[true,[Validators.required]]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
        TestNameSearch: [""],
        IsDeletedSearch: ["2"],
        });
    }

    createAddparaFrom(): FormGroup {
        return this._formBuilder.group({
            testId: [""],
            templateName: [""]
        });
    }

    initializeFormGroup() {
        this.createRadiologytestForm();
        this.createSearchForm();
    }
    

    public testMasterSave(Param: any) {
    if (Param.testId) {
        return this._httpClient.PutData("RadiologyTest/Edit/" + Param.testId, Param);
    } else return this._httpClient.PostData("RadiologyTest/InsertEDMX", Param);
    }

    populateForm(employee) {
        this.myform.patchValue(employee);
    }
    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("test?Id=" + m_data.toString());
    }
}
