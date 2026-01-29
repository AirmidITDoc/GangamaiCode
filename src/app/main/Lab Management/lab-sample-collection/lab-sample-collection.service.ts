import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LabSampleCollectionService {

  myformSearch: FormGroup;
  sampldetailform: FormGroup;

  constructor(private _formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    private handler: HttpBackend, private _httpClient: HttpClient, private _httpClient1: ApiCaller,) {
    this.myformSearch = this.createSearchForm();

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
      PatientTypeSearch: ['5'],
      StatusSearch: ['0'],
      Istype: ['2'],
      CategoryId: [''],
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      TestStatusSearch: ['1'],
      UnitId: [this.accountService.currentUserValue.user.unitId]
    });
  }

  createSampledetailForm(): FormGroup {
    return this._formBuilder.group({
      SampleDateTime: [''],

    });
  }


  public getSampleCollectionlist(employee) {
    return this._httpClient1.PostData("LabPatientRegistration/LabSampleCollectionList", employee)
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
    return this._httpClient1.PutData("PathlogySampleCollection/Update", employee);
  }

  public SampleEditdate(employee) {
    return this._httpClient1.PostData("PathlogySampleCollection/UpdateSamplecollectionDatetime", employee);
  }


  public InsertLabDetail(employee) {

    this._httpClient = new HttpClient(this.handler);


    let headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
    let httpOptions = {

      headers: headers,
    };

    return this._httpClient
      .post<any>("https://livehealth.solutions/LHRegisterBillAPI/e57fda5e-995b-11ed-ac02-0a6c65d93ce2/", employee, httpOptions)
      .pipe(catchError((error: HttpErrorResponse) => {
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
  public getReportHtml(Param) {
    return this._httpClient1.PostData("Report/get-report-html", Param);
  }
}
