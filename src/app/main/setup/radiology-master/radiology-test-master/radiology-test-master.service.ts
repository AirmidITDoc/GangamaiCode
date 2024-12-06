import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { gridRequest } from 'app/core/models/gridRequest';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class RadiologyTestMasterService {
  myform: FormGroup;
  myformSearch: FormGroup;
  AddParameterFrom: FormGroup;

  constructor( private _httpClient: ApiCaller, private _formBuilder: FormBuilder) {
    this.myform = this.createRadiologytestForm();
    this.myformSearch = this.createSearchForm();
    this.AddParameterFrom = this.createAddparaFrom();
  }

  createRadiologytestForm(): FormGroup {
    return this._formBuilder.group({
      TestId: [''],
      TestName: [''],
      PrintTestName: [''],
      CategoryId: [''],
      //TemplateName:[''],
      ServiceId: [''],
      IsDeleted: ['true'],

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
      TestId: [''],
      TemplateName: [""]
    });
  }

  initializeFormGroup() {
    this.createRadiologytestForm();
    this.createSearchForm();
  }
  

  public gettestMasterList(param: gridRequest, showLoader = true) {
    return this._httpClient.PostData("RadiologyTest/List", param, showLoader);
}

public testMasterSave(Param: any, id: string ,showLoader = true) {
    if(id)
        return this._httpClient.PutData("test/"+ id, Param, showLoader);
    else
        return this._httpClient.PostData("test", Param, showLoader);       
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
