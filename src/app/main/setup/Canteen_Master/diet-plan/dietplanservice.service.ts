import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
  providedIn: 'root'
})
export class DietplanserviceService {

 itemForm: FormGroup;
      myformSearch: FormGroup;
  
      constructor(
          private _httpClient: ApiCaller,
          private _formBuilder: UntypedFormBuilder,
          private _loggedService: AuthenticationService,
          private _FormvalidationserviceService: FormvalidationserviceService
      ) {
          this.itemForm = this.createItemmasterForm();
          // this.myformSearch = this.createSearchForm();
      }
  
  
      createSearchForm(): FormGroup {
          return this._formBuilder.group({
              ItemNameSearch: [""],
              ToStoreId: this._loggedService.currentUserValue.user.storeId,
              CatId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
              GenericId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
              ProdLocation: ['', [this._FormvalidationserviceService.onlyNumberValidator()]],
              ManufId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
              DrugTypeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          });
      }

      createItemmasterForm(): FormGroup {
          return this._formBuilder.group({
              ItemNameSearch: [""],
              ToStoreId: this._loggedService.currentUserValue.user.storeId,
              CatId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
              GenericId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
              ProdLocation: ['', [this._FormvalidationserviceService.onlyNumberValidator()]],
              ManufId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
              DrugTypeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          });
      }

         public insertItemMaster(Param: any) {
        return this._httpClient.PostData("ItemMaster/InsertEDMX", Param);
    }

    public updateItemMaster(Param: any) {
        if (Param.itemID) {
            return this._httpClient.PutData("ItemMaster/Edit/" + Param.itemID, Param);
        }
    }
       public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ItemMaster?Id=" + m_data);
    }
}
