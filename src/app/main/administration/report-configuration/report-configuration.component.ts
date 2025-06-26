import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { NewReportConfigurationComponent } from './new-report-configuration/new-report-configuration.component';
import { ReportConfigurationService } from './report-configuration.service';

@Component({
    selector: 'app-report-configuration',
    templateUrl: './report-configuration.component.html',
    styleUrls: ['./report-configuration.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ReportConfigurationComponent implements OnInit {

    myform: FormGroup;
    autocompleteModedReport: string = "ReportConfig";
    autocompleteModedMenu:string ="MenuMaster";

    constructor(public _ReportConfigurationService: ReportConfigurationService, public _matDialog: MatDialog,
        public toastr: ToastrService, private _formBuilder: UntypedFormBuilder,) { }
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "ReportConfig/List",
        columnsList: [
            { heading: "Code", key: "reportId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "ReportSection", key: "reportSection", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "ReportName", key: "reportName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
            { heading: "Parentid", key: "parentid", sort: true, align: 'left', emptySign: 'NA', width: 80 },
            { heading: "ReportMode", key: "reportMode", sort: true, align: 'left', emptySign: 'NA', width: 250 },
            { heading: "ReportTitle", key: "reportTitle", sort: true, align: 'left', emptySign: 'NA', width: 250 },
            { heading: "ReportHeader", key: "reportHeader", sort: true, align: 'left', emptySign: 'NA', width: 350 },
            { heading: "ReportColumn", key: "reportColumn", sort: true, align: 'left', emptySign: 'NA', width: 350 },
            { heading: "reportTotalField", key: "reportTotalField", sort: true, align: "left", emptySign: 'NA', width: 350 },
            { heading: "reportGroupByLabel", key: "reportGroupByLabel", sort: true, align: "left", emptySign: 'NA', width: 250 },
            { heading: "summaryLabel", key: "summaryLabel", sort: true, align: "left", emptySign: 'NA', width: 250 },
            { heading: "Column Widths", key: "reportColumnWidths", sort: true, align: "left", emptySign: 'NA', width: 250 },
            { heading: "ReportHeaderFile", key: "reportHeaderFile", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "ReportBodyFile", key: "reportBodyFile", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "ReportFolderName", key: "reportFolderName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "ReportFileName", key: "reportFileName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "ReportSPName", key: "reportSpname", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "ReportPageOrientation", key: "reportPageOrientation", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "ReportPageSize", key: "reportPageSize", sort: true, align: 'left', emptySign: 'NA', width: 120 },
            {
                heading: "Action", key: "action", width: 100, align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._ReportConfigurationService.deactivateTheStatus(data.reportId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "ReportId",
        sortOrder: 1,
        // filters: [
        //     { fieldName: "reportName", fieldValue: "", opType: OperatorComparer.Contains },
            // { fieldName: "menuName", fieldValue: "", opType: OperatorComparer.Contains },
        //     { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        // ]
        filters: [
            { fieldName: "ReportId", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    }

    ngOnInit(): void {
        this.myform = this.createseacrhform();
        if(this.myform.get('reportName').value=="0"){
            this.gridConfig.filters[0].fieldValue = ""  
        }
    }


    createseacrhform(): FormGroup {
        return this._formBuilder.group({
            reportName: [""],
            MenuName:['']
        });
    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewReportConfigurationComponent,
            {
                maxWidth: "80vw",
                maxHeight: '95%',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    ListView(obj: any) {
        console.log(obj)
        if(this.myform.get('reportName').value=="0"){
           this.myform.get('reportName').setValue("") 
        }
        this.gridConfig.filters[0].fieldValue = obj.value
    }

     ListView1(obj: any) {
        console.log(obj)
        if(this.myform.get('MenuName').value=="0"){
           this.myform.get('MenuName').setValue("") 
        }
        this.gridConfig.filters[1].fieldValue = obj.text
    }

//     ListView(value) {
//         debugger
//     console.log(value)
//      if(value.value!==0)
//         this.DoctorId=String(value.value)
//     else
//     this.DoctorId="0"

//     this.onChangeFirst();
// }
}
