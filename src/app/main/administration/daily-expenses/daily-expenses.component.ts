import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { DailyExpensesService } from './daily-expenses.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { error } from 'console';
import { NewExpensesComponent } from './new-expenses/new-expenses.component';
import Swal from 'sweetalert2';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-daily-expenses',
  templateUrl: './daily-expenses.component.html',
  styleUrls: ['./daily-expenses.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DailyExpensesComponent implements OnInit {
  displayedColumns: string[] = [
    'btn',
    'ExpensesDate',
    'HeadName',
    'PersonName',
    'ExpAmount',
    'Narration',
    'UserName',
    'ExpensesType',
    //'VoucharNo', 
    'action',
  ];

  sIsLoading: string = '';
  dsDailyExpenses = new MatTableDataSource<DailyExpensesList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _DailyExpensesService: DailyExpensesService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.getDailyExpensesList();
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getDailyExpensesList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
      "FromDate": this.datePipe.transform(this._DailyExpensesService.DailyExpensesForm.get('startdate').value, 'MM-dd-yyyy'),
      "ToDate": this.datePipe.transform(this._DailyExpensesService.DailyExpensesForm.get("enddate").value, "MM-dd-yyyy"),
      "ExpHeadId": 0,
      "ExpType": this._DailyExpensesService.DailyExpensesForm.get("expType").value || 2
    }

    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      console.log(vdata)
      this._DailyExpensesService.getDailyExpensesList(vdata).subscribe(data => {
        this.dsDailyExpenses.data = data as DailyExpensesList[];
        console.log(this.dsDailyExpenses.data);
        this.dsDailyExpenses.sort = this.sort;
        this.dsDailyExpenses.paginator = this.paginator;
        this.sIsLoading = ' ';
      },
        error => {
          this.sIsLoading = '';
        });
    }, 50);
  }

  BillCancel(contact){ 
  
  }
  CancelExpenses(contact) {

    Swal.fire({
      title: 'Do you want to cancel the Expenses',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!" 
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {  
        let update_T_Expenses_IsCancel = {
          "expId": contact.ExpID || 0,
          "isCancelledBy": 1,
        }
        let submitData = {
          "update_T_Expenses_IsCancel": update_T_Expenses_IsCancel
        }
        console.log(submitData)
        this._DailyExpensesService.CancelDailyExpenses(submitData).subscribe(reponse => {
          if (reponse) {
            this.toastr.success('Record Saved Successfully.', 'Saved !', {
              toastClass: 'tostr-tost custom-toast-success',
            });
            this.getDailyExpensesList();
          } else {
            this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
              toastClass: 'tostr-tost custom-toast-error',
            });
          }
        });  
      }else{
        this.getDailyExpensesList(); 
      }
    }) 
  }



  addNewExpenses() {
    const dialogRef = this._matDialog.open(NewExpensesComponent,
      {
        height: "60%",
        width: '60%',
      });
    dialogRef.afterClosed().subscribe(result => {
      this.getDailyExpensesList();
    });
  }

    viewExpenseReport(ExpId) { 
      debugger 
        this.sIsLoading = 'loading-data';   
        setTimeout(() => { 
          this._DailyExpensesService.getPdfDailyExpenseRpt(ExpId).subscribe(res => {
            const dialogRef = this._matDialog.open(PdfviewerComponent,
              {
                maxWidth: "85vw",
                height: '750px',
                width: '100%',
                data: {
                  base64: res["base64"] as string,
                  title: "Daily Expenses Report"
                }
              });
            dialogRef.afterClosed().subscribe(result => { 
              this.sIsLoading = '';
            });
          });
    
        }, 100);
      }
}

export class DailyExpensesList {
  ExpensesDate: any;
  PersonName: string;
  ExpAmount: number;
  Narration: any;
  ExpensesType: any;
  VoucharNo: number;
  HeadName: any;
  UserName: any;

  constructor(DailyExpensesList) {
    {
      this.ExpensesDate = DailyExpensesList.ExpensesDate || 0;
      this.PersonName = DailyExpensesList.PersonName || '';
      this.ExpAmount = DailyExpensesList.ExpAmount || 0;
      this.Narration = DailyExpensesList.Narration || '';
      this.ExpensesType = DailyExpensesList.ExpensesType || '';
      this.VoucharNo = DailyExpensesList.VoucharNo || 0;
      this.HeadName = DailyExpensesList.HeadName || '';
      this.UserName = DailyExpensesList.UserName || '';
    }
  }
}
