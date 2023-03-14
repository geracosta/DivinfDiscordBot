// Discord imports
const { Client, GatewayIntentBits, ApplicationCommand, Events } = require('discord.js');
const { bot_token, discord_intents, spreadsheets } = require('./config.json');

// imports
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
    spreadsheetId: spreadsheets,
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
      const ALL_INTENTS = 32767
      const client = new Client({
        intents: discord_intents
      });

      let commands = [];
      
      const filasFiltradas = filas.filter(fila => fila[0] === "creditodirecto" || fila[0] === "cuotitas" || fila[0] === "santander");

      filasFiltradas.forEach((fila) => {
     // Print columns A and C, D, J which correspond to indices 0 and 2, 3, 10.
            // Este comment funciona bien console.log(`{ name: ${fila[0]}-${fila[2]}-${fila[3]}, description: ${fila[0]} ${fila[2]} ${fila[3]} }`)
              if (fila[3].includes('db')) {
                commands.push(new ApplicationCommand(client,{name:`${fila[0]}-${fila[2].replace('/','-').slice(0,3)}-${fila[3].replace('/','-').slice(0,5)}-db`,description:`${fila[0]} ${fila[2]} ${fila[3]}`}));
              }else {
                commands.push(new ApplicationCommand(client,{name:`${fila[0]}-${fila[2].replace('/','-').slice(0,3)}-${fila[3].replace('/','-').slice(0,5)}`,description:`${fila[0]} ${fila[2]} ${fila[3]}`}));
              }
        });
        client.on('ready', ()=>{
          client.application.commands.set(commands);
          console.log('Funca!')
      })

      const comandos = {};

      filasFiltradas.forEach((fila) => {
        const comando = `${fila[0]}-${fila[2].replace('/','-').slice(0,3)}-${fila[3].replace('/','-').slice(0,5)}`;
        comandos[comando] = fila[9];
        comandos[`${comando}-db`] = fila[9];
      });

      client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isCommand() || !interaction.inGuild() || !interaction.member) return;
        const comando = comandos[interaction.commandName];
        if (!comando) return;

        try {
          console.log(comando);
          await interaction.reply({content: comando, ephemeral: false});
        } catch (error) {
          console.error(error);
          await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
      });

      client.destroy();
      client.login(bot_token);
    })
}).catch("shit :", console.error);