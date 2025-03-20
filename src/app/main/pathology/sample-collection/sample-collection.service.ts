import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SampleCollectionService {
  myformSearch: FormGroup;
  sampldetailform: FormGroup;

  constructor( private _formBuilder: UntypedFormBuilder,
    private handler: HttpBackend,private _httpClient: HttpClient,private _httpClient1: ApiCaller,)
   {  this.myformSearch = this.createSearchForm();
    
    this.sampldetailform = this.createSampledetailForm();
   }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: [],
      FirstName: ['', [
        Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
      ]],
      LastName: ['', [
      Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
      ]],
      // BillNo:[''],
      // BillDate:[''],
      PatientTypeSearch: ['0'],
      StatusSearch: ['1'],
      Istype:['2'],
      CategoryId: [''],
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      TestStatusSearch:['1']
    });
  }

  createSampledetailForm(): FormGroup {
    return this._formBuilder.group({
  SampleDateTime: [''],

    });
  }


  public getPatientSamplesList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathSamPatList", employee)
  }

  public getSampleDetailsList1(employee) {
    return this._httpClient1.PostData("PathlogySampleCollection/SampleCollectionTestList", employee)
  }

  public getSampleDetailsList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathSamColllist_Pat_Dtls", employee)
  }

  public UpdateSampleCollection(employee) {
    return this._httpClient1.PutData("PathlogySampleCollection/PathlogySampleCollectionUpdate", employee);
  }

  public InsertLabDetail(employee){

 

    this._httpClient = new HttpClient(this.handler);
    
    
    let headers = new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
    let  httpOptions = {
        
        headers: headers,
      };
    
    // let newjson={
    //   "mobile": "",
    //   "email": "",
    //   "designation": "Mrs.",
    //   "fullName": "AirmidTest",
    //   "age": 81,
    //   "gender": "Female",
    //   "area": "",
    //   "city": "",
    //   "patientType": "IPD",
    //   "labPatientId": "Airmid-12345",
    //   "pincode": " ",
    //   "patientId": "",
    //   "dob": "",
    //   "passportNo": "",
    //   "panNumber": "",
    //   "aadharNumber": "",
    //   "insuranceNo": "",
    //   "nationalityethnicity": "",
    //   "ethnicity": "",
    //   "nationalIdentityNumber": "",
    //   "workerCode": "w12",
    //   "doctorCode": "",
    //   "billDetails": {
    //       "emergencyFlag": "0",
    //       "billTotalAmount": "",
    //       "advance": "0",
    //       "billDate": "",
    //       "paymentType": "CREDIT",
    //       "referralName": " ",
    //       "otherReferral": "",
    //       "sampleId": "",
    //       "orderNumber": " ",
    //       "referralIdLH": "",
    //       "organisationName": "",
    //       "billConcession": "0",
    //       "additionalAmount": "0",
    //       "organizationIdLH": "440132",
    //       "comments": "CGHS",
    //       "testList": [
    //           {
    //               "testCode": "Blood Group & Rh Type"
    //           },
    //           {
    //               "testCode": "Blood Group & Rh Type"
    //           }
    
    //       ],
    //       "paymentList": [
    //           {
    //               "paymentType": "CREDIT",
    //               "paymentAmount": "",
    //               "chequeNo": "",
    //               "issueBank": ""
    //           }
    //       ]
    //   }
    // };
    
    //return this._httpClient.post('https://livehealth.solutions/LHRegisterBillAPI/e57fda5e-995b-11ed-ac02-0a6c65d93ce2/',newjson,httpOptions);
    
    return this._httpClient
         .post<any>("https://livehealth.solutions/LHRegisterBillAPI/e57fda5e-995b-11ed-ac02-0a6c65d93ce2/", employee, httpOptions)
         .pipe( catchError((error: HttpErrorResponse)=>{
          console.log(error);
          if (error.status === 401) {
           
          } else {
           
            return throwError(error);
          }
        }));
      }


      public deactivateTheStatus(m_data) {
        return this._httpClient1.PostData("PhoneApp", m_data);
      }
      
}

