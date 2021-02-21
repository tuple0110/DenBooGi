require('chromedriver');
var webdriver = require('selenium-webdriver');

const Discord = require('discord.js');
const client = new Discord.Client();
let channel;

client.on('ready', () => {
    channel = client.channels.cache.get("813005277708288060");
    setTimeout(func, 10000);
});

let driver;

func = async () => {
    try {
         driver = await new webdriver.Builder()
        .forBrowser('chrome')
        .build();
        await driver.get('http://denvers.kro.kr:8123/');
        await driver.wait(webdriver.until.elementLocated(webdriver.By.className("messagelist")), Infinity);
        var old = "";
        var message = "";
        var messageRow;
        while (true) {
            await driver.wait(async () => {
                messageRow = await driver.findElements(webdriver.By.className("messagerow"));
                if (messageRow.length > 0) {
                    message = await messageRow[messageRow.length - 1].getText();
                    return message != old;
                } else {
                    return false;
                }
            }, Infinity);
            old = message;
            channel.send(message.replace("보리님", "<@353859042583642122>"));
        }
    } catch (e) {
        driver.quit();
        func();
    }
}
client.login(process.env.BOT_TOKEN);
