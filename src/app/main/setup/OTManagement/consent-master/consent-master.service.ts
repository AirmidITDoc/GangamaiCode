import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ConsentMasterService {
  myform: FormGroup;
  myformSearch: FormGroup;

  constructor(
    private _httpClient: HttpClient,
    private _formBuilder: FormBuilder) {
    this.myform = this.createOtConsentForm();
    this.myformSearch = this.createSearchForm();
  }

  createOtConsentForm(): FormGroup {
    return this._formBuilder.group({
      ConsentId: [''],
      ConsentName: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      ConsentDesc: ['',
        // Validators.required
      ],
      DepartmentId: ['', [
        Validators.required
      ]],
      IsDeleted: [true]
    });
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      OtConsentNameSearch: [""],
    });
  }

  public getOTConsentList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_OTConsentMasterList", employee)
  }
  public OtConsentInsert(employee)
{    
  return this._httpClient.post("OT/SaveConsentMaster",employee);
}
public OtConsentUpdate(employee)
{    
  return this._httpClient.post("OT/UpdateConsentMaster",employee);
}
  //Deartment Combobox List
  public getDepartmentCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveDepartmentMasterForCombo", {})
}
public deactivateTheStatus(m_data) {
  return this._httpClient.post(
      "Generic/ExecByQueryStatement?query=" + m_data,{}
  );
}
}
