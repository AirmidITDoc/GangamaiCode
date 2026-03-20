import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { NewTemplateComponent } from './new-template/new-template.component';
import { TemplatedescriptionService } from './templatedescription.service';

@Component({
    selector: 'app-template-description',
    templateUrl: './template-description.component.html',
    styleUrls: ['./template-description.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TemplateDescriptionComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    autocompleteModeTemplateCat: string = "TemplateDescCategory";
    categoryid = ""
    myformSearch: FormGroup;
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.TemplateDescription, permissionType.Add);

    gridConfig: gridModel = {
        permissionCode: permissionCodes.TemplateDescription,
        apiUrl: "TemplateDescriptionConfig/List",
        columnsList: [
            { heading: "Code", key: "templateId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Template Name", key: "templateName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Category Name", key: "categoryName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onEdit(data) // EDIT Records
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._TemplatedescriptionService.deactivateTheStatus(data.templateId).subscribe((response: any) => {
                                this.grid.bindGridData();
                            });
                        }
                    }]
            }
        ],
        sortField: "TemplateId",
        sortOrder: 0,
        filters: [
            { fieldName: "TemplateName", fieldValue: "", opType: OperatorComparer.Contains },
            // { fieldName: "CategoryId", fieldValue: "", opType: OperatorComparer.Equals },
            { fieldName: "IsActive", fieldValue: "1", opType: OperatorComparer.Contains }
        ]
    }

    constructor(public _TemplatedescriptionService: TemplatedescriptionService,
        public _matDialog: MatDialog,
        private _formBuilder: UntypedFormBuilder, public permissionService: PagePermissionService,
        public toastr: ToastrService,) { }

    ngOnInit(): void {
        this.myformSearch = this.filterForm();
    }

    onEdit(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button 
        const dialogRef = this._matDialog.open(NewTemplateComponent,
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

        const dialogRef = this._matDialog.open(NewTemplateComponent,
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