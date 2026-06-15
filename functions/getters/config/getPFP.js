const axios = require("axios");
const sharp = require("sharp");
const { markForSave } = require("../../other/markForSave");

/**********
 * Get the combined profile picture of the user, if their original one matches the one we have on file
 * 
 * - (guild member) member - The Guild Member object sending the message
 * - (mods) mods - Additional images to overlay in reverse order (not implemented yet)
 * ---
 * ##### Returns a string with the user's PFP URL to use
 **********/
async function getPFP(member, mods = []) {
    let imagelist = mods.slice(0);
    if (member.displayAvatarDecorationURL()) {
        imagelist.push(member.displayAvatarDecorationURL())
    }
    imagelist.push(member.displayAvatarURL())

    if (process.memberavatars == undefined) { process.memberavatars = {} }
    if (process.memberavatars[member.id]) {
        if (process.memberavatars[member.id].avatarURL == member.displayAvatarURL()) {
            if (process.memberavatars[member.id].decorationURL == member.displayAvatarDecorationURL()) {
                let modifiers = Object.keys(mods).join("")
                if (process.memberavatars[member.id][`${mods}link`]) {
                    return process.memberavatars[member.id][`${mods}link`]
                }
            }
        }
    }

    if ((mods.length == 0) && !member.displayAvatarDecorationURL()) { return member.displayAvatarURL() } // No decorations, no image enhancements

    try {
        let modifiers = Object.keys(mods).join("")
        console.log(`Creating image ${mods}link for ${member.displayName}`)

        // Get avatar decoration image
        let imgfetch = await fetch(member.displayAvatarDecorationURL())
        if (!imgfetch.ok) { console.log(`Error fetching Decoration URL: ${member.displayAvatarDecorationURL()}`)}
        let buffd = await Buffer.from(await imgfetch.arrayBuffer())

        let decorationimage = await sharp(buffd)
            .resize({
                fit: sharp.fit.contain,
                height: 288,
                width: 288
            })
            .toBuffer({ resolveWithObject: true })

        // Get Avatar Image
        imgfetch = await fetch(member.displayAvatarURL())
        if (!imgfetch.ok) { console.log(`Error fetching Avatar URL: ${member.displayAvatarURL()}`)}
        let buff = await Buffer.from(await imgfetch.arrayBuffer())

        let avatarimage = await sharp(buff)
            .resize({
                fit: sharp.fit.contain,
                height: 256,
                width: 256
            })
            .toBuffer({ resolveWithObject: true})

        // Put them all together!
        let almostfinalimage = await sharp({
            create: {
                width: 300,
                height: 300,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 0}
            }})
            .composite([
                {
                    input: avatarimage.data,
                    top: 16,
                    left: 16,
                },
                {
                    input: decorationimage.data,
                    top: 0,
                    left: 0
                }
            ])
            .png()
            .toBuffer()

        // Create another instance to shrink it, because apparently doing this cleanly in one sharp instance is too hard. 
        let finalimage = await sharp(almostfinalimage)
            .extract({
                top: 16,
                left: 16,
                width: 256,
                height: 256
            })
            .png()
            .toBuffer({ resolveWithObject: true })

        // Finally, make a payload and upload the image
        let imagepayload = new URLSearchParams({
            image: finalimage.data.toString('base64'),
            type: "base64"
        })
        let imgurupload = await axios.post('https://api.imgur.com/3/image', imagepayload, {
            headers: { 
                'Authorization': 'Client-ID 546c25a59c58ad7',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        let imgururl = imgurupload?.data?.data?.link;

        if (imgururl) {
            process.memberavatars[member.id] = {
                avatarURL: member.displayAvatarURL(),
                decorationURL: member.displayAvatarDecorationURL(),
                link: imgururl
            }

            markForSave("memberavatars");

            return imgururl;
        }
    }
    catch (err) {
        console.log(err);
        return member.displayAvatarURL();
    }

    return member.displayAvatarURL();
}

exports.getPFP = getPFP;