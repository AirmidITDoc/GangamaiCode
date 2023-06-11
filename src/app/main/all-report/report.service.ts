import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  myFilterform: FormGroup;

  
  constructor(public _httpClient:HttpClient,
    public _formBuilder: FormBuilder) {
      this.myFilterform=this.filterForm();
    }


  filterForm(): FormGroup {
    return this._formBuilder.group({
    
      UserName:'' ,
      DoctorName: '',
      LastName: '',
      SrvcName: '',
      GroupName: '',
      DepartmentName: '',
      PatientTypeSearch:'1',
      ReportTypeSearch:'1',
      patientstatus:'',
      Departmentid:'',
      DoctorID:'',
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
    });
  }

    //Doctor 1 Combobox List
    public getDoctorMaster1Combo() {
      return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
    }
    //Deartment Combobox List
    public getDepartmentCombo() {
      return this._httpClient.post("Generic/GetByProc?procName=RetrieveDepartmentMasterForCombo", {})
     
    }

    
  // Get billing Service List 
  public getBillingServiceList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveServices",employee)
   
  }

  public getServiceMaster1Combo(){
    
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ServiceMasterForCombo",{})
  }

  public getDocwiseGrouprptPrint(m_data){
    return this._httpClient.post("Generic/GetByProc?procName=rptDoctorWiseGroupWise", m_data)
  }

  public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  } 

  public getBillSummaryWithTCSPrint(m_data){
    return this._httpClient.post("Generic/GetByProc?procName=rptBillwithTCS", m_data)
  }

  public getBillWithTCSTemplates(m_data){
    return this._httpClient.post("Generic/GetByProc?procName=rptBillwithTCS", m_data)
  }

  public getDocWisepatientcountrint(m_data){
    return this._httpClient.post("Generic/GetByProc?procName=RptDoctorWisePatientCount", m_data)
  }
}
