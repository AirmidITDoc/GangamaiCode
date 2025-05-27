import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable()
export class WardMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
         private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createWardForm();
        this.myformSearch = this.createSearchForm();
    }

    createWardForm(): FormGroup {
        return this._formBuilder.group({
            roomId: [0],
            roomName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                   // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            locationId: [0,
                [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]
            ],
            classId: [0,
                [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]
            ],
            roomType: [0],
            isAvailible: true,
            isActive:[true,[Validators.required]],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            RoomNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    initializeFormGroup() {
        this.createWardForm();
    }
    
    public roomMasterSave(Param: any) {
        
        if (Param.roomId) {
            return this._httpClient.PutData("WardMaster/" + Param.roomId, Param);
        } else return this._httpClient.PostData("WardMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("WardMaster?Id=" + m_data.toString());
    }
}
