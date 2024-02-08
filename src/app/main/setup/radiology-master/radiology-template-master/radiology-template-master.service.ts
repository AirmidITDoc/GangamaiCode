import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RadiologyTemplateMasterService {

  myform: FormGroup;
  myformSearch: FormGroup;
  
  constructor(private _httpClient: HttpClient,private _formBuilder: FormBuilder) {
    this.myform=this.createRadiologytemplateForm();
    this.myformSearch=this.createSearchForm();
  }
 
  

  createRadiologytemplateForm(): FormGroup {
    return this._formBuilder.group({

      TemplateName:[''],
      TemplateId:[''],
      TemplateDesc:[''] ,
      IsDeleted:['true']
        });
  }
  createSearchForm(): FormGroup {
    return this._formBuilder.group({
        TemplateNameSearch: [""],
        IsDeletedSearch: ["2"],
    });
}
  // filterForm(): FormGroup {
  //   return this._formBuilder.group({
  //   RegNoSearch:[0],
  //   FirstNameSearch:[''],
  //   LastNameSearch:[''],
  //   PatientTypeSearch:['1'],
  //   StatusSearch: ['0'],
  //   CategoryId:[''],
  //    start: [new Date().toISOString()],
  //    end: [new Date().toISOString()],
  //   });
  // }


  initializeFormGroup() {
    this.createRadiologytemplateForm();
    this.createSearchForm();
  }

 
  public getRadiologytemplateMasterList() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_Radiology_TemplateMaster_by_Name", {TemplateName:"%"})
  }
  public deactivateTheStatus(m_data) {
    return this._httpClient.post("Generic/ExecByQueryStatement?query=" + m_data,{});
}
  public getRadiologytemplateMasterList1(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_Radiology_TemplateMaster_by_Name", employee)
  }
  public gettemplateCombo(Id)
  {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RadTemplateMasterForCombo",{Id:1});
  }
  public getdoctorCombo()
  {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PathologistDoctorMasterForCombo",{});
  }
  public insertRadiologyTemplateMaster(employee) { 
    return this._httpClient.post("RadiologyMaster/RadiologyTemplateMasterSave", employee);
  }
  
  public updateRadiologyTemplateMaster(employee) {
    return this._httpClient.post("RadiologyMaster/RadiologyTemplateMasterUpdate", employee);
  }

  populateForm(employee) {
    this.myform.patchValue(employee);
  }

  populatePrintForm(employee) {
    this.myform.patchValue(employee);
  }

  Print(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=ps_rpt_radiologyTemplate", employee)
  }
}
