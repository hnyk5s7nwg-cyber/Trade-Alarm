let setup=null,sub=null;const $=x=>document.querySelector(x);function b64(s){const p='='.repeat((4-s.length%4)%4),b=(s+p).replace(/-/g,'+').replace(/_/g,'/'),r=atob(b),a=new Uint8Array(r.length);for(let i=0;i<r.length;i++)a[i]=r.charCodeAt(i);return a}async function enable(){if(!('serviceWorker'in navigator)||!('PushManager'in window))throw Error('Bu cihaz Web Push desteklemiyor. Uygulamayı Ana Ekrana ekleyip oradan aç.');const reg=await navigator.serviceWorker.register('/sw.js');const perm=await Notification.requestPermission();if(perm!=='granted')throw Error('Bildirim izni verilmedi');const cfg=await fetch('/api/config').then(r=>r.json());if(!cfg.vapidPublicKey)throw Error('Sunucuda VAPID anahtarı eksik');sub=await reg.pushManager.getSubscription()||await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64(cfg.vapidPublicKey)});$('#notify').textContent='BİLDİRİMLER AÇIK';return sub}function render(s){const c=$('#card');c.className=`card ${s.side==='SHORT'?'SHORTCARD':''}`;c.innerHTML=`<div class="top"><div><small>${s.symbol}</small><div class="side ${s.side}">${s.side}</div></div><div class="lev">${s.leverage}x ISOLATED</div></div><div class="grid"><div class="cell"><span>GİRİŞ</span><b>${s.entry}</b></div><div class="cell"><span>KULLANILACAK</span><b>$${s.margin}</b></div><div class="cell loss"><span>STOP</span><b>${s.stop}</b></div><div class="cell loss"><span>MAX KAYIP</span><b>-$${s.maxLoss}</b></div><div class="cell profit"><span>TP1</span><b>${s.tp1}</b><small>+$${s.profit1}</small></div><div class="cell profit"><span>TP2</span><b>${s.tp2}</b><small>+$${s.profit2}</small></div></div><button class="arm" id="arm">SETUP'I İZLE</button><p><small>${s.reason}</small></p>`;$('#arm').onclick=arm}async function find(){try{$('#status').textContent='TARANIYOR';$('#msg').textContent='Binance Global taranıyor…';const r=await fetch('/api/setup',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({capital:+$('#capital').value})});const d=await r.json();if(!r.ok)throw Error(d.error||'Setup bulunamadı');setup=d;render(d);$('#status').textContent='SETUP VAR';$('#msg').textContent='LONG ve SHORT birlikte değerlendirildi.'}catch(e){$('#status').textContent='BEKLE';$('#msg').textContent=e.message}}async function arm(){try{if(!sub)await enable();const r=await fetch('/api/watch',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({subscription:sub,setup})});if(!r.ok)throw Error('Alarm kurulamadı');$('#status').textContent='ALARM AKTİF';$('#msg').textContent='Uygulamayı kapatabilirsin. Şartlar oluşursa bildirim gelir.';$('#arm').textContent='ALARM AKTİF'}catch(e){$('#msg').textContent=e.message}}$('#find').onclick=find;$('#notify').onclick=()=>enable().then(()=>$('#msg').textContent='Bildirimler hazır.').catch(e=>$('#msg').textContent=e.message);if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js');
async function testNotification() {
  const btn = document.querySelector('#test-notification');
  const msg = document.querySelector('#msg');

  try {
    btn.textContent = 'TEST GÖNDERİLİYOR...';
    btn.disabled = true;

    if (!sub) await enable();

    const response = await fetch('/api/test-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: sub })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Bildirim gönderilemedi.');
    }

    msg.textContent = 'Test bildirimi gönderildi. iPhone bildirimlerini kontrol et.';
  } catch (error) {
    msg.textContent = error.message;
  } finally {
    btn.textContent = '🔔 TEST BİLDİRİMİ';
    btn.disabled = false;
  }
}

const testButton = document.createElement('button');
testButton.id = 'test-notification';
testButton.textContent = '🔔 TEST BİLDİRİMİ';
testButton.style.marginTop = '12px';
testButton.addEventListener('click', testNotification);

document.querySelector('#notify').insertAdjacentElement('afterend', testButton);
