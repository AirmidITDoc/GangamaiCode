import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { gridRequest } from 'app/core/models/gridRequest';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class RadiologyTestMasterService {
  myform: UntypedFormGroup;
  myformSearch: UntypedFormGroup;
  AddParameterFrom: UntypedFormGroup;

  constructor( private _httpClient: ApiCaller, private _formBuilder: UntypedFormBuilder) {
    this.myform = this.createRadiologytestForm();
    this.myformSearch = this.createSearchForm();
    this.AddParameterFrom = this.createAddparaFrom();
  }

  createRadiologytestForm(): UntypedFormGroup {
    return this._formBuilder.group({
      TestId: [''],
      TestName: ['',
        [
            Validators.required,
            Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
        ]
      ],
      PrintTestName: ['',
        [
            Validators.required,
            Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
        ]
      ],
      CategoryId: [''],
      TemplateName:[''],
      ServiceId: [''],
      IsDeleted: ['true'],

    });
  }
  createSearchForm(): UntypedFormGroup {
    return this._formBuilder.group({
      TestNameSearch: [""],
      IsDeletedSearch: ["2"],
    });
  }
  createAddparaFrom(): UntypedFormGroup {
    return this._formBuilder.group({
      TestId: [''],
      TemplateName: [""]
    });
  }
  getValidationMessages(){
    return{
      CategoryId: [
        { name: "required", Message: "CategoryName is required" }
      ],
      ServiceId: [
        { name: "required", Message: "ServiceName is required" }
      ],
      TemplateName: [
        { name: "required", Message: "TemplateName is required" }
      ]
    }
  }

  initializeFormGroup() {
    this.createRadiologytestForm();
    this.createSearchForm();
  }
  

  public gettestMasterList(param: gridRequest, showLoader = true) {
    return this._httpClient.PostData("RadiologyTest/List", param, showLoader);
}

public testMasterSave(Param: any, showLoader = true) {
  if (Param.TestId) {
      return this._httpClient.PutData("RadiologyTest/InsertEDMX" + Param.TestId, Param, showLoader);
  } else return this._httpClient.PostData("RadiologyTest/InsertEDMX", Param, showLoader);
}

// public deactivateTheStatus(m_data) {
//     return this._httpClient.PostData("test", m_data);
// }
  populateForm(employee) {
    this.myform.patchValue(employee);
  }
  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("test?Id=" + m_data.toString());
}
}
// Retrieve_RadiologyTemplateMasterForComboMasterList
