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

  public onSaveFamilyData(param) {
    // if (param[0].regId) {
      return this._httpClient.PostData("EMR/SaveFamilyHistory", param);
    // } return this._httpClient.PostData("EMR/InsertFamilyHistory", param);
  }

  public getEmrId(id) {
    return this._httpClient.GetData("EMR/" + id);
  }

  public getFamilyHistory(param) {
    return this._httpClient.PostData("EMR/FamilyMedicalHistoryList", param);
  }
}
