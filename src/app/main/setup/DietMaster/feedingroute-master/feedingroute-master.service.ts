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
       feedingRouteName: ["", [Validators.pattern(/^[a-zA-Z ]+$/),Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
       feedingRouteCode: [""],
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
       return this._httpClient.PutData("FeedingRoute/Edit/" + Param.feedingRouteId, Param);
     } else return this._httpClient.PostData("FeedingRoute/Insert", Param);
   }
   public deactivateTheStatus(m_data) {
     return this._httpClient.DeleteData("FeedingRoute?Id=" + m_data.toString());
   }
}
