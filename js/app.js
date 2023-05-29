const copyText = document.querySelector("#copyText");
const modelSelector = document.querySelector("#modelSelector");
const addEmoji = document.querySelector("#addEmoji");
const clearText = document.querySelector("#clearText");
const emojiContainer = document.querySelector("#emojiContainer");


const inputText = document.querySelector("#inputText");
const previewText = document.querySelector("#previewText");

const emojiModal = document.querySelector("#emojiModal");
const apiEmoji = "https://emoji-api.com/emojis?access_key=afbf73a432f34028d70288c21768f4195cd6e0b9";


const openModalEmoji = () => emojiModal.style.display = "block";

const closeModalEmoji = () => emojiModal.style.display = "none";

const eraseText = () => {
    inputText.value = "";
    previewText.innerHTML = "";
}

const clearFormatting = () => {
    const unformattedText = inputText.value.replace(/\*|_|~/g, "");

    inputText.value = unformattedText;
}

function addFormatting(mark) {
    const start = inputText.selectionStart;
    const end = inputText.selectionEnd;

    const selectedText = inputText.value.substring(start, end);
    const formattedText = mark + selectedText + mark;
    const textFormatting = inputText.value.substring(0, start) + formattedText + inputText.value.substring(end);

    inputText.value = textFormatting;

    updatePreview();
}

function addList(type) {
    const start = inputText.selectionStart;
    const end = inputText.selectionEnd;

    const selectedText = inputText.value.substring(start, end);
    let listItems = selectedText.split('\n');
    let formattedText = "";

    if (type === "ul") {
        formattedText = listItems.map(item => "- " + item).join("\n")
    } else if (type === "ol") {
        let index = 1;

        formattedText = listItems.map(item => {
            if (item.startsWith(index + ".")) {
                index++;
                return item.replace(/^\d+\./, index - 1 + ".");
            } else if (item.startsWith((index - 1) + ".")) {
                return item.replace(/^\d+\./, index - 1 + ".1.");
            } else if (item.startsWith((index - 1) + "1")) {
                return item.replace(/^\d+\.\d+\./, index - 1 + ".2.");
            } else {
                index++;
                return index - 1 + ". " + item;
            }
        }).join("\n");
    }

    const textFormatting = inputText.value.substring(0, start) + formattedText + inputText.value.substring(end);

    inputText.value = textFormatting;

    updatePreview();
}
  
function copyTextFunc() {
    inputText.select();
    inputText.setSelectionRange(0, 99999);
   
    if(inputText === null || inputText === '') {
        alert("Sem mensagem para copiar =(")
    } else {
        navigator.clipboard.writeText(inputText.value)
        confirm(`Mensagem ${inputText.value} copiada com sucesso =)`)
    }

    eraseText();
}

function insertEmoji(emoji) {
    const start = inputText.selectionStart;
    const end = inputText.selectionEnd;

    const formattedText = emoji;

    const textFormatting = inputText.value.substring(0, start) + formattedText + inputText.value.substring(end);
    inputText.value = textFormatting;

    updatePreview();
    closeModalEmoji();
}

function updatePreview() {
    const formattedText = inputText.value
    .replace(/\*([^\*]+)\*/g, "<b>$1</b>")
    .replace(/\_([^\_]+)\_/g, "<i>$1</i>")
    .replace(/\~([^\~]+)\~/g, "<strike>$1</strike>")
    .replace(/\`([^`]+)\`(?![^<]*<\/code>)/g, "<code>$1</code>")
    .replace(/\n\-\s/g, "<br>- ")
    .replace(/\n\d+\.\s/g, "<br>1. ")
    .replace(/`/g, "");

    previewText.innerHTML = formattedText;
}

function selectModel() {
    const selectModel = modelSelector.value;

    if (selectModel === "Boas-vindas") {
        document.getElementById("inputText").value = "Olá! Bem-vindo(a) ao nosso grupo. Esperamos que você aproveite sua estadia e participe ativamente das discussões.";
    } else if (selectModel === "Ola") {
        document.getElementById("inputText").value = "Olá! como posso te ajudar ?.";
    } else if (selectModel === "Agradecimento") {
        document.getElementById("inputText").value = "Muito obrigado(a) pelo seu tempo e consideração. Agradecemos sua participação.";
    } else if (selectModel === "ConfirmacaoPedido") {
        document.getElementById("inputText").value = "Olá!, Seu pedido foi confirmado. Em breve, entraremos em contato para fornecer mais informações.";
    } else if (selectModel === "Promocao") {
        document.getElementById("inputText").value = "Temos uma promoção especial para você. Aproveite descontos incríveis em nossos produtos!";
    } else if (selectModel === "Lembrete") {
        document.getElementById("inputText").value = "Apenas um lembrete sobre nosso evento no próximo fim de semana. Esperamos vê-lo lá!";
    } else if (selectModel === "Despedida") {
        document.getElementById("inputText").value = "Até logo! Desejamos um ótimo dia para você.";
    }

    updatePreview();
}

function fetchEmojis() {
    fetch(apiEmoji)
    .then(response => response.json())
    .then(data => {
        let emojiSearchInput = document.querySelector("#emojiSearch");

        emojiSearchInput.addEventListener('input', () =>{
            let searchQuery = emojiSearchInput.value.toLowerCase();

            let filterEmojis = data.filter(emoji => {
                return emoji.unicodeName.toLowerCase().includes(searchQuery);
            });

            renderEmojis(filterEmojis);
        });

        renderEmojis(data);
    })
    .catch(error => {
        console.error('Erro ao buscar emojis:', error);
    });
}

function renderEmojis(emojis) {
    emojiContainer.innerHTML = "";

    emojis.forEach(emoji => {
        let btn = document.createElement("button");
        btn.textContent = emoji.character;

        btn.addEventListener("click", () => {
            insertEmoji(emoji.character);
            closeModalEmoji();
        });

        emojiContainer.appendChild(btn);
    })
}

fetchEmojis();