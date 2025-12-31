/* =========================
   Datos (maqueta)
   Estructura solicitada:
   ave(aves): Nombre, Sexo, Fecha_nacimiento, Padre, Madre, Edad, Procedencia, Imagen, Plumaje, Numero anilla, Volado
   plumajes: Nombre, descripcion
   procedencias: Nombre, descripcion
========================= */

const storeKey = "palomar_mock_v1";

let plumajes = [
  { id: "pl1", nombre: "Azul", descripcion: "Tonos grises/azulados clásicos." },
  { id: "pl2", nombre: "Negro", descripcion: "Plumaje oscuro uniforme." },
  { id: "pl3", nombre: "Rojo", descripcion: "Tonos rojizos / cobre." },
  { id: "pl4", nombre: "Pío", descripcion: "Manchado / combinado." },
];

let procedencias = [
  { id: "pr1", nombre: "Línea Cuenca", descripcion: "Procedencia local (Cuenca)." },
  { id: "pr2", nombre: "Intercambio", descripcion: "Adquirido por intercambio." },
  { id: "pr3", nombre: "Compra", descripcion: "Adquirido por compra." },
];

let aves = [
  // Generación 0 (ejemplo)
  {
    id: "a1",
    nombre: "Chicuelo",
    sexo: "M",
    fechaNacimiento: "2023-03-18",
    padreId: "a3",
    madreId: "a4",
    procedenciaId: "pr1",
    imagen: "",
    plumajeId: "pl1",
    numeroAnilla: "ES-2023-001",
    volado: true,
  },
  {
    id: "a2",
    nombre: "Lunera",
    sexo: "H",
    fechaNacimiento: "2023-04-02",
    padreId: "a5",
    madreId: "a6",
    procedenciaId: "pr2",
    imagen: "",
    plumajeId: "pl4",
    numeroAnilla: "ES-2023-014",
    volado: false,
  },

  // Padres de a1
  {
    id: "a3",
    nombre: "Trueno",
    sexo: "M",
    fechaNacimiento: "2021-02-12",
    padreId: "a7",
    madreId: "a8",
    procedenciaId: "pr1",
    imagen: "",
    plumajeId: "pl2",
    numeroAnilla: "ES-2021-090",
    volado: true,
  },
  {
    id: "a4",
    nombre: "Perla",
    sexo: "H",
    fechaNacimiento: "2021-05-20",
    padreId: "a9",
    madreId: "a10",
    procedenciaId: "pr3",
    imagen: "",
    plumajeId: "pl1",
    numeroAnilla: "ES-2021-112",
    volado: true,
  },

  // Padres de a2
  {
    id: "a5",
    nombre: "Cobre",
    sexo: "M",
    fechaNacimiento: "2020-06-11",
    padreId: null,
    madreId: null,
    procedenciaId: "pr2",
    imagen: "",
    plumajeId: "pl3",
    numeroAnilla: "ES-2020-044",
    volado: true,
  },
  {
    id: "a6",
    nombre: "Nube",
    sexo: "H",
    fechaNacimiento: "2020-07-29",
    padreId: null,
    madreId: null,
    procedenciaId: "pr2",
    imagen: "",
    plumajeId: "pl4",
    numeroAnilla: "ES-2020-051",
    volado: false,
  },

  // Abuelos de a1 (para nivel 2)
  { id: "a7", nombre: "Sultán", sexo: "M", fechaNacimiento: "2019-01-10", padreId: null, madreId: null, procedenciaId:"pr1", imagen:"", plumajeId:"pl2", numeroAnilla:"ES-2019-010", volado:true },
  { id: "a8", nombre: "Brisa",  sexo: "H", fechaNacimiento: "2019-02-08", padreId: null, madreId: null, procedenciaId:"pr1", imagen:"", plumajeId:"pl1", numeroAnilla:"ES-2019-022", volado:true },
  { id: "a9", nombre: "Rayo",   sexo: "M", fechaNacimiento: "2019-04-14", padreId: null, madreId: null, procedenciaId:"pr3", imagen:"", plumajeId:"pl3", numeroAnilla:"ES-2019-033", volado:true },
  { id: "a10",nombre: "Lila",   sexo: "H", fechaNacimiento: "2019-06-30", padreId: null, madreId: null, procedenciaId:"pr3", imagen:"", plumajeId:"pl4", numeroAnilla:"ES-2019-040", volado:false },
];

/* =========================
   Utilidades
========================= */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function uid(prefix="a"){
  return prefix + Math.random().toString(16).slice(2,9);
}

function findAve(id){
  return aves.find(a => a.id === id) || null;
}

function findPlumaje(id){
  return plumajes.find(p => p.id === id) || null;
}

function findProc(id){
  return procedencias.find(p => p.id === id) || null;
}

function formatDate(iso){
  if(!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES");
}

function calcEdadYears(iso){
  if(!iso) return "—";
  const dob = new Date(iso);
  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) years--;
  return years < 0 ? 0 : years;
}

function sexLabel(s){ return s === "M" ? "Macho" : "Hembra"; }
function boolLabel(b){ return b ? "Sí" : "No"; }

/* =========================
   Persistencia opcional
========================= */
function save(){
  const payload = { aves, plumajes, procedencias };
  localStorage.setItem(storeKey, JSON.stringify(payload));
}
function load(){
  const raw = localStorage.getItem(storeKey);
  if(!raw) return false;
  try{
    const parsed = JSON.parse(raw);
    if(parsed?.aves && parsed?.plumajes && parsed?.procedencias){
      aves = parsed.aves;
      plumajes = parsed.plumajes;
      procedencias = parsed.procedencias;
      return true;
    }
  }catch(_){}
  return false;
}
function seed(){
  localStorage.removeItem(storeKey);
  // recarga para volver a la semilla de arriba
  location.reload();
}

/* =========================
   Navegación vistas
========================= */
const views = {
  dashboard: $("#view-dashboard"),
  aves: $("#view-aves"),
  parentesco: $("#view-parentesco"),
  plumajes: $("#view-plumajes"),
  procedencias: $("#view-procedencias"),
};

const titles = {
  dashboard: ["Dashboard", "Resumen rápido del palomar"],
  aves: ["Aves", "Registro de palomos y fichas"],
  parentesco: ["Parentesco", "Árbol genealógico por niveles (mapa mental)"],
  plumajes: ["Plumajes", "Catálogo de plumajes"],
  procedencias: ["Procedencias", "Catálogo de procedencias"],
};

function showView(key){
  Object.entries(views).forEach(([k, el]) => {
    el.classList.toggle("hidden", k !== key);
  });

  $$("#pageTitle").forEach(()=>{});
  $("#pageTitle").textContent = titles[key][0];
  $("#pageSubtitle").textContent = titles[key][1];

  $$(".navItem").forEach(b => b.classList.toggle("active", b.dataset.view === key));
}

/* =========================
   Render: Dashboard
========================= */
function renderLatest(){
  const el = $("#latestAves");
  el.innerHTML = "";
  const recent = [...aves].slice(-6).reverse();

  for(const a of recent){
    const pl = findPlumaje(a.plumajeId)?.nombre ?? "—";
    const pr = findProc(a.procedenciaId)?.nombre ?? "—";
    const item = document.createElement("div");
    item.className = "listItem";
    item.innerHTML = `
      <div class="listItemTitle">${a.nombre} <span class="badge">${sexLabel(a.sexo)}</span></div>
      <div class="listItemSub">Anilla: ${a.numeroAnilla || "—"} · Plumaje: ${pl} · Procedencia: ${pr}</div>
    `;
    el.appendChild(item);
  }
}

function drawBarChart(canvas, labels, values){
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);

  // fondo sutil
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(255,255,255,0.0)";
  ctx.fillRect(0,0,w,h);

  const pad = 44;
  const max = Math.max(1, ...values);
  const gap = 18;
  const barW = (w - pad*2 - gap*(values.length-1)) / values.length;

  // ejes
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, h-pad);
  ctx.lineTo(w-pad, h-pad);
  ctx.stroke();

  // barras
  values.forEach((v,i)=>{
    const x = pad + i*(barW+gap);
    const bh = ((h - pad*2) * v) / max;
    const y = (h - pad) - bh;

    // barra (sin fijar colores “de marca”: usamos grises elegantes)
    ctx.fillStyle = "rgba(10,132,255,0.35)";
    ctx.strokeStyle = "rgba(10,132,255,0.55)";
    roundRect(ctx, x, y, barW, bh, 12, true, true);

    // valor
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.font = "12px system-ui, -apple-system";
    ctx.fillText(String(v), x + 6, y - 8);

    // label
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillText(labels[i], x + 6, h - 18);
  });
}

function roundRect(ctx, x, y, w, h, r, fill, stroke){
  const radius = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+radius, y);
  ctx.arcTo(x+w, y, x+w, y+h, radius);
  ctx.arcTo(x+w, y+h, x, y+h, radius);
  ctx.arcTo(x, y+h, x, y, radius);
  ctx.arcTo(x, y, x+w, y, radius);
  ctx.closePath();
  if(fill) ctx.fill();
  if(stroke) ctx.stroke();
}

function renderStats(){
  // Machos/Hembras
  const m = aves.filter(a=>a.sexo==="M").length;
  const h = aves.filter(a=>a.sexo==="H").length;
  drawBarChart($("#sexChart"), ["Machos", "Hembras"], [m,h]);

  // Plumajes
  const counts = plumajes.map(p => aves.filter(a=>a.plumajeId===p.id).length);
  drawBarChart($("#plumajeChart"), plumajes.map(p=>p.nombre), counts);
}

/* =========================
   Render: Aves (lista + ficha)
========================= */
let selectedAveId = null;
let editingAveId = null;

function renderAvesTable(filter=""){
  const el = $("#avesTable");
  el.innerHTML = "";
  const f = filter.trim().toLowerCase();

  const rows = aves.filter(a=>{
    const pl = findPlumaje(a.plumajeId)?.nombre ?? "";
    const text = `${a.nombre} ${a.numeroAnilla||""} ${pl}`.toLowerCase();
    return !f || text.includes(f);
  });

  $("#countAves").textContent = String(rows.length);

  for(const a of rows){
    const pl = findPlumaje(a.plumajeId)?.nombre ?? "—";
    const item = document.createElement("div");
    item.className = "rowItem";
    item.innerHTML = `
      <div class="rowLeft">
        <div class="rowTitle">${a.nombre}</div>
        <div class="rowSub">Anilla ${a.numeroAnilla || "—"} · ${pl}</div>
      </div>
      <div class="badge">${sexLabel(a.sexo)}</div>
    `;
    item.addEventListener("click", ()=> selectAve(a.id));
    el.appendChild(item);
  }
}

function clearDetail(){
  selectedAveId = null;
  $("#aveDetail").classList.add("hidden");
  $("#emptyDetail").classList.remove("hidden");
  $("#aveDetailPill").textContent = "—";
}

function selectAve(id){
  selectedAveId = id;
  const a = findAve(id);
  if(!a) return;

  $("#emptyDetail").classList.add("hidden");
  $("#aveDetail").classList.remove("hidden");
  $("#aveDetailPill").textContent = a.id;

  $("#dNombre").textContent = a.nombre;
  $("#dAnilla").textContent = `Anilla: ${a.numeroAnilla || "—"} · Nacimiento: ${formatDate(a.fechaNacimiento)}`;
  $("#aveAvatar").textContent = a.sexo === "M" ? "🕊️" : "🐦";

  const pl = findPlumaje(a.plumajeId)?.nombre ?? "—";
  const pr = findProc(a.procedenciaId)?.nombre ?? "—";
  const padre = findAve(a.padreId)?.nombre ?? "—";
  const madre = findAve(a.madreId)?.nombre ?? "—";

  const chips = $("#dChips");
  chips.innerHTML = "";
  [
    `Sexo: ${sexLabel(a.sexo)}`,
    `Plumaje: ${pl}`,
    `Procedencia: ${pr}`,
    `Volado: ${boolLabel(a.volado)}`
  ].forEach(t=>{
    const c = document.createElement("div");
    c.className="chip";
    c.textContent=t;
    chips.appendChild(c);
  });

  const kv = $("#dKv");
  kv.innerHTML = "";
  const fields = [
    ["Nombre", a.nombre],
    ["Número anilla", a.numeroAnilla || "—"],
    ["Sexo", sexLabel(a.sexo)],
    ["Fecha_nacimiento", formatDate(a.fechaNacimiento)],
    ["Edad", `${calcEdadYears(a.fechaNacimiento)} años`],
    ["Padre", padre],
    ["Madre", madre],
    ["Procedencia", pr],
    ["Plumaje", pl],
    ["Volado", boolLabel(a.volado)],
  ];

  for(const [k,v] of fields){
    const box = document.createElement("div");
    box.className="kv";
    box.innerHTML = `<div class="k">${k}</div><div class="v">${v}</div>`;
    kv.appendChild(box);
  }
}

/* =========================
   Parentesco por niveles
========================= */

function getAncestorsTree(rootId, level){
  // Devuelve un árbol en forma { id, children:[padre,madre] } hasta "level"
  function build(id, depth){
    if(!id) return null;
    const a = findAve(id);
    if(!a) return { id, missing:true, children:[] };

    if(depth >= level) return { id, children:[] };

    const father = a.padreId ? build(a.padreId, depth+1) : null;
    const mother = a.madreId ? build(a.madreId, depth+1) : null;

    const children = [];
    if(father) children.push(father);
    if(mother) children.push(mother);

    return { id: a.id, children };
  }
  return build(rootId, 0);
}

function layoutTree(root, x, y, xGap, yGap){
  // Layout simple “hacia la izquierda”: root a la derecha, ancestros hacia la izquierda
  // Devuelve nodos con posiciones y enlaces.
  const nodes = [];
  const links = [];

  function walk(node, depth, idx, span){
    if(!node) return;
    const nx = x - depth * xGap;
    const ny = y + (idx - span/2) * yGap;

    nodes.push({ id: node.id, x: nx, y: ny });

    node.children.forEach((ch, i)=>{
      const childIdx = idx + (i===0 ? -0.5 : 0.5) * Math.max(1, span/2);
      walk(ch, depth+1, childIdx, Math.max(1, span/1.2));
      links.push({ from: node.id, to: ch.id });
    });
  }

  walk(root, 0, 0, 4);
  return { nodes, links };
}

function renderKinSvg(rootId, level){
  const svg = $("#kinSvg");
  svg.innerHTML = "";

  const tree = getAncestorsTree(rootId, level);
  if(!tree){
    svg.innerHTML = `<text x="40" y="60" fill="rgba(0,0,0,.6)" font-size="16">No hay datos para ese ave.</text>`;
    return;
  }

  const { nodes, links } = layoutTree(tree, 1020, 300, 260, 120);

  // helpers
  const nodeMap = new Map(nodes.map(n=>[n.id,n]));
  function cardText(a){
    if(!a) return { title:"Desconocido", sub:"—" };
    const pl = findPlumaje(a.plumajeId)?.nombre ?? "—";
    return { title: a.nombre, sub: `${sexLabel(a.sexo)} · ${pl}` };
  }

  // links
  links.forEach(l=>{
    const a = nodeMap.get(l.from);
    const b = nodeMap.get(l.to);
    if(!a || !b) return;
    svg.appendChild(svgLine(a.x-10, a.y, b.x+140, b.y, "rgba(0,0,0,0.18)"));
  });

  // nodes
  nodes.forEach(n=>{
    const ave = findAve(n.id);
    const { title, sub } = cardText(ave);

    const g = document.createElementNS("http://www.w3.org/2000/svg","g");

    // card
    g.appendChild(svgRect(n.x, n.y-26, 160, 58, 16, "rgba(255,255,255,0.85)", "rgba(0,0,0,0.10)"));

    // icon
    g.appendChild(svgText(n.x+14, n.y+8, ave ? (ave.sexo==="M" ? "🕊️" : "🐦") : "❓", 16, "rgba(0,0,0,0.85)"));

    // title
    g.appendChild(svgText(n.x+42, n.y-2, title, 14, "rgba(0,0,0,0.85)", 650));

    // sub
    g.appendChild(svgText(n.x+42, n.y+16, sub, 12, "rgba(0,0,0,0.55)"));

    // click -> abrir ficha (vista aves)
    g.style.cursor = "pointer";
    g.addEventListener("click", ()=>{
      showView("aves");
      selectAve(n.id);
    });

    svg.appendChild(g);
  });

  // título root
  const rootAve = findAve(rootId);
  const title = rootAve ? `Parentesco de ${rootAve.nombre}` : "Parentesco";
  svg.appendChild(svgText(40, 50, title, 18, "rgba(0,0,0,0.75)", 750));
}

function svgLine(x1,y1,x2,y2,stroke){
  const el = document.createElementNS("http://www.w3.org/2000/svg","line");
  el.setAttribute("x1", x1); el.setAttribute("y1", y1);
  el.setAttribute("x2", x2); el.setAttribute("y2", y2);
  el.setAttribute("stroke", stroke);
  el.setAttribute("stroke-width", "2");
  el.setAttribute("stroke-linecap","round");
  return el;
}
function svgRect(x,y,w,h,r,fill,stroke){
  const el = document.createElementNS("http://www.w3.org/2000/svg","rect");
  el.setAttribute("x", x); el.setAttribute("y", y);
  el.setAttribute("width", w); el.setAttribute("height", h);
  el.setAttribute("rx", r);
  el.setAttribute("fill", fill);
  el.setAttribute("stroke", stroke);
  return el;
}
function svgText(x,y,text,size,fill,weight=500){
  const el = document.createElementNS("http://www.w3.org/2000/svg","text");
  el.setAttribute("x", x);
  el.setAttribute("y", y);
  el.setAttribute("font-size", String(size));
  el.setAttribute("fill", fill);
  el.setAttribute("font-family", "system-ui, -apple-system");
  el.setAttribute("font-weight", String(weight));
  el.textContent = text;
  return el;
}

/* =========================
   Plumajes / Procedencias
========================= */
function renderCatalogs(){
  const plEl = $("#plumajesList");
  plEl.innerHTML = "";
  plumajes.forEach(p=>{
    const count = aves.filter(a=>a.plumajeId===p.id).length;
    const item = document.createElement("div");
    item.className="listItem";
    item.innerHTML = `
      <div class="listItemTitle">${p.nombre} <span class="badge">${count} aves</span></div>
      <div class="listItemSub">${p.descripcion}</div>
    `;
    plEl.appendChild(item);
  });

  const prEl = $("#procedenciasList");
  prEl.innerHTML = "";
  procedencias.forEach(p=>{
    const count = aves.filter(a=>a.procedenciaId===p.id).length;
    const item = document.createElement("div");
    item.className="listItem";
    item.innerHTML = `
      <div class="listItemTitle">${p.nombre} <span class="badge">${count} aves</span></div>
      <div class="listItemSub">${p.descripcion}</div>
    `;
    prEl.appendChild(item);
  });
}

/* =========================
   Modal Nueva/Editar Ave
========================= */
function openModal(aveId=null){
  editingAveId = aveId || null;
  $("#modalOverlay").classList.remove("hidden");

  // poblar selects (excluye al ave actual como posible progenitor)
  fillSelectAves($("#fPadre"), true, "— Sin padre —", editingAveId);
  fillSelectAves($("#fMadre"), true, "— Sin madre —", editingAveId);
  fillSelect(plumajes, $("#fPlumaje"), "id", "nombre");
  fillSelect(procedencias, $("#fProcedencia"), "id", "nombre");

  const modalTitle = $("#modalTitle");
  const saveBtn = $("#btnSaveAve");
  const isEditing = Boolean(editingAveId);
  modalTitle.textContent = isEditing ? "Editar ave" : "Nueva ave";
  saveBtn.textContent = isEditing ? "Guardar cambios" : "Guardar";

  if(isEditing){
    const ave = findAve(editingAveId);
    if(ave){
      $("#fNombre").value = ave.nombre;
      $("#fSexo").value = ave.sexo;
      $("#fFecha").value = ave.fechaNacimiento || "";
      $("#fAnilla").value = ave.numeroAnilla || "";
      $("#fImagen").value = ave.imagen || "";
      $("#fVolado").value = ave.volado ? "true" : "false";
      $("#fPadre").value = ave.padreId || "";
      $("#fMadre").value = ave.madreId || "";
      $("#fPlumaje").value = ave.plumajeId || (plumajes[0]?.id || "");
      $("#fProcedencia").value = ave.procedenciaId || (procedencias[0]?.id || "");
    }else{
      editingAveId = null;
      modalTitle.textContent = "Nueva ave";
      saveBtn.textContent = "Guardar";
      resetAveForm();
    }
  }else{
    resetAveForm();
  }
}
function closeModal(){
  editingAveId = null;
  $("#modalOverlay").classList.add("hidden");
}

function resetAveForm(){
  $("#fNombre").value = "";
  $("#fSexo").value = "M";
  $("#fFecha").value = "";
  $("#fAnilla").value = "";
  $("#fImagen").value = "";
  $("#fVolado").value = "false";
  $("#fPadre").value = "";
  $("#fMadre").value = "";
  $("#fPlumaje").value = plumajes[0]?.id || "";
  $("#fProcedencia").value = procedencias[0]?.id || "";
}

function fillSelect(items, select, valueKey, labelKey){
  select.innerHTML = "";
  for(const it of items){
    const opt = document.createElement("option");
    opt.value = it[valueKey];
    opt.textContent = it[labelKey];
    select.appendChild(opt);
  }
}
function fillSelectAves(select, allowNull=false, nullLabel="—", excludeId=null){
  select.innerHTML = "";
  if(allowNull){
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = nullLabel;
    select.appendChild(opt);
  }
  const sorted = [...aves].sort((a,b)=>a.nombre.localeCompare(b.nombre));
  for(const a of sorted){
    if(excludeId && a.id === excludeId) continue;
    const opt = document.createElement("option");
    opt.value = a.id;
    opt.textContent = `${a.nombre} (${a.numeroAnilla||"—"})`;
    select.appendChild(opt);
  }
}

function saveAveFromForm(){
  const nombre = $("#fNombre").value.trim();
  if(!nombre){
    alert("Pon al menos el nombre.");
    return;
  }

  const payload = {
    id: editingAveId || uid("a"),
    nombre,
    sexo: $("#fSexo").value,
    fechaNacimiento: $("#fFecha").value || null,
    padreId: $("#fPadre").value || null,
    madreId: $("#fMadre").value || null,
    procedenciaId: $("#fProcedencia").value,
    imagen: $("#fImagen").value.trim(),
    plumajeId: $("#fPlumaje").value,
    numeroAnilla: $("#fAnilla").value.trim(),
    volado: $("#fVolado").value === "true",
  };

  if(editingAveId){
    const existing = findAve(editingAveId);
    if(existing){
      Object.assign(existing, payload);
    }else{
      aves.push(payload);
    }
  }else{
    aves.push(payload);
  }
  save();
  const targetId = payload.id;
  closeModal();

  // rerender
  renderAvesTable($("#searchAve").value);
  renderLatest();
  renderStats();
  renderCatalogs();
  populateKinSelectors();

  // ir a ficha
  showView("aves");
  selectAve(targetId);
}

function deleteSelectedAve(){
  if(!selectedAveId) return;
  const ave = findAve(selectedAveId);
  if(!ave) return;
  const sure = confirm(`¿Eliminar "${ave.nombre}" y desvincularlo del árbol?`);
  if(!sure) return;

  const removedId = selectedAveId;
  const removedIndex = aves.findIndex(a=>a.id === removedId);
  aves = aves.filter(a=>a.id !== removedId);
  aves.forEach(a=>{
    if(a.padreId === removedId) a.padreId = null;
    if(a.madreId === removedId) a.madreId = null;
  });
  save();

  renderAvesTable($("#searchAve").value);
  renderLatest();
  renderStats();
  renderCatalogs();
  populateKinSelectors();

  const fallback = aves[removedIndex] || aves[removedIndex-1] || null;
  if(fallback){
    selectAve(fallback.id);
  }else{
    clearDetail();
  }
}

/* =========================
   Selectores parentesco
========================= */
function populateKinSelectors(){
  const sel = $("#selParAve");
  sel.innerHTML = "";
  const sorted = [...aves].sort((a,b)=>a.nombre.localeCompare(b.nombre));
  for(const a of sorted){
    const opt = document.createElement("option");
    opt.value = a.id;
    opt.textContent = `${a.nombre} · ${a.numeroAnilla||"—"}`;
    sel.appendChild(opt);
  }

  // Si hay seleccionada en ficha, preferirla
  if(selectedAveId){
    sel.value = selectedAveId;
  }
}

/* =========================
   Eventos UI
========================= */
function bindUI(){
  // Nav
  $$(".navItem").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      showView(btn.dataset.view);
      if(btn.dataset.view === "dashboard"){
        renderLatest(); renderStats();
      }
      if(btn.dataset.view === "parentesco"){
        populateKinSelectors();
        const level = Number($("#rngLevel").value);
        $("#lblLevel").textContent = `Nivel ${level}`;
        renderKinSvg($("#selParAve").value || (aves[0]?.id), level);
      }
    });
  });

  // Acciones topbar
  $("#btnNewAve").addEventListener("click", ()=> openModal());
  $("#btnSeed").addEventListener("click", seed);

  // Aves
  $("#searchAve").addEventListener("input", (e)=> renderAvesTable(e.target.value));
  $("#btnClearFilters").addEventListener("click", ()=>{
    $("#searchAve").value = "";
    renderAvesTable("");
  });

  // Ficha acciones
  $("#btnEditAve").addEventListener("click", ()=>{
    if(selectedAveId) openModal(selectedAveId);
  });
  $("#btnGoParentesco").addEventListener("click", ()=>{
    showView("parentesco");
    populateKinSelectors();
    if(selectedAveId) $("#selParAve").value = selectedAveId;
    const level = Number($("#rngLevel").value);
    $("#lblLevel").textContent = `Nivel ${level}`;
    renderKinSvg($("#selParAve").value, level);
  });
  $("#btnDeleteAve").addEventListener("click", deleteSelectedAve);

  // Parentesco
  $("#selParAve").addEventListener("change", ()=>{
    const level = Number($("#rngLevel").value);
    renderKinSvg($("#selParAve").value, level);
  });
  $("#rngLevel").addEventListener("input", ()=>{
    const level = Number($("#rngLevel").value);
    $("#lblLevel").textContent = `Nivel ${level}`;
    renderKinSvg($("#selParAve").value, level);
  });
  $("#btnFit").addEventListener("click", ()=>{
    // En esta maqueta: “fit” = scrollear al inicio del contenedor
    $("#svgWrap").scrollLeft = 0;
    $("#svgWrap").scrollTop = 0;
  });

  // Modal
  $("#btnCloseModal").addEventListener("click", closeModal);
  $("#btnCancel").addEventListener("click", closeModal);
  $("#modalOverlay").addEventListener("click", (e)=>{
    if(e.target.id === "modalOverlay") closeModal();
  });
  $("#btnSaveAve").addEventListener("click", saveAveFromForm);
}

/* =========================
   Boot
========================= */
function init(){
  load(); // si hay datos guardados, los carga
  bindUI();

  // Primera vista
  showView("dashboard");
  renderLatest();
  renderStats();
  renderCatalogs();

  // Aves
  renderAvesTable("");
  populateKinSelectors();

  // Selección inicial para ficha (opcional)
  if(aves[0]?.id) selectAve(aves[0].id);
}
init();

if("serviceWorker" in navigator){
  window.addEventListener("load", ()=>{
    navigator.serviceWorker.register("./sw.js").catch((err)=>{
      console.error("SW registration failed", err);
    });
  });
}
