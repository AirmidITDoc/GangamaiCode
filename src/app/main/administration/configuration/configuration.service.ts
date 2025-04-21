import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder)
        { this.myform = this.createConfigForm();
            this.myformSearch = this.createSearchForm();}
    
    createConfigForm(): FormGroup {
        return this._formBuilder.group({
            configId: 0,
            printRegAfterReg: 0,
            ipdprefix: "",
            otcharges: 0,
            printOpdcaseAfterVisit: 0,
            printIpdafterAdm: 0,
            popOpbillAfterVisit: 0,
            popPayAfterOpbill: 0,
            generateOpbillInCashOption: 0,
            mandatoryFirstName: 0,
            mandatoryMiddleName: 0,
            mandatoryLastName: 0,
            mandatoryAddress: 0,
            mandatoryCity: 0,
            mandatoryAge: 0,
            mandatoryPhoneNo: 0,
            opdBillingCounterId: 0,
            opdReceiptCounterId: 0,
            opdRefundBillCounterId: 0,
            opdAdvanceCounterId: 0,
            opdRefundAdvanceCounterId: 0,
            ipdAdvanceCounterId: 0,
            ipdBillingCounterId: 0,
            ipdReceiptCounterId: 0,
            ipdRefundOfBillCounterId: 0,
            ipdRefundOfAdvanceCounterId: 0,
            regPrefix: "",
            regNo:"",
            ipprefix: "",
            ipno: "",
            opprefix: "",
            opno:"",
            pathDepartment: 0,
            isPathologistDr: 0,
            labSampleNo: "",
            patientTypeSelf: 0,
            pharmacySalesCounterId: 0,
            pharmacySalesReturnCounterId: 0,
            pharmacyReceiptCounterId: 0,
            classForEdit: true,
            anesthetishId: 0,
            neroSurgeonId: 0,
            generalSurgeonId: 0,
            dateInterval: true,
            dateIntervalDays: 0,
            memberNoG: 0,
            barCodeSeqNo: 0,
            grnpartyCounterId: 0,
            cantenCashId: 0,
            cantenPayCashId: 0,
            pharIpadvCounterId: 0,
            pharStrId: 0,
            chkPharmacyDue: true,
            compBillNo: 0,
            pharServiceIdToTranfer: 0,
            filePathLocation: "",
            ipnoEmg: 0,
            ipdayCareNo: 0,
            gIsPharmacyPaperSetting: true,
            gPharmacyPrintName: "",
            gPharmacyPaperName: "",
            gIsOppaperSetting: "",
            gOpprintName: "",
            gOppaperName: "",
            gIsIppaperSetting: true,
            gIpprintName: "",
            gIppaperName: "",
          
        });
    }
    
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ConfigNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    
    initializeFormGroup() {
        this.createConfigForm();
    }

    public ConfigSave(Param: any) {
        if (Param.currencyId) {
            return this._httpClient.PutData("Configuration/" + Param.currencyId, Param);
        } else return this._httpClient.PostData("Configuration", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("Configuration?Id=" + m_data.toString());
    }
}
