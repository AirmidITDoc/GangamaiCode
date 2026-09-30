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
    if (employee.mrdDiagnosisInfoHeader.ipdiagId == 0)
      return this._httpClient.PostData("MRDDiagnosisInfo/Insert", employee);
    else
      return this._httpClient.PutData("MRDDiagnosisInfo/Edit/"+ employee.mrdDiagnosisInfoHeader.ipdiagId,employee);
  }
  public getAdmissionById(Id) {
    return this._httpClient.GetData("Admission/" + Id);
  }

  getDiagnosisList1(descriptionType: string) {
    return this._httpClient.GetData('OPDPrescriptionMedical/GetDiagnosisList?descriptionType=' + descriptionType);
  }
  getDiagnosisListbyId(data) {
    // return this._httpClient.GetData('DischargeSummary/IpAdmissionDiagnosisInformation/' + Id);
    return this._httpClient.PostData('MRDDiagnosisInfo/MRDDiagnosisInformationList', data);

  }
  public getRegistraionById(Id) {
    return this._httpClient.GetData("OutPatient/" + Id);
  }
}
