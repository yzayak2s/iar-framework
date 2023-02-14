import {Component, OnInit} from '@angular/core';
import {Bonus} from '../../models/Bonus';
import {ActivatedRoute} from '@angular/router';
import {BonusService} from '../../services/bonus.service';
import {Location} from '@angular/common';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'app-bonus-detail',
    templateUrl: './bonus-detail.component.html',
    styleUrls: ['./bonus-detail.component.css']
})
export class BonusDetailComponent implements OnInit {
    bonus: Bonus | undefined;
    allowedWrite = false;

    constructor(
        private route: ActivatedRoute,
        private bonusService: BonusService,
        private location: Location,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.getBonus();
        this.userService.getOwnUser().subscribe((user): void => {
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

    save(): void {
        if (this.bonus) {
            this.bonusService.updateBonus(this.bonus)
                .subscribe((): void => this.goBack());
        }
    }
}
