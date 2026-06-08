"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const DOM = {
    encryptBtn  : document.getElementById("encryptBtn"),
    encPlain    : document.getElementById("encPlain"),
    encKey      : document.getElementById("encKey"),
    encOutput   : document.getElementById("encOutput"),
    encHash     : document.getElementById("encHash"),
    encError    : document.getElementById("encError"),

    decryptBtn  : document.getElementById("decryptBtn"),
    decCipher   : document.getElementById("decCipher"),
    decKey      : document.getElementById("decKey"),
    decOutput   : document.getElementById("decOutput"),
    decHash     : document.getElementById("decHash"),
    decError    : document.getElementById("decError"),

    genKeyBtn   : document.getElementById("genKeyBtn"),
    toastBox    : document.getElementById("toastBox"),
    copyButtons : document.querySelectorAll(".copy-btn"),
  };

 
  const CryptoService = {
    encrypt(text, key) {
      return CryptoJS.AES.encrypt(text, key).toString();
    },
    decrypt(cipher, key) {
      const bytes = CryptoJS.AES.decrypt(cipher, key);
      return bytes.toString(CryptoJS.enc.Utf8);
    },
    hash(text) {
      return CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
    },
    generateKey() {
      const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
      const bytes   = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      return Array.from(bytes).map(b => charset[b % charset.length]).join("");
    },
  };

  
  const UI = {
    toast(title, message, type = "success") {
      if (!DOM.toastBox) return;
      const el = document.createElement("div");
      el.className = `toast ${type}`;
      el.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
        <div class="toast-bar"></div>
      `;
      DOM.toastBox.appendChild(el);
      setTimeout(() => {
        el.classList.add("hide");
        setTimeout(() => el.remove(), 300);
      }, 5000);
    },

    showError(el, message) {
      el.textContent = message;
      el.classList.add("show");
    },

    clearError(el) {
      el.textContent = "";
      el.classList.remove("show");
    },

    async copy(button, text) {
      if (!text) {
        UI.toast("NOTHING TO COPY", "Output is empty.", "info");
        return;
      }
      try {
        await navigator.clipboard.writeText(text);
        const original = button.textContent;
        button.textContent = "Copied";
        button.classList.add("copied");
        setTimeout(() => {
          button.textContent = original;
          button.classList.remove("copied");
        }, 1500);
        UI.toast("COPIED", "Output copied to clipboard.", "info");
      } catch {
        UI.toast("COPY FAILED", "Clipboard access denied.", "error");
      }
    },
  };

  function handleEncrypt() {
    UI.clearError(DOM.encError);
    const text = DOM.encPlain.value.trim();
    const key  = DOM.encKey.value.trim();

    if (!text) {
      UI.showError(DOM.encError, "No plaintext provided.");
      UI.toast("MISSING INPUT", "Enter a message to encrypt.", "info");
      return;
    }
    if (!key) {
      UI.showError(DOM.encError, "No encryption key provided.");
      UI.toast("MISSING KEY", "Enter an encryption key.", "info");
      return;
    }

    try {
      DOM.encOutput.value = CryptoService.encrypt(text, key);
      DOM.encHash.value   = CryptoService.hash(text);
      UI.toast("ENCRYPTION COMPLETE", "Message encrypted with AES-256.", "success");
    } catch (err) {
      UI.showError(DOM.encError, "Encryption failed: " + err.message);
      UI.toast("ENCRYPTION FAILED", "Something went wrong.", "error");
    }
  }

  function handleDecrypt() {
     UI.clearError(DOM.decError);
    
     const cipher = DOM.decCipher.value.trim();
    const key    = DOM.decKey.value.trim();

    if (!cipher) { 

      UI.showError(DOM.decError, "No ciphertext provided.");
      UI.toast("MISSING INPUT", "Paste the encrypted message.", "info");
      return;
    }


    if (!key) {


      UI.showError(DOM.decError, "No decryption key provided.");
      UI.toast("MISSING KEY", "Enter the decryption key.", "info");
      return;
    }

    try {


        const plaintext = CryptoService.decrypt(cipher, key);
    if (!plaintext) {
          UI.showError(DOM.decError, "Decryption failed — wrong key or corrupted data.");
      UI.toast("DECRYPTION FAILED", "Wrong key or corrupted ciphertext.", "error");
        DOM.decOutput.value = "";
        DOM.decHash.value   = "";
        return;
      }
      DOM.decOutput.value =plaintext;
      DOM.decHash.value   = CryptoService.hash(plaintext);
      UI.toast("DECRYPTION COMPLETE", "Message decrypted and verified.", "success");
    } catch {
      UI.showError(DOM.decError, "Decryption failed — invalid input or key.");
      UI.toast("DECRYPTION FAILED", "Invalid ciphertext or key.", "error");
    }
  }

  function handleGenerateKey() {
    const key = CryptoService.generateKey();
    DOM.encKey.value = key;
    UI.toast("KEY GENERATED", "16-char key written to field.", "success");
  }

  function handleCopy(button) {
    const field =document.getElementById(button.getAttribute("data-target"));
    if (field) UI.copy(button, field.value);
  } 


  function init() {
    DOM.encryptBtn.addEventListener("click", handleEncrypt);
    DOM.decryptBtn.addEventListener("click", handleDecrypt);
    DOM.genKeyBtn.addEventListener("click",  handleGenerateKey);
    DOM.copyButtons.forEach(btn => btn.addEventListener("click", () => handleCopy(btn)));
    console.log("%c[ ROJO MOJO ] initialized — all systems local.", "color:#5af78e");
  }

  init();
});


