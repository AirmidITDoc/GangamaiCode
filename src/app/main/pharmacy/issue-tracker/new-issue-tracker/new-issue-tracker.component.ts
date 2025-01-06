import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormControl, FormGroup, Validators } from '@angular/forms'; 
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ImageCropComponent } from "app/main/shared/componets/image-crop/image-crop.component";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { IssueTrackerService } from '../issue-tracker.service';
import { IssueTrackerList } from '../issue-tracker.component';

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

  @ViewChild('attachments') attachment: any;
  imageForm = new FormGroup({
    imageFile: new UntypedFormControl('', [Validators.required]),
    imgFileSource: new UntypedFormControl('', [Validators.required])
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

    this.getIssueStatusList();
    this.getIssueAssignedList();
    this.getIssueRaisedList();

    if (this.data.Obj) {
      this.registerObj = this.data.Obj;
      this.setDropdownObjs();
      console.log(this.registerObj)
    }
  }

  setDropdownObjs() {
    const toSelectIssueStatus = this.ConstanyTypeList.find(c => c.Name == this.registerObj.IssueStatus);
    this._IssueTracker.userFormGroup.get('IssueStatus').setValue(toSelectIssueStatus);
    console.log(this.registerObj.IssueStatus);

    const toSelectIssueAssigned = this.IssueAssignedList.find(c => c.Name == this.registerObj.IssueAssigned);
    this._IssueTracker.userFormGroup.get('IssueStatus').setValue(toSelectIssueAssigned);
    console.log(this.registerObj.IssueAssigned);

    const toSelectIssueRaised = this.IssueRaisedList.find(c => c.Name == this.registerObj.IssueRaised);
    this._IssueTracker.userFormGroup.get('IssueStatus').setValue(toSelectIssueRaised);
    console.log(this.registerObj.IssueRaised);
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  onClose() {
    this.dialogRef.close();
  }
  OnReset() {
    this._IssueTracker.userFormGroup.reset();
  }

  getIssueStatusList() {
    var vdata = {
      'ConstanyType': 'ISSUE_STATUS',
    }
    this._IssueTracker.getConstantsList(vdata).subscribe(data => {
      this.ConstanyTypeList = data;
      console.log(this.ConstanyTypeList);
      if (this.data) {
        const toSelectIssueStatus = this.ConstanyTypeList.find(c => c.Name == this.registerObj.IssueStatus);
        this._IssueTracker.userFormGroup.get('IssueStatus').setValue(toSelectIssueStatus);
        console.log(this.registerObj.IssueStatus);
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
        const toSelectIssueAssigned = this.IssueAssignedList.find(c => c.Name == this.registerObj.IssueAssigned);
        this._IssueTracker.userFormGroup.get('IssueAssigned').setValue(toSelectIssueAssigned);
        console.log(this.registerObj.IssueAssigned);
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
        const toSelectIssueRaised = this.IssueRaisedList.find(c => c.Name == this.registerObj.IssueRaised);
        this._IssueTracker.userFormGroup.get('IssueRaised').setValue(toSelectIssueRaised);
        console.log(this.registerObj.IssueRaised);
      }
    });
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

    debugger

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
      this.attachment.nativeElement.value = '';
    }
  }
  onViewImage(ele: any, type: string) {

    // let fileType;
    // if (ele) {

    //   const dialogRefs = this._matDialog.open(ImageViewComponent,
    //     {
    //       width: '900px',
    //       height: '900px',
    //       data: {
    //         docData: type == 'img' ? ele : ele.doc,
    //         type: type == 'img' ? "image" : ele.type
    //       }
    //     }
    //   );
    //   dialogRefs.afterClosed().subscribe(result => {
    //   });
    // }
  }




  // OnSave() {
  //   if (this.data.NewIssueTracker == 1) {
  //     this.OnSavenew();
  //   } else if (this.data.NewIssueTracker == 2) {
  //     this.OnSaveEdit()
  //   }
  // }

  OnSave() {
    if (!this.registerObj.IssueTrackerId) {
      this.sIsLoading = 'loading-data';
      let insertIssueTracker = {};
      insertIssueTracker['issueRaisedDate'] = this.dateTimeObj.date;
      insertIssueTracker['issueRaisedTime'] = this.dateTimeObj.time;
      insertIssueTracker['issueSummary'] = this._IssueTracker.userFormGroup.get('IssueSummary').value || '';
      insertIssueTracker['issueDescription'] = this._IssueTracker.userFormGroup.get('IssueDescription').value || '';
      insertIssueTracker['uploadImagePath'] = this._IssueTracker.userFormGroup.get('ImagePath').value || '';
      insertIssueTracker['imageName'] = this._IssueTracker.userFormGroup.get('ImageName').value || '';
      insertIssueTracker['issueStatus'] = this._IssueTracker.userFormGroup.get('IssueStatus').value.Name || '';
      insertIssueTracker['issueRaised'] = this._IssueTracker.userFormGroup.get('IssueRaised').value.Name || '';
      insertIssueTracker['issueAssigned'] = this._IssueTracker.userFormGroup.get('IssueAssigned').value.Name || '';
      insertIssueTracker['addedby'] = this._loggedService.currentUserValue.userId || 0;


      let submitData = {
        "insertIssueTracker": insertIssueTracker,
      };
      console.log(submitData);
      this._IssueTracker.InsertIssueTracker(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          }); this._matDialog.closeAll();

        }
        else {
          this.toastr.error('New Issue Tracker Data not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }

      }, error => {
        this.toastr.error('New Issue Tracker Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });

    }

    else {
      this.sIsLoading = 'loading-data';
      let updateIssueTracker = {};
      updateIssueTracker['operation'] = "UPDATE";
      updateIssueTracker['issueTrackerId'] = this.registerObj.IssueTrackerId;
      updateIssueTracker['issueSummary'] = this._IssueTracker.userFormGroup.get('IssueSummary').value || '';
      updateIssueTracker['issueDescription'] = this._IssueTracker.userFormGroup.get('IssueDescription').value || '';
      updateIssueTracker['uploadImagePath'] = this._IssueTracker.userFormGroup.get('ImagePath').value || '';
      updateIssueTracker['imageName'] = this._IssueTracker.userFormGroup.get('ImageName').value || '';
      updateIssueTracker['issueStatus'] = this._IssueTracker.userFormGroup.get('IssueStatus').value.Name || '';
      updateIssueTracker['issueRaised'] = this._IssueTracker.userFormGroup.get('IssueRaised').value.Name || '';
      updateIssueTracker['issueAssigned'] = this._IssueTracker.userFormGroup.get('IssueAssigned').value.Name || '';
      updateIssueTracker['updatedBy'] = this._loggedService.currentUserValue.userId || 0;

      let submitData = {
        "updateIssueTracker": updateIssueTracker
      };

      console.log(submitData);
      this._IssueTracker.UpdateIssueTracker(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          }); this._matDialog.closeAll();

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

  @ViewChild('ImageName') ImageName: ElementRef;
  @ViewChild('ImagePath') ImagePath: ElementRef;
  @ViewChild('ImageUpload') ImageUpload: ElementRef;
  @ViewChild('IssueStatus') IssueStatus: ElementRef;
  @ViewChild('IssueRaised') IssueRaised: ElementRef;
  @ViewChild('IssueAssigned') IssueAssigned: ElementRef;
  @ViewChild('IssueSummary') IssueSummary: ElementRef;
  @ViewChild('IssueDescription') IssueDescription: ElementRef;

  public onEnterImageName(event): void {
    if (event.which === 13) {
      this.ImagePath.nativeElement.focus();
    }
  }
  public onEnterImagePath(event): void {
    if (event.which === 13) {
      this.IssueStatus.nativeElement.focus();
    }
  }
  public onEnterIssueStatus(event): void {
    if (event.which === 13) {
      this.IssueRaised.nativeElement.focus();
    }
  }

  public onEnterIssueRaised(event): void {
    if (event.which === 13) {
      this.IssueAssigned.nativeElement.focus();
    }
  }
  public onEnterIssueAssigned(event): void {
    if (event.which === 13) {
      this.IssueSummary.nativeElement.focus();
    }
  }
  public onEnterIssueSummary(event): void {
    if (event.which === 13) {
      this.IssueDescription.nativeElement.focus();
    }
  }
  public onEnterIssueDescription(event): void {
    if (event.which === 13) {
      //this.IssueDescription.nativeElement.focus();

    }
  }
}
  