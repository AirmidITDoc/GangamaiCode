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
            //  cityId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            //    opIpType:  ["OP"],
            //  cityName: ["",
            //      [
            //          Validators.required,
            //          Validators.pattern('^[a-zA-Z0-9 ]*$'),
            //          this._FormvalidationserviceService.allowEmptyStringValidator()
            //      ] 
            //  ],
            //  stateId: [0, 
            //      [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]
            //  ],
            //  isActive:[true,[Validators.required]]: 
            otreservationId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            reservationDate:[new Date()],
            reservationTime: [new Date()],
            opIpId: [""],
            opIpType:  ["OP"],

            opdate: [new Date()],
            opstartTime: [new Date()],
            opendTime: [new Date()],

            duration: [""],
            ottableId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            surgeonId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            surgeonId1: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            anestheticsDr: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            anestheticsDr1: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            surgeryId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            anesthTypeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            instruction: [""],
            ottypeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            unBooking: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
             isCancelled: [false],
            isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
       isCancelledDateTime: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator]],
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
         if (Param.otreservationId) {
             return this._httpClient.PutData("OTReservation/Edit/" + Param.otreservationId, Param);
         } else return this._httpClient.PostData("OTReservation/InsertEDMX", Param);
     }
 
}
