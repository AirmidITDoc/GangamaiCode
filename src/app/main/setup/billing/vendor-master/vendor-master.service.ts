import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { ServiceMaster } from './vendor-master.model';


@Injectable()
export class GroupMasterService implements Resolve<any>
{
    onContactsChanged: BehaviorSubject<any>;
    onSelectedContactsChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    onPaginationChanged: Subject<any>;

    groupMasters: ServiceMaster[];
    user: any;
    selectedContacts: string[] = [];

    searchText: string;
    filterBy: string;
    pageIndex: any = 0;
    sort: any;
    sortBy: any;
    pageSize: any = 10;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onContactsChanged = new BehaviorSubject([]);
        this.onSelectedContactsChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
        this.onPaginationChanged = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getContacts()
            ]).then(() => {
                //on searchtext change
                this.onSearchTextChanged.subscribe(searchText => {
                    this.searchText = searchText;
                    this.getContacts();
                });
                //on filter (all) change
                this.onFilterChanged.subscribe(filter => {
                    this.filterBy = filter;
                    this.getContacts();
                });
                //on page and sort change
                this.onPaginationChanged.subscribe(pagination => {
                    const { sort, pageIndex, sortBy, pageSize } = pagination;
                    this.sort = sort;
                    this.pageIndex = pageIndex;
                    this.sortBy = sortBy;
                    this.pageSize = pageSize;
                    this.getContacts();
                });

                resolve();

            },
                reject
            );
        });
    }

    /**
     * Get contacts
     *
     * @returns {Promise<any>}
     */
    getContacts(): Promise<any> {
        return new Promise((resolve, reject) => {
            //console.log(this.pageIndex, this.pageSize);
            this._httpClient.post(
                "Generic/GetByProc?procName=Rtrv_M_VendorMasterList_by_Name",
                {
                    VendorName: "%",
                    FirstRec: (this.pageIndex * this.pageSize) + 1,
                    LastRec: (this.pageIndex + 1) * this.pageSize,
                })
                .subscribe((response: any) => {
                    // const data = {
                    //     totalCount : 100,
                    //     data: []
                    // }
                    this.groupMasters = response;
                    this.groupMasters = this.groupMasters.map(contact => {
                        return new ServiceMaster(contact);
                    });
                    this.onContactsChanged.next(this.groupMasters);
                    resolve(this.groupMasters);
                }, reject);
        }
        );
    }

    /**
     * Toggle selected contact by id
     *
     * @param id
     */
    toggleSelectedContact(id): void {
        // First, check if we already have that contact as selected...
        if (this.selectedContacts.length > 0) {
            const index = this.selectedContacts.indexOf(id);

            if (index !== -1) {
                this.selectedContacts.splice(index, 1);

                // Trigger the next event
                this.onSelectedContactsChanged.next(this.selectedContacts);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedContacts.push(id);

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void {
        if (this.selectedContacts.length > 0) {
            this.deselectContacts();
        }
        else {
            this.selectContacts();
        }
    }

    /**
     * Select contacts
     *
     * @param filterParameter
     * @param filterValue
     */
    selectContacts(filterParameter?, filterValue?): void {
        this.selectedContacts = [];

        // If there is no filter, select all contacts
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedContacts = [];
            this.groupMasters.map(contact => {
                this.selectedContacts.push(contact.BankId.toString());
            });
        }

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    /**
     * Update contact
     *
     * @param contact
     * @returns {Promise<any>}
     */
    updateContact(contact): Promise<any> {
        return new Promise((resolve, reject) => {

            this._httpClient.post('api/contacts-contacts/' + contact.id, { ...contact })
                .subscribe(response => {
                    this.getContacts();
                    resolve(response);
                });
        });
    }

    /**
     * Update user data
     *
     * @param userData
     * @returns {Promise<any>}
     */
    updateUserData(userData): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/contacts-user/' + this.user.id, { ...userData })
                .subscribe(response => {
                    // this.getUserData();
                    this.getContacts();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect contacts
     */
    deselectContacts(): void {
        this.selectedContacts = [];

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    /**
     * Delete contact
     *
     * @param contact
     */
    deleteContact(contact): void {
        const contactIndex = this.groupMasters.indexOf(contact);
        this.groupMasters.splice(contactIndex, 1);
        this.onContactsChanged.next(this.groupMasters);
    }

    /**
     * Delete selected contacts
     */
    // deleteSelectedContacts(): void {
    //     for (const contactId of this.selectedContacts) {
    //         const contact = this.groupMasters.find(_contact => {
    //             return _contact.ServiceId.toString() === contactId;
    //         });
    //         const contactIndex = this.groupMasters.indexOf(contact);
    //         this.groupMasters.splice(contactIndex, 1);
    //     }
    //     this.onContactsChanged.next(this.groupMasters);
    //     this.deselectContacts();
    // }

}
