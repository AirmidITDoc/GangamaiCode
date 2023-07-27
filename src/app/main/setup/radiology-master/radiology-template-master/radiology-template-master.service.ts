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
    this.myformSearch=this.filterForm();
  }
 
  

  createRadiologytemplateForm(): FormGroup {
    return this._formBuilder.group({

      TemplateName:[''],
      
      TemplateId:[''],
      TemplateDesc:[''],
      RadReportID: [''],
      ReportDate:[(new Date()).toISOString()],
      ReportTime:[(new Date()).toISOString()],
      IsCompleted: ['false'],
      IsPrinted: ['flase'],
      RadResultDr1: [''],
      RadResultDr2: [''],
      RadResultDr3: [''],
      SuggestionNotes: [''],
      AdmVisitDoctorID: [''],
      RefDoctorID: [''],
      ResultEntry: [''],
      Suggatationnote:[''],
      DoctorId:['']
        });
  }

  filterForm(): FormGroup {
    return this._formBuilder.group({
    RegNoSearch:[0],
    FirstNameSearch:[''],
    LastNameSearch:[''],
    PatientTypeSearch:['1'],
    StatusSearch: ['0'],
    CategoryId:[''],
     start: [new Date().toISOString()],
     end: [new Date().toISOString()],
    });
  }


  initializeFormGroup() {
    this.createRadiologytemplateForm();
    this.filterForm();
  }

 
  public getRadiologytemplateMasterList() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_Radiology_TemplateMaster_by_Name", {TemplateName:"%"})
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
    return this._httpClient.post("Radiology/RadiologyTemplateMasterSave", employee);
  }
  
  public updateRadiologyTemplateMaster(employee) {
    return this._httpClient.post("Radiology/RadiologyTemplateMasterUpdate", employee);
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
