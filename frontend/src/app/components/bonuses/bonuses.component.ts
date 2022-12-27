import {Component, OnInit} from '@angular/core';
import {Bonus} from '../../interfaces/Bonus';
import {BonusService} from '../../services/bonus.service';
import {MessageService} from '../../services/message.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-bonuses',
    templateUrl: './bonuses.component.html',
    styleUrls: ['./bonuses.component.css']
})
export class BonusesComponent implements OnInit {
    bonuses: Bonus[] = [];

    constructor(
        private bonusService: BonusService,
        private messageService: MessageService,
        private spinnerService: NgxSpinnerService
    ) { }

    ngOnInit(): void {
        void this.spinnerService.show();
        this.getBonuses();
    }

    getBonuses(): void {
        this.bonusService.getBonuses()
            .subscribe(bonuses => {
                this.bonuses = bonuses;
                void this.spinnerService.hide();
            });
    }

    add(year: number): void {
        if (!year) { return; }
        this.bonusService.addBonus({year} as Bonus)
            .subscribe(bonus => {
                this.bonuses.push(bonus);
            });
    }

    delete(bonus: Bonus): void {
        this.bonuses = this.bonuses.filter(b => b !== bonus);
        this.bonusService.deleteBonus(bonus.id)
            .subscribe();
    }
}
