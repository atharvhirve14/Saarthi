const sendBtn = document.querySelector(".send");
const input = document.querySelector("input");
const chatContainer = document.getElementById("chat-container");

function scrollToBottom() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  });
}

sendBtn.addEventListener("click", sendMessage);

// Enter key support
input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  const message = input.value;
  console.log("Sending:", message); // DEBUG

  if (!message.trim()) {
    alert("Enter message");
    return;
  }

  // ✅ Show user message
  const userMsg = document.createElement("div");
  userMsg.classList.add("user-msg");
  userMsg.innerText = message;
  chatContainer.appendChild(userMsg);
  scrollToBottom(); 

  // ✅ Loader
  const loader = document.createElement("div");
  loader.classList.add("bot-msg");
  loader.innerText = "Saarthi is thinking...";
  chatContainer.appendChild(loader);
  scrollToBottom(); 

  // Clear input
  input.value = "";


  fetch("http://127.0.0.1:5000/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: message })
  })
  .then(res => res.json())
  .then(data => {
    setTimeout(() => {
    loader.remove(); // remove loader

    // ✅ Show bot response
    const botMsg = document.createElement("div");
    botMsg.classList.add("bot-msg");

   botMsg.innerHTML = `
  <h3>🧘 ${data.character}</h3>
  
  <p><b>Emotion:</b> ${data.emotion}</p>
  <p><b>Domain:</b> ${data.domain}</p>
  
  <p><b>Teaching:</b><br> ${data.teaching}</p>
  
  <p><b>Advice:</b><br> ${data.advice}</p>
`;

    chatContainer.appendChild(botMsg);
    scrollToBottom();   // ✅ 3rd call

  }, 500);

})
  .catch(err => {
    console.error(err);
    loader.innerText = "Error getting response";
  });
}

document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    input.value = card.innerText;
    sendMessage();
  });
});


