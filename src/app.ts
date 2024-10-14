import { createServer, IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';

let tokens: { [key: string]: { wordCount: number; createdAt: Date } } = {};

export function generateToken(email: string): string {
    if(email){
        const token = crypto.randomUUID();
        tokens[token] = { wordCount: 0, createdAt: new Date() };
        return token;
    }
    return '';
}

export function trackWordUsage(token: string, wordCount: number): boolean {
    if (tokens[token]) {
        if (tokens[token].wordCount + wordCount > 80000) {
            return false;
        }
        tokens[token].wordCount += wordCount;
        return true;
    }
    return false;
}

export function justifyText(text: string): string {
    const words: string[] = text.split(' ');
    const justifiedLines: string[] = [];
    let currentLine: string[] = [];


    words.forEach((word) => {
        const lineLength = currentLine.join(' ').length;
        if (lineLength + word.length + 1 <= 80) {
            currentLine.push(word);
        } else {
            justifiedLines.push(justifyLine(currentLine.join(' ')));
            currentLine = [word];
        }
    });

    if (currentLine.length > 0) {
        justifiedLines.push(currentLine.join(' '));
    }

    return justifiedLines.join('\n');
}

function justifyLine(line: string): string {
    const spacesNeeded = 80 - line.length;
    const words = line.split(' ');
    let spaceBetweenWords = Math.floor(spacesNeeded / (words.length - 1));
    let extraSpaces = spacesNeeded % (words.length - 1);

    for (let i = 0; i < extraSpaces; i++) {
        words[i] += ' ';
    }

    return words.join(' '.repeat(spaceBetweenWords + 1));
}

function getRequestBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            resolve(body);
        });
        req.on('error', reject);
    });
}

// Create a native Node.js HTTP server
const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'POST') {
        // Token generation endpoint
        if (req.url === '/api/token') {
            const body = await getRequestBody(req);
            const { email } = JSON.parse(body);

            if (!email) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Email is required' }));
                return;
            }

            const token = generateToken(email);
            res.statusCode = 200;
            res.end(JSON.stringify({ token }));
        }

        // Text justification endpoint
        else if (req.url === '/api/justify') {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                res.statusCode = 401;
                res.end(JSON.stringify({ error: 'Token is required' }));
                return;
            }

            const body = await getRequestBody(req);
            const wordCount = body.split(' ').length;

            if (!trackWordUsage(token, wordCount)) {
                res.statusCode = 402;
                res.end(JSON.stringify({ error: 'Payment Required: Rate limit exceeded' }));
                return;
            }

            const justifiedText = justifyText(body);
            res.statusCode = 200;
            res.end(justifiedText);
        } else {
            res.statusCode = 404;
            res.end('Not Found');
        }
    } else {
        res.statusCode = 405;
        res.end('Method Not Allowed');
    }
});

// Start the server on port 3000
const port = 3000;
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});