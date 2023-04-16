import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderState } from '../models/LoaderState';

@Injectable({
    providedIn: 'root'
})
export class SpinnerService {

    private loaderSubject = new Subject<LoaderState>();
    loaderState = this.loaderSubject.asObservable();
    spinner = new Subject<any>();

    constructor() { }

    show() {
        this.loaderSubject.next(<LoaderState>{ show: true });
        this.spinner.next('show');
    }

    hide() {
        this.loaderSubject.next(<LoaderState>{ show: false });
        this.spinner.next('hide');
    }
}