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
            otreservationId: [0],
            reservationDate:[new Date(),[Validators.required]],
            reservationTime: [new Date(),[Validators.required]],
            opIpId: [""],
            opIpType:  ["OP"],

            opdate: [new Date(),[Validators.required]],
            opstartTime: [new Date(),[Validators.required]],
            opendTime: [new Date(),[Validators.required]],

            duration: [0],
            ottableId: [0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            surgeonId: [0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            surgeonId1: [0],
            anestheticsDr: [0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            anestheticsDr1: [0],
            surgeryId: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            anesthTypeId: [0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            instruction: [""],
            ottypeId: [0],
            unBooking: [false],
             isCancelled: [false],
            isCancelledBy: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
       isCancelledDateTime: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator]],
         });
     }
     createSearchForm(): FormGroup {
         return this._formBuilder.group({
             CityNameSearch: [""],
             IsDeletedSearch: [""],
             
         });
     }
 populateForm(param) {
        // this.personalFormGroup.patchValue(param);
    }
     initializeFormGroup() {
         this.createReservationForm();
     }
 
    

 
     public reservationSave(Param: any) {
         if (Param.otreservationId) {
             return this._httpClient.PutData("OTReservation/Edit/" + Param.otreservationId, Param);
         } else return this._httpClient.PostData("OTReservation/InsertEDMX", Param);
     }
 
}
