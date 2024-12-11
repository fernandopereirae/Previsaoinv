let interval;
let successCount = 0;
let errorCount = 0;

// Substitua pela sua chave da Alpha Vantage
const apiKey = "H46I11R9PYFXUCPU";
const symbols = ["AAPL", "MSFT", "GOOGL"]; // Ações monitoradas

// Função para buscar dados da API Alpha Vantage
async function fetchData() {
 console.log("Iniciando busca de dados...");
 try {
   const requests = symbols.map((symbol) =>
     fetch(
       `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
     )
   );

   // Executar todas as requisições
   const responses = await Promise.all(requests);
   const data = await Promise.all(responses.map((res) => res.json()));

   // Verificar se as respostas contêm os dados esperados
   if (data.some((stock) => !stock["Global Quote"])) {
     throw new Error("Dados incompletos ou inválidos retornados da API.");
   }

   // Processar e exibir os dados
   const displayData = data.map((stock) => {
     const quote = stock["Global Quote"];
     return `${quote["01. symbol"]}: $${quote["05. price"]} (${quote["10. change percent"]})`;
   });

   document.getElementById("data-box").value = displayData.join("\n");
   console.log("Dados atualizados com sucesso:", displayData);
   successCount++;
   updateStats();
 } catch (error) {
   console.error("Erro ao buscar dados:", error.message);
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
 console.log(`Atualizando estatísticas: Acertos: ${successRate}%, Erros: ${errorRate}%`);
}

// Função para iniciar o intervalo de busca
function startFetching() {
 if (!interval) {
   console.log("Iniciando busca periódica de dados...");
   fetchData(); // Busca inicial
   interval = setInterval(fetchData, 5000); // Busca a cada 5 segundos
 }
}

// Função para parar o intervalo de busca
function stopFetching() {
 if (interval) {
   console.log("Parando busca periódica de dados...");
   clearInterval(interval);
   interval = null;
 }
}

// Adicionar eventos aos botões
document.getElementById("start-button").addEventListener("click", startFetching);
document.getElementById("stop-button").addEventListener("click", stopFetching);