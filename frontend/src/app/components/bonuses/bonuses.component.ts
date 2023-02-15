import {Component, OnInit} from '@angular/core';
import {Bonus} from '../../models/Bonus';
import {BonusService} from '../../services/bonus.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {BonusComputationService} from '../../services/bonus-computation.service';
import {displayStatus} from '../../helper/displayStatus';

@Component({
    selector: 'app-bonuses',
    templateUrl: './bonuses.component.html',
    styleUrls: ['./bonuses.component.css']
})
export class BonusesComponent implements OnInit {
    bonuses: Bonus[] = [];
    currentYear: number = new Date().getFullYear();
    years: number[] = Array.from(Array(8).keys()).map((x): number => this.currentYear - x);
    displayedColumns = ['year', 'value', 'remark', 'verified', 'salesManID', 'actions'];
    displayStatus = displayStatus;

    constructor(
        private bonusService: BonusService,
        private bonusComputationService: BonusComputationService,
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

    calculate(bonus: Bonus): void {
        if (confirm('Are you sure to recalculate this bonus?\nYour remark will be lost!')) {
            this.bonusComputationService.calculateBonus(bonus)
                .subscribe((): void => {
                    this.getBonuses();
                });

        }
    }

    calculateAll(year: number): void {
        if (confirm('Are you sure to calculate all bonuses?\nYour remarks will be lost!')) {
            this.bonusComputationService.calculateAllBonuses(year)
                .subscribe((): void => {
                    this.getBonuses();
                });
        }
    }

    delete(bonus: Bonus): void {
        if (confirm('Are you sure to delete this bonus?')) {
            this.bonuses = this.bonuses.filter((b): boolean => b !== bonus);
            this.bonusService.deleteBonus(bonus._id)
                .subscribe();
        }
    }
}
