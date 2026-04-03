import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { gridRequest } from 'app/core/models/gridRequest';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class CashlessDashboardService {
  myformSearch: FormGroup;
  constructor(public _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder
  ) {
    this.myformSearch = this.createSearchForm();
  }

  public getCashlessCountSummaryList(Param: gridRequest) {
    return this._httpClient.PostData("CashLess/CashlessCountSummaryList", Param)
  }
  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
    });
  }
}
