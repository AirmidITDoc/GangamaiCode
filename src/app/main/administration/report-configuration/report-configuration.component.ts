import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NewReportConfigurationComponent } from './new-report-configuration/new-report-configuration.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { ReportConfigurationService } from './report-configuration.service';
import { MatDialog } from '@angular/material/dialog';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-report-configuration',
    templateUrl: './report-configuration.component.html',
    styleUrls: ['./report-configuration.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ReportConfigurationComponent implements OnInit{

    myform: any;
    constructor(public _ReportConfigurationService: ReportConfigurationService, public _matDialog: MatDialog,
            public toastr: ToastrService,)
                { }
        @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
        gridConfig: gridModel = {
            apiUrl: "MReportConfig/List",
            columnsList: [
                { heading: "Code", key: "reportId", sort: true, align: 'left', emptySign: 'NA', width: 80 },
                { heading: "ReportSection", key: "reportSection", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "ReportName", key: "reportName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "Rarentid", key: "parentid", sort: true, align: 'left', emptySign: 'NA', width: 80 },
                { heading: "ReportTitle", key: "reportTitle", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "ReportHeader", key: "reportHeader", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "ReportColumn", key: "reportColumn", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "ReportHeaderFile", key: "reportHeaderFile", sort: true, align: 'left', emptySign: 'NA', width: 120 },
                { heading: "ReportBodyFile", key: "reportBodyFile", sort: true, align: 'left', emptySign: 'NA', width: 110 },
                { heading: "ReportFolderName", key: "reportFolderName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
                { heading: "ReportFileName", key: "reportFileName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
                { heading: "ReportSPName", key: "reportSPName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
                { heading: "ReportPageOrientation", key: "reportPageOrientation", sort: true, align: 'left', emptySign: 'NA', width: 160},
                { heading: "ReportPageSize", key: "reportPageSize", sort: true, align: 'left', emptySign: 'NA', width: 110 },
                { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 80 },
                {
                    heading: "Action", key: "action", width: 100 , align: "right", type: gridColumnTypes.action, actions: [
                        {
                            action: gridActions.edit, callback: (data: any) => {
                                this.onSave(data);
                            }
                        }, {
                            action: gridActions.delete, callback: (data: any) => {
                                this._ReportConfigurationService.deactivateTheStatus(data.storeId).subscribe((response: any) => {
                                    this.toastr.success(response.message);
                                    this.grid.bindGridData();
                                });
                            }
                        }]
                } //Action 1-view, 2-Edit,3-delete
            ],
            sortField: "ReportName",
            sortOrder: 0,
            filters: [
                // { fieldName: "reportName", fieldValue: "", opType: OperatorComparer.Contains },
                // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
            ],
            row: 25
        }
    
        ngOnInit(): void { }
    
        onSave(row: any = null) {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button
    
            let that = this;
            const dialogRef = this._matDialog.open( NewReportConfigurationComponent, 
                {
                    maxHeight: '95vh',
                    width: '90%',
                    data: row
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
}
