import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { AuthenticationService } from "app/core/services/authentication.service";
import { ToastrService } from "ngx-toastr";
import { ReportService } from "./service/report-generation.service";
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { Observable } from "rxjs";
import { map, startWith } from 'rxjs/operators';
import { PdfviewerComponent } from "app/main/pdfviewer/pdfviewer.component";
import { ActivatedRoute } from "@angular/router";
import { OperatorComparer } from "app/core/models/gridRequest";


interface FoodNode {
    id: number;
    name: string;
    mode: string;
    children?: FoodNode[];
}

export class ExampleFlatNode {
    expandable: boolean;
    level?: number;
    id: number;
    name: string;
    mode: string;
    children?:ExampleFlatNode[];
}
  
  let TREE_DATA: FoodNode[] = [
    {
      id: 1,
      name: 'Appointment Date',
      mode: 'Report',
      children: [
        {id: 1, name: 'Appointment Date 1:01/01/2023',  mode: 'Report'},
        {id: 2, name: 'Appointment Date 2:15/01/2023',  mode: 'Report'},
        {id: 3, name: 'Appointment Date 3:30/01/2023',  mode: 'Report'},
        {id: 4, name: 'Appointment Date 4:15/02/2023',  mode: 'Report'}
      ]
    }
    
  ];
@Component({
    selector: "app-report-generation",
    templateUrl: "./report-generation.component.html",
    styleUrls: ["./report-generation.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ReportGenerationComponent implements OnInit {
    UserId: any;
    DoctorId: any;
    ServiceId: any;
    DepartmentId: any;
    CashCounterId: any;
    rid: number = 0;
    UId: any = 0;
    UserName: any;
    ReportName: any;
    reportsData: any = [];
    reportDetail: any;
    sIsLoading= '';
    private transformer = (node: FoodNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name,
            id: node.id,
            mode: node.mode,
            level: level,
        };
    }
    treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level,  node => node.expandable);
    treeFlattener = new MatTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.children);
    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    
    filteredOptionsCashCounter: Observable<string[]>;
    searchCashCounterList:any=[];

    flagDoctorSelected: boolean = false;
    flagUserSelected: boolean = false;
    flagDepartmentSelected: boolean = false;    
    flagServiceSelected: boolean = false;
    flagCashcounterSelected: boolean = false;

    constructor(
        public _ReportService: ReportService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        private _loggedUser: AuthenticationService,
        public toastr: ToastrService,
        private _activeRoute: ActivatedRoute
    ) {
        this.UId = this._loggedUser.currentUserValue.userId;
        this.UserName = this._loggedUser.currentUserValue.userName;
        console.log(this.UId);
    }

    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
    ngOnInit(): void {
        debugger
        this._activeRoute.paramMap.subscribe(params => {
            this.rid = ~~(params.get('rid') || 106);
        });
        this.GetAllReporConfig();
    }
    GetAllReporConfig() {
        let paramFilter = [{
            "fieldName": "menuId",
            "fieldValue": this.rid.toString(),
            "opType": OperatorComparer.Equals
        }];
        var param: any =
        {
            "first": 0,
            "rows": 100,
            "sortField": "reportId",
            "sortOrder": 1,
            "filters": paramFilter || [],
            "exportType": "JSON"
        }
        console.log(param)
        this._ReportService.getAllReporConfig(param).subscribe(
            (response) => {
                this.reportsData = response.data;
                let mainData = this.reportsData.filter(x => (x.parentid == undefined ||x.parentid == null || x.parentid == '')).map((x) => ({ id: x.reportId , name: x.reportName , mode: x.reportMode }));
                mainData.forEach(element => {
                    element.children = this.reportsData.filter(x => (x.parentid == element.id)).map((x) => ({ id: x.reportId , name: x.reportName , mode: x.reportMode }));
                });
                TREE_DATA = mainData
                this.dataSource.data = TREE_DATA;
                this.toastr.success(response.message);
            },
            (error) => {
                this.toastr.error(error.message);
            }
        );
    }
    GetReportDeails(node: any){
        this.reportDetail = this.reportsData.find(x => (x.reportId == node?.id));
        this.ReportName = this.reportDetail.reportName;
        let controllerPermission = this.reportDetail?.reportFilter?.split(",");
        if(controllerPermission.filter(x => x == "Doctor")?.length > 0)
            this.flagDoctorSelected = true;
        if(controllerPermission.filter(x => x == "User")?.length > 0)
            this.flagUserSelected = true;
        if(controllerPermission.filter(x => x == "Department")?.length > 0)
            this.flagDepartmentSelected = true;
        if(controllerPermission.filter(x => x == "Service")?.length > 0)
            this.flagServiceSelected = true;
        if(controllerPermission.filter(x => x == "CashCounter")?.length > 0)
            this.flagCashcounterSelected = true;
    }
    SelectedUserObj(obj) {
        this.UserId = obj.value;
    }
    SelectedDoctorObj(obj) {
        this.DoctorId = obj.value;
    }
    SelectedServiceObj(obj) {
        this.ServiceId = obj.value;
    }
    SelectedDepartmentObj(obj) {
        this.DepartmentId = obj.value;
    }
    SelecteCashCounterObj(obj) {
        this.CashCounterId = obj.value;
    }
    OnClose() {}
    GetPrint() {
        setTimeout(() => {
            let paramFilterList = [
                {
                "fieldName": "FromDate",
                "fieldValue": this.datePipe.transform(this._ReportService.userForm.get("StartDate").value,"dd-MM-yyyy"),//"10-01-2024",
                "opType": OperatorComparer.Equals
                },
                {
                "fieldName": "ToDate",
                "fieldValue": this.datePipe.transform(this._ReportService.userForm.get("EndDate").value,"dd-MM-yyyy"),//"12-12-2024",
                "opType": OperatorComparer.Equals
                }
            ];
            if(this.flagUserSelected)
                paramFilterList.push({
                    "fieldName": "UserId",
                    "fieldValue": this.UserId,
                    "opType": OperatorComparer.Equals         
                });
            if(this.flagDoctorSelected)
                paramFilterList.push({
                    "fieldName": "DoctorId",
                    "fieldValue": this.DoctorId,
                    "opType": OperatorComparer.Equals        
                });  
            if(this.flagDepartmentSelected)
                paramFilterList.push({
                    "fieldName": "DepartmentId",
                    "fieldValue": this.DepartmentId,
                    "opType": OperatorComparer.Equals          
                });      
            if(this.flagServiceSelected)
                paramFilterList.push({
                    "fieldName": "ServiceId",
                    "fieldValue": this.ServiceId,
                    "opType": OperatorComparer.Equals          
                });
            if(this.flagCashcounterSelected)
                paramFilterList.push({
                    "fieldName": "CashcounterId",
                    "fieldValue": this.CashCounterId,
                    "opType": OperatorComparer.Equals          
                });                                                            
            let param = {
                "searchFields": paramFilterList,
                "mode": this.reportDetail.reportMode,
                "repoertName": this.reportDetail.reportName,
                "headerList":  this.reportDetail.reportHeader.split(",") || [],
                "colList": this.reportDetail.reportColumn.split(",") || [],
                "htmlFilePath": this.reportDetail.reportBodyFile,
                "htmlHeaderFilePath": this.reportDetail.reportHeaderFile,
                "spName": this.reportDetail.reportSpname,
                "folderName": this.reportDetail.reportFolderName,
                "fileName": this.reportDetail.reportFileName
              }
            console.log(param)
            this._ReportService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                {
                    maxWidth: "85vw",
                    height: '750px',
                    width: '100%',
                    data: {
                        base64: res["base64"] as string,
                        title: this.reportDetail.reportMode + " " + "Viewer"
                    }
                });

                matDialog.afterClosed().subscribe(result => {
                    debugger
                });
            },
            (error) => {
                this.toastr.error(error.message);
            });

        }, 100);
    }
}
