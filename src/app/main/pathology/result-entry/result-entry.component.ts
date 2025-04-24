import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ResultEntryService } from './result-entry.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MatSort } from '@angular/material/sort';
import { Pthologyresult, ResultEntryOneComponent } from './result-entry-one/result-entry-one.component';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { PathTemplateViewComponent } from './path-template-view/path-template-view.component';
import { ResultEntrytwoComponent } from './result-entrytwo/result-entrytwo.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { SampledetailtwoComponent } from '../sample-collection/sampledetailtwo/sampledetailtwo.component';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { element } from 'protractor';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';

@Component({
    selector: 'app-result-entry',
    templateUrl: './result-entry.component.html',
    styleUrls: ['./result-entry.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ResultEntryComponent implements OnInit {
    SpinLoading: boolean = false;


    displayedColumns: string[] = [
        'OP_Ip_Type',
        'Date',
        // 'Time',
        'RegNo',
        'PatientName',
        'DoctorName',
        'PatientType',
        'PBillNo',
        'GenderName',
        'AgeYear',
        'action'
    ];


    reportPrintObjList: SampleDetailObj[] = [];
    reportPrintObjs: SampleDetailObj;
    currentDate = new Date();
    click: boolean = false;
    printTemplate: any;
    MouseEvent = true;
    screenFromString = 'opd-casepaper';
    PatientTypeList: any = [];
    myformSearch: FormGroup;
    isLoading = true;
    msg: any;
    step = 0;
    dataArray = {};
    sIsLoading: string = '';
    isSampleCollection: boolean = true;
    ServiceIdList: any = [];
    PathReportID: any;
    PathTestId: any
    subscriptionArr: Subscription[] = [];
    reportPrintObj: AdmissionPersonlModel;
    SBillNo: any;
    SOPIPtype: any;
    SFromDate: any;
    PatientName: any;
    OPD_IPD: any;
    Age: any;
    PatientType: any;
    dateTimeObj: any;
    chargeslist = [];
    resultSource = [];
    printdata = [];
    Mobileno: any;
    setStep(index: number) {
        this.step = index;
    }
    SearchName: string;
    OP_IPType: any;
    Iscompleted: any;
    reportIdData: any = [];
    ServiceIdData: any = [];

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    searchregNo: any;
    vOPIPId = 0;
    f_name:any = "" 
    regNo:any="0"
    l_name:any=""
    vStatusSearch:any="0";

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    dataSource = new MatTableDataSource<PatientList>();
    dataSource1 = new MatTableDataSource<SampleList>();
    // resultSource = new MatTableDataSource<SampleList>();

    @ViewChild(MatPaginator) PathTestpaginator: MatPaginator;

    displayedColumns1: string[] = [
        'select',
        'IsCompleted',
        'IsTemplateTest',
        'TestName',
        'SampleCollectionTime',
        'SampleNo',
        'CategoryName',
        'action'
    ];

    hasSelectedContacts: boolean;

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionsIPOP') actionsIPOP!: TemplateRef<any>;

    fromdate = this.fromDate ? this.datePipe.transform(this.fromDate, "yyyy-MM-dd") : "";
    todate = this.toDate ? this.datePipe.transform(this.toDate, "yyyy-MM-dd") : "";
    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'patientType')!.template = this.actionsIPOP;
    }

    allcolumns=  [
        {
            heading: "-", key: "patientType", sort: true, align: 'left', type: gridColumnTypes.template,
            template: this.actionsIPOP
        },
        { heading: "Date", key: "pathDate", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA',width: 200 },
        { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "PatientType", key: "patientType", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Gender", key: "genderName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "AgeYear", key: "ageYear", sort: true, align: 'left', emptySign: 'NA' },
        {
            heading: "Action", key: "action", align: "right", width: 80, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ];

    gridConfig: gridModel = {
        apiUrl: "Pathology/PathologyPatientTestList",
        columnsList:this.allcolumns,
        sortField: "PresReId",
        sortOrder: 0,
        filters: [

            { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt ", fieldValue: this.fromdate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt ", fieldValue: this.todate, opType: OperatorComparer.Equals },
            { fieldName: "IsCompleted", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "OP_IP_Type", fieldValue: "2", opType: OperatorComparer.Equals }
        ]
    }

    gridConfig1: gridModel = {
        apiUrl: "Pathology/PathologyTestList",
        columnsList: [
            { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PatientName", key: "patientname", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PatientType", key: "patientType", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Gender", key: "gender", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "AgeYear", key: "ageYear", sort: true, align: 'left', emptySign: 'NA' },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data) // EDIT Records
                        }
                    }]
            }
        ],
        sortField: "PresReId",
        sortOrder: 0,
        filters: [

            { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals }
        ]
    }
   
    constructor(
        private formBuilder: UntypedFormBuilder,
        public _SampleService: ResultEntryService,
        public datePipe: DatePipe,
        private reportDownloadService: ExcelDownloadService,
        public _matDialog: MatDialog,
        private advanceDataStored: AdvanceDataStored,
        private accountService: AuthenticationService,
        public toastr: ToastrService,
        private commonService: PrintserviceService,
        public _WhatsAppEmailService: WhatsAppEmailService,
        private _fuseSidebarService: FuseSidebarService,
    ) { }

    ngOnInit(): void {
        this.myformSearch=this._SampleService.createSearchForm()
        this.fromDate = this.myformSearch.get("start").value || "";
        this.toDate = this.myformSearch.get("end").value || "";
        // this.getPatientsList();
    }

    searchRecords(data) {
        this.dataSource1.data = [];
        this.selection.clear(); 
        
        let regno = this.myformSearch.get("RegNoSearch").value || "0";
        let fromDate = this.myformSearch.get("start").value || "";
        let toDate = this.myformSearch.get("end").value || "";
        fromDate = fromDate ? this.datePipe.transform(fromDate, "yyyy-MM-dd") : "";
        toDate = toDate ? this.datePipe.transform(toDate, "yyyy-MM-dd") : "";
        let patientType = this.myformSearch.get("PatientTypeSearch").value || "2";
        let status = this.myformSearch.get("StatusSearch").value || "0";
        // Update the filters dynamically
        this.gridConfig = {
            apiUrl: "Pathology/PathologyPatientTestList",
            columnsList: [
                {
                    heading: "-", key: "patientType", sort: true, align: 'left', type: gridColumnTypes.template,
                    template: this.actionsIPOP
                },
                { heading: "Date", key: "pathDate", sort: true, align: 'left', emptySign: 'NA', width: 200 },
                { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA',width: 200 },
                { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' },
                // { heading: "PatientType", key: "patientType", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Gender", key: "genderName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "AgeYear", key: "ageYear", sort: true, align: 'left', emptySign: 'NA' },
                {
                    heading: "Action", key: "action", align: "right", width: 80, sticky: true, type: gridColumnTypes.template,
                    template: this.actionButtonTemplate  // Assign ng-template to the column
                }
            ],
            sortField: "PresReId",
            sortOrder: 0,
            filters: [

                { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
                { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
                { fieldName: "Reg_No", fieldValue: regno, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt ", fieldValue: fromDate, opType: OperatorComparer.Equals }, //"2024-01-01"
                { fieldName: "To_Dt ", fieldValue: toDate, opType: OperatorComparer.Equals }, //"2024-10-01"
                { fieldName: "IsCompleted", fieldValue: status, opType: OperatorComparer.Equals },
                { fieldName: "OP_IP_Type", fieldValue: patientType, opType: OperatorComparer.Equals }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    getSelectedRow(row: any): void {
        
        console.log("Selected row : ", row);

        this.dataSource1.data = [];
        this.selection.clear(); 

        this.reportPrintObj = row
        this.reportPrintObj["DOA"] = row.pathDate

        this.PatientName = row.patientName;
        this.OPD_IPD = row.oP_IP_No
        this.Age = row.ageYear
        this.PatientType = row.patientType
        this.Mobileno = row.mobileNo
        this.SBillNo = row.billNo;
        this.SOPIPtype = row.opdipdtype;
        this.SFromDate = this.datePipe.transform(row.pathDate, "yyyy-MM-dd ");

        this.getSampledetailList1(row);
    }

      getSampledetailList1(row) {
        // debugger
        this.dataSource1.data = [];
        let rawDate = row.pathDate; 
        let day = rawDate.split("T")[0];
        let rest = rawDate.split("T")[1].split("-"); 
        let month = rest[0]; 
        let year = rest[1]; 
     
        let formattedDate=`${day}` 
        
        console.log(formattedDate);
    
        let OPIP = row.patientType === 'OP' ? "0" : "1";
    
        var m_data = {
          "first": 0,
          "rows": 10,
          "sortField": "RegNo",
          "sortOrder": 0,
          "filters": [
            {
              "fieldName": "BillNo",
              "fieldValue": String(row.billNo),
              "opType": "Equals"
            },
            {
              "fieldName": "OP_IP_Type",
              "fieldValue": OPIP,
              "opType": "Equals"
            },
            {
              "fieldName": "From_Dt",
              "fieldValue": formattedDate,
              "opType": "Equals"
            }
          ],
          "Columns":[],
          "exportType": "JSON"
        }
    
        console.log(m_data);
        this._SampleService.PathResultentryDetailList(m_data).subscribe(Visit => {
          this.dataSource1.data = Visit.data as SampleList[];
          console.log("ResultList:",this.dataSource1.data)
          this.dataSource1.sort = this.sort;
          this.dataSource1.paginator = this.paginator;
        },
          error => {
            // this.sIsLoading = '';
          });
      }

    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

status:any="0"
opipType:any="2";
    onChangeFirst() {
        this.dataSource1.data = [];

        this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
        this.f_name = this.myformSearch.get('FirstNameSearch').value + "%"
        this.l_name = this.myformSearch.get('LastNameSearch').value + "%"
        this.status = this.myformSearch.get('StatusSearch').value
        this.opipType = this.myformSearch.get('PatientTypeSearch').value
        this.regNo = this.myformSearch.get('RegNoSearch').value || ""
        this.getfilterdata();
    }
    
    getfilterdata(){
    
    this.gridConfig = {
        apiUrl: "Pathology/PathologyPatientTestList",
        columnsList:this.allcolumns,
        sortField: "PresReId",
        sortOrder: 0,
        filters:  [
            { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "IsCompleted", fieldValue: this.status, opType: OperatorComparer.Equals },
            { fieldName: "OP_IP_Type", fieldValue: this.opipType, opType: OperatorComparer.Equals }
    
        ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData(); 
    }
    
    
    Clearfilter(event) {
    console.log(event)
    if (event == 'RegNoSearch')
        this.myformSearch.get('RegNoSearch').setValue("")
    
    this.onChangeFirst();
    }

    exportSamplerequstReportExcel() {

    }

    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(SampledetailtwoComponent,
            {
                // maxWidth: "75vw",
                maxHeight: '75vh',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    keyPressAlphanumeric(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    onSearchClear() {
        this._SampleService.myformSearch.reset({ RegNoSearch: '', FirstNameSearch: '', LastNameSearch: '', PatientTypeSearch: '', StatusSearch: '' });
    }

    SearchTest($event) {
        var m_data = {
            "BillNo": this.SBillNo,
            "OP_IP_Type": this.SOPIPtype,
            "IsCompleted": this._SampleService.myformSearch.get("TestStatusSearch").value || 0,
        }

        this._SampleService.getTestList(m_data).subscribe(Visit => {
            this.dataSource1.data = Visit as SampleList[];
            this.dataSource1.sort = this.sort;
            this.dataSource1.paginator = this.paginator;
            console.log(this.dataSource1.data);
            this.sIsLoading = '';
            this.click = false;
        },
            error => {
                this.sIsLoading = '';
            });
    }

    selection = new SelectionModel<SampleList>(true, []);

    masterToggle() {
        // Toggle selection
        if (this.isSomeSelected()) {
            this.selection.clear();
        } else {
            this.isAllSelected()
                ? this.selection.clear()
                : this.dataSource1.data.forEach(row => this.selection.select(row));
        }
    
        console.log('Selected items count:', this.selection.selected.length);
    
        this.resultSource = [...this.selection.selected];
        console.log('Selected items:', this.resultSource);
    }
    

    isSomeSelected() {
        // console.log(this.selection.selected);
        return this.selection.selected.length > 0;
    }


    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource1.data.length;

        return numSelected === numRows;
    }
    
    IsTemplateTest: any;
    chkresultentry(contact, flag) {
        // debugger
        this.printdata = [];
        this.reportIdData = [];
        this.ServiceIdData = [];

        if (flag)
            this.IsTemplateTest = contact[0]["isTemplateTest"]
        else
            this.IsTemplateTest = contact.isTemplateTest

        console.log(contact)
        if (this.IsTemplateTest == 0) {
            if (this.selection.selected.length == 0) {

                this.toastr.warning('CheckBox Select !', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
            else {
                setTimeout(() => {
                    let data = [];

                    this.selection.selected.forEach(element => {
                        console.log(element)
                        data.push({ 
                            PathReportId: element["pathReportId"].toString(),
                             ServiceId: element["serviceId"].toString(), 
                             IsCompleted: element["isCompleted"].toString() 
                            });
                        this.printdata.push({ PathReportId: element["pathReportId"].toString() });
                    });

                    console.log(this.printdata)
                    data.forEach((element) => {
                        console.log('aaaaaa:',element)
                        this.reportIdData.push(element.PathReportId)
                        this.ServiceIdData.push(element.ServiceId)
                        if (element.IsCompleted == "true")
                            this.Iscompleted = 1;
                    });

                    const dialogRef = this._matDialog.open(ResultEntryOneComponent,
                        {
                            maxWidth: "95vw",
                            height: '670px',
                            width: '90%',
                            data: {
                                RIdData: data,
                                patientdata: this.reportPrintObj,
                            }
                        });
                    dialogRef.afterClosed().subscribe(result => {
                        this.grid.bindGridData();
                        this.getSelectedRow(event);
                    });
                }, 100);
                return;
            }
        }
        else if (contact.isTemplateTest == 1) {
            this.advanceDataStored.storage = new SampleDetailObj(contact);
            const dialogRef = this._matDialog.open(ResultEntrytwoComponent,
                {
                    maxHeight: '95vh',
                    width: '90%',
                    data: contact,
                });

            dialogRef.afterClosed().subscribe(result => {
                console.log('Pathology Template  Saved ..', result);
            });
        }
        this.searchRecords(contact)
        // this.selection.clear(); // Clears all selected items
        // this.dataSource1.data = [];
    }

    getWhatsappshareResult(contact) {

        if (!contact.isTemplateTest) {
            if (this.selection.selected.length == 0) {
                this.toastr.warning('CheckBox Select !', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }
        if (!contact.isTemplateTest) {
            this.whatsappresultentry();

        }

        if (this.Mobileno != '' || this.Mobileno != '0') {
            var m_data = {
                "insertWhatsappsmsInfo": {
                    "mobileNumber": this.Mobileno || 0,
                    "smsString": '',
                    "isSent": 0,
                    "smsType": 'PathlogyTestResult',
                    "smsFlag": 0,
                    "smsDate": this.currentDate,
                    "tranNo": contact.OPD_IPD_Type,
                    "PatientType": 2,//el.PatientType,
                    "templateId": 0,
                    "smSurl": "info@gmail.com",
                    "filePath": '',
                    "smsOutGoingID": 0
                }
            }
            console.log(m_data)
            this._WhatsAppEmailService.InsertWhatsappSales(m_data).subscribe(response => {
                if (response) {
                    this.toastr.success('Result Sent on WhatsApp Successfully.', 'Save !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });
                } else {
                    this.toastr.error('API Error!', 'Error WhatsApp!', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
            });

        }
    }

    OPIPID: any = 0;
    onresultentryshow(event, m) {
        // debugger
        console.log("2nd Table Data:",m)
        this.OPIPID = m.opdipdid //m.OPD_IPD_ID
        this.advanceDataStored.storage = new SampleDetailObj(m);
        // console.log(this.advanceDataStored.storage)
        if (event.checked) {
            if (m.pathTestID == 0) {
                this.toastr.warning('This Test Not Created !', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }

        }

        if (!m || typeof m !== 'object' || !('isTemplateTest' in m) || m.isTemplateTest == null) {
            // this.dataSource1.data = [];
            // this.selection.clear();
            // setTimeout(() => {
            //     this.selection.clear();
            //     console.log('Selection cleared after timeout.');
            // }, 0);
            this.toastr.warning('This Test Not Created!', 'Warning!', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            console.log('isTemplateTest not found or null, dataSource1 cleared.');
            return;
        }
    }    

    Cancleresult(row) {
        Swal.fire({
            title: 'Confirm Result cancellation ',
            text: 'Are you sure you want to Cancel the result?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, deactivate!'

        }).then((flag) => {
debugger
            if (flag.isConfirmed) {

                let submitData = {
                    "pathReportID": row.pathReportId
                };
                console.log(submitData);
                this._SampleService.RoolbackStatus(submitData).subscribe(response => {
                    if (response) {
                        Swal.fire('Congratulations !', 'Data Updated Successfully !', 'success').then((result) => {
                            this._matDialog.closeAll();
                            this.grid.bindGridData();
                            this.dataSource1.data = [];
                        });
                    } else {
                        Swal.fire('Error !', 'Pathology Resulentry data not Updated', 'error');
                    }

                });
            }
        });
        // this.onEdit(row);
    }

viewgetPathologyTemplateReportPdf1(contact: any, mode: string) {
    debugger;
    setTimeout(() => {
        const param = {
            searchFields: [
                {
                    fieldName: "PathReportId",
                    fieldValue: String(contact.pathReportId),
                    opType: "Equals"
                },
                {
                    fieldName: "OP_IP_Type",
                    fieldValue: String(contact.opdipdtype),
                    opType: "Equals"
                }
            ],
            mode: mode  // dynamic
        };
        console.log(param)
        this._SampleService.getReportView(param).subscribe(res => {
            const matDialog = this._matDialog.open(PdfviewerComponent, {
                maxWidth: "85vw",
                height: '750px',
                width: '100%',
                data: {
                    base64: res["base64"] as string,
                    title: "Template Report Viewer"
                }
            });
            matDialog.afterClosed().subscribe(result => {});
        });
    }, 100);
}

    getPrint(contact) {
        debugger
        console.log(contact)

        if (contact.isTemplateTest)
            // this.viewgetPathologyTemplateReportPdf(contact)
        Swal.fire({
            title: 'Select Report Format',
            text: "Choose how you want to view the report:",
            icon: "warning",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            denyButtonColor: "#6c757d",
            cancelButtonColor: "#d33",
            confirmButtonText: "With Header",
            denyButtonText: "Without Header",
        }).then((result) => {
            debugger
            if (result.isConfirmed) {
                this.viewgetPathologyTemplateReportPdf1(contact, "PathologyReportTemplateWithHeader");
            } else if (result.isDenied) {
                this.viewgetPathologyTemplateReportPdf1(contact, "PathologyReportTemplate");
            }
        });
        else {
            // this.viewgetPathologyTestReportPdf(contact)
            if (this.selection.selected.length == 0) {
                this.toastr.warning('CheckBox Select !', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            } else {
                this.Printresultentry();
            }
        }
        this.selection.clear();
    }

    OP_IP_Type:any;

    // Printresultentry() {
    //     debugger;
    //     console.log(this.selection.selected);
    
    //     this.selection.selected.forEach((element) => {
    //         const param = {
    //             searchFields: [
    //                 {
    //                     fieldName: "OP_IP_Type",
    //                     fieldValue: String(element.opdipdtype),
    //                     opType: "Equals"
    //                 }
    //             ],
    //             mode: "PathologyReport"
    //         };
    
    //         console.log(param);
    
    //         this._SampleService.getReportView(param).subscribe(res => {
    //             const matDialog = this._matDialog.open(PdfviewerComponent, {
    //                 maxWidth: "85vw",
    //                 height: '750px',
    //                 width: '100%',
    //                 data: {
    //                     base64: res["base64"] as string,
    //                     title: "Pathology Test Report Viewer"
    //                 }
    //             });
    
    //             matDialog.afterClosed().subscribe(result => {
                    
    //             });
    //         });
    //     });
    // }

    selectedItem:any;
    // opiptype = this.selectedItem.opdipdtype;
    Printresultentry() {
        debugger
        console.log(this.selection.selected);
        let pathologyDelete = [];

        this.selectedItem = this.selection.selected[0];

        this.selection.selected.forEach((element) => {
            pathologyDelete.push({ pathReportId: element.pathReportId });
        });
    
        const submitData = {
            pathPrintResultEntry: pathologyDelete
        };
    
        console.log(submitData);
    
        this._SampleService.PathPrintResultentryInsert(submitData).subscribe(res => {
            if (res) {
                debugger
                this.viewgetPathologyTestReportPdf(this.selectedItem)
            }
        });
    }

    viewgetPathologyTestReportPdf(data) {
        debugger
    
        // this.selection.selected.forEach((element) => {
            const param = {
                searchFields: [
                    {
                        fieldName: "OP_IP_Type",
                        fieldValue: String(data.opdipdtype),
                        opType: "Equals"
                    }
                ],
                mode: "PathologyReport"
            };
    
            console.log(param);
    
            this._SampleService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent, {
                    maxWidth: "85vw",
                    height: '750px',
                    width: '100%',
                    data: {
                        base64: res["base64"] as string,
                        title: "Pathology Test Report Viewer"
                    }
                });
    
                matDialog.afterClosed().subscribe(result => {
                    
                });
            });
        // });
    }
    
    Printresultentrywithheader() {
        debugger
        console.log(this.selection.selected);
        let pathologyDelete = [];
    
        this.selectedItem = this.selection.selected[0];

        this.selection.selected.forEach((element) => {
            pathologyDelete.push({ pathReportId: element.pathReportId });
        });
    
        const submitData = {
            pathPrintResultEntry: pathologyDelete
        };
    
        console.log(submitData);
    
        this._SampleService.PathPrintResultentryInsert(submitData).subscribe(res => {
            if (res) {
                debugger
                this.viewgetPathologyTestReportwithheaderPdf(this.selectedItem)
            }
        });
    }

    viewgetPathologyTestReportwithheaderPdf(data) {
        debugger;
        console.log(this.selection.selected);
    
        // this.selection.selected.forEach((element) => {
            const param = {
                searchFields: [
                    {
                        fieldName: "OP_IP_Type",
                        fieldValue: String(data.opdipdtype),
                        opType: "Equals"
                    }
                ],
                mode: "PathologyReportWithHeader"
            };
    
            console.log(param);
    
            this._SampleService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent, {
                    maxWidth: "85vw",
                    height: '750px',
                    width: '100%',
                    data: {
                        base64: res["base64"] as string,
                        title: "Pathology Test Report With Header Viewer"
                    }
                });
    
                matDialog.afterClosed().subscribe(result => {
                    
                });
            });
        // });
    }
    
    AdList: boolean = false;

    whatsappresultentry() {
        console.log(this.selection.selected)
        let pathologyDelete = [];
        this.selection.selected.forEach((element) => {
            this.SOPIPtype = element["OPD_IPD_Type"]
            let pathologyDeleteObj = {};
            pathologyDeleteObj['pathReportId'] = element["PathReportID"]
            pathologyDelete.push(pathologyDeleteObj);
        });
        let submitData = {
            "printInsert": pathologyDelete,
        };
        console.log(submitData);
        this._SampleService.PathPrintResultentryInsert(submitData).subscribe(response => {
        });
        // this.selection.clear();
    }

   
    exportResultentryReportExcel() {
        this.sIsLoading == 'loading-data'
        let exportHeaders = ['Date', 'Time', 'RegNo', 'PatientName', 'DoctorName', 'PatientType', 'PBillNo', 'GenderName', 'AgeYear', 'PathDues'];
        this.reportDownloadService.getExportJsonData(this.dataSource.data, exportHeaders, 'Result Entry');
        this.dataSource.data = [];
        this.sIsLoading = '';
    }

    exportReportPdf() {
        let actualData = [];
        this.dataSource.data.forEach(e => {
            var tempObj = [];
            tempObj.push(e.DOA);
            tempObj.push(e.DOT);
            // tempObj.push(e.DVisitDate);
            tempObj.push(e.RegNo);
            tempObj.push(e.DoctorName);
            tempObj.push(e.PatientType);
            tempObj.push(e.PBillNo);
            tempObj.push(e.GenderName);
            tempObj.push(e.AgeYear);
            // tempObj.push(e.PathAmount);
            actualData.push(tempObj);
        });
        let headers = [['Date', 'Time', 'RegNo', 'DoctorName', 'PatientType', 'PBillNo', 'GenderName', 'AgeYear', 'PathAmount']];
        this.reportDownloadService.exportPdfDownload(headers, actualData, 'Result Entry');
    }

    onClose() {

    }
    onShow(event: MouseEvent) {
        // this.click = false;// !this.click;
        this.click = !this.click;

        setTimeout(() => {
            {
                this.sIsLoading = 'loading-data';

                // this.getPatientsList();
            }

        }, 50);
        this.MouseEvent = true;
        this.click = true;

    }

    onsamplecolltion(contact) {
        console.log(contact)

        this.advanceDataStored.storage = new AdvanceDetailObj(contact);

        const dialogRef1 = this._matDialog.open(SampledetailtwoComponent,
            {
                maxWidth: "70vw",
                height: '80vh',
                width: '100%',
                data: {

                    regobj: contact
                }
            });

        dialogRef1.afterClosed().subscribe(result => {
            // console.log('The dialog was closed - Insert Action', result);
            // this.getPatientsList();
        });
    }


    onClear() {
        this._SampleService.myformSearch.get('RegNoSearch').setValue("0");
        this._SampleService.myformSearch.get('StatusSearch').setValue("0");
        this._SampleService.myformSearch.get('PatientTypeSearch').setValue("2");
    }
}


export class PatientList {
    DOA: Date;
    DOT: Date;
    RegNo: any;
    PatientName: String;
    PBillNo: number;
    PatientType: number;
    DoctorName: String;
    AgeYear: any;
    GenderName: String;
    MobileNo: any;

    constructor(PatientList) {
        this.DOA = PatientList.DOA || '0';
        this.DOT = PatientList.DOT;
        this.RegNo = PatientList.RegNo;
        this.PatientName = PatientList.PatientName;
        this.PBillNo = PatientList.PBillNo;
        this.PatientType = PatientList.PatientType || '0';
        this.DoctorName = PatientList.DoctorName || 1;
        this.AgeYear = PatientList.AgeYear || 0;
        this.GenderName = PatientList.GenderName;
        this.MobileNo = PatientList.MobileNo || ''
    }
}

export class SampleList {
    VADate: Date;
    ServiceName: String;
    IsSampleCollection: boolean;
    SampleCollectionTime: Date;
    PathTestID: any;
    IsVerifySign: boolean;
    TemplateDesc: String;
    IsCompleted: boolean;
    CategoryId: any;
    opdipdtype:any;
    pathReportId:any

    constructor(SampleList) {
        this.VADate = SampleList.VADate || '';
        this.ServiceName = SampleList.ServiceName || '';
        this.IsSampleCollection = SampleList.IsSampleCollection || 0;
        this.SampleCollectionTime = SampleList.SampleCollectionTime || '';
        this.PathTestID = SampleList.PathTestID || 0;
        this.IsVerifySign = SampleList.IsVerifySign || 0;
        this.TemplateDesc = SampleList.TemplateDesc || '';
        this.IsCompleted = SampleList.IsCompleted || 0;
        this.CategoryId = SampleList.CategoryId || 0;
        this.opdipdtype=SampleList.opdipdtype || 0
        this.pathReportId=SampleList.pathReportId || 0
    }

}

export class SampleDetailObj {
    RegNo: Number;
    AdmissionID: Number;
    PatientName: string;
    AdmDocId: number;
    Doctorname: string;
    AdmDateTime: string;
    AgeDay: number;
    AgeMonth: number;
    AgeYear: number;
    ClassId: number;
    TariffName: String;
    TariffId: number;
    PathReportID: any;
    TestId: any;
    PathTemplateId: any;
    PrintTestName: any;
    CategoryID: any;
    ReportDate: any;
    PrintParameterName: string;
    NormalRange: any;
    ResultValue: any;
    VisitTime: any;
    VisitDate: any;
    Age: number;
    GenderName: any;
    ConsultantDocName: string;
    OP_IP_Type: number;
    Adm_Visit_Time: any;
    TemplateDesc: any;
    Path_ConsultantDocname: any;
    RoomName: any;
    BedName: any;
    PathDate: any;
    PathTime: any;
    PathResultDr1: any;
    PathTestID: any;
    OP_IP_No: any;
    DepartmentName: any;
    CompanyName: any;
    IPDNo: any;
    PatientType: any;
    RefDocName: any;
    ServiceId: any;
    ChargeId: any;
    GenderId: any;
    /**
    * Constructor
    *
    * @param SampleDetailObj
    */
    constructor(SampleDetailObj) {
        {
            this.RegNo = SampleDetailObj.RegNo || 0;
            this.AdmissionID = SampleDetailObj.AdmissionID || '';
            this.RefDocName = SampleDetailObj.RefDocName || '';
            this.CompanyName = SampleDetailObj.CompanyName || '';
            this.IPDNo = SampleDetailObj.IPDNo || '';
            this.DepartmentName = SampleDetailObj.DepartmentName || '';
            this.PatientType = SampleDetailObj.PatientType || '';
            this.OP_IP_No = SampleDetailObj.OP_IP_No || '';
            this.PatientName = SampleDetailObj.PatientName || '';
            this.Doctorname = SampleDetailObj.Doctorname || '';
            this.AdmDateTime = SampleDetailObj.AdmDateTime || '';
            this.AgeDay = SampleDetailObj.AgeDay || '';
            this.AgeMonth = SampleDetailObj.AgeMonth || '';
            this.AgeYear = SampleDetailObj.AgeYear || '';
            this.ClassId = SampleDetailObj.ClassId || '';
            this.TariffName = SampleDetailObj.TariffName || '';
            this.TariffId = SampleDetailObj.TariffId || '';
            this.PathReportID = SampleDetailObj.PathReportID || '';
            this.TestId = SampleDetailObj.TestId || 0;
            this.PathTemplateId = SampleDetailObj.PathTemplateId || 0;
            this.CategoryID = SampleDetailObj.CategoryID || 0;
            this.AdmDocId = SampleDetailObj.AdmDocId || 0;
            this.PrintParameterName = SampleDetailObj.PrintParameterName || '';
            this.NormalRange = SampleDetailObj.NormalRange || '';
            this.ResultValue = SampleDetailObj.ResultValue || '';
            this.VisitTime = SampleDetailObj.VisitTime || '';
            this.VisitDate = SampleDetailObj.VisitDate || '';
            this.OP_IP_Type = SampleDetailObj.OP_IP_Type || 0;
            this.ConsultantDocName = SampleDetailObj.ConsultantDocName || '';
            this.Adm_Visit_Time = SampleDetailObj.Adm_Visit_Time || '';
            this.ReportDate = SampleDetailObj.ReportDate || '';
            this.TemplateDesc = SampleDetailObj.TemplateDesc || '';
            this.PrintTestName = SampleDetailObj.PrintTestName || '';
            this.Path_ConsultantDocname = SampleDetailObj.Path_ConsultantDocname || '';
            this.PathResultDr1 = SampleDetailObj.PathResultDr1 || 0;
            this.BedName = SampleDetailObj.BedName || '';
            this.RoomName = SampleDetailObj.RoomName || '';
            this.PathDate = SampleDetailObj.PathDate || '';
            this.PathTime = SampleDetailObj.PathTime || '';
            this.PathTestID = SampleDetailObj.PathTestID || 0;
            this.ServiceId = SampleDetailObj.ServiceId || 0;
            this.ChargeId = SampleDetailObj.ChargeId || 0
            this.GenderId = SampleDetailObj.GenderId || 0
        }
    }
}


export class Templateprintdetail {
    Adm_Visit_docId: Number;
    AgeYear: number;
    CategoryName: String;
    ChargeId: number;
    DOA: Date;
    DOT: Date;
    DoctorName: string;
    GenderName: String;
    IsCompleted: boolean;
    IsPrinted: boolean;
    IsSampleCollection: boolean;
    IsTemplateTest: boolean;
    IsVerifySign: boolean;
    OPD_IPD_ID: number;
    OPD_IPD_Type: number;
    OP_IP_No: number;
    PBillNo: number;
    PathReportID: number;
    PathTestID: any;
    PatientName: string;
    PatientType: String;
    RegNo: number;
    SampleCollectionTime: Date;
    SampleNo: string;
    ServiceId: number;
    ServiceName: String;
    VADate: Date;
    VATime: Date;
    Visit_Adm_ID: any;
    ReportDate: Date;
    PathTemplateDetailsResult: any;
    PathTestServiceId: any;
    /**
     * Constructor
     *
     * @param Templateprintdetail
     */
    constructor(Templateprintdetail) {
        {
            this.Adm_Visit_docId = Templateprintdetail.Adm_Visit_docId || '';
            this.AgeYear = Templateprintdetail.AgeYear || '';
            this.CategoryName = Templateprintdetail.CategoryName || '';
            this.ChargeId = Templateprintdetail.ChargeId || '';
            this.DOA = Templateprintdetail.DOA || '';
            this.DOT = Templateprintdetail.DOT || '';
            this.DoctorName = Templateprintdetail.DoctorName || '';
            this.GenderName = Templateprintdetail.GenderName || '';
            this.IsPrinted = Templateprintdetail.IsPrinted || '';
            this.IsSampleCollection = Templateprintdetail.IsSampleCollection || '';
            this.IsTemplateTest = Templateprintdetail.IsTemplateTest || '';

            this.IsVerifySign = Templateprintdetail.IsVerifySign || '';
            this.OPD_IPD_ID = Templateprintdetail.OPD_IPD_ID || '';
            this.OPD_IPD_Type = Templateprintdetail.OPD_IPD_Type || '';
            this.OP_IP_No = Templateprintdetail.OP_IP_No || '';
            this.PBillNo = Templateprintdetail.PBillNo || '';
            this.PathReportID = Templateprintdetail.PathReportID || '';

            this.PathTestID = Templateprintdetail.PathTestID || '';

            this.PatientName = Templateprintdetail.PatientName || '';
            this.PatientType = Templateprintdetail.PatientType || '';
            this.RegNo = Templateprintdetail.RegNo || '';
            this.SampleCollectionTime = Templateprintdetail.SampleCollectionTime || '';
            this.SampleNo = Templateprintdetail.SampleNo || '';
            this.ServiceId = Templateprintdetail.ServiceId || '';
            this.ServiceName = Templateprintdetail.ServiceName || '';
            this.VADate = Templateprintdetail.VADate || '';
            this.VATime = Templateprintdetail.VATime || '';
            this.Visit_Adm_ID = Templateprintdetail.Visit_Adm_ID || '';
            this.ReportDate = Templateprintdetail.ReportDate || '';
            this.PathTemplateDetailsResult = Templateprintdetail.PathTemplateDetailsResult || '';
            this.PathTestServiceId = Templateprintdetail.PathTestServiceId || 0
        }
    }

}

//
