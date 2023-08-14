import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigSettingParams } from 'app/core/models/config';
import { AdministrationService } from '../administration.service';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { NewConfigurationComponent } from './new-configuration/new-configuration.component';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  hasSelectedContacts: boolean;
  configObj = new ConfigSettingParams({});
  
  dataSource = new MatTableDataSource<ConfigSettingParams>();
  displayedColumns: string[] = [
    
    'MandatoryFirstName',
    'MandatoryMiddleName',
    'MandatoryLastName',
    'MandatoryAddress',
    'MandatoryCity',
    'MandatoryAge',
    'MandatoryPhoneNo',
    'OPBillCounter',
    'OPReceiptCounter',
    'OPRefundOfBillCounter',
    'IPAdvanceCounter',
    'IPBillCounter',
    'IPReceiptCounter',
    'IPRefundBillCounter',
    'IPRefofAdvCounter',
    'PrintRegAfterReg',
    'OTCharges',
    'PrintOPDCaseAfterVisit',
    'PrintIPDAfterAdm',


    // 'PopOPBillAfterVisit',
    // 'PopPayAfterOPBill',
    // 'GenerateOPBillInCashOption',
    // 'RegPrefix',
    // 'RegNo',
    // 'IPNo',
    // 'OPNo',
    // 'PathDepartment',
    // 'IsPathologistDr',
    // 'PatientTypeSelf',
    // 'G_IsPharmacyPaperSetting',
    // 'PharmacyPrintName',
    // 'G_PharmacyPaperName',
    // 'G_IsOPPaperSetting',
    // 'G_PharmacyPrintName',
    // 'G_OPPaperName',
    // 'G_IsIPPaperSetting',
    // 'G_IPPrintName',
    // 'G_IPPaperName',
    // 'G_OPPrintName',
    // 'IsOPSaleDisPer',
    // 'OPSaleDisPer',
    // 'IsIPSaleDisPer',
    // 'IPSaleDisPer',
    
    
    'action'

  ]; 
  dataSource1 = new MatTableDataSource<SchedulerParams>();
  displayedColumns1: string[] = [
    
    'ScheduleExecuteType',
    'MonthDay',
    'WeekDayName',
    'ExecuteTime',
    'Query',
    'IsDelete',
   
    'action'

  ]; 
  sIsLoading: string = '';
 
  constructor(
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public _AdministrationService: AdministrationService,) { }

  ngOnInit(): void {
    this.getConfigList();
    this.getSchedulerParamList();
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

    
  getConfigList() {
    this.sIsLoading = 'loading-data';
    
    this._AdministrationService.ConfigSettingParamList().subscribe(Visit => {
      this.dataSource.data = Visit as ConfigSettingParams[];
      console.log(this.dataSource.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
     // this.click = false;
    },
      error => {
        this.sIsLoading = '';
      });
  }


  getSchedulerParamList() {
    this.sIsLoading = 'loading-data';
    
    this._AdministrationService.SchedulerParamList().subscribe(Visit => {
      this.dataSource1.data = Visit as SchedulerParams[];
      this.dataSource1.sort = this.sort;
      this.dataSource1.paginator = this.paginator;
      this.sIsLoading = '';
     // this.click = false;
    },
      error => {
        this.sIsLoading = '';
      });
  }


  addNewConfigration() {
    const dialogRef = this._matDialog.open(NewConfigurationComponent,
      {
        maxWidth: "96vw",
            maxHeight: "700px !important ", 
            width: '100%' //, height: '100%' 
      });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
  onEdit(row){
console.log(row);
    var m_data = {
      "ConfigId":row.ConfigId,
      "PrintRegAfterReg":row.PrintRegAfterReg,
      "IPDPrefix":row.IPDPrefix,
      "OTCharges": row.OTCharges,
      "PrintOPDCaseAfterVisit": row.PrintOPDCaseAfterVisit,
      "PrintIPDAfterAdm":row.PrintIPDAfterAdm,
      "PopOPBillAfterVisit": row.PopOPBillAfterVisit,
      "PopPayAfterOPBill": row.PopPayAfterOPBill,
      "GenerateOPBillInCashOption": row.GenerateOPBillInCashOption,
      "MandatoryFirstName":row.MandatoryFirstName,
      "MandatoryMiddleName": row.MandatoryMiddleName,
      "MandatoryLastName": row.MandatoryLastName,
      "MandatoryAddress": row.MandatoryAddress,
      "MandatoryCity": row.MandatoryCity,
      "MandatoryAge": row.MandatoryAge,
      "MandatoryPhoneNo": row.MandatoryPhoneNo,
      "OPBillCounter": row.OPBillCounter,
      "OPReceiptCounter":row.OPReceiptCounter,
      "OPRefundOfBillCounter": row.OPRefundOfBillCounter,
      "IPAdvanceCounter": row.IPAdvanceCounter,
      "IPBillCounter": row.IPBillCounter,
      "IPReceiptCounter": row.IPReceiptCounter,
      "IPRefundBillCounter": row.IPRefundBillCounter,
      "IPRefofAdvCounter":row.IPRefofAdvCounter,
      "RegPrefix": row.RegPrefix,
      "RegNo": row.RegNo,
      "IPPrefix": row.IPPrefix,
      "IPNo": row.IPNo,
      "OPPrefix": row.OPPrefix,
      "OPNo":row.OPNo,
      "PathDepartment":row.PathDepartment,
      "IsPathologistDr": row.IsPathologistDr,
      "OPD_Billing_CounterId": row.OPD_Billing_CounterId,
      "OPD_Receipt_CounterId": row.OPD_Receipt_CounterId,
      "OPD_Refund_Bill_CounterId":row.OPD_Refund_Bill_CounterId,
      "OPD_Advance_CounterId": row.OPD_Advance_CounterId,
      "OPD_Refund_Advance_CounterId": row.OPD_Refund_Advance_CounterId,
      "IPD_Advance_CounterId":row.IPD_Advance_CounterId,
      "IPD_Billing_CounterId": row.IPD_Billing_CounterId,
      "IPD_Receipt_CounterId": row.IPD_Receipt_CounterId,
      "IPD_Refund_of_Bill_CounterId": row.IPD_Refund_of_Bill_CounterId,
      "IPD_Refund_of_Advance_CounterId": row.IPD_Refund_of_Advance_CounterId,
      "PatientTypeSelf": row.PatientTypeSelf,
      "ClassForEdit": row.ClassForEdit,
      "PharmacySales_CounterId": row.PharmacySales_CounterId,
      "PharmacySalesReturn_CounterId":row.PharmacySalesReturn_CounterId,
      "PharmacyReceipt_CounterId": row.PharmacyReceipt_CounterId,
      "ChkPharmacyDue": row.ChkPharmacyDue,
      "G_IsPharmacyPaperSetting": row.G_IsPharmacyPaperSetting,
      "PharmacyPrintName": row.PharmacyPrintName,
      "G_PharmacyPaperName":row.G_PharmacyPaperName,
      "G_IsOPPaperSetting": row.G_IsOPPaperSetting,
      "G_PharmacyPrintName": row.G_PharmacyPrintName,
      "G_OPPaperName": row.G_OPPaperName,
      "DepartmentId": row.DepartmentId,
      "DoctorId": row.DoctorId,
      "G_IsIPPaperSetting":row.G_IsIPPaperSetting,
      "G_IPPaperName": row.G_IPPaperName,
      "G_OPPrintName": row.G_OPPrintName,
      "IsOPSaleDisPer":row.IsOPSaleDisPer,
      "OPSaleDisPer": row.OPSaleDisPer,
      "IsIPSaleDisPer": row.IsIPSaleDisPer,
      "IPSaleDisPer": row.IPSaleDisPer,
      "PatientTypeID":row.PatientTypeSelf,
    }
    const dialogRef = this._matDialog.open(NewConfigurationComponent, 
      {    maxWidth: "96vw",
      maxHeight: "700px !important ", 
      width: '100%', //, height: '100%' 
        data : {
          configObj : m_data,
         
        }
});
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      
    });
  }
 
 
}


export class SchedulerParams {
  
  ScheduleExecuteType: number;
  MonthDay: number;
  WeekDayName: String;
  ExecuteTime: any;
  Query: string;
  IsDelete: any;
  

  constructor() {
      this.ScheduleExecuteType = 0;
      this.MonthDay = 0;
      this.WeekDayName = '';
      this.ExecuteTime = '0';
      this.Query = '';
      this.IsDelete = 0;
     
  }

}
 
