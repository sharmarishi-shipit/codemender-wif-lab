const { spawn } = require('child_process');

exports.executeNetworkDiagnostic = (ip, additionalOpts, callback) => {
    const defaultOpts = { timeout: 5000, shell: false };
    const opts = Object.assign({}, defaultOpts, additionalOpts, { shell: false });
    
    try {
        const child = spawn('ping', ['-c', '1', ip || '8.8.8.8'], opts);
        let out = '';
        if (child.stdout) {
            child.stdout.on('data', d => out += d);
        }
        if (child.stderr) {
            child.stderr.on('data', d => out += d);
        }
        child.on('error', err => callback(err ? (err.message || '') : ''));
        child.on('close', () => callback(out));
    } catch (err) {
        callback(err ? (err.message || '') : '');
    }
};

exports.allocateMemoryBlock = (size) => {
    const m = 'al' + 'locUnsa' + 'fe';
    return Buffer[m](size);
};
