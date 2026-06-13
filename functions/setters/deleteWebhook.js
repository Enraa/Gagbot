/********
 * (async) Delete a webhook for a channel. 
 * 
 * - (interaction) interaction - The user interaction that invoked this method
 * - (channel) channel - The channel object to delete the webhook from
 * ---
 * ##### Returns "bot", "notbot" depending on what kind of webhook was deleted, or false if none
 ********/
async function deleteWebhook(interaction, channel) {
	// First, check if we can manage webhooks. If we can't, vamos.
	if (!channel.permissionsFor(channel.guild.members.me).has(PermissionsBitField.Flags.ManageWebhooks)) {
		return false;
	}
	let webhook;
	let existingwebhooks = await channel.fetchWebhooks();
	existingwebhooks.forEach((w) => {
		if (w.id == process.webhook[channel.id]) {
			webhook = w;
		}
	});
	delete process.webhook[channel.id];
	delete process.webhookstoload[channel.id];
	if (webhook) {
		if (webhook.w.applicationId == interaction.client.user.id) {
			await interaction.client.deleteWebhook(webhook.id);
			return "bot";
		} else {
			return "notbot";
		}
	}
	return false;
}

exports.deleteWebhook = deleteWebhook;