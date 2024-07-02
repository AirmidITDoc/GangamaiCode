import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DischargeCancelService {
  DischargeForm : FormGroup;
  constructor(
    public _formbuilder:FormBuilder,
    public _httpClient:HttpClient
  )
   { this.DischargeForm = this.CreateDischargeForm()}

   CreateDischargeForm(){
    return this._formbuilder.group({
      RegNo: '',
      IPDNo: '',
      FirstName: '',
      MiddleName: '',
      LastName: '',
      MobileNo: '',
      searchDoctorId: '',
      DoctorId: '0',
      DoctorID: '0',
      DoctorName: '',
      WardId: '0',
      RoomName: '',
      PatientType: '',
      patientstatus: '',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
   }
}
