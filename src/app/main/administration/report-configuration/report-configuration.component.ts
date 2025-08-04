import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import Swal from 'sweetalert2';
import { ReportConfigurationService } from './report-configuration.service';
import { NewReportConfigurationComponent } from './new-report-configuration/new-report-configuration.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-report-configuration',
  templateUrl: './report-configuration.component.html',
  styleUrls: ['./report-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ReportConfigurationComponent implements OnInit {
  displayedColumns = [
    'Code',
    'ReportSection',
    'ReportName',
    'ReportMode',
    'ReportTitle',
    'ReportHeader',
    'ReportColumn',
    'ReportTotalField',
    'ReportGroupByLabel',
    'SummeryLabel',
    'ColumnWidth',
    'ReportFilter',
    'ReportHeaderFile',
    'ReportBodyFile',
    'ReportFolderName',
    'ReportFileName',
    'ReportSPName',
    'ReportPageOrientation',
    'ReportPageSize',
    'Action',
  ];
  filteredOptionsMenu: Observable<string[]>;
  isMenuSelected: boolean = false;
  sIsLoading: string = '';
  isLoading = true;
  noOptionFound: boolean = false;
  menuList: any = [];
  menuSection: any[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;

  dsReportList = new MatTableDataSource<ReportList>();

  constructor(
    public _ReportService: ReportConfigurationService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    private _fuseSidebarService: FuseSidebarService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getReportList();
    this.getReportNameCombobox();
  }
 
   getReportNameCombobox() {
      this._ReportService.getReportSectionCombo().subscribe((data) => {
        this.menuList = data;
        this.menuSection = this.menuList.slice();
        this.filteredOptionsMenu = this._ReportService.MySearchGroup.get('menuId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterReport(value) : this.menuList.slice()),
        );
      });
    }
    private _filterReport(value: any): string[] {
      if (value) {
        const filterValue = value && value.ReportSection ? value.ReportSection.toLowerCase() : value.toLowerCase();
        return this.menuSection.filter(option => option.ReportSection.toLowerCase().includes(filterValue));
      }
    }
    getOptionTextMenu(option) {
      return option && option.ReportSection ? option.ReportSection : '';
    }

  resultsLength=0;
  getReportList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
      "ParentId": this._ReportService.MySearchGroup.get("menuId").value.Parentid || 0,
      "ReportName": this._ReportService.MySearchGroup.get('reportName').value + '%' || '%',
      Start: (this.paginator?.pageIndex ?? 0),
      Length: (this.paginator?.pageSize ?? 35),          
    }
      this._ReportService.getReportList(vdata).subscribe(data => {
      this.dsReportList.data = data["Table1"] ?? [] as ReportList[];
      this.dsReportList.sort = this.sort;
      this.resultsLength = data["Table"][0]["total_row"];
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  newReport() {
    const dialogRef = this._matDialog.open(NewReportConfigurationComponent,
      {
        maxWidth: "80vw",
        height: '95%',
        width: '90%',
        // maxHeight: '95vh',
      });
    dialogRef.afterClosed().subscribe(result => {
      this.getReportList();
    });
  }

  OnEdit(contact) {
    const dialogRef = this._matDialog.open(NewReportConfigurationComponent,
      {
        maxWidth: "80vw",
        height: '95%',
        width: '90%',
        data: {
          obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.getReportList();
    });
  }
}

export class ReportList {
  ReportId: any;
  ReportSection: any;
  ReportName: any;
  ReportMode: any;
  ReportTitle: any;
  ReportHeader: any;
  ReportColumn: any;
  ReportTotalField: any;
  ReportGroupByLabel: any;
  SummeryLabel: any;
  ColumnWidth: any;
  ReportFilter: any;
  ReportHeaderFile: any;
  ReportBodyFile: any;
  ReportFolderName: any;
  ReportFileName: any;
  ReportSPName: any;
  ReportPageOrientation: any;
  ReportPageSize: any;
  code: any;
  reportSection: any;
  reportName: any;
  reportMode: any;
  reportTitle: any;
  reportHeader: any;
  reportColumn: any;
  reportTotalField: any;
  reportGroupByLabel: any;
  summeryLabel: any;
  columnWidth: any;
  reportFilter: any;
  reportHeaderFile: any;
  reportBodyFile: any;
  reportFolderName: any;
  reportFileName: any;
  reportSPName: any;
  reportPageOrientation: any;
  reportPageSize: any;
  reportId:any;
  Parentid:any;
  MenuId:any;

  constructor(ReportList) {
    {
      this.ReportId = ReportList.ReportId || '';
      this.ReportSection = ReportList.ReportSection || '';
      this.ReportName = ReportList.ReportName || '';
      this.ReportMode = ReportList.ReportMode || '';
      this.ReportTitle = ReportList.ReportTitle || '';
      this.ReportHeader = ReportList.ReportHeader || '';
      this.ReportColumn = ReportList.ReportColumn || '';
      this.ReportTotalField = ReportList.ReportTotalField || '';
      this.ReportGroupByLabel = ReportList.ReportGroupByLabel || '';
      this.SummeryLabel = ReportList.SummeryLabel || '';
      this.ColumnWidth = ReportList.ColumnWidth || '';
      this.ReportFilter = ReportList.ReportFilter || '';
      this.ReportHeaderFile = ReportList.ReportHeaderFile || '';
      this.ReportBodyFile = ReportList.ReportBodyFile || '';
      this.ReportFolderName = ReportList.ReportFolderName || '';
      this.ReportFileName = ReportList.ReportFileName || '';
      this.ReportSPName = ReportList.ReportSPName || '';
      this.ReportPageOrientation = ReportList.ReportPageOrientation || '';
      this.ReportPageSize = ReportList.ReportPageSize || '';
      this.code = ReportList.code || '';
      this.reportSection = ReportList.reportSection || '';
      this.reportName = ReportList.reportName || '';
      this.reportMode = ReportList.reportMode || '';
      this.reportTitle = ReportList.reportTitle || '';
      this.reportHeader = ReportList.reportHeader || '';
      this.reportColumn = ReportList.reportColumn || '';
      this.reportTotalField = ReportList.reportTotalField || '';
      this.reportGroupByLabel = ReportList.reportGroupByLabel || '';
      this.summeryLabel = ReportList.summeryLabel || '';
      this.columnWidth = ReportList.columnWidth || '';
      this.reportFilter = ReportList.reportFilter || '';
      this.reportHeaderFile = ReportList.reportHeaderFile || '';
      this.reportBodyFile = ReportList.reportBodyFile || '';
      this.reportFolderName = ReportList.reportFolderName || '';
      this.reportFileName = ReportList.reportFileName || '';
      this.reportSPName = ReportList.reportSPName || '';
      this.reportPageOrientation = ReportList.reportPageOrientation || '';
      this.reportPageSize = ReportList.reportPageSize || '';
      this.reportId = ReportList.reportId || 0;
      this.Parentid=ReportList.Parentid || 0;
      this.MenuId=ReportList.MenuId || 0
    }
  }
}
