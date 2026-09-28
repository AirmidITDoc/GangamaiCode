import { Injectable } from '@angular/core';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class AuditlogsService {

  constructor(
      public _httpClient: ApiCaller,
  ) { }

    public AuditLogList(param) {
        return this._httpClient.PostData("Configuration/AuditLogList", param);
    }
}
