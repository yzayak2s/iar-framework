import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BonusService} from '../../services/bonus.service';
import {BonusComputationService} from '../../services/bonus-computation.service';
import {Bonus} from '../../models/Bonus';

@Component({
    selector: 'app-salesorder',
    templateUrl: './salesorder.component.html',
    styleUrls: ['./salesorder.component.css']
})
export class SalesorderComponent implements OnInit {
    bonus: Bonus;
    bonusComputation: any;
    displayedColumns = ['nameOfProduct', 'client', 'clientRanking', 'items', 'bonus'];

    constructor(
        private route: ActivatedRoute,
        private bonusService: BonusService,
        private bonusComputationService: BonusComputationService
    ) {
    }

    ngOnInit(): void {
        this.getOrderEvaluations();
    }

    private getOrderEvaluations(): void{
        const id = this.route.snapshot.paramMap.get('id');
        this.bonusService.getBonus(id)
            .subscribe((bonus): void => {
                this.bonus = bonus.body;
                this.bonusComputationService.getBonusComputationBySalesManIDAndYear(this.bonus.salesManID, this.bonus.year)
                    .subscribe((bonusComputation): void => {
                        this.bonusComputation = bonusComputation.body;
                    });
            });
    }

}
