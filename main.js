const Discord = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');

const ALL_INTENTS = 32767

const client = new Client({
	intents: ALL_INTENTS
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
		client.login('MTA3MzMzNDA1NTk5MjU3ODE1OQ.GPjxAB.V9ofIipol20_V9HbuooarmJSudF3_ggDOxm1nk');
		int.reply('bot reseteado correctamente');
    }
 })

 client.destroy();
 client.login('MTA3MzMzNDA1NTk5MjU3ODE1OQ.GPjxAB.V9ofIipol20_V9HbuooarmJSudF3_ggDOxm1nk');