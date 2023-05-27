import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RadioloyOrderlistService {

  myformSearch: FormGroup;
  myform: FormGroup;
  
  
  
  constructor(public _httpClient:HttpClient,
      private _formBuilder: FormBuilder
      ) {
        this.myformSearch=this.filterForm();
        this.myform=this.createRadiologytemplateForm();
       }
  
    filterForm(): FormGroup {
      return this._formBuilder.group({
      RegNoSearch:[],
      FirstNameSearch:[''],
      LastNameSearch:[''],
      PatientTypeSearch:['1'],
      StatusSearch: ['0'],
      TestStatusSearch:['0'],
      CategoryId:[''],
       start: [new Date().toISOString()],
       end: [new Date().toISOString()],
      });
    }
   
    createRadiologytemplateForm(): FormGroup {
      return this._formBuilder.group({
        TemplateId: [''],
        TemplateName: [''],
        TemplateDesc: [''],
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
        DoctorId:[''],
        IsDeleted: ['false'],
        AddedBy: ['0'],
        UpdatedBy: ['0'],
        AddedByName: ['']
      });
    }

   

    public getRadiologyOrderList(employee) {
      return this._httpClient.post("Generic/GetByProc?procName=Rtrv_RadilogyResultEntryList_Ptnt_Dtls", employee)
    }  
    
    public getCategoryNameCombo()
    {
      return this._httpClient.post("Generic/getByProc?procName=Retrieve_RadiologyCategoryMasterForCombo",{})
    }
    public getRtrvtemplate(employee)
    {
      
      return this._httpClient.post("Generic/getByProc?procName=Retrive_RadiologyResultTemplate_Update",employee)
    }


    
    public getTemplate(query) {
      return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
    }
    public getRadiologyPrint(RefundId) {
      return this._httpClient.post("Generic/GetByProc?procName=rptRadiologyReportPrint", RefundId)
    }    
    populatePrintForm(employee) {
      this.myform.patchValue(employee);
    }
  
    Print(employee) {
      return this._httpClient.post("Generic/GetByProc?procName=Rtrv_RadilogyResultEntryList_Ptnt_Dtls", employee)
    }


    public getRadiologytemplateMasterList() {
      return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_Radiology_TemplateMaster_by_Name", {TemplateName:"%"})
    }
    
    public getRadiologytemplateMasterList1(employee) {
      return this._httpClient.post("Generic/GetByProc?procName=Rtrv_RadilogyResultEntryList_Ptnt_Dtls", employee)
    }
    public gettemplateCombo(Id)
    {
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RadTemplateMasterForCombo",{Id:1});
    }
    public getdoctorCombo()
    {
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PathologistDoctorMasterForCombo",{});
    }

    public RadiologyUpdate(employee) {
      return this._httpClient.post("Radiology/RadiologyTemplateResult", employee);
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
  
    public getRadioTestDetails(employee) {
      return this._httpClient.post("Generic/GetByProc?procName=Rtrv_RadioResultEntryList_Test_Dtls", employee)
    
    }

    public getTestList(employee){
      return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathResultEntryList_Test_Dtls1", employee)
    }
    
}
