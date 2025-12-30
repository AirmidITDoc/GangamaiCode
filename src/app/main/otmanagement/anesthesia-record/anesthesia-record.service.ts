import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
  providedIn: 'root'
})

export class AnesthesiaRecordService {

  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) { }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      FirstName: ['', [Validators.pattern("^[A-Za-z/() ]*$")]],
      LastName: ['', [Validators.pattern("^[A-Za-z/() ]*$")]],
      RegNo: [],
      opipType: ["2"],
    });
  }



  public getotRequestById(Id) {
    return this._httpClient.GetData("OTRequest/" + Id);
  }
  public getAnesthesiaById(Id) {
    return this._httpClient.GetData("OTAnesthesia/" + Id);
  }


    public getReportView(Param) {
        return this._httpClient.PostData("Report/ViewReport", Param);
    }

  public InsertOTAnesthesia(Param) {

    if (Param.anesthesiaId) {
      return this._httpClient.PutData("OTAnesthesia/Edit/"+Param.anesthesiaId, Param);
    } else return this._httpClient.PostData("OTAnesthesia/Insert", Param);
  }

  public UpdateOTAnesthesia(employee) {
    return this._httpClient.PutData("OTAnesthesia/Edit/" + employee.anesthesiaId, employee);
  }
  public getRtrvdiagnosisList(employee) {
        return this._httpClient.PostData("OTReservation/OtReservationDiagnosisList", employee);
    }

    
  
     public OnCancel(m_data) {
        return this._httpClient.DeleteData("OTAnesthesia?Id=" + m_data.toString());
    }
}
