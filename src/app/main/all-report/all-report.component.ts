import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject, Subject } from 'rxjs';
import { ReportService } from './report.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-all-report',
  templateUrl: './all-report.component.html',
  styleUrls: ['./all-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ALLReportComponent implements OnInit {

//  idArray = ["Doctor Wise Patient Count Report","Referance Doctor Wise Patient Count Report","Concession Report","Daily Collection Report","Daily Collection Summary Report","Group Wise Collectio Report"];

 users = [
  { Name: 'Doctor Wise Patient Count Report' },
  { Name: 'Referance Doctor Wise Patient Count Report'},
  { Name: 'Concession Report' },
  { Name: 'Daily Collection Report'},
  { Name: 'Daily Collection Summary Report'},

  { Name: 'Group Wise Collection Report' },
  { Name: 'Credit Report'},
  { Name: 'Patient Ledger Report' },
  { Name: 'Service Wise Report Without Bill'},
  { Name: 'Service Wise Report Bill'},

  { Name: 'Service Wise Report ' },
  { Name: 'Bill Summary With TCS Report'},
  { Name: 'Ref By Patient Report' },
  { Name: 'Cancle Charges List Report'},
  { Name: 'Doctor(Vist.Admitted) Group Wise Report'},

  { Name: 'Doctor And Department  Wise Monthly Collection Report' },
  { Name: 'Service Report With Bill Report'},
  { Name: 'IP Company Wise Bill Report' },
  { Name: 'IP Company Wise Credit Report'},
  { Name: 'IP Discharge & Bill Generation Pending Report'},

  { Name: 'IP Bill Generation Pending Report' },
  { Name: 'Collection Summary Report'},
  { Name: 'IP Company Wise Bill Report' },
  { Name: 'IP Company Wise Credit Report'},
  { Name: 'IP Discharge & Bill Generation Pending Report'}


];

  sIsLoading: string = '';
  isLoading = true;
  isRateLimitReached = false;
  D_data1:any;
  hasSelectedContacts: boolean;
  doctorNameCmbList: any = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;

  displayedColumns = [
    'ReportName',
   
   'action',
  //  'buttons'
  ];

  dataSource = new MatTableDataSource<ReportInsert>();
  menuActions: Array<string> = [];

  public doctorFilterCtrl: FormControl = new FormControl();
  public filtereddoctor: ReplaySubject<any> = new ReplaySubject<any>(1);
  private _onDestroy = new Subject<void>();

  constructor(
    public _registrationService: ReportService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    // get Registration list on page load
     this.getregistrationList();
  }

  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  
   // clear data from input field 
  onClear() {
    this._registrationService.myFilterform.reset(
      {
        start: [],
        end: []
      }
    );
  }
  // get Registration list on Button click
  getregistrationList() {
    // this.sIsLoading = 'loading';
    // var D_data = {
    //   "F_Name": (this._registrationService.myFilterform.get("FirstName").value).trim() || '%',
    //   "L_Name": (this._registrationService.myFilterform.get("LastName").value).trim() || '%',
    //   "Reg_No": this._registrationService.myFilterform.get("RegNo").value || "0",
    //   "From_Dt": this.datePipe.transform(this._registrationService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
    //   "To_Dt": this.datePipe.transform(this._registrationService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
    //   "MobileNo": this._registrationService.myFilterform.get("MobileNo").value || '%',
    // }
    // // console.log(D_data);
    // setTimeout(() => {
    //   this.sIsLoading = 'loading-data';
    //   this._registrationService.getRegistrationList(D_data).subscribe(data => {
    //     this.dataSource.data = data as ReportInsert[];
    //     this.dataSource.sort = this.sort;
    //     this.dataSource.paginator = this.paginator;
    //     this.sIsLoading = '';
    //   },
    //     error => {
    //       this.sIsLoading = '';
    //     });
    // }, 500);


    
  }

  OnSubmit(){}

  onClose(){}
}


export class ReportInsert
{
    ReportName : Number;
    // RegDate : Date;
   
    /**
     * Constructor
     *
     * @param ReportInsert
     */
     
    constructor(ReportInsert) {
        {
           this.ReportName = ReportInsert.ReportName || '';
          //  this.RegDate = ReportInsert.RegDate || '';
          
        }
    }
}
