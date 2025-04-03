import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SitedescriptionMasterService } from '../sitedescription-master.service';

@Component({
  selector: 'app-new-sitedescription-master',
  templateUrl: './new-sitedescription-master.component.html',
  styleUrls: ['./new-sitedescription-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewSitedescriptionMasterComponent implements OnInit {

  vSiteDescId: any;
  registerObj: any;
  vSiteDescriptionName: any;
  vSurgeryCategoryID:any;
  vIsDeleted:any;
  isSurgeryCategorySelected:boolean=false;
  SurgeryCategorycmbList:any=[];
  optionsSurgeryCategory: any[] = [];
  filteredOptionsSurgeryCategory: Observable<string[]>;

  constructor(
    public _otSiteDescMasterService: SitedescriptionMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewSitedescriptionMasterComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getSurgeryCategoryNameCombo();

    if(this.data){
      this.registerObj=this.data.Obj;
      console.log("RegisterObj:",this.registerObj)
      this.vSiteDescriptionName = this.registerObj.SiteDescriptionName;
      this.vSiteDescId = this.registerObj.SiteDescId;
      this.vSurgeryCategoryID=this.registerObj.SurgeryCategoryID;
      if(this.registerObj.IsActive==true){
        this._otSiteDescMasterService.myform.get("IsDeleted").setValue(true)
      }else{
        this._otSiteDescMasterService.myform.get("IsDeleted").setValue(false)
      }
    }
  }

  getOptionTextautoSurgeryCategory(option) {
    return option && option.SurgeryCategoryName ? option.SurgeryCategoryName : '';
  }

  getSurgeryCategoryNameCombo(){

    this._otSiteDescMasterService.getSurgerycategoryMasterCombo().subscribe(data => {
      this.SurgeryCategorycmbList = data;
      this.optionsSurgeryCategory = this.SurgeryCategorycmbList.slice();
      this.filteredOptionsSurgeryCategory = this._otSiteDescMasterService.myform.get('SurgeryCategoryID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSurgeryCategory(value) : this.SurgeryCategorycmbList.slice()),
      );
      if (this.data) {
        
        const DValue = this.SurgeryCategorycmbList.filter(item => item.SurgeryCategoryId == this.registerObj.SurgeryCategoryID);
        console.log("SurgeryCategoryId:",DValue)
        this._otSiteDescMasterService.myform.get('SurgeryCategoryID').setValue(DValue[0]);
        this._otSiteDescMasterService.myform.updateValueAndValidity();
       
        return;
      }
    });
  }

  private _filterSurgeryCategory(value: any): string[] {
    if (value) {
      const filterValue = value && value.SurgeryCategoryName ? value.SurgeryCategoryName.toLowerCase() : value.toLowerCase();
      return this.optionsSurgeryCategory.filter(option => option.SurgeryCategoryName.toLowerCase().includes(filterValue));
    }
  } 

  onSave(){
    if (this.vSiteDescriptionName == '' || this.vSiteDescriptionName == null || this.vSiteDescriptionName== undefined) {
      this.toastr.warning('Please enter SiteDescriptionName  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this.vSurgeryCategoryID == '' || this.vSurgeryCategoryID == null || this.vSurgeryCategoryID == undefined) {
      this.toastr.warning('Please enter select SurgeryCategory ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._otSiteDescMasterService.myform.get('SurgeryCategoryID').value) {
      if(!this.SurgeryCategorycmbList.find(item => item.SurgeryCategoryName == this._otSiteDescMasterService.myform.get('SurgeryCategoryID').value.SurgeryCategoryName))
     {
      this.toastr.warning('Please select Valid SurgeryCategory Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
     }
    }

    Swal.fire({
      title: 'Do you want to Save the SiteDescription Recode ',
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

  onSubmit() {
    debugger
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd'); 

    if(!this.vSiteDescId){

      var m_dataInsert={
        "saveMOTSiteDescriptionMasterParam": {
          "siteDescriptionName": this._otSiteDescMasterService.myform.get("SiteDescriptionName").value || '',
          "surgeryCategoryID": parseInt(this._otSiteDescMasterService.myform.get("SurgeryCategoryID").value.SurgeryCategoryId).toString(),
          "isActive": Boolean(JSON.parse(this._otSiteDescMasterService.myform.get("IsDeleted").value) || 0),
          "createdBy": this._loggedService.currentUserValue.user.id,
          "siteDescId": 0
        }
      }
      console.log("insertJson:", m_dataInsert);

      this._otSiteDescMasterService.OtSiteDescInsert(m_dataInsert).subscribe(response =>{
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
          "updateMOTSiteDescriptionMasterParam": {
          "siteDescId": this.vSiteDescId,
          "siteDescriptionName": this._otSiteDescMasterService.myform.get("SiteDescriptionName").value || '',
          "surgeryCategoryID": this._otSiteDescMasterService.myform.get("SurgeryCategoryID").value.SurgeryCategoryId || 0,
          "isActive": Boolean(JSON.parse(this._otSiteDescMasterService.myform.get("IsDeleted").value) || 0),
          "modifiedBy": this._loggedService.currentUserValue.user.id,
        }
      }
      console.log("UpdateJson:", m_dataUpdate);

      this._otSiteDescMasterService.OtSiteDescUpdate(m_dataUpdate).subscribe(response =>{
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        } else {
          this.toastr.error('Record not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
  }

  onClose(){
    this._otSiteDescMasterService.myform.reset({IsDeleted: true});
    this.dialogRef.close();
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
  keyPressCharater(event){
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
export class OtSiteDescMasterList {
  SiteDescId:number;
  SiteDescriptionName:string;
  SurgeryCategoryID:any;
  IsActive:string;
  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(OtSiteDescMasterList) {
    {
      this.SiteDescId = OtSiteDescMasterList.SiteDescId || '';
      this.SiteDescriptionName = OtSiteDescMasterList.SiteDescriptionName || '';      
      this.SurgeryCategoryID = OtSiteDescMasterList.SurgeryCategoryID || '';
      this.IsActive=OtSiteDescMasterList.IsActive || '';
    }
  }
}
