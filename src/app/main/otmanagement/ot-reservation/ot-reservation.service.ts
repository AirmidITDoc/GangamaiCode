import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
  providedIn: 'root'
})
export class OtReservationService {

 reservationForm: FormGroup;
     myformSearch: FormGroup;
     constructor(
         private _httpClient: ApiCaller,
         private _formBuilder: UntypedFormBuilder,
         private _FormvalidationserviceService: FormvalidationserviceService
     ) {
         this.reservationForm = this.createReservationForm();
         this.myformSearch = this.createSearchForm();
     }
 
     createReservationForm(): FormGroup {
         return this._formBuilder.group({
             cityId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
               opIpType:  ["OP"],
             cityName: ["",
                 [
                     Validators.required,
                     Validators.pattern('^[a-zA-Z0-9 ]*$'),
                     this._FormvalidationserviceService.allowEmptyStringValidator()
                 ] 
             ],
             stateId: [0, 
                 [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]
             ],
             isActive:[true,[Validators.required]]
         });
     }
     createSearchForm(): FormGroup {
         return this._formBuilder.group({
             CityNameSearch: [""],
             IsDeletedSearch: [""],
             
         });
     }
 
     initializeFormGroup() {
         this.createReservationForm();
     }
 
    
 
     public requestSave(Param: any) {
         if (Param.cityId) {
             return this._httpClient.PutData("OTBooking/Edit/" + Param.cityId, Param);
         } else return this._httpClient.PostData("OTBooking/InsertEDMX", Param);
     }
 
}
