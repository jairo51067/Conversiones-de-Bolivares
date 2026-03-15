// TODO: Claves de API
const apiKeyExchangeRate = "f390895452a9366a9eeff7c3"; // Reemplaza con tu propia clave de API
const apiKeyNews = "fb98581019a54258bd249f25b15a0e62"; // Clave de API de NewsAPI

// TODO: Elementos del DOM
const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const resultParagraph = document.getElementById("result");
const historyList = document.getElementById("history-list");
const refreshButton = document.getElementById("refresh");

// Almacenar tasas de cambio anteriores
const previousRates = {};
// Carga inicial de datos
document.addEventListener("DOMContentLoaded", async () => {
  await loadCurrencies(); // Cargar las monedas al inicio
});

// Manejo del formulario de conversión de monedas
document
  .getElementById("currency-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    const amount = amountInput.value;
    const fromCurrency = fromSelect.value;
    const toCurrency = toSelect.value;

    if (amount && fromCurrency && toCurrency) {
      const conversionRate = await getConversionRate(fromCurrency, toCurrency);
      if (conversionRate) {
        const convertedAmount = (amount * conversionRate).toFixed(2);
        resultParagraph.textContent = `${parseFloat(amount).toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${fromCurrency} = ${parseFloat(convertedAmount).toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${toCurrency}`;
        addToHistory(amount, fromCurrency, convertedAmount, toCurrency); // Agregar al historial
      } else {
        resultParagraph.textContent =
          "La moneda de origen o destino no está soportada.";
      }
    } else {
      resultParagraph.textContent = "Por favor, completa todos los campos.";
    }
  });

// Actualizar tasas de conversión
refreshButton.addEventListener("click", async () => {
  await loadCurrencies(); // Cargar las monedas nuevamente
  resultParagraph.textContent = "Tasas de conversión actualizadas.";
});

// Función Carga las monedas y las agrega a los selectores de origen y destino.
async function loadCurrencies() {
  const currencies = [
    { code: "USD", name: "Dólar Estadounidense" },
    { code: "EUR", name: "Euro" },
    { code: "COP", name: "Peso Colombiano" },
    { code: "VES", name: "Bolívar venezolanos" },
  ];

  fromSelect.innerHTML = ""; // Limpiar opciones anteriores
  toSelect.innerHTML = ""; // Limpiar opciones anteriores

  for (const currency of currencies) {
    const currentRate = await getCurrentRate(currency.code);
    const previousRate = previousRates[currency.code] || currentRate;

    // Actualizar la tasa anterior
    previousRates[currency.code] = currentRate;

    const fromOption = document.createElement("option");
    fromOption.value = currency.code;
    fromOption.textContent = `${currency.name} (${currency.code})`;
    fromSelect.appendChild(fromOption);

    const toOption = document.createElement("option");
    toOption.value = currency.code;
    toOption.textContent = `${currency.name} (${currency.code})`;
    toSelect.appendChild(toOption);
  }

  // Establecer valores predeterminados
  fromSelect.value = "USD"; // Dólares como moneda a convertir
  toSelect.value = "COP"; // Pesos Colombianos como moneda a obtener
}

// Función para obtener la tasa de cambio actual de una moneda
async function getCurrentRate(currency) {
  const apiUrl = `https://api.exchangerate-api.com/v4/latest/${currency}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }
    const data = await response.json();
    return data.rates; // Retorna las tasas de cambio
  } catch (error) {
    console.error("Error al obtener la tasa de cambio actual:", error);
    return null;
  }
}

// Función Obtén la tasa de conversión entre dos monedas desde la API de ExchangeRate-API.
async function getConversionRate(from, to) {
  const apiUrl = `https://api.exchangerate-api.com/v4/latest/${from}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error(
        "Error en la respuesta de la API:",
        response.status,
        response.statusText,
      );
      throw new Error("Error en la respuesta de la API");
    }
    const data = await response.json();
    if (data.rates && data.rates[to]) {
      return data.rates[to];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al obtener la tasa de conversión:", error);
    resultParagraph.textContent =
      "Error al obtener la tasa de conversión. Intenta de nuevo más tarde.";
  }
}

// Función para agregar un elemento al historial de conversiones
function addToHistory(amount, fromCurrency, convertedAmount, toCurrency) {
  const historyItem = document.createElement("li");
  historyItem.textContent = `${parseFloat(amount).toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${fromCurrency} = ${parseFloat(convertedAmount).toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${toCurrency}`;
  historyList.appendChild(historyItem);
}

/*window.onload siempre se debe escribir exactamente así, ya que es una propiedad nativa de JavaScript. 
Sin embargo, solo puedes asignar una función a window.onload. Si defines varias, la última sobrescribirá a las anteriores. 
Para ejecutar múltiples funciones al cargar, lo ideal es usar window.addEventListener('load', ...).*/
// TODO: Mostrar el conversor al cargar la página
window.onload = function () {
  document.getElementById("converter-container").style.display = "none";
};

// TODO: Lógica para mostrar el conversor (no se usará después de cerrarlo)
document
  .getElementById("show-converter")
  .addEventListener("click", function () {
    document.getElementById("converter-container").style.display = "block";
  });

// TODO: Lógica para ocultar el conversor
document
  .getElementById("close-converter")
  .addEventListener("click", function () {
    document.getElementById("converter-container").style.display = "none";
  });

/*La mejor alternativa: Usa window.addEventListener('load', func1); varias veces. Todas se ejecutarán en orden.*/
// TODO: Ocultar-Mostrar el conversor-a-paralelo al cargar la pagina
window.addEventListener("load", function () {
  document.getElementById("convertir-a-paralelo").style.display = "none";
});

// TODO: Lógica para mostrar el conversor paralelo
document
  .getElementById("show-converter-paralelo")
  .addEventListener("click", function () {
    document.getElementById("convertir-a-paralelo").style.display = "block";
  });

// TODO: Lógica para ocultar el conversor paralelo
document
  .getElementById("close-converter-paralelo")
  .addEventListener("click", function () {
    document.getElementById("convertir-a-paralelo").style.display = "none";
  });

// TODO: Valor de Dolar BCV
// Función para obtener y mostrar los datos del dólar oficial
async function obtenerDatosDolar() {
  const divResultado = document.getElementById("resultadoBcv");

  // Mostrar mensaje de carga mientras se obtiene la data
  divResultado.innerHTML = "Cargando datos...";

  try {
    // Hacer la petición a la API
    const response = await fetch("https://ve.dolarapi.com/v1/dolares/oficial");

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    // Convertir la respuesta a JSON
    const data = await response.json();

    // Mostrar los datos en la consola (para depuración)
    console.log("Datos obtenidos de la API:", data);

    // --- INICIO DEL CAMBIO ---
    // Obtener la fecha y hora actual del dispositivo
    const fechaActualizacion = new Date();

    // Formatear la fecha (DD/MM/YYYY)
    const dia = String(fechaActualizacion.getDate()).padStart(2, "0");
    const mes = String(fechaActualizacion.getMonth() + 1).padStart(2, "0");
    const anio = fechaActualizacion.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;

    // Formatear la hora (HH:MM:SS)
    const hora = String(fechaActualizacion.getHours()).padStart(2, "0");
    const minutos = String(fechaActualizacion.getMinutes()).padStart(2, "0");
    const segundos = String(fechaActualizacion.getSeconds()).padStart(2, "0");
    const horaFormateada = `${hora}:${minutos}:${segundos}`;
    // --- FIN DEL CAMBIO ---

    // Mostrar los datos en el div (con fecha y hora del dispositivo)
    divResultado.innerHTML = `
     <strong class="titulo-valor">1 USD =</strong> 
     <span class="valor-moneda">${data.promedio.toFixed(2)} Bs</span><br>
     <strong class="titulo-actualizacion">Última actualización:<br>
     </strong> 
     <span class="fecha-hora">${fechaFormateada} a las ${horaFormateada}</span>`;
  } catch (error) {
    // Mostrar mensaje de error si algo falla
    divResultado.innerHTML = `Error al cargar los datos: ${error.message}`;
    console.error("Error:", error);
  }
}
// Agregar event listener al botón para actualizar los datos
document
  .getElementById("actualizar")
  .addEventListener("click", obtenerDatosDolar);

// Llamar a la función automáticamente al cargar la página (opcional, para mostrar datos iniciales)
window.addEventListener("load", obtenerDatosDolar);

// TODO: Valor Euro BCV

// Función para obtener y mostrar los datos del euro oficial
async function obtenerDatosEuroOficial() {
  const divResultado = document.getElementById("resultadoEuroOficial");

  // Mostrar mensaje de carga
  divResultado.innerHTML = "Cargando datos...";

  try {
    // Hacer la petición a la API
    const response = await fetch("https://ve.dolarapi.com/v1/euros/oficial");

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    // Convertir la respuesta a JSON
    const data = await response.json();

    // Mostrar en consola para depuración
    console.log("Datos del Euro Oficial:", data);

    // --- INICIO DEL CAMBIO ---
    // Obtener la fecha y hora actual del dispositivo
    const fechaActualizacion = new Date();

    // Formatear la fecha (DD/MM/YYYY)
    const dia = String(fechaActualizacion.getDate()).padStart(2, "0");
    const mes = String(fechaActualizacion.getMonth() + 1).padStart(2, "0");
    const anio = fechaActualizacion.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;

    // Formatear la hora (HH:MM:SS)
    const hora = String(fechaActualizacion.getHours()).padStart(2, "0");
    const minutos = String(fechaActualizacion.getMinutes()).padStart(2, "0");
    const segundos = String(fechaActualizacion.getSeconds()).padStart(2, "0");
    const horaFormateada = `${hora}:${minutos}:${segundos}`;
    // --- FIN DEL CAMBIO ---

    // Mostrar en el div (con fecha y hora del dispositivo)
    divResultado.innerHTML = `
            <strong class="titulo-valor">1 USD = </strong> <span class="valor-moneda">${data.promedio.toFixed(2)} Bs</span><br>
            <strong class="titulo-actualizacion">Última actualización:</strong><br><span class="fecha-hora">${fechaFormateada} a las ${horaFormateada}</span>`;
  } catch (error) {
    // Mostrar mensaje de error si algo falla
    divResultado.innerHTML = `Error al cargar los datos: ${error.message}`;
    console.error("Error en Euro Oficial:", error);
  }
}

// Agregar event listener al botón para actualizar los datos
document
  .getElementById("actualizarEuro")
  .addEventListener("click", obtenerDatosEuroOficial);

// Llamar a la función automáticamente al cargar la página
window.addEventListener("load", obtenerDatosEuroOficial);

// TODO: Valor Dolar Paralelo

// Función para obtener y mostrar los datos del dólar paralelo
async function obtenerDatosDolarParalelo() {
  const divResultado = document.getElementById("resultadoParalelo");

  // Mostrar mensaje de carga
  divResultado.innerHTML = "Cargando datos...";

  try {
    const response = await fetch("https://ve.dolarapi.com/v1/dolares/paralelo");
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }
    const data = await response.json();

    // Mostrar en consola para depuración
    console.log("Datos del Dólar Paralelo:", data);

    // --- INICIO DEL CAMBIO ---
    // Obtener la fecha y hora actual del dispositivo
    const fechaActualizacion = new Date();

    // Formatear la fecha (DD/MM/YYYY)
    const dia = String(fechaActualizacion.getDate()).padStart(2, "0");
    const mes = String(fechaActualizacion.getMonth() + 1).padStart(2, "0");
    const anio = fechaActualizacion.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;

    // Formatear la hora (HH:MM:SS)
    const hora = String(fechaActualizacion.getHours()).padStart(2, "0");
    const minutos = String(fechaActualizacion.getMinutes()).padStart(2, "0");
    const segundos = String(fechaActualizacion.getSeconds()).padStart(2, "0");
    const horaFormateada = `${hora}:${minutos}:${segundos}`;
    // --- FIN DEL CAMBIO ---

    // Mostrar en el div (con fecha y hora del dispositivo)
    divResultado.innerHTML = `
            <strong class="titulo-valor">1 USDT = </strong> <span class="valor-moneda">${data.promedio.toFixed(2)} Bs</span><br>
            <strong class="titulo-actualizacion">Última actualización:</strong><br><span class="fecha-hora">${fechaFormateada} a las ${horaFormateada}</span>`;
  } catch (error) {
    divResultado.innerHTML = `Error al cargar los datos: ${error.message}`;
    console.error("Error en Dólar Paralelo:", error);
  }
}

// Event listeners para los botones
document
  .getElementById("actualizarParalelo")
  .addEventListener("click", obtenerDatosDolarParalelo);

// Carga inicial automática al cargar la página
window.addEventListener("load", () => {
  obtenerDatosDolarParalelo();
});

// TODO: Valor del dolar en pesos colombianos TRM
// Función para obtener y mostrar el TRM del dólar en Colombia
async function obtenerTRMDolarColombia() {
  const divResultado = document.getElementById("valorDolarTRM");

  // Mostrar mensaje de carga
  divResultado.innerHTML = "Cargando...";

  try {
    // Hacer la petición a la API
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD",
    );

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    // Convertir la respuesta a JSON
    const data = await response.json();

    // Extraer el valor del TRM (USD a COP)
    const trm = data.rates.COP;

    // --- INICIO DEL CAMBIO ---
    // Obtener la fecha y hora actual del dispositivo
    const fechaActualizacion = new Date();

    // Formatear la fecha (DD/MM/YYYY)
    const dia = String(fechaActualizacion.getDate()).padStart(2, "0");
    const mes = String(fechaActualizacion.getMonth() + 1).padStart(2, "0");
    const anio = fechaActualizacion.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;

    // Formatear la hora (HH:MM:SS)
    const hora = String(fechaActualizacion.getHours()).padStart(2, "0");
    const minutos = String(fechaActualizacion.getMinutes()).padStart(2, "0");
    const segundos = String(fechaActualizacion.getSeconds()).padStart(2, "0");
    const horaFormateada = `${hora}:${minutos}:${segundos}`;
    // --- FIN DEL CAMBIO ---

    // Mostrar en consola para depuración
    console.log("Datos obtenidos de la API:", data);
    console.log("TRM (USD a COP):", trm);

    // Mostrar en el div (formateado como TRM) + fecha y hora del dispositivo
    divResultado.innerHTML = `
    <p class="titulo-valor">
        1 USD = <span class="valor-moneda">${trm.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</span>
    </p>
    <p class="titulo-actualizacion">
        Última actualización:<br>
        <span class="fecha-hora">${fechaFormateada} a las ${horaFormateada}</span>
    </p>
`;
  } catch (error) {
    // Mostrar mensaje de error si algo falla
    divResultado.innerHTML = `Error al cargar el TRM: ${error.message}`;
    console.error("Error:", error);
  }
}

// Si agregaste un botón, agrega este event listener
document
  .getElementById("actualizarTRM")
  .addEventListener("click", obtenerTRMDolarColombia);

// Llamar a la función automáticamente al cargar la página
window.addEventListener("load", obtenerTRMDolarColombia);

// TODO: Factor-1 de conversion TRM/PARALELO
// Función asíncrona para obtener y calcular el factor
async function obtenerFactorConversion() {
  const api1 = "https://api.exchangerate-api.com/v4/latest/USD";
  const api2 = "https://ve.dolarapi.com/v1/dolares/paralelo";

  const elementoMostrar = document.getElementById("factor-value");

  try {
    // 1. Obtener tipo de cambio oficial (desde USD base)
    const respuesta1 = await fetch(api1);
    const datos1 = await respuesta1.json();

    // Nota: Asumimos que quieres convertir a Bolivares (VES).
    // Si necesitas otra moneda, cambia 'VES' por 'EUR', 'COP', etc.
    const valorOficial = datos1.rates.COP;

    // 2. Obtener promedio del dólar paralelo
    const respuesta2 = await fetch(api2);
    const datos2 = await respuesta2.json();

    // La API devuelve un array, tomamos el promedio del primer elemento o buscamos el promedio
    // Generalmente el endpoint devuelve un array y el primero tiene el promedio.
    const valorParalelo = datos2.promedio;

    // 3. Calcular Factor (Lógica: Valor Oficial / Valor Paralelo)
    const factor = valorOficial / valorParalelo;
    console.log(factor);

    // 4. Mostrar en pantalla (formateado a 4 decimales)
    elementoMostrar.innerText = factor.toFixed(4);
  } catch (error) {
    console.error("Error al obtener datos:", error);
    elementoMostrar.innerText = "Error";
    elementoMostrar.classList.remove("text-primary");
    elementoMostrar.classList.add("text-danger");
  }
}

// Ejecutar la función cuando cargue la página
document.addEventListener("DOMContentLoaded", obtenerFactorConversion);

// TODO: Factor-3 de conversion TRM/EURO

// Función asíncrona para obtener y calcular el factor (TRM COP / Euro Oficial VES)
async function obtenerFactorConversion3() {
  // 1. API para obtener la TRM (Base USD, obtenemos la tasa en COP)
  const api1 = "https://api.exchangerate-api.com/v4/latest/USD";

  // 2. API para obtener el Euro Oficial en Venezuela (Base VES)
  const api2 = "https://ve.dolarapi.com/v1/euros/oficial";

  const elementoMostrar = document.getElementById("factor-value-3");

  try {
    // 1. Obtener TRM (Pesos Colombianos por 1 USD)
    const respuesta1 = await fetch(api1);
    const datos1 = await respuesta1.json();

    // Extraemos el valor de COP de la respuesta (TRM)
    const valorOficialTrm = datos1.rates.COP;

    // 2. Obtener Euro Oficial (Bolívares por 1 EUR)
    const respuesta2 = await fetch(api2);
    const datos2 = await respuesta2.json();
    console.log("Datos del Euro Oficial:", datos2);

    // La API de Euros devuelve la propiedad "cotizacion" (a diferencia de "promedio" en dólares)
    const valorOficialEuro = datos2.promedio;

    // 3. Calcular Factor (Lógica: TRM (COP) / Euro Oficial (VES))
    const factor3 = valorOficialTrm / valorOficialEuro;
    console.log("TRM (COP):", valorOficialTrm);
    console.log("Euro (VES):", valorOficialEuro);
    console.log("Factor:", factor3);

    // 4. Mostrar en pantalla (formateado a 4 decimales)
    elementoMostrar.innerText = factor3.toFixed(4);

    // Opcional: Estilos visuales según el resultado
    if (factor3 > 0) {
      elementoMostrar.classList.remove("text-danger");
      elementoMostrar.classList.add("text-primary");
    }
  } catch (error) {
    console.error("Error al obtener datos:", error);
    elementoMostrar.innerText = "Error";
    elementoMostrar.classList.remove("text-primary");
    elementoMostrar.classList.add("text-danger");
  }
}

// Ejecutar la función cuando cargue la página
document.addEventListener("DOMContentLoaded", obtenerFactorConversion3);

// TODO: Factor-2 de conversion TRM/OFICIAL

// Función asíncrona para obtener y calcular el factor
async function obtenerFactorConversion2() {
  const api1 = "https://api.exchangerate-api.com/v4/latest/USD";
  const api2 = "https://ve.dolarapi.com/v1/dolares/oficial";

  const elementoMostrar = document.getElementById("factor-value-2");

  try {
    // 1. Obtener tipo de cambio oficial (desde USD base)
    const respuesta1 = await fetch(api1);
    const datos1 = await respuesta1.json();

    // Nota: Asumimos que quieres convertir a Bolivares (VES).
    // Si necesitas otra moneda, cambia 'VES' por 'EUR', 'COP', etc.
    const valorOficialTrm = datos1.rates.COP;

    // 2. Obtener promedio del dólar ofical
    const respuesta2 = await fetch(api2);
    const datos2 = await respuesta2.json();

    // La API devuelve un array, tomamos el promedio del primer elemento o buscamos el promedio
    // Generalmente el endpoint devuelve un array y el primero tiene el promedio.
    const valorOficialBcv = datos2.promedio;

    // 3. Calcular Factor (Lógica: Valor Oficial_trm / Valor oficial_bcv)
    const factor2 = valorOficialTrm / valorOficialBcv;
    console.log(factor2);

    // 4. Mostrar en pantalla (formateado a 4 decimales)
    elementoMostrar.innerText = factor2.toFixed(4);
  } catch (error) {
    console.error("Error al obtener datos:", error);
    elementoMostrar.innerText = "Error";
    elementoMostrar.classList.remove("text-primary");
    elementoMostrar.classList.add("text-danger");
  }
}

// Ejecutar la función cuando cargue la página
document.addEventListener("DOMContentLoaded", obtenerFactorConversion2);

// TODO: Conversion de Bolivares a Pesos COP
// 1. Variable global para guardar el factor y usarlo en otras funciones
let factorGlobal = 0;

// Función asíncrona para obtener y calcular el factor
async function obtenerFactorConversion() {
  const api1 = "https://api.exchangerate-api.com/v4/latest/USD";
  const api2 = "https://ve.dolarapi.com/v1/dolares/paralelo";

  const elementoMostrar = document.getElementById("factor-value");

  try {
    // 1. Obtener tipo de cambio oficial (desde USD base)
    const respuesta1 = await fetch(api1);
    const datos1 = await respuesta1.json();
    const valorOficial = datos1.rates.COP;

    // 2. Obtener promedio del dólar paralelo
    const respuesta2 = await fetch(api2);
    const datos2 = await respuesta2.json();
    const valorParalelo = datos2.promedio;

    // 3. Calcular Factor y guardarlo globalmente
    factorGlobal = valorOficial / valorParalelo;
    console.log(factorGlobal);

    // 4. Mostrar en pantalla (formateado a 4 decimales)
    elementoMostrar.innerText = factorGlobal.toFixed(4);

    // (Opcional) Si el usuario dejó algo escrito antes de recargar, volver a calcularlo automáticamente
    convertirACop();
  } catch (error) {
    console.error("Error al obtener datos:", error);
    elementoMostrar.innerText = "Error";
    elementoMostrar.classList.remove("text-primary");
    elementoMostrar.classList.add("text-danger");
  }
}

// 2. Función nueva para hacer la conversión en tiempo real
function convertirACop() {
  const inputBolivares = document.getElementById("input-bolivares").value;
  const elementoResultado = document.getElementById("resultado-cop");

  // Verificamos que el factor ya haya cargado (es mayor a 0), que el input no esté vacío y sea un número
  if (
    factorGlobal > 0 &&
    inputBolivares.trim() !== "" &&
    !isNaN(inputBolivares)
  ) {
    // Convertimos el valor ingresado a un número decimal
    const montoBolivares = parseFloat(inputBolivares);
    console.log(montoBolivares);

    // Calculamos el resultado en Pesos Colombianos
    const resultadoCOP = montoBolivares * factorGlobal;
    console.log(resultadoCOP);

    // Mostramos el resultado formateado (Ej: $ 15.000,00)
    elementoResultado.innerText = resultadoCOP.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
    });
  } else {
    // Si borran el input o escriben texto no válido, restablecemos el resultado
    elementoResultado.innerText = "$ 0,00";
  }
}

// Esto asegura que la API se llame automáticamente al abrir la web
document.addEventListener("DOMContentLoaded", () => {
  obtenerFactorConversion();
});

// TODO: Conversion de Pesos COP a Bolivares

// 1. Variable global para guardar el factor y usarlo en otras funciones
let factorGlobal_2 = 0;

// Función asíncrona para obtener y calcular el factor
async function obtenerFactorConversion_2() {
  const api1 = "https://api.exchangerate-api.com/v4/latest/USD";
  const api2 = "https://ve.dolarapi.com/v1/dolares/paralelo";

  const elementoMostrar = document.getElementById("factor-value");

  try {
    // 1. Obtener tipo de cambio oficial (desde USD base)
    const respuesta1 = await fetch(api1);
    const datos1 = await respuesta1.json();
    const valorOficial = datos1.rates.COP;

    // 2. Obtener promedio del dólar paralelo
    const respuesta2 = await fetch(api2);
    const datos2 = await respuesta2.json();
    const valorParalelo = datos2.promedio;

    // 3. Calcular Factor y guardarlo globalmente
    factorGlobal_2 = valorOficial / valorParalelo;
    console.log(factorGlobal_2);

    // 4. Mostrar en pantalla (formateado a 4 decimales)
    elementoMostrar.innerText = factorGlobal_2.toFixed(4);

    // (Opcional) Si el usuario dejó algo escrito antes de recargar, volver a calcularlo automáticamente
    convertirABs();
  } catch (error) {
    console.error("Error al obtener datos:", error);
    elementoMostrar.innerText = "Error";
    elementoMostrar.classList.remove("text-primary");
    elementoMostrar.classList.add("text-danger");
  }
}

// 2. Función nueva para hacer la conversión en tiempo real
function convertirABs() {
  const inputPesos = document.getElementById("input-pesos").value;
  const elementoResultado = document.getElementById("resultado-bs");

  // Verificamos que el factor ya haya cargado (es mayor a 0), que el input no esté vacío y sea un número
  if (factorGlobal_2 > 0 && inputPesos.trim() !== "" && !isNaN(inputPesos)) {
    // Convertimos el valor ingresado a un número decimal
    const montoPesos = parseFloat(inputPesos);
    console.log(montoPesos);

    // Calculamos el resultado en Pesos Colombianos
    const resultadoBs = montoPesos / factorGlobal_2;
    console.log(resultadoBs);

    // Mostramos el resultado formateado (Ej: Bs 15.000,00)
    elementoResultado.innerText = resultadoBs.toLocaleString("es-VE", {
      style: "currency",
      currency: "VES",
      minimumFractionDigits: 2,
    });
  } else {
    // Si borran el input o escriben texto no válido, restablecemos el resultado
    elementoResultado.innerText = "Bs. 0,00";
  }
}

// Esto asegura que la API se llame automáticamente al abrir la web
document.addEventListener("DOMContentLoaded", () => {
  obtenerFactorConversion_2();
});

// TODO: para actualizar la fecha y la hora:
// ===============================
// FECHA Y HORA
// ===============================

function updateDateTime() {
  const now = new Date();

  const dayName = now.toLocaleDateString("es-ES", {
    weekday: "long",
  });

  const date = now.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const time = now.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  document.getElementById("day-name").innerText =
    dayName.charAt(0).toUpperCase() + dayName.slice(1);

  document.getElementById("date").innerText = date;

  document.getElementById("time").innerText = time;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// ===============================
// CLIMA
// ===============================

function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=sunrise,sunset&timezone=auto`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const temp = Math.round(data.current_weather.temperature);
      const weatherCode = data.current_weather.weathercode;

      document.getElementById("temperature").innerText = temp + "°C";

      const description = getWeatherDescription(weatherCode);

      document.getElementById("weather-description").innerText = description;

      checkDayOrNight(data.daily.sunrise[0], data.daily.sunset[0]);
    });
}

// ===============================
// DIA O NOCHE
// ===============================

function checkDayOrNight(sunrise, sunset) {
  const now = new Date();

  const rise = new Date(sunrise);
  const set = new Date(sunset);

  const icon = document.getElementById("day-icon");
  const text = document.getElementById("day-status");

  if (now > rise && now < set) {
    icon.className = "bi bi-sun text-warning me-2";
    text.innerText = "Día";
  } else {
    icon.className = "bi bi-moon-stars text-info me-2";
    text.innerText = "Noche";
  }
}

// ===============================
// DESCRIPCION CLIMA
// ===============================

function getWeatherDescription(code) {
  const weatherCodes = {
    0: "Cielo despejado",
    1: "Mayormente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Niebla",
    48: "Niebla con escarcha",
    51: "Llovizna ligera",
    61: "Lluvia ligera",
    63: "Lluvia moderada",
    65: "Lluvia fuerte",
    71: "Nieve ligera",
    80: "Chubascos",
    95: "Tormenta",
  };

  return weatherCodes[code] || "Clima desconocido";
}

// ===============================
// GEOLOCALIZACION
// ===============================

function initWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      getWeather(lat, lon);
    });
  } else {
    document.getElementById("weather-description").innerText =
      "Geolocalización no soportada";
  }
}

initWeather();
