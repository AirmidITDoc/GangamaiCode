import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SurgeryMasterService {

  myform: FormGroup;
  myformSearch: FormGroup;

  constructor(private _httpClient: HttpClient, private _formBuilder: FormBuilder) {
    this.myform = this.createSurgeryForm();
    this.myformSearch = this.createSearchForm();
  }

  createSurgeryForm(): FormGroup {
    return this._formBuilder.group({
      SurgeryId: [''],
      Site: [''],
      SurgeryName: [''],
      CategoryName: [''],
      SystemName: [''],
      TemplateName: [''],
      DepartmentName: [''],
      Amount: [''],
      Departmentid: [''],
      Systemid: [''],
      Siteid: [''],
      IsDeleted: [true],
      SurgeryCategoryId: '',
      SiteDescId: '',
    });
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      SurgeryNameSearch: [""],
    });
  }

  public getOTSurgerylist(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_SurgeryMaster_List",employee)
  }

  //Deartment Combobox List
  public getDepartmentCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveDepartmentMasterForCombo", {})
  }
  // surgery category dropdwon
  public getCategoryCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SurgeryCategoryMasterForCombo", {})
  }
  // site desc dropdown
  public getSiteCombo(param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_M_SiteDescriptionMasterForCombo_Conditional", param)
  }

  public OtSurgeryInsert(employee) {
    return this._httpClient.post("OT/SaveMOTSurgeryMaster", employee);
  }
  public OtSurgeryUpdate(employee) {
    return this._httpClient.post("OT/UpdateMOTSurgeryMaster", employee);
  }
  public deactivateTheStatus(m_data) {
    return this._httpClient.post(
        "Generic/ExecByQueryStatement?query=" + m_data,{}
    );
  }

}
