import {Component, OnInit} from '@angular/core';
import {Bonus} from '../../models/Bonus';
import {BonusService} from '../../services/bonus.service';
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
        private spinnerService: NgxSpinnerService
    ) { }

    ngOnInit(): void {
        void this.spinnerService.show();
        this.getBonuses();
    }

    getBonuses(): void {
        this.bonusService.getBonuses()
            .subscribe((bonuses): void => {
                this.bonuses = bonuses.body;
                setTimeout((): void => {
                    /** spinner ends after 500 milliseconds */
                    void this.spinnerService.hide();
                }, 500);
            });
    }

    add(year: number): void {
        if (!year) { return; }
        this.bonusService.addBonus({year} as Bonus)
            .subscribe((bonus): void => {
                this.bonuses.push(bonus);
            });
    }

    delete(bonus: Bonus): void {
        this.bonuses = this.bonuses.filter((b): boolean => b !== bonus);
        this.bonusService.deleteBonus(bonus.id)
            .subscribe();
    }
}
