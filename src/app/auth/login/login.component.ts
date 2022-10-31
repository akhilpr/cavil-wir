import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  btnLabel = true;
  vaildUser = true;
  constructor(public loginService: LoginService,
    private router: Router,
    private fb: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

  }

  logiForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    password: ['', Validators.required],
  }
  )

  setBntLabel() {
    this.btnLabel = !this.btnLabel;
  }
  submit() {
    if (this.logiForm.valid) { // validates users
      if (this.btnLabel) {
        this.loginService.validateLogin(this.logiForm.value).subscribe((res: any) => {
          if (res.token) {
            localStorage.setItem('tokken', res.token.toString());
            this.router.navigate(['/dashboard']);
          }
        }, err => this.vaildUser = false);
      } else {
        this.loginService.createUser(this.logiForm.value).subscribe(_ => {
          this.openSnackBar('Success!')
          this.logiForm.setValue({ email: '', password  : '' })
          this.btnLabel = true;
        }, err => this.vaildUser = false);
      }

    }
  }

  openSnackBar(msg: string) {
    this._snackBar.open(msg, 'Ok', {
      duration: 5 * 1000,
    });
  }
}
