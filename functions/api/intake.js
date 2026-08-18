export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    if (!env.DISCORD_WEBHOOK_URL) {
      return json({ ok:false, error:"Serverconfiguratie ontbreekt." }, 500);
    }

    const data = await request.json();

    const clean = (v, max=1000) =>
      String(v ?? "").trim().slice(0, max) || "—";

    const safe = (v, max=1000) =>
      clean(v, max).replace(/@/g, "@\u200b");

    if (!data.name || !data.email || !data.goal) {
      return json({ ok:false, error:"Verplichte velden ontbreken." }, 400);
    }

    const project = safe(data.project_type);
    const goal = safe(data.goal, 1800);
    const name = safe(data.name);
    const company = safe(data.company);
    const email = safe(data.email);
    const phone = safe(data.phone);
    const budget = safe(data.budget);
    const timing = safe(data.timing);

    // Content is deliberately included as well as an embed.
    // This makes all submitted details visible on desktop AND mobile Discord.
    const content = [
      "✨ **Nieuwe Solveire Custom aanvraag**",
      "",
      `**Project:** ${project}`,
      `**Naam:** ${name}`,
      `**Bedrijf:** ${company}`,
      `**E-mail:** ${email}`,
      `**Telefoon:** ${phone}`,
      `**Budget:** ${budget}`,
      `**Gewenste start:** ${timing}`,
      "",
      "**Wat wil de aanvrager oplossen of bereiken?**",
      goal
    ].join("\n");

    const payload = {
      username: "Solveire Website",
      content,
      allowed_mentions: { parse: [] },
      embeds: [{
        title: "Nieuwe projectaanvraag via de website",
        color: 7545633,
        footer: { text: "Solveire · Custom Development" },
        timestamp: new Date().toISOString()
      }]
    };

    const discord = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!discord.ok) {
      const detail = await discord.text().catch(() => "");
      return json({
        ok:false,
        error:"Discord kon niet worden bereikt.",
        detail: detail.slice(0,300)
      }, 502);
    }

    return json({ ok:true });
  } catch (e) {
    return json({ ok:false, error:"Onverwachte serverfout." }, 500);
  }
}

function json(body, status=200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type":"application/json",
      "Cache-Control":"no-store"
    }
  });
}
