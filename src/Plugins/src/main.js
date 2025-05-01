// const csInterface = typeof CSInterface !== 'undefined' ? new CSInterface() : {
//     evalScript: (script, callback) => console.log('Mock evalScript:', script)
// };

csInterface = new CSInterface();
if (typeof csInterface.request === 'function') {
    // Code using csInterface.request
  } else {
    console.error("csInterface.request is not a function");
    console.log(csInterface);
  }


async function fetchWithRetry(url, options, retries = 7, delay = 15000) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Attempting fetch ${i + 1}/${retries} to ${url}`);
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, StatusText: ${response.statusText}, Response: ${errorText}`);
            }
            return await response.json();
        } catch (err) {
            console.error(`Retry ${i + 1}/${retries} failed: ${err.message}`, {
                url,
                options,
                error: err
            });
            if (i === retries - 1) throw err;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

function escapeScript(script) {
    return script.replace(/\\/g, '\\\\')
                 .replace(/"/g, '\\"')
                 .replace(/\n/g, '\\n')
                 .replace(/\r/g, '\\r')
                 .replace(/\t/g, '\\t');
}

function generateAndRunScript(prompt, aeVersion, usecsInterface = true) {
    const feedback = document.getElementById('feedback');
    if (!prompt) {
        feedback.textContent = 'Error: Please enter a prompt.';
        feedback.classList.add('error');
        return;
    }
    if (!aeVersion) {
        feedback.textContent = 'Error: Please select an After Effects version.';
        feedback.classList.add('error');
        return;
    }
    feedback.textContent = 'Generating and running script...';
    feedback.classList.remove('error');
    console.log('Initiating request with prompt:', prompt, 'aeVersion:', aeVersion, 'usecsInterface:', usecsInterface);

    if (usecsInterface) {
        csInterface.prototype.request('POST', 'https://localhost:3000/convert', JSON.stringify({ prompt: prompt, aeVersion: aeVersion }), {
            headers: { 'Content-Type': 'application/json' }
        }, function(err, data) {
            if (err) {
                console.error('csInterface request error:', err);
                feedback.textContent = `Error: Failed to fetch - ${err}`;
                feedback.classList.add('error');
                return;
            }
            let result;
            try {
                result = JSON.parse(data);
            } catch (e) {
                feedback.textContent = `Error: Invalid server response - ${e.message}`;
                feedback.classList.add('error');
                return;
            }
            if (result.error) {
                feedback.textContent = `Server error: ${result.error}`;
                feedback.classList.add('error');
                return;
            }
            console.log('Script received via csInterface:', result.script);
            csInterface.evalScript('runScriptInAE("' + escapeScript(result.script) + '")', function(scriptResult) {
                feedback.textContent = `Script executed: ${scriptResult}`;
                if (scriptResult.startsWith('Error')) {
                    feedback.classList.add('error');
                } else {
                    feedback.classList.remove('error');
                }
            });
        });
    } else {
        fetchWithRetry('https://localhost:3000/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt, aeVersion: aeVersion })
        })
        .then(data => {
            if (data.error) {
                feedback.textContent = `Server error: ${data.error}`;
                feedback.classList.add('error');
                return;
            }
            console.log('Script received via fetch:', data.script);
            csInterface.evalScript('runScriptInAE("' + escapeScript(data.script) + '")', function(scriptResult) {
                feedback.textContent = `Script executed: ${scriptResult}`;
                if (scriptResult.startsWith('Error')) {
                    feedback.classList.add('error');
                } else {
                    feedback.classList.remove('error');
                }
            });
        })
        .catch(error => {
            console.error('Fetch error:', error);
            feedback.textContent = `Error: Failed to fetch - ${error.message}`;
            feedback.classList.add('error');
        });
    }
}

// Attach to global scope
window.generateAndRunScript = generateAndRunScript;