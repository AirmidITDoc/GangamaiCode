import { ElementRef, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VendorMasterFormComponent } from '../vendor-master-form/vendor-master-form.component';
import { GroupMasterService } from '../vendor-master.service';

@Component({
  selector: 'app-vendor-master-list',
  templateUrl: './vendor-master-list.component.html',
  styleUrls: ['./vendor-master-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class VendorMasterListComponent implements OnInit, OnDestroy {
  @ViewChild('dialogContent')
  dialogContent: TemplateRef<any>;

  groupMasters: any;
  resultsLength = 0;
  //user: any;
  //dataSource: ServiceMaster[];
  displayedColumns = [
    'checkbox',
    'VendorId' ,
    'VendorName',
    'MobileNo',
    'AccountNo',
    'IsDeleted',
    'buttons'
  ];
  selectedContacts: any[];
  checkboxes: {};
  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  @ViewChild('filter', { static: true })
  filter: ElementRef;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {ServiceMasterService} _groupMasterService
   * @param {MatDialog} _matDialog
   */
  constructor(
      private _groupMasterService: GroupMasterService,
      public _matDialog: MatDialog
  ) {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
      //this.dataSource = new FilesDataSource(this._contactsService, this.paginator, this.sort);
      this._groupMasterService.onContactsChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(contacts => {
              this.groupMasters = contacts;
              this.resultsLength = 100;

              this.checkboxes = {};
              contacts.map(contact => {
                  this.checkboxes[contact.id] = false;
              });
          });

      this._groupMasterService.onSelectedContactsChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(selectedContacts => {
              for (const id in this.checkboxes) {
                  if (!this.checkboxes.hasOwnProperty(id)) {
                      continue;
                  }

                  this.checkboxes[id] = selectedContacts.includes(id);
              }
              this.selectedContacts = selectedContacts;
          });

      //after filter deselect all    
      this._groupMasterService.onFilterChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
              this._groupMasterService.deselectContacts();
          });

      this.paginator.page
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
              this._groupMasterService.onPaginationChanged.next({
                  sort: this.sort.active,
                  sortBy: this.sort.direction,
                  pageIndex: this.paginator.pageIndex,
                  pageSize: this.paginator.pageSize
              });
          });

      this.sort.sortChange
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
              // If the user changes the sort order, reset back to the first page.
              this.paginator.pageIndex = 0;

              this._groupMasterService.onPaginationChanged.next({
                  sort: this.sort.active,
                  sortBy: this.sort.direction,
                  pageIndex: this.paginator.pageIndex,
                  pageSize: this.paginator.pageSize
              });
          });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Edit contact
   *
   * @param contact
   */
  editContact(contact): void {
      this.dialogRef = this._matDialog.open(VendorMasterFormComponent, {
        maxWidth: "100vw",
        maxHeight: "100vh",
        height: "30%",
        width: "40%",
        //   panelClass: 'contact-form-dialog',
          data: {
              contact: contact,
              action: 'edit'
          }
      });

      this.dialogRef.afterClosed()
          .subscribe(response => {
              if (!response) {
                  return;
              }
              const actionType: string = response[0];
              const formData: FormGroup = response[1];
              switch (actionType) {
                  /**
                   * Save
                   */
                  case 'save':

                      this._groupMasterService.updateContact(formData.getRawValue());

                      break;
                  /**
                   * Delete
                   */
                  case 'delete':

                      this.deleteContact(contact);

                      break;
              }
          });
  }

  /**
   * Delete Contact
   */
  deleteContact(contact): void {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
          disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

      this.confirmDialogRef.afterClosed().subscribe(result => {
          if (result) {
              this._groupMasterService.deleteContact(contact);
          }
          this.confirmDialogRef = null;
      });

  }

  /**
   * On selected change
   *
   * @param contactId
   */
  onSelectedChange(contactId): void {
      this._groupMasterService.toggleSelectedContact(contactId);
  }

  /**
   * Toggle star
   *
   * @param contactId
   */
  // toggleStar(contactId): void {
  //     if (this.user.starred.includes(contactId)) {
  //         this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
  //     }
  //     else {
  //         this.user.starred.push(contactId);
  //     }

  //     this._contactsService.updateUserData(this.user);
  // }
}

