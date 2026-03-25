
import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
  providedIn: 'root'
})
export class ItemmasterService {

      itemForm: FormGroup;
      myformSearch: FormGroup;
  
      constructor(
          private _httpClient: ApiCaller,
          private _formBuilder: UntypedFormBuilder,
          private _loggedService: AuthenticationService,
          private _FormvalidationserviceService: FormvalidationserviceService
      ) {
        //   this.itemForm = this.createItemmasterForm();
          // this.myformSearch = this.createSearchForm();
      }
  
  
      createSearchForm(): FormGroup {
          return this._formBuilder.group({
              ItemNameSearch: [""],
            
          });
      }

    

         public insertItemMaster(Param: any) {
         if (Param.itemId) {
            return this._httpClient.PutData("CanteenMatster/" + Param.itemId, Param);
        } else return this._httpClient.PostData("CanteenMatster", Param);
    }

  
       public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("CanteenMatster?Id=" + m_data);
    }
}
