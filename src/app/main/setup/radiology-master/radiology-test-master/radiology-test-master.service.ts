import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RadiologyTestMasterService {
  myform: FormGroup;
  myformSearch: FormGroup;
  AddParameterFrom: FormGroup;

  constructor(private _httpClient: HttpClient, private _formBuilder: FormBuilder) {
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
  // get Test Master list
  public getRadiologyList(param) {
    return this._httpClient.post("Generic/GetDataSetByProc?procName=m_Rtrv_RadiologyTestList", param);
  }


  // Category Master Combobox List
  public getCategoryMasterCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RadiologyCategoryMasterForCombo", {})
  }

  public insertRadiologyTestMaster(employee) {
    return this._httpClient.post("RadiologyMaster/RadiologyTestMasterSave", employee);
  }

  // Service Master Combobox List
  public getServiceMasterCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RathTestListForCombo", {})
  }

  // TemplateMaster Combobox List dropdown
  public gettemplateMasterCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RadiologyTemplateMasterForComboMaster", {})
  }

  // TemplateMaster Combobox List
  public gettemplateMasterComboList(param) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RadiologyTemplateMasterForComboMasterList", param)
  }
  public updateRadiologyTestMaster(employee) {
    return this._httpClient.post("RadiologyMaster/RadiologyTestMasterUpdate", employee);
  }
  public deactivateTheStatus(m_data) {
    return this._httpClient.post(
        "Generic/ExecByQueryStatement?query=" + m_data, {});
}
  populateForm(employee) {
    this.myform.patchValue(employee);
  }
}
