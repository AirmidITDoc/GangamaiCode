import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class AddonMenuService {

  MyForm: FormGroup

  constructor(
    public _formbuilder: UntypedFormBuilder,
    public _httpClient: HttpClient,
    public _httpClient1: ApiCaller,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  public DetailRequestcancle(employee, loader = true) {

    return this._httpClient1.PostData("DietPatientRequest/DietPatReqDetailCanel", employee);
  }

  public Requestcancle(employee, loader = true) {

    return this._httpClient1.PostData("DietPatientRequest/DietPatientReqHeaderCancel", employee);
  }
  public getRequestlist(employee) {
    return this._httpClient1.PostData("DietPatientRequest/DietPatientRequestHeaderList", employee)
  }
  public getRequestdetaillist(employee) {
    return this._httpClient1.PostData("DietPatientRequest/DietPatientRequestDetailsList", employee)
  }
  public getSampleRecivedlist(employee) {
    return this._httpClient1.PostData("ClinicalCare/AdmisionListNursingList", employee)
  }

  public SaveDietReq(Param: any) {
    if (Param.dietReqId) {
      return this._httpClient1.PutData("DietPatientRequest/Edit/" + Param.dietReqId, Param);
    } else return this._httpClient1.PostData("DietPatientRequest/Insert", Param);
  }

  public getMenuItem(employee) {
    return this._httpClient1.PostData("DietMenuMaster/DietmenumasterList", employee)
  }
  public getdetaillist(employee) {
    return this._httpClient1.PostData("DietPatientRequest/DietPatientRequestDetailsList", employee)
  }
}