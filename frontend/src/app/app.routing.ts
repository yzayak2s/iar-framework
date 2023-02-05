import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {AuthGuardService} from './services/auth-guard.service';
import {ExamplePageComponent} from './pages/example-page/example-page.component';
import {NotFoundPageComponent} from './pages/not-found-page/not-found-page.component';
import {SalesManComponent} from './components/sales-man/sales-man.component';
import {EvaluationRecordComponent} from './components/evaluation-record/evaluation-record.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {BonusPageComponent} from './pages/bonus-page/bonus-page.component';
import {BonusDetailComponent} from './components/bonus-detail/bonus-detail.component';

const ROLES = {CEO: 'CEO', HR: 'HR', SALESMAN: 'SALESMAN'};

/*
  This array holds the relation of paths and components which angular router should resolve.

  If you want add a new page with a separate path/subdirectory you should register it here.
  It is also possible to read parameters from the path they have to be specified with ':' in the path.

  If a new page should also show up in the menu bar, you need to add it there too.
  Look at: frontend/src/app/components/menu-bar/menu-bar.component.ts
 */
const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginPageComponent},
    {path: 'dashboard', component: DashboardComponent,
        canActivate: [AuthGuardService], data: {roles: [ROLES.CEO, ROLES.HR, ROLES.SALESMAN]}},
    {path: 'salesman', component: SalesManComponent,
        canActivate: [AuthGuardService], data: {roles: [ROLES.CEO, ROLES.HR]}},
    {path: 'evaluationrecord', component: EvaluationRecordComponent,
        canActivate: [AuthGuardService], data: {roles: [ROLES.CEO, ROLES.HR]}},
    {path: 'bonus', component: BonusPageComponent,
        canActivate: [AuthGuardService], data: {roles: [ROLES.CEO, ROLES.HR]}},
    {path: 'bonuses/detail/:id', component: BonusDetailComponent,
        canActivate: [AuthGuardService], data: {roles: [ROLES.CEO, ROLES.HR, ROLES.SALESMAN]}},
    {path: 'example', component: ExamplePageComponent,
        canActivate: [AuthGuardService], data: {roles: [ROLES.CEO, ROLES.HR, ROLES.SALESMAN]}},
    {path: '**', component: NotFoundPageComponent} // these entries are matched from top to bottom => not found should be the last entry
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
