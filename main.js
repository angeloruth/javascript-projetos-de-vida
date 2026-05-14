// =============================================
//  PROJETOS DE VIDA — main.js
// =============================================

const categorias = {
  saude:      { label: 'Saúde',      icon: '🏃' },
  carreira:   { label: 'Carreira',   icon: '💼' },
  financeiro: { label: 'Financeiro', icon: '💰' },
  estudos:    { label: 'Estudos',    icon: '📚' },
  pessoal:    { label: 'Pessoal',    icon: '🌱' },
  viagem:     { label: 'Viagem',     icon: '✈️' },
};

// Carrega projetos salvos no localStorage
let projetos = JSON.parse(localStorage.getItem('projetos')) || [];

function salvar() {
  localStorage.setItem('projetos', JSON.stringify(projetos));
}

function adicionarProjeto() {
  const titulo    = document.getElementById('input-titulo').value.trim();
  const categoria = document.getElementById('input-categoria').value;
  const prazo     = document.getElementById('input-prazo').value;

  if (!titulo) return alert('Digite o nome do projeto!');

  projetos.unshift({
    id: Date.now(),
    titulo,
    categoria,
    prazo,
    feito: false,
    criadoEm: new Date().toLocaleDateString('pt-BR'),
  });

  salvar();
  renderizar();
  document.getElementById('input-titulo').value = '';
}

function toggleFeito(id) {
  const projeto = projetos.find(p => p.id === id);
  if (projeto) projeto.feito = !projeto.feito;
  salvar();
  renderizar();
}

function remover(id) {
  if (!confirm('Remover este projeto?')) return;
  projetos = projetos.filter(p => p.id !== id);
  salvar();
  renderizar();
}

function renderizar() {
  const lista = document.getElementById('lista-projetos');
  const filtro = document.getElementById('filtro-categoria')?.value || 'todos';

  const filtrados = filtro === 'todos'
    ? projetos
    : projetos.filter(p => p.categoria === filtro);

  const total  = projetos.length;
  const feitos = projetos.filter(p => p.feito).length;
  document.getElementById('contador').textContent =
    `${feitos} de ${total} concluídos`;

  lista.innerHTML = filtrados.map(p => {
    const cat    = categorias[p.categoria];
    const hoje   = new Date().toISOString().split('T')[0];
    const vencido = p.prazo && p.prazo < hoje && !p.feito;

    return `
      <div class="projeto-card ${p.feito ? 'concluido' : ''}">
        <input type="checkbox"
          ${p.feito ? 'checked' : ''}
          onchange="toggleFeito(${p.id})" />

        <div class="projeto-info">
          <span class="projeto-titulo">${cat.icon} ${p.titulo}</span>
          <span class="projeto-meta">
            <span class="badge badge-${p.categoria}">${cat.label}</span>
            ${p.prazo
              ? `<span class="${vencido ? 'vencido' : 'prazo'}">
                   📅 ${p.prazo.split('-').reverse().join('/')}
                   ${vencido ? '⚠️ Vencido' : ''}
                 </span>`
              : ''}
          </span>
        </div>

        <button onclick="remover(${p.id})" class="btn-remover">✕</button>
      </div>
    `;
  }).join('');
}

// Listener do formulário
document.getElementById('btn-adicionar')
  .addEventListener('click', adicionarProjeto);

// Filtro por categoria (se existir no HTML)
document.getElementById('filtro-categoria')
  ?.addEventListener('change', renderizar);

// Inicializa
renderizar();
