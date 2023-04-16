import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { ServiceMaster } from 'app/main/setup/billing/service-master/service-master.model';

@Injectable()
export class ServiceMasterService implements Resolve<any>
{
    onContactsChanged: BehaviorSubject<any>;
    onSelectedContactsChanged: BehaviorSubject<any>;
    onGroupsDataChanged: BehaviorSubject<any>;
    onTraiffsDataChanged: BehaviorSubject<any>;
    onClassesDataChanged: BehaviorSubject<any>;
    onDoctorsDataChanged: BehaviorSubject<any>;

    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    onPaginationChanged: Subject<any>;

    serviceMasters: ServiceMaster[];
    groups: any;
    traiffs: any;
    classes: any;
    doctors: any;
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
        this.onGroupsDataChanged = new BehaviorSubject([]);
        this.onTraiffsDataChanged = new BehaviorSubject([]);
        this.onClassesDataChanged = new BehaviorSubject([]);
        this.onDoctorsDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
        this.onPaginationChanged = new Subject();
    }

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
                this.getContacts(),
                this.getTraiffs(),
                this.getGroups(),
                // this.getClasses(),
                this.getDoctors()
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

    getContacts(): Promise<any> {
        return new Promise((resolve, reject) => {
            //console.log(this.pageIndex, this.pageSize);
            this._httpClient.post(
                "Generic/GetByProc?procName=m_Rtrv_ServList",
                {
                    ServiceName: "%",
                    TariffId: 0,
                    GroupId: 0,
                    FirstRec: this.pageIndex * this.pageSize,
                    LastRec: (this.pageIndex + 1) * this.pageSize,
                    SortCol:'ServiceId'
                })
                .subscribe((response: any) => {
                    // const data = {
                    //     totalCount : 100,
                    //     data: []
                    // }
                    this.serviceMasters = response;
                    this.serviceMasters = this.serviceMasters.map(contact => {
                        return new ServiceMaster(contact);
                    });
                    this.onContactsChanged.next(this.serviceMasters);
                    resolve(this.serviceMasters);
                }, reject);
        }
        );
    }

    getGroups(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get("/Master/Combobox/FillMasterCombo?procedureName=RetrieveGroupMasterForCombo")
                .subscribe((groups: any) => {
                    this.groups = groups.dataSource;
                    this.onGroupsDataChanged.next(this.groups);
                    resolve(this.groups);
                }, reject);
        }
        );
    }

    getTraiffs(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get("/Master/Combobox/FillMasterCombo?procedureName=RetrieveTariffMasterForCombo")
                .subscribe((traiffs: any) => {
                    this.traiffs = traiffs.dataSource;
                    this.onTraiffsDataChanged.next(this.traiffs);
                    resolve(this.traiffs);
                }, reject);
        }
        );
    }

    getClasses(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get("/Master/Combobox/FillMasterCombo?procedureName=RetrieveDoctorMasterForCombo")
                .subscribe((classes: any) => {
                    this.classes = classes;
                    this.onContactsChanged.next(this.classes);
                    resolve(this.classes);
                }, reject);
        }
        );
    }

    getDoctors(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get("/Master/Combobox/FillMasterCombo?procedureName=RetrieveDoctorMasterForCombo")
                .subscribe((doctors: any) => {
                    this.doctors = doctors.dataSource;
                    this.onDoctorsDataChanged.next(this.doctors);
                    resolve(this.doctors);
                }, reject);
        }
        );
    }

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

    toggleSelectAll(): void {
        if (this.selectedContacts.length > 0) {
            this.deselectContacts();
        }
        else {
            this.selectContacts();
        }
    }

    selectContacts(filterParameter?, filterValue?): void {
        this.selectedContacts = [];

        // If there is no filter, select all contacts
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedContacts = [];
            this.serviceMasters.map(contact => {
                this.selectedContacts.push(contact.ServiceId.toString());
            });
        }

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    updateContact(contact): Promise<any> {
        return new Promise((resolve, reject) => {

            this._httpClient.post('api/contacts-contacts/' + contact.id, { ...contact })
                .subscribe(response => {
                    this.getContacts();
                    resolve(response);
                });
        });
    }

    deselectContacts(): void {
        this.selectedContacts = [];

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    deleteContact(contact): void {
        const contactIndex = this.serviceMasters.indexOf(contact);
        this.serviceMasters.splice(contactIndex, 1);
        this.onContactsChanged.next(this.serviceMasters);
    }

    deleteSelectedContacts(): void {
        for (const contactId of this.selectedContacts) {
            const contact = this.serviceMasters.find(_contact => {
                return _contact.ServiceId.toString() === contactId;
            });
            const contactIndex = this.serviceMasters.indexOf(contact);
            this.serviceMasters.splice(contactIndex, 1);
        }
        this.onContactsChanged.next(this.serviceMasters);
        this.deselectContacts();
    }

}
