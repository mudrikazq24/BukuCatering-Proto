export const STATUS={pending:'Menunggu konfirmasi',confirmed:'Dikonfirmasi',processing:'Diproses',ready:'Siap',done:'Selesai',rejected:'Ditolak',cancelled:'Dibatalkan'};
export const ACTIVE=['confirmed','processing','ready'];
export function total(o){return o.items.reduce((s,x)=>s+x.qty*x.price,0)+(o.shipping||0)}
export function paid(o){return o.payments.reduce((s,x)=>s+(x.type==='refund'?-x.amount:x.amount),0)}
export function balance(o){return Math.max(0,total(o)-paid(o))}
export function paymentStatus(o){return paid(o)<=0?'unpaid':paid(o)<total(o)?'partial':'paid'}
export function normalizeWA(raw){let v=String(raw).replace(/[\s+()-]/g,'');if(v.startsWith('0'))v='62'+v.slice(1);else if(v.startsWith('8'))v='62'+v;return /^62\d{7,13}$/.test(v)?v:null}
export function canTransition(o,next){return ({pending:['confirmed','rejected'],confirmed:['processing','cancelled'],processing:['ready','cancelled'],ready:['done','cancelled']}[o.status]||[]).includes(next)}
export function recap(orders,date){const map=new Map();orders.filter(o=>o.date===date&&ACTIVE.includes(o.status)).forEach(o=>o.items.forEach(x=>{const k=x.name+' · '+x.variant;map.set(k,(map.get(k)||0)+x.qty)}));return [...map].map(([name,qty])=>({name,qty}))}
export function validatePayment(o,amount,type){if(!Number.isSafeInteger(amount)||amount<=0)throw new Error('Isi nominal rupiah yang lebih dari nol.');if(type==='refund'&&amount>paid(o))throw new Error('Pengembalian melebihi pembayaran yang diterima.');if(type!=='refund'&&['pending','rejected','cancelled'].includes(o.status))throw new Error('Pembayaran hanya dicatat untuk pesanan yang sudah dikonfirmasi.');}
export function csvCell(v){let s=String(v??'');if(/^[=+\-@]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'}
