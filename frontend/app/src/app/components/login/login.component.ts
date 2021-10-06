import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //variables for input-binding
  email:string = '';
  password:string = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  performLogin(){

  }
}
