import { DatePipe } from '@angular/common';
import { Component, HostBinding, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidCardViewComponent } from 'app/main/shared/componets/airmid-card-view/airmid-card-view.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from '../admission.service';

@Component({
    selector: 'app-admission-cardview',
    templateUrl: './admission-cardview.component.html',
    styleUrls: ['./admission-cardview.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AdmissionCardviewComponent {
    @HostBinding('style.display') display = 'flex';
    @HostBinding('style.flex') flex = '1 1 auto';
    @HostBinding('style.minHeight') minH = '0';
    @HostBinding('style.flexDirection') dir = 'column';

    myFilterform: FormGroup;


    ngOnInit(): void {
        this.myFilterform = this._AdmissionService.filterForm();
    }
    pageSize = 25;
    resultsLength = 0;
    autocompletedepartment: string = "Department";
    statusOptions = [
        { text: 'All', value: '' },
        { text: 'IsActive', value: '1' },
        { text: 'IsDeactive', value: '0' }
    ];

    // Add view mode and user data for card view
    viewMode: 'table' | 'card' = 'card';
    userList: any[] = [];

    // Card view config and pagination
    cardConfig = {
        fields: [
            { label: 'First Name', key: 'firstName' },
            { label: 'Last Name', key: 'lastName' },
            { label: 'UHID', key: 'regNo' },
            { label: 'AdmissionTime', key: 'admissionTime' },
            { label: 'IPDNo', key: 'ipdno' },
            { label: 'DepartmentName', key: 'departmentName' },
            { label: 'Doctor Name', key: 'doctorname' },
            { label: 'RoomName', key: 'roomName' },
            { label: 'PatientType', key: 'patientType' },
            { label: 'RefDocName', key: 'refDocName' },
            { label: 'Is Active', key: 'isActive' }
        ],
        actions: [
            { icon: 'remove_red_eye', tooltip: 'View Password', action: 'viewPassword' },
            { icon: 'edit', tooltip: 'Edit', action: 'edit' },
            { icon: 'delete', tooltip: 'Delete', action: 'delete' }
        ]
    };

    constructor(private _formBuilder: UntypedFormBuilder, public datePipe: DatePipe, public _AdmissionService: AdmissionService,
        public _matDialog: MatDialog, public toastr: ToastrService, private _FormvalidationserviceService: FormvalidationserviceService) { }

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild(AirmidCardViewComponent) cardView: AirmidCardViewComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
    @ViewChild('actionsTemplate2') actionsTemplate2!: TemplateRef<any>;
    // @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionCompany') actionCompany!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        // Assign the template to the column dynamically
        this.gridConfig.columnsList.find(col => col.key === 'patientTypeID')!.template = this.actionsTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'isMLC')!.template = this.actionsTemplate1;
        this.gridConfig.columnsList.find(col => col.key === 'admissionType')!.template = this.actionsTemplate2;
        // this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'companyId')!.template = this.actionCompany;

    }

    allcolumns = [
        { heading: "-", key: "patientTypeID", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
        { heading: "-", key: "admissionType", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 60 },

        { heading: "-", key: "isMLC", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 80 },

        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Date", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 8 },
        { heading: "Doctor Name", key: "doctorname", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Ref Doc Name", key: "refDocName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "IPDNo", key: "ipdno", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Type", key: "patientType", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Ward Name", key: "roomName", sort: true, align: 'left', emptySign: 'NA', type: 14, width: 170 },
        { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Class Name", key: "className", sort: true, align: 'left', emptySign: 'NA', width: 170 },
        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "", key: "companyId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
        { heading: "Relative Name", key: "relativeName", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 14 },
        {
            heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ];
    allFilters = [{ fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "Doctor_Id", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "WardId", fieldValue: "0", opType: OperatorComparer.Equals },

    { fieldName: "From_Dt", fieldValue: "", opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: "", opType: OperatorComparer.Equals },
    { fieldName: "Admtd_Dschrgd_All", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "M_Name", fieldValue: "%", opType: OperatorComparer.Equals },
    { fieldName: "IPNo", fieldValue: "0", opType: OperatorComparer.Equals }
    ]

    gridConfig: gridModel = {
        apiUrl: "Admission/AdmissionList",
        columnsList: this.allcolumns,
        sortField: "AdmissionId",
        sortOrder: 1,
        filters: this.allFilters,
        row: 25
    }

    filterForm(): FormGroup {
        return this._formBuilder.group({
            RegNo: '',
            FirstName: [''],
            LastName: [''],
            DoctorId: [0],
            departmentId: [0],
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
            IsMark: ['2']
        });
    }
    onAfterLoadData(data: any[]) {
        console.log(data)
        this.userList = data;//thia.dataSource
        this.resultsLength = data.length;
    }

    onCardAction(event: { action: string, item: any }) {
        if (event.action === 'viewPassword') {
            // this.PasswordView(event.item);
        } else if (event.action === 'edit') {
            this.onEdit(event.item);
        } else if (event.action === 'delete') {
        }
    }

    // filterForm(): FormGroup {
    //   return this._formBuilder.group({
    //     UserName: [''],
    //     FirstName: [''],
    //     LastName: [''],
    //     MobileNo: [''],
    //     storeId: [],
    //     roleId: [],
    //     status: ['']
    //   });
    // }


    Clearfilter(event) {
        console.log(event)
        if (event == 'FirstName')
            this.myFilterform.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myFilterform.get('LastName').setValue("")
            else
                if (event == 'MiddleName')
                    this.myFilterform.get('MiddleName').setValue("")
        if (event == 'RegNo')
            this.myFilterform.get('RegNo').setValue("")
        if (event == 'IPDNo')
            this.myFilterform.get('IPDNo').setValue("")

        this.onChangeFirst();
    }

    f_name: any = "%"
    regNo = 0;
    l_name: any = "%"
    IsMark = "2"
    m_name: any = ""
    IPDNo: any = ""
    DoctorId = "0";
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');

    onChangeFirst() {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || "01/01/1900",
            this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd") || "01/01/1900",
            this.f_name = this.myFilterform.get('FirstName').value + "%"
        this.l_name = this.myFilterform.get('LastName').value + "%"
        this.m_name = this.myFilterform.get('MiddleName').value + "%"
        this.regNo = this.myFilterform.get('RegNo').value || "0"
        this.IPDNo = this.myFilterform.get('IPDNo').value || "0"
        this.DoctorId = this.myFilterform.get('searchDoctorId').value || "0"

        this.getfilterdata();
    }

    getfilterdata() {
        this.gridConfig = {
            apiUrl: "Admission/AdmissionList",
            columnsList: this.allcolumns,
            sortField: "AdmissionId",
            sortOrder: 0,
            filters: [
                { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
                { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                { fieldName: "Doctor_Id", fieldValue: this.DoctorId, opType: OperatorComparer.Equals },
                { fieldName: "WardId", fieldValue: "0", opType: OperatorComparer.Equals },

                { fieldName: "From_Dt", fieldValue: this.fromDate || "1900-01-01", opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate || "2100-12-31", opType: OperatorComparer.Equals },
                { fieldName: "Admtd_Dschrgd_All", fieldValue: "0", opType: OperatorComparer.Equals },
                { fieldName: "M_Name", fieldValue: this.m_name, opType: OperatorComparer.Equals },
                { fieldName: "IPNo", fieldValue: this.IPDNo, opType: OperatorComparer.Equals }

            ],
            row: 25
        }
        console.log(this.gridConfig)
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
        if (this.viewMode === 'table' && this.grid) {
            this.grid.gridConfig = this.gridConfig;
            this.grid.bindGridData();
        } else if (this.viewMode === 'card' && this.cardView) {
            this.cardView.gridConfig = this.gridConfig;
            this.cardView.bindGridData();
        }
    }



    onEdit(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur();

        const that = this;
        // const dialogRef = this._matDialog.open(NewRegistrationComponent,
        //   {
        //     maxWidth: "95vw",
        //     maxHeight: '90%',
        //     width: '90%',
        //     data: row

        //   });
        // dialogRef.afterClosed().subscribe(result => {
        //   if (result) {
        //     if (that.viewMode === 'table' && that.grid) {
        //       that.grid.bindGridData();
        //     } else if (that.viewMode === 'card' && that.cardView) {
        //       that.cardView.bindGridData();
        //     }
        //   }
        // });
    }

    Password: string;

    // PasswordView(contact) {

    //   const today = new Date();
    //   const Currentyear = today.getFullYear()
    //   this.Password = (contact.userLoginName + "@" + Currentyear)
    //   Swal.fire({
    //     title: 'Your Password is ' + contact.password,
    //     text: "Do you want to reset Your Password",
    //     icon: "success",
    //     showCancelButton: true,
    //     confirmButtonColor: "#3085d6",
    //     cancelButtonColor: "#d33",
    //     confirmButtonText: "Reset Password"
    //   }).then((flag) => {
    //     if (flag.isConfirmed) {
    //       let submitData = {
    //         "userId": contact.userId,
    //         "userName": contact.userLoginName,
    //         "password": this.Password
    //       }
    //       console.log(submitData);

    //       this._CreateUserService.PasswordUpdate(submitData).subscribe(
    //         (response) => {
    //           this.toastr.success(response.message);
    //           if (this.viewMode === 'table' && this.grid) {
    //             this.grid.bindGridData();
    //           } else if (this.viewMode === 'card' && this.cardView) {
    //             this.cardView.bindGridData();
    //           }
    //         });
    //     }
    //   });
    // }
}

