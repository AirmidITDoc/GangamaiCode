import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseMatchMediaService } from '@fuse/services/match-media.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { RoleTemplateService } from 'app/main/administration/role-template-master/role-template.service';

@Component({
    selector: 'fuse-shortcuts',
    templateUrl: './shortcuts.component.html',
    styleUrls: ['./shortcuts.component.scss']
})
export class FuseShortcutsComponent implements OnInit, AfterViewInit, OnDestroy {
    shortcutItems: any[];
    filteredShortcutItems: any[];
    mobileShortcutsPanelActive: boolean;
    @Input() navigation: any;
    @ViewChild('searchInput') searchInputField;
    @ViewChild('shortcuts') shortcutsEl: ElementRef;
    private _unsubscribeAll: Subject<any>;
    constructor(
        private _fuseMatchMediaService: FuseMatchMediaService,
        private _mediaObserver: MediaObserver,
        private _renderer: Renderer2,
        private _authService: RoleTemplateService
    ) {
        this.shortcutItems = [];
        this.mobileShortcutsPanelActive = false;
        this._unsubscribeAll = new Subject();
    }

    getFavList() {
        return this.shortcutItems.filter(x => x.isFavourite);
    }
    ngOnInit(): void {
        if ((JSON.parse(localStorage.getItem("currentUser"))?.user?.webRoleId ?? 0) > 0) {
            this._authService.getFavMenus(JSON.parse(localStorage.getItem("currentUser")).user.webRoleId, JSON.parse(localStorage.getItem("currentUser")).user.id).subscribe((Menu) => {
                this.shortcutItems = Menu as any[];
                this.filteredShortcutItems = this.shortcutItems;
            });
        }
    }
    ngAfterViewInit(): void {
        // Subscribe to media changes
        this._fuseMatchMediaService.onMediaChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                if (this._mediaObserver.isActive('gt-sm')) {
                    this.hideMobileShortcutsPanel();
                }
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(true);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Search
     *
     * @param event
     */
    search(event): void {
        const value = event.target.value.toLowerCase();
        if (value === '') {
            this.filteredShortcutItems = this.shortcutItems;
            return;
        }
        this.filteredShortcutItems = this.shortcutItems.filter((navigationItem) => {
            return navigationItem.linkName.toLowerCase().includes(value);
        });
    }
    toggleShortcut(event, itemToToggle): void {
        event.stopPropagation();
        var data = { UserId: itemToToggle.userId, MenuId: itemToToggle.menuId };
        this._authService.setFavMenus(data).subscribe((data) => {
            itemToToggle.isFavourite = !itemToToggle.isFavourite;
        });

    }

    /**
     * Is in shortcuts?
     *
     * @param navigationItem
     * @returns {any}
     */
    isInShortcuts(navigationItem): any {
        return this.shortcutItems.find(item => {
            return item.url === navigationItem.url;
        });
    }

    /**
     * On menu open
     */
    onMenuOpen(): void {
        setTimeout(() => {
            this.searchInputField.nativeElement.focus();
        });
    }

    /**
     * Show mobile shortcuts
     */
    showMobileShortcutsPanel(): void {
        this.mobileShortcutsPanelActive = true;
        this._renderer.addClass(this.shortcutsEl.nativeElement, 'show-mobile-panel');
    }

    /**
     * Hide mobile shortcuts
     */
    hideMobileShortcutsPanel(): void {
        this.mobileShortcutsPanelActive = false;
        this._renderer.removeClass(this.shortcutsEl.nativeElement, 'show-mobile-panel');
    }
}
