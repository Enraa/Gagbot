const { clearArousal } = require("../functions/setters/arousal/clearArousal")
const { removeToy } = require("../functions/setters/toy/removeToy")
const { setOption } = require("../functions/setters/config/setOption")
const { ButtonStyle } = require("discord.js");
const { markForSave } = require("../functions/other/markForSave");


/***********
 * - Configuration options which will be presented to the user when using /config
 * ---
 * - All configuration options will be separated by category, and then within the category, named objects. 
 * - These objects will have a key that can be referenced with **getOption** and **setOption**, or the appropriate functions for Server and Bot respectively, in the case of Server Options and Bot Options. 
 * ---
 * Each object will have the following properties: 
 * - name: (string) The name displayed to the user
 * - desc: (string) The description text presented underneath the name
 * - menutype: "choice_textentry", "choice", "choice_userentry", "choice_server", "choice_bot"
 * - descmodal?: (string) The description text supplied to a text entry modal ("choice_textentry" type only)
 * - customtext?: (userID) => Returns a string to assign to the option by default in the modal
 * - placeholder?: (userID) => Returns a string to display in a text entry field on the modal
 * - textvaluedisplay?: (userID) => Returns a string to display at the end of a choice's help text
 * - choices: An array of objects with the following properties: 
 * - --> name: (string) The name of the choice displayed on the button when active
 * - --> helptext: (string) The text presented below the description when active
 * - --> helptextnone?: (string) The text presented when no value is set ("choice_textentry" only)
 * - --> select_function: (userID) => Invoked when the choice becomes active
 * - --> value: The value returned when getOption(userID, "<name>") is invoked (or Server/Bot)
 * - --> style: (ButtonStyle) The specific Discord button style to present
 ***********/
const configoptions = {
    Me: {
        profilelink: {
			name: "Profile Link",
			desc: "Set a profile link when people /inspect you",
			descmodal: "Paste the exact link to direct users to when inspecting you.",
			choices: [
				{
					name: "Set Link",
					helptext: "Link set to \n",
					helptextnone: "*No profile link*",
					select_function: (userID) => {
						return false;
					},
					value: "None",
					style: ButtonStyle.Primary,
				},
			],
			customtext: (userID) => {
				return `https://discord.gg/`;
			},
			placeholder: (userID) => {
				return `https://discord.gg/`;
			},
            textvaluedisplay: (val) => {
                return val;
            },
			menutype: "choice_textentry",
			default: (userID) => {
				return ``;
			},
			disabled: () => {
				return false;
			},
		},
        kinklistlink: {
			name: "Kink List Link",
			desc: "Set a kink list link when people /inspect you",
			descmodal: "Paste the exact link to direct users to when inspecting you.",
			choices: [
				{
					name: "Set Link",
					helptext: "Link set to \n",
					helptextnone: "*No kink list link*",
					select_function: (userID) => {
						return false;
					},
					value: "None",
					style: ButtonStyle.Primary,
				},
			],
			customtext: (userID) => {
				return `https://discord.gg/`;
			},
			placeholder: (userID) => {
				return `https://discord.gg/`;
			},
            textvaluedisplay: (val) => {
                return val;
            },
			menutype: "choice_textentry",
			default: (userID) => {
				return ``;
			},
			disabled: () => {
				return false;
			},
		},
        preferredtitle: {
			name: "Preferred Titles",
			desc: "Set preferred titles to display when others inspect you",
			descmodal: "Write the exact title you wish to be addressed by:",
			choices: [
				{
					name: "Set Title",
					helptext: "Displaying as **",
					helptextnone: "*No Preferred Titles Set*",
					select_function: (userID) => {
						return false;
					},
					value: "None",
					style: ButtonStyle.Primary,
				},
			],
			customtext: (userID) => {
				return `Miss, Lady, Sir, Master`;
			},
			placeholder: (userID) => {
				return `Miss, Lady, Sir, Master`;
			},
            textvaluedisplay: (val) => {
                return `${val}**`;
            },
			menutype: "choice_textentry",
			default: (userID) => {
				return ``;
			},
			disabled: () => {
				return false;
			},
		},
        pronouns: {
			name: "Pronouns",
			desc: "Which pronouns should the bot use when referring to you?",
			choices: [
				{
					name: "She/her",
					helptext: "Feminine Pronouns (she, her, hers, herself)",
					select_function: (userID) => {
                        if (process.pronouns == undefined) {
                            process.pronouns = {};
                        }
                        process.pronouns[userID] = { subject: "she", object: "her", possessive: "hers", possessiveDeterminer: "her", reflexive: "herself", subjectIs: "she's", subjectWill: "she'll" }
                        markForSave("pronouns");
                    },
					value: "she",
					style: ButtonStyle.Secondary,
				},
				{
					name: "He/him",
					helptext: "Masculine Pronouns (he, him, his, himself)",
					select_function: (userID) => {
                        if (process.pronouns == undefined) {
                            process.pronouns = {};
                        }
                        process.pronouns[userID] = { subject: "he", object: "him", possessive: "his", possessiveDeterminer: "his", reflexive: "himself", subjectIs: "he's", subjectWill: "he'll" }
                        markForSave("pronouns");
                    },
					value: "he",
					style: ButtonStyle.Secondary,
				},
				{
					name: "They/them",
					helptext: "Nonbinary Pronouns (they, them, their, themself)",
					select_function: (userID) => {
                        if (process.pronouns == undefined) {
                            process.pronouns = {};
                        }
                        process.pronouns[userID] = { subject: "they", object: "them", possessive: "theirs", possessiveDeterminer: "their", reflexive: "themself", subjectIs: "they're", subjectWill: "they'll" }
                        markForSave("pronouns");
                    },
					value: "they",
					style: ButtonStyle.Secondary,
				},
                {
					name: "It/its",
					helptext: "Object Pronouns (it, it, its, itself)",
					select_function: (userID) => {
                        if (process.pronouns == undefined) {
                            process.pronouns = {};
                        }
                        process.pronouns[userID] = { subject: "it", object: "it", possessive: "its", possessiveDeterminer: "its", reflexive: "itself", subjectIs: "it's", subjectWill: "it'll" }
                        markForSave("pronouns");
                    },
					value: "it",
					style: ButtonStyle.Secondary,
				},
                {
					name: "Not Set",
					helptext: "Pronouns have not been set yet",
					select_function: (userID) => {
                        setOption(userID, "pronouns", "she");
                        if (process.pronouns == undefined) {
                            process.pronouns = {};
                        }
                        process.pronouns[userID] = { subject: "she", object: "her", possessive: "hers", possessiveDeterminer: "her", reflexive: "herself", subjectIs: "she's", subjectWill: "she'll" }
                        markForSave("pronouns");
                    },
					value: "notset",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "notset",
			disabled: () => {
				return false;
			}, // if true, button is greyed out
		},
        praiseobject: {
			name: "Praise Object",
			desc: "When the bot praises you, what noun should it use?",
			choices: [
				{
					name: "Follow Gender",
					helptext: "Follow Selected Pronouns/State",
					select_function: (userID) => { return true },
					value: "follow",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Girl",
					helptext: "Good **Girl!**",
					select_function: (userID) => { return true },
					value: "girl",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Boy",
					helptext: "Good **Boy!**",
					select_function: (userID) => { return true },
					value: "boy",
					style: ButtonStyle.Secondary,
				},
                {
					name: "Toy",
					helptext: "Good **Toy!**",
					select_function: (userID) => { return true },
					value: "toy",
					style: ButtonStyle.Secondary,
				},
                {
					name: "Doll",
					helptext: "Good **Doll.**",
					select_function: (userID) => { return true },
					value: "doll",
					style: ButtonStyle.Secondary,
				},
                {
					name: "Drone",
					helptext: "Good **Drone.**",
					select_function: (userID) => { return true },
					value: "drone",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "follow",
			disabled: () => {
				return false;
			}, // if true, button is greyed out
		},
        receiveheadpat: {
			name: "Recieve Headpats",
			desc: "Who is allowed to headpat you?",
			choices: [
				{
					name: "Everyone",
					helptext: "Everyone is allowed to pat you without prompts",
					select_function: (userID) => { return true },
					value: "everyonenoprompt",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Everyone (Prompt)",
					helptext: "Everyone but keyholders will prompt to pat you",
					select_function: (userID) => { return true },
					value: "everyone",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Keyholders",
					helptext: "Only Keyholders can pat you and without prompts",
					select_function: (userID) => { return true },
					value: "keyholdernoprompt",
					style: ButtonStyle.Secondary,
				},
                {
					name: "Keyholders (Prompt)",
					helptext: "Only Keyholders can pat you with prompts",
					select_function: (userID) => { return true },
					value: "keyholder",
					style: ButtonStyle.Secondary,
				},
                {
					name: "Nobody",
					helptext: "Nobody can pat you",
					select_function: (userID) => { return true },
					value: "nobody",
					style: ButtonStyle.Danger,
				},
			],
			menutype: "choice",
			default: "everyonenoprompt",
			disabled: () => {
				return false;
			}, // if true, button is greyed out
		},
        allowedheadpat: {
			name: "Headpat Exempt Users",
			desc: "Set users who can headpat you regardless of your setting above",
			descmodal: "Select up to 25 users which can headpat you at all times:",
			choices: [
				{
					name: "Set Users",
					helptext: "Users set to ",
					helptextnone: "*No Users Set*",
					select_function: (userID) => {
						return false;
					},
					value: "None",
					style: ButtonStyle.Primary,
				},
			],
			customtext: (userID) => {
				return `https://discord.gg/`;
			},
			placeholder: (userID) => {
				return `https://discord.gg/`;
			},
            uservaluedisplay: (val) => {
                return val;
            },
			menutype: "choice_userentry",
			default: (userID) => {
				return ``;
			},
			disabled: () => {
				return false;
			},
		},
        receiveshock: {
			name: "Recieve Shocks",
			desc: "Who is allowed to trigger remote shocks on you?",
			choices: [
				{
					name: "Everyone",
					helptext: "Everyone is allowed to shock you",
					select_function: (userID) => { return true },
					value: "everyonenoprompt",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Collar Access",
					helptext: "Anyone with access to your collar is allowed to shock you",
					select_function: (userID) => { return true },
					value: "collaraccess",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Keyholders",
					helptext: "Only Keyholders can shock you",
					select_function: (userID) => { return true },
					value: "keyholdernoprompt",
					style: ButtonStyle.Secondary,
				},
                {
					name: "Nobody",
					helptext: "Nobody can shock you",
					select_function: (userID) => { return true },
					value: "nobody",
					style: ButtonStyle.Danger,
				},
			],
			menutype: "choice",
			default: "collaraccess",
			disabled: () => {
				return false;
			}, // if true, button is greyed out
		},
        allowedshock: {
			name: "Shock Exempt Users",
			desc: "Set users who can always shock you while wearing a remote controlled shock collar, regardless of the setting above",
			descmodal: "Select up to 25 users which can shock you at all times:",
			choices: [
				{
					name: "Set Users",
					helptext: "Users set to ",
					helptextnone: "*No Users Set*",
					select_function: (userID) => {
						return false;
					},
					value: "None",
					style: ButtonStyle.Primary,
				},
			],
			customtext: (userID) => {
				return `https://discord.gg/`;
			},
			placeholder: (userID) => {
				return `https://discord.gg/`;
			},
            uservaluedisplay: (val) => {
                return val;
            },
			menutype: "choice_userentry",
			default: (userID) => {
				return ``;
			},
			disabled: () => {
				return false;
			},
		},
        shocktone: {
            name: "Shock Tone",
            desc: "When receiving shocks, should the tone of the message be playful or painful? This will affect shocks received from any collar.",
            choices: [
				{
					name: "Playful",
					helptext: "Playful, teasing shock messages",
					select_function: (userID) => { return true },
					value: "playful",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Painful",
					helptext: `Painful shocks intended for masochistic recipients`,
					select_function: (userID) => { return true },
					value: "painful",
					style: ButtonStyle.Secondary,
				},
                {
					name: "Both",
					helptext: `Randomly selects the tone when shocked`,
					select_function: (userID) => { return true },
					value: "both",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "playful",
			disabled: () => {
				return false;
			}, // if true, button is greyed out
        },
        shockermodel: {
			name: "External Shocker",
			desc: "Which Shock API to use? Choices include Pishock",
			choices: [
				{
					name: "None",
					helptext: "*No Third-Party Shocker*",
					select_function: (userID) => { return true },
					value: "none",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Pishock",
					helptext: `Utilizing the Pishock API. Check menu choices for **Pishock Config**`,
					select_function: (userID) => { return true },
					value: "pishock",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "none",
			disabled: () => {
				return false;
			}, // if true, button is greyed out
		}
    },
    "Pishock Config": {
        pishockusername: {
			name: "Pishocker Configuration - Username",
			desc: "Set username to display when shocking you:",
			descmodal: "Write the exact username to shock as:",
			choices: [
				{
					name: "Set Username",
					helptext: "Displaying as **",
					helptextnone: "*No Shocker Username Set*",
					select_function: (userID) => {
						return false;
					},
					value: "None",
					style: ButtonStyle.Primary,
				},
			],
			customtext: (userID) => {
				return `Gagbot`;
			},
			placeholder: (userID) => {
				return `Gagbot`;
			},
            textvaluedisplay: (val) => {
                return `${val}**`;
            },
			menutype: "choice_textentry",
			default: (userID) => {
				return ``;
			},
			disabled: () => {
				return false;
			},
		},
        pishockname: {
			name: "Pishocker Configuration - Name",
			desc: "Name of the Pishocker:",
			descmodal: "Write the exact name of the shocker:",
			choices: [
				{
					name: "Set Name",
					helptext: "Shocker Name is **",
					helptextnone: "*No Shocker Name Set*",
					select_function: (userID) => {
						return false;
					},
					value: "None",
					style: ButtonStyle.Primary,
				},
			],
			customtext: (userID) => {
				return `Gagbot`;
			},
			placeholder: (userID) => {
				return `Gagbot`;
			},
            textvaluedisplay: (val) => {
                return `${val}**`;
            },
			menutype: "choice_textentry",
			default: (userID) => {
				return ``;
			},
			disabled: () => {
				return false;
			},
		},
        pishockcode: {
			name: "Pishocker Configuration - Code",
			desc: "Set the shocker's share code:",
			descmodal: "Copy-paste the shocker code:",
			choices: [
				{
					name: "Set Shocker Code",
					helptext: "Shocker Code: **",
					helptextnone: "*No Shocker Code Set*",
					select_function: (userID) => {
						return false;
					},
					value: "None",
					style: ButtonStyle.Primary,
				},
			],
			customtext: (userID) => {
				return `Shocker Code...`;
			},
			placeholder: (userID) => {
				return `Shocker Code...`;
			},
            textvaluedisplay: (val) => {
                return `${val}**`;
            },
			menutype: "choice_textentry",
			default: (userID) => {
				return ``;
			},
			disabled: () => {
				return false;
			},
		},
        pishockapikey: {
			name: "Pishocker Configuration - API Key",
			desc: "Set the shocker's API Key:",
			descmodal: "Copy-paste the API Key:",
			choices: [
				{
					name: "Set API Key",
					helptext: "API Key: **",
					helptextnone: "*No API Key Set*",
					select_function: (userID) => {
						return false;
					},
					value: "None",
					style: ButtonStyle.Primary,
				},
			],
			customtext: (userID) => {
				return `Shocker API Key...`;
			},
			placeholder: (userID) => {
				return `Shocker API Key...`;
			},
            textvaluedisplay: (val) => {
                return `${val}**`;
            },
			menutype: "choice_textentry",
			default: (userID) => {
				return ``;
			},
			disabled: () => {
				return false;
			},
		},
        pishockop: {
			name: "Pishocker Mode",
			desc: "Which Mode should the Pishockers operate as?",
			choices: [
				{
					name: "Shock",
					helptext: "Shock when triggered",
					select_function: (userID) => { return true },
					value: "0",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Vibrate",
					helptext: `Vibrate when Triggered`,
					select_function: (userID) => { return true },
					value: "1",
					style: ButtonStyle.Secondary,
				},
                {
					name: "Beep",
					helptext: `Beep when Triggered`,
					select_function: (userID) => { return true },
					value: "2",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "0",
			disabled: () => {
				return false;
			}, // if true, button is greyed out
		},
    },
	Arousal: {
		arousalsystem: {
			name: "Arousal System",
			desc: "Which Arousal system to use?",
			choices: [
				{
					name: "Off",
					helptext: "*Arousal disabled*",
					select_function: (userID) => {
                        clearArousal(userID)
                        removeToy(userID, userID, undefined, true);
					},
					value: 0,
					style: ButtonStyle.Danger,
					uname: "DisableVibes",
				},
				{
					name: "Static Arousal",
					helptext: "Static Arousal (when vibed)",
					select_function: (userID) => {
						return false;
					},
					value: 1,
					style: ButtonStyle.Secondary,
					uname: "StaticArousal",
				},
				{
					name: "Dynamic Arousal",
					helptext: "Dynamic Arousal",
					select_function: (userID) => {
						return false;
					},
					value: 2,
					style: ButtonStyle.Secondary,
					uname: "DynamicArousal",
				},
			],
			menutype: "choice",
			default: 2,
			disabled: () => {
				return false;
			}, // if true, button is greyed out
		},
		fumbling: {
			name: "Key Fumbling",
			desc: "Who can fumble your keys (from Arousal) and fail to unlock you?",
			choices: [
				{
					name: "Disabled",
					helptext: "*Fumbling is disabled*",
					select_function: (userID) => {
						return false;
					},
					value: "disabled",
					style: ButtonStyle.Danger,
					uname: "DisabledKeyFumbling",
				},
				{
					name: "Self Only",
					helptext: "Can fumble your own keys",
					select_function: (userID) => {
						return false;
					},
					value: "self",
					style: ButtonStyle.Secondary,
					uname: "KeyFumblingSelf",
				},
				{
					name: "Self and Others",
					helptext: "You and others can fumble your keys",
					select_function: (userID) => {
						return false;
					},
					value: "everyone",
					style: ButtonStyle.Secondary,
					uname: "KeyFumblingOthers",
				},
			],
			menutype: "choice",
			default: "self",
			disabled: () => {
				return false;
			}, // if true, button is greyed out
		},
		keyloss: {
			name: "Key Loss",
			desc: "Can fumbling keys cause the keys to be lost?",
			choices: [
				{
					name: "Disabled",
					helptext: "*Key Loss is disabled*",
					select_function: (userID) => {
						return false;
					},
					value: "disabled",
					style: ButtonStyle.Danger,
					uname: "KeyLossDisabled",
				},
				{
					name: "Enabled",
					helptext: "**Your keys can be lost**",
					select_function: (userID) => {
						return false;
					},
					value: "enabled",
					style: ButtonStyle.Secondary,
					uname: "KeyLoss",
				},
			],
			menutype: "choice",
			default: "disabled",
			disabled: (userID) => {
				return (process.configs && process.configs[userID] && process.configs[userID].fumbling == "disabled")
			}, // if true, button is greyed out
		},
		"blessed-luck": {
			name: "Blessed Luck",
			desc: "Should failed rolls from fumbling contribute to future rolls?",
			choices: [
				{
					name: "No",
					helptext: "*Blessed Luck is disabled*",
					select_function: (userID) => {
						return false;
					},
					value: "disabled",
					style: ButtonStyle.Danger,
					uname: "BlessedLuckDisabled",
				},
				{
					name: "Yes",
					helptext: "Failed rolls add to future success chance",
					select_function: (userID) => {
						return false;
					},
					value: "enabled",
					style: ButtonStyle.Secondary,
					uname: "BlessedLuck",
				},
			],
			menutype: "choice",
			default: "enabled",
			disabled: (userID) => {
				return (process.configs && process.configs[userID] && process.configs[userID].fumbling == "disabled")
			},
		},
		frustration: {
			name: "Frustration",
			desc: "Should time worn with chastity cause frustation? This will add additional chance to fumble and change arousal effects on speech.",
			choices: [
				{
					name: "Disabled",
					helptext: "*Frustration is disabled*",
					select_function: (userID) => {
						return false;
					},
					value: 0,
					style: ButtonStyle.Danger,
					uname: "FrustrationDisabled",
				},
				{
					name: "0.5x",
					helptext: "Frustration adds up to 50% over 2 months",
					select_function: (userID) => {
						return false;
					},
					value: 0.5,
					style: ButtonStyle.Secondary,
					uname: "Frustration05",
				},
				{
					name: "1x",
					helptext: "Frustration adds up to 50% over 1 month",
					select_function: (userID) => {
						return false;
					},
					value: 1,
					style: ButtonStyle.Secondary,
					uname: "Frustration1",
				},
				{
					name: "2x",
					helptext: "Frustration adds up to 50% over 2 weeks",
					select_function: (userID) => {
						return false;
					},
					value: 2,
					style: ButtonStyle.Secondary,
					uname: "Frustration2",
				},
				{
					name: "4x",
					helptext: "Frustration adds up to 50% over 1 week",
					select_function: (userID) => {
						return false;
					},
					value: 4,
					style: ButtonStyle.Secondary,
					uname: "Frustration4",
				},
				{
					name: "10x",
					helptext: "Frustration adds up to 50% over 3 days",
					select_function: (userID) => {
						return false;
					},
					value: 10,
					style: ButtonStyle.Secondary,
					uname: "Frustration10",
				},
				{
					name: "20x",
					helptext: "Frustration adds up to 50% over 1.5 days",
					select_function: (userID) => {
						return false;
					},
					value: 20,
					style: ButtonStyle.Secondary,
					uname: "Frustration20",
				},
			],
			menutype: "choice",
			default: 0,
			disabled: (userID) => {
				return (process.configs && process.configs[userID] && process.configs[userID].fumbling == "disabled")
			},
		},
        findkeymode: {
            name: "Find Keys",
            desc: "Whose fumbled keys can you discover?",
            choices: [
                {
                    name: "Only Mine",
                    helptext: "You will only be able to find keys for restraints you are the primary keyholder of",
                    select_function: (userID) => {
                        return false;
                    },
                    value: "self",
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Others",
                    helptext: "You will be able to find any fumbled keys. When you discover a key that isn't yours, you will return it after a short period of time.",
                    select_function: (userID) => {
                        return false;
                    },
                    value: "others",
                    style: ButtonStyle.Secondary
                },
            ],
            menutype: "choice",
            default: "self",
            disabled: (userID) => {
				return false;
			}, // if true, button is greyed out
        },
        ownrestraintfindkeymode: {
            name: "Find My Keys",
            desc: "Who can discover your fumbled keys?",
            choices: [
                {
                    name: "Only Keyholder",
                    helptext: "Only your keyholder can discover the keys to your restraints. Others may detect a sparkle.",
                    select_function: (userID) => {
                        return false;
                    },
                    value: "onlykh",
                    style: ButtonStyle.Primary
                },
                {
                    name: "Immediately",
                    helptext: "If others find your keys, they'll return them immediately.",
                    select_function: (userID) => {
                        return false;
                    },
                    value: 0,
                    style: ButtonStyle.Primary
                },
                {
                    name: "2 Minutes",
                    helptext: "Others can discover your keys and play with you for 2 minutes before automatically returning them.",
                    select_function: (userID) => {
                        return false;
                    },
                    value: 120000,
                    style: ButtonStyle.Secondary
                },
                {
                    name: "5 Minutes",
                    helptext: "Others can discover your keys and play with you for 5 minutes before automatically returning them.",
                    select_function: (userID) => {
                        return false;
                    },
                    value: 300000,
                    style: ButtonStyle.Secondary
                },
                {
                    name: "15 Minutes",
                    helptext: "Others can discover your keys and play with you for 15 minutes before automatically returning them.",
                    select_function: (userID) => {
                        return false;
                    },
                    value: 900000,
                    style: ButtonStyle.Secondary
                },
                {
                    name: "30 Minutes",
                    helptext: "Others can discover your keys and play with you for 30 minutes before automatically returning them.",
                    select_function: (userID) => {
                        return false;
                    },
                    value: 1800000,
                    style: ButtonStyle.Secondary
                },
            ],
            menutype: "choice",
            default: "onlykh",
            disabled: (userID) => {
				return false;
			}, // if true, button is greyed out
        },
		arousaleffectpotency: {
			name: "Arousal Effect Potency",
			desc: "How much should arousal modify your speech?",
			choices: [
				{
					name: "Very Little",
					helptext: "*33% of base*",
					select_function: (userID) => {
						return false;
					},
					value: 0.33,
					style: ButtonStyle.Secondary,
					uname: "ArousalEffect033",
				},
				{
					name: "Less",
					helptext: "*66% of base*",
					select_function: (userID) => {
						return false;
					},
					value: 0.66,
					style: ButtonStyle.Secondary,
					uname: "ArousalEffect066",
				},
				{
					name: "Normal",
					helptext: "100% of base",
					select_function: (userID) => {
						return false;
					},
					value: 1.0,
					style: ButtonStyle.Primary,
					uname: "ArousalEffect100",
				},
				{
					name: "More",
					helptext: "133% of base",
					select_function: (userID) => {
						return false;
					},
					value: 1.33,
					style: ButtonStyle.Primary,
					uname: "ArousalEffect133",
				},
				{
					name: "Much More",
					helptext: "166% of base",
					select_function: (userID) => {
						return false;
					},
					value: 1.66,
					style: ButtonStyle.Primary,
					uname: "ArousalEffect166",
				},
				{
					name: "Too Much...",
					helptext: "200% of base",
					select_function: (userID) => {
						return false;
					},
					value: 2.0,
					style: ButtonStyle.Danger,
					uname: "ArousalEffect200",
				},
			],
			menutype: "choice",
			default: 1.0,
			disabled: (userID) => {
				return (process.configs && process.configs[userID] && process.configs[userID].arousalsystem == 0)
			},
		},
        arousaldisplay: {
			name: "Arousal Display in Inspect",
			desc: "How should arousal be displayed in Inspect?",
			choices: [
				{
					name: "Bar",
					helptext: "Displays as a bar representing arousal % of orgasm threshold",
					select_function: (userID) => {
                        return false;
					},
					value: "bar",
					style: ButtonStyle.Secondary,
				},
                {
					name: "Description",
					helptext: "Displays as a roleplay flavor text",
					select_function: (userID) => {
                        return false;
					},
					value: "desc",
					style: ButtonStyle.Secondary,
				},
                {
					name: "Numbers",
					helptext: "Displays exact Arousal and Orgasm Threshold numbers",
					select_function: (userID) => {
                        return false;
					},
					value: "numbers",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "desc",
			disabled: () => {
				return false;
			}, // if true, button is greyed out
		},
	},
	General: {
		keygiving: {
			name: "Key Giving",
			desc: "Are keyholders allowed to give your keys to others? You must have DMs from this server turned on to utilize this option.",
			choices: [
				{
					name: "No",
					helptext: "*Key giving is disabled*",
					select_function: (userID) => {
						return false;
					},
					value: "disabled",
					style: ButtonStyle.Danger,
					uname: "KeyGivingDisabled",
				},
				{
					name: "Prompt",
					helptext: "You will be prompted for key transfers",
					select_function: (userID) => {
						return false;
					},
					value: "prompt",
					style: ButtonStyle.Secondary,
					uname: "KeyGivingPrompt",
				},
				{
					name: "Automatic",
					helptext: "⚠️ **You will accept keygiving requests automatically**",
					select_function: (userID) => {
						return false;
					},
					value: "auto",
					style: ButtonStyle.Secondary,
					uname: "KeyGivingAuto",
				},
			],
			menutype: "choice",
			default: "prompt",
			disabled: () => {
				return false;
			},
		},
		keycloning: {
			name: "Key Cloning",
			desc: "Are keyholders allowed to clone your keys for others? You must have DMs from this server turned on to utilize this option.",
			choices: [
				{
					name: "No",
					helptext: "*Key cloning is disabled*",
					select_function: (userID) => {
						return false;
					},
					value: "disabled",
					style: ButtonStyle.Danger,
					uname: "KeyCloningDisabled",
				},
				{
					name: "Prompt",
					helptext: "You will be prompted for key clones",
					select_function: (userID) => {
						return false;
					},
					value: "prompt",
					style: ButtonStyle.Secondary,
					uname: "KeyCloningPrompt",
				},
				{
					name: "Automatic",
					helptext: "⚠️ **You will accept key cloning requests automatically**",
					select_function: (userID) => {
						return false;
					},
					value: "auto",
					style: ButtonStyle.Secondary,
					uname: "KeyCloningAuto",
				},
			],
			menutype: "choice",
			default: "prompt",
			disabled: () => {
				return false;
			},
		},
        majorrestraint: {
            name: "Major Restraints from Others",
            desc: "Can others offer to put chastity, mittens, heavy bondage or masks on you? You must accept the prompt for it to be permitted unless that user has collar key access for you. You must have DMs from this server turned on to utilize this option.",
            choices: [
                {
					name: "No",
					helptext: "*Non-collar Keyholder major bondage will be rejected automatically*",
					select_function: (userID) => {
						return false;
					},
					value: "disabled",
					style: ButtonStyle.Danger,
					uname: "MajorRestraintDisabled",
				},
				{
					name: "Yes",
					helptext: "Others can offer to bind you",
					select_function: (userID) => {
						return false;
					},
					value: "enabled",
					style: ButtonStyle.Success,
					uname: "MajorRestraint",
				},
            ],
            menutype: "choice",
            default: "enabled",
            disabled: (userID) => {
				return false;
			}, // if true, button is greyed out
        },
		publicaccess: {
			name: "Public Access",
			desc: "Can you put on a free use collar or enable public access timelocks?",
			choices: [
				{
					name: "No",
					helptext: "*Public Access is disabled*",
					select_function: (userID) => {
						return false;
					},
					value: "disabled",
					style: ButtonStyle.Danger,
					uname: "PublicAccessDisabled",
				},
				{
					name: "Yes",
					helptext: "**⚠️ You can select public access options on collars and timelocks!**",
					select_function: (userID) => {
						return false;
					},
					value: "enabled",
					style: ButtonStyle.Success,
					uname: "PublicAccess",
				},
			],
			menutype: "choice",
			default: "disabled",
			disabled: (userID) => {
				return false;
			}, // if true, button is greyed out
		},
        removebondage: {
			name: "Prompt to Modify Non-Keyed Bondage",
			desc: "Should you be prompted for others to **/ungag** you, etc? You must have DMs from this server turned on to utilize this option.",
			choices: [
				{
					name: "Everyone",
					helptext: "Prompt for anyone to remove non-keyed bondage",
					select_function: (userID) => {
						return false;
					},
					value: "all",
					style: ButtonStyle.Secondary,
					uname: "RemoveBondagePrompt",
				},
				{
					name: "Everyone except Binder",
					helptext: "Prompt for anyone besides who put something on you",
					select_function: (userID) => {
						return false;
					},
					value: "all_binder",
					style: ButtonStyle.Secondary,
					uname: "RemoveBondageBinder",
				},
				{
					name: "Everyone except Binder and Keyholder(s)",
					helptext: "Prompt for anyone besides who put something on you or keyholders",
					select_function: (userID) => {
						return false;
					},
					value: "all_binder_and_keyholder",
					style: ButtonStyle.Secondary,
					uname: "RemoveBondageKeyholder",
				},
				{
					name: "Disabled",
					helptext: "Automatically allow bondage to be removed",
					select_function: (userID) => {
						return false;
					},
					value: "accept",
					style: ButtonStyle.Danger,
					uname: "RemoveBondageAuto",
				},
			],
			menutype: "choice",
			default: "accept",
			disabled: () => {
				return false;
			},
		},
        recordmessages: {
			name: "Record Messages",
			desc: "When modifying messages, can the bot temporarily record the original message contents?",
			choices: [
				{
					name: "No",
					helptext: "*Editing messages will use the edited contents*",
					select_function: (userID) => {
						return false;
					},
					value: "disabled",
					style: ButtonStyle.Danger,
					uname: "RecordMessagesDisabled",
				},
				{
					name: "Yes",
					helptext: "Editing Bot messages will use original contents",
					select_function: (userID) => {
						return false;
					},
					value: "enabled",
					style: ButtonStyle.Success,
					uname: "RecordMessages",
				},
			],
			menutype: "choice",
			default: "enabled",
			disabled: (userID) => {
				return false;
			}, // if true, button is greyed out
		},
        gagbotholdtimer: {
            name: "Gagbot Held Time",
            desc: "If your keys are found in Gagbot's possession, up to how long is Gagbot allowed to hold them?",
            choices: [
                {
                    name: "10 minutes",
                    helptext: "Only a short while...",
                    select_function: (userID) => {
                        return false;
                    },
                    value: 600000,
                    style: ButtonStyle.Secondary
                },
                {
                    name: "30 minutes",
                    helptext: "A little while!",
                    select_function: (userID) => {
                        return false;
                    },
                    value: 1800000,
                    style: ButtonStyle.Secondary
                },
                {
                    name: "60 minutes",
                    helptext: "A while!",
                    select_function: (userID) => {
                        return false;
                    },
                    value: 3600000,
                    style: ButtonStyle.Secondary
                },
                {
                    name: "3 hours",
                    helptext: "A *while!*",
                    select_function: (userID) => {
                        return false;
                    },
                    value: 10800000,
                    style: ButtonStyle.Secondary
                },
                {
                    name: "24 hours",
                    helptext: "A decent time",
                    select_function: (userID) => {
                        return false;
                    },
                    value: 86400000,
                    style: ButtonStyle.Danger
                },
                {
                    name: "72 hours",
                    helptext: "A long time",
                    select_function: (userID) => {
                        return false;
                    },
                    value: 259200000,
                    style: ButtonStyle.Danger
                },
            ],
            menutype: "choice",
			default: 600000,
			disabled: (userID) => {
				return false;
			}, // if true, button is greyed out
        },
		revokeconsent: {
			name: "Revoke Consent",
			desc: "Revoke your consent from the bot? You will need to consent again to bondage in the future.",
			choices: [
				{
					name: "Revoke",
					helptext: "*Revoking helptext that'll never be used lol*",
					select_function: (userID) => {
						return false;
					},
					value: "disabled",
					style: ButtonStyle.Danger,
					uname: "KeyGivingDisabled",
				},
			],
			menutype: "choice_revokeconsent",
			default: "disabled",
			disabled: () => {
				return false;
			},
		},
	},
	"Restraint Options": {
		dollvisorname: {
			name: "Doll Visor Name",
			desc: "Set a custom name for Doll Visor name tags.",
			descmodal: "What should your tag display as in Doll Visor? Your default Doll tag is CUSTOMTEXT.",
			choices: [
				{
					name: "Set Name",
					helptext: "Doll Visor name is set to ",
					helptextnone: "*Doll Visor name has not been set*",
					select_function: (userID) => {
						return false;
					},
					value: "None",
					style: ButtonStyle.Primary,
				},
			],
			customtext: (userID) => {
				return `DOLL-${userID.slice(-4)}`;
			},
			placeholder: (userID) => {
				return `DOLL-${userID.slice(-4)}`;
			},
            textvaluedisplay: (val) => {
                return val;
            },
			menutype: "choice_textentry",
			default: (userID) => {
				return `DOLL-${userID.slice(-4)}`;
			},
			disabled: () => {
				return false;
			},
		},
		dollvisorcolor: {
			name: "Doll Visor Color",
			desc: "Set the color your Doll Visor designation will display as.",
			choices: [
				{ name: "Gray", value: 30, style: ButtonStyle.Primary },
				{ name: "Red", value: 31, style: ButtonStyle.Primary },
				{ name: "Green", value: 32, style: ButtonStyle.Primary },
				{ name: "Yellow", value: 33, style: ButtonStyle.Primary },
				{ name: "Blue", value: 34, style: ButtonStyle.Primary },
				{ name: "Pink", value: 35, style: ButtonStyle.Primary },
				{ name: "Cyan", value: 36, style: ButtonStyle.Primary },
				{ name: "White", value: 37, style: ButtonStyle.Primary },
			],
			menutype: "choice_dollcolor",
			default: 34,
			disabled: () => {
				return false;
			},
		},
		dollforcedit: {
			name: "Doll Visor Forced Pronouns",
			desc: "Should the Doll Visor force you to use it/its pronouns when worn?",
			choices: [
				{
					name: "No",
					helptext: "*Doll Visor will not affect pronouns*",
					select_function: (userID) => {
						return false;
					},
					value: "disabled",
					style: ButtonStyle.Danger,
					uname: "DollVisorForcedNo",
				},
				{
					name: "Yes",
					helptext: "You will use it/its pronouns while wearing a visor",
					select_function: (userID) => {
						return false;
					},
					value: "enabled",
					style: ButtonStyle.Secondary,
					uname: "DollVisorForced",
				},
			],
			menutype: "choice",
			default: "enabled",
			disabled: (userID) => {
				return false;
			},
		},
		dollforcedprotocol: {
			name: "Doll Visor Forced Protocol",
			desc: "Should the Doll Visor punish you for speaking in first person?  Punishments escalate with each violation, and can apply mittens and heavy restraints!",
			choices: [
				{
					name: "No",
					helptext: "*Doll Visor will not punish the wearer*",
					select_function: (userID) => {
						return false;
					},
					value: "disabled",
					style: ButtonStyle.Danger,
					uname: "DollVisorPunishNo",
				},
				{
					name: "Warn",
					helptext: "Doll Visor will warn on violations, but not punish",
					select_function: (userID) => {
						return false;
					},
					value: "warning",
					style: ButtonStyle.Secondary,
					uname: "DollVisorPunishNo",
				},
				{
					name: "Yes",
					helptext: "Doll Visor will punish the wearer. This can apply mittens and heavy!",
					select_function: (userID) => {
						return false;
					},
					value: "enabled",
					style: ButtonStyle.Secondary,
					uname: "DollVisorPunish",
				},
			],
			menutype: "choice",
			default: "disabled",
			disabled: (userID) => {
				return false;
			},
		},
		dollpunishthresh: {
			name: "Doll Protocol Punishment Threshold",
			desc: "How many protocol violations before the Doll Visor punishes?",
			choices: [
				{
					name: "1 Violation",
					helptext: "Every violation is a punishment",
					select_function: (userID) => {
						return false;
					},
					value: 1,
					style: ButtonStyle.Danger,
					uname: "DollVisor1x",
				},
				{
					name: "2 Violations",
					helptext: "Every 2 violations",
					select_function: (userID) => {
						return false;
					},
					value: 2,
					style: ButtonStyle.Danger,
					uname: "DollVisor2x",
				},
				{
					name: "3 Violations",
					helptext: "Every 3 violations",
					select_function: (userID) => {
						return false;
					},
					value: 3,
					style: ButtonStyle.Secondary,
					uname: "DollVisor3x",
				},
				{
					name: "4 Violations",
					helptext: "Every 4 violations",
					select_function: (userID) => {
						return false;
					},
					value: 4,
					style: ButtonStyle.Secondary,
					uname: "DollVisor4x",
				},
				{
					name: "5 Violations",
					helptext: "Every 5 violations",
					select_function: (userID) => {
						return false;
					},
					value: 5,
					style: ButtonStyle.Secondary,
					uname: "DollVisor5x",
				},
			],
			menutype: "choice",
			default: 3,
			disabled: (userID) => {
				return false;
			},
		},
        dollpunishwords: {
			name: "Doll Protocol Forbidden Words",
			desc: "Punish for additional words",
			descmodal: "What words to punish for? Please provide a comma separated response (case insensitive):",
			choices: [
				{
					name: "Set Forbidden Words",
					helptext: "Forbidden words set to: ",
					helptextnone: "*No forbidden words*",
					select_function: (userID) => {
						return false;
					},
					value: "None",
					style: ButtonStyle.Primary,
				},
			],
			customtext: (userID) => {
				return `person,/h+u+m+a+n+/`;
			},
			placeholder: (userID) => {
				return `person,/h+u+m+a+n+/,grin`;
			},
            textvaluedisplay: (val) => {
                return (val ? val.join(", ") : "**None Set**")
            },
			menutype: "choice_textentry",
			default: (userID) => {
				return ``;
			},
			disabled: () => {
				return false;
			},
		},
        dronevisorname: {
			name: "⬡-Drone Visor Name",
			desc: "Set a custom name for ⬡-Drone Visor name tags.",
			descmodal: "What should your tag display as in the ⬡-Drone Visor? Your default ⬡-Drone tag is CUSTOMTEXT.",
			choices: [
				{
					name: "Set Name",
					helptext: "⬡-Drone Visor name is set to ",
					helptextnone: "*⬡-Drone Visor name has not been set*",
					select_function: (userID) => {
						return false;
					},
					value: "None",
					style: ButtonStyle.Primary,
				},
			],
			customtext: (userID) => {
				return `${userID.slice(-4)}`;
			},
			placeholder: (userID) => {
				return `${userID.slice(-4)}`;
			},
            textvaluedisplay: (val) => {
                return val;
            },
			menutype: "choice_textentry",
			default: (userID) => {
				return `${userID.slice(-4)}`;
			},
			disabled: () => {
				return false;
			},
		},
        engravedcollarname: {
			name: "Engraved Collar Name",
			desc: "Name while wearing engraved collar",
			descmodal: "What should your name be while collared with the Engraved Collar?",
			choices: [
				{
					name: "Set Name",
					helptext: "Engraved Collar Name set to: ",
					helptextnone: "*No Engraved Collar Name*",
					select_function: (userID) => {
						return false;
					},
					value: "None",
					style: ButtonStyle.Primary,
				},
			],
			customtext: (userID) => {
				return `Your name...`;
			},
			placeholder: (userID) => {
				return `Your name...`;
			},
            textvaluedisplay: (val) => {
                return val;
            },
			menutype: "choice_textentry",
			default: (userID) => {
				return ``;
			},
			disabled: () => {
				return false;
			},
		},
        deferentialgagsubject: {
			name: "Deferential Gag Subject",
			desc: "Name while wearing deferential gag",
			descmodal: "What subject should you use while deferential (pet, etc)?",
			choices: [
				{
					name: "Set Name",
					helptext: "Deferential subject set to: ",
					helptextnone: "*No Deferential Name*",
					select_function: (userID) => {
						return false;
					},
					value: "None",
					style: ButtonStyle.Primary,
				},
			],
			customtext: (userID) => {
				return `Your deferential name...`;
			},
			placeholder: (userID) => {
				return `Your deferential name...`;
			},
            textvaluedisplay: (val) => {
                return val;
            },
			menutype: "choice_textentry",
			default: (userID) => {
				return ``;
			},
			disabled: () => {
				return false;
			},
		},
        forbiddengagpunishwords: {
			name: "Forbidden Gag Forbidden Words",
			desc: "Gag the user on these words",
			descmodal: "What words to gag the user when saying:",
			choices: [
				{
					name: "Set Forbidden Words",
					helptext: "Forbidden words set to: ",
					helptextnone: "*No forbidden words*",
					select_function: (userID) => {
						return false;
					},
					value: "None",
					style: ButtonStyle.Primary,
				},
			],
			customtext: (userID) => {
				return `person,/h+u+m+a+n+/`;
			},
			placeholder: (userID) => {
				return `person,/h+u+m+a+n+/,grin`;
			},
            textvaluedisplay: (val) => {
                return (val ? val.join(", ") : "**None Set**")
            },
			menutype: "choice_textentry",
			default: (userID) => {
				return ``;
			},
			disabled: () => {
				return false;
			},
		},
        headpatrestraintpotency: {
			name: "Headpat Restraint Potency",
			desc: "How long should headpats affect their specific restraints?",
			choices: [
				{
					name: "0.5x",
					helptext: "Effects are half as long",
					select_function: (userID) => {
						return false;
					},
					value: 0.5,
					style: ButtonStyle.Secondary,
					uname: "headpatpotency05x",
				},
				{
					name: "1x",
					helptext: "Effects are standard length",
					select_function: (userID) => {
						return false;
					},
					value: 1,
					style: ButtonStyle.Secondary,
					uname: "headpatpotency1x",
				},
				{
					name: "2x",
					helptext: "Effects are twice as long",
					select_function: (userID) => {
						return false;
					},
					value: 2,
					style: ButtonStyle.Secondary,
					uname: "headpatpotency2x",
				},
                {
					name: "3x",
					helptext: "Effects are thrice as long",
					select_function: (userID) => {
						return false;
					},
					value: 3,
					style: ButtonStyle.Secondary,
					uname: "headpatpotency3x",
				},
			],
			menutype: "choice",
			default: 1,
			disabled: (userID) => {
				return false;
			},
		},
	},
    Content: {
        "wearabletags-latex": {
            name: "Latex",
            desc: "Slick, glossy and rubbery material",
            choices: [
				{
					name: "None",
					helptext: "*Others will not be able to put items of this tag on you*",
					select_function: (userID) => {
						return false;
					},
					value: "none",
					style: ButtonStyle.Danger,
				},
				{
					name: "Yes",
					helptext: "Items of this tag can be added to you",
					select_function: (userID) => {
						return false;
					},
					value: "enabled",
					style: ButtonStyle.Primary,
				},
                {
					name: "Preferred",
					helptext: "Items of this tag will have priority in random effects on you",
					select_function: (userID) => {
						return false;
					},
					value: "preferred",
					style: ButtonStyle.Success,
				},
			],
			menutype: "choice",
			default: "enabled",
			disabled: (userID) => {
				return false;
			},
        },
        "wearabletags-leather": {
            name: "Leather",
            desc: "Durable material made of hide",
            choices: [
				{
					name: "None",
					helptext: "*Others will not be able to put items of this tag on you*",
					select_function: (userID) => {
						return false;
					},
					value: "none",
					style: ButtonStyle.Danger,
				},
				{
					name: "Yes",
					helptext: "Items of this tag can be added to you",
					select_function: (userID) => {
						return false;
					},
					value: "enabled",
					style: ButtonStyle.Primary,
				},
                {
					name: "Preferred",
					helptext: "Items of this tag will have priority in random effects on you",
					select_function: (userID) => {
						return false;
					},
					value: "preferred",
					style: ButtonStyle.Success,
				},
			],
			menutype: "choice",
			default: "enabled",
			disabled: (userID) => {
				return false;
			},
        },
        "wearabletags-metal": {
            name: "Metal",
            desc: "Unyielding and strict, smooth and rigid",
            choices: [
				{
					name: "None",
					helptext: "*Others will not be able to put items of this tag on you*",
					select_function: (userID) => {
						return false;
					},
					value: "none",
					style: ButtonStyle.Danger,
				},
				{
					name: "Yes",
					helptext: "Items of this tag can be added to you",
					select_function: (userID) => {
						return false;
					},
					value: "enabled",
					style: ButtonStyle.Primary,
				},
                {
					name: "Preferred",
					helptext: "Items of this tag will have priority in random effects on you",
					select_function: (userID) => {
						return false;
					},
					value: "preferred",
					style: ButtonStyle.Success,
				},
			],
			menutype: "choice",
			default: "enabled",
			disabled: (userID) => {
				return false;
			},
        },
        "wearabletags-living": {
            name: "Living",
            desc: "Natural or otherwise animated",
            choices: [
				{
					name: "None",
					helptext: "*Others will not be able to put items of this tag on you*",
					select_function: (userID) => {
						return false;
					},
					value: "none",
					style: ButtonStyle.Danger,
				},
				{
					name: "Yes",
					helptext: "Items of this tag can be added to you",
					select_function: (userID) => {
						return false;
					},
					value: "enabled",
					style: ButtonStyle.Primary,
				},
                {
					name: "Preferred",
					helptext: "Items of this tag will have priority in random effects on you",
					select_function: (userID) => {
						return false;
					},
					value: "preferred",
					style: ButtonStyle.Success,
				},
			],
			menutype: "choice",
			default: "enabled",
			disabled: (userID) => {
				return false;
			},
        },
        "wearabletags-slime": {
            name: "Slime",
            desc: "Goopy or otherwise a puddle, not a static object",
            choices: [
				{
					name: "None",
					helptext: "*Others will not be able to put items of this tag on you*",
					select_function: (userID) => {
						return false;
					},
					value: "none",
					style: ButtonStyle.Danger,
				},
				{
					name: "Yes",
					helptext: "Items of this tag can be added to you",
					select_function: (userID) => {
						return false;
					},
					value: "enabled",
					style: ButtonStyle.Primary,
				},
                {
					name: "Preferred",
					helptext: "Items of this tag will have priority in random effects on you",
					select_function: (userID) => {
						return false;
					},
					value: "preferred",
					style: ButtonStyle.Success,
				},
			],
			menutype: "choice",
			default: "enabled",
			disabled: (userID) => {
				return false;
			},
        },
        "wearabletags-makeup": {
            name: "Makeup",
            desc: "Cosmetics applied to the face",
            choices: [
				{
					name: "None",
					helptext: "*Others will not be able to put items of this tag on you*",
					select_function: (userID) => {
						return false;
					},
					value: "none",
					style: ButtonStyle.Danger,
				},
				{
					name: "Yes",
					helptext: "Items of this tag can be added to you",
					select_function: (userID) => {
						return false;
					},
					value: "enabled",
					style: ButtonStyle.Primary,
				},
                {
					name: "Preferred",
					helptext: "Items of this tag will have priority in random effects on you",
					select_function: (userID) => {
						return false;
					},
					value: "preferred",
					style: ButtonStyle.Success,
				},
			],
			menutype: "choice",
			default: "enabled",
			disabled: (userID) => {
				return false;
			},
        },
        "wearabletags-confined": {
            name: "Confined",
            desc: "Being placed into cramped and limited movement spaces",
            choices: [
				{
					name: "None",
					helptext: "*Others will not be able to put items of this tag on you*",
					select_function: (userID) => {
						return false;
					},
					value: "none",
					style: ButtonStyle.Danger,
				},
				{
					name: "Yes",
					helptext: "Items of this tag can be added to you",
					select_function: (userID) => {
						return false;
					},
					value: "enabled",
					style: ButtonStyle.Primary,
				},
                {
					name: "Preferred",
					helptext: "Items of this tag will have priority in random effects on you",
					select_function: (userID) => {
						return false;
					},
					value: "preferred",
					style: ButtonStyle.Success,
				},
			],
			menutype: "choice",
			default: "enabled",
			disabled: (userID) => {
				return false;
			},
        },
        "wearabletags-dimensional": {
            name: "Dimensional",
            desc: "Being digitized, portalled, or otherwise relocating body or parts to another dimension",
            choices: [
				{
					name: "None",
					helptext: "*Others will not be able to put items of this tag on you*",
					select_function: (userID) => {
						return false;
					},
					value: "none",
					style: ButtonStyle.Danger,
				},
				{
					name: "Yes",
					helptext: "Items of this tag can be added to you",
					select_function: (userID) => {
						return false;
					},
					value: "enabled",
					style: ButtonStyle.Primary,
				},
                {
					name: "Preferred",
					helptext: "Items of this tag will have priority in random effects on you",
					select_function: (userID) => {
						return false;
					},
					value: "preferred",
					style: ButtonStyle.Success,
				},
			],
			menutype: "choice",
			default: "enabled",
			disabled: (userID) => {
				return false;
			},
        },
        "wearabletags-pet": {
            name: "Pet",
            desc: "Restraints treating you like a pet",
            choices: [
				{
					name: "None",
					helptext: "*Others will not be able to put items of this tag on you*",
					select_function: (userID) => {
						return false;
					},
					value: "none",
					style: ButtonStyle.Danger,
				},
				{
					name: "Yes",
					helptext: "Items of this tag can be added to you",
					select_function: (userID) => {
						return false;
					},
					value: "enabled",
					style: ButtonStyle.Primary,
				},
                {
					name: "Preferred",
					helptext: "Items of this tag will have priority in random effects on you",
					select_function: (userID) => {
						return false;
					},
					value: "preferred",
					style: ButtonStyle.Success,
				},
			],
			menutype: "choice",
			default: "enabled",
			disabled: (userID) => {
				return false;
			},
        },
		"wearabletags-piercing": {
            name: "Piercing",
            desc: "Piercings, be it tongue, nose, or body",
            choices: [
				{
					name: "None",
					helptext: "*Others will not be able to put items of this tag on you*",
					select_function: (userID) => {
						return false;
					},
					value: "none",
					style: ButtonStyle.Danger,
				},
				{
					name: "Yes",
					helptext: "Items of this tag can be added to you",
					select_function: (userID) => {
						return false;
					},
					value: "enabled",
					style: ButtonStyle.Primary,
				},
                {
					name: "Preferred",
					helptext: "Items of this tag will have priority in random effects on you",
					select_function: (userID) => {
						return false;
					},
					value: "preferred",
					style: ButtonStyle.Success,
				},
			],
			menutype: "choice",
			default: "enabled",
			disabled: (userID) => {
				return false;
			},
        },
        "wearabletags-chastity": {
            name: "Chastity",
            desc: "Restraints which restrict access to genitals",
            choices: [
				{
					name: "None",
					helptext: "*Others will not be able to put items of this tag on you*",
					select_function: (userID) => {
						return false;
					},
					value: "none",
					style: ButtonStyle.Danger,
				},
				{
					name: "Yes",
					helptext: "Items of this tag can be added to you",
					select_function: (userID) => {
						return false;
					},
					value: "enabled",
					style: ButtonStyle.Primary,
				},
                {
					name: "Preferred",
					helptext: "Items of this tag will have priority in random effects on you",
					select_function: (userID) => {
						return false;
					},
					value: "preferred",
					style: ButtonStyle.Success,
				},
			],
			menutype: "choice",
			default: "enabled",
			disabled: (userID) => {
				return false;
			},
        },
    },
	Extreme: {
		"extreme-heavy-doll_processing": {
			name: "Heavy - Doll Processing Facility",
			desc: "Creates Dolls by applying Cyber Doll restraints and appropriate gear",
			prompttext: `Doll Processing involves removing all clothing from the wearer. **Everything that isn't locked will be designated to be removed, with a handful of Doll specific exceptions.**\n\nAdditionally, the Facility will apply various restraints, including a chastity belt, chastity bra, collar and a doll visor. Where possible, this will be keyed to the person who put you in the facility, or yourself.`,
			choices: [
				{
					name: "Disabled",
					helptext: "*Doll Processing is disabled*",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Prompt",
					helptext: "You will be prompted when this is put on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Prompt",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Prompt (Others)",
					helptext: "You will be prompted when others put this on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "PromptOthers",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Enabled",
					helptext: "⚠️ You will automatically accept this restraint",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "Prompt",
			disabled: () => {
				return false;
			},
		},
		"extreme-heavy-costumer_mimic": {
			name: "Heavy - Costumer Mimic",
			desc: "Changes you into a themed outfit. Can include other extreme restraints.",
			prompttext: `Costumer Mimics can change you into a a random outfit, which may include other extreme restraints such as the Polite Sub gag. The resulting outfit does not adjust to anything worn and cannot be influenced once tossed in.`,
			choices: [
				{
					name: "Disabled",
					helptext: "*Costumer Mimics are disabled*",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Prompt",
					helptext: "You will be prompted when this is put on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Prompt",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Prompt (Others)",
					helptext: "You will be prompted when others put this on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "PromptOthers",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Enabled",
					helptext: "⚠️ You will automatically accept this restraint",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "Prompt",
			disabled: () => {
				return false;
			},
		},
		"extreme-heavy-costumer_mimic_latex": {
			name: "Heavy - Costumer Mimic (Latex)",
			desc: "Changes you into a latex themed outfit. Can include other extreme restraints.",
			prompttext: `Costumer Mimics can change you into a a random outfit, which may include other extreme restraints such as the Polite Sub gag. The resulting outfit does not adjust to anything worn and cannot be influenced once tossed in.`,
			choices: [
				{
					name: "Disabled",
					helptext: "*Costumer Mimics are disabled*",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Prompt",
					helptext: "You will be prompted when this is put on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Prompt",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Prompt (Others)",
					helptext: "You will be prompted when others put this on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "PromptOthers",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Enabled",
					helptext: "⚠️ You will automatically accept this restraint",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "Prompt",
			disabled: () => {
				return false;
			},
		},
        "extreme-heavy-costumer_mimic_chaos": {
			name: "Heavy - Costumer Mimic (Chaos)",
			desc: "Changes you into a randomized outfit. Will respect Content settings.",
			prompttext: `Costumer Mimics can change you into a a random outfit, which may include other extreme restraints such as the Polite Sub gag. The resulting outfit does not adjust to anything worn and cannot be influenced once tossed in.`,
			choices: [
				{
					name: "Disabled",
					helptext: "*Costumer Mimics are disabled*",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Prompt",
					helptext: "You will be prompted when this is put on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Prompt",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Prompt (Others)",
					helptext: "You will be prompted when others put this on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "PromptOthers",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Enabled",
					helptext: "⚠️ You will automatically accept this restraint",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "Prompt",
			disabled: () => {
				return false;
			},
		},
        "extreme-mask-dollmaker_visor": {
			name: "Mask - Dollmaker's Visor",
			desc: "Forces DOLL-#### syntax, it/its pronouns and Doll Protocol.",
			prompttext: `The Dollmaker's Visor is a variant of the Doll Visor as it was originally designed. It will deliberately ignore your customizations for visors and enforce the following settings:\n-Doll Name will be DOLL-####\n-Pronouns will be it/its\n-Punishment Protocol will be set to WARN, if it is disabled\n-Punishment Threshold will be set to 2`,
			choices: [
				{
					name: "Disabled",
					helptext: "*Dollmaker's Visor is disabled*",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Prompt",
					helptext: "You will be prompted when this is put on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Prompt",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Prompt (Others)",
					helptext: "You will be prompted when others put this on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "PromptOthers",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Enabled",
					helptext: "⚠️ You will automatically accept this restraint",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "Prompt",
			disabled: () => {
				return false;
			},
		},
        "extreme-mask-gagharness": {
			name: "Mask - Lockable Gag Harness",
			desc: "Prevents removing the associated gag and is locked to the person who puts it on.",
			prompttext: `The Lockable Gag Harness will prevent removing the specific gag it's associated with until the keyholder removes it. This key cannot be transferred by any means, and the gag can only be adjusted while it is worn.`,
			choices: [
				{
					name: "Disabled",
					helptext: "*Gag Harness is disabled*",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Prompt",
					helptext: "You will be prompted when this is put on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Prompt",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Prompt (Others)",
					helptext: "You will be prompted when others put this on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "PromptOthers",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Enabled",
					helptext: "⚠️ You will automatically accept this restraint",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "Prompt",
			disabled: () => {
				return false;
			},
		},
        "extreme-collar-collarheadpatvuln": {
			name: "Collar - Headpat Vulnerability",
			desc: "Sets to Free Use when headpatted",
			prompttext: `The Collar of Headpat Vulnerability will set your collar to public access for 5 minutes when hit with a critical headpat.`,
			choices: [
				{
					name: "Disabled",
					helptext: "*Headpat Vulnerability Collar is disabled*",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Prompt",
					helptext: "You will be prompted when this is put on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Prompt",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Prompt (Others)",
					helptext: "You will be prompted when others put this on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "PromptOthers",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Enabled",
					helptext: "⚠️ You will automatically accept this restraint",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "Prompt",
			disabled: () => {
				return false;
			},
		},
        "extreme-collar-sponsorcollar": {
			name: "Collar - Sponsorship Collar",
			desc: "Appends messages with a sponsor",
			prompttext: `The Sponsorship Collar will give your messages an increasing chance to tack on a random, kink themed sponsor.`,
			choices: [
				{
					name: "Disabled",
					helptext: "*Sponsorship Collar is disabled*",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Prompt",
					helptext: "You will be prompted when this is put on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Prompt",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Prompt (Others)",
					helptext: "You will be prompted when others put this on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "PromptOthers",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Enabled",
					helptext: "⚠️ You will automatically accept this restraint",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "Prompt",
			disabled: () => {
				return false;
			},
		},
        "extreme-collar-hornyshockcollar": {
			name: "Collar - Horny Shock Collar",
			desc: "Cuts speech short randomly while horny",
			prompttext: `The Horny Shock Collar will shock you when speaking while horny sometimes, in increasing frequency the hornier you are.`,
			choices: [
				{
					name: "Disabled",
					helptext: "*Horny Shock Collar is disabled*",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Prompt",
					helptext: "You will be prompted when this is put on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Prompt",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Prompt (Others)",
					helptext: "You will be prompted when others put this on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "PromptOthers",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Enabled",
					helptext: "⚠️ You will automatically accept this restraint",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "Prompt",
			disabled: () => {
				return false;
			},
		},
        "extreme-collar-remoteshockcollar": {
			name: "Collar - Remote Shock Collar",
			desc: "Allows the Shock right-click command",
			prompttext: `The Remote Control Shock Collar allows anybody who can access your collar to shock you using the Apps "Shock" command when right clicking your user tag.`,
			choices: [
				{
					name: "Disabled",
					helptext: "*Remote Control Shock Collar is disabled*",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Prompt",
					helptext: "You will be prompted when this is put on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Prompt",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Prompt (Others)",
					helptext: "You will be prompted when others put this on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "PromptOthers",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Enabled",
					helptext: "⚠️ You will automatically accept this restraint",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "Prompt",
			disabled: () => {
				return false;
			},
		},
		"extreme-gag-politeSub": {
			name: "Gag - Polite Sub",
			desc: "Enforces the use of Honorifics to speak",
			prompttext: `Polite Sub Gags will force you to address people with honorifics. Examples of this include "Miss," "Sir", "Lady", "Administrator" and so on. Failing to put an honorific in your message will result in the entire message being discarded for a submissive emote instead.`,
			choices: [
				{
					name: "Disabled",
					helptext: "*Polite Sub Gag is disabled*",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Prompt",
					helptext: "You will be prompted when this is put on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Prompt",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Prompt (Others)",
					helptext: "You will be prompted when others put this on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "PromptOthers",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Enabled",
					helptext: "⚠️ You will automatically accept this restraint",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "Prompt",
			disabled: () => {
				return false;
			},
		},
		"extreme-gag-goodSub": {
			name: "Gag - Good Sub",
			desc: "Fully prevents communication, forced deferent speech",
			prompttext: `Good Sub gags will fully prevent you from saying anything meaningful. All speech is forced into phrases that demonstrate submissiveness towards owners.`,
			choices: [
				{
					name: "Disabled",
					helptext: "*Good Sub Gag is disabled*",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Prompt",
					helptext: "You will be prompted when this is put on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Prompt",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Prompt (Others)",
					helptext: "You will be prompted when others put this on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "PromptOthers",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Enabled",
					helptext: "⚠️ You will automatically accept this restraint",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "Prompt",
			disabled: () => {
				return false;
			},
		},
		"extreme-gag-clockmaker": {
			name: "Gag - Clockmaker's Gag",
			desc: "Limits communication to regular intervals",
			prompttext: `The Clockmaker's Gag will force you to speak only in regular timed intervals.`,
			choices: [
				{
					name: "Disabled",
					helptext: "*Clockmaker's Gag is disabled*",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Prompt",
					helptext: "You will be prompted when this is put on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Prompt",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Prompt (Others)",
					helptext: "You will be prompted when others put this on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "PromptOthers",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Enabled",
					helptext: "⚠️ You will automatically accept this restraint",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "Prompt",
			disabled: () => {
				return false;
			},
		},
        "extreme-gag-sorry": {
			name: "Gag - Sorry Gag",
			desc: "Prevents apologies, forcing positive affirmations",
			prompttext: `The Sorry gag will suppress many forms of "sorry" and force you to instead say something positive about yourself.`,
			choices: [
				{
					name: "Disabled",
					helptext: "*Sorry Gag is disabled*",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Prompt",
					helptext: "You will be prompted when this is put on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Prompt",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Prompt (Others)",
					helptext: "You will be prompted when others put this on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "PromptOthers",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Enabled",
					helptext: "⚠️ You will automatically accept this restraint",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "Prompt",
			disabled: () => {
				return false;
			},
		},
        "extreme-gag-headpatslut": {
			name: "Gag - Headpat Slut",
			desc: "Fully prevents communication unless headpatted",
			prompttext: `The Headpat Slut gag will only permit speech for two minutes after receiving a headpat.`,
			choices: [
				{
					name: "Disabled",
					helptext: "*Headpat Slut Gag is disabled*",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Prompt",
					helptext: "You will be prompted when this is put on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Prompt",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Prompt (Others)",
					helptext: "You will be prompted when others put this on you",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "PromptOthers",
					style: ButtonStyle.Secondary,
				},
				{
					name: "Enabled",
					helptext: "⚠️ You will automatically accept this restraint",
					select_function: (interaction, serverID) => {
						return false;
					},
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice",
			default: "Prompt",
			disabled: () => {
				return false;
			},
		},
	},
	Server: {
		"server-allowgags": {
			name: "Allow Gags",
			desc: "Allows **/gag** and **/ungag**",
			choices: [
				{
					name: "Disabled",
					helptext: "*Gags are disabled*",
					select_function: (interaction, serverID) => {
						return false;
					}, // We will need to have this update commands
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Enabled",
					helptext: "✔️ Gags are enabled",
					select_function: (interaction, serverID) => {
						return false;
					}, // We will need to have this update commands
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice_server",
			default: "Enabled",
			disabled: () => {
				return false;
			},
		},
		"server-allowmitten": {
			name: "Allow Gags",
			desc: "Allows **/mitten** and **/unmitten**",
			choices: [
				{
					name: "Disabled",
					helptext: "*Mittens are disabled*",
					select_function: (interaction, serverID) => {
						return false;
					}, // We will need to have this update commands
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Enabled",
					helptext: "✔️ Mittens are enabled",
					select_function: (interaction, serverID) => {
						return false;
					}, // We will need to have this update commands
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice_server",
			default: "Enabled",
			disabled: () => {
				return false;
			},
		},
		"server-allowvibe": {
			name: "Allow Vibes",
			desc: "Allows **/vibe** and **/unvibe**",
			choices: [
				{
					name: "Disabled",
					helptext: "*Vibrators are disabled*",
					select_function: (interaction, serverID) => {
						return false;
					}, // We will need to have this update commands
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Enabled",
					helptext: "✔️ Vibrators are enabled",
					select_function: (interaction, serverID) => {
						return false;
					}, // We will need to have this update commands
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice_server",
			default: "Enabled",
			disabled: () => {
				return false;
			},
		},
		"server-allowchastity": {
			name: "Allow Chastity",
			desc: "Allows **/chastity** and **/unchastity**",
			choices: [
				{
					name: "Disabled",
					helptext: "*Chastity is disabled*",
					select_function: (interaction, serverID) => {
						return false;
					}, // We will need to have this update commands
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Enabled",
					helptext: "✔️ Chastity is enabled",
					select_function: (interaction, serverID) => {
						return false;
					}, // We will need to have this update commands
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice_server",
			default: "Enabled",
			disabled: () => {
				return false;
			},
		},
		"server-allowcorset": {
			name: "Allow Corsets",
			desc: "Allows **/corset** and **/uncorset**",
			choices: [
				{
					name: "Disabled",
					helptext: "*Corsets are disabled*",
					select_function: (interaction, serverID) => {
						return false;
					}, // We will need to have this update commands
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Enabled",
					helptext: "✔️ Corsets are enabled",
					select_function: (interaction, serverID) => {
						return false;
					}, // We will need to have this update commands
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice_server",
			default: "Enabled",
			disabled: () => {
				return false;
			},
		},
		"server-allowhead": {
			name: "Allow Headwear",
			desc: "Allows **/mask** and **/unmask**",
			choices: [
				{
					name: "Disabled",
					helptext: "*Headgear is disabled*",
					select_function: (interaction, serverID) => {
						return false;
					}, // We will need to have this update commands
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Enabled",
					helptext: "✔️ Headgear is enabled",
					select_function: (interaction, serverID) => {
						return false;
					}, // We will need to have this update commands
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice_server",
			default: "Enabled",
			disabled: () => {
				return false;
			},
		},
		"server-allowapparel": {
			name: "Allow Apparel",
			desc: "Allows **/wear** and **/unwear**",
			choices: [
				{
					name: "Disabled",
					helptext: "*Apparel is disabled*",
					select_function: (interaction, serverID) => {
						return false;
					}, // We will need to have this update commands
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Enabled",
					helptext: "✔️ Apparel is enabled",
					select_function: (interaction, serverID) => {
						return false;
					}, // We will need to have this update commands
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice_server",
			default: "Enabled",
			disabled: () => {
				return false;
			},
		},
		"server-refreshcmd": {
			name: "REFRESH COMMANDS",
			desc: `commands`,
			menutype: "choice_server_refreshcmd",
			default: [],
			disabled: () => {
				return false;
			},
		},
		"server-channelspermitted": {
			name: "Allowed Channels",
			desc: `Which channels to allow Gagbot to interact with. Gagbot __MUST__ have **Manage Messages** and **Manage Webhooks** permissions in the channel.`,
			menutype: "choice_server_channels",
			default: [],
			disabled: () => {
				return false;
			},
		},
		"server-safewordroleid": {
			name: "Safeword Role",
			desc: "Which role must be assigned to self reset with **/reset**",
			menutype: "choice_server_role",
			default: "",
			disabled: () => {
				return false;
			},
		},
		// And so on for other features
	},
	Bot: {
		"bot-enablebot": {
			name: "Global Enable Bot",
			desc: "Should the bot be active and respond to messages?",
			choices: [
				{
					name: "Disabled",
					helptext: "*Bot will not respond to messages*",
					select_function: (userID) => {
						return false;
					}, // We will need to have this update commands
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Enabled",
					helptext: "✔️ Bot responds to messages",
					select_function: (userID) => {
						return false;
					}, // We will need to have this update commands
					value: "Enabled",
					style: ButtonStyle.Success,
				},
			],
			menutype: "choice_bot",
			default: "Enabled",
			disabled: () => {
				return false;
			},
		},
		"bot-allownewsetup": {
			name: "Allow New Setups",
			desc: "Can server owners set this bot up on a new guild?",
			choices: [
				{
					name: "Disabled",
					helptext: "*Bot will not allow new setups except from you*",
					select_function: (userID) => {
						return false;
					}, // We will need to have this update commands
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Enabled",
					helptext: "⚠️ Bot will allow new setups if added to server",
					select_function: (userID) => {
						return false;
					}, // We will need to have this update commands
					value: "Enabled",
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice_bot",
			default: "Disabled",
			disabled: () => {
				return false;
			},
		},
		"bot-timetickrate": {
			name: "Time Tick Rate",
			desc: "How fast to calculate arousal and timelocks?",
			choices: [
				{
					name: "200ms",
					helptext: "***Every 200 milliseconds (may lag)***",
					select_function: () => {
						return false;
					}, // We will need to update tick rate with this
					value: 200,
					style: ButtonStyle.Danger,
				},
				{
					name: "500ms",
					helptext: "***Every 500 milliseconds (may lag)***",
					select_function: () => {
						return false;
					}, // We will need to update tick rate with this
					value: 500,
					style: ButtonStyle.Danger,
				},
				{
					name: "1 Second",
					helptext: "*Every second (may lag)*",
					select_function: () => {
						return false;
					}, // We will need to update tick rate with this
					value: 1000,
					style: ButtonStyle.Danger,
				},
				{
					name: "2 Seconds",
					helptext: "Every 2 seconds",
					select_function: () => {
						return false;
					}, // We will need to update tick rate with this
					value: 2000,
					style: ButtonStyle.Secondary,
				},
				{
					name: "5 Seconds",
					helptext: "Every 5 seconds",
					select_function: () => {
						return false;
					}, // We will need to update tick rate with this
					value: 5000,
					style: ButtonStyle.Secondary,
				},
				{
					name: "10 Seconds",
					helptext: "Every 10 seconds",
					select_function: () => {
						return false;
					}, // We will need to update tick rate with this
					value: 10000,
					style: ButtonStyle.Secondary,
				},
				{
					name: "30 Seconds",
					helptext: "Every 30 seconds",
					select_function: () => {
						return false;
					}, // We will need to update tick rate with this
					value: 30000,
					style: ButtonStyle.Secondary,
				},
			],
			menutype: "choice_bot",
			default: 2000,
			disabled: () => {
				return false;
			},
		},
        "bot-allowkeyfinding": {
			name: "Allow Keyfinding",
			desc: "Should the bot allow users to find keys when sending messages?",
			choices: [
				{
					name: "Disabled",
					helptext: "*Users will not be able to find keys*",
					select_function: (userID) => {
						return false;
					}, // We will need to have this update commands
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Enabled",
					helptext: "✔️ Users can find keys",
					select_function: (userID) => {
						return false;
					}, // We will need to have this update commands
					value: "Enabled",
					style: ButtonStyle.Success,
				},
			],
			menutype: "choice_bot",
			default: "Enabled",
			disabled: () => {
				return false;
			},
		},
        "bot-allowfumbles": {
			name: "Allow Fumbling",
			desc: "Should the bot allow users to fumble their keys?",
			choices: [
				{
					name: "Disabled",
					helptext: "*Users will not be able to fumble their keys*",
					select_function: (userID) => {
                        // Purge all fumbled keys
						let processvars = ["collar", "chastity", "chastitybra"];
                        processvars.forEach((pv) => {
                            if (process[pv] == undefined) { process[pv] = {} }
                            Object.entries(process[pv]).forEach((en) => {
                                if (en[1]?.fumbled) {
                                    delete en[1].fumbled;
                                }
                            })
                        })
					}, // We will need to have this update commands
					value: "Disabled",
					style: ButtonStyle.Danger,
				},
				{
					name: "Enabled",
					helptext: "✔️ Users can fumble keys",
					select_function: (userID) => {
						return false;
					}, // We will need to have this update commands
					value: "Enabled",
					style: ButtonStyle.Success,
				},
			],
			menutype: "choice_bot",
			default: "Disabled",
			disabled: () => {
				return false;
			},
		},
	},
};

exports.configoptions = configoptions;