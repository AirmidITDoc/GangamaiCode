import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
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
    
        gridConfig: gridModel = {
            apiUrl: "Administration/BrowseReportTemplateConfigList",
            columnsList: [
                { heading: "TemplateId", key: "templateId", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "TemplateName", key: "templateName", sort: true, align: 'left', emptySign: 'NA' },
                {
                    heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                        {
                            action: gridActions.edit, callback: (data: any) => {
                                this.onEdit(data) // EDIT Records
                            }
                        }, {
                            action: gridActions.delete, callback: (data: any) => {
                                this._TemplatedescriptionService.deactivateTheStatus(data.templateId).subscribe((response: any) => {
                                    this.toastr.success(response.Message);
                                  this.getfilterdata();
                                });
                            }
                        }]
                } //Action 1-view, 2-Edit,3-delete
            ],
            sortField: "TemplateId",
            sortOrder: 0,
            filters: [
                
            ]
        }
    
        constructor(public _TemplatedescriptionService: TemplatedescriptionService,
             public _matDialog: MatDialog,
            public toastr: ToastrService,) { }
    
        ngOnInit(): void { }
    
        onSearchClear() {
            this._TemplatedescriptionService.myformSearch.reset({
                BankNameSearch: "",
                IsDeletedSearch: "2",
            });
    
        }
    
        onEdit(row: any = null) {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button
            
            let that = this;
            const dialogRef = this._matDialog.open(NewTemplateComponent,
                {
                    maxWidth: "90vw",
                    height: '80%',
                    width: '90%',
                    data: row
                });
            dialogRef.afterClosed().subscribe(result => {
               this.getfilterdata()
              
            });
        }

        onSave(row: any = null) {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button
            
            let that = this;
            const dialogRef = this._matDialog.open(NewTemplateComponent,
                {
                    maxWidth: "90vw",
                    height: '80%',
                    width: '90%'
                  
                });
            dialogRef.afterClosed().subscribe(result => {
                                 this.getfilterdata()
              
            });
        }
    
        getfilterdata() {
            debugger
            this.gridConfig = {
                apiUrl: "Administration/BrowseReportTemplateConfigList",
                columnsList: [
                    { heading: "TemplateId", key: "templateId", sort: true, align: 'left', emptySign: 'NA' },
                    { heading: "TemplateName", key: "templateName", sort: true, align: 'left', emptySign: 'NA' },
                    {
                        heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                            {
                                action: gridActions.edit, callback: (data: any) => {
                                    this.onEdit(data) // EDIT Records
                                }
                            }, {
                                action: gridActions.delete, callback: (data: any) => {
                                    this._TemplatedescriptionService.deactivateTheStatus(data.bankId).subscribe((response: any) => {
                                        this.toastr.success(response.Message);
                                        this.grid.bindGridData;
                                    });
                                }
                            }]
                    } //Action 1-view, 2-Edit,3-delete
                ],
                sortField: "TemplateId",
                sortOrder: 0,
                filters: [
                    
                ]
            }
             
              this.grid.gridConfig = this.gridConfig;
              this.grid.bindGridData();
          
            }
          
    }