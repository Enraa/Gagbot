const { markForSave } = require("../../other/markForSave");

/********
 * (async) Creates a webhook for a channel. 
 * 
 * - (interaction) interaction - The user interaction that invoked this method
 * - (channel) channel - The channel object to create the webhook
 * ---
 * ##### Returns an object with the following properties:
 *  - humanwebhook: If true, a valid human made webhook was found
 ********/
async function createWebhook(interaction, channel) {
	try {
		// First, check if we can manage webhooks. If we can't, vamos.
		if (!channel.permissionsFor(channel.guild.members.me).has(PermissionsBitField.Flags.ManageWebhooks)) {
			return false;
		}

		// We're now reasonably sure we can make webhooks.
		// Check if a Gagbot webhook already exists. This is used for human emoji.
		let existingwebhooks = await channel.fetchWebhooks();
		let webhook;
		let botwebhook;
		let humanwebhook;
		// Use a user-made webhook first if available
		existingwebhooks.forEach((w) => {
			console.log(existingwebhooks);
			console.log(`ISBOT: ${w.applicationId != interaction.client.user.id}, ISNAME: ${w.name == "Gagbot"}`);
			if (w.applicationId != interaction.client.user.id && w.name == "Gagbot") {
				webhook = w;
				humanwebhook = true;
			}
		});
		// Create a webhook for ourselves. This is used for bot emoji.
		existingwebhooks.forEach((w) => {
			if (w.applicationId == interaction.client.user.id) {
				botwebhook = w;
				humanwebhook = false;
			}
		});
		// A gagbot webhook does not exist. Create one.
		if (!botwebhook) {
			botwebhook = await channel.createWebhook({ name: "Gagbot Webhook (Bot)", reason: "Auto-generated Webhook for Bot Emoji" });
		}
        // If the personal created webhook doesn't exist, assign the webhook the same id
        // This will look weird, but it won't crash. 
        if (!webhook) { webhook = botwebhook }
		if (process.webhook == undefined) {
			process.webhook = {};
		}
		if (process.webhookstoload == undefined) {
			process.webhookstoload = {};
		}
		process.webhook[channel.id] = { human: webhook, bot: botwebhook };
		process.webhookstoload[channel.id] = { human: webhook.id, bot: botwebhook.id };
		markForSave("webhooks");
		console.log(process.webhookstoload);
		return { humanwebhook: humanwebhook };
	} catch (err) {
		console.log(err);
		return false;
	}
}

exports.createWebhook = createWebhook;