import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ApiCaller } from 'app/core/services/apiCaller';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
    selector: "airmid-autocomplete",
    templateUrl: "./airmid-autocomplete.component.html",
    styleUrls: ["./airmid-autocomplete.component.scss"],
})
export class AirmidAutocompleteComponent implements OnInit {
    @Input() options: any[] = [];
    @Input() mode: string;
    @Output() selectDdlObject = new EventEmitter<any>();
    apiUrl: string = "Dropdown/GetBindDropDown?mode=";
    
    constructor(private _httpClient: ApiCaller) {}

    protected ddls: any[] = [];
    public ddlCtrl: FormControl = new FormControl();
    public ddlFilterCtrl: FormControl = new FormControl();
    public filteredDdls: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    @ViewChild("singleSelect", { static: true }) singleSelect: MatSelect;
    protected _onDestroy = new Subject<void>();

    ngOnInit() {
        this.bindGridAutoComplete();
        // listen for search field value changes
        this.ddlFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterDdls();
            });
    }
    bindGridAutoComplete() {
        if (this.options?.length > 0) {
            this.ddls = this.options as [];
            this.ddlCtrl.setValue(this.ddls[10]);
            this.filteredDdls.next(this.ddls.slice());
        } else {
            this._httpClient
                .GetData(this.apiUrl + this.mode)
                .subscribe((data: any) => {
                    this.ddls = data as [];
                    this.ddlCtrl.setValue(this.ddls[10]);
                    this.filteredDdls.next(this.ddls.slice());
                });
        }
    }
    ngAfterViewInit() {
        this.setInitialValue();
    }
    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
    protected setInitialValue() {
        this.filteredDdls
            .pipe(take(1), takeUntil(this._onDestroy))
            .subscribe(() => {
                this.singleSelect.compareWith = (a: any, b: any) =>
                    a && b && a.id === b.id;
            });
    }
    protected filterDdls() {
        if (!this.ddls) {
            return;
        }
        let search = this.ddlFilterCtrl.value;
        if (!search) {
            this.filteredDdls.next(this.ddls.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filteredDdls.next(
            this.ddls.filter(
                (ddl) => ddl.text.toLowerCase().indexOf(search) > -1
            )
        );
    }
    public onDdlChange($event){
        this.selectDdlObject.emit($event.value);
    }
}
