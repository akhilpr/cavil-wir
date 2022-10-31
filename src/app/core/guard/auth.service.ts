import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    loggedInStatus = localStorage.getItem('tokken') || ('false');

    setLoginStatus(value: any) {
        this.loggedInStatus = value;
        localStorage.setItem('tokken', value.toString());
    }

    get LoginStatus() {
        return localStorage.getItem('tokken') ? true : false;
    }


}
