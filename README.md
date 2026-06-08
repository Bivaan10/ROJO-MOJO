
# ROJO MOJO

encrypt and decrypt messages in the browser. no backend, no accounts, nothing leaves your machine.

**[→ demo](https://bivaan10.github.io/ROJO-MOJO/)**



## what it does

paste a message, give it a key, get ciphertext. paste ciphertext back with the same key, get your message. SHA-256 hashes both sides so you can tell if something went wrong.

the key generator uses `window.crypto.getRandomValues()` instead of `Math.random()`  small thing, but it matters for this kind of tool.

---

## running it

just open `index.html`. that's it.




three files, same folder:

index.html
script.js
styles.css
 
## stack

vanilla HTML/CSS/JS — no framework, no bundler, no build step.

- [CryptoJS 4.2.0](https://github.com/brix/crypto-js)
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/)
