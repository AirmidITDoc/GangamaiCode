import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class TestmasterService {
    is_Test = true;
    is_subtest = false;
    is_templatetest= false;
    myformSearch: FormGroup;
    myform: FormGroup;
    AddParameterFrom: FormGroup;
    mytemplateform: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myformSearch = this.createSearchForm();
        this.myform = this.createPathtestForm();
        this.AddParameterFrom = this.createAddparaFrom();
        this.mytemplateform = this.createTemplateForm();
    }

    createPathtestForm(): FormGroup {
        return this._formBuilder.group({

            TestId: [""],
            TestName: [""],
            PrintTestName: [""],
            CategoryId: [""],
            TechniqueName: [""],
            MachineName: [""],
            SuggestionNote: [""],
            FootNote: [""],
            ServiceID: [""],
            ServiceName: [""],
            IsTemplateTest: ["0"],
            IsCategoryPrint: [""],
            IsPrintTestName: [""],
            ParameterId: [""],
            ParaId: [""],
            ParameterName: [""],
            IsDeleted: ["true"],
            UpdatedBy: [""],
            AddedBy: [""],
            action: [""],
            parametertxt: [""],
            PTemplateId: [""],
            IsSubTest: ["true"],
            Status:[1],
            ParameterNameSearch:[""]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TestNameSearch: [""],
            IsDeletedSearch: ["2"],
            IsSubTest: [" "],
        });
    }
    createAddparaFrom(): FormGroup {
        return this._formBuilder.group({
            ParameterName: [""],
            NewIsSubTest: [" "],
        });
    }
    createTemplateForm(): FormGroup {
        return this._formBuilder.group({
            TemplateId:[""],
            TemplateName:[""],
        });
    }
      
    initializeFormGroup() {
        this.createPathtestForm();
    }
    
    getValidationMessages() {
        return {
            testName: [
                { name: "required", Message: "Unit Name is required" },
                { name: "maxlength", Message: "Unit name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public unitMasterSave(Param: any, showLoader = true) {
        if (Param.unitId) {
            return this._httpClient.PutData("PathUnitMaster/" + Param.unitId, Param, showLoader);
        } else return this._httpClient.PostData("PathUnitMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("PathUnitMaster", m_data);
    }
}

