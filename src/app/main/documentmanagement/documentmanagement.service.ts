import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
    providedIn: 'root'
})
export class DocumentmanagementService {
    userFormGroup: FormGroup;
    BillListFrom: FormGroup;

    constructor(
        public _frombuilder: UntypedFormBuilder,
        public _httpClient: ApiCaller
    ) {
        this.userFormGroup = this.createUseFrom(),
            this.BillListFrom = this.createBillListFrom()
    }


    myFilterbrowseform(): FormGroup {
        return this._frombuilder.group({

            FirstName: ['', [Validators.maxLength(50),
            Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            ]],
            LastName: ['', [Validators.maxLength(50),
            Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            ]],
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
            RegNo: '',

        });
    }

   CanBillbrowseform(): FormGroup {
    return this._frombuilder.group({

      CustomerName: ['', [Validators.maxLength(50),
      Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
      ]],
     
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo: '',
      BillNo:['']
    });
  }


  createUseFrom() {
    return this._frombuilder.group({
      Type: ['1'],
      Code: 0,
      ItemID: '%',
      CustomerName: '',
      Start: [(new Date())],
      TotalAmount: '',
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      DiscAmt: '',
      Discount: '',
      Status: ['CashPay'],
      roomId: 0,
      cashCounterId: 0,

        })
    }
    createBillListFrom() {
        return this._frombuilder.group({
            startdate: [new Date().toISOString()],
            enddate: [new Date().toISOString()],

        })
    }
    public getItemTable1List(Param) {
        return this._httpClient.GetData("CanteenRequest/GetItemListforCanteen?ItemName=" + Param);
    }
  public getItemTable1ListData(Param) {
        return this._httpClient.GetData("CanteenRequest/GetItemListforCanteen?ItemName=" + Param);
    }
    

    public canteenrequestSave(employee) {
        return this._httpClient.PostData("CanteenRequest/Insert", employee);
    }
    public getBillList(Param) {
        return this._httpClient.PostData("CanteenRequest/CanteenRequestHeaderList", Param);
    }
    public getBillDetailsList(Param) {
        return this._httpClient.PostData("CanteenRequest/CanteenRequestList", Param);
    }
    public getNursingBill(Param) {
        return this._httpClient.PostData("Generic/GetByProc?procName=Rtrv_CanteenRequestListFromWard", Param);
    }

    public getItemLatestList(Param) {
        return this._httpClient.PostData("Generic/GetByProc?procName=Rtrv_CanteenRequestListFromWard", Param);
    }

   public canteenBillSave(employee) {
    return this._httpClient.PostData("CanteenBill/Insert", employee);
  }
     public getReportView(Param) {
        return this._httpClient.PostData("Report/ViewReport", Param);
    }

    public BillCancle(Param) {
        return this._httpClient.PostData("CanteenBill/Cancel", Param)
    }

  
}
