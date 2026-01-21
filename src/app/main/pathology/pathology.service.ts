import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class PathologyService {

  myformSearch: FormGroup;
  myform: FormGroup;

  mysamplerequstform: FormGroup;

  myShowPathologyResultForm: FormGroup;
  constructor(private handler: HttpBackend, private _httpClient: ApiCaller, private _formBuilder: UntypedFormBuilder) {
    this.myform = this.createtemplateForm();
    this.myformSearch = this.createSearchForm();
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
      IsPathOrRad: ['0'],
      Reg_No: [],
      Istype: ['1'],

    });
  }

  createSampleRequstForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: [],
      Istype: ["1"],
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      IsCompleted: '0',
      IsPathOrRad: ['1'],
    });
  }


  public PathTemplateResultentryInsert(employee) {
    return this._httpClient.PostData("Pathology/PathologyTemplateResult", employee);
  }

  public getsamplerequestlist(employee) {
    return this._httpClient.PostData("PathlogySampleCollection/LabOrRadRequestPatientList", employee)
  }

}

