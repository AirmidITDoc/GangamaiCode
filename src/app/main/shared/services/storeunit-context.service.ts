import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StoreUnitContext } from '../model/storeunit.model';

const STORAGE_KEY = 'STORE_UNIT_CONTEXT';

@Injectable({ providedIn: 'root' })
export class StoreUnitContextService {

  private contextSubject = new BehaviorSubject<StoreUnitContext | null>(
    JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
  );

  context$ = this.contextSubject.asObservable();

  setContext(context: StoreUnitContext) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
    this.contextSubject.next(context);
  }

  getContext(): StoreUnitContext | null {
    return this.contextSubject.value;
  }

  clear() {
    localStorage.removeItem(STORAGE_KEY);
    this.contextSubject.next(null);
  }
}
