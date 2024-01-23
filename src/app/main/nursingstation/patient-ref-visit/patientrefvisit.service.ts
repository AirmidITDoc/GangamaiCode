import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PatientrefvisitService {

  constructor(  public _httpClient:HttpClient,
    private _formBuilder: FormBuilder) { 
      this.myFilterform = this.filterForm();
    }

    myFilterform: FormGroup;

    
  filterForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: '',
      // IPDNo: '',
      FirstName: '',
      LastName: '',
      // AdmDisFlag:0,
      // OP_IP_Type:1,
      // IPNumber:1,
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
    });
  }
  public getOPIPPatientList(employee) {

    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_OPIPPatientList", employee)
  }
}
