#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { platform } from 'node:os';

const url = 'http://localhost:3000';
const isWin = process.platform === 'win32';

const dev = spawn('node', ['node_modules/next/dist/bin/next', 'dev'], { stdio: 'inherit' });

let opened = false;
function openBrowser() {
  if (opened) return; opened = true;
  const cmd = isWin ? 'start' : platform() === 'darwin' ? 'open' : 'xdg-open';
  spawn(cmd, [url], { shell: true, stdio: 'ignore', detached: true });
}

// heuristic: wait until stdout line contains 'ready' or fallback timeout
const readyRegex = /ready - started server/i;

dev.stdout?.on('data', (d) => {
  const text = d.toString();
  if (readyRegex.test(text)) openBrowser();
});

setTimeout(openBrowser, 5000);

dev.on('exit', (code) => process.exit(code ?? 0));
