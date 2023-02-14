import {Component, OnInit} from '@angular/core';
import {Bonus} from '../../models/Bonus';
import {ActivatedRoute} from '@angular/router';
import {BonusService} from '../../services/bonus.service';
import {Location} from '@angular/common';
import {UserService} from '../../services/user.service';
import {User} from '../../models/User';

@Component({
    selector: 'app-bonus-detail',
    templateUrl: './bonus-detail.component.html',
    styleUrls: ['./bonus-detail.component.css']
})
export class BonusDetailComponent implements OnInit {
    bonus: Bonus | undefined;
    user: User;
    allowedWrite = false;

    constructor(
        private route: ActivatedRoute,
        private bonusService: BonusService,
        private location: Location,
        private userService: UserService
    ) {
    }

    ngOnInit(): void {
        this.getBonus();
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
            if (user.role === 'CEO' || user.isAdmin) {
                this.allowedWrite = true;
            }
        });
    }

    getBonus(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.bonusService.getBonus(id)
            .subscribe((bonus): Bonus => this.bonus = bonus.body);
    }

    goBack(): void {
        this.location.back();
    }

    approveBonus(): void {
        if (this.bonus.remark === '') {
        } else if (confirm(`Are you sure to ${this.user.role !== 'SALESMAN' ? 'approve' : 'accept'} this bonus?`)) {
            switch (this.bonus.verified.toUpperCase()) {
            case 'CALCULATED':
                this.bonus.verified = 'APPROVEDCEO';
                break;
            case 'APPROVEDCEO':
                this.bonus.verified = 'APPROVEDHR';
                break;
            case 'APPROVEDHR':
                this.bonus.verified = 'ACCEPTED';
                break;
            default:
                break;
            }

            if (this.bonus) {
                switch (this.user.role) {
                case 'CEO':
                    this.bonusService.updateBonusRemark(this.bonus)
                        .subscribe();
                    this.bonusService.updateBonusStatus(this.bonus)
                        .subscribe((): void => this.goBack());
                    break;
                case 'HR':
                    this.bonusService.updateBonusStatus(this.bonus)
                        .subscribe((): void => this.goBack());
                    break;
                case 'SALESMAN':
                    this.bonusService.updateBonusStatus(this.bonus)
                        .subscribe((): void => this.goBack());
                    this.bonusService.createBonusInOrangeHRM(this.bonus)
                        .subscribe();
                    break;
                default:
                    break;

                }
            }
        }
    }

    rejectBonus(): void {
        if (this.bonus.remark === '') {
        } else if (confirm('You are going to reject this bonus.\nAre you sure?')) {
            switch (this.bonus.verified.toUpperCase()) {
            case 'CALCULATED':
                this.bonus.verified = 'REJECTEDCEO';
                break;
            case 'APPROVEDCEO':
                this.bonus.verified = 'REJECTEDHR';
                break;
            case 'APPROVEDHR':
                this.bonus.verified = 'REJECTED';
                break;
            default:
                break;
            }

            console.log('Rejected!');

            if (this.bonus) {
                switch (this.user.role) {
                case 'CEO':
                    this.bonusService.updateBonusRemark(this.bonus)
                        .subscribe();
                    this.bonusService.updateBonusStatus(this.bonus)
                        .subscribe((): void => this.goBack());
                    break;
                case 'HR':
                    this.bonusService.updateBonusStatus(this.bonus)
                        .subscribe((): void => this.goBack());
                    break;
                case 'SALESMAN':
                    this.bonusService.updateBonusStatus(this.bonus)
                        .subscribe((): void => this.goBack());
                    this.bonusService.createBonusInOrangeHRM(this.bonus)
                        .subscribe();
                    break;
                default:
                    break;

                }
            }
            /* if (this.bonus) {
                    this.bonusService.updateBonus(this.bonus)
                        .subscribe((): void => this.goBack());
                }*/
        }
    }

    checkApprover(userRole: string, verified: string): boolean {
        switch (userRole) {
        case 'CEO':
            return verified !== 'CALCULATED';
        case 'HR':
            return verified !== 'APPROVEDCEO';
        case 'SALESMAN':
            return verified !== 'APPROVEDHR';
        }
        return true;
    }
}
