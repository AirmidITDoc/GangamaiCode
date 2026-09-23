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
    private _formBuilder: UntypedFormBuilder, private _httpClient: ApiCaller,
  ) {
    this.myformSearch = this.createSearchForm();
  }
  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      DoseNameSearch: [""],
      IsDeletedSearch: [""],
    });
  }

  public IcdeInsert(employee) {
    debugger
    // if (employee.discharge.dischargeSummaryId == 0)
      return this._httpClient.PostData("ICDUpdate/InsertICD", employee);
    // else
    //   return this._httpClient.PutData("DischargeSummary/DischargeTemplateUpdate", employee);
  }

  
    getDiagnosisListbyId(Id) {
        return this._httpClient.GetData('DischargeSummary/IpAdmissionDiagnosisInformation/' + Id);
    }
}
