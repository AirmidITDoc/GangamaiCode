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
    if (param.ipdEmrId) {
      return this._httpClient.PutData("EMR/Edit/" + param.ipdEmrId, param);
    } return this._httpClient.PostData("EMR/Insert", param);
  }

  public getEmrId(id) {
    return this._httpClient.GetData("EMR/" + id);
  }

  public getRelationshipCombo(param) {
    return this._httpClient.PostData("RelationshipMaster/List", param);
  }

  public getGenderCombo(param) {
    return this._httpClient.PostData("Gender/List", param);
  }

}
