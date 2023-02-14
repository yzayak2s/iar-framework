

/**
 * Created by oukha on 04/12/2022
 */


import {Component, OnInit} from '@angular/core';
import {User} from '../../models/User';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
    currentUser: User;
    photo: string;

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.userService.getOwnUser().subscribe((user): void => {
            this.currentUser = user;
            this.userService.getUserPhoto(this.currentUser._id)
                .subscribe((photoBase64): void => {
                    this.photo = `data:image/png;base64,${photoBase64.body.base64}`;
                });
        });
    }
}
