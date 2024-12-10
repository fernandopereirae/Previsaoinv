const fetch = require('node-fetch');
const TelegramBot = require('node-telegram-bot-api');

// Token do bot do Telegram
const TELEGRAM_BOT_TOKEN = '7824438531:AAGnu_1wLMP-jjnK5jybW5sber4AAxNDneM';

// Criação do bot
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Função para buscar dados do Yahoo Finance
async function getDayTraderData(ticker) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=1d&interval=1m`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.chart.result === null) {
      return `⚠️ Nenhum dado encontrado para o ativo '${ticker.toUpperCase()}'. Verifique o símbolo e tente novamente.`;
    }

    const lastRow = data.chart.result[0].indicators.quote[0];
    const close = lastRow.close[lastRow.close.length - 1];
    const high = lastRow.high[lastRow.high.length - 1];
    const low = lastRow.low[lastRow.low.length - 1];
    const volume = lastRow.volume[lastRow.volume.length - 1];

    return `
**Previsão de Day Trader - ${ticker.toUpperCase()}**
📈 Preço Atual: ${close.toFixed(2)} USD
🔝 Alta do Dia: ${high.toFixed(2)} USD
🔻 Baixa do Dia: ${low.toFixed(2)} USD
📊 Volume: ${volume.toLocaleString()}
    `;
  } catch (error) {
    console.error(`Erro ao buscar dados para ${ticker}: ${error}`);
    return `⚠️ Ocorreu um erro ao buscar dados para '${ticker.toUpperCase()}'. Tente novamente mais tarde.`;
  }
}

// Comando /comeca
bot.onText(/\/comeca (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const tickers = match[1].split(' ');

  bot.sendMessage(chatId, "🔍 Buscando dados... Isso pode levar alguns segundos.");

  const respostas = await Promise.all(tickers.map(async (ticker) => {
    return await getDayTraderData(ticker);
  }));

  const respostaFinal = respostas.join("\n\n");
  bot.sendMessage(chatId, respostaFinal, { parse_mode: 'Markdown' });
});

// Configuração do bot
console.log("Bot está rodando...");
