import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CompanyMasterService } from '../company-master.service';
import { ToastrService } from 'ngx-toastr';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { MatTableDataSource } from '@angular/material/table';
import { Servicedetail } from '../../service-master/service-master.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CompanyMaster } from '../company-master-list.component';
import Swal from 'sweetalert2';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-serve-to-company',
    templateUrl: './serve-to-company.component.html',
    styleUrls: ['./serve-to-company.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ServeToCompanyComponent {

    companyForm: FormGroup;
    autocompleteModetypeName: string = "CompanyType";
    isExpanded = false;
    selectedTabIndex = 0;

    displayedColumns1: string[] = [
        'ServiceName',
        'Action'
    ];


    displayedColumns2: string[] = [
        'ServiceName',
        'qty',
        'price',
        // 'Exclusion',
        'Action'
    ];

    DSServicedetailMainList = new MatTableDataSource<Servicedetail>();
    DSServicedetailList = new MatTableDataSource<Servicedetail>();


    autocompleteModeclass1: string = "Class";
    autocompleteModetariff1: string = "Tariff";
    autocompleteModeclass2: string = "Class";
    autocompleteModetariff2: string = "Tariff";

    dstable1 = new MatTableDataSource<Servicedetail>();
    dsLabRequest2 = new MatTableDataSource<Servicedetail>();
    chargeslist: any = [];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    ServiceId1 = 0
    ServiceId2 = 0
    tariffId = 0
    classId = 0
    serviceName: "%"
    compobj = new CompanyMaster({});
    constructor(
        public _CompanyMasterService: CompanyMasterService,
        public dialogRef: MatDialogRef<ServeToCompanyComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.companyForm = this._CompanyMasterService.createCompanysearchFormDemo();
        this.companyForm.markAllAsTouched();
        this.getServiceList()
        this.getServiceListMain()
        if (this.data) {
            this.compobj = this.data
            console.log(this.compobj.traiffId)
            this.companyForm.get("TariffId1").setValue(this.compobj.traiffId)
            this.companyForm.get("companyName").setValue(this.compobj.companyName)
        }
    }



    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        // let that = this;
        // const dialogRef = this._matDialog.open(NewCompanyTypeComponent,
        //     {
        //         maxWidth: "45vw",
        //         height: '35%',
        //         width: '70%',
        //         data: row
        //     });
        // dialogRef.afterClosed().subscribe(result => {
        //     if (result) {
        //         that.grid.bindGridData();
        //     }
        // });
    }

    selectChangeclass(event) {
        this.getServiceList();
    }

    selectChangemainclass(event) {
        this.getServiceListMain()
    }

    getServiceListMain() {
        let tariffId = this.companyForm.get("TariffId1").value || 1
        let classId = this.companyForm.get("ClassId1").value || 1
        let serviceName = "%"//this.companyForm.get("ServiceName").value || "%"
        debugger
        var param =
        {
            "searchFields": [
                // {
                //     "fieldName": "ServiceName",
                //     "fieldValue": String(serviceName),
                //     "opType": "Equals"
                // },
                {
                    "fieldName": "TariffId",
                    "fieldValue": String(tariffId),
                    "opType": "Equals"
                },
                {
                    "fieldName": "ClassId",
                    "fieldValue": String(classId),
                    "opType": "Equals"
                }
            ],
            "mode": "CompanyWiseTraiffList"
        }

        console.log(param)
        this._CompanyMasterService.getservicMasterListRetrive(param).subscribe(data => {
            console.log(data)
            this.DSServicedetailMainList.data = data as Servicedetail[];
            console.log(this.DSServicedetailMainList.data)
        });

    }


    getServiceList() {
        let tariffId = this.companyForm.get("TariffId2").value || 1
        let classId = this.companyForm.get("ClassId2").value || 1
        let serviceName = this.companyForm.get("ServiceName").value || "%"

        var param = {
            "searchFields": [
                // {
                //     "fieldName": "ServiceName",
                //     "fieldValue": String(serviceName),
                //     "opType": "Equals"
                // },
                {
                    "fieldName": "TariffId",
                    "fieldValue": String(tariffId),
                    "opType": "Equals"
                },
                {
                    "fieldName": "ClassId",
                    "fieldValue": String(classId),
                    "opType": "Equals"
                }
            ],
            "mode": "CompanyWiseTraiffList"
        }
        console.log(param)
        this._CompanyMasterService.getservicMasterListRetrive(param).subscribe(data => {
            console.log(data)
            this.DSServicedetailList.data = data as Servicedetail[];;
            console.log(this.DSServicedetailList.data)
        });

    }


    onSaveEntry(row) {

        // this.isLoading = 'save';
        this.dstable1.data = [];
        if (this.chargeslist && this.chargeslist.length > 0) {
            let duplicateItem = this.chargeslist.filter((ele, index) => ele.ServiceId === row.ServiceId && ele.tariffId === row.tariffId && ele.classId == row.classId);
            if (duplicateItem && duplicateItem.length == 0) {
                this.addChargList(row);
                return;
            }
            //   this.isLoading = '';
            this.DSServicedetailMainList.data = this.chargeslist;
            this.DSServicedetailMainList.sort = this.sort;
            this.DSServicedetailMainList.paginator = this.paginator;
        } else if (this.chargeslist && this.chargeslist.length == 0) {
            this.addChargList(row);
        }
        else {
            this.toastr.warning('Selected Service already added in the list ', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
    }

    addChargList(row) {
        debugger
        let Serv = row.ServiceName
        this.chargeslist.push(
            {
                // ServiceId: row.ServiceId,
                ServiceName: row.ServiceName,
                // Price:11,// row.price || 0
            });
        // this.isLoading = '';
        console.log(this.chargeslist);
        // this.dstable1.data = this.chargeslist;
        // this.dstable1.sort = this.sort;
        // this.dstable1.paginator = this.paginator;

        this.DSServicedetailMainList.data.push(this.chargeslist)
        Swal.fire("Added This Service To Company :", Serv)
    }



    onSubmit() {

        if (!this.companyForm.invalid) {

            console.log("Company Insert:-", this.companyForm.value);

            this._CompanyMasterService.companyMasterSave(this.companyForm.value).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
        else {
            this.toastr.warning('please check form is invalid', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
    }

    onTabChange(event: MatTabChangeEvent) {
        this.selectedTabIndex = event.index;
    }

    onClear(val: boolean) {
        this.companyForm.reset();
        this.dialogRef.close(val);
    }

    onClose() {
        this.companyForm.reset();
        this.dialogRef.close();
    }

    getValidationMessages() {
        return {
            companyName: [
                { name: "required", Message: "Company Name is required" },
                { name: "maxlength", Message: "Company name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            TariffId1: [
                { name: "required", Message: "Tariff Name is required" }
            ],
            ClassId1: [
                { name: "required", Message: "City Name is required" }
            ],
            mobileNo: [
                { name: "required", Message: "Mobile Number is required" },
                { name: "maxlength", Message: "Number be not be greater than 10 digits" },
                { name: "pattern", Message: "Only Digits allowed." }
            ],
            phoneNo: [
                { name: "required", Message: "Phone Number is required" },
                { name: "maxlength", Message: "Number be not be greater than 10 digits" },
                { name: "pattern", Message: "Only Digits allowed." }
            ],
            pinNo: [
                { name: "required", Message: "Pin Code is required" },
                { name: "maxlength", Message: "Pincode must be greater than 2 digits" },
                { name: "pattern", Message: "Only Digits allowed." }
            ],
            address: [
                { name: "required", Message: "Address is required" },
                { name: "maxlength", Message: "Address must be between 1 and 100 characters." },
                { name: "pattern", Message: "Secial Char allowed." }
            ],
            compTypeId: [
                { name: "required", Message: "Company Type Name is required" }
            ],
        };
    }


}
