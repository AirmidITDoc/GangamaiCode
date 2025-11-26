import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NewVechicalComponent } from './new-vechical/new-vechical.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { FormGroup } from '@angular/forms';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { VechicalMasterService } from './vechical-master.service';
import { fuseAnimations } from '@fuse/animations';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';

@Component({
    selector: 'app-vechical-master',
    templateUrl: './vechical-master.component.html',
    styleUrls: ['./vechical-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class VechicalMasterComponent {
    myformSearch: FormGroup
    Name: any = "";
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.VehicleMaster, permissionType.Add);
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    allColumns = [
        { heading: "VehicleName", key: "vehicleName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "VehicleNo", key: "vehicleNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "VehicleModel", key: "vehicleModel", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Vechicaltype", key: "vehicleType", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Note", key: "note", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "ManuDate", key: "manuDate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "isActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 150 },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, width: 100, actions: [

                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.VillageMaster, permissionType.Edit), callback: (data: any) => {
                        this.onNew(data)
                    }
                }, {
                    action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.VillageMaster, permissionType.Delete), callback: (data: any) => {
                        this._AmbulancemasterService.deactivateTheStatus(data.vehicleId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        }
    ]
    allFilters = [
        { fieldName: "vehicleName", fieldValue: "", opType: OperatorComparer.StartsWith },
        { fieldName: "IsActive", fieldValue: "1", opType: OperatorComparer.Equals }
    ]

    gridConfig: gridModel = {
        permissionCode: permissionCodes.VillageMaster,
        apiUrl: "Ambulance/List",
        columnsList: this.allColumns,
        sortField: "vehicleId",
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
    //         apiUrl: "Ambulance/List",
    //         columnsList: this.allColumns,
    //         sortField: "vehicleId",
    //         sortOrder: 0,
    //         filters: [
    //             // { fieldName: "driverName", fieldValue: this.Name, opType: OperatorComparer.Contains },
    //             // { fieldName: "IsActive", fieldValue: "1", opType: OperatorComparer.Equals }
    //         ]
    //     }
    //     this.grid.gridConfig = this.gridConfig;
    //     this.grid.bindGridData();
    // }
    constructor(
        public _AmbulancemasterService: VechicalMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog,
        public permissionService: PagePermissionService
    ) { }

    ngOnInit(): void {
        this.myformSearch = this._AmbulancemasterService.createSearchForm()
    }

    onNew(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewVechicalComponent,
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
