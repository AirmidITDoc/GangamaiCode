import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class FeedingrouteMasterService {

  myForm: FormGroup;
   myformSearch: FormGroup;
   constructor(
     private _httpClient: ApiCaller,
     private _formBuilder: UntypedFormBuilder,
     private _FormvalidationserviceService: FormvalidationserviceService
   ) {
     this.myForm = this.createFeedingRouteForm();
     this.myformSearch = this.createSearchForm();
   }
 
   createFeedingRouteForm(): FormGroup {
     return this._formBuilder.group({
       feedingRouteId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
       feedingRouteName: ["", [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
       feedingRouteCode: ["", [Validators.required]],
       dietTypesId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
       description: [""],
     });
   }
 
   createSearchForm(): FormGroup {
     return this._formBuilder.group({
       feedingRouteNameSearch: [""],
       IsDeletedSearch: [""],
     });
   }
 
   initializeFormGroup() {
     this.createFeedingRouteForm();
   }
 
   public FeedingRouteSave(Param: any) {
     if (Param.feedingRouteId) {
       console.log("Update Form Value (Param)", Param)
       return this._httpClient.PutData("FeedingRoute/" + Param.feedingRouteId, Param);
     } else return this._httpClient.PostData("FeedingRoute", Param);
   }
   public deactivateTheStatus(m_data) {
     return this._httpClient.DeleteData("FeedingRoute?Id=" + m_data.toString());
   }
}
