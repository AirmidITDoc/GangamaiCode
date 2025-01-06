import { HttpClient, HttpBackend, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { throwError, Observable } from "rxjs";
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PathologyService {

  myformSearch: FormGroup;
  myform: FormGroup;

  mysamplerequstform: FormGroup;

  myShowPathologyResultForm: FormGroup;
  constructor(private handler: HttpBackend, private _httpClient: HttpClient, private _formBuilder: UntypedFormBuilder) {
    this.myform = this.createtemplateForm();
    this.myformSearch = this.createSearchForm();

    // this.mysamplerequstform = this.createSampleRequstForm();
    // // this.myShowPathologyResultForm = this.ShowPathologyResultForm();
  }

  sampldetailform

  createtemplateForm(): FormGroup {
    return this._formBuilder.group({
      TemplateId: [''],
      TemplateName: [''],
      TemplateDesc: [''],
      IsDeleted: ['false'],
      AddedBy: ['0'],
      UpdatedBy: ['0'],
      AddedByName: ['']
    });
  }


  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      RegNoSearch: [],
      FirstNameSearch: ['', [

        Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
      ]],
      LastNameSearch: ['', [

        Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
      ]],
      // BillNo:[''],
      // BillDate:[''],
      PatientTypeSearch: ['1'],
      StatusSearch: ['1'],
      CategoryId: [''],
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      TestStatusSearch: ['1'],
      IsPathOrRad: ['1'],
      Reg_No: [],
      Istype: ['0'],

    });
  }



  // createSampleRequstForm(): FormGroup {
  //   return this._formBuilder.group({


  //     Reg_No: [],
  //     Istype: ['0'],
  //     start: [new Date().toISOString()],
  //     end: [new Date().toISOString()],
  //     StatusSearch:
  //   });
  // }




  // Rtrv_PathologySampleEntryList_Ptnt_Dtls

  //  public getPatientList(employee) {
  //   return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathSamColllist_Pat_Dtls", employee)
  // }


  public PathTemplateResultentryInsert(employee) {
    return this._httpClient.post("Pathology/PathologyTemplateResult", employee);
  }




  public getPathologyDoctorMaster1Combo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PathologistDoctorMasterForCombo", {})
  }



  public getResultList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrive_PathologyResultTemplate_Update", employee)
  }





  public getRadioTestDetails(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_RadioResultEntryList_Test_Dtls", employee)

  }

  public getTestList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathResultEntryList_Test_Dtls1", employee)
  }

  public getPathTemplatePrint(No) {
    return this._httpClient.post("Generic/GetByProc?procName=rptPrintPathologyReportTemplate", No)
  }
  public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + query, {})
  }

  public getInsertStatementQuery(query) {
    return this._httpClient.post("Generic/ExecByQueryStatement?query=" + query, {})
  }


  public getSampleLabOrRadRequestList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_LabOrRadRequestList", employee)
  }
  public getSampleNursingPathRadReqDetList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_NursingPathRadReqDet", employee)
  }



  public getRadiologyList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_RadilogyResultEntryList_Ptnt_Dtls", employee)
  }

  //  public getSampleEntryList(m_data) {
  //      return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_PathologySampleEntryList_Ptnt_Dtls",m_data)
  //  }

  public getSampleEntryList(m_data) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathSamColllist_Pat_Dtls", m_data)
  }

  public getCategoryCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RadiologyCategoryMasterForCombo", {})
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


  getPathologyPrint(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=rptPathologyReportPrintMultiple", employee)
  }

  // public InsertLabDetail(employee) {



  //   this._httpClient = new HttpClient(this.handler);


  //   let headers = new HttpHeaders()
  //     .set("Content-Type", "application/json")
  //     .set("Accept", "application/json")
  //   let httpOptions = {

  //     headers: headers,
  //   };

  //   let newjson = {
  //     "mobile": "",
  //     "email": "",
  //     "designation": "Mrs.",
  //     "fullName": "Test",
  //     "age": 81,
  //     "gender": "Female",
  //     "area": "",
  //     "city": "",
  //     "patientType": "IPD",
  //     "labPatientId": "HISPATIENTID",
  //     "pincode": " ",
  //     "patientId": "",
  //     "dob": "",
  //     "passportNo": "",
  //     "panNumber": "",
  //     "aadharNumber": "",
  //     "insuranceNo": "",
  //     "nationalityethnicity": "",
  //     "ethnicity": "",
  //     "nationalIdentityNumber": "",
  //     "workerCode": "w12",
  //     "doctorCode": "",
  //     "billDetails": {
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
  //         {
  //           "testCode": "Blood Group & Rh Type"
  //         },
  //         {
  //           "testCode": "Blood Group & Rh Type"
  //         }

  //       ],
  //       "paymentList": [
  //         {
  //           "paymentType": "CREDIT",
  //           "paymentAmount": "",
  //           "chequeNo": "",
  //           "issueBank": ""
  //         }
  //       ]
  //     }
  //   };

  //   //return this._httpClient.post('https://livehealth.solutions/LHRegisterBillAPI/e57fda5e-995b-11ed-ac02-0a6c65d93ce2/',newjson,httpOptions);

  //   return this._httpClient
  //     .post<any>("https://livehealth.solutions/LHRegisterBillAPI/e57fda5e-995b-11ed-ac02-0a6c65d93ce2/", newjson, httpOptions)
  //     .pipe(catchError((error: HttpErrorResponse) => {
  //       console.log(error);
  //       if (error.status === 401) {

  //       } else {

  //         return throwError(error);
  //       }
  //     }));
  // }


}

