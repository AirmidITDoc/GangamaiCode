import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class NewgroupMasterService {

  myGroupForm: FormGroup;

  constructor(
    public _frombuilder: FormBuilder,
    public _httpClient: HttpClient,
        public loaderService:LoaderService
  ) { 
    this.myGroupForm = this.CreateMyGroupform();
  }
  CreateMyGroupform() {
    return this._frombuilder.group({
      ICDCdeMId:[''],
      ICDName: [''],
      IsDeleted: [true],
      ICDCodeNameSearch:[''],
    })
  }

  public geticdGroupMasterList(param) {
    return this._httpClient.post(
        "Generic/GetByProc?procName=m_Rtrv_M_ICDCdeMainMaster_by_Name",param
    );
}
public deactivateTheStatus(m_data) {
  return this._httpClient.post(
      "Generic/ExecByQueryStatement?query=" + m_data,{}
  );
}
public groupMasterInsert(employee)
{    
  return this._httpClient.post("MRD/SaveMICDCdeheadMaster",employee);
}
public groupMasterUpdate(employee)
{    
  return this._httpClient.post("MRD/UpdateMICDCdeheadMaster",employee);
}
}
