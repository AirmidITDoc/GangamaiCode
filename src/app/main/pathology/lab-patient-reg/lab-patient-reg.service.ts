import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { first } from 'lodash';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabPatientRegService {
  myFilterform: FormGroup;
  MyForm: FormGroup;

  constructor(
    public _frombuilder: UntypedFormBuilder,
    public _httpClient: ApiCaller,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  CreateSearchGroup() {
    return this._frombuilder.group({
      fromDate: [],
      enddate: [],
      firstName: [''],
      L_Name: ['']
    })
  }

  public getDoctorsByDepartment(deptId) {
    return this._httpClient.GetData("VisitDetail/DeptDoctorList?DeptId=" + deptId)
  }
  public getstateId(Id) {
    return this._httpClient.GetData("StateMaster/" + Id);
  }
  public getRegistraionById(Id) {
    return this._httpClient.GetData("OutPatient/" + Id);
  }
  public getserviceList(param) {
    return this._httpClient.PostData("PathlogySampleCollection/PathRadServiceList", param);
  }
}
