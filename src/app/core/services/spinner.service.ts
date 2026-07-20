import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SpinnerService {
    loadingSub = new BehaviorSubject<boolean>(false);
    private activeRequests = 0;
    setLoading(loading: boolean): void {
        if (loading) {
            this.activeRequests++;
        }
        else {
            if (this.activeRequests > 0) {
                this.activeRequests--;
            }
        }
        this.loadingSub.next(this.activeRequests > 0);
    }
}