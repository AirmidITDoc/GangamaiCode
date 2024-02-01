import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RadiologyTestMasterService {

  
  myform: FormGroup;
  myformSearch: FormGroup;

  constructor(private _httpClient: HttpClient,private _formBuilder: FormBuilder) {
    this.myform=this.createRadiologytestForm();
    this.myformSearch = this.createSearchForm();
  }

  createRadiologytestForm(): FormGroup {
    return this._formBuilder.group({
      TestId: [''],
      TestName: [''],
      PrintTestName: [''],
      CategoryId:[''],
      CategoryName:[''],
      ServiceId:[''],
      ServiceID:[''],
      IsDeleted: ['false'],
      AddedBy: ['0'],
      UpdatedBy: ['0'],
      AddedByName: ['']
    });
  }
  createSearchForm(): FormGroup {
    return this._formBuilder.group({
        TestNameSearch: [""],
        IsDeletedSearch: ["2"],
    });
}

  initializeFormGroup() {
    this.createRadiologytestForm();
    this.createSearchForm();
  }
  // get Test Master list
  public getRadiologyList(param) {
    return this._httpClient.post( "Generic/GetByProc?procName=Retrieve_RadiologyTestList",
        param
    );
}
  

  // Category Master Combobox List
  public getCategoryMasterCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RadiologyCategoryMasterForCombo", {})
  }

  public insertRadiologyTestMaster(employee) {
    return this._httpClient.post("Radiology/RadiologyTestMasterSave", employee);
  }
  
  // Service Master Combobox List
  public getServiceMasterCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ServiceMasterForCombo", {})
  }

  public updateRadiologyTestMaster(employee) {
    return this._httpClient.post("Radiology/RadiologyTestMasterUpdate", employee);
  }

  populateForm(employee) {
    this.myform.patchValue(employee);
  }
}
