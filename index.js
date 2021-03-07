var chrome = require('selenium-webdriver/chrome');
var webdriver = require('selenium-webdriver');

const Discord = require('discord.js');
const client = new Discord.Client();
let channel;
let dataChannel;
let dataMessage;

let options = new chrome.Options();
options.setChromeBinaryPath(process.env.CHROME_BINARY_PATH);

options.addArguments("--headless");
options.addArguments("--disable-gpu");
options.addArguments("--no-sandbox");

client.on('ready', () => {
    channel = client.channels.cache.get("813005277708288060");
    channel2 = client.channels.cache.get("818088101498322945");
    dataChannel = client.channels.cache.get("814506268415885323");
    dataChannel.messages.fetch("817374127429517353")
    .then(message => {
        dataMessage = message;
    });
    setTimeout(func, 10000);
});

let driver;
let serviceBuilder = new chrome.ServiceBuilder(process.env.CHROME_DRIVER_PATH);

func = async () => {
    try {
        driver = await new webdriver.Builder()
        .forBrowser(webdriver.Browser.CHROME)
        .setChromeOptions(options)
        .setChromeService(serviceBuilder)
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
            channel.send(message.replace("보리님", "<@353859042583642122>").replace(/헤주주님|오리님/, "<@743148855008297032>").replace(/화운님|에린님/, "<@477129777426333727>"));
            channel2.send(message.replace(/레이챌님|레이첼님|폴라폭스님|폴라팍스님|북극여우님/, "<@772809429476704267>"));
        }
    } catch (e) {
        driver.quit();
        func();
    }
}
client.login(process.env.BOT_TOKEN);
