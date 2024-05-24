import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DiscountAfterSalesBillService {

  SearchGroupForm : FormGroup;

  constructor(
    public _formbuilder: FormBuilder,
    public _httpClient: HttpClient
  ) {
    this.SearchGroupForm = this.CreaterSearchForm();
  }

  CreaterSearchForm() {
    return this._formbuilder.group({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      RegNo: [''],
      patientType: ['1'],
      PaymentType: ['1'],
      AdvanceNo: ['']
    });
  }
}
