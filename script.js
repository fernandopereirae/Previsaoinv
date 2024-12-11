let interval;
let successCount = 0;
let errorCount = 0;

// Substitua 'YOUR_API_KEY' pela sua chave da Alpha Vantage
const apiKey = "H46I11R9PYFXUCPU";
const symbols = ["AAPL", "MSFT", "GOOGL"]; // Ações monitoradas

// Função para buscar dados da API Alpha Vantage
async function fetchData() {
 const displayElement = document.getElementById("data-display");
 const loadingMessage = document.getElementById("loading-message");

 loadingMessage.textContent = "Carregando informações...";
 try {
   const requests = symbols.map((symbol) =>
     fetch(
       `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
     )
   );

   const responses = await Promise.all(requests);
   const data = await Promise.all(responses.map((res) => res.json()));

   if (data.some((stock) => !stock["Global Quote"])) {
     throw new Error("Dados incompletos ou inválidos retornados da API.");
   }

   // Processar e exibir os dados
   displayElement.innerHTML = data
     .map((stock) => {
       const quote = stock["Global Quote"];
       return `<p>${quote["01. symbol"]}: $${quote["05. price"]} (${quote["10. change percent"]})</p>`;
     })
     .join("");

   loadingMessage.textContent = ""; // Remove mensagem de carregamento
   successCount++;
   updateStats();
 } catch (error) {
   console.error("Erro ao buscar dados:", error.message);
   loadingMessage.textContent = "Erro ao carregar dados. Tente novamente.";
   errorCount++;
   updateStats();
 }
}

// Função para atualizar estatísticas
function updateStats() {
 const total = successCount + errorCount;
 const successRate = ((successCount / total) * 100).toFixed(2) || 0;
 const errorRate = ((errorCount / total) * 100).toFixed(2) || 0;

 document.getElementById("success-rate").textContent = `${successRate}%`;
 document.getElementById("error-rate").textContent = `${errorRate}%`;
}

// Função para iniciar o intervalo de busca
function startFetching() {
 if (!interval) {
   fetchData(); // Busca inicial
   interval = setInterval(fetchData, 5000); // Busca a cada 5 segundos
 }
}

// Função para parar o intervalo de busca
function stopFetching() {
 if (interval) {
   clearInterval(interval);
   interval = null;
 }
}

// Adicionar eventos aos botões
document.getElementById("start-button").addEventListener("click", startFetching);
document.getElementById("stop-button").addEventListener("click", stopFetching);