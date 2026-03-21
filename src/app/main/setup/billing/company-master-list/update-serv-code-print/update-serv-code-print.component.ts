import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { Servicedetail } from '../../service-master/service-master.component';
import { CompanyMaster } from '../company-master-list.component';
import { CompanyMasterService } from '../company-master.service';

@Component({
    selector: 'app-update-serv-code-print',
    templateUrl: './update-serv-code-print.component.html',
    styleUrls: ['./update-serv-code-print.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class UpdateServCodePrintComponent {
    compwiseserForm: FormGroup;
    serviceForm: FormGroup;
    serviceInsertForm: FormGroup;
    tariffId = 0
    classId = 0
    serviceName = "%"
    compobj = new CompanyMaster({});
    CompanyId = 0
    autocompleteModetypeName: string = "Service";
    autocompleteModeclass2: string = "Class";

    DSComwiseServiceList = new MatTableDataSource<Servicedetail>();
    displayedColumns1: string[] = [
        'ServiceId',
        'ServiceName',
        'Company Code',
        'PrintName',
        'checkbox',
        // 'Action'
    ];

    constructor(
        public _CompanyMasterService: CompanyMasterService,
        public dialogRef: MatDialogRef<UpdateServCodePrintComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _FormvalidationserviceService: FormvalidationserviceService,
        private formBuilder: UntypedFormBuilder,
        private _formBuilder: FormBuilder,
        private accountService: AuthenticationService,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {

        this.compwiseserForm = this._CompanyMasterService.createcompwiseservForm();
        this.serviceInsertForm = this.createservCompany();

        this.servicearray.push(this.createserviceDetails());


        if (this.data) {
            this.compobj = this.data
            console.log(this.compobj.traiffId)
            this.CompanyId = this.compobj.companyId
            this.tariffId = this.compobj.traiffId
            // this.compwiseserForm.get("TariffId1").setValue(this.compobj.traiffId)
            // this.compwiseserForm.get("companyName").setValue(this.compobj.companyName)
        }
        this.getServicecompwiseList()
    }

    createservCompany(): FormGroup {
        return this._formBuilder.group({
            userId: [this.accountService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            serviceWise: this._formBuilder.array([])
        });
    }

    createserviceDetails(item: any = {}): FormGroup {
        console.log(item)
        return this._formBuilder.group({
            serviceId: [item.serviceId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            tariffId: [this.tariffId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            companyCode: [item.companyCode || "", [Validators.maxLength(50), this._FormvalidationserviceService.allowEmptyStringValidator()]],
            companyServicePrint: [item.companyServicePrint || "", [Validators.maxLength(50), this._FormvalidationserviceService.allowEmptyStringValidator()]],
            isInclusionOrExclusion: [item.isInclusionOrExclusion || false],
        });
    }

    get servicearray(): FormArray {
        return this.serviceInsertForm.get('serviceWise') as FormArray;
    }

    totalRecords = 0;
    pageSize = 10;
    pageIndex = 0;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    getServicecompwiseList(event?: any) {
        // debugger
        if (event) {
            this.pageIndex = event.pageIndex;
            this.pageSize = event.pageSize;
        }
        const param = {
            // "first": 0,
            // "rows": 10,
            "first": this.pageIndex * this.pageSize,
            "rows": this.pageSize,
            "sortField": "ServiceId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "TariffId",
                    "fieldValue": String(this.tariffId),
                    "opType": "Equals"
                },
                {
                    "fieldName": "ServiceName",
                    "fieldValue": String(this.serviceName),
                    "opType": "StartsWith"
                }
            ],
            "exportType": "JSON",
            "columns": []
        }
        this._CompanyMasterService.getservicCodeList(param).subscribe(data => {
            // debugger
            this.DSComwiseServiceList.data = data.data as Servicedetail[];
            this.totalRecords = data.recordsTotal;
            console.log(this.DSComwiseServiceList.data)
        });
    }

    selectService(event) {
        if (event.text) {
            this.serviceName = event.text
        }
        else {
            this.serviceName = "%"
        }
        this.pageIndex = 0;
        this.getServicecompwiseList()
    }

    printserviceName = ''
    gettableServName(event) {
        this.printserviceName = event.text
        // this.selectdiscservicelist(event)
    }

    onGet() {
        const param = {
            "tariffId": Number(this.tariffId)
        }
        console.log("Insert:-", param);

        this._CompanyMasterService.SaveserviceCompanyCode(param).subscribe((response) => {
            this.getServicecompwiseList()
        });
    }

    onSubmit() {
        debugger
        if (this.DSComwiseServiceList.data.length > 0) {

            this.servicearray.clear();
            this.DSComwiseServiceList.data.forEach(item => {
                console.log(item)
                this.servicearray.push(this.createserviceDetails(item));
            });

            console.log("Company Insert:-", this.serviceInsertForm.value);

            this._CompanyMasterService.updateservicecodeSave(this.serviceInsertForm.value).subscribe((response) => {
                this.dialogRef.close()
            });
        }
        else {
            this.toastr.warning('please check Service Table is invalid', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
    }

    getChargesList(event) { }

    onClear(val: boolean) {
        this.compwiseserForm.reset();
        this.dialogRef.close(val);
    }

    onClose() {
        this.compwiseserForm.reset();
        this.dialogRef.close();
    }

}
