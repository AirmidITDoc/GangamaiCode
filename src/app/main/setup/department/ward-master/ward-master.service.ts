import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class WardMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
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
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            locationId: ["",
                Validators.required
            ],
            classId: ["",
                Validators.required
            ],
            roomType: [0],
            isAvailable: "true",
            isActive:[true,[Validators.required]],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            RoomNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createWardForm();
    }
    
    public roomMasterSave(Param: any, showLoader = true) {
        debugger
        if (Param.roomId) {
            return this._httpClient.PutData("WardMaster/" + Param.roomId, Param, showLoader);
        } else return this._httpClient.PostData("WardMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("WardMaster?Id=" + m_data.toString());
    }
}
