import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@microsoft/signalr';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class DietSchduleService {
  MyForm: FormGroup

  constructor(
    public _formbuilder: UntypedFormBuilder,
    // public _httpClient: HttpClient,
    // public _httpClient1: ApiCaller,
    // private _FormvalidationserviceService: FormvalidationserviceService,
  ) {
    this.MyForm = this.filterForm()

  }
  
      filterForm(): FormGroup {
          return this._formbuilder.group({
              RegNo: '',
              IPDNo: '',
              FirstName: ['', [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
              MiddleName: ['', [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
              LastName: ['', [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
              MobileNo: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10),]],
              searchDoctorId: '0',
              DoctorName: '',
              IsDischarge: [0],
              WardId: '0',
              RoomName: '',
              fromDate: [],
              enddate: [],
              DischargeId: [''],
  
          });
      }

}
