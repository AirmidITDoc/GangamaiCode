import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class OpAdvanceService {

  myFilterform: FormGroup;

  constructor(
    public _httpClient: HttpClient, 
    public _httpClient1: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _loaderService: LoaderService,
  ) {
    this.myFilterform = this.filterForm();
  }

  filterForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: '',
      OPDNo: '',
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
