import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { SchdulerService } from './scheduler.service';
import { CreateUserService } from '../create-user/create-user.service';
import { MatTableDataSource } from '@angular/material/table';
import { UserList } from '../create-user/create-user.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ManageschedulerComponent } from './managescheduler/managescheduler.component';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SchdulerComponent implements OnInit {
 
  constructor(private formBuilder: FormBuilder,
    private _ActRoute: Router,
    public _matDialog: MatDialog,
    public _UserService:CreateUserService,
    private _SchdulerService :SchdulerService,
    private dialogRef: MatDialogRef<SchdulerComponent>) { }

  ngOnInit(): void {
    //this.searchFormGroup = this.createSearchForm();
    // this.highlightCurrentWeekday();
    this.getSchedulerList();
  }
  sIsLoading: string = '';
  dataSource1 = new MatTableDataSource<UserList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  hasSelectedContacts: boolean;
  getSchedulerList() {
    this.sIsLoading = 'loading-data';
    this._SchdulerService.getSchedulers().subscribe(Visit => {
      this.dataSource1.data = Visit as any[];
      this.dataSource1.sort = this.sort;
      this.dataSource1.paginator = this.paginator;
      this.sIsLoading = '';
      //this.click = false;
    },
      error => {
        this.sIsLoading = '';
      });
  }
  addUserDetails() {
    const dialogRef = this._matDialog.open(ManageschedulerComponent,
      {
        maxWidth: "85vw",
        height: "auto",
        width: '100%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      // this.getAdmittedPatientList();
    });
  }

  
}
