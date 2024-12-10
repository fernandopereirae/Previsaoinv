import yfinance as yf
from telegram import Update, ParseMode
from telegram.ext import Updater, CommandHandler, CallbackContext
import logging

# Configuração do logger
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Token do bot do Telegram
TELEGRAM_BOT_TOKEN = "SEU_TOKEN_AQUI"

# Função para buscar dados do Yahoo Finance
def get_day_trader_data(ticker: str) -> str:
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="1d", interval="1m")

        # Se não houver dados
        if hist.empty:
            return f"⚠️ Nenhum dado encontrado para o ativo '{ticker.upper()}'. Verifique o símbolo e tente novamente."

        last_row = hist.iloc[-1]
        resposta = f"""
**Previsão de Day Trader - {ticker.upper()}**
📈 Preço Atual: {last_row['Close']:.2f} USD
🔝 Alta do Dia: {last_row['High']:.2f} USD
🔻 Baixa do Dia: {last_row['Low']:.2f} USD
📊 Volume: {int(last_row['Volume']):,}
        """
        return resposta
    except Exception as e:
        logger.error(f"Erro ao buscar dados para {ticker}: {e}")
        return f"⚠️ Ocorreu um erro ao buscar dados para '{ticker.upper()}'. Tente novamente mais tarde."

# Comando /comeca
def comeca(update: Update, context: CallbackContext):
    user = update.message.chat.username or update.message.chat.id
    logger.info(f"Usuário {user} iniciou o comando /comeca")

    args = context.args
    if not args:
        update.message.reply_text("❌ Por favor, envie o comando no formato: /comeca <TICKER1> <TICKER2> ...")
        return

    tickers = args
    update.message.reply_text("🔍 Buscando dados... Isso pode levar alguns segundos.")

    respostas = [get_day_trader_data(ticker) for ticker in tickers]

    resposta_final = "\n\n".join(respostas)
    update.message.reply_text(resposta_final, parse_mode=ParseMode.MARKDOWN)

# Configuração do bot
def main():
    updater = Updater(TELEGRAM_BOT_TOKEN)
    dispatcher = updater.dispatcher

    # Comando /comeca
    dispatcher.add_handler(CommandHandler("comeca", comeca))

    # Inicia o bot
    logger.info("Bot está sendo iniciado...")
    updater.start_polling()
    logger.info("Bot está rodando.")
    updater.idle()

if __name__ == "__main__":
    main()
