const functions = require('../functions.js')
const fetch = require('node-fetch')
const config = require('config')
module.exports = {
    name: 'bat',
    description: 'Check how much BAT is worth.',
    usage: 'STONKS',
    aliases: ['brave', 'stonks'],
    guildonly: false,
    devonly: false,
    args: false,
    modCommand: false,
    category: 'Misc',
    execute(message, args) {
        function handleResponse(response) {
            return response.json().then(function (json) {
                return response.ok ? json : Promise.reject(json);
            });
        }
        function handleError(error) {
            console.error(error);
        }
        function stonkify(percentage) {
            if (parseInt(percentage) >= 5)
                return `<:Merchant:681301737034088482> ${percentage}%`
            else if (Math.sign(percentage) == 1)
                return `<:stonks:635003250759958569> ${percentage}%`
            else
                return `<:stinks:639524149361901576> ${percentage}%`
        }
        function handleData(data) {
            const output = functions.newEmbed()
                .setTitle(data.name)
                .addField('EUR', data.price.substring(0, 6) + "€", true)
                .addField('USD', data.markets[2].price.substring(0, 6) + "$", true)
                .addField('Price Change', `\`1h\` - ${stonkify(data.delta_1h)}\n\`24h\` - ${stonkify(data.delta_24h)}\n\`7d\` - ${stonkify(data.delta_7d)}\n\`30d\` - ${stonkify(data.delta_30d)}`)
                .setFooter('Powered by coinlib.io')
            message.channel.send(output)
        }
        const url = `https://coinlib.io/api/v1/coin?key=${config.coinlibToken}&pref=EUR&symbol=BAT`,
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            };

        fetch(url, options).then(handleResponse)
            .then(handleData)
            .catch(handleError);

    },
};