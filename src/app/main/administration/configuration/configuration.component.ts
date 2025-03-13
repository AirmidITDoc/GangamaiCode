import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationService } from './configuration.service';
import { NewconfigComponent } from './newconfig/newconfig.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ConfigurationComponent implements OnInit {

    constructor(public _ConfigurationService: ConfigurationService, 
            public _matDialog: MatDialog,
            public toastr: ToastrService,) { }
    
        @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
        gridConfig: gridModel = {
            apiUrl: "CurrencyMaster/List",
            columnsList: [
                { heading: "FirstName", key: "firstName", sort: true, width: 100, align: 'left', emptySign: 'NA' },
                { heading: "MiddleName", key: "middleName", sort: true, width: 100, align: 'left', emptySign: 'NA' },
                { heading: "LastName", key: "lastName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "City", key: "City", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "Age", key: "Age", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "PhoneNo", key: "PhoneNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "OPBILL", key: "oPBILL", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "OPReceipt", key: "oPReceipt", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "RefundCounter", key: "refundCounter", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "IPAdvance", key: "iPAdvance", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "IPBill", key: "iPBill", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "IPReceipt", key: "iPReceipt", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "IPRefundBill", key: "iPRefundBill", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "IPRefOfAdv", key: "iPRefOfAdv", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "DepartmentName", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "PrintRegAfterReg", key: "printRegAfterReg", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "OTCharges", key: "oTCharges", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "PrintOPDCaseAfterVisit", key: "printOPDCaseAfterVisit", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "PrintIPDAfterAdm", key: "printIPDAfterAdm", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                {
                    heading: "Action", key: "action", align: "right", width: 100, type: gridColumnTypes.action, actions: [
                        {
                            action: gridActions.edit, callback: (data: any) => {
                                this.onSave(data);
                            }
                        }, {
                            action: gridActions.delete, callback: (data: any) => {
                                this._ConfigurationService.deactivateTheStatus(data.currencyId).subscribe((response: any) => {
                                    this.toastr.success(response.message);
                                    this.grid.bindGridData();
                                });
                            }
                        }]
                } //Action 1-view, 2-Edit,3-delete
            ],
            sortField: "firstName",
            sortOrder: 0,
            filters: [
                { fieldName: "firstName", fieldValue: "", opType: OperatorComparer.Contains },
                { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
            ]
        }
    
        ngOnInit(): void { }
        onSave(row: any = null) {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button
            
            let that = this;
            const dialogRef = this._matDialog.open(NewconfigComponent,
                {
                    maxWidth: "95vw",
                    height: '95%',
                    width: '95%',
                    data: row
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
    
    }

    // @ViewChild(MatSort) sort: MatSort;
    // @ViewChild(MatPaginator) paginator: MatPaginator;
    // hasSelectedContacts: boolean;
    // configObj = new ConfigSettingParams({});
  
    // dataSource = new MatTableDataSource<ConfigSettingParams>();
    // displayedColumns: string[] = [
  
    //   'MandatoryFirstName',
    //   'MandatoryMiddleName',
    //   'MandatoryLastName',
    //   'MandatoryAddress',
    //   'MandatoryCity',
    //   'MandatoryAge',
    //   'MandatoryPhoneNo',
    //   'OPBillCounter',
    //   'OPReceiptCounter',
    //   'OPRefundOfBillCounter',
    //   'IPAdvanceCounter',
    //   'IPBillCounter',
    //   'IPReceiptCounter',
    //   'IPRefundBillCounter',
    //   'IPRefofAdvCounter',
    //   'PathDepartment',
    //   'PrintRegAfterReg',
    //   'OTCharges',
    //   'PrintOPDCaseAfterVisit',
    //   'PrintIPDAfterAdm',
  
  
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
  
  
    //   'action'
  
    // ];
    // dataSource1 = new MatTableDataSource<SchedulerParams>();
    // displayedColumns1: string[] = [
  
    //   'ScheduleExecuteType',
    //   'MonthDay',
    //   'WeekDayName',
    //   'ExecuteTime',
    //   'Query',
    //   'IsDelete',
  
    //   'action'
  
    // ];
    // sIsLoading: string = '';
  
    // constructor(
    //   public _matDialog: MatDialog,
    //   private _fuseSidebarService: FuseSidebarService,
    //   public _AdministrationService: AdministrationService,
    //   public _configurationService: ConfigurationService,
    // )
    //    { }
  
    // ngOnInit(): void {}
    //   this.getConfigList();
      // this.getSchedulerParamList();
    // }
    // toggle sidebar
    // toggleSidebar(name): void {
    //   this._fuseSidebarService.getSidebar(name).toggleOpen();
    // }
  
    // field validation 
    // get f() { return this._otTableMasterService.myformSearch.controls; }
  
  
    // getConfigList() {
    //   this.sIsLoading = 'loading-data';
  
    //   this._configurationService.ConfigSettingParamList().subscribe(Visit => {
    //     this.dataSource.data = Visit as ConfigSettingParams[];
    //     console.log(this.dataSource.data);
    //     this.dataSource.sort = this.sort;
    //     this.dataSource.paginator = this.paginator;
    //     this.sIsLoading = '';
    //     // this.click = false;
    //   },
    //     error => {
    //       this.sIsLoading = '';
    //     });
    // }
  
  
    // getSchedulerParamList() {
    //   this.sIsLoading = 'loading-data';
  
    //   this._configurationService.SchedulerParamList().subscribe(Visit => {
    //     this.dataSource1.data = Visit as SchedulerParams[];
    //     this.dataSource1.sort = this.sort;
    //     this.dataSource1.paginator = this.paginator;
    //     this.sIsLoading = '';
    //     // this.click = false;
    //   },
    //     error => {
    //       this.sIsLoading = '';
    //     });
    // }
  
  
//     addNewConfigration() {
//       const dialogRef = this._matDialog.open(NewConfigurationComponent,
//         {
//           maxWidth: "90%",
//           maxHeight: "95%",
//           width: '100%', height: '100%' 
//         });
//       dialogRef.afterClosed().subscribe(result => {
//         this.getConfigList();
//       });
//     }
//     onEdit(row) {
//       console.log(row);
//       var m_data = {
//         "ConfigId": row.ConfigId,
//         "PrintRegAfterReg": row.PrintRegAfterReg,
//         "IPDPrefix": row.IPDPrefix,
//         "OTCharges": row.OTCharges,
//         "PrintOPDCaseAfterVisit": row.PrintOPDCaseAfterVisit,
//         "PrintIPDAfterAdm": row.PrintIPDAfterAdm,
//         "PopOPBillAfterVisit": row.PopOPBillAfterVisit,
//         "PopPayAfterOPBill": row.PopPayAfterOPBill,
//         "GenerateOPBillInCashOption": row.GenerateOPBillInCashOption,
//         "MandatoryFirstName": row.MandatoryFirstName,
//         "MandatoryMiddleName": row.MandatoryMiddleName,
//         "MandatoryLastName": row.MandatoryLastName,
//         "MandatoryAddress": row.MandatoryAddress,
//         "MandatoryCity": row.MandatoryCity,
//         "MandatoryAge": row.MandatoryAge,
//         "MandatoryPhoneNo": row.MandatoryPhoneNo,
//         "OPBillCounter": row.OPBillCounter,
//         "OPReceiptCounter": row.OPReceiptCounter,
//         "OPRefundOfBillCounter": row.OPRefundOfBillCounter,
//         "IPAdvanceCounter": row.IPAdvanceCounter,
//         "IPBillCounter": row.IPBillCounter,
//         "IPReceiptCounter": row.IPReceiptCounter,
//         "IPRefundBillCounter": row.IPRefundBillCounter,
//         "IPRefofAdvCounter": row.IPRefofAdvCounter,
//         "RegPrefix": row.RegPrefix,
//         "RegNo": row.RegNo,
//         "IPPrefix": row.IPPrefix,
//         "IPNo": row.IPNo,
//         "OPPrefix": row.OPPrefix,
//         "OPNo": row.OPNo,
//         "PathDepartment": row.PathDepartment,
//         "IsPathologistDr": row.IsPathologistDr,
//         "OPD_Billing_CounterId": row.OPD_Billing_CounterId,
//         "OPD_Receipt_CounterId": row.OPD_Receipt_CounterId,
//         "OPD_Refund_Bill_CounterId": row.OPD_Refund_Bill_CounterId,
//         "OPD_Advance_CounterId": row.OPD_Advance_CounterId,
//         "OPD_Refund_Advance_CounterId": row.OPD_Refund_Advance_CounterId,
//         "IPD_Advance_CounterId": row.IPD_Advance_CounterId,
//         "IPD_Billing_CounterId": row.IPD_Billing_CounterId,
//         "IPD_Receipt_CounterId": row.IPD_Receipt_CounterId,
//         "IPD_Refund_of_Bill_CounterId": row.IPD_Refund_of_Bill_CounterId,
//         "IPD_Refund_of_Advance_CounterId": row.IPD_Refund_of_Advance_CounterId,
//         "PatientTypeSelf": row.PatientTypeSelf,
//         "ClassForEdit": row.ClassForEdit,
//         "PharmacySales_CounterId": row.PharmacySales_CounterId,
//         "PharmacySalesReturn_CounterId": row.PharmacySalesReturn_CounterId,
//         "PharmacyReceipt_CounterId": row.PharmacyReceipt_CounterId,
//         "ChkPharmacyDue": row.ChkPharmacyDue,
//         "G_IsPharmacyPaperSetting": row.G_IsPharmacyPaperSetting,
//         "PharmacyPrintName": row.PharmacyPrintName,
//         "G_PharmacyPaperName": row.G_PharmacyPaperName,
//         "G_IsOPPaperSetting": row.G_IsOPPaperSetting,
//         "G_PharmacyPrintName": row.G_PharmacyPrintName,
//         "G_OPPaperName": row.G_OPPaperName,
//         "DepartmentId": row.DepartmentId,
//         "DoctorId": row.DoctorId,
//         "G_IsIPPaperSetting": row.G_IsIPPaperSetting,
//         "G_IPPaperName": row.G_IPPaperName,
//         "G_OPPrintName": row.G_OPPrintName,
//         "IsOPSaleDisPer": row.IsOPSaleDisPer,
//         "OPSaleDisPer": row.OPSaleDisPer,
//         "IsIPSaleDisPer": row.IsIPSaleDisPer,
//         "IPSaleDisPer": row.IPSaleDisPer,
//         "PatientTypeID": row.PatientTypeSelf,
//       }
//       const dialogRef = this._matDialog.open(NewConfigurationComponent,
//         {
//           maxWidth: "90%",
//           maxHeight: "90%",
//           width: '100%', height: '100%',
//           data: {
//             configObj: m_data,
//           }
//         });
  
//         dialogRef.afterClosed().subscribe(result => {
//           console.log('The dialog was closed - Insert Action', result);
//           this.getConfigList();
//         });
//     }
  
  
//   }
  
  
//   export class SchedulerParams {
  
//     ScheduleExecuteType: number;
//     MonthDay: number;
//     WeekDayName: String;
//     ExecuteTime: any;
//     Query: string;
//     IsDelete: any;
  
  
//     constructor() {
//       this.ScheduleExecuteType = 0;
//       this.MonthDay = 0;
//       this.WeekDayName = '';
//       this.ExecuteTime = '0';
//       this.Query = '';
//       this.IsDelete = 0;
  
//     }
  
//   }
  
  