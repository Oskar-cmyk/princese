const message = document.getElementById("message");
const button = document.getElementById("changeMessageButton");

if (message && button) {
  button.addEventListener("click", () => {
    message.textContent = "Thanks for clicking!";
  });
}
