import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import { create, Whatsapp } from "venom-bot";
import { Bot } from "./commands/bot";
import { Img } from "./commands/img";

dotenv.config();

create({
  session: "Chat-GPT",
  multidevice: true,
})
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

const configuration = new Configuration({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.OPENAI_KEY,
});

export const openai = new OpenAIApi(configuration);

const commands = (client: Whatsapp, message: any) => {
  const iaCommands = {
    davinci3: "/bot",
    dalle: "/img",
  };

  let firstWord = message.text.substring(0, message.text.indexOf(" "));

  switch (firstWord) {
    case iaCommands.davinci3:
      const bot = new Bot();
      bot.run(client, message);
      break;

    case iaCommands.dalle:
      const img = new Img();
      img.run(client, message);
      break;
  }
};

async function start(client: Whatsapp) {
  client.onAnyMessage((message) => commands(client, message));
}
