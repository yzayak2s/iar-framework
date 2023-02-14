export const displayStatus = (verified: string): string => {
    switch (verified.toUpperCase()) {
    case 'CALCULATED':
        return 'Calculated';
    case 'APPROVEDCEO':
        return 'Approved by CEO';
    case 'APPROVEDHR':
        return 'Approved by HR';
    case 'ACCEPTED':
        return 'Accepted';
    case 'REJECTEDCEO':
        return 'Rejected by CEO';
    case 'REJECTEDHR':
        return 'Rejected by HR';
    case 'REJECTED':
        return 'Rejected';
    default:
        return '';
    }
};
