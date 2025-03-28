import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
    providedIn: 'root'
})
export class BrowseIpAdvanceService {
    UserFormGroup: FormGroup;
    AdvanceOfRefund:FormGroup
    MyForm: FormGroup;

    constructor(
        public _formBuilder: UntypedFormBuilder,
        public _httpClient: ApiCaller) { this.UserFormGroup = this.createUserFormGroup() 
            this.AdvanceOfRefund=this.createAdvacneofRefundForm()
        }

    /**
     * 
     * @returns 
     * {
        "regID": 162743,
        "regNo": "2787",
        "patientName": "Mr. Tukaram Dnyoba Bhosale",
        "ipdNo": "IP/797/2025",
        "companyName": "",
        "tariffName": "CASH",
        "hospitalName": "ACS HOSPITAL\r\n",
        "mobileNo": "9960812014",
        "ageYear": "69        ",
        "isDischarged": "1",
        "isBillGenerated": "1",
        "advanceDetailID": 51345,
        "date": "2025-01-01T00:00:00",
        "advanceId": 40742,
        "advanceNo": "1358",
        "opD_IPD_Id": 1,
        "advanceAmount": "9500.0000",
        "usedAmount": "9500.0000",
        "balanceAmount": "0.0000",
        "refundAmount": "0.0000",
        "addedBy": 3,
        "isCancelled": false,
        "reason": "1 advance",
        "paymentId": 218794,
        "receiptNo": "",
        "paymentDate": "2025-01-01T00:00:00",
        "paymentTime": "2025-01-01T11:58:00",
        "cashPayAmount": 9500,
        "chequePayAmount": 0,
        "doctorName": "Dr. Siddhant Gandhi",
        "refDoctorName": "",
        "wardName": "General Ward",
        "bedName": "02",
        "cardPayAmount": "0.0000",
        "payTMAmount": "0.0000",
        "userName": "Anita  Nanna",
        "transactionType": 1
      },
     */

    createUserFormGroup() {
        return this._formBuilder.group({
            FirstName: ['', [
                Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            ]],
            LastName: ['', [
                Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            ]],
            PBillNo: '',
            RegNo: '',
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
        })
    }

    createAdvacneofRefundForm() {
        return this._formBuilder.group({
            FirstName: ['', [
                Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            ]],
            LastName: ['', [
                Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            ]],
            RegNo: '',
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
        })
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("StoreMaster?Id=" + m_data.toString());
    }
}
