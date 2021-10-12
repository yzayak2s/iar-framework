import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {LandingPageComponent} from "./pages/landing-page/landing-page.component";
import {AuthGuardService} from "./services/auth-guard.service";
import {ExamplePageComponent} from "./pages/example-page/example-page.component";

const routes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {path: 'example', component: ExamplePageComponent, canActivate: [AuthGuardService]},
  {path: '', component: LandingPageComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRouting { }
