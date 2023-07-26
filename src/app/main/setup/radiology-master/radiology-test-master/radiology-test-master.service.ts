import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RadiologyTestMasterService {

  
  myform: FormGroup;

  constructor(private _httpClient: HttpClient,private _formBuilder: FormBuilder) {
    this.myform=this.createRadiologytestForm();
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

  initializeFormGroup() {
    this.createRadiologytestForm();
  }

  public getRadiologytestMasterList() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RadiologyTestList", {ServiceName:"%"})
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
