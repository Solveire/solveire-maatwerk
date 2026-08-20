const SOLVEIRE_PUBLIC_STYLES = `
/* Shared Solveire public readability layer */
html{font-size:16px}
body{font-family:'Poppins',ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
body p{font-size:15px;line-height:1.7}
body label{font-size:13px;line-height:1.45;font-weight:600}
body input,body textarea,body select{font-size:15px;line-height:1.5}
body button,body .btn,body a.btn{font-size:14px;line-height:1.35;font-weight:600}
body small,body .eyebrow,body .kicker,body .badge,body .tag{font-size:12px;line-height:1.45}
body h1{font-weight:600;line-height:1.08;letter-spacing:-.045em}
body h2{font-weight:600;line-height:1.14;letter-spacing:-.035em}
body h3{font-weight:600;line-height:1.2;letter-spacing:-.025em}
body nav a,body header a{font-size:14px}
@media(max-width:760px){html{font-size:16px}body p{font-size:15px}body button,body .btn,body a.btn{font-size:14px}body input,body textarea,body select{font-size:16px}body label{font-size:13px}body small,body .eyebrow,body .kicker,body .badge,body .tag{font-size:12px}}
`;

export async function onRequest(context) {
  const response = await context.next();
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;

  return new HTMLRewriter()
    .on('head', {
      element(element) {
        element.append(`<style>${SOLVEIRE_PUBLIC_STYLES}</style>`, { html: true });
      }
    })
    .transform(response);
}
