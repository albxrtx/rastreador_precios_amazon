// Input de producto
const searchProductInput = document.getElementById(
  "search-product-input"
) as HTMLInputElement;
// Contenedor del producto
const productCardContainer = document.getElementById(
  "product-card-container"
) as HTMLDivElement;

// Elementos del producto
const productImage = document.getElementById(
  "product-image"
) as HTMLImageElement;
const productTitle = document.getElementById("product-title") as HTMLElement;
const productPrice = document.getElementById("product-price") as HTMLElement;

// Contenedor del email
const emailContainer = document.getElementById(
  "email-container"
) as HTMLDivElement;

// Elementos del formulario de email
const emailForm = document.getElementById("email-form") as HTMLFormElement;

const emailInput = document.getElementById("user-email") as HTMLInputElement;
const sendEmailButton = document.getElementById(
  "send-email-button"
) as HTMLButtonElement;

const emailAlert = document.getElementById("email-alert") as HTMLSpanElement;
const searchProductAlert = document.getElementById(
  "search-product-alert"
) as HTMLSpanElement;

// Función para deshabilitar el input durante 10 segundos
function inputDisabled(): void {
  let timer = 11;
  // Deshabilitar el input
  searchProductInput.disabled = true;

  // Mostrar alerta y temporizador
  const interval = setInterval(() => {
    searchProductAlert.classList.remove("hidden");
    timer--;
    searchProductAlert.textContent = `Espera ${timer} segundos para volver a escribir`;
  }, 1000);

  // Habilitar el input después de 10 segundos
  setTimeout(() => {
    searchProductAlert.classList.add("hidden");
    searchProductAlert.textContent = "";
    clearInterval(interval);
    searchProductInput.disabled = false;
  }, 10000);
}

// Función para validar el correo electrónico
function isValid(email: string): boolean {
  const regex =
    /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
  return regex.test(email);
}

// Escucha cambios en el input de producto
searchProductInput.addEventListener("input", () => {
  const productUrl = searchProductInput.value;
  if (!productUrl) return;

  setTimeout(() => {
    fetchProduct(productUrl);
    inputDisabled();
  }, 1000);
});

// Función para scrapear el producto
async function fetchProduct(url: string): Promise<void> {
  try {
    const res = await fetch("http://127.0.0.1:5000/api/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data: { title: string; price: string; img_url: string } =
      await res.json();

    if (productTitle) productTitle.textContent = data.title;
    if (productPrice) productPrice.textContent = data.price + " €";
    if (productImage) productImage.src = data.img_url;

    productCardContainer.classList.remove("hidden");
  } catch (error) {
    console.error("Error al scrapear:", error);
    productCardContainer.classList.remove("hidden");
    productCardContainer.innerHTML = `
        <div class="w-full p-2 bg-red-300 text-red-800 border-red-800 border-2 font-semibold rounded text-center">
          Hubo un error al obtener el producto. Vuelve a intentarlo más tarde.
        </div>
        `;
  }
}

// Envío del formulario de correo
emailForm?.addEventListener("submit", async (event: Event) => {
  event.preventDefault();
  const userEmail = emailInput.value;
  const productUrl = searchProductInput.value;
  const currentPrice = productPrice?.textContent
    .replace("€", "")
    .replace(",", ".")
    .trim();

  if (!isValid(userEmail)) {
    emailAlert.classList.remove("hidden");
    emailAlert.textContent = "Por favor, introduce un correo válido";
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:5000/api/email_sender", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail,
        productUrl,
        productPrice: currentPrice,
      }),
    });

    if (res.ok) {
      emailContainer.innerHTML = `
        <div class="w-full p-2 bg-green-300 text-green-800 font-semibold rounded text-center">
          ¡Correo enviado con éxito! Revisa tu bandeja de entrada.
        </div>
        `;
    } else {
      emailAlert.textContent = "Algo ha salido mal";
      emailAlert.style.display = "flex";
    }
  } catch (error) {
    console.error("Algo ha salido mal:", error);
  }
});

// Resetear la tarjeta del producto
const resetFormButton = document.getElementById(
  "reset-form-button"
) as HTMLButtonElement;

resetFormButton?.addEventListener("click", () => {
  window.location.reload();
});

// Funcionalidad del modal
const modal = document.getElementById("info-modal") as HTMLElement;
const showModalButton = document.getElementById(
  "show-modal-button"
) as HTMLButtonElement;
const closeModalButton = document.getElementById(
  "close-modal-button"
) as HTMLButtonElement;

showModalButton?.addEventListener("click", () => {
  modal?.classList.remove("hidden");
});

closeModalButton?.addEventListener("click", () => {
  modal?.classList.add("hidden");
});

// Cerrar modal con Escape
window.addEventListener("keydown", (event: Event) => {
  if ((event as KeyboardEvent).key === "Escape") {
    modal?.classList.add("hidden");
  }
});
