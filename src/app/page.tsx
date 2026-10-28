"use client";

import { useState } from "react";
import rules from "./rules.json";

type Rule = {
  intent: string;
  keywords: string[];
  reply: string;
};

type Message = {
  id: number;
  sender: "bot" | "user";
  text: string;
};

const chatbotRules = rules as Rule[];

const greeting: Message = {
  id: 1,
  sender: "bot",
  text: "Assalam-o-Alaikum! 💕 Welcome to StyleMate Boutique. Ask me about dresses, prices, sizes, bridal wear, orders, or delivery!"
};

const quickQuestions = [
  "Casual dresses",
  "Formal dresses",
  "Prices",
  "Bridal collection",
  "Available sizes",
  "Delivery information"
];

function normalizeMessage(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

function getBotReply(message: string): string {
  const normalizedMessage = normalizeMessage(message);

  for (const rule of chatbotRules) {
    const matched = rule.keywords.some((keyword) => {
      const normalizedKeyword = normalizeMessage(keyword);

      const escapedKeyword = normalizedKeyword.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const pattern = new RegExp(
        `(^|[^a-z0-9])${escapedKeyword}($|[^a-z0-9])`,
        "i"
      );

      return pattern.test(normalizedMessage);
    });

    if (matched) {
      return rule.reply;
    }
  }

  return "Sorry, I couldn't understand your question. 😊 Please ask about our dresses, prices, sizes, orders, or delivery.";
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [input, setInput] = useState("");

  function sendMessage(text: string = input) {
    const userText = text.trim();

    if (!userText) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: userText
    };

    const botMessage: Message = {
      id: Date.now() + 1,
      sender: "bot",
      text: getBotReply(userText)
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
      botMessage
    ]);

    setInput("");
  }

  function clearChat() {
    setMessages([
      {
        ...greeting,
        id: Date.now()
      }
    ]);

    setInput("");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f0ed] p-4">
      <section className="flex h-[90vh] min-h-[550px] w-full max-w-5xl overflow-hidden rounded-3xl border border-[#ead8d5] bg-white shadow-2xl">

        <aside className="hidden w-[35%] flex-col justify-between bg-[#702d43] p-8 text-white md:flex">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-pink-200">
              StyleMate Boutique
            </p>

            <h1 className="mt-8 text-4xl font-bold leading-tight">
              Discover your own style.
            </h1>

            <p className="mt-5 text-sm leading-7 text-pink-100">
              Find your perfect outfit and explore fashion collections
              with your personal boutique assistant.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Everyday Elegance",
                "Festive Glamour",
                "Bridal Dreams"
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/20 bg-white/10 p-3 text-sm"
                >
                  ✦ {item}
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-pink-200">
            FASHION MADE SIMPLE
          </p>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between bg-[#702d43] p-4 text-white sm:p-5 md:bg-white md:text-[#702d43]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl md:bg-[#f7e5eb]">
                👗
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  StyleMate
                </h2>
                <p className="text-xs opacity-80">
                  Fashion Helpdesk Bot
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={clearChat}
              className="rounded-lg border border-white/30 px-3 py-2 text-xs transition hover:bg-white/10 md:border-[#ead8d5] md:hover:bg-[#f8f0ed]"
            >
              Clear Chat
            </button>
          </header>

          <div className="border-y border-[#f0e3df] bg-[#fffaf8] px-4 py-3 text-center text-xs text-[#8a5a68]">
            ✨ Your personal fashion assistant is here to help.
          </div>

          <div
            className="flex-1 space-y-4 overflow-y-auto bg-[#fcf9f7] p-4 sm:p-6"
            aria-live="polite"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.sender === "bot" && (
                  <div className="mr-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f1dfe5] text-sm">
                    ✦
                  </div>
                )}

                <div
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.sender === "user"
                      ? "rounded-br-sm bg-[#702d43] text-white"
                      : "rounded-bl-sm border border-[#f0e4df] bg-white text-[#49353b] shadow-sm"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#ead8d5] bg-white p-4 sm:p-5">
            <p className="mb-3 text-xs font-semibold text-[#8a5a68]">
              QUICK QUESTIONS
            </p>

            <div className="mb-4 flex flex-wrap gap-2">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(question)}
                  className="rounded-full border border-[#ead3dc] bg-[#fff7fa] px-3 py-2 text-xs text-[#702d43] transition hover:bg-[#f5e5eb]"
                >
                  {question}
                </button>
              ))}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
              className="flex gap-2"
            >
              <label htmlFor="message" className="sr-only">
                Type your question
              </label>

              <input
                id="message"
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about your favorite style..."
                autoComplete="off"
                className="min-w-0 flex-1 rounded-xl border border-[#ead8d5] bg-[#fcf9f7] px-4 py-3 text-sm text-[#49353b] outline-none focus:border-[#702d43] focus:ring-2 focus:ring-[#f1dfe5]"
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className="rounded-xl bg-[#702d43] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#552034] disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
              >
                Send ➤
              </button>
            </form>

            <p className="mt-3 text-center text-[10px] text-gray-400">
              Rule-based chatbot · No API required
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}