SOLVEIRE CUSTOM V6

Voor een werkend formulier:
1. Deploy de HELE map via Cloudflare Pages/GitHub.
2. Voeg in Cloudflare Pages een secret toe met naam:
   DISCORD_WEBHOOK_URL
3. Vul daar je Discord webhook URL in.
4. Deploy opnieuw.

Lokaal openen van index.html kan het formulier NIET naar Discord sturen,
omdat /api/intake pas op Cloudflare Pages bestaat.

Na succesvolle verzending verschijnt automatisch een bedankscherm:
'We nemen binnen 24 uur contact met je op.'
