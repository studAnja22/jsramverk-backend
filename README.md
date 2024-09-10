# SSR Editor, DV1677 JSRamverk

Startprocess
------------

För att få applikationen att rulla så utfördes följande steg:

1. Appen ``emilfolino/ssr-editor`` laddades ner som en zip-fil.
2. ``npm install`` körs för att säkerställa att paketen är installerade.
3. Installerar ``npm install dotenv``. ``.env`` fil lades till i root och innehåller följande data ``PORT=1337``.
4. Kör ``npm audit`` och ``npm audit fix`` för att söka efter och åtgärda eventuella säkerhetshål.
5. Installerar ``npm install nodemon``. ``"start": "nodemon app.mjs"`` läggs till under ``scripts`` i package.json. Applikationen kan nu startas med kommandot ``npm start`` och ses i ``localhost:1337``.
6. Filen reset_db.bash modifierades genom att ta bort db/ och ändrade ``$(> docs.sqlite)`` till ``: > docs.sqlite`` vilket, när den körs, skapar filen om den inte finns och tömmer den om den finns.
7. ``bash reset_db.bash`` kan nu köras vilket skapar table ``documents`` i databasen. Den är för närvarande tom vilket orsakar problem i views.
8. Vi lägger till felhantering i filerna i views. Om databasen är tom, visas standardvärden i formulären för att undvika tomma fält eller felmeddelanden. Exempel i doc.ejs: ``value="<%= doc.title %>" />`` ändrades till ``value="<%= docs && docs.title ? docs.title : 'Default Title' %>"``. Innan denna ändring kunde errorn 'Error SQLITE_ERROR no such table: documents' dyka upp trots att documents fanns i databasen (dock tom, därav errorn).
9. Ett formulär lades till i ``views/index.ejs``, för att kunna skapa nya dokument med innehåll.
10. ``documents.updateOne(body)`` skapades i docs.mjs, för att kunna uppdatera innehållet i dokumenten.
11. Routen ``POST /update`` skapades.

Frontend-ramverk
----------------

Vi har valt att arbeta med ramverket React under kursens gång.
