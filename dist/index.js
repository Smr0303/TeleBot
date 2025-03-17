"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const filters_1 = require("telegraf/filters");
const dotenv = __importStar(require("dotenv"));
const groq_sdk_1 = __importDefault(require("groq-sdk"));
dotenv.config();
const token = process.env.BOT_TOKEN;
const groqApiKey = process.env.GROQ_API_KEY;
if (!token) {
    console.error("No token present");
    process.exit(1);
}
const groq = new groq_sdk_1.default({ apiKey: groqApiKey });
const bot = new telegraf_1.Telegraf(token);
bot.start((ctx) => {
    ctx.reply("👋 Hi! I'm your GroqAI bot i have been designed by Samarjeet . Ask me anything, and I'll respond you.");
});
bot.help((ctx) => {
    ctx.reply("Sawal poochle ek , jawab dedega . Jyada dimaag mt chala");
});
bot.command("click", (ctx) => ctx.reply(process.env.BAD_MESSAGE || ' '));
bot.telegram.setMyCommands([
    { command: "start", description: "Start the bot" },
    { command: "help", description: "Show help" },
    { command: "click", description: "Try it!!" },
]);
bot.on((0, filters_1.message)("sticker"), async (ctx) => {
    try {
        await ctx.reply("👍");
        console.log("Received a sticker!");
    }
    catch (error) {
        console.error("Error handling sticker:", error);
    }
});
bot.on((0, filters_1.message)("text"), async (ctx) => {
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
        await ctx.telegram.editMessageText(ctx.chat.id, processingMessage.message_id, undefined, botResponse || "No response generated.");
    }
    catch (error) {
        console.error("Error calling OpenAI API:", error);
        await ctx.telegram.editMessageText(ctx.chat.id, processingMessage.message_id, undefined, "Sorry, I encountered an error while processing your request. Please try again later.");
    }
});
bot.launch(() => {
    console.log("I am up and  running 🏃‍♀️ ");
});
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
//# sourceMappingURL=index.js.map