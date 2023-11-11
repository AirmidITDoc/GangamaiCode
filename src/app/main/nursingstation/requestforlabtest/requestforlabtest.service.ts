import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RequestforlabtestService {
  myFormGroup: any;
  

  constructor(
    public _httpClient:HttpClient,
    private _FormBuilder:FormBuilder,
    private handler: HttpBackend
  ) { this.mySearchForm = this.SearchFilterForm();}

  mySearchForm:FormGroup;

  SearchFilterForm():FormGroup{
    return this._FormBuilder.group({
      startdate :[(new Date()).toISOString()],
      enddate :[(new Date()).toISOString()],
      RegNo :''
    })

  }

  public getRequesttList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_LabRequest_Nursing",Param)
  }

  public getRequestdetList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_NursingLabRequestDetails",Param)
  }
  public getAdmittedPatientList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PatientAdmittedListSearch", employee)
  }
  public getServiceList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathRadServiceList",Param)
  }
  public LabRequestSave(employee) {
    return this._httpClient.post("InPatient/IPPathOrRadiRequest", employee);
  }

  paymentBaseUrl = 'https://www.plutuscloudserviceuat.in:8201/API/CloudBasedIntegration/V1';
  USER_ENDPOINT ='https://www.plutuscloudserviceuat.in:8201/API/CloudBasedIntegration/V1/UploadBilledTransaction'
  

  public payOnline(req) {

    console.log(req)
    this._httpClient = new HttpClient(this.handler);
    debugger
     const HTTP_OPTIONS = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Access-Control-Allow-Credentials' : 'true',
        'Access-Control-Allow-Origin': 'http://localhost:4200',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
      })
    };
    
    // let headers = new HttpHeaders()
    //     .set("Content-Type", "application/json")
    //     .set("Accept", "application/json")
    //     .set("Access-Control-Allow-Origin", '*')
    //     .set("Access-Control-Allow-Origin",'http://localhost:4200')
    //     .set("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT")
    //     .set('Access-Control-Allow-Credentials', 'true')
    //     .set('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With')
    // let  httpOptions = {
        
    //     headers: headers,
    //   };
      
    return this._httpClient.post("https://www.plutuscloudserviceuat.in:8201/API/CloudBasedIntegration/V1/UploadBilledTransaction", req, HTTP_OPTIONS)
    // return this._httpClient.post("" + 'create',null, HTTP_OPTIONS)
    .pipe( catchError((error: HttpErrorResponse)=>{
      console.log(error);
      if (error.status === 401) {
       
      } else {
       
        return throwError(error);
      }
     }));
  }
 
}


// return this._httpClient
// .post<any>("https://livehealth.solutions/LHRegisterBillAPI/e57fda5e-995b-11ed-ac02-0a6c65d93ce2/", employee, httpOptions)
// .pipe( catchError((error: HttpErrorResponse)=>{
//  console.log(error);
//  if (error.status === 401) {
  
//  } else {
  
//    return throwError(error);
//  }
// }));
// }
