import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { BarcodeConfigService } from './barcodeconfig.service';
import { NewBarcodeComponent } from './new-barcode/new-barcode.component';
import { permissionCodes } from 'app/main/shared/model/permission.model';

@Component({
    selector: 'app-barcode-config',
    templateUrl: './barcode-config.component.html',
    styleUrls: ['./barcode-config.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class BarcodeConfigComponent implements OnInit {
    //   IsAdd: boolean = this.permissionService.getPermission(permissionCodes.RoleTemplateMaster, permissionType.Add);
          
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    autocompleteModeTemplateCat: string = "TemplateDescCategory";
    categoryid = ""
    myformSearch: FormGroup;

    gridConfig: gridModel = {
          permissionCode: permissionCodes.BarcodeConfig,
        apiUrl: "BarcodeConfig/List",
        columnsList: [
            { heading: "Template Code", key: "templateCode", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Width", key: "width", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Height", key: "height", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Barcode", key: "barcodeData", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Padding", key: "padding", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Margin", key: "margin", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onEdit(data) // EDIT Records
                        }
                    },
                    // {
                    //     action: gridActions.delete, callback: (data: any) => {
                    //         this._TemplatedescriptionService.deactivateTheStatus(data.templateId).subscribe((response: any) => {
                    //             this.grid.bindGridData();
                    //         });
                    //     }
                    // }
                ]
            }
        ],
        sortField: "Id",
        sortOrder: 0,
        filters: [
            { fieldName: "TemplateCode", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "IsActive", fieldValue: "", opType: OperatorComparer.Contains }
        ]
    }

    constructor(public _TemplatedescriptionService: BarcodeConfigService,
        public _matDialog: MatDialog,
        private _formBuilder: UntypedFormBuilder,
        public toastr: ToastrService,) { }

    ngOnInit(): void {
        this.myformSearch = this.filterForm();
    }

    onEdit(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button 
        const dialogRef = this._matDialog.open(NewBarcodeComponent,
            {
                maxWidth: "95vw",
                maxHeight: "95vh",
                // height: '70%',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }

    onAddnew(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const dialogRef = this._matDialog.open(NewBarcodeComponent,
            {
                maxWidth: "95vw",
                maxHeight: "95vh",
                // height: '70%',
                width: '90%',
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }

    selectChangeTemplate(value) {
        console.log(value)
        if (value.value !== 0)
            this.categoryid = value.value
        else
            this.categoryid = "0"
    }

    filterForm(): FormGroup {
        return this._formBuilder.group({
            isActive: '1',
            templateName: ['', [
                Validators.maxLength(50),
                Validators.pattern("^[A-Za-z / () ]*$")

            ]],
            categoryId: [0]
        });
    }
}