export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    if (!env.DISCORD_WEBHOOK_URL) return json({ ok:false, error:"Serverconfiguratie ontbreekt." }, 500);

    const data = await request.json();
    const clean = (v, max=1000) => String(v ?? "").trim().slice(0,max) || "—";

    if (!data.name || !data.email || !data.goal) {
      return json({ ok:false, error:"Verplichte velden ontbreken." }, 400);
    }

    const fields = [
      ["Project", data.project_type],
      ["Doel / vraag", data.goal],
      ["Naam", data.name],
      ["Bedrijf", data.company],
      ["E-mail", data.email],
      ["Telefoon", data.phone],
      ["Budget", data.budget],
      ["Gewenste start", data.timing]
    ].map(([name,value]) => ({name, value:clean(value), inline:["Naam","Bedrijf","E-mail","Telefoon","Budget","Gewenste start"].includes(name)}));

    const discord = await fetch(env.DISCORD_WEBHOOK_URL, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        username:"Solveire Website",
        embeds:[{
          title:"✨ Nieuwe Solveire Custom aanvraag",
          description:"Nieuwe projectaanvraag via de website.",
          color:7545633,
          fields,
          footer:{text:"Solveire · Custom Development"},
          timestamp:new Date().toISOString()
        }]
      })
    });

    if (!discord.ok) return json({ ok:false, error:"Discord kon niet worden bereikt." }, 502);
    return json({ ok:true });
  } catch(e) {
    return json({ ok:false, error:"Onverwachte serverfout." }, 500);
  }
}

function json(body,status=200){
  return new Response(JSON.stringify(body),{
    status,
    headers:{"Content-Type":"application/json","Cache-Control":"no-store"}
  });
}
