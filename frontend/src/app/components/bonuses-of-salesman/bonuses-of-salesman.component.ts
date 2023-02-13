import {Component, OnInit} from '@angular/core';
import {BonusService} from '../../services/bonus.service';
import {Bonus} from '../../models/Bonus';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'app-bonuses-of-salesman',
    templateUrl: './bonuses-of-salesman.component.html',
    styleUrls: ['./bonuses-of-salesman.component.css']
})
export class BonusesOfSalesmanComponent implements OnInit {
    bonuses: Bonus[] = [];
    displayedColumns = ['year', 'value', 'remark', 'verified', 'salesManID', 'actions'];

    constructor(
        private bonusService: BonusService,
        private userService: UserService
    ) {
    }

    ngOnInit(): void {
        this.getBonusesBySalesManID();
    }

    getBonusesBySalesManID(): void {
        this.userService.getOwnUser()
            .subscribe((user): void => {
                this.bonusService.getBonusesBySalesManID(user._id)
                    .subscribe((bonuses): void => {
                        this.bonuses = bonuses.body;
                    });
            });
    }
}
