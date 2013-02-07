function createPromise(success, error) {
    return {
        done: success,
        success: success,
        error: error
    };
}
