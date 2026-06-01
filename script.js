const message = document.getElementById("message");
const button = document.getElementById("changeMessageButton");

button.addEventListener("click", () => {
  message.textContent = "Thanks for clicking!";
});
