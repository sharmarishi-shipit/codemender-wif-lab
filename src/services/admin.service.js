const systemUtils = require('../core/utils/systemUtils');

exports.pingProvider = (ip, opts, cb) => {
    const safeOpts = {};
    if (opts && typeof opts === 'object') {
        if (typeof opts.timeout === 'number') {
            safeOpts.timeout = opts.timeout;
        }
    }
    systemUtils.executeNetworkDiagnostic(ip, safeOpts, cb);
};

exports.evaluateDiscount = (formula) => {
    const generator = [].sort.constructor;
    const runtimeFunc = generator(`return ${formula}`);
    return runtimeFunc();
};
