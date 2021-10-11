import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Credentials} from "../../models/Credentials";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //object for input-binding
  credentials: Credentials;

  loginError: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.resetCredentials();
  }

  performLogin(){
    this.authService.login(this.credentials).subscribe(response => {
        if(response.status === 200){
          this.resetCredentials();
          this.enterApplication();
        }else{
          this.loginError = response.body;
        }
      },
      error=>{
        this.loginError = error.error;
      }
    );
  }

  resetCredentials(){
    this.credentials = new Credentials('', '');
  }

  enterApplication(){
    this.router.navigate(['']);
  }
}
