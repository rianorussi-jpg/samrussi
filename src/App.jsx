import React, { useState } from "react";

/* ────────────────────────────────────────────────────────────────────────
   PREVIEW — Tienda de sets fotográficos digitales (autocontenido)
   Esta versión no usa Stripe ni EmailJS reales (para poder abrirse aquí
   mismo como preview). El pago y el envío de correo están simulados.
   Cuando el cliente lo apruebe, se conecta con Stripe/EmailJS/Telegram
   igual que en Fresas Palace / 11once.
──────────────────────────────────────────────────────────────────────── */

const BRAND    = "SamRussi";
const TAGLINE  = "Sets digitales";
const LOGO_TXT = "SR";

const bg      = "#0b0b0c";
const card    = "#141416";
const cardHi  = "#1a1a1d";
const border  = "#2a2a2d";
const accent  = "#c9a24b";
const text    = "#f3efe8";
const muted   = "#938d84";
const pill    = "#1e1e21";

const displayFont = "'Fraunces', Georgia, serif";
const uiFont      = "'Inter', system-ui, sans-serif";

const SETS = [
  { id:"set-eclipse", nombre:"Set Eclipse", desc:"12 retratos en blanco y negro, luz dramática de estudio.", fotos:12,
    cover:"image/uno.jpg",
    precio:350 },
  { id:"set-aurora", nombre:"Set Aurora", desc:"18 retratos a color, estilo editorial con luz natural suave.", fotos:18,
    cover:"image/aurora.jpg",
    precio:350 },
  { id:"set-contraluz", nombre:"Set Contraluz", desc:"15 escenas callejeras en blanco y negro, alto contraste.", fotos:15,
    cover:"image/contraluz.jpg",
    precio:350 },
  { id:"set-horizonte", nombre:"Set Horizonte", desc:"14 paisajes de larga exposición al amanecer.", fotos:14,
    cover:"image/horizonte.jpg",
    precio:350 },
  { id:"set-vinculo", nombre:"Set Vínculo", desc:"25 momentos documentales de la ceremonia y recepción.", fotos:25,
    cover:"image/vinculo.jpg",
    precio:350 },
];

function carritoLineKey(i){ return i.id; }

function Btn({ children, onClick, variant="primary", disabled }) {
  const base = { border:"none", cursor:disabled?"default":"pointer", borderRadius:2, fontFamily:uiFont, fontWeight:600, fontSize:14, letterSpacing:"0.03em", transition:"opacity 0.15s, background 0.15s", opacity:disabled?0.4:1, textTransform:"uppercase" };
  if (variant==="primary") return <button onClick={onClick} disabled={disabled} style={{ ...base, background:accent, color:"#0b0b0c", padding:"15px 0", width:"100%" }}>{children}</button>;
  if (variant==="ghost")   return <button onClick={onClick} disabled={disabled} style={{ ...base, background:"none", color:muted, padding:"15px 0", textTransform:"none", fontWeight:500 }}>{children}</button>;
}

function FilmStrip({ paso }) {
  const steps = ["Explorar","Carrito","Entrega"];
  const sprockets = (n) => Array.from({length:n});
  return (
    <div style={{ margin:"6px 0 30px" }}>
      <div style={{ display:"flex", alignItems:"stretch" }}>
        {steps.map((label,i) => {
          const n=i+1, active=paso===n, done=paso>n;
          return (
            <React.Fragment key={n}>
              <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:0 }}>
                <div style={{ display:"flex", gap:3, marginBottom:3 }}>
                  {sprockets(5).map((_,k)=><div key={k} style={{ width:4, height:4, borderRadius:1, background:(active||done)?accent:border }} />)}
                </div>
                <div style={{ width:"100%", height:34, background:done?"rgba(201,162,75,0.12)":active?cardHi:card, border:`1px solid ${active?accent:border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontFamily:uiFont, fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:active?accent:done?text:muted }}>{done?"✓ "+label:label}</span>
                </div>
                <div style={{ display:"flex", gap:3, marginTop:3 }}>
                  {sprockets(5).map((_,k)=><div key={k} style={{ width:4, height:4, borderRadius:1, background:(active||done)?accent:border }} />)}
                </div>
              </div>
              {i<steps.length-1 && <div style={{ width:10 }} />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function SetModal({ item, onConfirm, onClose }) {
  const overlay = { position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" };
  const sheet   = { background:bg, borderTop:`1px solid ${border}`, padding:"0 0 32px", maxWidth:520, width:"100%", maxHeight:"92vh", overflowY:"auto" };

  return (
    <div style={overlay} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={sheet}>
        <div style={{ position:"relative", height:260, overflow:"hidden" }}>
          <img src={item.cover} alt={item.nombre} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg, rgba(11,11,12,0) 40%, rgba(11,11,12,0.95) 100%)" }} />
          <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:"rgba(0,0,0,0.5)", border:`1px solid ${border}`, borderRadius:"50%", width:34, height:34, fontSize:16, cursor:"pointer", color:text, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          <div style={{ position:"absolute", left:20, bottom:16, right:20 }}>
            <div style={{ fontFamily:uiFont, fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:accent, marginBottom:4 }}>{item.fotos} fotos en alta resolución</div>
            <div style={{ fontFamily:displayFont, fontWeight:600, fontSize:24, color:text }}>{item.nombre}</div>
          </div>
        </div>
        <div style={{ padding:"18px 20px 0" }}>
          <p style={{ fontFamily:uiFont, fontSize:13, color:muted, lineHeight:1.6, margin:"0 0 20px" }}>{item.desc}</p>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
            <span style={{ fontFamily:uiFont, fontSize:11, color:muted, textTransform:"uppercase", letterSpacing:"0.08em" }}>Precio del set</span>
            <span style={{ fontFamily:displayFont, fontWeight:700, fontSize:22, color:accent }}>${item.precio}</span>
          </div>
          <Btn onClick={()=>onConfirm({ precio:item.precio })}>Agregar al carrito — ${item.precio}</Btn>
        </div>
      </div>
    </div>
  );
}

function SetCard({ item, onAdd }) {
  const [showModal, setShowModal] = useState(false);
  const [flash, setFlash] = useState(false);

  const handleAdd = () => {
    onAdd({ id:item.id, nombre:item.nombre, cover:item.cover, precio:item.precio });
    setFlash(true); setTimeout(()=>setFlash(false),900);
  };

  const handleConfirm = ({ precio }) => {
    onAdd({ id:item.id, nombre:item.nombre, cover:item.cover, precio });
    setShowModal(false);
    setFlash(true); setTimeout(()=>setFlash(false),900);
  };

  return (
    <>
      {showModal && <SetModal item={item} onConfirm={handleConfirm} onClose={()=>setShowModal(false)} />}
      <div style={{ background:card, border:`1px solid ${border}`, overflow:"hidden" }}>
        <div style={{ position:"relative", height:170, overflow:"hidden", cursor:"pointer" }} onClick={()=>setShowModal(true)}>
          <img src={item.cover} alt={item.nombre} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
          <div style={{ position:"absolute", top:10, left:10, background:"rgba(11,11,12,0.75)", border:`1px solid ${border}`, borderRadius:2, padding:"4px 9px", fontFamily:uiFont, fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:accent }}>{item.fotos} fotos</div>
        </div>
        <div style={{ padding:"14px 16px 16px" }}>
          <div style={{ fontFamily:displayFont, fontWeight:600, fontSize:17, color:text, marginBottom:4 }}>{item.nombre}</div>
          <p style={{ fontFamily:uiFont, fontSize:12, color:muted, lineHeight:1.5, margin:"0 0 14px" }}>{item.desc}</p>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <div style={{ fontFamily:displayFont, fontWeight:600, fontSize:18, color:accent }}>${item.precio}</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <button onClick={()=>setShowModal(true)} style={{ border:`1px solid ${border}`, background:"none", cursor:"pointer", borderRadius:2, padding:"10px 14px", fontFamily:uiFont, fontWeight:700, fontSize:11, letterSpacing:"0.06em", textTransform:"uppercase", color:text }}>
              Vista previa
            </button>
            <button onClick={handleAdd} style={{ border:`1px solid ${flash?accent:accent}`, background:flash?accent:"none", cursor:"pointer", borderRadius:2, padding:"10px 14px", fontFamily:uiFont, fontWeight:700, fontSize:11, letterSpacing:"0.06em", textTransform:"uppercase", color:flash?"#0b0b0c":accent }}>
              {flash ? "✓ Agregado" : "Agregar al carrito"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function HeaderCarrito({ carrito, abiertoCarro, setAbiertoCarro }) {
  const total = carrito.reduce((s,i)=>s+i.precio*i.cantidad,0);
  const tieneItems = carrito.length > 0;

  return (
    <div style={{ borderBottom:`1px solid ${border}`, padding:"18px 20px 0", position:"sticky", top:0, background:bg, zIndex:10 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: tieneItems ? 14 : 18 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:38, height:38, border:`1px solid ${accent}`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:displayFont, fontWeight:600, fontSize:10, color:accent }}>{LOGO_TXT}</div>
          <div>
            <div style={{ fontFamily:displayFont, fontWeight:600, fontSize:18, letterSpacing:"0.04em", lineHeight:1.1, color:text }}>{BRAND}</div>
            <div style={{ fontFamily:uiFont, fontSize:11, color:muted }}>{TAGLINE}</div>
          </div>
        </div>
        {tieneItems && !abiertoCarro && (
          <button onClick={()=>setAbiertoCarro(true)} style={{ background:pill, border:`1px solid ${border}`, borderRadius:2, padding:"7px 13px", cursor:"pointer", display:"flex", alignItems:"center", gap:7, fontFamily:uiFont, fontSize:12, fontWeight:700, color:accent }}>
            <span>🎞️ ${total.toFixed(0)}</span>
          </button>
        )}
      </div>
      {tieneItems && abiertoCarro && (
        <div style={{ borderTop:`1px solid ${border}`, paddingTop:12, paddingBottom:14 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {carrito.map(i => (
              <div key={carritoLineKey(i)} style={{ display:"flex", alignItems:"center", gap:10, fontFamily:uiFont }}>
                <div style={{ width:28, height:28, borderRadius:2, overflow:"hidden", flexShrink:0 }}>
                  <img src={i.cover} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                </div>
                <span style={{ flex:1, fontSize:13, color:text, fontWeight:500 }}>
                  {i.cantidad}× {i.nombre}
                </span>
                <span style={{ fontSize:13, fontWeight:700, color:accent }}>${(i.precio*i.cantidad).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10, paddingTop:10, borderTop:`1px dashed ${border}` }}>
            <button onClick={()=>setAbiertoCarro(false)} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:uiFont, fontSize:11, fontWeight:700, color:muted, textTransform:"uppercase", letterSpacing:"0.06em" }}>Ocultar ▲</button>
            <span style={{ fontFamily:uiFont, fontSize:14, fontWeight:700, color:text }}>Total: <span style={{ color:accent }}>${total.toFixed(0)}</span></span>
          </div>
        </div>
      )}
    </div>
  );
}

function PasoGaleria({ carrito, onAdd, onNext }) {
  const total = carrito.reduce((s,i)=>s+i.precio*i.cantidad,0);
  const count = carrito.reduce((s,i)=>s+i.cantidad,0);
  return (
    <div>
      <div style={{ textAlign:"center", margin:"0 0 30px" }}>
        <h2 style={{ fontFamily:displayFont, fontWeight:600, fontSize:24, color:text, margin:"0 0 8px" }}>Sets disponibles</h2>
        <p style={{ fontFamily:uiFont, fontSize:13, color:muted, margin:0 }}>Fotos en alta resolución, entregadas por correo tras tu compra.</p>
      </div>
      <div style={{ marginBottom:32 }}>
        <div style={{ fontFamily:uiFont, fontWeight:700, fontSize:11, textTransform:"uppercase", letterSpacing:"0.14em", color:accent, marginBottom:14 }}>
          Sets
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {SETS.map(item => <SetCard key={item.id} item={item} onAdd={onAdd} />)}
        </div>
      </div>
      {count>0 && (
        <div style={{ position:"sticky", bottom:16, background:accent, borderRadius:2, padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", boxShadow:"0 8px 32px rgba(201,162,75,0.35)" }} onClick={onNext}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ background:"rgba(11,11,12,0.2)", borderRadius:"50%", width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:uiFont, fontWeight:800, fontSize:13, color:"#0b0b0c" }}>{count}</span>
            <span style={{ fontFamily:uiFont, fontWeight:700, fontSize:13, letterSpacing:"0.04em", textTransform:"uppercase", color:"#0b0b0c" }}>Ver carrito</span>
          </div>
          <span style={{ fontFamily:displayFont, fontWeight:700, fontSize:17, color:"#0b0b0c" }}>${total.toFixed(0)} →</span>
        </div>
      )}
    </div>
  );
}

function PasoCarrito({ carrito, onQuitar, onAdd, onNext, onBack }) {
  const total = carrito.reduce((s,i)=>s+i.precio*i.cantidad,0);
  return (
    <div>
      <h2 style={{ fontFamily:displayFont, fontWeight:600, fontSize:22, color:text, margin:"0 0 22px", textAlign:"center" }}>Tu carrito</h2>
      {carrito.length===0 ? (
        <p style={{ fontFamily:uiFont, fontSize:13, color:muted, textAlign:"center" }}>Aún no has agregado ningún set.</p>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
          {carrito.map(i => (
            <div key={carritoLineKey(i)} style={{ display:"flex", alignItems:"center", gap:14, background:card, border:`1px solid ${border}`, padding:12 }}>
              <div style={{ width:60, height:60, flexShrink:0, overflow:"hidden" }}>
                <img src={i.cover} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:uiFont, fontWeight:700, fontSize:14, color:text }}>{i.nombre}</div>
                <div style={{ fontFamily:displayFont, fontWeight:600, fontSize:15, color:accent, marginTop:4 }}>${(i.precio*i.cantidad).toFixed(0)}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <button onClick={()=>onQuitar(i)} style={{ width:26, height:26, border:`1px solid ${border}`, background:"none", color:muted, cursor:"pointer", fontFamily:uiFont, fontWeight:700 }}>−</button>
                <span style={{ fontFamily:uiFont, fontWeight:700, fontSize:13, color:text, minWidth:14, textAlign:"center" }}>{i.cantidad}</span>
                <button onClick={()=>onAdd(i)} style={{ width:26, height:26, border:`1px solid ${border}`, background:"none", color:muted, cursor:"pointer", fontFamily:uiFont, fontWeight:700 }}>+</button>
              </div>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:14, borderTop:`1px dashed ${border}` }}>
            <span style={{ fontFamily:uiFont, fontSize:13, color:muted, textTransform:"uppercase", letterSpacing:"0.06em" }}>Total</span>
            <span style={{ fontFamily:displayFont, fontWeight:700, fontSize:22, color:accent }}>${total.toFixed(0)}</span>
          </div>
        </div>
      )}
      <Btn onClick={onNext} disabled={carrito.length===0}>Continuar con mis datos</Btn>
      <Btn onClick={onBack} variant="ghost">← Seguir explorando</Btn>
    </div>
  );
}

function PasoDatos({ carrito, onBack, onConfirmar }) {
  const [nombre, setNombre]   = useState("");
  const [email, setEmail]     = useState("");
  const [numTarjeta, setNumTarjeta] = useState("");
  const [procesando, setProcesando] = useState(false);
  const total = carrito.reduce((s,i)=>s+i.precio*i.cantidad,0);
  const puedeEnviar = nombre.trim() && email.includes("@") && numTarjeta.replace(/\s/g,"").length>=12 && !procesando;

  const inputStyle = { width:"100%", boxSizing:"border-box", background:card, border:`1px solid ${border}`, borderRadius:2, padding:"13px 14px", fontFamily:uiFont, fontSize:15, color:text, outline:"none" };
  const labelStyle = { fontFamily:uiFont, fontSize:11, color:muted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:7 };

  const handlePagar = () => {
    if (!puedeEnviar) return;
    setProcesando(true);
    const folio = "SET-" + Math.random().toString(36).slice(2,8).toUpperCase();
    // Aquí se conectaría Stripe (cobro real) + EmailJS (correo con el link de descarga) + Telegram (aviso al fotógrafo)
    setTimeout(() => onConfirmar({ folio, nombre, email }), 1200);
  };

  return (
    <div>
      <h2 style={{ fontFamily:displayFont, fontWeight:600, fontSize:22, color:text, margin:"0 0 22px", textAlign:"center" }}>Tus datos y pago</h2>
      <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:18 }}>
        <div>
          <label style={labelStyle}>Nombre completo</label>
          <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Tu nombre" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Correo — aquí recibirás tus fotos</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" style={inputStyle} />
        </div>
      </div>
      <div style={{ background:card, border:`1px solid ${border}`, padding:16, marginBottom:18 }}>
        <div style={{ fontFamily:uiFont, fontSize:11, fontWeight:700, color:muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Datos de tu tarjeta</div>
        <input value={numTarjeta} onChange={e=>setNumTarjeta(e.target.value)} placeholder="4242 4242 4242 4242" style={{ ...inputStyle, background:bg, marginBottom:8 }} />
        <div style={{ display:"flex", gap:8 }}>
          <input placeholder="MM/AA" style={{ ...inputStyle, background:bg }} />
          <input placeholder="CVC" style={{ ...inputStyle, background:bg }} />
        </div>
        <p style={{ fontFamily:uiFont, fontSize:11, color:muted, marginTop:10, lineHeight:1.5 }}>
          En este preview el cobro está simulado. En la versión real, esto se conecta con Stripe igual que en tus otros proyectos.
        </p>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <span style={{ fontFamily:uiFont, fontSize:13, color:muted, textTransform:"uppercase", letterSpacing:"0.06em" }}>Total a pagar</span>
        <span style={{ fontFamily:displayFont, fontWeight:700, fontSize:22, color:accent }}>${total.toFixed(0)}</span>
      </div>
      <Btn onClick={handlePagar} disabled={!puedeEnviar}>{procesando ? "Procesando pago…" : `Pagar $${total.toFixed(0)}`}</Btn>
      <Btn onClick={onBack} variant="ghost" disabled={procesando}>← Regresar al carrito</Btn>
    </div>
  );
}

function Confirmacion({ folio, nombre, email, carrito, onNuevoPedido }) {
  const total = carrito.reduce((s,i)=>s+i.precio*i.cantidad,0);
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ width:60, height:60, borderRadius:"50%", border:`1px solid ${accent}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"20px auto 20px", fontSize:24, color:accent }}>✓</div>
      <h2 style={{ fontFamily:displayFont, fontWeight:600, fontSize:22, color:text, margin:"0 0 8px" }}>¡Gracias, {nombre.split(" ")[0] || "cliente"}!</h2>
      <p style={{ fontFamily:uiFont, fontSize:13, color:muted, margin:"0 0 4px" }}>Folio de tu compra</p>
      <p style={{ fontFamily:displayFont, fontWeight:700, fontSize:19, color:accent, margin:"0 0 22px" }}>{folio}</p>
      <div style={{ background:card, border:`1px solid ${border}`, textAlign:"left", padding:16, marginBottom:22 }}>
        {carrito.map(i => (
          <div key={carritoLineKey(i)} style={{ display:"flex", justifyContent:"space-between", fontFamily:uiFont, fontSize:13, color:text, padding:"6px 0" }}>
            <span>{i.cantidad}× {i.nombre}</span>
            <span style={{ fontWeight:700 }}>${(i.precio*i.cantidad).toFixed(0)}</span>
          </div>
        ))}
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:8, paddingTop:8, borderTop:`1px dashed ${border}`, fontFamily:uiFont, fontWeight:700, fontSize:14, color:accent }}>
          <span>Total</span><span>${total.toFixed(0)}</span>
        </div>
      </div>
      <p style={{ fontFamily:uiFont, fontSize:13, color:muted, lineHeight:1.6, marginBottom:26 }}>
        Enviaremos el enlace de descarga en alta resolución a <b style={{ color:text }}>{email}</b> en los próximos minutos.
      </p>
      <Btn onClick={onNuevoPedido} variant="ghost">Hacer otra compra</Btn>
    </div>
  );
}

export default function App() {
  const [paso, setPaso]               = useState(1);
  const [carrito, setCarrito]         = useState([]);
  const [abiertoCarro, setAbiertoCarro] = useState(false);
  const [confirmacion, setConfirmacion] = useState(null);

  const agregar = ({ id, nombre, cover, precio }) => {
    setCarrito(prev => {
      const ex = prev.find(i => i.id===id);
      if (ex) return prev.map(i => i===ex ? { ...i, cantidad:i.cantidad+1 } : i);
      return [...prev, { id, nombre, cover, precio, cantidad:1 }];
    });
  };
  const quitar = (item) => {
    setCarrito(prev => {
      const ex = prev.find(i => i.id===item.id);
      if (!ex) return prev;
      if (ex.cantidad<=1) return prev.filter(i=>i!==ex);
      return prev.map(i => i===ex ? { ...i, cantidad:i.cantidad-1 } : i);
    });
  };
  const handleConfirmar = (datos) => { setConfirmacion(datos); setPaso(4); };
  const reset = () => { setCarrito([]); setConfirmacion(null); setPaso(1); };

  return (
    <div style={{ background:bg, minHeight:"100vh", color:text, fontFamily:uiFont }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; }
        body { margin:0; }
        input::placeholder { color:${muted}; }
      `}</style>
      <HeaderCarrito carrito={carrito} abiertoCarro={abiertoCarro} setAbiertoCarro={setAbiertoCarro} />
      <div style={{ maxWidth:560, margin:"0 auto", padding:"26px 16px 48px" }}>
        {paso<4 && <FilmStrip paso={paso} />}
        {paso===1 && <PasoGaleria carrito={carrito} onAdd={agregar} onNext={()=>setPaso(2)} />}
        {paso===2 && <PasoCarrito carrito={carrito} onQuitar={quitar} onAdd={agregar} onNext={()=>setPaso(3)} onBack={()=>setPaso(1)} />}
        {paso===3 && <PasoDatos carrito={carrito} onBack={()=>setPaso(2)} onConfirmar={handleConfirmar} />}
        {paso===4 && confirmacion && <Confirmacion folio={confirmacion.folio} nombre={confirmacion.nombre} email={confirmacion.email} carrito={carrito} onNuevoPedido={reset} />}
      </div>
    </div>
  );
}
