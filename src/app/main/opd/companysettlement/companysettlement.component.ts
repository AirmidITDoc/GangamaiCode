import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CompanysettlementService } from './companysettlement.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { RegInsert } from '../registration/registration.component';
import { NewSettlementComponent } from './new-settlement/new-settlement.component';
import Swal from 'sweetalert2';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-companysettlement',
    templateUrl: './companysettlement.component.html',
    styleUrls: ['./companysettlement.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CompanysettlementComponent implements OnInit {
    searchFormGroup: FormGroup
    myFormGroup: FormGroup
RegId1="39";
BillNo:any;
vpaidamt: any = 0;
vbalanceamt: any = 0;

    constructor(public _CompanysettlementService: CompanysettlementService, 
         private commonService: PrintserviceService,
                public _matDialog: MatDialog,
                public datePipe: DatePipe,
                public toastr: ToastrService, public formBuilder: UntypedFormBuilder,) 
                { }
        
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "OPBill/OPBillListSettlementList",
        columnsList: [
            { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PatientType", key: "patientType", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "BillDate", key: "billDate", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "BillAmount", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "ConsessionAmt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "NetAmount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PaidAmount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "BalanceAmount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA' },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, 
                    {
                        action: gridActions.print, callback: (data: any) => {
                            this.viewgetOPPayemntPdf(data);
                        }
                    }
                    ]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "BillNo",
        sortOrder: 0,
        filters: [
            { fieldName: "RegId", fieldValue: String(this.RegId1), opType: OperatorComparer.Contains },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals },
        ],
        row: 25
    }

    ngOnInit(): void {
        this.searchFormGroup = this.createSearchForm();
        this.myFormGroup= this.createSearchForm1();
    }

    
  
    onSave(contact: any = null) {

        console.log(contact)
        debugger
        let PatientName = contact.firstName +" "+ contact.lastName
        let PatientHeaderObj = {};
        PatientHeaderObj['Date'] = this.datePipe.transform(contact.billDate, 'MM/dd/yyyy') || '01/01/1900',
        PatientHeaderObj['RegNo'] = contact.regID;
        PatientHeaderObj['PatientName'] = PatientName;
        PatientHeaderObj['OPD_IPD_Id'] = contact.OPDNo;
        PatientHeaderObj['Age'] = contact.ageYear;
        PatientHeaderObj['DepartmentName'] = contact.DepartmentName;
        PatientHeaderObj['DoctorName'] = contact.DoctorName;
        PatientHeaderObj['TariffName'] = contact.TariffName;
        PatientHeaderObj['CompanyName'] = contact.CompanyName;
        PatientHeaderObj['NetPayAmount'] = contact.netPayableAmt; 
      
        const dialogRef = this._matDialog.open(NewSettlementComponent,
            {
                maxWidth: "80vw",
               width: '70%',
                data: {
                    vPatientHeaderObj: PatientHeaderObj,
                    FromName: "OP-Bill"
                  }
            });
            dialogRef.afterClosed().subscribe(result => {
                console.log(result)
                if (result.IsSubmitFlag == true) {
                    let PaymentObj = result.submitDataPay.ipPaymentInsert
                    // this.PaymentObj1= result.submitDataPay.ipPaymentInsert
                  
                    // console.log(this.PaymentObj1)

                    this.vpaidamt = result.PaidAmt;
                  this.vbalanceamt = result.BalAmt
                  PaymentObj['BillNo']=contact.billNo;
                  let updateBillobj = {};
                  updateBillobj['BillNo'] = contact.billNo;
                  updateBillobj['balanceAmt'] = result.submitDataPay.ipPaymentInsert.BalanceAmt;  //result.BalAmt;
                let p= result.submitDataPay.ipPaymentInsert
                 let data={
                  p,
                    "bill": {
                        "billNo":  contact.billNo,
                        "balanceAmt": result.submitDataPay.ipPaymentInsert.BalanceAmt
                    },
                 }

               
                //   let Data = {
                    // PaymentObj,
                    // this.PaymentObj1.push(updateBillobj),
                    // "bill": updateBillobj,
                  
                //   };
                  console.log(data)
                  this._CompanysettlementService.InsertOPBillingsettlement(data).subscribe(response => {
                    this.toastr.success(response.message);
                   this.viewgetOPPayemntPdf(response);
                  }, (error) => {
                    this.toastr.error(error.message);
                  });
               
                }
              });
    }


    viewgetOPPayemntPdf(data){
        this.commonService.Onprint("PaymentId",data.paymentId,"OPPaymentReceipt");
    }
    
    createSearchForm() {
        return this.formBuilder.group({
        RegId: 0,
        AppointmentDate: [(new Date()).toISOString()],
        });
    }
    createSearchForm1() {
        return this.formBuilder.group({
        RegId: 0       
        });
    }

   
    registerObj = new RegInsert({});
    RegId=0;
    PatientName:any;
    getSelectedObj(obj) {
        debugger
        console.log(obj)
        this.RegId1 = obj.value;
        this.PatientName=obj.text;
       setTimeout(() => {
            this._CompanysettlementService.getRegistraionById(this.RegId1).subscribe((response) => {
            this.registerObj = response;
            console.log(response)

            });

        }, 500);
        
        filters: [
            { fieldName: "RegId", fieldValue: String(this.RegId1), opType: OperatorComparer.Contains },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals },
        ]
        // this.gridConfig.filters[0].fieldValue = obj.value
        this.grid.bindGridData();
}



}
