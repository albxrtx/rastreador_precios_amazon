const productInput = document.getElementById("url") as HTMLInputElement;
const container = document.querySelector(".productCard") as HTMLDivElement;

const productImg = document.getElementById("productImage") as HTMLImageElement;
const productTitle = document.getElementById(
  "productTitle"
) as HTMLElement | null;
const productPrice = document.getElementById(
  "productPrice"
) as HTMLElement | null;

const emailContainer = document.getElementById(
  "emailContainer"
) as HTMLDivElement;
const emailInput = document.getElementById("userEmail") as HTMLInputElement;
const emailForm = document.getElementById("emailForm") as HTMLFormElement;
const sendEmailButton = document.getElementById(
  "sendEmailButton"
) as HTMLButtonElement;
const emailMessage = document.getElementById("emailMessage") as HTMLSpanElement;

let timeout: number | undefined;

// Escucha cambios en el input de producto
productInput.addEventListener("input", () => {
  const url = productInput.value;
  if (!url) return;

  if (timeout) clearTimeout(timeout);
  timeout = window.setTimeout(() => {
    fetchProduct(url);
  }, 1000);
});

function isValid(email: string): boolean {
  const regex =
    /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
  return regex.test(email);
}

async function fetchProduct(url: string): Promise<void> {
  // Reset estado del mensaje y botón de email
  emailMessage.textContent = "";

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
    if (productImg) productImg.src = data.img_url;

    container.classList.remove("hidden");
  } catch (error) {
    console.error("Error al scrapear:", error);
  }
}

// Envío del formulario de correo
emailForm?.addEventListener("submit", async (e: Event) => {
  e.preventDefault();
  const userEmail = emailInput.value;

  if (!isValid(userEmail)) {
    emailMessage.classList.remove("hidden");
    emailMessage.textContent = "Por favor, introduce un correo válido";
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:5000/api/email_sender", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail }),
    });

    if (res.ok) {
      emailContainer.innerHTML = `
        <div class="w-full p-2 bg-green-300 text-green-800 font-semibold rounded text-center">
          ¡Correo enviado con éxito! Revisa tu bandeja de entrada.
        </div>
        `;
    } else {
      emailMessage.style.display = "flex";
    }
  } catch (error) {
    console.error("Algo ha salido mal:", error);
  }
});

// Resetear la tarjeta del producto
const resetButton = document.getElementById("resetButton") as HTMLButtonElement;
resetButton?.addEventListener("click", () => {
  if (productTitle) productTitle.textContent = "";
  if (productPrice) productPrice.textContent = "";
  if (productImg) productImg.src = "";
  container.classList.add("hidden");
});

// Modal
const modal = document.getElementById("modal") as HTMLElement;
const btnModal = document.getElementById("btnModal") as HTMLButtonElement;
const closeModal = document.getElementById("closeModal") as HTMLButtonElement;

btnModal?.addEventListener("click", () => {
  modal?.classList.remove("hidden");
});

closeModal?.addEventListener("click", () => {
  modal?.classList.add("hidden");
});
