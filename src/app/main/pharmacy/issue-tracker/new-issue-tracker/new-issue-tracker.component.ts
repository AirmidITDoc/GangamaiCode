import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms'; 
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ImageCropComponent } from "app/main/shared/componets/image-crop/image-crop.component";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { IssueTrackerService } from '../issue-tracker.service';
import { IssueTrackerList } from '../issue-tracker.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ImageViewComponent } from 'app/main/opd/appointment/image-view/image-view.component';
import { element } from 'protractor';

@Component({
  selector: 'app-new-issue-tracker',
  templateUrl: './new-issue-tracker.component.html',
  styleUrls: ['./new-issue-tracker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewIssueTrackerComponent implements OnInit {
  registerObj = new IssueTrackerList({});
  screenFromString = 'issuedate-form';
  dateTimeObj: any;
  sIsLoading: string = '';
  isLoading = true;
  images: any[] = [];
  sanitizeImagePreview;
  ConstanyTypeList: any = [];
  IssueAssignedList: any = [];
  IssueRaisedList: any = [];
  CustomerList:any=[];
  isChecked:boolean=false;
  vCustomerId:any;
  isCustomerSelected:boolean=false;
  filteredOptionsCustomer:Observable<string[]>;
  vIssueStatus:any;
  vIssueRaised:any;
  vIssueAssigned:any;
  IsReviewStatus:any = 0;
  vIssueRaisedDate: any;
  IsReviwed:any;

  displayedColumns1 = [
    'DocumentName',
    'DocumentPath', 
];


  @ViewChild('attachments') attachment: any;
  imageForm = new FormGroup({
    imageFile: new FormControl('', [Validators.required]),
    imgFileSource: new FormControl('', [Validators.required])
  });

  imgDataSource = new MatTableDataSource<any>();
  constructor(
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewIssueTrackerComponent>, 
    public toastr: ToastrService,
    public _IssueTracker: IssueTrackerService,
    private _loggedService: AuthenticationService,

  ) { }

  ngOnInit(): void { 
    this.vIssueRaisedDate = this.datePipe.transform(new Date(), 'MM/dd/YYYY');
 
    if (this.data) {
      this.registerObj = this.data.Obj;
      this.vIssueRaisedDate = this.datePipe.transform(this.registerObj.IssueDate, 'MM/dd/YYYY'); 
      console.log(this.registerObj) 
      this._IssueTracker.userFormGroup.get('IssueName').disable();
      this._IssueTracker.userFormGroup.get('IssueDescription').disable();
      this.setDropdownObjs();   

      if(this.registerObj.ReviewStatusId == 1){
        this._IssueTracker.userFormGroup.get('CodeRelease').setValue('true');
        this.isChecked = true;
        this.IsRelease = 1;
      }else{
        this._IssueTracker.userFormGroup.get('CodeRelease').setValue('false');
        this.IsRelease = 0;
        this.isChecked = false;
      }

      
      if(this.registerObj.ReleaseStatus == 1){
        this._IssueTracker.userFormGroup.get('vIsReviweStatus').setValue('true');
        this.IsReviewStatus = 1;
        this.IsReviwed = true;
      }else{
        this._IssueTracker.userFormGroup.get('vIsReviweStatus').setValue('false');
        this.IsReviewStatus = 0;
        this.IsReviwed = false;
      }

    }else{
      this._IssueTracker.userFormGroup.get('IssueName').enable();
      this._IssueTracker.userFormGroup.get('IssueDescription').enable(); 
    }

    this.getHospitalList();
    this.getIssueStatusList();
    this.getIssueAssignedList();
    this.getIssueRaisedList(); 
  }

  setDropdownObjs() {
    // const toSelectIssueStatus = this.ConstanyTypeList.find(c => c.Name == this.registerObj.StatusName);
    // this._IssueTracker.userFormGroup.get('IssueStatus').setValue(toSelectIssueStatus);
    // console.log(this.registerObj.StatusName);

    // const toSelectIssueAssigned = this.IssueAssignedList.find(c => c.Name == this.registerObj.IssueAssigned);
    // this._IssueTracker.userFormGroup.get('IssueStatus').setValue(toSelectIssueAssigned);
    // console.log(this.registerObj.IssueAssigned);

    // const toSelectIssueRaised = this.IssueRaisedList.find(c => c.Name == this.registerObj.IssueRaised);
    // this._IssueTracker.userFormGroup.get('IssueStatus').setValue(toSelectIssueRaised);
    // console.log(this.registerObj.IssueRaised);
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  //Hospital list
getHospitalList() {
  this._IssueTracker.getCustomerNameList().subscribe(data => {
    this.CustomerList = data;
    console.log(this.CustomerList)
    this.filteredOptionsCustomer = this._IssueTracker.userFormGroup.get('CustomerId').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._filterCustomer(value) : this.CustomerList.slice()),
    ); 
    this._IssueTracker.userFormGroup.get('CustomerId').setValue(this.CustomerList[0]);

    if (this.data) {
      const toSelectCustomer = this.CustomerList.find(c => c.CustomerName == this.registerObj.CustomerName);
      this._IssueTracker.userFormGroup.get('CustomerId').setValue(toSelectCustomer);
      console.log(this.registerObj.StatusName);
    }
  });
} 
getOptionTextCutomers(option) {
  return option && option.CustomerName ? option.CustomerName : '';
}
private _filterCustomer(value: any): string[] {
  if (value) {
    const filterValue = value && value.CustomerName ? value.CustomerName.toLowerCase() : value.toLowerCase();
    return this.CustomerList.filter(option => option.CustomerName.toLowerCase().includes(filterValue));
  } 
} 


  getIssueStatusList() {
    var vdata = {
      'ConstanyType': 'ISSUE_STATUS',
    }
    this._IssueTracker.getConstantsList(vdata).subscribe(data => {
      this.ConstanyTypeList = data;
      console.log(this.ConstanyTypeList);
      if (this.data) {
        const toSelectIssueStatus = this.ConstanyTypeList.find(c => c.Name == this.registerObj.StatusName);
        this._IssueTracker.userFormGroup.get('IssueStatus').setValue(toSelectIssueStatus);
        console.log(this.registerObj.StatusName);
      }
    });
  }

  getIssueAssignedList() {
    var vdata = {
      'ConstanyType': 'ISSUE_ASSIGNED',
    }
    this._IssueTracker.getConstantsList(vdata).subscribe(data => {
      this.IssueAssignedList = data;
      console.log(this.IssueAssignedList);
      if (this.data) {
        const toSelectIssueAssigned = this.IssueAssignedList.find(c => c.Name == this.registerObj.AssignedByName);
        this._IssueTracker.userFormGroup.get('IssueAssigned').setValue(toSelectIssueAssigned);
        console.log(this.registerObj.AssignedByName);
      }
    });
  }
  getIssueRaisedList() {
    var vdata = {
      'ConstanyType': 'ISSUE_RAISED',
    }
    this._IssueTracker.getConstantsList(vdata).subscribe(data => {
      this.IssueRaisedList = data;
      console.log(this.IssueRaisedList);
      if (this.data) {
        const toSelectIssueRaised = this.IssueRaisedList.find(c => c.Name == this.registerObj.RaisedByName);
        this._IssueTracker.userFormGroup.get('IssueRaised').setValue(toSelectIssueRaised);
        console.log(this.registerObj.RaisedByName);
      }
    });
  }
  IsRelease: any;
  onChangeIsactive(SiderOption) {
   // this.IsRelease = SiderOption.checked;
   console.log(this._IssueTracker.userFormGroup.get('CodeRelease').value)
    if (SiderOption.checked == true) {
      this.IsRelease = 1;
    }else{
      this.IsRelease = 0;
    } 
  }
  chkRevieStatus(SiderOption){
    console.log(this._IssueTracker.userFormGroup.get('vIsReviweStatus').value)
    if(SiderOption.checked == true){
      this.IsReviewStatus = 1;
    }else{
      this.IsReviewStatus = 0;
    } 
  }
  onImageChange(event) {
    let Imgflag = "";

    if (!event.target.files.length) return;
    const file = event.target.files[0];

    debugger
    this._matDialog.open(ImageCropComponent, { data: { file } }).afterClosed().subscribe(

      (event: ImageCroppedEvent) => (this.sanitizeImagePreview = event.base64,
        Imgflag = event.base64
      )
    );  

    if (Imgflag != " ") {
      let filesAmount = event.target.files.length;
      // for (let i = 0; i < filesAmount; i++) {
      // this.imgArr.push(file.name);
      this.images.push({ url: file, name: file.name, Id: 0 });
      this.imgDataSource.data = this.images;
      this.imageForm.patchValue({
        imgFileSource: this.images
      });
      // }
      console.log(this.images)
      console.log(this.imgDataSource.data)
      this.attachment.nativeElement.value = '';
    }
  }
  imgArr: string[] = [];
  onImageFileChange(events: any) { 
    if (events.target.files && events.target.files[0]) {
        let filesAmount = events.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
            this.imgArr.push(events.target.files[i].name);
            this.readFile(events.target.files[i], events.target.files[i].name);
        }
        this.attachment.nativeElement.value = '';
    }
}
readFile(f: File, name: string) {
    var reader = new FileReader();
    reader.onload = (event: any) => {
        this.images.push({ url: event.target.result, name: name, Id: 0 });
        this.imgDataSource.data = this.images;
        this.imageForm.patchValue({
            imgFileSource: this.images
        });
        console.log(this.imgDataSource.data);
    }
    reader.readAsDataURL(f);
}
onViewImage(ele: any, type: string) {

  let fileType;
  if (ele) {

      const dialogRef = this._matDialog.open(ImageViewComponent,
          {
              width: '900px',
              height: '900px',
              data: {
                  docData: type == 'img' ? ele : ele.doc,
                  type: type == 'img' ? "image" : ele.type
              }
          }
      );
      dialogRef.afterClosed().subscribe(result => {

      });
  }
}
ImageURL:any;
  OnSave() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    if (this.vCustomerId == '' || this.vCustomerId == null || this.vCustomerId == undefined) {
      this.toastr.warning('Please select Customer Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } 
    if (this._IssueTracker.userFormGroup.get('CustomerId').value) {
      if(!this.CustomerList.find(item => item.CustomerId == this._IssueTracker.userFormGroup.get('CustomerId').value.CustomerId))
      this.toastr.warning('Please select Valid Customer Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } 
    if (this._IssueTracker.userFormGroup.get('IssueName').value == '' || this._IssueTracker.userFormGroup.get('IssueName').value== null) {
      this.toastr.warning('Please enter Issue Name  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } 
    if (this._IssueTracker.userFormGroup.get('IssueDescription').value == '' || this._IssueTracker.userFormGroup.get('IssueDescription').value== null) {
      this.toastr.warning('Please enter Issue Description  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } 
    if (this.vIssueStatus == '' || this.vIssueStatus == null || this.vIssueStatus == undefined) {
      this.toastr.warning('Please select Issue Status', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } 
    if (this._IssueTracker.userFormGroup.get('IssueStatus').value) {
      if(!this.ConstanyTypeList.find(item => item.ConstantId == this._IssueTracker.userFormGroup.get('IssueStatus').value.ConstantId))
      this.toastr.warning('Please select Valid Issue Status', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }  
    if (this.vIssueRaised == '' || this.vIssueRaised == null || this.vIssueRaised == undefined ) {
      this.toastr.warning('Please select Issue Raised Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } 
    if (this._IssueTracker.userFormGroup.get('IssueRaised').value) {
      if(!this.IssueRaisedList.find(item => item.ConstantId == this._IssueTracker.userFormGroup.get('IssueRaised').value.ConstantId))
      this.toastr.warning('Please select Valid Issue Raised Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } 
    if (this.vIssueAssigned == '' || this.vIssueAssigned == null || this.vIssueAssigned == undefined ) {
      this.toastr.warning('Please select Issue Assigned Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } 
    if (this._IssueTracker.userFormGroup.get('IssueAssigned').value) {
      if(!this.IssueAssignedList.find(item => item.ConstantId == this._IssueTracker.userFormGroup.get('IssueAssigned').value.ConstantId))
      this.toastr.warning('Please select Valid Issue Assigned Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } 
    this.imgDataSource.data.forEach(element =>{
      console.log(element)
      console.log(element.url)
      this.ImageURL = element.url
      console.log(this.ImageURL)
    })

    if (!this.registerObj.IssueId) { 

        this.sIsLoading = 'loading-data';
        let insertIssueTrackerObj = {};
        insertIssueTrackerObj['issueNo'] = 0;
        insertIssueTrackerObj['clientId'] = this._IssueTracker.userFormGroup.get('CustomerId').value.CustomerId || 0;  
        insertIssueTrackerObj['issueDate'] = this._IssueTracker.userFormGroup.get("IssueRaisedDate").value || 0;   
        insertIssueTrackerObj['issueTime'] =  formattedTime ;  
        insertIssueTrackerObj['issueName'] =  this._IssueTracker.userFormGroup.get('IssueName').value || '';
        insertIssueTrackerObj['issueDescription'] = this._IssueTracker.userFormGroup.get('IssueDescription').value || '';
        insertIssueTrackerObj['raisedById'] =  this._IssueTracker.userFormGroup.get('IssueRaised').value.ConstantId  || 0
        insertIssueTrackerObj['assignedToId'] = this._IssueTracker.userFormGroup.get('IssueAssigned').value.ConstantId || 0
        insertIssueTrackerObj['statusId'] =   this._IssueTracker.userFormGroup.get('IssueStatus').value.ConstantId  || 0
        insertIssueTrackerObj['devComment'] = this._IssueTracker.userFormGroup.get('DevComment').value || ''; 
        insertIssueTrackerObj['comment'] =    this._IssueTracker.userFormGroup.get('Comment').value || '';
        insertIssueTrackerObj['reviewStatusId'] =  this._IssueTracker.userFormGroup.get('CodeRelease').value || 0 ;  
        insertIssueTrackerObj['releaseStatus'] =  this.IsRelease || 0;  
        insertIssueTrackerObj['resolvedDate'] =  formattedDate ; 
        insertIssueTrackerObj['resolvedTime'] = formattedTime ;
        insertIssueTrackerObj['documentUpload'] =   this.ImageURL  || '';   
        insertIssueTrackerObj['createdBy'] = this._loggedService.currentUserValue.user.id || 0;  
        insertIssueTrackerObj['createdDate'] = formattedTime ;
        insertIssueTrackerObj['modifiedDate'] = formattedTime;
        insertIssueTrackerObj['modifiedBy'] = 0;   

      let submitData = {
        "insertIssueTracker": insertIssueTrackerObj,
      };
      console.log(submitData);
      this._IssueTracker.InsertIssueTracker(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose();
        }
        else {
          this.toastr.error('Record Data not saved !, Please check error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        } 
      }, error => {
        this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }); 
    } 
    else { 
      this.sIsLoading = 'loading-data';
      let UpdateIssueTrackerObj = {};
      UpdateIssueTrackerObj['issueId'] = this.registerObj.IssueId || 0;
      UpdateIssueTrackerObj['issueNo'] = this.registerObj.IssueNo || 0;
      UpdateIssueTrackerObj['clientId'] = this._IssueTracker.userFormGroup.get('CustomerId').value.CustomerId || 0;  
      UpdateIssueTrackerObj['issueDate'] = this._IssueTracker.userFormGroup.get("IssueRaisedDate").value || 0;   
      UpdateIssueTrackerObj['issueTime'] =  formattedTime ;  
      UpdateIssueTrackerObj['issueName'] =  this._IssueTracker.userFormGroup.get('IssueName').value || '';
      UpdateIssueTrackerObj['issueDescription'] = this._IssueTracker.userFormGroup.get('IssueDescription').value || '';
      UpdateIssueTrackerObj['raisedById'] =  this._IssueTracker.userFormGroup.get('IssueRaised').value.ConstantId  || 0
      UpdateIssueTrackerObj['assignedToId'] = this._IssueTracker.userFormGroup.get('IssueAssigned').value.ConstantId || 0
      UpdateIssueTrackerObj['statusId'] =   this._IssueTracker.userFormGroup.get('IssueStatus').value.ConstantId  || 0
      UpdateIssueTrackerObj['devComment'] = this._IssueTracker.userFormGroup.get('DevComment').value || ''; 
      UpdateIssueTrackerObj['comment'] =    this._IssueTracker.userFormGroup.get('Comment').value || '';
      UpdateIssueTrackerObj['reviewStatusId'] =  this.IsReviewStatus || 0 ;    
      UpdateIssueTrackerObj['releaseStatus'] =  this.IsRelease || 0;  
      if(this._IssueTracker.userFormGroup.get('IssueStatus').value.Name == 'CLOSE'){
        UpdateIssueTrackerObj['resolvedDate'] =  formattedDate ; 
        UpdateIssueTrackerObj['resolvedTime'] = formattedTime ;
      }else{
        UpdateIssueTrackerObj['resolvedDate'] =  "01/01/1900"; 
        UpdateIssueTrackerObj['resolvedTime'] = "01/01/1900";
      } 
      UpdateIssueTrackerObj['documentUpload'] =  this._IssueTracker.userFormGroup.get('imageFile').value || '';   
      UpdateIssueTrackerObj['createdBy'] = this._loggedService.currentUserValue.user.id; 
      UpdateIssueTrackerObj['createdDate'] = formattedDate ;
      UpdateIssueTrackerObj['modifiedDate'] = formattedTime;
      UpdateIssueTrackerObj['modifiedBy'] = this._loggedService.currentUserValue.user.id || 0;  

    let submitData = {
      "updateIssueTracker": UpdateIssueTrackerObj,
    };

      console.log(submitData);
      this._IssueTracker.UpdateIssueTracker(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });  
          this.onClose();
        }
        else {
          this.toastr.error('New Issue Tracker Data not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }

      }, error => {
        this.toastr.error('New Issue Tracker Data not Updated !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
    }
  }
  onClose() {
    this._IssueTracker.userFormGroup.reset();
    this.dialogRef.close();
  } 
  @ViewChild('IssueRaisedDate') IssueRaisedDate: ElementRef;
  @ViewChild('IssueName') IssueName: ElementRef;
  @ViewChild('Issuedescrip') Issuedescrip: ElementRef;
  @ViewChild('Issuestatus') Issuestatus: ElementRef;
  @ViewChild('Issueraised') Issueraised: ElementRef;
  @ViewChild('IssueAssign') IssueAssign: ElementRef;
  @ViewChild('Devcomment') Devcomment: ElementRef;
  @ViewChild('comment') comment: ElementRef;

  public onEnterCustomer(event): void {
    if (event.which === 13) {
      this.IssueRaisedDate.nativeElement.focus();
    }
  }
  public onEnterIssueRaisedDate(event): void {
    if (event.which === 13) {
      this.IssueName.nativeElement.focus();
    }
  }
  public onEnterIssueName(event): void {
    if (event.which === 13) {
      this.Issuedescrip.nativeElement.focus();
    }
  } 
  public onEnterIssueDescrip(event): void {
    if (event.which === 13) {
      this.Issuestatus.nativeElement.focus();
    }
  }
  public onEnterIssueStatus(event): void {
    if (event.which === 13) {
      this.Issueraised.nativeElement.focus();
    }
  }
  public onEnterIssueRaised(event): void {
    if (event.which === 13) {
      this.IssueAssign.nativeElement.focus();
    }
  }
  public onEnterIssueAssign(event): void {
    if (event.which === 13) {
      this.Devcomment.nativeElement.focus(); 
    }
  }
  public onEnterDevComment(event): void {
    if (event.which === 13) {
      this.comment.nativeElement.focus();
    }
  }
  public onEnterComment(event): void {
    if (event.which === 13) {
      this.IssueAssign.nativeElement.focus();
    }
  } 
}
  