import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr'; 
import Swal from 'sweetalert2';
import { SalesHospitalService } from '../../sales-hopsital-new/sales-hospital-new.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { SalesReturnInPatientService } from '../sales-return-in-patient.service';
 
@Component({
  selector: 'app-get-prescription-returnlist',
  templateUrl: './get-prescription-returnlist.component.html',
  styleUrls: ['./get-prescription-returnlist.component.scss'],
      encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class GetPrescriptionReturnlistComponent {
 
    PrescriptionReturnFrom: FormGroup;
    SelectedObj: any = '';
    chargelist: any = [];
    Patientlist: any = [];
    AdmissionId: any = '1';
    FormDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    ToDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    IsStatus: any = 0;
    StoreId: any = 0;
    Reg_No: any = 0;
    f_name: any = '%';
    l_name: any = '%';

    @ViewChild('grid') grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;

    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionButtonTemplateType') actionButtonTemplateType!: TemplateRef<any>;
    ngAfterViewInit() {
        // Assign the template to the column dynamically 
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'Status')!.template = this.actionButtonTemplateType;
    }
    AllColumns = [
        {
            heading: "-", key: "Status", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,
            template: this.actionButtonTemplateType, width: 80
        },
        { heading: "Date", key: "presDate", sort: true, align: 'left', emptySign: 'NA', width: 100},
        { heading: "Time", key: "presTime", sort: true, align: 'left', emptySign: 'NA', width: 100},
        { heading: "Pre. NO", key: "presNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 110, },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Ward Name", key: "roomName", sort: true, align: 'left', emptySign: 'NA', width: 180 },
        { heading: "Bed Name", key: "bedName", sort: true, align: 'left', emptySign: 'NA', width: 140, }, 
        {
            heading: "Action", key: "action", align: "right", width: 70, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]
// {
//     "presReId": 60122,
//     "presNo": "13167",
//     "presDate": "08/02/2026",
//     "presTime": "  6:16PM",
//     "toStoreId": 2,
//     "addedby": 60192,
//     "isActive": true,
//     "isclosed": false,
//     "regNo": "278",
//     "patientName": "Mrs. Abbaprasad dddd Chougule",
//     "bedName": "03",
//     "roomName": "DELUXE SPECIAL ROOM",
//     "ipdNo": "ER/225/2025",
//     "admissionDate": "29/04/2025",
//     "companyName": "",
//     "tariffName": "ss",
//     "age": "0",
//     "genderName": "Female",
//     "doctorId": 5,
//     "doctorName": "Dr. Shrishal  Teli"
// }
    AllColumnsDetails = [
        { heading: "Status", key: "isClosed", type: gridColumnTypes.status, align: "center" },
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA', width: 120 }
       // { heading: "Total Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA', width: 120 }
    ]
//     {
//     "presDetailsId": 60141,
//     "presReId": 60117,
//     "itemId": 3810,
//     "batchNo": "GTF3180A",
//     "batchExpDate": "2027-09-30T00:00:00",
//     "qty": 4,
//     "isClosed": false,
//     "itemName": "AXCER 90MG TAB"
// }
    gridConfig1: gridModel = new gridModel();
    isShowDetailTable: boolean = false;

    gridConfig: gridModel = {
        apiUrl: "SalesReturn/IPPrescriptionReturnHList",
        columnsList: this.AllColumns,
        sortField: "PresReId",
        sortOrder: 0,
        filters: [
            { fieldName: "PresReId", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "ToStoreId", fieldValue: String(this.StoreId), opType: OperatorComparer.Equals },
            { fieldName: "FromDate", fieldValue: String(this.FormDate), opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: String(this.ToDate), opType: OperatorComparer.Equals },
            { fieldName: "F_Name", fieldValue: String(this.f_name), opType: OperatorComparer.Equals },
            { fieldName: "L_Name", fieldValue: String(this.l_name), opType: OperatorComparer.Equals },
            { fieldName: "IsStatus", fieldValue: "0", opType: OperatorComparer.Equals } 
        ] 
    }
    constructor(
        public _SalesService: SalesHospitalService,
        public  _SalesReturnInPatientService:SalesReturnInPatientService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        private _loggedService: AuthenticationService,
        public toastr: ToastrService,
        private _formBuilder: FormBuilder,
           private commonService: PrintserviceService,
        public _dialogRef: MatDialogRef<GetPrescriptionReturnlistComponent>,
    ) { }

    ngOnInit(): void {
        this.PrescriptionReturnFrom = this.CreatePrescriptionReturnFrom();
        this.ChangeeFilter();
    }
    CreatePrescriptionReturnFrom() {
        return this._formBuilder.group({
            start: [(new Date()).toISOString()],
            end: [(new Date()).toISOString()],
            StoreId: '',
            RegNo: '',
            StatusType: ['0'],
            PreNo: '',
            IsActive: '',
            F_Name: '',
            L_Name: ''
        });
    }
    getSelectedRow(Obj) {
        this.SelectedObj = Obj
        this.isShowDetailTable = true; 
        this.gridConfig1 = {
            apiUrl: "SalesReturn/IPPrescriptionReturnDetailsList",
            columnsList: this.AllColumnsDetails,
            sortField: "PresReId",
            sortOrder: 0,
            filters: [
                { fieldName: "PresReId", fieldValue: String(Obj.presReId), opType: OperatorComparer.Equals },
                { fieldName: "ItemName", fieldValue:'%', opType: OperatorComparer.Equals }
            ]
        }
        this.grid1.gridConfig = this.gridConfig1;
        this.grid1.bindGridData();
    }
    ChangeeFilter() {
        debugger
        this.FormDate = this.datePipe.transform(this.PrescriptionReturnFrom.get('start').value, 'yyyy-MM-dd') || '1900-01-01'
        this.ToDate = this.datePipe.transform(this.PrescriptionReturnFrom.get('end').value, 'yyyy-MM-dd') || '1900-01-01'
        this.IsStatus = this.PrescriptionReturnFrom.get('StatusType').value || 0
        this.StoreId = this._loggedService.currentUserValue.user.storeId || 0
        this.Reg_No = this.PrescriptionReturnFrom.get('RegNo').value || 0
        this.f_name = this.PrescriptionReturnFrom.get('F_Name').value + "%" || '%'
        this.l_name = this.PrescriptionReturnFrom.get('L_Name').value + "%" || '%'

        this.getHeaderDate();
    }
    getHeaderDate() { 
        this.gridConfig = {
            apiUrl: "SalesReturn/IPPrescriptionReturnHList",
            columnsList: this.AllColumns,
            sortField: "PresReId",
            sortOrder: 0,
            filters: [
            { fieldName: "PresReId", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: String(this.Reg_No), opType: OperatorComparer.Equals },
            { fieldName: "ToStoreId", fieldValue: String(this.StoreId), opType: OperatorComparer.Equals },
            { fieldName: "FromDate", fieldValue: String(this.FormDate), opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: String(this.ToDate), opType: OperatorComparer.Equals },
            { fieldName: "F_Name", fieldValue: String(this.f_name), opType: OperatorComparer.Equals },
            { fieldName: "L_Name", fieldValue: String(this.l_name), opType: OperatorComparer.Equals },
            { fieldName: "IsStatus", fieldValue: String(this.IsStatus), opType: OperatorComparer.Equals } 
            ] 
        }
            //  this.grid.gridConfig = this.gridConfig;
            // this.grid.bindGridData();
    }
    dsItemDetList: any;
    GetPrescrpList() {
        debugger
        if (!this.SelectedObj) {
            this.toastr.warning('Product not in list Please select Product!', 'warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return
        }
        let patientType = 0;
        let presReId = this.SelectedObj?.presReId; 
        const vdata = {
            "first": 0,
            "rows": 999,
            "sortField": "PresReId",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "PresReId", "fieldValue": String(presReId), "opType": "Contains" },
                { "fieldName": "ItemName", "fieldValue": '%', "opType": "Contains" }],//"40039"
            "exportType": "JSON",
            "columns": [{ "data": "string", "name": "string" }]
        }
        this._SalesReturnInPatientService.getPrescriptionReturnBalQtyList(vdata).subscribe(reponse => {
            this.chargelist = reponse.data as any;
            if (this.chargelist.length) {
                this.OnSave();
            }
        });
    }
    OnSave() {
        debugger 
        this.chargelist.forEach((element) => {
            this.Patientlist.push(
                {
                    ItemId: element.itemId,
                    ItemName: element.itemName,
                    QtyPerDay: element.qty,
                    BalQty: element.qty,
                    BatcchNo:element.batchNo || '',
                    BatchExpDate:element.batchExpDate || '1900-01-01',
                    presReId:element?.presReId || 0,
                    presDetailsId:element?.presDetailsId || 0, 
                    PatientName: this.SelectedObj?.patientName || '',
                    RegNo: this.SelectedObj.regNo || 0,
                    WardId: this.SelectedObj.wardId,
                    bedName: this.SelectedObj.bedName,
                    AdmissionID: this.SelectedObj.opIpId,
                    RegId: this.SelectedObj.regId,
                    IPMedID: this.SelectedObj.ipMedID,
                    doctorName: this.SelectedObj?.doctorName || '',
                    doctorId:this.SelectedObj?.doctorId || 0,
                    ipdNo: this.SelectedObj?.ipdNo || '',
                    companyId: this.SelectedObj?.companyId || 0,
                    companyName: this.SelectedObj?.companyName || '', 
                    tariffName:this.SelectedObj?.tariffName || '',
                    age:this.SelectedObj?.age || '0',
                    genderName:this.SelectedObj?.genderName || '',
                    roomName:this.SelectedObj?.roomName || '',
                   // admissionDate:this.SelectedObj?.admissionDate || '1900-01-01' 
                });
            console.log(this.Patientlist);
            this._dialogRef.close(this.Patientlist);
        });
    } 

     Prescclose(element) {
            debugger
            console.log(element) 
            Swal.fire({
                title: 'Do you want to cancel the Prescription?',
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Cancel it!"
            }).then((flag) => {
                if (flag.isConfirmed) {
                    const sub = {
                        "ippreId": element.ipPreId

                    }
                    this._SalesService.PrescriptionClose(sub).subscribe((response: any) => {
                        
                        });
                }
            });
        }
    onClose() {
        this.PrescriptionReturnFrom.reset();
        this._matDialog.closeAll();
    }

        viewgetIpprescriptionreturnReportPdf(response) {
        console.log(response)
        this.commonService.Onprint("PresReId", response.presReId, "NurIPprescriptionReturnReport");
    }
}
export class PriscriptionList {

    RegNo: any;
    PatientName: string;
    DoctorName: string;
    CompanyName: string;
    WardName: string;
    Date: number;
    Type: any;
    No: number;
    Time: any;
    OP_IP_ID: any;
    bedId: number;
    WardId: any;

    constructor(PriscriptionList) {
        {

            this.RegNo = PriscriptionList.RegNo || 0;
            this.PatientName = PriscriptionList.PatientName || "";
            this.Time = PriscriptionList.Time || 0;
            this.No = PriscriptionList.No || 0;
            this.Date = PriscriptionList.Date || 0;
            this.DoctorName = PriscriptionList.DoctorName || "";
            this.CompanyName = PriscriptionList.CompanyName || "";
            this.WardName = PriscriptionList.WardName || "";
        }
    }
}

