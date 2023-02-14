import {Component, OnInit} from '@angular/core';
import {Bonus} from '../../models/Bonus';
import {ActivatedRoute} from '@angular/router';
import {BonusService} from '../../services/bonus.service';
import {BonusComputationService} from '../../services/bonus-computation.service';

@Component({
    selector: 'app-evaluationrecord',
    templateUrl: './evaluationrecord.component.html',
    styleUrls: ['./evaluationrecord.component.css']
})
export class EvaluationrecordComponent implements OnInit {
    bonus: Bonus;
    bonusComputation: any;
    displayedColumns = ['goalDescription', 'targetValue', 'actualValue', 'bonus'];

    constructor(
        private route: ActivatedRoute,
        private bonusService: BonusService,
        private bonusComputationService: BonusComputationService
    ) {
    }

    ngOnInit(): void {
        this.getEvaluationRecords();
    }

    private getEvaluationRecords(): void {
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
