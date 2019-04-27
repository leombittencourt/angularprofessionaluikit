import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidator } from 'src/app/validators/custom.validator';
import { Security } from 'src/app/utils/security.util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent implements OnInit {
  public form: FormGroup;
  public busy = false;

  constructor(private router: Router,private service: DataService, private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', Validators.compose([
        Validators.minLength(14),
        Validators.maxLength(14),
        Validators.required,
        CustomValidator.isCpf()
      ])],
      password: ['', Validators.compose([
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.required
      ])]
    });
  }

  ngOnInit() {
    const token = Security.getToken();
    if (token) {
      this.busy = true;
      this.service
      .refreshToken()
      .subscribe(
        (data: any) => {
          this.busy = false;
          this.setUser(data.customer, data.token);
        },
        (err) => {
          Security.clear();
          this.busy = false;
        }
      );
    }
  }

  submit() {
    this.service
      .authenticate(this.form.value)
      .subscribe(
        (data: any) => {
        this.setUser(data.customer, data.token);
      }, (err) => {
        console.log(err);
      }
    );
  }

  setUser(user, token) {
    Security.set(user, token);
    this.router.navigate(['/']);
  }

}
