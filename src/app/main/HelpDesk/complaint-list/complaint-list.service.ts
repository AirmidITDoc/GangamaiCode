import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
  providedIn: 'root'
})
export class ComplaintListService {
  //  searchForm: FormGroup;
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
              NameSearch: [""],
              RegNo:[],
            fromDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            enddate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
           
          });
      }

    

         public insertComplaint(Param: any) {
         if (Param.complaintId) {
            return this._httpClient.PutData("HelpdeskPatientComplaints/" + Param.complaintId, Param);
        } else return this._httpClient.PostData("HelpdeskPatientComplaints", Param);
    }

  
       public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("HelpdeskPatientComplaints?Id=" + m_data);
    }
}