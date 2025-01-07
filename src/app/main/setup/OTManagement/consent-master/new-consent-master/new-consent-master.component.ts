import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConsentMasterService } from '../consent-master.service';

@Component({
  selector: 'app-new-consent-master',
  templateUrl: './new-consent-master.component.html',
  styleUrls: ['./new-consent-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewConsentMasterComponent implements OnInit {

  registerObj:any;
  vConsentId:string;
  vConsentName:string;
  vConsentDesc:string;
  vDepartmentName:string;
  vIsDeleted:any;
  isDepartmentSelected:boolean=false;
  filteredOptionsDep: Observable<string[]>;
  optionsDep: any[] = [];
  DepartmentList: any = [];

  constructor(
    public _otConsentService: ConsentMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewConsentMasterComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getDepartmentList();

    if(this.data){
      debugger
      this.registerObj=this.data.Obj;
      console.log("RegisterObj:",this.registerObj)
      this.vConsentName = this.registerObj.ConsentName;
      this.vDepartmentName = this.registerObj.DepartmentName;
      this.vConsentDesc=this.registerObj.ConsentDesc
      this.vConsentId=this.registerObj.OTTableId;
      if(this.registerObj.IsActive==true){
        this._otConsentService.myform.get("IsDeleted").setValue(true)
        // this.vIsDeleted=true;
      }else{
        this._otConsentService.myform.get("IsDeleted").setValue(false)
        // this.vIsDeleted=false;
      }
    }
  }

  private _filterDep(value: any): string[] {
    if (value) {
      const filterValue = value && value.DepartmentName ? value.DepartmentName.toLowerCase() : value.toLowerCase();
      // this.isDepartmentSelected = false;
      return this.optionsDep.filter(option => option.DepartmentName.toLowerCase().includes(filterValue));
    }
  }

  getDepartmentList(){
    debugger
    this._otConsentService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.optionsDep = this.DepartmentList.slice();
      this.filteredOptionsDep = this._otConsentService.myform.get('DepartmentId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
      );
      if(this.registerObj){
        
        const DValue = this.DepartmentList.filter(item => item.DepartmentName == this.registerObj.DepartmentName);
        console.log("DepartmentId:",DValue)
        this._otConsentService.myform.get('DepartmentId').setValue(DValue[0]);
        this._otConsentService.myform.updateValueAndValidity();
        return;
      }
      // this.filteredDepartment.next(this.DepartmentList.slice());
    });
  }
  getOptionTextDep(option) {    
    return option && option.DepartmentName ? option.DepartmentName : '';
  }

  onSave(){
    if (this.vConsentName == '' || this.vConsentName == null || this.vConsentName== undefined) {
      this.toastr.warning('Please enter ConsentName  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this.vDepartmentName == '' || this.vDepartmentName == null || this.vDepartmentName == undefined) {
      this.toastr.warning('Please enter select Department ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._otConsentService.myform.get('DepartmentId').value) {
      if(!this.DepartmentList.find(item => item.DepartmentName == this._otConsentService.myform.get('DepartmentId').value.DepartmentName))
     {
      this.toastr.warning('Please select Valid Department Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
     }
    }

    Swal.fire({
      title: 'Do you want to Save the Consent Recode ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save it!" ,
      cancelButtonText: "No, Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
          this.onSubmit();
      }
    });
  }

  onSubmit(){
    debugger
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd'); 

    if(!this.vConsentId){

      var m_dataInsert={
        "saveConsentMasterParam": {
          "consentId": 0,
          "departmentId": this._otConsentService.myform.get("DepartmentId").value.DepartmentId || 0,
          "consentName": this._otConsentService.myform.get("ConsentName").value || '',
          "consentDesc": this._otConsentService.myform.get("ConsentDesc").value || '',
          "isActive": Boolean(JSON.parse(this._otConsentService.myform.get("IsDeleted").value) || 0),
          "createdBy": this._loggedService.currentUserValue.user.id,
        }
      }
      console.log("insertJson:", m_dataInsert);

      this._otConsentService.OtConsentInsert(m_dataInsert).subscribe(response =>{
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        } else {
          this.toastr.error('Record not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
    else{
      debugger
      var m_dataUpdate={
        "updateConsentMasterParam": {
          "consentId": this.vConsentId,
          "departmentId": this._otConsentService.myform.get("DepartmentId").value.DepartmentId || 0,
          "consentName": this._otConsentService.myform.get("ConsentName").value || '',
          "consentDesc": this._otConsentService.myform.get("ConsentDesc").value || '',
          "isActive": Boolean(JSON.parse(this._otConsentService.myform.get("IsDeleted").value) || 0),
          "modifiedBy": this._loggedService.currentUserValue.user.id,
        }
      }
      console.log("UpdateJson:", m_dataUpdate);

      this._otConsentService.OtConsentUpdate(m_dataUpdate).subscribe(response =>{
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose();
        } else {
          this.toastr.error('Record not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
  }

  onClose(){
    this._otConsentService.myform.reset();
    this.dialogRef.close();
  }

}
export class OtConsentMasterList {
  ConsentId:number;
  ConsentName:string;
  IsActive:string;
  ConsentDesc:any;
  DepartmentName:any;
  CreatedBy:any;
  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(OtSiteDescMasterList) {
    {
      this.ConsentId = OtSiteDescMasterList.ConsentId || '';
      this.ConsentName = OtSiteDescMasterList.ConsentName || '';
      this.IsActive=OtSiteDescMasterList.IsActive || '';      
      this.ConsentDesc = OtSiteDescMasterList.ConsentDesc || '';
      this.DepartmentName = OtSiteDescMasterList.DepartmentName || '';
      this.CreatedBy=OtSiteDescMasterList.CreatedBy || '';
    }
  }
}