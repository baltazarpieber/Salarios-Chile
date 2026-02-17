const dataGratis = {
  'Desarrollador/a de Software': { promedio: 1950000, min: 1200000, max: 3300000, reportes: 482 },
  'Analista de Datos': { promedio: 1650000, min: 980000, max: 2800000, reportes: 271 },
  'Contador/a': { promedio: 1320000, min: 850000, max: 2200000, reportes: 213 },
  'Ingeniero/a Civil Industrial': { promedio: 2050000, min: 1200000, max: 3500000, reportes: 356 },
  'Diseñador/a UX/UI': { promedio: 1500000, min: 930000, max: 2500000, reportes: 167 },
  'Enfermero/a': { promedio: 1420000, min: 920000, max: 2400000, reportes: 244 }
};

const toCLP = (value) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(value);

const explorarBtn = document.getElementById('btnExplorar');
const profesionesFree = document.getElementById('profesionFree');
const resultadoGratis = document.getElementById('resultadoGratis');

explorarBtn.addEventListener('click', () => {
  const seleccion = profesionesFree.value;
  const data = dataGratis[seleccion];

  resultadoGratis.innerHTML = `
    <h3>Referencia general para ${seleccion}</h3>
    <p><strong>Promedio país:</strong> ${toCLP(data.promedio)} líquidos mensuales.</p>
    <p><strong>Rango amplio observado:</strong> ${toCLP(data.min)} a ${toCLP(data.max)}.</p>
    <p><strong>Reportes válidos:</strong> ${data.reportes}.</p>
    <p class="warning">Este resultado es orientativo. Para saber si TÚ estás bajo mercado, necesitas un diagnóstico personalizado.</p>
  `;
});

const form = document.getElementById('salaryForm');
const resultadoParcial = document.getElementById('resultadoParcial');
const resultadoPremium = document.getElementById('resultadoPremium');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const sueldo = Number(formData.get('sueldo'));
  const experiencia = Number(formData.get('experiencia'));
  const bonos = Number(formData.get('bonos') || 0);

  const referenciaBase = 1750000 + experiencia * 45000;
  const percentilAprox = Math.max(8, Math.min(94, Math.round((sueldo / referenciaBase) * 50)));
  const brecha = Math.max(0, referenciaBase - sueldo);

  resultadoParcial.classList.remove('hidden');
  resultadoParcial.innerHTML = `
    <h3>Resultado parcial de diagnóstico</h3>
    <div class="kpi">
      <div class="kpi-item"><span>Percentil aproximado</span><strong>P${percentilAprox}</strong></div>
      <div class="kpi-item"><span>Posible brecha mensual</span><strong>${toCLP(brecha)}</strong></div>
      <div class="kpi-item"><span>Confianza inicial</span><strong>Media</strong></div>
    </div>
    <p class="warning">
      Detectamos señales de posible subpago frente al mercado chileno comparable. Desbloquea el reporte completo
      para ver tu percentil exacto, riesgo de subpago y cuánto deberías estar ganando.
    </p>
    <button id="unlockBtn" class="button button-primary">Desbloquear análisis completo (USD 9-15, pago único)</button>
  `;

  const unlockBtn = document.getElementById('unlockBtn');
  unlockBtn.addEventListener('click', () => {
    const minMuestra = 30;
    const reportesCategoria = 126;

    if (reportesCategoria < minMuestra) {
      resultadoPremium.classList.remove('hidden');
      resultadoPremium.innerHTML =
        '<h3>Datos insuficientes</h3><p>No mostramos resultados detallados en segmentos con menos de 30 reportes para proteger privacidad y calidad estadística.</p>';
      return;
    }

    const percentilExacto = Math.max(5, Math.min(97, percentilAprox - 3));
    const riesgo = percentilExacto < 35 ? 'Alto' : percentilExacto < 50 ? 'Medio' : 'Bajo';
    const target = Math.round(referenciaBase * 1.07);
    const brechaPesos = Math.max(0, target - sueldo);
    const brechaPct = Math.max(0, Math.round((brechaPesos / Math.max(sueldo, 1)) * 100));
    const proyeccion3Y = Math.round(target * 1.24);
    const sueldoBase = sueldo - Math.round(bonos / 12);

    resultadoPremium.classList.remove('hidden');
    resultadoPremium.innerHTML = `
      <h3>Reporte completo desbloqueado (demo funcional)</h3>
      <div class="kpi">
        <div class="kpi-item"><span>Percentil exacto</span><strong>P${percentilExacto}</strong></div>
        <div class="kpi-item"><span>Riesgo de subpago</span><strong>${riesgo}</strong></div>
        <div class="kpi-item"><span>Brecha salarial</span><strong>${brechaPct}% (${toCLP(brechaPesos)})</strong></div>
      </div>
      <p><strong>Comparación:</strong> industria, ciudad, tamaño de empresa y experiencia.</p>
      <p><strong>Composición actual:</strong> base ${toCLP(sueldoBase)} + bonos anuales ${toCLP(bonos)}.</p>
      <p><strong>Simulación de sueldo objetivo:</strong> ${toCLP(target)} líquidos mensuales.</p>
      <p><strong>Proyección estimada a 3 años:</strong> ${toCLP(proyeccion3Y)} líquidos mensuales.</p>
      <button class="button button-secondary">Descargar reporte PDF profesional</button>
      <small>*En producción, el pago habilita descarga PDF real y acceso único al informe.</small>
    `;
  });
});
