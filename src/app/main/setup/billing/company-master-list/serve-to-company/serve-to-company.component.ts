import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
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
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { SubTpaCompanyMaster } from '../../subtpa-company-master/subtpa-company-master.component';

@Component({
    selector: 'app-serve-to-company',
    templateUrl: './serve-to-company.component.html',
    styleUrls: ['./serve-to-company.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ServeToCompanyComponent {

    companyForm: FormGroup;
    autocompleteModetypeName: string = "Service";
    isExpanded = false;
    selectedTabIndex = 0;
    searchFormGroup: FormGroup;
    servFormGroup: FormGroup;
    groupFormGroup: FormGroup;
    subgropFormGroup: FormGroup;
    serviceForm: FormGroup;
    servlist: any = [];
    ServiceId1 = 0
    ServiceId2 = 0
    tariffId = 0
    classId = 0
    serviceName: "%"
    compobj = new CompanyMaster({});
    Regflag = 0;
    CompanyId = 0


    displayedColumns1: string[] = [
        'ServiceName',
        'Action'
    ];


    displayedColumns2: string[] = [
        'ServiceName',
        'ClassName',
        'TariffName',
        // 'qty',
        'classRate',
        'checkbox',
        'Action'
    ];

    displayedColumnsser: string[] = [
        'ServiceName',
        'disc'
    ];
    displayedColumnsgrp: string[] = [
        'ServiceName',
        'disc'
    ];
    displayedColumnssubgrp: string[] = [
        'ServiceName',
        'disc'
    ];
    displayedColumnsubtpa: string[] = [
        'TypeName',
        'companyName',
        'Action'
    ];


    DSServicedetailMainList = new MatTableDataSource<Servicedetail>();
    DSServicedetailList = new MatTableDataSource<Servicedetail>();

    discServiceList = new MatTableDataSource<Servicedetail>();
    discgroupList = new MatTableDataSource<Servicedetail>();
    discsubgroupList = new MatTableDataSource<Servicedetail>();
    subtpaList = new MatTableDataSource<SubTpaCompanyMaster>();



    autocompleteModeclass1: string = "Class";
    autocompleteModetariff1: string = "Tariff";
    autocompleteModeclass2: string = "Class";
    autocompleteModetariff2: string = "Tariff";

    dstable1 = new MatTableDataSource<Servicedetail>();
    dsLabRequest2 = new MatTableDataSource<Servicedetail>();
    // chargeslist: any = [];
    public chargeList: any[] = [];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        public _CompanyMasterService: CompanyMasterService,
        public dialogRef: MatDialogRef<ServeToCompanyComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _FormvalidationserviceService: FormvalidationserviceService,
        private formBuilder: UntypedFormBuilder,
        private _formBuilder: FormBuilder,
        private accountService: AuthenticationService,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.companyForm = this._CompanyMasterService.createCompanysearchFormDemo();
        this.companyForm.markAllAsTouched();
        this.searchFormGroup = this.createSearchForm();
        this.servFormGroup = this._CompanyMasterService.createservSearchForm();
        this.groupFormGroup = this._CompanyMasterService.creategroupSearchForm();
        this.subgropFormGroup = this._CompanyMasterService.createsubgroupSearchForm();
        this.serviceForm = this.createServicemasterForm();
        this.serviceDetailsArray.push(this.createserviceDetails());


        this.serviceForm.markAllAsTouched();
        if (this.data) {
            this.compobj = this.data
            console.log(this.compobj.traiffId)
            this.CompanyId = this.compobj.companyId
            this.tariffId = this.compobj.traiffId
            this.companyForm.get("TariffId1").setValue(this.compobj.traiffId)
            this.companyForm.get("companyName").setValue(this.compobj.companyName)
        }

        this.getServiceList()
        this.getsubtpaList()
        this.getServiceListMain()
    }
    createServicemasterForm(): FormGroup {
        const now = new Date();
        const defaultTime = now.toTimeString().slice(0, 5);
        return this._formBuilder.group({
            serviceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            groupId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            serviceShortDesc: ["", [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
            serviceName: ["", [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
            price: 0,
            isEditable: [false],
            creditedtoDoctor: [false],
            isPathology: [0],
            isPathOutSource: [false],
            isRadiology: [0],
            isRadOutSource: [false],
            isDiscount: [false],
            isProcedure: [false],
            isPackage: [0],
            subGroupId: [0],
            doctorId: 0,
            isEmergency: false,
            emgAmt: [0, [Validators.required, Validators.pattern("[0-9]+")]],
            emgPer: [0, [Validators.required, Validators.pattern("[0-9]+")]],
            emgStartTime: [defaultTime, [Validators.required]],
            emgEndTime: [defaultTime, [Validators.required]],
            printOrder: [0, [Validators.required, Validators.pattern("[0-9]+"), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            isActive: true,
            isDocEditable: false,
            serviceDetails: this._formBuilder.array([]),

            // extra field which we not insert
            EffectiveDate: [""],
            tariffId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        });
    }
    createserviceDetails(item: any = {}): FormGroup {
        return this._formBuilder.group({
            serviceDetailId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            tariffId: [this.tariffId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            classId: [item.classId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            classRate: [item.classRate || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        });
    }
    get serviceDetailsArray(): FormArray {
        return this.serviceForm.get('serviceDetails') as FormArray;
    }


    createSearchForm() {
        return this.formBuilder.group({
            regRadio: ['Service']

        });
    }

    onChangeRadio(event) {
        if (event.value === 'Service')
            this.Regflag = 0
        else if (event.value === 'Group')
            this.Regflag = 1
        else if (event.value === 'SubGroup')
            this.Regflag = 2

    }




    selectChangeclass(event) {
        this.getServiceList();
    }

    selectChangemainclass(event) {
        this.getServiceListMain()
    }


    getServiceListMain() {

        // let tariffId = this.companyForm.get("TariffId1").value || 1
        let classId = this.companyForm.get("ClassId1").value || 1
        let serviceName = "%"//this.companyForm.get("ServiceName").value || "%"
        debugger
        var param =
        {
            "searchFields": [
                {
                    "fieldName": "ServiceName",
                    "fieldValue": String(serviceName),
                    "opType": "Equals"
                },
                {
                    "fieldName": "TariffId",
                    "fieldValue": String(this.compobj.traiffId),
                    "opType": "Equals"
                },
                {
                    "fieldName": "ClassId",
                    "fieldValue": String(classId),
                    "opType": "Equals"
                },
                {
                    "fieldName": "type",
                    "fieldValue": "1",
                    "opType": "Equals"
                }
            ],
            "mode": "CompanyWiseTraiffList"
        }

        console.log(param)
        this._CompanyMasterService.getservicMasterListRetrive(param).subscribe(data => {
            this.DSServicedetailMainList.data = data as Servicedetail[];
            console.log(this.DSServicedetailMainList.data)
        });

    }


    getServiceList() {
        debugger
        let tariffId = this.companyForm.get("TariffId2").value || 1
        let classId = this.companyForm.get("ClassId2").value || 1
        let serviceName = this.companyForm.get("ServiceName").value || "%"

        var param = {
            "searchFields": [
                {
                    "fieldName": "ServiceName",
                    "fieldValue": String(serviceName),
                    "opType": "Equals"
                },
                {
                    "fieldName": "TariffId",
                    "fieldValue": String(tariffId),
                    "opType": "Equals"
                },
                {
                    "fieldName": "ClassId",
                    "fieldValue": String(classId),
                    "opType": "Equals"
                },
                {
                    "fieldName": "type",
                    "fieldValue": "1",
                    "opType": "Equals"
                }
            ],
            "mode": "CompanyWiseTraiffList"
        }
        console.log(param)
        this._CompanyMasterService.getservicMasterListRetrive(param).subscribe(data => {
            this.DSServicedetailList.data = data as Servicedetail[];;
            console.log(this.DSServicedetailList.data)
        });

    }

    getsubtpaList() {

        var param1 = {
            "first": 0,
            "rows": 10,
            "sortField": "subCompanyId",
            "sortOrder": 0,
            "filters": [
                { fieldName: "companyName", fieldValue: "", opType: OperatorComparer.Contains },
                { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
            ],
            "exportType": "JSON",
            "columns": [
            ]
        }
        console.log(param1)
        this._CompanyMasterService.getsubtpaListRetrive(param1).subscribe(data => {
            console.log(data)
            this.subtpaList.data = data.data as SubTpaCompanyMaster[];
            console.log(this.subtpaList.data)
        });

    }

    selectService(event) {
        this.serviceName = event.text
        this.selectdiscservicelist(event)
    }

    selectdiscservicelist(event) {
        debugger
        {
            let classId;
            let serviceName
            let type = 0

            if (this.Regflag == 0) {
                classId = this.servFormGroup.get("ClassId2").value || 1
                serviceName = this.serviceName || "%"
                type = 1
            } else if (this.Regflag == 1) {
                classId = this.groupFormGroup.get("ClassId2").value || 1
                serviceName = this.serviceName || "%"
                type = 2
            } else if (this.Regflag == 2) {
                classId = this.subgropFormGroup.get("ClassId2").value || 1
                serviceName = this.serviceName || "%"
                type = 3
            }

            var param = {
                "searchFields": [
                    {
                        "fieldName": "ServiceName",
                        "fieldValue": String(serviceName),
                        "opType": "Equals"
                    },
                    {
                        "fieldName": "TariffId",
                        "fieldValue": String(this.tariffId),
                        "opType": "Equals"
                    },
                    {
                        "fieldName": "ClassId",
                        "fieldValue": String(classId),
                        "opType": "Equals"
                    },
                    {
                        "fieldName": "type",
                        "fieldValue": String(type),
                        "opType": "Equals"
                    }
                ],
                "mode": "CompanyWiseTraiffList"
            }
            console.log(param)
            this._CompanyMasterService.getservicMasterListRetrive(param).subscribe(data => {
                console.log(data)
                if (this.Regflag == 0)
                    this.discServiceList.data = data as Servicedetail[];
                if (this.Regflag == 1)
                    this.discgroupList.data = data as Servicedetail[];
                if (this.Regflag == 2)
                    this.discsubgroupList.data = data as Servicedetail[];
                console.log(this.discServiceList.data)
            });

        }
    }


    onSaveEntry(row) {

        debugger
        this.dstable1.data = [];
        // if (this.DSServicedetailMainList.data.length > 0) {
        // let duplicateItem = this.chargeslist.filter((ele, index) => ele.ServiceId === row.ServiceId)// && ele.tariffId === row.tariffId && ele.classId == row.classId);
        // if (duplicateItem && duplicateItem.length == 0) {
        this.addChargList(row);
        //     return;
        // }
        // this.DSServicedetailMainList.data = this.chargeslist;
        //     this.chargeslist =this.DSServicedetailMainList.data 
        //     this.DSServicedetailMainList.sort = this.sort;
        //     this.DSServicedetailMainList.paginator = this.paginator;
        // } else if (this.chargeslist && this.chargeslist.length == 0) {
        //     this.addChargList(row);
        // }
        // else {
        //     this.toastr.warning('Selected Service already added in the list ', 'Warning !', {
        //         toastClass: 'tostr-tost custom-toast-warning',
        //     });
        //     return;
        // }
    }

    addChargList(row) {
        debugger
        this.chargeList = []
        if (this.DSServicedetailMainList.data.length > 0) {
            this.chargeList=this.DSServicedetailMainList.data
        }

        let Serv = row.ServiceName
        const newRow = (
            {
                GroupId: row.GroupId,
                GroupName: row.GroupName,
                ServiceName: row.ServiceName,
                TariffName: row.TariffName,
                ClassId: row.ClassId,
                ClassName: row.ClassName,
                classRate: row.classRate


            });

        console.log(this.chargeList);
        const newCharge = new ChargesList(newRow);
        this.chargeList.push(newCharge);
        this.DSServicedetailMainList.data = this.chargeList;
        console.log(this.DSServicedetailMainList.data);
    }



    // onSubmit() {

    //     if (!this.companyForm.invalid) {

    //         console.log("Company Insert:-", this.companyForm.value);

    //         this._CompanyMasterService.companyMasterSave(this.companyForm.value).subscribe((response) => {
    //             this.toastr.success(response.message);
    //             this.onClear(true);
    //         }, (error) => {
    //             this.toastr.error(error.message);
    //         });
    //     }
    //     else {
    //         this.toastr.warning('please check form is invalid', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    // }

    onSubmit() {

        // if (!this.serviceForm.invalid) {

        this.serviceDetailsArray.clear();
        this.DSServicedetailMainList.data.forEach(item => {
            console.log(item)
            this.serviceDetailsArray.push(this.createserviceDetails(item));
        });

        const controlsToRemove = ['EffectiveDate', 'tariffId'];
        controlsToRemove.forEach(control => {
            this.serviceForm.removeControl(control);
        });
        this.serviceForm.get('price').setValue(0)
        // this.serviceForm.get('doctorId')?.setValue(this.serviceForm.get('doctorId')?.value || 0);
        // this.serviceForm.get("isPathology")?.setValue(this.serviceForm.get("isPathology")?.value ? 1 : 0);
        // this.serviceForm.get("isRadiology")?.setValue(this.serviceForm.get("isRadiology")?.value ? 1 : 0);
        // this.serviceForm.get("isPackage")?.setValue(this.serviceForm.get("isPackage")?.value ? 1 : 0);
        // this.serviceForm.get("subGroupId")?.setValue(this.serviceForm.get("subGroupId")?.value ?? 0);
        // this.serviceForm.get("isDiscount")?.setValue(this.serviceForm.get("isDiscount")?.value ? true : false);
        // this.serviceForm.get("isEditable")?.setValue(this.serviceForm.get("isEditable")?.value ? true : false);
        // this.serviceForm.get("isPathOutSource")?.setValue(this.serviceForm.get("isPathOutSource")?.value ? true : false);
        // this.serviceForm.get("isRadOutSource")?.setValue(this.serviceForm.get("isRadOutSource")?.value ? true : false);
        // this.serviceForm.get("isActive")?.setValue(this.serviceForm.get("isActive")?.value ? true : false);
        // this.serviceForm.get("creditedtoDoctor")?.setValue(this.serviceForm.get("creditedtoDoctor")?.value ? true : false);

        // this.serviceForm.get("serviceShortDes")?.setValue(this.serviceForm.get("isActive")?.value ? true : false);
        // this.serviceForm.get("serviceName")?.setValue(this.serviceForm.get("creditedtoDoctor")?.value ? true : false);


        console.log("FormValue", this.serviceForm.value)
        this._CompanyMasterService.serviceMasterInsert(this.serviceForm.value).subscribe((response) => {
            this.onClose();
        })

        //  } else {
        //     let invalidFields = [];

        //     if (this.serviceForm.invalid) {
        //         for (const controlName in this.serviceForm.controls) {
        //             if (this.serviceForm.controls[controlName].invalid) {
        //                 invalidFields.push(`Service Form: ${controlName}`);
        //             }
        //         }
        //     }
        //     if (invalidFields.length > 0) {
        //         invalidFields.forEach(field => {
        //             this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
        //             );
        //         });
        //     }
        // }
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
            ServiceName: []
        };
    }

    maindeleteTableRow(element) {
        this.servlist = this.DSServicedetailMainList.data;
        let index = this.servlist.indexOf(element);
        if (index >= 0) {
            this.servlist.splice(index, 1);
            this.DSServicedetailMainList.data = [];
            this.DSServicedetailMainList.data = this.servlist;
        }
        Swal.fire('Success !', 'Service List Row Deleted Successfully', 'success');

        // }
    }


    keyPressCharater(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/^\d*\.?\d*$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

}



export class ChargesList {
    GroupId: any;
    GroupName: any;
    ServiceName: any;
    TariffName: any;
    ClassId: any;
    ClassName: any;
    classRate: any;


    constructor(ChargesList) {
        this.GroupId = ChargesList.GroupId || '';
        this.GroupName = ChargesList.GroupName || '';
        this.ServiceName = ChargesList.ServiceName || '';
        this.TariffName = ChargesList.TariffName || '';
        this.ClassId = ChargesList.ClassId || '';
        this.ClassName = ChargesList.ClassName || '';
        this.classRate = ChargesList.classRate || '';

    }
}
