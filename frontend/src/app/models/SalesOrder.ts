/**
 * this model specifies the format to exchange a user with the backend
 */
export class SalesOrder{
    public contractType: string;
    public salesOrderUID: string;
    public customerUID: string;
    public salesRep: string;
    public createdAt: string;
    public priority: string;
    public contractNumber: string;
    public totalTaxAmount: string;
    public totalBaseAmount: string;
    public totalAmountIncludingTax: string;
}
