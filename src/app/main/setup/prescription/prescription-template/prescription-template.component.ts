import { Component, Optional, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { ToastrService } from "ngx-toastr";
import { NewPrescriptionTemplateComponent } from "./new-prescription-template/new-prescription-template.component";
import { PrescriptionTemplateService } from "./prescription-template.service";

@Component({
    selector: 'app-prescription-template',
    templateUrl: './prescription-template.component.html',
    styleUrls: ['./prescription-template.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PrescriptionTemplateComponent {
    PrefixMasterList: any;
    msg: any;
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.PrescriptionTemplate, permissionType.Add);
    openedFromIPD = false;

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        public _PrescriptionTemplateService: PrescriptionTemplateService,
        public toastr: ToastrService, public _matDialog: MatDialog,
        public permissionService: PagePermissionService,
        @Optional() private dialogRef: MatDialogRef<PrescriptionTemplateComponent>
    ) { }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'opIpType')!.template = this.actionsTemplate;
    }
    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

    gridConfig: gridModel = {
        permissionCode: permissionCodes.PrescriptionTemplate,
        apiUrl: "OPDPrescriptionMedical/PresTemplateList",
        columnsList: [
            { heading: "-", key: "opIpType", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, },
            { heading: "TemplateCategory", key: "templateCategory", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "TemplateName", key: "presTemplateName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.PrescriptionTemplate, permissionType.Edit), callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.PrescriptionTemplate, permissionType.Edit), callback: (data: any) => {
                            this._PrescriptionTemplateService.deactivateTheStatus(data.presId).subscribe((response: any) => {
                                this.grid.bindGridData();
                            });
                        }
                    }]
            }
        ],
        sortField: "PresId",
        sortOrder: 0,
        filters: [
            { fieldName: "PresTemplateName", fieldValue: "", opType: OperatorComparer.StartsWith },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    }

    onClear() {
        this._PrescriptionTemplateService.myform.reset({ IsDeleted: "false" });
    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur();
        const dialogRef = this._matDialog.open(NewPrescriptionTemplateComponent,
            {
                maxWidth: "100vw",
                maxHeight: '90%',
                width: '90%',
                data: row

            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.grid.bindGridData();
            }
        });
    }

    closeDialog() {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }
}
