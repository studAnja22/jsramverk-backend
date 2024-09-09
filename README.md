# SSR Editor

## Starter project for DV1677 JSRamverk

Startprocess
------------

För att få applikationen att rulla så utfördes följande steg:

1. Zip-fil med startkoden laddades ned
2. npm-paket installerades
3. nodemon installerades
4. <span style="font-family:'Courier New', Courier, monospace">start "nodemon app.mjs"</span> lades till under scripts i package.json
5. ``npm audit`` kördes för att åtgärda eventuella säkerhetshål
6. en .env-fil skapades och raden **PORT=1337;** lades till
7. 