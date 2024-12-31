import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class OttableMasterService {

  myform: FormGroup;
  myformSearch: FormGroup;

  constructor(private _httpClient: HttpClient,private _formBuilder: FormBuilder) {
    this.myform=this.createOtTableForm();
    this.myformSearch=this.createSearchForm();
  }

  createOtTableForm(): FormGroup {
    return this._formBuilder.group({
      OtTableId:[''],
      OtRoomName:[''],
      Locationid:[''],
      IsDeleted:['true']
    });
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      OtRoomNameSearch: [""],
    });
}
public getLocationMasterCombo() {
  debugger
  return this._httpClient.post(
      "Generic/GetByProc?procName=RetrieveLocationMasterForCombo",
      {}
  );
}
public getOTTableListlist(employee) {
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_OTTableMasterList",employee)
}
public OtTableInsert(employee)
{    
  return this._httpClient.post("OT/SaveOTTableMaster",employee);
}
public OtTableUpdate(employee)
{    
  return this._httpClient.post("OT/UpdateOTTableMaster",employee);
}
public OtTableCancle(employee)
{
  return this._httpClient.post("OT/CancelOTTableMaster", employee);
}
}
