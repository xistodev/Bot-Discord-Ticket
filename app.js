const Discord = require("discord.js");
const Collection = ("discord.js"); 
const client = new Discord.Client();
const config = require("./config.json");
const path = require('path');
const fs = require('fs');

client.on('ready', () => { 
  console.log(`Logado em ${client.user.tag} em ${client.channels.size} canais, com ${client.users.size} usuarios e em ${client.guilds.size}\nCriado e desenvolvido por ${config.author}`)
});

client.commands = new Discord.Collection();
client.queues = new Map();

client.on("message", async message => {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const comando = args.shift().toLowerCase();
  
  if(comando === "ping") {
    const m = await message.channel.send("Ping?");
    const embed = new Discord.MessageEmbed()
	.setColor('#FFA500')
	.setTitle('Latencia do Bot')
	.setDescription(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp} ms.`)
	.setThumbnail('https://cdn.discordapp.com/attachments/854185300956020786/854905194533879818/mx.jpeg')
	.setFooter('MX Store ©2021', 'https://cdn.discordapp.com/attachments/854185300956020786/854905194533879818/mx.jpeg')
    .setTimestamp();
    message.channel.send(embed);
  }


  if(comando === "pagar") {
    const embed = new Discord.MessageEmbed()
	.setColor('#FFA500')
	.setTitle('Metodos de pagamento')
	.setDescription("```MercadoPago > email@gmail.com```\n```Pix > email@gmail.com```")
	.setThumbnail('https://cdn.discordapp.com/attachments/854185300956020786/854905194533879818/mx.jpeg')
	.setFooter('MX Store ©2021', 'https://cdn.discordapp.com/attachments/854185300956020786/854905194533879818/mx.jpeg')
    .setTimestamp();
    message.channel.send(embed);
  }
	
	if(command === "punish") {


  let user = message.mentions.users.first() || client.users.cache.get(args[0])
  var membro = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (!membro) return message.reply('🚨 | O Comando  nao é assim digite .help para saber mais.``')
  if (membro === message.member) return message.reply(`🚨 | Desculpe, mas você não tem permissão para isso.`)

  var motivo = args.slice(1).join(" ");
  if (!motivo) return message.channel.send(`🚨 | Motivo inválido.`)
  if(!message.guild.roles.cache.get("887811808428191765")) return message.channel.send(`🚨 | Desculpe, mas você não tem permissão para isso.`).then(message=>message.delete({timeout:"7000"}));
  if(!message.guild.roles.cache.get("888489751823417394")) return message.channel.send('🚨 | Desculpe, mas você não tem permissão para isso.').then(message=>message.delete({timeout:"7000"}));
  if(!message.guild.roles.cache.get("888492400228585472")) return message.channel.send('🚨 | Desculpe, mas você não tem permissão para isso.').then(message=>message.delete({timeout:"7000"}));
  if(!message.guild.roles.cache.get("888493009237319710")) return message.channel.send('🚨 | Desculpe, mas você não tem permissão para isso.').then(message=>message.delete({timeout:"7000"}));
  if(!message.guild.roles.cache.get("888571719789457449")) return message.channel.send('🚨 | Desculpe, mas você não tem permissão para isso.').then(message=>message.delete({timeout:"7000"}));

      message.channel.send(`Para advertir o ${user} clique no emoji`).then(msg => {
      msg.react("👍")

      let filtro = (reaction, usuario) => reaction.emoji.name === "👍" && usuario.id === message.author.id;
      let coletor = msg.createReactionCollector(filtro, {max: 1})
      let role = message.guild.roles.cache.find(r => r.name === "・Adv 1");

      coletor.on("collect", cp => {
          cp.remove(message.author.id); {
              let embed = new Discord.MessageEmbed()
              .setTitle('Advertencia')
              .setColor('#FF0000')
              .setTimestamp()
              .setFooter("GIF SHOP 2021")
              .setThumbnail('https://cdn.discordapp.com/attachments/887816914485788683/892684658771374100/unknown.png')
              .addFields(
                {
                  name: "``Informações da Advertencia:``",
                  value: `**Usuário punido**: ${membro} \n **Motivo**: ${motivo} \n **Autor**: ${message.author.username}`
                }
              )
              message.channel.send(embed);
          }
          membro.roles.add(role).catch(console.error);
      })
  })
}


  if(comando === "ticket") {
		if(message.guild.channels.cache.find(channel => channel.name === `ticket-${message.author.id}`)) {
			return message.reply('Você ja tem um ticket criado, por favor delete seu ticket para criar outro!');
      message.delete(1000); //Supposed to delete message
		}

		message.guild.channels.create(`ticket-${message.author.id}`, {
			permissionOverwrites: [
				{
					id: message.author.id,
					allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
				},
				{
					id: message.guild.roles.everyone,
					deny: ['VIEW_CHANNEL'],
				},
			],
			type: 'text',
		}).then(async channel => {
			message.reply(`Você criou com sucesso! Por favor clique em ${channel} para ver seu ticket.`);
			channel.send(`Olá! ${message.author}, bem vindo ao seu ticket! Seja paciente, jaja estaramos com você em breve. Se você gostaria de fechar este ticket, execute\`${config.prefix}close\``);
			let logchannel = message.guild.channels.cache.find(channel => channel.name === `ticket-logs`)
			if(logchannel) {
				logchannel.send(`Ticket ${message.author.id} criado. Clique em <#${channel.id}>`);
			}
		});
  }
  if(comando === "transcript") {
		const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
		if (channel.name.includes('ticket-')) {
			if (message.member.hasPermission('ADMINISTRATOR') || channel.name === `ticket-${message.author.id}`) {
				channel.messages.fetch().then(async (messages) => {
					const output = messages.array().reverse().map(m => `${new Date(m.createdAt).toLocaleString('en-US')} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');

					let response;
					try {
						response = await sourcebin.create([
							{
								name: ' ',
								content: output,
								languageId: 'text',
							},
						], {
							title: `Chat transcript for ${channel.name}`,
							description: ' ',
						});
					}
					catch(e) {
						return message.channel.send('An error occurred, please try again!');
					}

					const embed = new MessageEmbed()
						.setDescription(`[\`📄 View\`](${response.url})`)
						.setColor('GREEN');
					message.reply('the transcript is complete. Please click the link below to view the transcript', embed);
				});
			}
		}
		else {
			return message.reply(
				'you cannot use this command here. Please use this command in a open ticket.',
			);
    }
  }
  if(comando === "remove") {
		if(message.channel.name.includes('ticket-')) {
			const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(' ') || x.user.username === args[0]);
			if(!member) {
				return message.channel.send(`Usado de forma errado, por favor use:${prefix}remove <member>`);
			}
			try{
				message.channel.updateOverwrite(member.user, {
					VIEW_CHANNEL: false,
					SEND_MESSAGES: false,
					ATTACH_FILES: false,
					READ_MESSAGE_HISTORY: false,
				}).then(() => {
					message.channel.send(`Removido com sucesso ${member} de ${message.channel}`);
				});
			}
			catch(e) {
				return message.channel.send('Um erro ocorreu, por favor tente novamente');
			}
		}
  }
  if(comando === "open") {
		if (message.channel.name.includes('ticket-')) {
			const member = message.guild.members.cache.get(message.channel.name.split('ticket-').join(''));
			try {
				message.channel.updateOverwrite(member.user, {
					VIEW_CHANNEL: true,
					SEND_MESSAGES: true,
					ATTACH_FILES: true,
					READ_MESSAGE_HISTORY: true,
				})
					.then(() => {
						message.channel.send(`Re-aberto com sucesso ${message.channel}`);
					});
			}
			catch (e) {
				return message.channel.send('Ocorreu um erro por favor tente novamente!');
			}
		}
		else {
			return message.reply(
				'Você não pode usar este comando aqui. Use este comando quando quiser re-abrir um tíquete',
			);
		}
  }
  if(comando === "delete") {
		if(message.channel.name.includes('ticket-')) {
			message.channel.delete();
		}
		else {
			return message.reply('Você não pode usar este comando aqui. Use este comando quando quiser apagar um tíquete.');
		}
  }
  if(comando === "close") {
    if(message.channel.name.includes('ticket-')) {
			const member = message.guild.members.cache.get(message.channel.name.split('ticket-').join(''));
			if(message.member.hasPermission('ADMINISTRATOR') || message.channel.name === `ticket-${message.author.id}`) {
				message.channel.messages.fetch().then(async (messages) => {
					const output = messages.array().reverse().map(m => `${new Date(m.createdAt).toLocaleString('en-US')} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');

					let response;
					try {
						response = await sourcebin.create([
							{
								name: ' ',
								content: output,
								languageId: 'text',
							},
						], {
							title: `Chat transcript para ${message.channel.name}`,
							description: ' ',
						});
					}
					catch(e) {
						return message.channel.send('Ocorreu um erro por favor tente novamente!');
					}

					const embed = new MessageEmbed()
						.setDescription(`[\`📄 Ver\`](${response.url})`)
						.setColor('ORANGE');
					member.send('Aqui está uma transcrição do seu tíquete, clique no link abaixo para ver a transcrição', embed);
				}).then(() => {
					try {
						message.channel.updateOverwrite(member.user, {
							VIEW_CHANNEL: false,
							SEND_MESSAGES: false,
							ATTACH_FILES: false,
							READ_MESSAGE_HISTORY: false,
						}).then(() => {
							message.channel.send(`Fechado com sucesso ${message.channel}`);
						});
					}
					catch(e) {
						return message.channel.send('Ocorreu um erro por favor tente novamente!');
					}
				});
			}
		}
		else {
			return message.reply('Você não pode usar esse comando aqui. Por favor use esse comando\'para fechar um ticket.');
		}
  }
  if(comando === "add") {
		if(message.channel.name.includes('ticket-')) {
			const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(' ') || x.user.username === args[0]);
			if(!member) {
				return message.channel.send(`Não utilizado corretamento use:${prefix}add <member>`);
			}
			try{
				message.channel.updateOverwrite(member.user, {
					VIEW_CHANNEL: true,
					SEND_MESSAGES: true,
					ATTACH_FILES: true,
					READ_MESSAGE_HISTORY: true,
				}).then(() => {
					message.channel.send(`Adicionado com sucesso ${member} em ${message.channel}`);
				});
			}
			catch(e) {
				return message.channel.send('Ocorreu um erro por favor tente novamente!');
			}
		}
  }
});



client.login(config.token);
