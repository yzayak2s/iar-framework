import {Component, OnInit} from '@angular/core';
import {Bonus} from '../../interfaces/Bonus';
import {BonusService} from '../../services/bonus.service';
import {MessageService} from '../../services/message.service';

@Component({
    selector: 'app-bonuses',
    templateUrl: './bonuses.component.html',
    styleUrls: ['./bonuses.component.css']
})
export class BonusesComponent implements OnInit {
    bonuses: Bonus[] = [];

    constructor(
        private bonusService: BonusService,
        private messageService: MessageService
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

    add(year: number): void {
        if (!year) { return; }
        this.bonusService.addBonus({year} as Bonus)
            .subscribe(bonus => {
                this.bonuses.push(bonus);
            });
    }
}
