import { Whatsapp } from "venom-bot";
import { BaseCommand } from "../repositories/BaseCommand";
import { openai } from "../server";

export class Img extends BaseCommand {
  public async run(client: Whatsapp, message: any) {
    const imgDescription = message.text.substring(message.text.indexOf(" "));

    this.getDalleResponse(imgDescription, message).then((imgUrl) => {
      client.sendImage(
        message.from === process.env.BOT_NUMBER ? message.to : message.from,
        imgUrl,
        imgDescription,
        "Imagem gerada pela IA DALL-E 🤖"
      );
    });
  }

  private getDalleResponse = async (clientText: string) => {
    const options = {
      prompt: clientText, // Descrição da imagem
      n: 1, // Número de imagens a serem geradas
      size: "1024x1024", // Tamanho da imagem
    };

    try {
      const response = await openai.createImage(options);
      return response.data.data[0].url;
    } catch (e) {
      return `❌ OpenAI Response Error: ${e.response.data.error.message}`;
    }
  };
}
