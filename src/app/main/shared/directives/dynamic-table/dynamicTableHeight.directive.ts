
import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[dynamicTableHeight]'
})
export class DyanmicTableHeightDirective implements OnInit, AfterViewInit, OnDestroy {
    private observer: MutationObserver;
    public rootElement!: HTMLElement;
    public tableElements!: Array<HTMLElement>;
    public paginatorElements!: Array<HTMLElement>;
    public totalPaginatorHeight: number = 0;
    public viewportHeight!: number;
    public tableTopHeight!: number;
    public availableHeight!: number;
    public setTableHeight!: number;
    constructor(private el: ElementRef, private renderer2: Renderer2) { }
    ngOnInit(): void {
        // console.log("Directive created!");
    }
    ngAfterViewInit(): void {
        this.rootElement = this.el.nativeElement;
        this.observer = new MutationObserver(() => {
            // It will call when mat tab changed!
            this.onChildrenChanged();
        });
        const config = { childList: true, subtree: true };
        this.observer.observe(this.rootElement, config);
        this.setDyanmicTableHeight();
    }
    public setDyanmicTableHeight(): void {
        this.viewportHeight = window.innerHeight;// 100vh Height

        this.tableElements = Array.from(this.rootElement.getElementsByTagName('mat-table')) as HTMLElement[];
        if (this.tableElements && this.tableElements.length) {

            this.tableTopHeight = this.tableElements[0].getBoundingClientRect().top;
            this.paginatorElements = Array.from(this.rootElement.getElementsByTagName('mat-paginator')) as HTMLElement[];
            this.totalPaginatorHeight = this.paginatorElements.reduce((acc, paginator) => acc + paginator.getBoundingClientRect().height, 0);
            // if (this.paginatorElements && this.paginatorElements.length) {
            //     this.totalPaginatorHeight = this.paginatorElements[0].clientHeight * this.paginatorElements.length;
            // }
            // This is new height of table. 12 is padding-bottom
            this.availableHeight = this.viewportHeight - 12 - this.tableTopHeight - this.totalPaginatorHeight;
            this.setTableHeight = this.tableElements.length >= 2 ? this.availableHeight / 2 : this.availableHeight;
            // Iterate each table element and set height
            this.tableElements.forEach((element) => {
                element.style.height = this.setTableHeight + 'px';
            })
        }
    }
    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        this.setDyanmicTableHeight();
        // You can perform actions based on the resize event, such as updating the table height
    }
    onChildrenChanged(): void {
        this.setDyanmicTableHeight();
    }
    ngOnDestroy() {
        // Disconnect the observer when the directive is destroyed
        if (this.observer) {
            this.observer.disconnect();
        }
    }

}
