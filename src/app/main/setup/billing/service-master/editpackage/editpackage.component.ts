import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ServiceMasterService } from '../service-master.service';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-editpackage',
    templateUrl: './editpackage.component.html',
    styleUrls: ['./editpackage.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class EditpackageComponent implements OnInit {

    serviceForm: FormGroup;;
    // isActive:boolean=true;
    displayedColumnspackage = [
        'ServiceName',
        'PackageServiceName',
        'action'
    ];

    autocompleteModegroupName: string = "Service";
    dsPackageDet = new MatTableDataSource<PacakgeList>();
    PacakgeList: any = [];
    registerObj: any
    serviceName:any

    constructor(
        public _ServiceMasterService: ServiceMasterService,
        public dialogRef: MatDialogRef<EditpackageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
    ) { }

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "CurrencyMaster/List",
        columnsList: [
            { heading: "ServiceName", key: "firstName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PackageServiceName", key: "middleName", sort: true, align: 'left', emptySign: 'NA' },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    // {
                    //     action: gridActions.edit, callback: (data: any) => {
                    //         this.onSave(data);
                    //     }
                    // }, 
                    {
                        action: gridActions.delete, callback: (data: any) => {
                            this._ServiceMasterService.deactivateTheStatus(data.subGroupId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "firstName",
        sortOrder: 0,
        filters: [
            { fieldName: "firstName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        ]
    }


    ngOnInit(): void {
        this.serviceForm = this._ServiceMasterService.createServicemasterForm();
        // if ((this.data?.tariffId ?? 0) > 0) {
        //     // this.isActive=this.data.isActive
        //     this.serviceForm.patchValue(this.data);
        // }

        if (this.data) {
            this.registerObj = this.data;
            console.log(this.registerObj)
            this.serviceName=this.registerObj.serviceName
            this.getRtevPackageDetList(this.registerObj)
        }
    }

    getRtevPackageDetList(obj) {
        debugger
        var vdata =
        {
            "first": 0,
            "rows": 10,
            "sortField": "ServiceId",
            "sortOrder": 0,
            "filters": [
          {
                "fieldName": "ServiceId",
                "fieldValue": String(obj.serviceId),
                "opType": "Equals"
              }
            ],
            "exportType": "JSON",
            "columns": []
          }
        console.log(vdata)
        setTimeout(() => {
              this._ServiceMasterService.getRtevPackageDetList(vdata).subscribe(data=>{
                this.dsPackageDet.data =  data.data as PacakgeList[];
                this.PacakgeList = data.data as PacakgeList
                console.log(this.dsPackageDet.data)  
                console.log(this.PacakgeList)  
              }); 
        }, 1000);
    }


    vSrvcName: any;
    vServiceId: any;
    selectChangeService(data) {
        console.log(data)
        if (this.dsPackageDet.data.length > 0) {
            this.dsPackageDet.data.forEach((element) => {
                if (data.value == element.ServiceId) {
                    Swal.fire('Selected Item already added in the list ');
                    this.serviceForm.get('ServiceName').setValue('')
                }
            });
        }

        this.vServiceId = data.value
        this.vSrvcName = data.text
    }

    onAddPackageService() {
        debugger
        if ((this.vServiceId == 0 || this.vServiceId == null || this.vServiceId == undefined)) {
            this.toastr.warning('Please select Service', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        // const isDuplicate = this.PacakgeList.some(item => item.PackageServiceId === this.vServiceId);
        // if (isDuplicate) {
        //     this.toastr.warning('This service is already added.', 'Duplicate Entry', {
        //         toastClass: 'tostr-tost custom-toast-warning',
        //     });
        //     return;
        // }

        this.dsPackageDet.data = [];
        this.PacakgeList.push(
            {
                ServiceId: this.registerObj.serviceId || this.registerObj.ServiceId || 0,
                ServiceName: this.registerObj.serviceName || this.registerObj.ServiceName,
                PackageServiceId: this.vServiceId || this.registerObj.PackageServiceId || 0,
                PackageServiceName: this.vSrvcName || this.registerObj.PackageServiceName,
            });

        console.log(this.PacakgeList)

        this.dsPackageDet.data = this.PacakgeList;
        this.serviceForm.reset();
        this.serviceForm.get('ServiceName').setValue(this.registerObj.serviceName);
        console.log(this.dsPackageDet.data)

        this.vServiceId = null;
        this.serviceForm.get('ServiceShortDesc').reset('')
        this.vSrvcName = '';
    }

    deleteTableRowPackage(element) {
        let index = this.PacakgeList.indexOf(element);
        if (index >= 0) {
            this.PacakgeList.splice(index, 1);
            this.dsPackageDet.data = [];
            this.dsPackageDet.data = this.PacakgeList;
        }
        Swal.fire('Success !', 'PacakgeList Row Deleted Successfully', 'success');
    }

    onSubmit() {
        debugger
        if (this.dsPackageDet.data.length < 0) {
            this.toastr.warning('Please add package Service Name in list', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        let InsertPackageObj = [];
        this.dsPackageDet.data.forEach(element => {
            let InsertPackage = {
                "packageId": 0,
                "serviceId": element.ServiceId || 0,
                "packageServiceId": element.PackageServiceId || 0,
                "price": 0
            }
            InsertPackageObj.push(InsertPackage)
        });

        // let delete_PackageDetails={
        //     "serviceId": this.registerObj.serviceId || 0
        //   }

        let submitData = {
            "packageDetail": InsertPackageObj,
            // "delete_PackageDetails":delete_PackageDetails
        }

        console.log(submitData)
        this._ServiceMasterService.SavePackagedet(submitData).subscribe(reponse => {
            if (reponse) {
                this.toastr.success('Record Saved Successfully.', 'Saved !', {
                    toastClass: 'tostr-tost custom-toast-success',
                });
                this.onClose();
            } else {
                this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
                this.onClose();
            }
        }, error => {
            this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
                toastClass: 'tostr-tost custom-toast-error',
            });
        });
    }

    onClose() {
        this._matDialog.closeAll();
        this.PacakgeList.data = [];
        this.serviceForm.reset();
    }

    onClear(val: boolean) {
        this.serviceForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            ServiceShortDesc: [],
            ServiceName: [],
        }
    }
}
export class PacakgeList {
    ServiceId: number;
    ServiceName: String;
    PackageServiceId: any;
    PacakgeServiceName: any;

    constructor(PacakgeList) {
        this.ServiceId = PacakgeList.ServiceId || '';
        this.ServiceName = PacakgeList.ServiceName || '';
        this.PacakgeServiceName = PacakgeList.PacakgeServiceName || '';
    }
}
