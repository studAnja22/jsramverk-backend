# SSR Editor, DV1677 JSRamverk

Startprocess
------------

För att få applikationen att rulla så utfördes följande steg:

1. Zip-filen med startkoden laddades ned
2. Ett Git-repo skapades och delades
3. npm-paket installerades (``express``, ``bodyParser``, ``path``, ``morgan``, ``cors``)
4. ``nodemon`` installerades
5. ``"start": "nodemon app.mjs"`` lades till under ``scripts`` i package.json
6. ``npm audit`` kördes för att söka efter och åtgärda eventuella säkerhetshål
7. ``dotenv`` installerades
8. En ``.env``-fil skapades och raden ``PORT=1337`` lades till
9. Filen reset_db.bash modifierades genom att ta bort db/
10. Ett formulär lades till i ``views/index.ejs``, för att kunna skapa nya dokument
11. ``documents.updateOne(body)`` skapades i docs.mjs, för att kunna uppdatera innehållet i dokumenten
12. Routen ``POST /update`` skapades

Frontend-ramverk
----------------

Vi har valt att arbeta med ramverket React under kursens gång.
