import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class PhysiotherapistScheduleService {

  SearchForm :FormGroup
  SchedulerForm :FormGroup

  constructor(
   private _httpClient: HttpClient,
   private _formBuilder: FormBuilder,
   private _loaderService:LoaderService
  ) 
  { this.SearchForm = this.CreateSearchForm(),
    this.SchedulerForm = this.CreateSchedulerForm()
  }


  CreateSearchForm() {
    return this._formBuilder.group({
      FirstName: ['', [
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
     ]],
     LastName:['', [
       Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
    ]],
     start: [(new Date()).toISOString()],
     end: [(new Date()).toISOString()],
     PBillNo: '', 
     RegNo: '',
    ReceiptNo: ''
  })
}
CreateSchedulerForm(){
  return this._formBuilder.group({
    StartDate:[new Date(),Validators.required],
    EndDate:[new Date()],
    NoIntervals:['',  Validators.pattern("^[- +()]*[0-9][- +()0-9]*$")], 
    NoSessions:['',  Validators.pattern("^[- +()]*[0-9][- +()0-9]*$")],
    RegId:['']
  })
}
  public getPatientVisitedListSearch(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientVisitedListSearch", employee)
  }
public getBillsList(param, loader = true) {
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.post("Generic/GetDataSetByProc?procName=m_Rtrv_BrowseOPDBill_Pagi", param) 
}  
public getallschedulerlist(loader = true) {
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PhysioScheduleHeaderList", {}) 
}  
public getschedulerdetlist(param,loader = true) {
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PhysioScheduleDetailList", param) 
}  
 
public getBillReceipt(BillNo, loader = true) {
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("OutPatient/view-Op-BillReceipt?BillNo="+BillNo);
}
public SavePhysio(param, loader = true) {
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.post("Physiotherapy/InsertPhysiotherapy" ,param);
}
 public UpdatePhysio(param, loader = true) {
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.post("Physiotherapy/UpdatePhysiotherapy" ,param);
}
 
}
