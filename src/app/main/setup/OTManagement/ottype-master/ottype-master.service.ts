import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class OttypeMasterService {

  myform: FormGroup;
  myformSearch: FormGroup;

  constructor(
    private _httpClient: HttpClient,
    private _formBuilder: FormBuilder) {
    this.myform = this.createOtTypeForm();
    this.myformSearch = this.createSearchForm();
  }

  createOtTypeForm(): FormGroup {
    return this._formBuilder.group({
      OTTypeId: [''],
      TypeName: [''],
      IsDeleted: [true]
    });
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      OtTypeNameSearch: [""],
    });
  }

  public getOTTypelist(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_TypeMaster_List", employee)
  }
  public deactivateTheStatus(m_data) {
    return this._httpClient.post(
        "Generic/ExecByQueryStatement?query=" + m_data,{}
    );
  }
  public OtTypeInsert(employee)
{    
  return this._httpClient.post("OT/SaveMOTTypeMaster",employee);
}
public OtTypeUpdate(employee)
{    
  return this._httpClient.post("OT/UpdateMOTTypeMaster",employee);
}
}
