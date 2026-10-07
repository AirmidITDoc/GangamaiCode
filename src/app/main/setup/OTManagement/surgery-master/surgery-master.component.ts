import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { NewSurgeryMasterComponent } from './new-surgery-master/new-surgery-master.component';
import { SurgeryMasterService } from './surgery-master.service';

@Component({
    selector: 'app-surgery-master',
    templateUrl: './surgery-master.component.html',
    styleUrls: ['./surgery-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SurgeryMasterComponent implements OnInit {
    msg: any;
    surgeryName: any = "";
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.SetupOtManagment, permissionType.Add);

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    @ViewChild('RequestColorCode1') RequestColorCode1!: TemplateRef<any>;
    @ViewChild('RequestColorCode2') RequestColorCode2!: TemplateRef<any>;
    @ViewChild('RequestColorCode3') RequestColorCode3!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'preAnaesthesiaClearance')!.template = this.RequestColorCode1;
        this.gridConfig.columnsList.find(col => col.key === 'surgicalConsentRequired')!.template = this.RequestColorCode2;
        this.gridConfig.columnsList.find(col => col.key === 'bloodArrangementRequired')!.template = this.RequestColorCode3;
    }

    allColumns = [

        { heading: "Surgery Code", key: "surgeryCode", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Surgery Name", key: "surgeryName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Short Name", key: "shortName", sort: true, align: 'left', emptySign: 'NA' },

        { heading: "Department Name", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Surgery Category", key: "surgeryCategoryName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Surgery Type", key: "siteDescriptionName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Sub Speciality", key: "subSpecialtyName", sort: true, align: 'left', emptySign: 'NA', width: 200 },

        { heading: "Service Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Preferred OT Room", key: "otTableName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Template Name", key: "ottemplateId", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Grade Level", key: "name", sort: true, align: 'left', emptySign: 'NA', width: 200 },

        { heading: "Expected Surgery Time", key: "expectedSurgeryTime", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Preparation Time", key: "preparationTime", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Cleaning Turnaround Time", key: "cleaningTurnaroundTime", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Total Duration", key: "totalDuration", sort: true, align: 'left', emptySign: 'NA', width: 150 },


        {
            heading: "preAnaesthesiaClearance", key: "preAnaesthesiaClearance", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 200,
            template: this.RequestColorCode1
        },
        {
            heading: "surgicalConsentRequired", key: "surgicalConsentRequired", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 200,
            template: this.RequestColorCode2
        },
        {
            heading: "bloodArrangementRequired", key: "bloodArrangementRequired", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 200,
            template: this.RequestColorCode3
        },

        { heading: "isActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.SetupOtManagment, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.SetupOtManagment, permissionType.Delete), callback: (data: any) => {
                        this._SurgeryMasterService.deactivateTheStatus(data.surgeryId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        }
    ]
    allFilters = [
        { fieldName: "SurgeryName", fieldValue: this.surgeryName, opType: OperatorComparer.StartsWith },
        { fieldName: "IsActive", fieldValue: "2", opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        permissionCode: permissionCodes.SetupOtManagment,
        apiUrl: "SurgeryMaster/SurgeryMasterList",
        columnsList: this.allColumns,
        sortField: "SurgeryId",
        sortOrder: 0,
        filters: this.allFilters
    }

    constructor(
        public _SurgeryMasterService: SurgeryMasterService,
        public permissionService: PagePermissionService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur();

        const that = this;
        const dialogRef = this._matDialog.open(NewSurgeryMasterComponent,
            {
                maxWidth: "85vw",
                height: 'auto',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }
}
