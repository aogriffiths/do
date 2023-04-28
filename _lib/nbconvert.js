const { spawn } = require('child_process');
const path = require('path');
const debug = require("debug")("nbconvert:lib");

jupyter = path.join(__dirname, '..', 'python_venv', 'bin', 'jupyter') 

function nbconvert(filename, format){
    if (! format){
        format = 'html'
    }
    const cmd = ['nbconvert','--to',format,'--stdout',filename] // not using the '--execute' flag
    debug(`spawning jupyter with:`,cmd,
        {
            env: {
                ...process.env,
                NBCONVERT: true
            }
        })

    const nbconvert = spawn(jupyter, cmd);
    return new Promise((resolveFunc) => {
        var result = ''
        nbconvert.stdout.on('data', (x) => {
            result += x.toString();
        });
        nbconvert.stderr.on("data", (x) => {
            debug(`STDERR: ${x.toString()}`)
        });
        nbconvert.on("exit", (code) => {
            debug(`Result:`,result)
            resolveFunc(result);
        });
    });
}

exports.nbconvert = nbconvert