import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class AuditlogsService {

  constructor(
      public _httpClient: ApiCaller,
       private _formBuilder: UntypedFormBuilder
  ) { }

    public AuditLogList(param) {
        return this._httpClient.PostData("Configuration/AuditLogList", param);
    }

     createSearchForm(): FormGroup {
        return this._formBuilder.group({
          fromDate: [(new Date()).toISOString()],
          enddate: [(new Date()).toISOString()],
        });
      }
}
