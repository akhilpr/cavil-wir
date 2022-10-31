import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Injectable()
export class RequestIntercepter implements HttpInterceptor {
    constructor(private ngxLoader: NgxUiLoaderService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        this.ngxLoader.start();

        return next.handle(request).pipe(
            finalize(() => this.ngxLoader.stop()),
        );
    }
}