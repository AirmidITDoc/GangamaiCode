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
    StartDate:[new Date()],
    EndDate:[new Date()],
    NoIntervals:['']
  })
}

public getBillsList(param, loader = true) {
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.post("Generic/GetDataSetByProc?procName=m_Rtrv_BrowseOPDBill_Pagi", param) 
}  
public getBillReceipt(BillNo, loader = true) {
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("OutPatient/view-Op-BillReceipt?BillNo="+BillNo);
}
}
