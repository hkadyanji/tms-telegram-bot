## Telegram Bot for Tanzania Traffic Offense

A simple telegram bot to get traffic information for traffic infractions

To run it simply use the command below:

`denon run --allow-net --allow-read --allow-env --allow-sys app.ts`

### Access
You can access the bot by sending a message to `@tms_tz_bot`

### How it works
When using the telegram route, a use will prompt the bot by adding the motor plate number in the chat
The received plate number will be verified using regex
Then using puppeter and a cloud headless browser, the tms website will be opened and the plate number will be queried
The results will be scrapped and returned to the user via the chat functionality

### External Services:

1. [BrowserCloud] (https://browsercloud.io/) for browser automation for Puppeter
2. [Telegram] (https://core.telegram.org/bots/api) as a messaging client

### Deprecated:
1. [Whatsapp] (https://business.whatsapp.com/developers/developer-hub)

Whatsapp was used in the past, however favored telegram due to ease of deployment without stringent verification process.
