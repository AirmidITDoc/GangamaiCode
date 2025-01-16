import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Row } from 'jspdf-autotable';
import { SurgeryMasterService } from './surgery-master.service';
import { NewSurgeryMasterComponent } from './new-surgery-master/new-surgery-master.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-surgery-master',
  templateUrl: './surgery-master.component.html',
  styleUrls: ['./surgery-master.component.scss']
})
export class SurgeryMasterComponent implements OnInit {

  sIsLoading: string = '';
  hasSelectedContacts: boolean;
  dataSource = new MatTableDataSource<SurgeryMasterList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns = [
    'SurgeryId',
    'SurgeryName',
    'DepartmentName',
    'SurgeryCategoryName',
    'SiteDescriptionName',
    'Amount',
    'IsActive',
    'action'
  ];

  constructor(public _surgeryMasterService: SurgeryMasterService,
  private accountService: AuthenticationService,
  public notification: NotificationServiceService,
  public _matDialog: MatDialog,
  private _fuseSidebarService: FuseSidebarService,
  private _ActRoute: Router,
  public toastr: ToastrService,
  private advanceDataStored: AdvanceDataStored,
  ) { }

  ngOnInit(): void {
    this.getSurgeryMasterList();
  }

  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  // field validation 
  get f() { return this._surgeryMasterService.myformSearch.controls; }

  getSurgeryMasterList(){
    
    this.sIsLoading = 'loading-data';
  
    // Check if there is a valid search term
    const otsurgeryNameSearch = this._surgeryMasterService.myformSearch.get("SurgeryNameSearch").value || '';
  
    const D_data = {
      "SurgeryName": otsurgeryNameSearch.trim() ? otsurgeryNameSearch + '%' : '%', // Use '%' if search is empty
    };
  
    console.log("SurgeryList:", D_data);
  
    this._surgeryMasterService.getOTSurgerylist(D_data).subscribe(
      Visit => {
        this.dataSource.data = Visit as SurgeryMasterList[];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.sIsLoading = '';
      },
      error => {
        console.error("Error loading table data:", error);
        this.sIsLoading = '';
      }
    );
  }

  newSurgery(){
    const dialogRef = this._matDialog.open(NewSurgeryMasterComponent,
      {
        maxWidth: "60%",
        width: "65%",
        height: "70%",
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getSurgeryMasterList();
    });
  }
  
  OnEdit(contact){
    const dialogRef = this._matDialog.open(NewSurgeryMasterComponent,
      {
        maxWidth: "60%",
        width: "65%",
        height: "70%",
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getSurgeryMasterList();
    });
  }

  onDeactive(SurgeryId){
    
    Swal.fire({
      title: 'Confirm Status',
      text: 'Are you sure you want to Change Status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Change Status!'
  }).then((result) => {
    
      if (result.isConfirmed) {
        let Query;
        const tableItem = this.dataSource.data.find(item => item.SurgeryId === SurgeryId);
        console.log("M_OT_SurgeryMaster:",tableItem)
    
        if (tableItem.IsActive) {
            Query = "Update M_OT_SurgeryMaster set IsActive=0 where SurgeryId=" + SurgeryId;
        } else {
            Query = "Update M_OT_SurgeryMaster set IsActive=1 where SurgeryId=" + SurgeryId;
        }
    
        console.log("query:", Query);
    
        this._surgeryMasterService.deactivateTheStatus(Query)
            .subscribe(
                (data) => {
                    Swal.fire('Changed!', 'OTTable Status has been Changed.', 'success');
                    this.getSurgeryMasterList();
                },
                (error) => {
                    Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                }
            );
    }
    
  });
  }

  onClear() {
    this._surgeryMasterService.myformSearch.reset({
      SurgeryNameSearch: "",
    });
    this.getSurgeryMasterList();
  }

}
export class SurgeryMasterList {
  SurgeryId:number;
  ProcedureName:string;
  CategoryName:string;
  DepartmentName:string;
  Amount:number;
  Site:string;
  IsDeleted:String;
  IsActive:string;
  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(SurgeryMasterList) {
    {
      this.SurgeryId = SurgeryMasterList.SurgeryId || '';
      this.ProcedureName = SurgeryMasterList.ProcedureName || '';      
      this.CategoryName = SurgeryMasterList.CategoryName || '';
      this.DepartmentName = SurgeryMasterList.DepartmentName || '';   
      this.Amount = SurgeryMasterList.Amount || '';   
      this.Site = SurgeryMasterList.Site || '';
      this.IsDeleted = SurgeryMasterList.IsDeleted;
      this.IsActive=SurgeryMasterList.IsActive || '';
    }
  }
}