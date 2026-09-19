document.querySelectorAll('[data-menu]').forEach(btn=>btn.addEventListener('click',()=>document.querySelector('.nav-links')?.classList.toggle('open')));
document.querySelectorAll('form[data-intake]').forEach(form=>form.addEventListener('submit',async(e)=>{
 e.preventDefault(); const status=form.querySelector('.status'); const btn=form.querySelector('button[type="submit"]');
 status.textContent='Even versturen…'; btn.disabled=true;
 const data=Object.fromEntries(new FormData(form).entries());
 try{const res=await fetch('/api/intake',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
 const out=await res.json(); if(!res.ok||!out.ok) throw new Error(out.error||'Versturen mislukt');
 status.textContent='Dankjewel. Je aanvraag is verstuurd. Ik kom persoonlijk bij je terug.'; form.reset();
 }catch(err){status.textContent='Dat ging niet goed. Mail je aanvraag gerust naar info@solveire.nl.';}finally{btn.disabled=false;}
}));