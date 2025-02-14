import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { filter, Subscription } from 'rxjs';

@Component({
    selector: 'app-error-page',
    templateUrl: './error-page.component.html',
    styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit, OnDestroy {
    @Input() errorCode: number = 404;
    @Input() errorTitle: string = "Oops...";
    @Input() errorMessage: string = "The page you requested could not be found.";
    @Input() errorImage: string = "/assets/images/404.svg";
    @Input() buttonText: string = "Go to Home";
    @Input() redirectUrl: string = "/";
    @Input() backFunction: boolean = false;
    private navigationHistory: string[] = [];
    private routerSubscription: Subscription | undefined;


    constructor(private router: Router, private location: Location) { }
    ngOnInit(): void {
        this.routerSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: any) => {
                this.navigationHistory.push(event.urlAfterRedirects);
            });
    }

    goToHome(): void {
        if (this.backFunction) {
            if (this.navigationHistory.length > 2) {
                const targetUrl = this.navigationHistory[this.navigationHistory.length - 3]; // URL 2 steps back
                this.location.go(targetUrl); // Use location.go to navigate without adding to history
                this.navigationHistory.pop(); // Remove the current URL
                this.navigationHistory.pop(); // Remove the previous URL
            } else {
                // Handle the case where there are fewer than two pages in history (e.g., redirect to home)
                this.router.navigate(['/']);
            }

        }
        this.router.navigate([this.redirectUrl]);
    }
    ngOnDestroy(): void {

    }

}
