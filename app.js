// Utility functions for string manipulation
const utils = {
    generateRandomString: (length) => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
        return '_' + Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    },
    
    encodeString: (str) => {
        return str.split('').map(char => '\\' + char.charCodeAt(0)).join('');
    },
    
    generateJunkCode: () => {
        const junkPatterns = [
            `local ${utils.generateRandomString(5)} = function() return #{Math.random() * 1000 | 0} end`,
            `if #{Math.random()} then ${utils.generateRandomString(4)} = #{Math.random() * 100 | 0} end`,
            `do local ${utils.generateRandomString(6)} = '${utils.generateRandomString(8)}' end`
        ];
        return junkPatterns[Math.floor(Math.random() * junkPatterns.length)]
            .replace(/#{(.*?)}/g, (_, expr) => eval(expr));
    }
};

// Main obfuscation logic
function obfuscate() {
    const input = document.getElementById('input').value;
    const options = {
        encodeStrings: document.getElementById('encodeStrings').checked,
        renameVariables: document.getElementById('renameVariables').checked,
        addJunk: document.getElementById('addJunk').checked,
        shuffleFunctions: document.getElementById('shuffleFunctions').checked
    };

    let obfuscated = input;

    // Remove comments
    obfuscated = obfuscated.replace(/--[^\n]*(\n|$)/g, '');

    // Variable renaming
    if (options.renameVariables) {
        const varMap = new Map();
        const luaKeywords = ['and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for', 
                           'function', 'if', 'in', 'local', 'nil', 'not', 'or', 'repeat', 
                           'return', 'then', 'true', 'until', 'while'];
        
        obfuscated = obfuscated.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g, (match) => {
            if (luaKeywords.includes(match)) return match;
            if (!varMap.has(match)) {
                varMap.set(match, utils.generateRandomString(8));
            }
            return varMap.get(match);
        });
    }

    // String encoding
    if (options.encodeStrings) {
        obfuscated = obfuscated.replace(/(["'])(.*?)\1/g, (match, quote, content) => {
            return quote + utils.encodeString(content) + quote;
        });
    }

    // Add junk code
    if (options.addJunk) {
        const lines = obfuscated.split('\n');
        const junkCount = Math.floor(lines.length / 3);
        for (let i = 0; i < junkCount; i++) {
            const pos = Math.floor(Math.random() * lines.length);
            lines.splice(pos, 0, utils.generateJunkCode());
        }
        obfuscated = lines.join('\n');
    }

    // Function shuffling (basic implementation)
    if (options.shuffleFunctions) {
        const functionRegex = /local\s+function\s+([^(]+)/g;
        const functions = [];
        let match;
        
        while ((match = functionRegex.exec(obfuscated)) !== null) {
            functions.push(match[0]);
        }
        
        if (functions.length > 1) {
            functions.sort(() => Math.random() - 0.5);
            functions.forEach((func, i) => {
                obfuscated = obfuscated.replace(func, `local function _fn${i}`);
            });
        }
    }

    document.getElementById('output').value = obfuscated;
}

function copyOutput() {
    const output = document.getElementById('output');
    output.select();
    document.execCommand('copy');
    
    // Visual feedback
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => copyBtn.textContent = originalText, 1500);
}

function clearInput() {
    document.getElementById('input').value = '';
    document.getElementById('output').value = '';
}

// Update timestamp every minute
function updateTimestamp() {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substr(0, 19);
    document.querySelector('.timestamp').textContent = `UTC: ${timestamp}`;
}

setInterval(updateTimestamp, 60000);
updateTimestamp();
