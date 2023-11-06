import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe, Time } from '@angular/common';
import { RegistrationService } from '../../opd/registration/registration.service';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { NewRegistrationComponent } from '../../opd/registration/new-registration/new-registration.component';
import { EditRegistrationComponent } from '../../opd/registration/edit-registration/edit-registration.component';
import { SimpleReportService } from './simplereport.service';

@Component({
  selector: 'app-simplereport',
  templateUrl: './simplereport.component.html',
  styleUrls: ['./simplereport.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SimplereportComponent implements OnInit {
  public Reports: any[] = [];
  sIsLoading: string = '';
  isLoading = true;
  hasSelectedContacts: boolean;
  @Input() dataArray: any;
  menuActions: Array<string> = [];
  constructor(
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public _service: SimpleReportService
  ) { }

  ngOnInit(): void {
    this.bindReportData();
  }

  bindReportData() {
    let qry = "SELECT * FROM ReportConfigMaster WHERE IsActive=1 AND IsDeleted=0 AND ReportType=1";
    this._service.getDataByQuery(qry).subscribe(data => {
      this.Reports = data as any[];
    });
  }

  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }


  // clear data from input field 
  onClear() {
  }
  // get Registration list on Button click
  getReportData() {
    this.sIsLoading = 'loading';
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
    }, 500);
  }
}
