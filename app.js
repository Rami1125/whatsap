// Front JS - תקשורת ל-Apps Script


let currentClient = null;
let pickedItems = [];


async function api(action, data){
try{
const body = JSON.stringify(data || {});
const r = await fetch(WEBAPP_URL + '?action=' + action, {method:'POST',headers:{'Content-Type':'application/json'},body});
return await r.json();
} catch(e){console.error(e);alert('שגיאת תקשורת');}
}


// Login
document.getElementById('btnLogin').addEventListener('click', async ()=>{
const user = document.getElementById('username').value.trim();
const pass = document.getElementById('password').value.trim();
if(!user||!pass){alert('אנא הזן שם משתמש וסיסמה');return}
const res = await api('login',{user,pass});
if(res && res.success){
currentClient = res.client; onLogin();
} else alert('כניסה נכשלה');
});


function onLogin(){
document.getElementById('welcome').textContent = 'שלום, ' + currentClient.name;
document.getElementById('clientCard').style.display='block';
}


// Load products/colors
(async ()=>{
const p = await api('listProducts',{});
const c = await api('listColors',{});
if(p) renderList('productSuggestions', p.map(x=>`${x.name} | ${x.sku}`));
if(c) renderList('colorsList', c.map(x=>`${x.brand} - ${x.code} - ${x.name}`));
})();


function renderList(id, arr){const el=document.getElementById(id);if(!el) return;el.innerHTML='';arr.forEach(v=>{const d=document.createElement('div');d.textContent=v;d.style.padding='6px';d.style.borderBottom='1px solid rgba(255,255,255,0.02)';d.onclick=()=>document.getElementById('productSearch').value=v;el.appendChild(d)})}


// Add item
document.getElementById('btnAddItem').addEventListener('click', async ()=>{
const q = document.getElementById('productSearch').value.trim(); if(!q) return alert('הזן מוצר');
const found = await api('searchProducts',{q});
if(found && found.length){
pickedItems.push({...found[0],qty:1});
} else {
pickedItems.push({name:q,unknown:true,qty:1});
}
renderPicked();
});


function renderPicked(){const el=document.getElementById('pickedItems');el.innerHTML='';pickedItems.forEach(it=>{const d=document.createElement('div');d.textContent=(it.unknown?it.name+" (לא מזוהה)":it.name+" | " + (it.sku||''));d.style.padding='6px';el.appendChild(d)})}


// Send WA
}
