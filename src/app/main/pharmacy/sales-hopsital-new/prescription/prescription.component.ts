import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog'; 
import { fuseAnimations } from '@fuse/animations'; 
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from '../../sales/sales.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PrescriptionComponent implements OnInit {
PrescriptionFrom:FormGroup;
  SelectedObj: any = '';
  chargelist: any = [];
  Patientlist: any = [];
  AdmissionId: any = '1';
  FormDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
  ToDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
  IsStatus: any = 0;
  StoreId: any = 0;
  Reg_No: any = 0;

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
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
    { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "Time", key: "pTime", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 110, },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Ward Name", key: "roomName", sort: true, align: 'left', emptySign: 'NA', width: 180 },
    { heading: "Bed Name", key: "bedId", sort: true, align: 'left', emptySign: 'NA', width: 140, },
    { heading: "Patient Type", key: "patientType", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    {
      heading: "Action", key: "action", align: "right", width: 80, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]
  AllColumnsDetails = [
    { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Qty", key: "qtyPerDay", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "Total Qty", key: "totalQty", sort: true, align: 'left', emptySign: 'NA', width: 120 }
  ]
  gridConfig1: gridModel = new gridModel();
  isShowDetailTable: boolean = false;

  gridConfig: gridModel = {
    apiUrl: "Sales/Prescriptionheaderlist",
    columnsList: this.AllColumns,
    sortField: "IPPreId",
    sortOrder: 0,
    filters: [
      { fieldName: "FromDate", fieldValue: String(this.FormDate), opType: OperatorComparer.Equals },
      { fieldName: "ToDate", fieldValue: String(this.ToDate), opType: OperatorComparer.Equals },
      { fieldName: "IsStatus", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "StoreId", fieldValue: String(this.StoreId), opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "IPPreId", fieldValue: "0", opType: OperatorComparer.Equals }
    ]
  }
  constructor(
    public _SalesService: SalesService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    public toastr: ToastrService,
     private _formBuilder: FormBuilder,
    public _dialogRef: MatDialogRef<PrescriptionComponent>,
  ) { }

  ngOnInit(): void { 
      this.PrescriptionFrom = this.CreatePrescriptionFrom();
    this.ChangeeFilter();
  }
     CreatePrescriptionFrom() {
      return this._formBuilder.group({
        start: [(new Date()).toISOString()],
        end: [(new Date()).toISOString()],
        StoreId:'',
        RegNo:'',
        StatusType:['0'],
        PreNo:'',
        IsActive: '',
        
      });
    }
  getSelectedRow(Obj) {
    debugger
    this.SelectedObj = Obj
    this.isShowDetailTable = true;
    let patientType = 0;
    if(Obj.patientType == 'IP')
    patientType  = 1
    this.gridConfig1 = {
      apiUrl: "Sales/PrescriptionDetaillist",
      columnsList: this.AllColumnsDetails,
      sortField: "ItemID",
      sortOrder: 0,
      filters: [
        { fieldName: "OP_IP_Id", fieldValue: String(Obj.oP_IP_ID), opType: OperatorComparer.Equals },
        { fieldName: "OP_IP_Type", fieldValue: String(patientType), opType: OperatorComparer.Equals }
      ]
    }
    this.grid1.gridConfig = this.gridConfig1;
    this.grid1.bindGridData();
  } 
  ChangeeFilter() {
    debugger
    this.FormDate = this.datePipe.transform(this.PrescriptionFrom.get('start').value, 'yyyy-MM-dd')
    this.ToDate = this.datePipe.transform(this.PrescriptionFrom.get('end').value, 'yyyy-MM-dd')
    this.IsStatus = this.PrescriptionFrom.get('StatusType').value
    this.StoreId = this._loggedService.currentUserValue.user.storeId
    this.Reg_No = this.PrescriptionFrom.get('RegNo').value

    this.getHeaderDate();
  }
  getHeaderDate() {
    this.gridConfig = {
      apiUrl: "Sales/Prescriptionheaderlist",
      columnsList: this.AllColumns,
      sortField: "IPPreId",
      sortOrder: 0,
      filters: [
        { fieldName: "FromDate", fieldValue: String(this.FormDate), opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: String(this.ToDate), opType: OperatorComparer.Equals },
        { fieldName: "IsStatus", fieldValue: String(this.IsStatus), opType: OperatorComparer.Equals },
        { fieldName: "StoreId", fieldValue: String(this.StoreId), opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: String(this.Reg_No), opType: OperatorComparer.Equals },
        { fieldName: "IPPreId", fieldValue: "0", opType: OperatorComparer.Equals }
      ]
    } 
    this.grid.bindGridData();
  }
  dsItemDetList:any;
  GetPrescrpList() {
      if(this.dsItemDetList.data.length > 0){
      let strSql = "Select ItemId,QtyPerDay,BalQty,IsBatchRequired,ItemName from GeT_IP_PrescriptionItemDet where IPMedID=" + this.SelectedObj.IPMedID + " Order by ItemName "
      this._SalesService.getchargesList(strSql).subscribe(data => {
        this.chargelist = data as any;

      });  
      this.chargelist.forEach((element) => { 
        this.Patientlist.push(
          {
            ItemId :element.ItemId,
            QtyPerDay :element.QtyPerDay,
            BalQty :element.BalQty,
            IsBatchRequired :element.IsBatchRequired,
            PatientName :this.SelectedObj.patientName,
            RegNo :this.SelectedObj.regNo,
            WardId :this.SelectedObj.wardId,
            BedId :  this.SelectedObj.BedNo,
            AdmissionID :this.SelectedObj.AddmissionId,
            RegId :this.SelectedObj.RegId,
            IPMedID:this.SelectedObj.IPMedID,
            DoctorName: this.SelectedObj.DoctorName,
            IPDNo : this.SelectedObj.IPDNo
          });
      console.log(this.Patientlist);
      this._dialogRef.close(this.Patientlist);
      }); 
    }
    else{
      this.toastr.error('Product not in list Please select Product!', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      }); 
    }


  } 
  onClose() {
     this.PrescriptionFrom.reset();
    this._matDialog.closeAll();
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

