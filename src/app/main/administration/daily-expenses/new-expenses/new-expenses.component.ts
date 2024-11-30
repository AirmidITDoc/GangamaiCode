import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { DailyExpensesService } from '../daily-expenses.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-new-expenses',
  templateUrl: './new-expenses.component.html',
  styleUrls: ['./new-expenses.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewExpensesComponent implements OnInit {


  vExpenseshead:any;
  filteredExpenseHead:Observable<string[]>;
  isExpheadSelected:boolean=false;
  screenFromString:'daily-expense';
  vPersonName:any;
  vExpAmount:any;
  vVoucharNo:any;
  vReason:any;
  ExpHeadList:any=[];

  constructor(
    public _DailyExpensesService:DailyExpensesService, 
    private _fuseSidebarService: FuseSidebarService, 
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService, 
  ) { }

  ngOnInit(): void {
    this.getRoleNamelist1();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  getRoleNamelist1() {
    // debugger
    this._DailyExpensesService.getExpHeadCombobox().subscribe(data => {
      this.ExpHeadList = data;
      console.log(this.ExpHeadList)
      this.filteredExpenseHead = this._DailyExpensesService.NewExpensesForm.get('expenseshead').valueChanges.pipe(
        startWith(''), 
        map(value => value ? this._filterExpHead(value) : this.ExpHeadList.slice()),
      );
      // if (this.data) {
      //   const ddValue = this.ExpHeadList.filter(c => c.RoleId == this.registerObj.RoleId);
      //   this._DailyExpensesService.NewExpensesForm.get('expenseshead').setValue(ddValue[0]);
      //   this._DailyExpensesService.NewExpensesForm.updateValueAndValidity();
      //   return;
      // }
    });
  }
//role master
  private _filterExpHead(value: any): string[] {
    if (value) {
      const filterValue = value && value.HeadName ? value.HeadName.toLowerCase() : value.toLowerCase();
      return this.ExpHeadList.filter(option => option.HeadName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextExpHead(option) {
    return option && option.HeadName ? option.HeadName : '';
  }
 
  OnSave(){
    if (this.vExpenseshead == '' || this.vExpenseshead == undefined || this.vExpenseshead == null || this.vExpenseshead == '') {
      this.toastr.warning('Please select HeadName', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if( this._DailyExpensesService.NewExpensesForm.get('expenseshead').value){
      if(!this.ExpHeadList.find(item => item.HeadName == this._DailyExpensesService.NewExpensesForm.get('expenseshead').value.HeadName)){
        this.toastr.warning('Please select valid HeadName', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      } 
    }
    if (this.vPersonName == '' || this.vPersonName == undefined || this.vPersonName == null || this.vPersonName == '') {
      this.toastr.warning('Please enter Person Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vExpAmount == '' || this.vExpAmount == undefined || this.vExpAmount == null || this.vExpAmount == '') {
      this.toastr.warning('Please enter Exp Amount', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }
  onClose(){
    this._matDialog.closeAll();
  }
  
  @ViewChild('PersonName') PersonName: ElementRef;
  @ViewChild('ExpAmount') ExpAmount: ElementRef;
  @ViewChild('VoucharNo') VoucharNo: ElementRef;
  @ViewChild('Reason') Reason: ElementRef; 

  onEnterExphead(event) {
    if (event.which === 13) {
      this.PersonName.nativeElement.focus();
    }
  }
  onEnterPersonName(event) {
    if (event.which === 13) {
      this.ExpAmount.nativeElement.focus();
    }
  } 
  onEnterExpAmt(event) {
    if (event.which === 13) {
      this.VoucharNo.nativeElement.focus();
    }
  }
  onEnterVoucharNo(event) {
    if (event.which === 13) {
      this.Reason.nativeElement.focus();
    }
  } 
  onEnterReason(event) {
    if (event.which === 13) {
      //this.loginname.nativeElement.focus();
    }
  } 
}
