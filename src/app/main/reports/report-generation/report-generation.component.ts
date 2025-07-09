import { FlatTreeControl } from "@angular/cdk/tree";
import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { OperatorComparer } from "app/core/models/gridRequest";
import { AuthenticationService } from "app/core/services/authentication.service";
import { PdfviewerComponent } from "app/main/pdfviewer/pdfviewer.component";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { ReportService } from "./service/report-generation.service";


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
    // added by raksha date:6/6/25
    GroupId:any;
    ClassId:any;
    WardId:any;
    dischargeTypeId:any;
    CompanyId:any;
    StoreId:any;
    SupplierId:any;
    PaymentId:any;
    DrugTypeId:any;
    ItemId:any;
    OPIPType:any='2';
    // 
    rid: number = 0;
    UId: any = 0;
    UserName: any;
    ReportName: any;
    reportsData: any = [];
    reportDetail: any;
    sIsLoading= '';
    selectedNode:ExampleFlatNode | null = null;
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

    //created by raksha
    flagGroupSelected:boolean=false; 
    flagClassSelected:boolean=false; 
    flagWardSelected:boolean=false; 
    flagAdmissionSelected:boolean=false; 
    flagCompanySelected:boolean=false; 
    flagDischargeTypeSelected:boolean=false; 
    flagStoreSelected:boolean=false; 
    flagSupplierelected:boolean=false;
    flagPaymentSelected:boolean=false;
    flagDrugTypeSelected:boolean=false;
    flagItemSelected:boolean=false;
    flagOPIPTypeSelected:boolean=false;
    // 

    constructor(
        public _ReportService: ReportService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        private _loggedUser: AuthenticationService,
        public toastr: ToastrService,
        private _activeRoute: ActivatedRoute,
        private router: Router
    ) {
        this.UId = this._loggedUser.currentUserValue.userId;
        this.UserName = this._loggedUser.currentUserValue.userName;
        console.log(this.UId);
        this.router.routeReuseStrategy.shouldReuseRoute = () => {
            return false;
          }
      
          this.router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
              this.router.navigated = false;
            }
          });
    }

    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
    ngOnInit(): void {
        this._activeRoute.paramMap.subscribe(params => {
            this.rid = ~~(params.get('rid') || 0);
        });
        if(this.rid == 0)
            this.toastr.error("Report not found");
        this.GetAllReporConfig();
    }
    GetAllReporConfig() {
        let paramFilter = [{
            "fieldName": "MenuId",
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
            "Columns":[],
            "exportType": "JSON"
        }
        console.log(param)
        this._ReportService.getAllReporConfig(param).subscribe(
            (response) => {
                this.reportsData = response.data;
                console.log("Daaaaaaa:",this.reportsData)
                let mainData = this.reportsData.filter(x => (x.parentid == undefined ||x.parentid == null || x.parentid == '')).map((x) => ({ id: x.reportId , name: x.reportName , mode: x.reportMode }));
                mainData.forEach(element => {
                    element.children = this.reportsData.filter(x => (x.parentid == element.id)).map((x) => ({ id: x.reportId , name: x.reportName , mode: x.reportMode }));
                });
                TREE_DATA = mainData
                this.dataSource.data = TREE_DATA;
                if (response && response.message) {
                    this.toastr.success(response.message);
                }
            },
            (error) => {
                this.toastr.error(error.message);
            }
        );
    }
    GetReportDeails(node: any){
        this.OnClose();
        this.selectedNode = node;
        this.reportDetail = this.reportsData?.find(x => (x.reportId == node?.id));
        this.ReportName = this.reportDetail?.reportName;
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
        // created by raksha date:7/6/25
        if(controllerPermission.filter(x => x == "GroupName")?.length > 0)
            this.flagGroupSelected = true;
        if(controllerPermission.filter(x => x == "Class")?.length > 0)
            this.flagClassSelected = true;
        if(controllerPermission.filter(x => x == "Room")?.length > 0)
            this.flagWardSelected = true;
        if(controllerPermission.filter(x => x == "DichargeType")?.length > 0)
            this.flagDischargeTypeSelected = true;
        if(controllerPermission.filter(x => x == "Company")?.length > 0)
            this.flagCompanySelected = true;
        if(controllerPermission.filter(x => x == "Store")?.length > 0)
            this.flagStoreSelected = true;
        if(controllerPermission.filter(x => x == "SupplierMaster")?.length > 0)
            this.flagSupplierelected = true;
        if(controllerPermission.filter(x => x == "Bank")?.length > 0)
            this.flagPaymentSelected = true;
        if(controllerPermission.filter(x => x == "ItemDrugType")?.length > 0)
            this.flagDrugTypeSelected = true;
        if(controllerPermission.filter(x => x == "Item")?.length > 0)
            this.flagItemSelected = true;        
        if(controllerPermission.filter(x => x == "OPIPType")?.length > 0)
            this.flagOPIPTypeSelected = true;
        // 
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
    // created by raksha
    SelectedGroupObj(obj) {
        this.GroupId = obj.value;
    }
    SelectedClassObj(obj) {
        this.ClassId = obj.value;
    }
    SelectedWardObj(obj) {
        this.WardId = obj.value;
    }
    SelectedDischargeObj(obj) {
        this.WardId = obj.value;
    }
    SelectedCompanyObj(obj) {
        this.CompanyId = obj.value;
    }
    SelectedStoreObj(obj) {
        this.StoreId = obj.value;
    }
    SelectedSupplierObj(obj) {
        this.SupplierId = obj.value;
    }
    SelectedPaymentObj(obj) {
        this.PaymentId = obj.value;
    }
    SelectedDrugTypeObj(obj){
        this.DrugTypeId=obj.value;
    }
    SelectedItemObj(obj){
        this.ItemId=obj.value;
    }
    // 
    OnClose() {
        this._ReportService.userForm.get("UserId").setValue('');
        this._ReportService.userForm.get("DoctorId").setValue('');
        this._ReportService.userForm.get("DepartmentId").setValue('');
        this._ReportService.userForm.get("ServiceId").setValue('');
        this._ReportService.userForm.get("CashCounterId").setValue('');
        this._ReportService.userForm.get("GroupId").setValue('');
        this._ReportService.userForm.get("ClassId").setValue('');
        this._ReportService.userForm.get("WardId").setValue('');
        this._ReportService.userForm.get("dischargeTypeId").setValue('');
        this._ReportService.userForm.get('CompanyId').setValue('');
        this._ReportService.userForm.get('StoreId').setValue('');
        this._ReportService.userForm.get('SupplierId').setValue('');
        this._ReportService.userForm.get('PaymentId').setValue('');
        this._ReportService.userForm.get('DrugTypeId').setValue('');
        this._ReportService.userForm.get('ItemId').setValue('');
        this._ReportService.userForm.get('OPIPType').setValue('2');
        this.UserId = 0;
        this.DoctorId = 0;
        this.ServiceId = 0;
        this.DepartmentId = 0;
        this.CashCounterId = 0;
        this.GroupId = 0;
        this.ClassId = 0;
        this.WardId = 0;
        this.StoreId = 0;
        this.SupplierId=0;
        this.PaymentId=0
        this.CompanyId = 0;
        this.DrugTypeId=0;
        this.ItemId=0;
        this.dischargeTypeId = 0;
        this.flagDoctorSelected = false;
        this.flagUserSelected = false;
        this.flagDepartmentSelected = false;
        this.flagServiceSelected = false;
        this.flagCashcounterSelected = false;
        this.flagGroupSelected = false;
        this.flagClassSelected= false;
        this.flagWardSelected=false;
        this.flagDischargeTypeSelected=false;
        this.flagCompanySelected=false;
        this.flagStoreSelected=false;
        this.flagSupplierelected=false;
        this.flagPaymentSelected=false;
        this.flagDrugTypeSelected=false;
        this.flagItemSelected=false;
        this.flagOPIPTypeSelected=false;
    }
    GetPrint() {
        setTimeout(() => {
            let paramFilterList = [
                {
                "fieldName": "FromDate",
                "fieldValue": this.datePipe.transform(this._ReportService.userForm.get("StartDate").value,"yyyy-MM-dd"),//"10-01-2024",
                "opType": OperatorComparer.Equals
                },
                {
                "fieldName": "ToDate",
                "fieldValue": this.datePipe.transform(this._ReportService.userForm.get("EndDate").value,"yyyy-MM-dd"),//"12-12-2024",
                "opType": OperatorComparer.Equals
                }
            ];
            if(this.flagUserSelected)
                paramFilterList.push({
                    "fieldName": "UserId",
                    "fieldValue": this.UserId.toString() || "0",
                    "opType": OperatorComparer.Equals         
                });
            if(this.flagDoctorSelected)
                paramFilterList.push({
                    "fieldName": "DoctorId",
                    "fieldValue": (this.DoctorId || "0").toString(),
                    "opType": OperatorComparer.Equals        
                });  
            if(this.flagDepartmentSelected)
                paramFilterList.push({
                    "fieldName": "DepartmentId",
                    "fieldValue": this.DepartmentId.toString() || "0",
                    "opType": OperatorComparer.Equals          
                });      
            if(this.flagServiceSelected)
                paramFilterList.push({
                    "fieldName": "ServiceId",
                    "fieldValue": this.ServiceId.toString() || "0",
                    "opType": OperatorComparer.Equals          
                });
            if(this.flagCashcounterSelected)
                paramFilterList.push({
                    "fieldName": "CashCounterId",
                    "fieldValue": this.CashCounterId.toString() || "0",
                    "opType": OperatorComparer.Equals          
                });   
                // created by raksha date:7/6/25
            if (this.flagGroupSelected)
                paramFilterList.push({
                    "fieldName": "GroupId",
                    "fieldValue": this.GroupId.toString() || "0",
                    "opType": OperatorComparer.Equals
                }); 
            if (this.flagClassSelected)
                paramFilterList.push({
                    "fieldName": "ClassId",
                    "fieldValue": this.ClassId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagWardSelected)
                paramFilterList.push({
                    "fieldName": "WardId",
                    "fieldValue": this.WardId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });      
            if (this.flagDischargeTypeSelected)
                paramFilterList.push({
                    "fieldName": "dischargeTypeId",
                    "fieldValue": this.dischargeTypeId.toString() || "0",
                    "opType": OperatorComparer.Equals
                }); 
            if (this.flagCompanySelected)
                paramFilterList.push({
                    "fieldName": "CompanyId",
                    "fieldValue": this.CompanyId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagStoreSelected)
                paramFilterList.push({
                    "fieldName": "StoreId",
                    "fieldValue": this.StoreId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagSupplierelected)
                paramFilterList.push({
                    "fieldName": "SupplierId",
                    "fieldValue": this.SupplierId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagDrugTypeSelected)
                paramFilterList.push({
                    "fieldName": "DrugTypeId",
                    "fieldValue": this.DrugTypeId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagPaymentSelected)
                paramFilterList.push({
                    "fieldName": "PaymentId",
                    "fieldValue": this.PaymentId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagItemSelected)
                paramFilterList.push({
                    "fieldName": "ItemId",
                    "fieldValue": this.ItemId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            // if (this.flagOPIPTypeSelected)
            //     paramFilterList.push({
            //         "fieldName": "OPIPType",
            //         "fieldValue": this.OPIPType.toString() || "2",
            //         "opType": OperatorComparer.Equals
            //     });
            if (this.flagOPIPTypeSelected)
                paramFilterList.push({
                    "fieldName": "OPIPType",
                    "fieldValue": this._ReportService.userForm.get('OPIPType').value || "2",
                    "opType": OperatorComparer.Equals
                });
                //   
            let param = {
                "searchFields": paramFilterList,
                "mode": this.reportDetail?.reportMode,
                "repoertName": this.reportDetail?.reportName,
                "headerList":  this.reportDetail?.reportHeader?.split(",") || [],
                "colList": this.reportDetail?.reportColumn?.split(",") || [],
                "totalFieldList": this.reportDetail?.reportTotalField?.split(",") || [],
                "groupByLabel": this.reportDetail?.reportGroupByLabel,
                "summaryLabel": this.reportDetail?.summaryLabel,
                "columnWidths": this.reportDetail?.columnWidths?.split(",") || this.reportDetail?.reportColumnWidths?.split(",") || [],
                "htmlFilePath": this.reportDetail?.reportBodyFile,
                "htmlHeaderFilePath": this.reportDetail?.reportHeaderFile,
                "spName": this.reportDetail?.reportSpname,
                "folderName": this.reportDetail?.reportFolderName,
                "fileName": this.reportDetail?.reportFileName,
                "vPageOrientation": this.reportDetail?.reportPageOrientation
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
                });
            },
            (error) => {
                this.toastr.error(error.message);
            });

        }, 100);
    }
}
