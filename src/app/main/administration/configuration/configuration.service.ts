import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {
    mysmsform: FormGroup;
    myemailform: FormGroup;
    mywhatsappform: FormGroup;
    myAuditform: FormGroup;
    myformSearch: FormGroup;

    constructor(private _httpClient: ApiCaller, private _FormvalidationserviceService: FormvalidationserviceService,
        private _formBuilder: UntypedFormBuilder) {
        this.mysmsform = this.createsmsfilterConfigForm();
        this.myemailform = this.createemailfilterConfigForm();
        this.mywhatsappform = this.createwhatsappfilterConfigForm();
        this.myAuditform = this.createauditfilterConfigForm();
    }

    createConfigForm(): FormGroup {
        return this._formBuilder.group({


        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ConfigNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    createsmsfilterConfigForm(): FormGroup {
        return this._formBuilder.group({

            UserName: [''],
            fromDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            enddate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],

        });
    }

    createemailfilterConfigForm(): FormGroup {
        return this._formBuilder.group({

            UserName: [''],
            fromDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            enddate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],

        });
    }

    CreateauditForm() {
        return this._formBuilder.group({
            ActionByName: '',
            fromDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            enddate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],

        });
    }

    createwhatsappfilterConfigForm(): FormGroup {
        return this._formBuilder.group({
            PBillNo: [''],
            RegNo: [''],
            FirstName: ['', [
                Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            ]],
            LastName: ['', [
                Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            ]],
            IsInterimOrFinal: ['2'],
            CompanyId: [''],
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
            ReceiptNo: '',

        });
    }

    createauditfilterConfigForm(): FormGroup {
        return this._formBuilder.group({
            PBillNo: [''],
            RegNo: [''],
            FirstName: ['', [
                Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            ]],
            LastName: ['', [
                Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            ]],
            IsInterimOrFinal: ['2'],
            CompanyId: [''],
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
            ReceiptNo: '',

        });
    }


    initializeFormGroup() {
        this.createConfigForm();
    }

    public ConfigSave(Param: any) {

        return this._httpClient.PutData("Configuration/SystemConfig", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("Configuration?Id=" + m_data.toString());
    }



    public getloginaccessRetrive(param) {
        return this._httpClient.PostData("Common", param);

    }



    public SMSconfigedit(Param: any) {
        return this._httpClient.PostData("smsConfig/EmailConfiguration", Param);
    }

    public Emailconfigedit(Param: any) {
        // return this._httpClient.PostData("smsConfig/EmailConfiguration", Param);
        return this._httpClient.PutData("smsConfig/EmailConfiguration/" + Param.id, Param);
    }

    public AutoServiceInsert(Param: any) {
        return this._httpClient.PostData("Administration/AutoServiceListInsert", Param);
    }
}
