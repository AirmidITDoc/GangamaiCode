import { Component, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from "app/core/notification.service";
import { ChangePasswordComponent } from 'app/main/administration/create-user/change-password/change-password.component';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
@Component({
    selector: 'quick-panel',
    templateUrl: './quick-panel.component.html',
    styleUrls: ['./quick-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QuickPanelComponent {
    date: Date;
    events: any[];
    notes: any[];
    settings: any;
    dbInfo: any;   // declare variable
    // isPanelOpen = true;
    /**
     * Constructor
     */
    constructor(
        private accountService: AuthenticationService,
        private _fuseSidebarService: FuseSidebarService,
        public _matDialog: MatDialog,
        public _notificationService: NotificationService
    ) {
        // Set the defaults
        this.date = new Date();
        this.settings = {
            notify: true,
            cloud: false,
            retro: true
        };
    }

    ngOnInit() {
        this.accountService.getDBInfo().subscribe((data) => {
            this.dbInfo = data;
        });
    }

    getOrdinalSuffix(currentDate: Date): string {
        const day = currentDate ? currentDate.getDate() : 0;
        if (day >= 11 && day <= 13) {
            return 'th';
        }
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    logout() {
        this.accountService.logout().subscribe((data) => { });
    }

    Changepassword() {
        const dialogRef = this._matDialog.open(ChangePasswordComponent,
            {
                // maxWidth: "60vw",
                // maxHeight: "80vh", width: '100%', height: "100%"                               
                maxWidth: "50vw",
                maxHeight: '50%',
                width: '40%',
            });
        dialogRef.afterClosed().subscribe(result => {

        });

    }

    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }


}
