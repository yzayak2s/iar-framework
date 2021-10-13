import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {User} from "../../models/User";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  user:User;

  buttons = [
    {title: 'Welcome', routerLink: ''},
    {title: 'Example', routerLink: 'example'},
  ];

  constructor(private authService: AuthService, private router: Router, private userService:UserService) { }

  ngOnInit(): void {
    this.fetchUser();
  }

  handleLogout(){
    this.authService.logout().subscribe();
    this.router.navigate(['login']);
  }

  fetchUser(){
    this.userService.getOwnUser().subscribe(user => {
      this.user = user
    });
  }
}
