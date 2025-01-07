import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class RadioloyOrderlistService {

  myformSearch: FormGroup;
  myform: FormGroup;
  
  
  
  constructor(public _httpClient:HttpClient,public _httpClient1:ApiCaller,
      private _formBuilder: UntypedFormBuilder
      ) {
        this.myformSearch=this.filterForm();
        this.myform=this.createRadiologytemplateForm();
       }
  
    filterForm(): FormGroup {
      return this._formBuilder.group({
      RegNoSearch:[],
      FirstNameSearch:[''],
      LastNameSearch:[''],
      PatientTypeSearch:['2'],
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
    public getRadiologyPrint(RadReportId) {
      return this._httpClient.post("Generic/GetByProc?procName=rptRadiologyReportPrint", RadReportId)
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
  
    // public getRadioTestDetails(employee) {
    //   return this._httpClient.post("Generic/GetByProc?procName=Rtrv_RadioResultEntryList_Test_Dtls", employee)
    
    // }

    public getTestList(employee){
      return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathResultEntryList_Test_Dtls1", employee)
    }

    public getRadiologyTempReport(RadReportId,OP_IP_Type){
      return this._httpClient.get("Radiology/view-RadiologyTemplateReport?RadReportId=" + RadReportId + "&OP_IP_Type=" + OP_IP_Type)
          
    }
    getTemplateCombo() {
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RadioTemplateMasterForCombo", {})
    }

    public deactivateTheStatus(m_data) {
      return this._httpClient1.PostData("PhoneApp", m_data);
    }
    
}
