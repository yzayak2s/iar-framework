import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  buttons = [
    {title: 'Welcome', routerLink: ''},
    {title: 'Example', routerLink: 'example'},
  ];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  handleLogout(){
    this.authService.logout().subscribe();
    this.router.navigate(['login']);
  }

}
