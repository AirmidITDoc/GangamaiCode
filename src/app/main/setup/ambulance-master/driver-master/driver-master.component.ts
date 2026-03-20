import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { DrivermasterService } from './drivermaster.service';
import { MatDialog } from '@angular/material/dialog';
import { NewDriverComponent } from './new-driver/new-driver.component';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';

@Component({
    selector: 'app-driver-master',
    templateUrl: './driver-master.component.html',
    styleUrls: ['./driver-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DriverMasterComponent {
    myformSearch: FormGroup
    Name: any = "";
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.VehicleMaster, permissionType.Add);
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    allColumns = [
        { heading: "Driver Name", key: "driverName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        // { heading: "City", key: "cityId", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "DateOfBirth", key: "dateOfBirth", sort: true, align: 'left', emptySign: 'NA', width: 100, type: 6 },
        { heading: "JoinDate", key: "joinDate", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 100, },
        { heading: "Experience", key: "experience", sort: true, align: 'left', emptySign: 'NA', width: 100, },
        { heading: "LicenceNo", key: "licenceNo", sort: true, align: 'left', emptySign: 'NA', width: 100, },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, width: 100, actions: [
                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.VehicleMaster, permissionType.Edit), callback: (data: any) => {
                        this.onNew(data)
                    }
                }, {
                    action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.VehicleMaster, permissionType.Delete), callback: (data: any) => {
                        this._DrivermasterService.deactivateTheStatus(data.driverId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        }
    ]

    allFilters = [
        { fieldName: "driverName", fieldValue: "", opType: OperatorComparer.StartsWith },
        { fieldName: "IsActive", fieldValue: "1", opType: OperatorComparer.Equals }
    ]

    gridConfig: gridModel = {
        permissionCode: permissionCodes.VehicleMaster,
        apiUrl: "Driver/List",
        columnsList: this.allColumns,
        sortField: "DriverId",
        sortOrder: 0,
        filters: this.allFilters
    }

    // Clearfilter(event) {
    //     console.log(event)
    //     if (event == 'NameSearch')
    //         this.myformSearch.get('NameSearch').setValue("")

    //     this.onChangeFirst();
    // }

    // onChangeFirst() {
    //     this.Name = this.myformSearch.get('NameSearch').value + "%"
    //     // this.type = this.myformSearch.get('IsDeletedSearch').value
    //     this.getfilterdata();
    // }

    // getfilterdata() {
    //     debugger
    //     this.gridConfig = {
    //         apiUrl: "Driver/List",
    //         columnsList: this.allColumns,
    //         sortField: "driverId",
    //         sortOrder: 0,
    //         filters: [
    //             { fieldName: "driverName", fieldValue: this.Name, opType: OperatorComparer.Contains },
    //             { fieldName: "IsActive", fieldValue: "1", opType: OperatorComparer.Equals }
    //         ]
    //     }
    //     this.grid.gridConfig = this.gridConfig;
    //     this.grid.bindGridData();
    // }
    constructor(
        public _DrivermasterService: DrivermasterService,
        public toastr: ToastrService, public _matDialog: MatDialog,
        public permissionService: PagePermissionService
    ) { }

    ngOnInit(): void {
        this.myformSearch = this._DrivermasterService.createSearchForm()
    }

    onNew(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewDriverComponent,

            {
                maxWidth: "70vw",
                maxHeight: '60%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();
        });
    }
}

