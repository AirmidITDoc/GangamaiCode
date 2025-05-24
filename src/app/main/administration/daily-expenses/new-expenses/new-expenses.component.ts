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
import { ExpensesHeadMasterComponent } from '../expenses-head-master/expenses-head-master.component';
import { debounce, result } from 'lodash';
import { Validators } from '@angular/forms';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

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
    this.getheadNamelist1(); 
     this._DailyExpensesService.NewExpensesForm.markAllAsTouched();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  getheadNamelist1() {
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
 vUPINO:any;
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
    debugger
      if(this.onlineflag && this._DailyExpensesService.NewExpensesForm.get('ExpType').value == '2'){
        if (this.vUPINO == '' || this.vUPINO == undefined || this.vUPINO == null) {
          this.toastr.warning('Please enter UPI No', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        } 
           if (this.vUPINO.length < 4) {
          this.toastr.warning('Please enter Min 4 and Max 12 digit number', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
    }
 
    let InserExpensesObj={
      "expDate": this.dateTimeObj.date,
      "expTime": this.dateTimeObj.time,
      "expType": this._DailyExpensesService.NewExpensesForm.get('ExpType').value || '0',
      "expAmount":this._DailyExpensesService.NewExpensesForm.get('ExpAmount').value || '',
      "personName": this._DailyExpensesService.NewExpensesForm.get('PersonName').value || '',
      "narration": this._DailyExpensesService.NewExpensesForm.get('Reason').value || '',
      "isAddedby":  this._loggedService.currentUserValue.user.id,
      "isCancelled": 0,
      "voucharNo": 0 ,//this._DailyExpensesService.NewExpensesForm.get('VoucharNo').value || '',
      "expHeadId":this._DailyExpensesService.NewExpensesForm.get('expenseshead').value.ExpHedId || '',
      "tranNo": this._DailyExpensesService.NewExpensesForm.get('UPINO').value || 0,
    }  
    let submitData={
      "insert_T_Expense":InserExpensesObj 
    } 
    console.log(submitData)
    this._DailyExpensesService.SaveDailyExpenses(submitData).subscribe(reponse =>{
      console.log(reponse)
      if(reponse){
        this.toastr.success('Record Saved Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.viewExpenseReport(reponse)
        this.onClose();
      } else {
        this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
        this.onClose();
      }
    }, error => {
      this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });  
  }
  onClose(){
    this._matDialog.closeAll();
    this._DailyExpensesService.NewExpensesForm.reset();
    this._DailyExpensesService.NewExpensesForm.get('ExpType').setValue('0')
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
  keyPressCharater(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/^[a-zA-Z\s]*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  addNewheadExpenses(){
    const dialogRef = this._matDialog.open(ExpensesHeadMasterComponent ,
      {
        width:'45%',
        height:'35%'
      }); 
      dialogRef.afterClosed().subscribe(result => {
        this.getheadNamelist1();
      });
  }
onlineflag:boolean=false
    onChangeReg(event) {
      debugger
      if (event.value == '2') {
        this.onlineflag = true; 
        // this._DailyExpensesService.NewExpensesForm.get('UPINO').setValidators([Validators.required]); 
        this._DailyExpensesService.NewExpensesForm.get('DoctorID').updateValueAndValidity();
      } else {
        this.onlineflag = false;
        this._DailyExpensesService.NewExpensesForm.get('UPINO').reset();
        this._DailyExpensesService.NewExpensesForm.get('UPINO').clearValidators();
        this._DailyExpensesService.NewExpensesForm.get('UPINO').updateValueAndValidity();
      }
    }


       viewExpenseReport(ExpId) { 
          debugger  
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
                });
              });
        
            }, 100);
          }
}
