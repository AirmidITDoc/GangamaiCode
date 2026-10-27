import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { HomeCollectionService } from '../home-collection/home-collection.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { NewCollectionComponent } from '../home-collection/new-collection/new-collection.component';
import Swal from 'sweetalert2';
import { NewLabPatientRegComponent } from '../lab-patient-reg/new-lab-patient-reg/new-lab-patient-reg.component';
import { UpdatePhlebotomistComponent } from './update-phlebotomist/update-phlebotomist.component';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-latest-homecollection',
  templateUrl: './latest-homecollection.component.html',
  styleUrls: ['./latest-homecollection.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class LatestHomecollectionComponent {

  myFilterform: FormGroup;
  autocompleteModeunit: string = "Hospital";
  f_name: any = ""
  l_name: any = ""
  UnitId: any = this._loggedService.currentUserValue.user.unitId;
  isPhlebotomist: any = this._loggedService.currentUserValue.user.isPhlebotomist
  phlebotomistId: any = this.isPhlebotomist ? this._loggedService.currentUserValue.userId : 0
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  Vtotalcount = 0;
  Vpendingcount = 0;
  VInProgresscount = 0;
  VCompletedcount = 0;
  VScheduledTodayCount = 0;
  VCollectedTodayCount = 0;
  VAssignedCount = 0;
  VAssignedPendingCount = 0;

  mobileNo: any = '%'
  dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = [
    'srNo', 'unit','billed', 'datetime', 'patientName', 'mobileNo', 'phlebotomist',
    'status', 'action'
  ];

  @ViewChild('viewDrawer') viewDrawer!: MatSidenav;

  selectedRow: any = null;
  detailData: any[] = [];
  detailColumns = ['sr', 'testName', 'amount', 'status'];

  categorySummary: any[] = [];
  categoryTotal = 0;

  centerSummary: any[] = [];
  donutSegments: any[] = [];
  donutTotal = 0;

  dashbordCount: any[] = [];

  phlebotomistStatus: any[] = [];

  readonly donutR = 70;
  readonly donutC = 2 * Math.PI * 70;
  readonly donutColors = ['#2f80ed', '#27ae60', '#f2994a', '#9b51e0', '#eb5757', '#00bcd4'];


  constructor(
    public _homeCollectionService: HomeCollectionService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    public formBuilder: UntypedFormBuilder,
    public _FormvalidationserviceService: FormvalidationserviceService,
    public permissionService: PagePermissionService, private router: Router
  ) { }

  ngOnInit(): void {
    this.myFilterform = this._homeCollectionService.CreateSearchGroup();
    // this.statusFormFinal = this.CreateForm();
    this.myFilterform.get('PhlebotomistId').setValue(this.phlebotomistId)
    this.getfilterdata();
  }

  openView(row: any) {
    this.selectedRow = row;
    this.detailData = [];
    this.viewDrawer.open();

    const param = {
      first: 0,
      rows: 999,
      sortField: 'HomeCollectionId',
      sortOrder: 0,
      filters: [
        {
          fieldName: 'HomeCollectionId',
          fieldValue: String(row?.homeCollectionId),
          opType: 'Equals'
        }
      ],
      exportType: 'JSON',
      columns: []
    };

    this._homeCollectionService.getCollectionDet(param).subscribe((res: any) => {
      console.log('getCollectionDet response', res.data);   // check the shape once, then remove
      this.detailData = res?.data ?? []
    });
  }

  closeView() {
    this.viewDrawer.close();
    this.selectedRow = null;
    this.detailData = [];
  }

  getTotal(): number {
    return this.detailData.reduce((s, r) => s + (Number(r.totalAmount) || 0), 0);
  }

  getStatusClass(status: any): string {
    switch (String(status)) {
      case '1': return 'status-progress';   // In Progress
      case '0': return 'status-pending';    // Pending
      default: return '';
    }
  }

  getStatusText(status: any): string {
    switch (String(status)) {
      case '1': return 'In Progress';
      case '0': return 'Pending';
      default: return '--';
    }
  }

  ListView1(value) {
    if (value.value !== 0)
      this.UnitId = value.value
    else
      this.UnitId = 0
  }

  ListView2(value) {
    if (value.value !== 0)
      this.phlebotomistId = value.phlebotomistId
    else
      this.phlebotomistId = 0
  }

  private isToday(value: any): boolean {
    if (!value) return false;
    const d = new Date(value);
    if (isNaN(d.getTime())) return false;
    const t = new Date();
    return d.getFullYear() === t.getFullYear()
      && d.getMonth() === t.getMonth()
      && d.getDate() === t.getDate();
  }

  private updateCounts(list: any[]) {
    list = list || [];

    this.Vtotalcount = list.length;
    this.Vpendingcount = list.filter(x => x.status == 0).length;
    this.VInProgresscount = list.filter(x => x.status == 2).length;
    this.VCompletedcount = list.filter(x => x.status == 1).length;

    // today's numbers
    this.VScheduledTodayCount = list.filter(x => this.isToday(x.collectionTime)).length;
    this.VCollectedTodayCount = list.filter(x => x.status == 1 && this.isToday(x.collectionTime)).length;
  }

  getfilterdata() {

    const fromDateControl = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd");
    const toDateControl = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd");

    this.Vtotalcount = 0;
    this.VCompletedcount = 0;
    this.Vpendingcount = 0;
    this.VInProgresscount = 0;
    this.VScheduledTodayCount = 0;
    this.VCollectedTodayCount = 0;
    this.VAssignedCount = 0;
    this.VAssignedPendingCount = 0;
    this.f_name = (this.myFilterform.get('FirstName').value ?? '') + "%"   // CHANGED
    // this.l_name = (this.myFilterform.get('LastName').value ?? '') + "%"
    this.UnitId = this.myFilterform.get('UnitId').value
    // this.mobileNo = (this.myFilterform.get('mobileNo').value ?? '') + "%"
    // this.phlebotomistId = this.myFilterform.get('PhlebotomistId').value
    // this.regNo = this.myFilterform.get('RegNoSearch').value || "0"
    // debugger
    const filters: any[] = [];

    // Handle date range
    if (fromDateControl && toDateControl) {
      this.fromDate = this.datePipe.transform(fromDateControl, "yyyy-MM-dd");
      this.toDate = this.datePipe.transform(toDateControl, "yyyy-MM-dd");
    }
    filters.push(
      {
        "fieldName": "FromDate",
        "fieldValue": this.fromDate,
        "opType": "StartsWith"
      },
      {
        "fieldName": "ToDate",
        "fieldValue": this.toDate,
        "opType": "StartsWith"
      },
      {
        "fieldName": "PatientName",
        "fieldValue": String(this.f_name),
        "opType": "StartsWith"
      },
      // {
      //   "fieldName": "LastName",
      //   "fieldValue": String(this.l_name),
      //   "opType": "StartsWith"
      // },
      // {
      //   "fieldName": "UnitId",
      //   "fieldValue": String(this.UnitId),
      //   "opType": "Equals"
      // },
      // {
      //   "fieldName": "MobileNo",
      //   "fieldValue": String(this.mobileNo),
      //   "opType": "Equals"
      // },
      {
        "fieldName": "PhlebotomistId",
        "fieldValue": String(this.phlebotomistId),
        "opType": "Equals"
      },
    );

    const data = {
      "first": 0,
      "rows": 999999,
      "sortField": "HomeCollectionId",
      "sortOrder": 0,
      "filters": filters,
      "exportType": "JSON",
      "columns": []
    };
    console.log(data)
    this._homeCollectionService.getHomeCollectionlist(data).subscribe((response) => {
      this.dataSource.data = response.data;
      this.updateCounts(this.dataSource.data);

      //   console.log(this.dataSource.data)
    });

    const dashParam = {
      UnitId: this.UnitId ?? 0,
      PhlebotomistId: this.phlebotomistId ?? 0,
      FromDate: this.fromDate,
      ToDate: this.toDate
    };

    this._homeCollectionService.gethomeCollDashBoardById(dashParam).subscribe((res: any) => {
      const data = typeof res === 'string' ? JSON.parse(res) : res;

      //////// category of radio or path ////////
      const list = data?.homeCollectionBillGroupWiseCountModel ?? [];

      this.categorySummary = list;
      this.categoryTotal = list.reduce(
        (s: number, x: any) => s + (Number(x.categoryWiseCount) || 0), 0
      );

      //////// center wise count
      this.centerSummary = data?.homeCollectionCenterWiseCountModels ?? [];
      this.buildDonut(this.centerSummary);

      /// dashbord count
      this.dashbordCount = data?.phlebotomistCountListModel ?? [];
      this.VAssignedCount = this.dashbordCount[0].assigned
      this.VAssignedPendingCount = this.dashbordCount[0].pending

      ////////// phlebotomist Status
      this.phlebotomistStatus = data?.homeCollectionBillingStatusModel ?? [];
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
  }

  isUnassigned(name: string): boolean {
    return name?.toLowerCase() === 'yet to assign';
  }

  segPercent(value: number, total: number): number {
    return total ? (value / total) * 100 : 0;
  }

  getPercent(count: number): number {
    return this.categoryTotal ? Math.round((Number(count) * 100) / this.categoryTotal) : 0;
  }

  getBarClass(name: string): string {
    const n = (name || '').toLowerCase();
    if (n === 'pathology') return 'green';
    if (n === 'radiology') return 'blue';
    return 'orange';
  }

  // getBarHeight(count: number): number {
  //   return this.centerMax ? Math.round((Number(count) * 100) / this.centerMax) : 0;
  // }

  buildDonut(list: any[]) {
    this.donutTotal = list.reduce((s, x) => s + (Number(x.centerWiseCount) || 0), 0);

    let acc = 0;   // fraction of the circle used so far
    this.donutSegments = list.map((x, i) => {
      const count = Number(x.centerWiseCount) || 0;
      const frac = this.donutTotal ? count / this.donutTotal : 0;
      const len = frac * this.donutC;
      const gap = list.length > 1 ? 2 : 0;
      const mid = (acc + frac / 2) * 2 * Math.PI - Math.PI / 2;   // label angle

      const seg = {
        name: x.centerName,
        count,
        percent: Math.round(frac * 1000) / 10,
        color: this.donutColors[i % this.donutColors.length],
        dash: `${Math.max(len - gap, 0)} ${this.donutC - Math.max(len - gap, 0)}`,
        offset: -acc * this.donutC,
        lx: 100 + this.donutR * Math.cos(mid),
        ly: 100 + this.donutR * Math.sin(mid)
      };
      acc += frac;
      return seg;
    });
  }

  Clearfilter(event) {
    if (event == 'FirstName')
      this.myFilterform.get('FirstName').setValue("")

    if (event == 'LastName')
      this.myFilterform.get('LastName').setValue("")

    if (event == 'mobileNo')
      this.myFilterform.get('mobileNo').setValue("")

    this.getfilterdata();
  }

  onnew(row: any = null) {
    const dialogRef = this._matDialog.open(NewCollectionComponent,
      {
        maxWidth: "95vw",
        height: '95%',
        width: '90%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      this.fromDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      this.toDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      this.getfilterdata();
    });
  }

  onBillProcess(row: any = null) {
    const dialogRef = this._matDialog.open(NewLabPatientRegComponent,
      {
        maxWidth: "95vw",
        height: '95%',
        width: '90%',
        data: { mode: 'home', row }
      });
    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (result == 'home') {
        this.router.navigate(['/LabManagement/lab-patientreg']);
      }
      this.fromDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      this.toDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      this.getfilterdata()
    });
  }

  OnCancel(data: any) {
    Swal.fire({
      title: 'Do you want to cancel Home Collection?',
      text: "Please provide a reason for cancellation",
      icon: "warning",
      input: 'text',
      inputPlaceholder: 'Enter cancellation reason...',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!",
      preConfirm: (reason) => {
        if (!reason || reason.trim() === '') {
          Swal.showValidationMessage('Reason is required');
        }
        return reason;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const submitData = {
          homeCollectionId: data.homeCollectionId,
          isCancelledBy: this._loggedService.currentUserValue.userId,
          cancelReason: result.value
        };
        console.log(submitData);
        this._homeCollectionService.OnCancel(submitData).subscribe((res) => {
          this.toastr.success(res.message);
          this.getfilterdata()
        });
      }
    });
  }

  openStatus(row: any = null) {
    const dialogRef = this._matDialog.open(UpdatePhlebotomistComponent,
      {
        maxWidth: "95vw",
        height: '95%',
        width: '90%',
        data: { mode: 'home', row }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.getfilterdata()
    });
  }

  // handles 0/1, true/false, "0"/"1"
  isBilled(row: any): boolean {
    return Number(row?.isBilled) > 0;
  }

  canProcessBill(row: any): boolean {
    return !row.isCancel && !this.isBilled(row);
  }

  canUpdatePhlebotomist(row: any): boolean {
    return !row.isCancel && !this.isBilled(row);
  }

  canCancel(row: any): boolean {
    return !row.isCancel && !this.isBilled(row);
  }

  canPrint(row: any): boolean {
    return !row.isCancel && this.isBilled(row);
  }
}
