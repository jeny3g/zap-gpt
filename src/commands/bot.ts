import { Whatsapp } from "venom-bot";
import { BaseCommand } from "../repositories/BaseCommand";
import { openai } from "../server";

export class Bot extends BaseCommand {
  public async run(client: Whatsapp, message: any) {
    const question = message.text.substring(message.text.indexOf(" "));
    this.getDavinciResponse(question).then((response) => {
      /*
       * Faremos uma validação no message.from
       * para caso a gente envie um comando
       * a response não seja enviada para
       * nosso próprio número e sim para
       * a pessoa ou grupo para o qual eu enviei
       */
      client.sendText(
        message.from === process.env.BOT_NUMBER ? message.to : message.from,
        response
      );
    });
  }

  private getDavinciResponse = async (clientText: string) => {
    const options = {
      model: "text-davinci-003", // Modelo GPT a ser usado
      prompt: clientText, // Texto enviado pelo usuário
      temperature: 1, // Nível de variação das respostas geradas, 1 é o máximo
      max_tokens: 4000, // Quantidade de tokens (palavras) a serem retornadas pelo bot, 4000 é o máximo
    };

    try {
      const response = await openai.createCompletion(options);
      let botResponse = "";
      response.data.choices.forEach(({ text }) => {
        botResponse += text;
      });
      return `Chat GPT 🤖\n\n ${botResponse.trim()}`;
    } catch (e) {
      return `❌ OpenAI Response Error: ${e.response.data.error.message}`;
    }
  };
}
