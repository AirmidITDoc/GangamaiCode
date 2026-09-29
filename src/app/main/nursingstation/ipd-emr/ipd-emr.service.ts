import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { HttpClient } from '@microsoft/signalr';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class IpdEmrService {

  MyForm: FormGroup;

  constructor(
    public _httpClient: ApiCaller,
  ) { }

  public onSaveCasepaper(param) {
    return this._httpClient.PostData("EMR/Insert", param);
  }

}
