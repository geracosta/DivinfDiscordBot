// Discord imports
const { Client, GatewayIntentBits } = require('discord.js');
const { bot_token, discord_intents } = require('./config.json');

// 
const fs = require('fs').promises;
const path = require('path');
const process = require('process');

// Google Sheets imports
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function listMajors(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: '1U9QxtzU3qIZiARgUE8D2gqPSgKOIWWUPAj0n99cKFkQ',
    range: 'servidores!A2:R',
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return;
  }

  return rows; 

}

authorize().then((valor) => {
    listMajors(valor).then((filas) => {
        filas.forEach((fila) => {
     // Print columns A and C, D, J which correspond to indices 0 and 2, 3, 10.
            console.log(`${fila[0]} - ${fila[2]}`);
        });
    })
}).catch(console.error);


const ALL_INTENTS = 32767

const client = new Client({
	intents: discord_intents
});

client.on('ready', ()=>{
    console.log('Funca!')
    client.application.commands.set([
        {
            name: 'directo-test',
            description: 'Directo Test',
            options: [],
        },
        {
            name: 'directo-homologacion',
            description: 'Directo Homologacion',
            options: [],
        },
        {
            name: 'directo-produccion',
            description: 'Directo Produccion',
            options: [],
        },
        {
            name: 'cuotitas-test',
            description: 'Cuotitas Test',
            options: [],
        },
        {
            name: 'cuotitas-produccion',
            description: 'Cuotitas Produccion',
            options: [],
        },
        {
            name: 'cuotitas-homologacion',
            description: 'Cuotitas Homologacion',
            options: [],
        },
		{
            name: 'comandos',
            description: 'comandos',
            options: [],
        },
		{
            name: 'reset',
            description: 'reset',
            options: [],
        }
    ]);
})

client.on('interactionCreate', (int) =>{
    if(int.isCommand() && int.commandName === 'directo-test'){
        int.reply('http://comercios-test.directo.com.ar/LOANTEST/index.aspx')
    }
    if(int.isCommand() && int.commandName === 'directo-homologacion'){
        int.reply('http://comercios-test.directo.com.ar/LOAN/index.aspx')
    }
    if(int.isCommand() && int.commandName === 'directo-produccion'){
        int.reply('http://micomercio.directo.com.ar')
    }
    if(int.isCommand() && int.commandName === 'cuotitas-test'){
        int.reply('http://190.210.216.50/Test/Cuotitas/Login.aspx')
    }
    if(int.isCommand() && int.commandName === 'cuotitas-produccion'){
        int.reply('http://www.prestamoscuotitas.com.ar/')
    }
    if(int.isCommand() && int.commandName === 'cuotitas-homologacion'){
        int.reply('http://www.prestamoscuotitas.com.ar/')
    }
	if(int.isCommand() && int.commandName === 'comandos'){
        int.reply('`*cuotitas*\n/cuotitas-produccion\n/cuotitas-test\n/cuotitas-homologacion\n\n*directo*\n/directo-produccion\n/directo-test\n/directo-homologacion`\n\n');
    }
	if(int.isCommand() && int.commandName === 'reset'){
		client.destroy();
		client.login(bot_token);
		int.reply('bot reseteado correctamente');
    }
 })

 client.destroy();
 client.login(bot_token);