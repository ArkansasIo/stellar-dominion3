#!/usr/bin/env node

// Client Launcher - Opens the game in default browser
const { exec } = require('child_process');
const path = require('path');
const http = require('http');

const SERVER_URL = 'http://localhost:3000';
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check if server is running
function checkServer() {
  return new Promise((resolve) => {
    http.get(SERVER_URL, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => {
      resolve(false);
    });
  });
}

// Open browser
function openBrowser(url) {
  const platform = process.platform;
  let command;
  
  if (platform === 'win32') {
    command = `start ${url}`;
  } else if (platform === 'darwin') {
    command = `open ${url}`;
  } else {
    command = `xdg-open ${url}`;
  }
  
  exec(command, (error) => {
    if (error) {
      log(`Error opening browser: ${error.message}`, 'red');
      log(`Please manually open: ${url}`, 'blue');
    }
  });
}

async function main() {
  console.log('');
  log('═══════════════════════════════════════════════', 'bright');
  log('  Universe Empire Dominion - Client Launcher', 'bright');
  log('═══════════════════════════════════════════════', 'bright');
  console.log('');
  
  log('Checking server connection...', 'blue');
  
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    log('Server is not running!', 'red');
    log('Please start the server first:', 'blue');
    log('  - Run: UniverseEmpireDominion-windows.exe', 'blue');
    log('  - Or: npm run dev', 'blue');
    console.log('');
    process.exit(1);
  }
  
  log('Server is running!', 'green');
  log(`Opening game at: ${SERVER_URL}`, 'blue');
  console.log('');
  
  openBrowser(SERVER_URL);
  
  log('Game launched in your browser!', 'green');
  log('You can close this window.', 'blue');
  console.log('');
  
  // Keep process alive for a moment
  setTimeout(() => {
    process.exit(0);
  }, 2000);
}

main().catch(error => {
  log(`Error: ${error.message}`, 'red');
  process.exit(1);
});

// Made with Bob
