import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SampleCollectionService {
  myformSearch: FormGroup;
  sampldetailform: FormGroup;

  constructor(private _httpClient: HttpClient, private _formBuilder: FormBuilder)
   {  this.myformSearch = this.createSearchForm();
    
    this.sampldetailform = this.createSampledetailForm();
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
      StatusSearch: ['0'],
      CategoryId: [''],
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      TestStatusSearch:['1']
    });
  }

  createSampledetailForm(): FormGroup {
    return this._formBuilder.group({



      Sampledate: [new Date().toISOString()],


    });
  }


  public getPatientSamplesList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathSamPatList", employee)
  }

  public getSampleDetailsList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathSamColllist_Pat_Dtls", employee)
  }

  public UpdateSampleCollection(employee) {
    return this._httpClient.post("Pathology/PathSamplecollection", employee);
  }

}

