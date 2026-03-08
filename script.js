let currentYear = 2026;

// Datos iniciales
let data = [
  {nombre:'ARCO Madrid', fecha:'dd/mm/aaaa', email:'', comentario:'', semaforo:3},
  {nombre:'ART MADRID', fecha:'dd/mm/aaaa', email:'', comentario:'', semaforo:2},
  {nombre:'JUSTMAD', fecha:'dd/mm/aaaa', email:'', comentario:'', semaforo:0}
];

function renderTable() {
  const tbody = document.querySelector("#crmTable tbody");
  tbody.innerHTML = "";

  data.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.className = semaforoClass(item.semaforo);

    tr.innerHTML = `
      <td contenteditable="true">${item.nombre}</td>
      <td contenteditable="true">${item.fecha}</td>
      <td contenteditable="true">${item.email}</td>
      <td contenteditable="true">${item.comentario}</td>
      <td class="action-cell">
        <button onclick="cambiarSemaforo(${index})">${semaforoIcon(item.semaforo)}</button>
        <button onclick="moverFila(${index}, -1)">⬆️</button>
        <button onclick="moverFila(${index}, 1)">⬇️</button>
      </td>
    `;
    tbody.appendChild(tr);

    // Guardar cambios al escribir
    tr.querySelectorAll("td[contenteditable]").forEach((td, i) => {
      td.addEventListener("input", () => {
        const key = ["nombre","fecha","email","comentario"][i];
        data[index][key] = td.innerText;
      });
    });
  });
}

// Semáforo: 3-Rojo, 2-Amarillo, 1-Verde, 0-Sin
function semaforoClass(value){
  switch(value){
    case 3: return "rojo";
    case 2: return "amarillo";
    case 1: return "verde";
    default: return "sin";
  }
}

function semaforoIcon(value){
  switch(value){
    case 3: return "🔴";
    case 2: return "🟡";
    case 1: return "🟢";
    default: return "⚪";
  }
}

function cambiarSemaforo(index){
  data[index].semaforo = (data[index].semaforo % 3) + 1; // Ciclo 1→2→3
  renderTable();
}

function addRow(){
  data.push({nombre:'Nueva feria/galería', fecha:'dd/mm/aaaa', email:'', comentario:'', semaforo:0});
  renderTable();
}

function resetSemaforos(){
  data.forEach(item => item.semaforo=0);
  renderTable();
}

function moverFila(index, dir){
  const newIndex = index + dir;
  if(newIndex < 0 || newIndex >= data.length) return;
  [data[index], data[newIndex]] = [data[newIndex], data[index]];
  renderTable();
}

// Años
function prevYear(){ currentYear--; document.getElementById("currentYear").innerText=currentYear; }
function nextYear(){ currentYear++; document.getElementById("currentYear").innerText=currentYear; }

// JSON
function exportJSON(){
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href=url; a.download="crm_ferias.json"; a.click();
}

function importJSON(){
  document.getElementById("fileInput").click();
}

document.getElementById("fileInput").addEventListener("change", function(){
  const file = this.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try{
      data = JSON.parse(e.target.result);
      renderTable();
    }catch(err){ alert("JSON inválido"); }
  };
  reader.readAsText(file);
});

// Buscador
document.getElementById("search").addEventListener("input", function(){
  const filter = this.value.toLowerCase();
  const tbody = document.querySelector("#crmTable tbody");
  tbody.querySelectorAll("tr").forEach((tr, idx)=>{
    const nombre = data[idx].nombre.toLowerCase();
    tr.style.display = nombre.includes(filter) ? "" : "none";
  });
});

// Render inicial
renderTable();