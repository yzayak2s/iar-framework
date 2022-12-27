import {Component, OnInit} from '@angular/core';
import {Bonus} from '../../interfaces/Bonus';
import {BonusService} from '../../services/bonus.service';

@Component({
    selector: 'app-bonuses',
    templateUrl: './bonuses.component.html',
    styleUrls: ['./bonuses.component.css']
})
export class BonusesComponent implements OnInit {
    bonuses: Bonus[] = [];

    constructor(
        private bonusService: BonusService
    ) { }

    ngOnInit(): void {
        this.getBonuses();
    }

    getBonuses(): void {
        this.bonusService.getBonuses()
            .subscribe(bonuses => {
                this.bonuses = bonuses;
            });
    }
}
