import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class SalesReturnInPatientService {
 
  constructor(
    public _httpClient1: ApiCaller,
           private _loaderService: LoaderService,
  ) { }



  public getSalesReturnitemlist(param) {
    return this._httpClient1.PostData("Common", param)
  }
  public InsertSalesReturnInPatient(employee,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient1.PostData("SalesReturn/SalesReturnInPatient", employee)
  } 
  public getReportView(Param) {
     return this._httpClient1.PostData("Report/ViewReportFromDB", Param);
  }
}



