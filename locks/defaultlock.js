const { ButtonStyle, ButtonBuilder, ActionRowBuilder, TextDisplayBuilder, MessageFlags } = require("discord.js");

// This is the base definition for a lock that is affixed to a restraint. Any new functionality that references a property
// MUST have that reference here to ensure all locks are constructed with a default. 
// The default values should generally "do nothing" as they will be overwritten by
// the further lock types as relevant.
function Lock() {
    // Conditions
    // The condition to allow adding this lock to a restraint
    this.canAddLock = (data) => { return true };

    // The condition to allow access to the item this lock is on
    this.canAccessLock = (data) => { return true };

    // The condition to allow adding or removing clonedKeyholders
    this.canCloneKeys = (data) => { return true };

    // The condition to allow transferring primary keyholder
    this.canTransfer = (data) => { return true };

    // The condition to allow unlocking this lock
    this.canUnlock = (data) => { return true };

    // Events
    // Called immediately after applying the lock
    this.onLock = (data) => { return true };

    // Called immediately before removing the lock
    this.onUnlock = (data) => { return true };

    // Called when adding or removing clonedKeyholders
    this.onClonedKeys = (data) => { return true };

    // Called when changing primary keyholders
    this.onTransfer = (data) => { return true };

    // Functions
    // Remove parent device
    this.removeParent = (data) => {
        let lockeditem = getRestraintByUUID(data.uuid);
    }

    // Base Data
    // Name as displayed to user
    this.name = "Default Lock"

    // Name sorting - this should generally always be "Lock"
    this.category = "Lock"

    /********
     * Locktypes can come in "large" and "small" and "unique" varieties. 
     * 
     * - **large:** Can only be affixed to "Large" restraints. These are intended for stuff that can feasibly be permanent without being impossibly impacting. *In more plain terms, anything that isn't **headwear** or **gags** will be a large lock.*
     * - **small:** Can be affixed to "Small" or "Large" restraints. These have hard coded limits to ensure that any bondage applied in this way cannot be permanent except from the user's own actions.
     * - **_____:** Can only be affixed to a matching restraint lock type as specified by the restraint object's lock tags. 
     ********/
    this.locktype = "small"

    // Description displayed for lock. Should be 1-2 sentences providing an overview.
    this.desc = `A basic default lock that does nothing but serve as a base for the rest of the lock types.`

    /*********
     * Configuration page for the lock. This should provide any clickable options needed to display the lock properly. This should ALWAYS end with a confirm button in an action row at the bottom. See defaultlock.js boilerplate.
     * 
     * Any details that need to be set on the lock should be stored into the lock uuid that is mapped to process.awaitinglock[uuid], where the lockbutton will apply it and the leavebutton will delete it. 
     * Additionally, always update the process.awaitinglock[uuid].interaction param with the current interaction. Use updateLockInteraction to do it. 
     * *******/ 
    this.lockinteraction = function (interaction, data) {
        

        let pagecomponents = [];

        // Ending description text
        let textaboutlock = new TextDisplayBuilder().setContent(`${this.desc}`);
        pagecomponents.push(textaboutlock)

        // Buttons
        let buttons = [
            // Page Down
            new ButtonBuilder()
                .setCustomId(`lockconfig_${data.uuid}_leavebutton`)
                .setLabel("Don't Lock")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(),
            // Page Up
            new ButtonBuilder()
                .setCustomId(`lockconfig_${data.uuid}_lockbutton`)
                .setLabel("Lock")
                .setStyle(ButtonStyle.Success)
                .setDisabled(),
        ]
        pagecomponents.push(new ActionRowBuilder().addComponents(...buttons));

        interaction.editReply({ components: pagecomponents, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })
    }

    /********
     * Response to an interaction. This should always end with calling this.lockinteraction, passing the data param. 
     * 
     ********/
    this.lockinteractionreponse = function (interaction) {
        console.log(`A button was pressed that wasn't the leave or lock buttons!`)
        let uuid = "0000000000000000" // We would need to get the UUID from one of the buttons pressed!

        this.lockinteraction(interaction, { uuid: uuid });
    }

    /********
     * Response to a modal interaction. Note that since modals cannot intrinsically edit replies because they are wholly separate, we need to retrieve the interaction token from what is stored in process.awaitinglock[uuid].
     * 
     ********/
    this.lockinteractionmodalresponse = function (interaction) {
        console.log(`The modal submission was received!`)
        let uuid = "0000000000000000" // We would need to get the UUID from the customId param of interaction. 

        let menuinteraction = process.awaitinglock[uuid]?.interaction
        if (menuinteraction) {
            this.lockinteraction(menuinteraction, { uuid: uuid });
        }
    }
}

exports.Lock = Lock;