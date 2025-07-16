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

    isExpanded = false;
    selectedTabIndex = 0;
    searchFormGroup: FormGroup;
    servFormGroup: FormGroup;
    groupFormGroup: FormGroup;
    subgropFormGroup: FormGroup;
    serviceForm: FormGroup;
    compwiseserForm: FormGroup;
    servlist: any = [];
    ServiceId1 = 0
    ServiceId2 = 0
    tariffId = 0
    classId = 0
    serviceName = "%"
    compobj = new CompanyMaster({});
    Regflag = 1;
    CompanyId = 0
 ApiURL: any='';

    displayedColumns1: string[] = [
        'Code',
        'ServiceName',
        'Action'
    ];


    displayedColumns2: string[] = [
        'ServiceName',
        'ClassName',
        // 'TariffName',
        // 'qty',
        'classRate',
        'discountAmount',
        'discountPercentage'
        // 'checkbox',
        // 'Action'
    ];

    displayedColumnsCompser: string[] = [
        'ServiceName',
        // 'ClassName',
        'TariffName',
        // 'qty',
        'classRate',
        //  'disc',
        'checkbox',
        'Action'
    ];
    displayedColumnsser: string[] = [
        'ServiceName',
        'disc'
    ];
    displayedColumnsgrp: string[] = [
        'GroupName',
        'TariffName',
        'discountAmount',
        'discountPercentage'
    ];
    displayedColumnssubgrp: string[] = [
        'GroupName',
        'SubGroupName',
        'TariffName',
        'discountAmount',
        'discountPercentage'
    ];
    displayedColumnsubtpa: string[] = [
        'TypeName',
        'CompanyName'
        // 'Action'
    ];


    DSServicedetailMainList = new MatTableDataSource<Servicedetail>();
    DSServicedetailList = new MatTableDataSource<Servicedetail>();

    discServiceList = new MatTableDataSource<Servicedetail>();
    discgroupList = new MatTableDataSource<Servicedetail>();
    discsubgroupList = new MatTableDataSource<Servicedetail>();
    subtpaList = new MatTableDataSource<SubTpaCompanyMaster>();
    DSComwiseServiceList = new MatTableDataSource<Servicedetail>();



    autocompleteModeclass1: string = "Class";
    autocompleteModetariff1: string = "Tariff";
    autocompleteModeclass2: string = "Class";
    autocompleteModetariff2: string = "Tariff";
    autocompleteModetypeName: string = "Service";

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
      
        this.compwiseserForm = this._CompanyMasterService.createcompwiseservForm();
        this.serviceForm = this.createServicemasterForm();
        this.serviceDetailsArray.push(this.createserviceDetails());
        this.groupFormGroup = this.creategroupSearchForm();
        this.groupDetailsArray.push(this.creategroupDetails());
         this.subgroupDetailsArray.push(this.createsubgroupDetails());
        // this.serviceForm.markAllAsTouched();
        if (this.data) {
            this.compobj = this.data

            console.log(this.compobj)
            this.CompanyId = this.compobj.companyId
            this.tariffId = this.compobj.traiffId
            this.classId = this.compobj.classId
            this.companyForm.get("TariffId1").setValue(this.compobj.traiffId)
            this.companyForm.get("companyName").setValue(this.compobj.companyName)
            this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" +this.compobj.traiffId + "&ClassId=" + 0 + "&ServiceName="
        }

        this.getsubtpaList()
        this.getServiceListMain()
        this.selectdiscservicelist()
    }

    
  creategroupSearchForm(): FormGroup {
    return this._formBuilder.group({
      userId: [this.accountService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      companyWiseService: this._formBuilder.array([])

    });
  }
    createServicemasterForm(): FormGroup {
        const now = new Date();
        const defaultTime = now.toTimeString().slice(0, 5);
        return this._formBuilder.group({
            // serviceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            // groupId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            // serviceShortDesc: ["ss", [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
            // serviceName: ["ss", [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
            // price: 0,
            // isEditable: [false],
            // creditedtoDoctor: [false],
            // isPathology: [0],
            // isPathOutSource: [false],
            // isRadiology: [0],
            // isRadOutSource: [false],
            // isDiscount: [false],
            // isProcedure: [false],
            // isPackage: [0],
            // subGroupId: [0],
            // doctorId: 0,
            // isEmergency: false,
            // emgAmt: [0, [Validators.required, Validators.pattern("[0-9]+")]],
            // emgPer: [0, [Validators.required, Validators.pattern("[0-9]+")]],
            // emgStartTime: [defaultTime, [Validators.required]],
            // emgEndTime: [defaultTime, [Validators.required]],
            // printOrder: [0, [Validators.required, Validators.pattern("[0-9]+"), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            // isActive: true,
            // isDocEditable: false,
            serviceDetails: this._formBuilder.array([]),

            // extra field which we not insert
            // EffectiveDate: [""],
            // tariffId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        });
    }
    createserviceDetails(item: any = {}): FormGroup {
        console.log(item)
        return this._formBuilder.group({
            // serviceDetailId: [item.serviceDetailId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceId: [item.ServiceId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            tariffId: [this.tariffId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            classId: [this.classId || 1, [this._FormvalidationserviceService.onlyNumberValidator()]],
            classRate: [item.classRate || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            discountAmount: [item.discountAmount || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            discountPercentage: [item.discountPercentage || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        });
    }
    get serviceDetailsArray(): FormArray {
        return this.serviceForm.get('serviceDetails') as FormArray;
    }


    creategroupDetails(item: any = {}): FormGroup {
        console.log(item)
        return this._formBuilder.group({
            compServiceDetailId: [item.compServiceDetailId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceId: [item.GroupId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            tariffId: [this.tariffId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            classId: [this.classId || 1, [this._FormvalidationserviceService.onlyNumberValidator()]],
            // classRate: [item.classRate || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            discountAmount: [item.discountAmount || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            discountPercentage: [item.discountPercentage || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isGroupOrSubGroup: true
        });
    }

    createsubgroupDetails(item: any = {}): FormGroup {
        console.log(item)
        return this._formBuilder.group({
            compServiceDetailId: [item.compServiceDetailId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceId: [item.SubGroupId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            tariffId: [this.tariffId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            classId: [this.classId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            // classRate: [item.classRate || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            discountAmount: [item.discountAmount || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            discountPercentage: [item.discountPercentage || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isGroupOrSubGroup: false
        });
    }
    get groupDetailsArray(): FormArray {
        return this.groupFormGroup.get('companyWiseService') as FormArray;
    }

    get subgroupDetailsArray(): FormArray {
        return this.groupFormGroup.get('companyWiseService') as FormArray;
    }
    

    createSearchForm() {
        return this.formBuilder.group({
            regRadio: ['Group']

        });
    }

    onChangeRadio(event) {
      
        if (event.value === 'Group') {
            this.Regflag = 1
            this.selectdiscservicelist()
        }
        else if (event.value === 'SubGroup') {
            this.Regflag = 2
            this.selectdiscservicelist()
        }
    }

    selectChangemainclass(event) {
        this.getServiceListMain()
    }


    getServiceListMain() {
        debugger
        // let tariffId = this.companyForm.get("TariffId1").value || 1
        let classId = this.companyForm.get("ClassId2").value || 0
        // let serviceName = this.companyForm.get("ServiceName").value || "%"

        var param =
        {
            "searchFields": [
                {
                    "fieldName": "ServiceName",
                    "fieldValue": String(this.serviceName),
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
    // getServicecompwiseList() {

    //     let classId = this.compwiseserForm.get("ClassId2").value || 1
    //     let serviceName = this.compwiseserForm.get("ServiceName").value || "%"
    //     debugger
    //     var param =
    //     {
    //         "searchFields": [
    //             {
    //                 "fieldName": "ServiceName",
    //                 "fieldValue": String(serviceName),
    //                 "opType": "Equals"
    //             },
    //             {
    //                 "fieldName": "TariffId",
    //                 "fieldValue": String(this.compobj.traiffId),
    //                 "opType": "Equals"
    //             },
    //             {
    //                 "fieldName": "ClassId",
    //                 "fieldValue": String(classId),
    //                 "opType": "Equals"
    //             },
    //             {
    //                 "fieldName": "type",
    //                 "fieldValue": "1",
    //                 "opType": "Equals"
    //             }
    //         ],
    //         "mode": "CompanyWiseServiceList"
    //     }

    //     console.log(param)
    //     this._CompanyMasterService.getservicMasterListRetrive(param).subscribe(data => {
    //         this.DSComwiseServiceList.data = data as Servicedetail[];
    //         console.log(this.DSComwiseServiceList.data)
    //     });

    // }

    // getServiceList() {
    //     debugger
    //     let tariffId = this.companyForm.get("TariffId2").value || 1
    //     let classId = this.companyForm.get("ClassId2").value || 1
    //     // let serviceName = this.companyForm.get("ServiceName").value || "%"

    //     var param = {
    //         "searchFields": [
    //             {
    //                 "fieldName": "ServiceName",
    //                 "fieldValue": String(this.serviceName),
    //                 "opType": "Equals"
    //             },
    //             {
    //                 "fieldName": "TariffId",
    //                 "fieldValue": String(tariffId),
    //                 "opType": "Equals"
    //             },
    //             {
    //                 "fieldName": "ClassId",
    //                 "fieldValue": String(classId),
    //                 "opType": "Equals"
    //             },
    //             {
    //                 "fieldName": "type",
    //                 "fieldValue": "1",
    //                 "opType": "Equals"
    //             }
    //         ],
    //         "mode": "CompanyWiseTraiffList"
    //     }
    //     console.log(param)
    //     this._CompanyMasterService.getservicMasterListRetrive(param).subscribe(data => {
    //         this.DSServicedetailMainList.data = data as Servicedetail[];;
    //         console.log(this.DSServicedetailMainList.data)
    //     });

    // }

    getsubtpaList() {
        var param = {
            "searchFields": [
                {
                    "fieldName": "CompanyId",
                    "fieldValue": String(this.CompanyId),
                    "opType": "Equals"
                }
            ],
            "mode": "CompanyWiseSubTPAList"
        }
        console.log(param)
        this._CompanyMasterService.getsubtpaListRetrive(param).subscribe(data => {
            this.subtpaList.data = data as SubTpaCompanyMaster[];;
            console.log(this.subtpaList.data)
        });


    }

    selectService(event) {
        this.serviceName = event.text
        this.getServiceListMain()
    }
    printserviceName = ''
    gettableServName(event) {
        this.printserviceName = event.text
        // this.selectdiscservicelist(event)
    }


    selectdiscservicelist() {
        debugger
        {
            let classId;
            let serviceName
            let type = 1

         if (this.Regflag == 1) {
                classId = 0,
                    serviceName = "%"
                type = 2
            } else if (this.Regflag == 2) {
                classId = 0,
                    serviceName = "%" //"this.serviceName || "%"
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
              if (this.Regflag == 1)
                    this.discgroupList.data = data as Servicedetail[];
                if (this.Regflag == 2)
                    this.discsubgroupList.data = data as Servicedetail[];
                console.log(this.discsubgroupList.data)
            });

        }
    }


    onSaveEntry(row) {
        this.dstable1.data = [];
        this.addChargList(row);
      
    }

    addChargList(row) {
        this.chargeList = []
        if (this.DSServicedetailMainList.data.length > 0) {
            this.chargeList = this.DSServicedetailMainList.data
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

    getSelectedserviceObj(obj){
        this.serviceName = obj.serviceName
        this.getServiceListMain()
    }

    onSubmit() {
        
        if (this.selectedTabIndex == 0)
            this.onservocompSubmit()
        else
            this.ondisccompSubmit()
    }



    onservocompSubmit() {

        if (this.DSServicedetailMainList.data.length > 0) {

            this.serviceDetailsArray.clear();
            this.DSServicedetailMainList.data.forEach(item => {
                console.log(item)
                this.serviceDetailsArray.push(this.createserviceDetails(item));
            });

            console.log("FormValue", this.serviceDetailsArray.value)
            this._CompanyMasterService.servicecoderateupdate(this.serviceDetailsArray.value).subscribe((response) => {
                this.onClose();
            })
        } else {
            this.toastr.warning('please check Service Table is invalid', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
    }

    ondisccompSubmit() {
debugger
        if (this.Regflag == 1) {
            if (this.discgroupList.data.length > 0) {

                this.groupDetailsArray.clear();
                this.discgroupList.data.forEach(item => {
                    console.log(item)
                    this.groupDetailsArray.push(this.creategroupDetails(item));
                });


                console.log("FormValue", this.groupFormGroup.value)
                this._CompanyMasterService.Servdiscupdate(this.groupFormGroup.value).subscribe((response) => {
                    this.onClose();
                })
            } else {
                this.toastr.warning('please check Service Table is invalid', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        } else if (this.Regflag == 2) {
            if (this.discsubgroupList.data.length > 0) {
                this.subgroupDetailsArray.clear();
                this.discsubgroupList.data.forEach(item => {
                    console.log(item)
                    this.subgroupDetailsArray.push(this.createsubgroupDetails(item));
                });
                console.log("FormValue", this.groupFormGroup.value)
                this._CompanyMasterService.Servdiscupdate(this.groupFormGroup.value).subscribe((response) => {
                    this.onClose();
                })
            }

        }

    }
 
    onTabChange(event: MatTabChangeEvent) {
        this.selectedTabIndex = event.index;
        console.log(this.selectedTabIndex)
        this.selectdiscservicelist()
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
            ]
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
