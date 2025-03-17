import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import * as dotenv from "dotenv";
import Groq from "groq-sdk";
dotenv.config();

const token = process.env.BOT_TOKEN;
const groqApiKey = process.env.GROQ_API_KEY;

if (!token) {
  console.error("No token present");
  process.exit(1);
}

const groq = new Groq({ apiKey: groqApiKey });

const bot = new Telegraf(token);

bot.start((ctx) => {
  ctx.reply(
    "👋 Hi! I'm your GroqAI bot i have been designed by Samarjeet . Ask me anything, and I'll respond you."
  );
});

bot.help((ctx) => {
  ctx.reply("Sawal poochle ek , jawab dedega . Jyada dimaag mt chala");
});

bot.command("sex", (ctx) =>
  ctx.reply(
    "Kaam vgerah pr dhyaan dele bsdk .Din raat ladkibaazi choot chapata"
  )
);

bot.telegram.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "help", description: "Show help" },
  { command: "sex", description: "Try it!!" },
]);

bot.on(message("sticker"), async (ctx) => {
  try {
    await ctx.reply("👍");
    console.log("Received a sticker!");
  } catch (error) {
    console.error("Error handling sticker:", error);
  }
});

bot.on(message("text"), async (ctx) => {
  const userMessage = ctx.message.text;
  const processingMessage = await ctx.reply("Thinking...");

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage },
      ],
      max_tokens: 2000,
    });

    const botResponse = response.choices[0].message.content;

    await ctx.telegram.editMessageText(
      ctx.chat.id,
      processingMessage.message_id,
      undefined,
      botResponse || "No response generated."
    );
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      processingMessage.message_id,
      undefined,
      "Sorry, I encountered an error while processing your request. Please try again later."
    );
  }
});

bot.launch(() => {
  console.log("I am up and  running 🏃‍♀️ ");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
