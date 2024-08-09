import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TemplateServieService {
  myform: FormGroup;
  
  myformSearch: FormGroup;
  constructor(
    private _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) {
    this.myformSearch = this.createSearchForm();
    this.myform = this.createTemplateForm();
   }

   createSearchForm():FormGroup{
    return this._formBuilder.group({
      TemplateNameSearch: [""],
        IsDeletedSearch: ["2"],
    });
}


createTemplateForm(): FormGroup {
  return this._formBuilder.group({
      PTemplateId: [""],
      TestId: [""], 
      TemplateId:[""],
      TemplateName:[""],
      TemplateDesc:[""],
      IsDeleted:['true']
  });
}


public getTemplateMasterList(param) {
  return this._httpClient.post( "Generic/GetByProc?procName=m_Rtrv_TemplateMaster_by_Name",param );
}


  // Deactive the status
  public deactivateTheStatus(param) {
    return this._httpClient.post(
        "Generic/ExecByQueryStatement?query=" + param,
        {}
    );
}

// Test Master Combobox List
public getTestMasterCombo() {
    return this._httpClient.post(
        "Generic/GetByProc?procName=ps_Retrieve_TestMasterForCombo",
        {}
    );
}


public insertTemplateMaster(param) {
    return this._httpClient.post("PathologyMaster/PathologyTemplateMasterSave",param);
}


public updateTemplateMaster(param) {
    return this._httpClient.post(
        "PathologyMaster/PathologyTemplateMasterUpdate",
        param
    );
}

//Edit pop data
populateForm(param) {
    this.myform.patchValue(param);
}

populatePrintForm(param) {
    this.myform.patchValue(param);
}
}
