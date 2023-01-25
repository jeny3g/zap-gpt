import { Whatsapp } from "venom-bot";

export abstract class BaseCommand {
  public abstract run(client: Whatsapp, message: any): Promise<void>;
}
