import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { BrowseOpListService } from './browse-op-list.service';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-browse-op-list',
  templateUrl: './browse-op-list.component.html',
  styleUrls: ['./browse-op-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BrowseOpListComponent implements OnInit {

  click: boolean = false;
  MouseEvent = true;

  hasSelectedContacts: boolean;
  sIsLoading: string = '';
  dataArray = {};
  isLoading = true;
  dataSource = new MatTableDataSource<BrowseOPDBill>();
  
  displayedColumns = [
    'BillDate',
    'PBillNo',
    'RegNo',
    'PatientName',
    'TotalAmt',
    'ConcessionAmt',
    'NetPayableAmt',
    'PaidAmount',
    'BalanceAmt',
    'chkBalanceAmt',
    'action'
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) PathTestpaginator: MatPaginator;
  
  constructor(
    private _fuseSidebarService: FuseSidebarService,
    public _BrowseOPDBillsService: BrowseOpListService,
    public datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.getBrowseOPDBillsList();
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  onShow(event: MouseEvent) {
    this.click = !this.click;
    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data';
        this.getBrowseOPDBillsList();
      }
    }, 1000);
    this.MouseEvent = true;
    this.click = true;
  }

  onClear() {
    this._BrowseOPDBillsService.myFilterform.get('FirstName').reset();
    this._BrowseOPDBillsService.myFilterform.get('LastName').reset();
    this._BrowseOPDBillsService.myFilterform.get('RegNo').reset();
    this._BrowseOPDBillsService.myFilterform.get('PBillNo').reset();
  }

  getBrowseOPDBillsList() {
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name": this._BrowseOPDBillsService.myFilterform.get("FirstName").value || "%",
      "L_Name": this._BrowseOPDBillsService.myFilterform.get("LastName").value || "%",
      "From_Dt": this.datePipe.transform(this._BrowseOPDBillsService.myFilterform.get("start").value, "MM-dd-yyyy"),
      "To_Dt": this.datePipe.transform(this._BrowseOPDBillsService.myFilterform.get("end").value, "MM-dd-yyyy"),
      "Reg_No": this._BrowseOPDBillsService.myFilterform.get("RegNo").value || 0,
      "PBillNo": this._BrowseOPDBillsService.myFilterform.get("PBillNo").value || 0,
    }
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this._BrowseOPDBillsService.getBrowseOPDBillsList(D_data).subscribe(Visit => {
        this.dataSource.data = Visit as BrowseOPDBill[];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.sIsLoading = '';
        this.click = false;
      },
        error => {
          this.sIsLoading = '';
        });
    }, 1000);
  }

}

export class BrowseOPDBill {
  BillNo: Number;
  RegId: number;
  RegNo: number;
  PatientName: string;
  FirstName: string;
  Middlename: string;
  LastName: string;
  TotalAmt: number;
  ConcessionAmt: number;
  NetPayableAmt: number;
  BillDate: any;
  IPDNo: number;
  ServiceName: String;
  Price: number;
  Qty: number;
  ChargesTotalAmount: number;
  NetAmount: number;
  PaidAmount: number;
  HospitalName: string;
  HospitalAddress: string;
  Phone: number;
  ChargesDoctorName: string;
  TotalBillAmount: number;
  ConsultantDocName: string;
  DepartmentName: string;
  IsCancelled: boolean;
  OPD_IPD_Type: number;
  PBillNo: string;
  BDate: Date;
  VisitDate: Date;
  BalanceAmt: number;
  AddedByName: string;


  //PayTMAmount:number;
  //NEFTPayAmount:number;
  /**
   * Constructor
   *
   * @param BrowseOPDBill
   */
  constructor(BrowseOPDBill) {
    {
      this.BillNo = BrowseOPDBill.BillNo || '';
      this.RegId = BrowseOPDBill.RegId || '';
      this.RegNo = BrowseOPDBill.RegNo || '';
      this.PatientName = BrowseOPDBill.PatientName || '';
      this.FirstName = BrowseOPDBill.FirstName || '';
      this.Middlename = BrowseOPDBill.MiddleName || '';
      this.LastName = BrowseOPDBill.LastName || '';
      this.TotalAmt = BrowseOPDBill.TotalAmt || '';
      this.ConcessionAmt = BrowseOPDBill.ConcessionAmt || '';
      this.NetPayableAmt = BrowseOPDBill.NetPayableAmt || '';
      this.BillDate = BrowseOPDBill.BillDate || '';
      this.IPDNo = BrowseOPDBill.IPDNo || '';
      this.IsCancelled = BrowseOPDBill.IsCancelled || '';
      this.OPD_IPD_Type = BrowseOPDBill.OPD_IPD_Type || '';
      this.PBillNo = BrowseOPDBill.PBillNo || '';
      this.BDate = BrowseOPDBill.BDate || '';
      this.PaidAmount = BrowseOPDBill.PaidAmount || '';
      this.BalanceAmt = BrowseOPDBill.BalanceAmt || '';
      this.ServiceName = BrowseOPDBill.ServiceName || '';
      this.Price = BrowseOPDBill.Price || '';
      this.Qty = BrowseOPDBill.Qty || '';
      this.ChargesTotalAmount = BrowseOPDBill.ChargesTotalAmount || '';
      this.NetAmount = BrowseOPDBill.NetAmount || '';
      this.HospitalName = BrowseOPDBill.HospitalName || '';
      this.HospitalAddress = BrowseOPDBill.HospitalAddress || '';
      this.ChargesTotalAmount = BrowseOPDBill.ChargesTotalAmount || '';
      this.Phone = BrowseOPDBill.Phone || '';
      this.ConsultantDocName = BrowseOPDBill.ConsultantDocName || '';
      this.DepartmentName = BrowseOPDBill.DepartmentName || '';
      this.TotalBillAmount = BrowseOPDBill.TotalBillAmount || '';
      this.ChargesDoctorName = BrowseOPDBill.ChargesDoctorName || '';
      this.VisitDate = BrowseOPDBill.VisitDate || '';
      this.AddedByName = BrowseOPDBill.AddedByName || '';
      this.TotalAmt = BrowseOPDBill.TotalAmt || '';
    }
  }

}