import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { takeUntil, startWith, switchMap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { ServiceMasterService } from 'app/main/setup/billing/service-master/service-master.service';
import { ServiceMasterFormDialogComponent } from 'app/main/setup/billing/service-master/service-master-form/service-master-form.component';
import { FuseUtils } from '@fuse/utils';

import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, } from 'rxjs/operators';
import { ServiceMaster } from '../service-master.model';

@Component({
    selector: 'service-master-list',
    templateUrl: './service-master-list.component.html',
    styleUrls: ['./service-master-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ServiceMasterListComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    contacts: any;
    resultsLength = 0;
    //user: any;
    //dataSource: ServiceMaster[];
    displayedColumns = ['ServiceId', 'GroupName', 'ServiceShortDesc', 'ServiceName', 'TariffName','IsPathology','IsRadiology','IsEditable', 'IsActive','buttons'];
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
     * @param {ServiceMasterService} _contactsService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _contactsService: ServiceMasterService,
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
        this._contactsService.onContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(contacts => {
                this.contacts = contacts;
                this.resultsLength = 100;

                this.checkboxes = {};
                contacts.map(contact => {
                    this.checkboxes[contact.id] = false;
                });
            });

        this._contactsService.onSelectedContactsChanged
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
        this._contactsService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._contactsService.deselectContacts();
            });

        this.paginator.page
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._contactsService.onPaginationChanged.next({
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

                this._contactsService.onPaginationChanged.next({
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
        this.dialogRef = this._matDialog.open(ServiceMasterFormDialogComponent, {
            maxWidth: "100vw",
            maxHeight: "100vh",
            height: "90%",
            width: "80%",
           // panelClass: 'contact-form-dialog',
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

                        this._contactsService.updateContact(formData.getRawValue());

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
                this._contactsService.deleteContact(contact);
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
        this._contactsService.toggleSelectedContact(contactId);
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


// export class FilesDataSource extends DataSource<any>
// {
//     // private _filterChange = new BehaviorSubject('');
//     // private _filteredDataChange = new BehaviorSubject('');

//     /**
//      * Constructor
//      *
//      * @param {ServiceMasterService} _contactsService
//      * @param {MatPaginator} _matPaginator
//      * @param {MatSort} _matSort
//      */
//     constructor(
//         private _contactsService: ServiceMasterService,
//         private _matPaginator: MatPaginator,
//         private _matSort: MatSort
//     ) {
//         super();

//         //this.filteredData = this._contactsService.contacts;
//     }

/**
 * Connect function called by the table to retrieve one stream containing the data to render.
 * @returns {Observable<any[]>}
 */
    // connect(): Observable<any[]> {
    //     const displayDataChanges = [
    //         // this._contactsService.onProductsChanged,
    //         this._matPaginator.page,
    //         // this._filterChange,
    //         this._matSort.sortChange
    //     ];

    // return merge(...displayDataChanges)
    //     .subscribe(data => {
    //         this._contactsService.onPaginationChanged.next({
    //             sort: this._matSort.active,
    //             dir: this._matSort.direction,
    //             index: this._matPaginator.pageIndex
    //         });
    //     });
    // .pipe(
    //     startWith({}),
    //     switchMap(() => {
    //         return this._contactsService.onPaginationChanged.next({
    //             sort: this._matSort.active,
    //             dir: this._matSort.direction,
    //             index: this._matPaginator.pageIndex
    //         });
    //     })

    // map(() => {
    //     let data = this._contactsService.contacts.slice();
    //     data = this.filterData(data);

    //     this.filteredData = [...data];

    //     data = this.sortData(data);


    //     // Grab the page's slice of data.
    //     const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;

    //     this._contactsService.onPaginationChanged.next({
    //         startIndex: startIndex,
    //         lastIndex: startIndex + this._matPaginator.pageSize
    //     });
    //     return data.splice(startIndex, this._matPaginator.pageSize);
    // }
    // );
// }

// -----------------------------------------------------------------------------------------------------
// @ Accessors
// -----------------------------------------------------------------------------------------------------

// Filtered data
// get filteredData(): any {
//     return this._filteredDataChange.value;
// }

// set filteredData(value: any) {
//     this._filteredDataChange.next(value);
// }

// Filter
// get filter(): string {
//     return this._filterChange.value;
// }

// set filter(filter: string) {
//     this._filterChange.next(filter);
// }

// -----------------------------------------------------------------------------------------------------
// @ Public methods
// -----------------------------------------------------------------------------------------------------

/**
 * Filter data
 *
 * @param data
 * @returns {any}
 */
// filterData(data): any {
//     if (!this.filter) {
//         return data;
//     }
//     return FuseUtils.filterArrayByString(data, this.filter);
// }

/**
 * Sort data
 *
 * @param data
 * @returns {any[]}
 */
// sortData(data): any[] {
//     if (!this._matSort.active || this._matSort.direction === '') {
//         return data;
//     }

//     return data.sort((a, b) => {
//         let propertyA: number | string = '';
//         let propertyB: number | string = '';

//         switch (this._matSort.active) {
//             case 'id':
//                 [propertyA, propertyB] = [a.id, b.id];
//                 break;
//             case 'ServiceName':
//                 [propertyA, propertyB] = [a.ServiceName, b.ServiceName];
//                 break;
//             case 'ServiceShortDesc':
//                 [propertyA, propertyB] = [a.ServiceShortDesc, b.ServiceShortDesc];
//                 break;
//             case 'GroupName':
//                 [propertyA, propertyB] = [a.GroupName, b.GroupName];
//                 break;
//         }

//         const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
//         const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

//         return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
//     });
// }

/**
 * Disconnect
 */
// disconnect(): void {
// }
// }
