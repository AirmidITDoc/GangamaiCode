import { FlatTreeControl } from "@angular/cdk/tree";
import { DatePipe } from "@angular/common";
import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
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
import { ConfigService } from "app/core/services/config.service";
import { AirmidDropDownComponent } from "app/main/shared/componets/airmid-dropdown/airmid-dropdown.component";


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
    children?: ExampleFlatNode[];
}

let TREE_DATA: FoodNode[] = [
    {
        id: 1,
        name: 'Appointment Date',
        mode: 'Report',
        children: [
            { id: 1, name: 'Appointment Date 1:01/01/2023', mode: 'Report' },
            { id: 2, name: 'Appointment Date 2:15/01/2023', mode: 'Report' },
            { id: 3, name: 'Appointment Date 3:30/01/2023', mode: 'Report' },
            { id: 4, name: 'Appointment Date 4:15/02/2023', mode: 'Report' }
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
    RefDoctorId: any;
    ServiceId: any;
    DepartmentId: any;
    CashCounterId: any;
    // added by raksha date:6/6/25
    GroupId: any;
    ClassId: any;
    WardId: any;
    dischargeTypeId: any;
    CompanyId: any;
    SecCompanyId: any;
    // StoreId= this._loggedUser.currentUserValue.storeId
    StoreId: any;
    FromStoreId: any;
    ToStoreId: any;
    HospitalId: any;
    ExecutiveId: any = 0;
    LoginUserId: any;
    LabPatientId: any;
    RegNo: any;
    ExpHeadId: any;
    ExpCatId: any;
    SupplierId: any;
    PaymentId: any;
    DrugTypeId: any;
    ItemId: any;
    CreditId: any;
    paymentId: any;
    OPIPType: any = '2';
    type: any = '0';
    PatientType: any;
    status: any;
    // 
    rid: number = 0;
    UId: any = 0;
    UserName: any;
    ReportName: any;
    ReportSummary: any;
    reportsData: any = [];
    reportDetail: any;
    sIsLoading = '';
    ItemCategory: any;
    PatientStatus: any;
    selectedNode: ExampleFlatNode | null = null;

    isSuperAdmin: any;

    autocompletestore: string = "Store";
    vstoreId = this._loggedUser.currentUserValue.user.storeId;
    vunitId = this._loggedUser.currentUserValue.user.unitId;
    vExecutiveId: any;

    private transformer = (node: FoodNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name,
            id: node.id,
            mode: node.mode,
            level: level,
        };
    }
    treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);
    treeFlattener = new MatTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.children);
    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    filteredOptionsCashCounter: Observable<string[]>;
    searchCashCounterList: any = [];
    FlaExpCategorySelected: boolean = false;
    FlaExpHeadSelected: boolean = false;
    flagDoctorSelected: boolean = false;
    flagRefDoctorSelected: boolean = false;
    flagUserSelected: boolean = false;
    flagDepartmentSelected: boolean = false;
    flagServiceSelected: boolean = false;
    flagCashcounterSelected: boolean = false;
    flagGroupSelected: boolean = false;
    flagClassSelected: boolean = false;
    flagWardSelected: boolean = false;
    flagAdmissionSelected: boolean = false;
    flagCompanySelected: boolean = false;
    flagSecondCompanySelected: boolean = false;
    flagDischargeTypeSelected: boolean = false;
    flagStoreSelected: boolean = false;
    flagMultiGenericSelected: boolean = false;
    flagSupplierelected: boolean = false;
    flagPaymentSelected: boolean = false;
    flagDrugTypeSelected: boolean = false;
    flagItemSelected: boolean = false;
    flagCreditReasonSelected: boolean = false;
    flagPaymentModeSelected: boolean = false;
    flagOPIPTypeSelected: boolean = false;
    flagTypeSelected: boolean = false;
    flagFromStoreSelected: boolean = false;
    flagToStoreSelected: boolean = false;
    flagUnitSelected: boolean = false;
    flagExecSelected: boolean = false;
    flagLoginUserSelected: boolean = false;
    flagPatientSelected: boolean = false;
    flagRegSelected: boolean = false;
    flagPatientTypeSelected: boolean = false;
    flagstatusSelected: boolean = false;
    flagItemCategorySelected: boolean = false;
    flagdaysSelected: boolean = false;
    flagPatientStatus: boolean = false;

    // by default set value who
    flagStoreRequired: boolean = false;
    constructor(
        public _ReportService: ReportService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        private _loggedUser: AuthenticationService,
        public toastr: ToastrService,
        private _activeRoute: ActivatedRoute,
        public _ConfigService: ConfigService,
        private router: Router
    ) {
        this.UId = this._loggedUser.currentUserValue.userId;
        this.UserName = this._loggedUser.currentUserValue.userName;
        this.isSuperAdmin = this._loggedUser.currentUserValue.user.isAdminMultiview;
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
        console.log("IIIIDDDD:", this.vstoreId)
        console.log("Hospital Id:", this.vunitId)

        const access = this._ConfigService.userAccessParam.find(x => x.AccessValueName === 'IsExecutiveUserId');
        this.vExecutiveId = access?.AccessInputValue;

        this._activeRoute.paramMap.subscribe(params => {
            this.rid = ~~(params.get('rid') || 0);
        });
        if (this.rid == 0)
            this.toastr.error("Report not found");
        this.GetAllReporConfig();

        // require fo clear dropdown & pass 0
        this._ReportService.userForm.get('UserId')?.valueChanges.subscribe(val => {
            this.UserId = (val == 0) ? 0 : val
        });

        this._ReportService.userForm.get('HospitalId')?.valueChanges.subscribe(val => {
            this.HospitalId = (val == 0) ? 0 : val
        });

        this._ReportService.userForm.get('ExecutiveId')?.valueChanges.subscribe(val => {
            this.ExecutiveId = (val == 0) ? 0 : val
        });

        this._ReportService.userForm.get('LoginUserId')?.valueChanges.subscribe(val => {
            this.LoginUserId = (val == 0) ? 0 : val
        });

        this._ReportService.userForm.get('LabPatientId')?.valueChanges.subscribe(val => {
            this.LabPatientId = (val == 0) ? 0 : val
        });

        this._ReportService.userForm.get('RegNo')?.valueChanges.subscribe(val => {
            this.RegNo = (val == 0) ? 0 : val
        });

        this._ReportService.userForm.get('PatientType')?.valueChanges.subscribe(val => {
            this.PatientType = (val == 0) ? 0 : val
        });

        this._ReportService.userForm.get('status')?.valueChanges.subscribe(val => {
            this.status = (val == 0) ? 0 : val
        });

        this._ReportService.userForm.get('RefDoctorId')?.valueChanges.subscribe(val => {
            this.RefDoctorId = (val == 0) ? 0 : val
        });

        this._ReportService.userForm.get('CompanyId')?.valueChanges.subscribe(val => {
            this.CompanyId = (val == 0) ? 0 : val
        });

        this._ReportService.userForm.get('SecCompanyId')?.valueChanges.subscribe(val => {
            this.SecCompanyId = (val == 0) ? 0 : val
        });

        this._ReportService.userForm.get('ItemCategory')?.valueChanges.subscribe(val => {
            this.ItemCategory = (val == 0) ? 0 : val
        });

        this._ReportService.userForm.get('PatientStatus')?.valueChanges.subscribe(val => {
            this.PatientStatus = (val == 0) ? 0 : val
        });

    }
    GetAllReporConfig() {
        const paramFilter = [{
            "fieldName": "MenuId",
            "fieldValue": this.rid.toString(),
            "opType": OperatorComparer.Equals
        }];
        const param: any =
        {
            "first": 0,
            "rows": 300,
            "sortField": "reportId",
            "sortOrder": 1,
            "filters": paramFilter || [],
            "Columns": [],
            "exportType": "JSON"
        }
        console.log(param)
        this._ReportService.getAllReporConfig(param).subscribe(
            (response) => {
                this.reportsData = response.data;

                console.log("List:", this.reportsData)
                debugger
                // let mainData = this.reportsData.filter(x => (x.parentid == undefined || x.parentid == null || x.parentid == '')).map((x) => ({ id: x.reportId, name: x.reportName, mode: x.reportMode }));
                const mainData = this.reportsData
                    .filter(x => !x.parentid || x.parentid == 'NULL')               // shortest & very common
                    .map(x => ({
                        id: x.reportId,
                        name: x.reportName,
                        mode: x.reportMode
                    }));

                mainData.forEach(element => {
                    element.children = this.reportsData.filter(x => (x.parentid == element.id)).map((x) => ({ id: x.reportId, name: x.reportName, mode: x.reportMode }));
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
    GetReportDeails(node: any) {
        this.OnClose();
        this.selectedNode = node;
        this.reportDetail = this.reportsData?.find(x => (x.reportId == node?.id));
        this.ReportName = this.reportDetail?.reportName;
        this.ReportSummary = this.reportDetail?.reportSummary;
        const controllerPermission = this.reportDetail?.reportFilter?.split(",");
        if (controllerPermission.filter(x => x == "Doctor")?.length > 0)
            this.flagDoctorSelected = true;
        if (controllerPermission.filter(x => x == "RefDoctor")?.length > 0)
            this.flagRefDoctorSelected = true;
        if (controllerPermission.filter(x => x == "User")?.length > 0)
            this.flagUserSelected = true;
        if (controllerPermission.filter(x => x == "Department")?.length > 0)
            this.flagDepartmentSelected = true;
        if (controllerPermission.filter(x => x == "Service")?.length > 0)
            this.flagServiceSelected = true;
        if (controllerPermission.filter(x => x == "CashCounter")?.length > 0)
            this.flagCashcounterSelected = true;
        if (controllerPermission.filter(x => x == "GroupName")?.length > 0)
            this.flagGroupSelected = true;
        if (controllerPermission.filter(x => x == "Class")?.length > 0)
            this.flagClassSelected = true;
        if (controllerPermission.filter(x => x == "Room")?.length > 0)
            this.flagWardSelected = true;
        if (controllerPermission.filter(x => x == "DichargeType")?.length > 0)
            this.flagDischargeTypeSelected = true;
        if (controllerPermission.filter(x => x == "Company")?.length > 0)
            this.flagCompanySelected = true;
        if (controllerPermission.filter(x => x == "SecondCompany")?.length > 0)
            this.flagSecondCompanySelected = true;

        if (controllerPermission.filter(x => x == "Store")?.length > 0)
            this.flagStoreSelected = true;
        this._ReportService.userForm.get('StoreId')?.setValue(this.vstoreId); //default value set

        if (controllerPermission.filter(x => x == "FromStore")?.length > 0)
            this.flagFromStoreSelected = true;
        this._ReportService.userForm.get('FromStoreId')?.setValue(this.vstoreId);

        if (controllerPermission.filter(x => x == "ToStore")?.length > 0)
            this.flagToStoreSelected = true;

        if (controllerPermission.filter(x => x == "SupplierMaster")?.length > 0)
            this.flagSupplierelected = true;
        if (controllerPermission.filter(x => x == "Bank")?.length > 0)
            this.flagPaymentSelected = true;
        if (controllerPermission.filter(x => x == "ItemDrugType")?.length > 0)
            this.flagDrugTypeSelected = true;
        if (controllerPermission.filter(x => x == "Item")?.length > 0)
            this.flagItemSelected = true;
        if (controllerPermission.filter(x => x == "CreditReason")?.length > 0)
            this.flagCreditReasonSelected = true;
        if (controllerPermission.filter(x => x == "PaymentMode")?.length > 0)
            this.flagPaymentModeSelected = true;
        if (controllerPermission.filter(x => x == "OPIPType")?.length > 0)
            this.flagOPIPTypeSelected = true;
        if (controllerPermission.filter(x => x == "type")?.length > 0)
            this.flagTypeSelected = true;
        if (controllerPermission.filter(x => x == "ExpenseHead")?.length > 0)
            this.FlaExpHeadSelected = true;
        if (controllerPermission.filter(x => x == "ExpensesCategory")?.length > 0)
            this.FlaExpCategorySelected = true;

        if (controllerPermission.filter(x => x == "Hospital")?.length > 0)
            this.flagUnitSelected = true;
        this._ReportService.userForm.get('HospitalId')?.setValue(this.vunitId);//default value set

        if (controllerPermission.filter(x => x == "Executive")?.length > 0)
            this.flagExecSelected = true;
        this._ReportService.userForm.get('ExecutiveId')?.setValue(this.vExecutiveId);

        if (controllerPermission.filter(x => x == "LoginUser")?.length > 0)
            this.flagLoginUserSelected = true;
        if (controllerPermission.filter(x => x == "PatientSearch")?.length > 0)
            this.flagPatientSelected = true;
        if (controllerPermission.filter(x => x == "RegNo")?.length > 0)
            this.flagRegSelected = true;
        if (controllerPermission.filter(x => x == "PatientType")?.length > 0)
            this.flagPatientTypeSelected = true;
        if (controllerPermission.filter(x => x == "Status")?.length > 0)
            this.flagstatusSelected = true;
        if (controllerPermission.filter(x => x == "ItemCategory")?.length > 0)
            this.flagItemCategorySelected = true;
        if (controllerPermission.filter(x => x == "Days")?.length > 0)
            this.flagdaysSelected = true;
        if (controllerPermission.filter(x => x == "MultiGenericSelection")?.length > 0)
            this.flagMultiGenericSelected = true;
        if (controllerPermission.filter(x => x == "PatientStatus")?.length > 0)
            this.flagPatientStatus = true;
        // 
    }
    SelectedUserObj(obj) {
        this.UserId = obj.value;
    }
    SelectedDoctorObj(obj) {
        this.DoctorId = obj.value;
    }
    SelectedRefDoctorObj(obj) {
        this.RefDoctorId = obj.value;
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
        this.dischargeTypeId = obj.value;
    }
    SelectedCompanyObj(obj) {
        this.CompanyId = obj.value;
    }
    SelectedStoreObj(obj) {
        this.StoreId = obj.value;
    }
    SelectedFromStoreObj(obj) {
        this.FromStoreId = obj.value;
    }
    SelectedToStoreObj(obj) {
        this.ToStoreId = obj.value;
    }
    SelectedExpheadObj(obj) {
        this.ExpHeadId = obj.value;
    }
    SelectedExpCatObj(obj) {
        this.ExpCatId = obj.value;
    }
    SelectedSupplierObj(obj) {
        this.SupplierId = obj.value;
    }
    SelectedPaymentObj(obj) {
        this.PaymentId = obj.value;
    }
    SelectedDrugTypeObj(obj) {
        this.DrugTypeId = obj.value;
    }
    SelectedItemObj(obj) {
        this.ItemId = obj.value;
    }
    SelectedCreditObj(obj) {
        this.CreditId = obj.value;
    }
    SelectedHospitalObj(obj) {
        this.HospitalId = obj.value;
    }
    SelectedExecObj(obj) {
        this.ExecutiveId = obj.value;
    }
    SelectedLoginUserObj(obj) {
        this.LoginUserId = obj.value;
    }
    SelectedPatientObj(obj) {
        this.LabPatientId = obj.value;
    }
    SelectedRegObj(obj) {
        this.RegNo = obj.value
    }
    SelectedPatientTypeObj(obj) {
        this.PatientType = obj.value
    }
    SelectedstatusObj(obj) {
        this.status = obj.value
    }

    ///// clear data
    clearUser() {
        this._ReportService.userForm.get("UserId").setValue('');
        this.UserId = "0"
    }
    clearDoctor() {
        this._ReportService.userForm.get("DoctorId").setValue('');
        this.DoctorId = "0"
    }
    clearRefDoctor() {
        this._ReportService.userForm.get("RefDoctorId").setValue('');
        this.RefDoctorId = "0"
    }
    clearService() {
        this._ReportService.userForm.get("ServiceId").setValue('');
        this.ServiceId = "0"
    }
    clearDepartment() {
        this._ReportService.userForm.get("DepartmentId").setValue('');
        this.DepartmentId = "0"
    }
    clearCashCounter() {
        this._ReportService.userForm.get("CashCounterId").setValue('');
        this.CashCounterId = "0"
    }
    clearGroup() {
        this._ReportService.userForm.get("GroupId").setValue('');
        this.GroupId = "0"
    }
    clearClass() {
        this._ReportService.userForm.get("ClassId").setValue('');
        this.ClassId = "0"
    }
    clearWard() {
        this._ReportService.userForm.get("WardId").setValue('');
        this.WardId = "0"
    }
    clearDischarge() {
        this._ReportService.userForm.get("dischargeTypeId").setValue('');
        this.dischargeTypeId = "0"
    }
    clearCompany() {
        this._ReportService.userForm.get('CompanyId').setValue('');
        this.CompanyId = "0"
    }
    clearSupplier() {
        this._ReportService.userForm.get('SupplierId').setValue('');
        this.SupplierId = "0"
    }
    clearPayment() {
        this._ReportService.userForm.get('PaymentId').setValue('');
        this.PaymentId = "0"
    }
    cleardrugType() {
        this._ReportService.userForm.get('DrugTypeId').setValue('');
        this.DrugTypeId = "0"
    }
    clearItem() {
        this._ReportService.userForm.get('ItemId').setValue('');
        this.ItemId = "0"
    }
    clearCredit() {
        this.CreditId = "0"
    }
    ClearHospital() {
        this._ReportService.userForm.get('HospitalId').setValue('');
        this.HospitalId = "0"
    }
    resetExpHead() {
        this._ReportService.userForm.get('expHeadId').setValue('');
        this.ExpHeadId = 0;
    }
    resetExpCat() {
        this._ReportService.userForm.get('expCategoryId').setValue('');
        this.ExpCatId = 0;
    }
    clearExecutive() {
        this._ReportService.userForm.get('ExecutiveId').setValue('');
        this.ExecutiveId = "0"
    }
    clearLoginUser() {
        this._ReportService.userForm.get('LoginUserId').setValue('');
        this.LoginUserId = "0"
    }
    clearPatientSearch() {
        this._ReportService.userForm.get('LabPatientId').setValue('');
        this.LabPatientId = "0"
    }
    clearRegNo() {
        this._ReportService.userForm.get('RegNo').setValue('');
        this.RegNo = "0"
    }
    clearPatientType() {
        this.PatientType = "0"
    }
    clearstatus() {
        this.status = "0"
    }
    // 
    OnClose() {
        this._ReportService.userForm.get("UserId").setValue('');
        this._ReportService.userForm.get("DoctorId").setValue('');
        this._ReportService.userForm.get("RefDoctorId").setValue('');
        this._ReportService.userForm.get("DepartmentId").setValue('');
        this._ReportService.userForm.get("ServiceId").setValue('');
        this._ReportService.userForm.get("CashCounterId").setValue('');
        this._ReportService.userForm.get("GroupId").setValue('');
        this._ReportService.userForm.get("ClassId").setValue('');
        this._ReportService.userForm.get("WardId").setValue('');
        this._ReportService.userForm.get("dischargeTypeId").setValue('');
        this._ReportService.userForm.get('CompanyId').setValue('');
        this._ReportService.userForm.get('SecCompanyId').setValue('');
        this._ReportService.userForm.get('StoreId').setValue('');
        this._ReportService.userForm.get('FromStoreId').setValue('');
        this._ReportService.userForm.get('ToStoreId').setValue('');
        this._ReportService.userForm.get('SupplierId').setValue('');
        this._ReportService.userForm.get('PaymentId').setValue('');
        this._ReportService.userForm.get('DrugTypeId').setValue('');
        this._ReportService.userForm.get('ItemId').setValue('');
        this._ReportService.userForm.get('OPIPType').setValue('2');
        this._ReportService.userForm.get('type').setValue('0');
        this._ReportService.userForm.get('expHeadId').setValue('');
        this._ReportService.userForm.get('expCategoryId').setValue('');
        this._ReportService.userForm.get('HospitalId').setValue('');
        this._ReportService.userForm.get('ExecutiveId').setValue('');
        this._ReportService.userForm.get('LoginUserId').setValue('');
        this._ReportService.userForm.get('LabPatientId').setValue('');
        this._ReportService.userForm.get('RegNo').setValue('');
        this._ReportService.userForm.get('PatientType').setValue('');
        this._ReportService.userForm.get('status').setValue('');
        this._ReportService.userForm.get('ItemCategory').setValue('');
        this._ReportService.userForm.get('PatientStatus').setValue('');
        this._ReportService.userForm.get('itemMoleculeName').setValue([]);
        this.UserId = 0;
        this.DoctorId = 0;
        this.RefDoctorId = 0;
        this.ServiceId = 0;
        this.DepartmentId = 0;
        this.CashCounterId = 0;
        this.GroupId = 0;
        this.ClassId = 0;
        this.WardId = 0;
        this.StoreId = 0;
        this.FromStoreId = 0;
        this.ToStoreId = 0;
        this.ExpHeadId = 0;
        this.ExpCatId = 0;
        this.SupplierId = 0;
        this.PaymentId = 0
        this.CompanyId = 0;
        this.SecCompanyId = 0;
        this.DrugTypeId = 0;
        this.ItemId = 0;
        this.dischargeTypeId = 0;
        this.HospitalId = 0;
        this.ExecutiveId = 0;
        this.LoginUserId = 0;
        this.LabPatientId = 0;
        this.PatientType = 0;
        this.status = 0;
        this.RegNo = 0;
        this.ItemCategory = 0;
        this.PatientStatus = 0;
        this.flagDoctorSelected = false;
        this.flagRefDoctorSelected = false;
        this.flagUserSelected = false;
        this.flagDepartmentSelected = false;
        this.flagServiceSelected = false;
        this.flagCashcounterSelected = false;
        this.flagGroupSelected = false;
        this.flagClassSelected = false;
        this.flagWardSelected = false;
        this.flagDischargeTypeSelected = false;
        this.flagCompanySelected = false;
        this.flagSecondCompanySelected = false;
        this.flagStoreSelected = false;
        this.flagFromStoreSelected = false;
        this.flagToStoreSelected = false;
        this.flagUnitSelected = false;
        this.flagExecSelected = false;
        this.flagLoginUserSelected = false;
        this.flagPatientSelected = false;
        this.flagRegSelected = false;
        this.flagSupplierelected = false;
        this.flagPaymentSelected = false;
        this.flagDrugTypeSelected = false;
        this.flagItemSelected = false;
        this.flagCreditReasonSelected = false;
        this.flagOPIPTypeSelected = false;
        this.flagTypeSelected = false;
        this.flagPaymentModeSelected = false;
        this.FlaExpCategorySelected = false;
        this.FlaExpHeadSelected = false;
        this.flagPatientTypeSelected = false;
        this.flagstatusSelected = false;
        this.flagItemCategorySelected = false;
        this.flagPatientStatus = false;
        this.flagdaysSelected = false;
        this.flagMultiGenericSelected = false;
    }
    @ViewChild('ddlDrug') ddlDrug: AirmidDropDownComponent;
    removeMolecule(item) {
        const removedIndex = this._ReportService.userForm.value.itemMoleculeName.findIndex(x => x.itemGenericNameId == item.itemGenericNameId);
        this._ReportService.userForm.value.itemMoleculeName.splice(removedIndex, 1);
        this.ddlDrug.SetSelection(this._ReportService.userForm.value.itemMoleculeName.map(x => x.itemGenericNameId));
    }
    Clearfilter(event) {
        console.log(event)
        if (event == 'days')
            this._ReportService.userForm.get('days').setValue("0")
    }
    mode: string='';
    filters: [];
    SampleReport() {
        this.mode = "GetList";
    }

    CallReportData(type) {
        this.StoreId = this._ReportService.userForm.get("StoreId").value
        setTimeout(() => {
            const paramFilterList = [
                {
                    "fieldName": "FromDate",
                    "fieldValue": this.datePipe.transform(this._ReportService.userForm.get("StartDate").value, "yyyy-MM-dd"),//"10-01-2024",
                    "opType": OperatorComparer.Equals
                },
                {
                    "fieldName": "ToDate",
                    "fieldValue": this.datePipe.transform(this._ReportService.userForm.get("EndDate").value, "yyyy-MM-dd"),//"12-12-2024",
                    "opType": OperatorComparer.Equals
                }
            ];
            if (this.flagUserSelected)
                paramFilterList.push({
                    "fieldName": "UserId",
                    "fieldValue": this.UserId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagDoctorSelected)
                paramFilterList.push({
                    "fieldName": "DoctorId",
                    "fieldValue": (this.DoctorId || "0").toString(),
                    "opType": OperatorComparer.Equals
                });
            if (this.flagRefDoctorSelected)
                paramFilterList.push({
                    "fieldName": "RefDoctorId",
                    "fieldValue": (this.RefDoctorId || "0").toString(),
                    "opType": OperatorComparer.Equals
                });
            if (this.flagDepartmentSelected)
                paramFilterList.push({
                    "fieldName": "DepartmentId",
                    "fieldValue": this.DepartmentId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagServiceSelected)
                paramFilterList.push({
                    "fieldName": "ServiceId",
                    "fieldValue": this.ServiceId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagCashcounterSelected)
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
            if (this.flagSecondCompanySelected)
                paramFilterList.push({
                    "fieldName": "SecondCompanyId",
                    "fieldValue": this.SecCompanyId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagStoreSelected)
                paramFilterList.push({
                    "fieldName": "StoreId",
                    "fieldValue": this.StoreId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagFromStoreSelected)
                paramFilterList.push({
                    "fieldName": "FromStoreId",
                    "fieldValue": this.FromStoreId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagToStoreSelected)
                paramFilterList.push({
                    "fieldName": "ToStoreId",
                    "fieldValue": this.ToStoreId.toString() || "0",
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
            if (this.flagCreditReasonSelected)
                paramFilterList.push({
                    "fieldName": "CreditId",
                    "fieldValue": this.CreditId.toString() || "2",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagPaymentModeSelected)
                paramFilterList.push({
                    "fieldName": "paymentId",
                    "fieldValue": this.paymentId.toString() || "2",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagOPIPTypeSelected)
                paramFilterList.push({
                    "fieldName": "OPIPType",
                    "fieldValue": this._ReportService.userForm.get('OPIPType').value || "2",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagTypeSelected)
                paramFilterList.push({
                    "fieldName": "Type",
                    "fieldValue": this._ReportService.userForm.get('type').value || "2",
                    "opType": OperatorComparer.Equals
                });
            if (this.FlaExpHeadSelected)
                paramFilterList.push({
                    "fieldName": "ExpHeadId",
                    "fieldValue": this.ExpHeadId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.FlaExpCategorySelected)
                paramFilterList.push({
                    "fieldName": "ExpCategoryId",
                    "fieldValue": this.ExpCatId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagUnitSelected)
                paramFilterList.push({
                    "fieldName": "HospitalId",
                    "fieldValue": this.HospitalId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagExecSelected)
                paramFilterList.push({
                    "fieldName": "ExecutiveId",
                    "fieldValue": this.ExecutiveId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagLoginUserSelected)
                paramFilterList.push({
                    "fieldName": "UserId",
                    "fieldValue": this.LoginUserId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagPatientSelected)
                paramFilterList.push({
                    "fieldName": "LabPatRegId",
                    "fieldValue": this.LabPatientId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagRegSelected)
                paramFilterList.push({
                    "fieldName": "LabPatientId",
                    "fieldValue": this.RegNo.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagPatientTypeSelected)
                paramFilterList.push({
                    "fieldName": "PatientType",
                    "fieldValue": this.PatientType.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagstatusSelected)
                paramFilterList.push({
                    "fieldName": "status",
                    "fieldValue": this.status.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagItemCategorySelected)
                paramFilterList.push({
                    "fieldName": "ItemCategoryId",
                    "fieldValue": this.ItemCategory.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagPatientStatus)
                paramFilterList.push({
                    "fieldName": "PatientStatus",
                    "fieldValue": this.PatientStatus.toString() || "0",
                    "opType": OperatorComparer.Equals
                });

            if (this.flagdaysSelected)
                paramFilterList.push({
                    "fieldName": "Days",
                    "fieldValue": this._ReportService.userForm.get('days').value.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            if (this.flagMultiGenericSelected) {
                const selectedItems = this._ReportService.userForm.get('itemMoleculeName').value;
                const ItemGenericNameIds = Array.isArray(selectedItems)
                    ? selectedItems.map(x => x.itemGenericNameId).join(',')
                    : selectedItems?.itemGenericNameId?.toString() || '0';

                paramFilterList.push({
                    "fieldName": "ItemMoleculeId",
                    "fieldValue": ItemGenericNameIds, // this._ReportService.userForm.get('itemMoleculeName').value.itemId.toString() || "0",
                    "opType": OperatorComparer.Equals
                });
            }
            //   
            const param = {
                "searchFields": paramFilterList,
                "reportId": this.reportDetail.reportId
                // "mode": this.reportDetail?.reportMode,
                // "repoertName": this.reportDetail?.reportName,
                // "headerList": this.reportDetail?.reportHeader?.split(",") || [],
                // "colList": this.reportDetail?.reportColumn?.split(",") || [],
                // "totalFieldList": this.reportDetail?.reportTotalField?.split(",") || [],
                // "groupByLabel": this.reportDetail?.reportGroupByLabel,
                // "summaryLabel": this.reportDetail?.summaryLabel,
                // "columnWidths": this.reportDetail?.reportColumnWidth?.split(",") || [],
                // "htmlFilePath": this.reportDetail?.reportBodyFile,
                // "htmlHeaderFilePath": this.reportDetail?.reportHeaderFile,
                // "spName": this.reportDetail?.reportSpname || this.reportDetail?.spName,
                // // "spName": this.reportDetail?.reportSpname,
                // "folderName": this.reportDetail?.reportFolderName,
                // "fileName": this.reportDetail?.reportFileName,
                // "vPageOrientation": this.reportDetail?.reportPageOrientation
            }
            if (type == 2) {
                this._ReportService.getExcelReport(param).subscribe(res => {

                }, (error) => {
                    this.toastr.error(error.message);
                });
            }
            else {
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
                        // this._ReportService.userForm.get("StartDate").setValue(new Date())
                        // this._ReportService.userForm.get("EndDate").setValue(new Date())
                    });
                },
                    (error) => {
                        this.toastr.error(error.message);
                    });
            }
        }, 100);
    }
}
