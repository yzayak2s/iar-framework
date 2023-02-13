/**
 * this model specifies the format to exchange bonus-calculations
 */
export class Bonus_calc {
    constructor(
        public _id: string,
        public year: number,
        public salesManID: number,
        public totalBonus: number,
        public orderBonus: any,
        public perfBonus: any,
    ) {  }
}
