import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-table-search-bar',
    templateUrl: './table-search-bar.component.html',
    styleUrls: ['./table-search-bar.component.scss']
})
export class TableSearchBarComponent implements OnInit, OnDestroy {

    @Output() onClearEvent = new EventEmitter<void>();
    @Output() onBindGridDataEvent = new EventEmitter<void>();
    constructor() { }
    ngOnInit(): void {

    }
    ngOnDestroy(): void {

    }
    onClear(): void {
        this.onClearEvent.emit();
    }
    bindGridData(): void {
        this.onBindGridDataEvent.emit();
    }
}   
