import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class OtNoteService {

  OTNoteform: FormGroup;
       myformSearch: FormGroup;
       constructor(
           private _httpClient: ApiCaller,
           private _formBuilder: UntypedFormBuilder,
           private _FormvalidationserviceService: FormvalidationserviceService
       ) {
           this.OTNoteform = this.createReservationForm();
           //this.myformSearch = this.createSearchForm();
       }
   
       createReservationForm(): FormGroup {
         return this._formBuilder.group({

                      surgeonId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],

            surgeonId1: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],

            anestheticsDr: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],

            anestheticsDr1: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],

            surgeryId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],

            ottypeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],

            });
     }
}
