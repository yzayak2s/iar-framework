/**
 * this model specifies the format to exchange an evaluation record
 */
export class EvaluationRecord{
    constructor(
        public _id: number,
        public goalDescription: string,
        public targetValue: string,
        public actualValue: string,
        public year: string,
        public salesManID: string
    ) {  }
}
