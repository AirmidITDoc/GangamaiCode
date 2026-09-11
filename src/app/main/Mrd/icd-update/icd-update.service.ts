import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class IcdUpdateService {

  myformSearch: FormGroup;
  constructor(
    private _formBuilder: UntypedFormBuilder,
  ) {
    this.myformSearch = this.createSearchForm();
  }
  createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DoseNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }
}
