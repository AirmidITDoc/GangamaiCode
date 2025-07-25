import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { SampleCollectionService } from './sample-collection.service';
import { SampledetailtwoComponent } from './sampledetailtwo/sampledetailtwo.component';

import { MatDialog } from "@angular/material/dialog";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-sample-collection',
    templateUrl: './sample-collection.component.html',
    styleUrls: ['./sample-collection.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class SampleCollectionComponent implements OnInit {
    myformSearch:FormGroup;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;

    @ViewChild('iconlbl') iconlbl!: TemplateRef<any>;
    @ViewChild('iconcompanyName') iconcompanyName!: TemplateRef<any>;
    @ViewChild('iconisSampleCollection') iconisSampleCollection!: TemplateRef<any>;
    @ViewChild('iconisCompeleted') iconisCompeleted!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'lbl')!.template = this.iconlbl;
        this.gridConfig.columnsList.find(col => col.key === 'companyName')!.template = this.iconcompanyName;
        this.gridConfig.columnsList.find(col => col.key === 'isSampleCollection')!.template = this.iconisSampleCollection;
        // this.gridConfig.columnsList.find(col => col.key === 'isCompleted')!.template = this.iconisCompeleted;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }

    gridConfig1: gridModel = new gridModel();
    isShowDetailTable: boolean = false;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    vOPIPId = 0;
    f_name:any = "" 
    regNo:any="0"
    l_name:any="" 

    status:any="1"
    Ptype:any="2"
    allcolumns=[
        { heading: "-", key: "lbl", width: 30, sort: true, align: 'left', type: gridColumnTypes.template },
        { heading: "-", key: "companyName", width: 30, sort: true, align: 'left', type: gridColumnTypes.template },
        { heading: "-", key: "isSampleCollection", width: 80, sort: true, align: 'left', type: gridColumnTypes.template },
         { heading: "Admission Date", key: "vaTime", sort: true, align: 'left', emptySign: 'NA', width: 200},
        // { heading: "Collection Date", key: "pathDate", sort: true, align: 'left', emptySign: 'NA', width: 200,type:6},
        { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Admission No", key: "oP_IP_No", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "PatientType", key: "patientType", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "CompanyName", key: "cm", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "WardName", key: "wardName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        } 
                
    ];
    gridConfig: gridModel = {
        apiUrl: "PathlogySampleCollection/SampleCollectionPatientList",
        columnsList: this.allcolumns,
        sortField: "RegNo",
        sortOrder: 0,
        filters: [
            { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "IsCompleted", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "OP_IP_Type", fieldValue: "2", opType: OperatorComparer.Equals }
        ]
    }

    constructor(public _SampleCollectionService: SampleCollectionService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public toastr: ToastrService,) { }

    ngOnInit(): void {
this.myformSearch=this._SampleCollectionService.createSearchForm()
    }

    getSelectedRow(row: any): void {
        debugger
        console.log("selectedRow:",row)
        let billNo = row.billNo;

        let rawDate = row.pathDate; 
        let day = rawDate.split("T")[0];
        let rest = rawDate.split("T")[1].split("-"); 
        let month = rest[0]; 
        let year = rest[1]; 
     
        let formattedDate=`${day}` 
        
        console.log(formattedDate);

        let opipType = row.lbl === 'OP' ? 0 : 1;

        this.gridConfig1 = {
            apiUrl: "PathlogySampleCollection/SampleCollectionTestList",
            columnsList: [
                { heading: "Completed", key: "isCompleted", sort: true, align: 'left',type: gridColumnTypes.template, 
                    template:this.iconisCompeleted, width: 50 },
                { heading: "SampleNo", key: "sampleNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                { heading: "TestName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 400 },
                { heading: "CollectionDate/Time", key: "sampleCollectionTime", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            ],
            sortField: "BillNo",
            sortOrder: 0,
            filters: [
                { fieldName: "BillNo", fieldValue: String(billNo), opType: OperatorComparer.Equals },
                { fieldName: "BillDate", fieldValue: formattedDate, opType: OperatorComparer.Equals },
                { fieldName: "OP_IP_Type", fieldValue: String(opipType), opType: OperatorComparer.Equals },
            ]
        };

        this.isShowDetailTable = true;

        setTimeout(() => {
            this.grid1.gridConfig = this.gridConfig1;
            this.grid1.bindGridData();
        });
        console.log(this.gridConfig1)
    }

     onChangeFirst() {
        debugger
    this.isShowDetailTable = false;
            this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
            this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
            this.f_name = this.myformSearch.get('FirstName').value + "%"
            this.l_name = this.myformSearch.get('LastName').value + "%"
            this.regNo = this.myformSearch.get('RegNo').value || ""
            this.status = this.myformSearch.get('StatusSearch').value 
            this.Ptype = this.myformSearch.get('PatientTypeSearch').value 

            this.getfilterdata();
        }
    
    getfilterdata(){
        
        this.gridConfig = {
            apiUrl: "PathlogySampleCollection/SampleCollectionPatientList",
            columnsList:this.allcolumns , 
            sortField: "RegNo",
            sortOrder: 0,
            filters:  [
                { fieldName: "F_Name ", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
                { fieldName: "L_Name", fieldValue:this.l_name, opType: OperatorComparer.StartsWith },
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "IsCompleted", fieldValue: this.status, opType: OperatorComparer.Equals },
                { fieldName: "OP_IP_Type", fieldValue:  this.Ptype, opType: OperatorComparer.Equals }
        
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData(); 
    }
      
    
    Clearfilter(event) {
        console.log(event)
        if (event == 'FirstName')
            this.myformSearch.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myformSearch.get('LastName').setValue("")
        if (event == 'RegNo')
            this.myformSearch.get('RegNo').setValue("")
       
        this.onChangeFirst();
      }

    exportReportPdf() {
    
    }

    
    exportSamplerequstReportExcel(){}

    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(SampledetailtwoComponent,
            {
                // maxWidth: "75vw",
                maxHeight: '80vh',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            // if (result) {
                this.grid.bindGridData();
            this.grid1.bindGridData();
            // }
        });
    }

}
