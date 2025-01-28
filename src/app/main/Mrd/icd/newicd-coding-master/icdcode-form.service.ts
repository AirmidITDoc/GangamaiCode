import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class IcdcodeFormService {

  myCodingForm: FormGroup;

  constructor(
    public _frombuilder: FormBuilder,
    public _httpClient: HttpClient,
        public loaderService:LoaderService
  ) { 
    this.myCodingForm = this.CreateMyGroupform();
  }
  CreateMyGroupform() {
    return this._frombuilder.group({
      ICDCodingId:[''],
      ICDCode:[''],
      ICDCodeName:[''],
      ICDGroupCode:[''],
      ICDCdeMId:[''],
      MainName: [''],
      ICDDescription: [''],
      IsDeleted: [true],
      ICDCodeSearch:[''],
      ICDCodeNameSearch:[''],
    })
  }
  // 
  public getPatienticdList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_PatientICDList", employee)
  }
  // 

  public geticdCodingMasterList(param) {
    return this._httpClient.post(
        "Generic/GetByProc?procName=m_Rtrv_M_ICDCdeMst_by_Name",param
    );
}
public deactivateTheStatus(m_data) {
  return this._httpClient.post(
      "Generic/ExecByQueryStatement?query=" + m_data,{}
  );
}
public getICDGroupMasterCombo() {
  debugger
  return this._httpClient.post(
      "Generic/GetByProc?procName=m_rtrv_ICdheadMasterForCombo",
      {}
  );
}
public ICDCodingInsert(employee)
{    
  return this._httpClient.post("MRD/SaveMICDCodingMaster",employee);
}
public ICDCodingUpdate(employee)
{    
  return this._httpClient.post("MRD/UpdateMICDCodingMaster",employee);
}
}
