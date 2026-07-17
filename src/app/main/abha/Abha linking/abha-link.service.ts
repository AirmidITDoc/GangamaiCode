import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class AbhaLinkService {

  constructor(
    private _httpClient: ApiCaller,
    private accountService: AuthenticationService,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) { }

  createAbhaform() {
    return this._formBuilder.group({
      abhaTranId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      regId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      abhaNumber: [''],
      abhaFullName: [''],
      abhaAddress: [''],
      gender: [''],
      yearOfBirth: [''],
      verified: [0],
      isActive: [0],
      verifiedDateTime: [new Date()],
      createdBy: this.accountService.currentUserValue.userId
    });
  }

   public getAbhaById(Id) {
        return this._httpClient.GetData("PatientAbhaInformation/" + Id);
    }
}
