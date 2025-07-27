import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryMasterService {


     myForm: FormGroup;
       myformSearch: FormGroup;
       constructor(
           private _httpClient: ApiCaller,
           private _formBuilder: UntypedFormBuilder,
            private _FormvalidationserviceService: FormvalidationserviceService
       ) {
           this.myForm = this.createCategoryForm();
           this.myformSearch = this.createSearchForm();
       }

         createCategoryForm(): FormGroup {
                return this._formBuilder.group({
                    SurgeryCategoryId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
                    SurgeryCategoryName: ["",
                        [ Validators.required,
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                     this._FormvalidationserviceService.allowEmptyStringValidator()
                   ]
                    ],
                   // talukaName: [""],
                    // isActive:[true,[Validators.required]]
                });
            }
          
            createSearchForm(): FormGroup {
                return this._formBuilder.group({
                    SurgeryCategorySearch: [""],
                    IsDeletedSearch: ["2"],
                });
            }
        
            initializeFormGroup() {
                this.createCategoryForm();
            }
        
            public CatMasterSave(Param: any) {
                debugger
                if (Param.SurgeryCategoryId) {
                    return this._httpClient.PutData("SurgeryCategoryMaster/" + Param.SurgeryCategoryId, Param);
                } else return this._httpClient.PostData("SurgeryCategoryMaster", Param);
            }
       public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("SurgeryCategoryMaster?Id=" + m_data.toString());
}
}
