import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

    constructor(private router: Router) { }
    ngOnInit(): void { }

    goToHome(): void {
        this.router.navigate([this.redirectUrl]);
    }
    ngOnDestroy(): void {

    }

}
