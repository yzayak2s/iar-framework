exports.fitsModel = async (testObject, classModel) => {
    const testObjectKeys = Object.keys(testObject);
    const modelKeys = Object.keys(new classModel());
    
    // Can't be equal if not same length
    if (testObjectKeys.length != modelKeys.length) {
        return false;
    }

    // Sort and then convert to String to compare
    if (testObjectKeys.sort().toString() != modelKeys.sort().toString()) {
        return false;
    }

    return true;
}