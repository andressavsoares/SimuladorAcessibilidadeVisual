let temaSelecionado = null;

const corFundo = document.getElementById('corFundo');
const corTexto = document.getElementById('corTexto');
const tamanhoFonte = document.getElementById('tamanhoFonte');
const fontePreview = document.getElementById('fontePreview');
const preview = document.getElementById('preview');
const botao = document.getElementById('botao');

const textoBotao = document.getElementById('textoBotao');
const corBotao = document.getElementById('corBotao');
const bordaBotao = document.getElementById('bordaBotao');
const previewBorda = document.getElementById('previewBorda');

const editorTitulo = new Quill('#editorTitulo', { theme: 'snow' });
const editorParagrafo = new Quill('#editorParagrafo', { theme: 'snow' });
const editorRodape = new Quill('#editorRodape', { theme: 'snow' });

corFundo.addEventListener('input', () => {
  preview.style.backgroundColor = corFundo.value;
  avaliarAcessibilidade();
});
corTexto.addEventListener('input', () => {
  preview.style.color = corTexto.value;
  avaliarAcessibilidade();
});
tamanhoFonte.addEventListener('input', () => {
  const tamanho = tamanhoFonte.value + 'px';
  preview.style.fontSize = tamanho;
  fontePreview.innerText = tamanho;
});

corBotao.addEventListener('input', atualizarEstiloBotao);
bordaBotao.addEventListener('input', atualizarEstiloBotao);

function atualizarTextoBotao() {
  botao.innerText = textoBotao.value;
}
function atualizarEstiloBotao() {
  botao.style.backgroundColor = corBotao.value;
  botao.style.borderRadius = bordaBotao.value + 'px';
  previewBorda.innerText = bordaBotao.value + 'px';
}

editorTitulo.on('text-change', () => {
  document.getElementById('tituloPreview').innerHTML = editorTitulo.root.innerHTML;
});
editorParagrafo.on('text-change', () => {
  document.getElementById('paragrafoPreview').innerHTML = editorParagrafo.root.innerHTML;
});
editorRodape.on('text-change', () => {
  document.getElementById('rodapePreview').innerHTML = editorRodape.root.innerHTML;
});

function aplicarTema(n) {
  const tema = JSON.parse(localStorage.getItem('temaCustom' + n));
  if (!tema) return;

  temaSelecionado = n;
  document.getElementById('btnExcluirTema').classList.remove('d-none');

  for (let i = 1; i <= 5; i++) {
    const btn = document.getElementById('temaBtn' + i);
    btn.classList.remove('bg-success', 'text-white', 'btn-success');
    btn.classList.add('btn-outline-dark');
    btn.innerText = 'Tema ' + i + (localStorage.getItem('temaCustom' + i) ? ' (salvo)' : '');
  }

  const botaoAtual = document.getElementById('temaBtn' + n);
  botaoAtual.classList.remove('btn-outline-dark');
  botaoAtual.classList.add('bg-success', 'text-white');
  botaoAtual.innerText = 'Tema ' + n + ' (selecionado)';

  corFundo.value = tema.corFundo;
  corTexto.value = tema.corTexto;
  tamanhoFonte.value = tema.tamanhoFonte;
  textoBotao.value = tema.textoBotao;
  corBotao.value = tema.corBotao;
  bordaBotao.value = tema.bordaBotao;

  preview.style.backgroundColor = tema.corFundo;
  preview.style.color = tema.corTexto;
  preview.style.fontSize = tema.tamanhoFonte + 'px';
  fontePreview.innerText = tema.tamanhoFonte + 'px';

  editorTitulo.root.innerHTML = tema.tituloHTML;
  editorParagrafo.root.innerHTML = tema.paragrafoHTML;
  editorRodape.root.innerHTML = tema.rodapeHTML;

  document.getElementById('tituloPreview').innerHTML = tema.tituloHTML;
  document.getElementById('paragrafoPreview').innerHTML = tema.paragrafoHTML;
  document.getElementById('rodapePreview').innerHTML = tema.rodapeHTML;

  botao.innerText = tema.textoBotao;
  atualizarEstiloBotao();
  avaliarAcessibilidade();
}

function salvarConfiguracao() {
  const configuracao = {
    corFundo: corFundo.value,
    corTexto: corTexto.value,
    tamanhoFonte: tamanhoFonte.value,
    tituloHTML: editorTitulo.root.innerHTML,
    paragrafoHTML: editorParagrafo.root.innerHTML,
    rodapeHTML: editorRodape.root.innerHTML,
    textoBotao: textoBotao.value,
    corBotao: corBotao.value,
    bordaBotao: bordaBotao.value,
  };

  let slot = 1;
  while (slot <= 5) {
    const key = 'temaCustom' + slot;
    if (!localStorage.getItem(key)) break;
    slot++;
  }
  if (slot > 5) slot = 5;

  localStorage.setItem('temaCustom' + slot, JSON.stringify(configuracao));
  mostrarAlerta(`Tema ${slot} salvo com sucesso.`);
  atualizarBotoesTemas();
}

function excluirTemaSelecionado() {
  if (temaSelecionado) {
    localStorage.removeItem('temaCustom' + temaSelecionado);
    mostrarAlerta('Tema ' + temaSelecionado + ' excluído.', 'warning');
    const btn = document.getElementById('temaBtn' + temaSelecionado);
    btn.classList.remove('bg-success', 'text-white');
    btn.classList.add('btn-outline-dark');
    btn.innerText = 'Tema ' + temaSelecionado;
    document.getElementById('btnExcluirTema').classList.add('d-none');
    temaSelecionado = null;
    atualizarBotoesTemas();
  }
}

function atualizarBotoesTemas() {
  for (let i = 1; i <= 5; i++) {
    const botao = document.getElementById('temaBtn' + i);
    if (localStorage.getItem('temaCustom' + i)) {
      botao.innerText = 'Tema ' + i + ' (salvo)';
    } else {
      botao.innerText = 'Tema ' + i;
      botao.classList.remove('bg-success', 'text-white');
      botao.classList.add('btn-outline-dark');
    }
  }
}

function restaurarPadrao() {
  // Limpa tema selecionado visualmente
  temaSelecionado = null;
  document.getElementById('btnExcluirTema').classList.add('d-none');

  for (let i = 1; i <= 5; i++) {
    const botao = document.getElementById('temaBtn' + i);
    botao.classList.remove('bg-success', 'text-white');
    botao.classList.add('btn-outline-dark');
    botao.innerText = 'Tema ' + i + (localStorage.getItem('temaCustom' + i) ? ' (salvo)' : '');
  }

  // Valores padrão
  corFundo.value = '#ffffff';
  corTexto.value = '#000000';
  tamanhoFonte.value = '16';
  textoBotao.value = 'Clique Aqui';
  corBotao.value = '#0d6efd';
  bordaBotao.value = '5';

  editorTitulo.setText('Título do Site');
  editorParagrafo.setText('Texto de exemplo');
  editorRodape.setText('Rodapé do site - Simulação');

  // Aplicar visualmente
  preview.style.backgroundColor = corFundo.value;
  preview.style.color = corTexto.value;
  preview.style.fontSize = tamanhoFonte.value + 'px';
  fontePreview.innerText = tamanhoFonte.value + 'px';
  botao.innerText = textoBotao.value;

  atualizarEstiloBotao();
  avaliarAcessibilidade();
}


function exportarComoImagem() {
  html2canvas(document.getElementById('preview')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'simulador-preview.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}

function calcularContraste(hex1, hex2) {
  function luminancia(hex) {
    const rgb = hex.replace('#', '').match(/.{2}/g).map(c => {
      const v = parseInt(c, 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  }
  const L1 = luminancia(hex1);
  const L2 = luminancia(hex2);
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

function avaliarAcessibilidade() {
  const resultado = document.getElementById('acessibilidadeResultado');
  const contraste = calcularContraste(corTexto.value, corFundo.value);
  let nivel = '-';
  let sugestao = '-';
  if (contraste >= 7) nivel = 'AAA (Excelente)';
  else if (contraste >= 4.5) nivel = 'AA (Aceitável)';
  else if (contraste >= 3) { nivel = 'Baixo'; sugestao = 'Aumente o contraste'; }
  else { nivel = 'Inaceitável'; sugestao = 'Escolha texto claro em fundo escuro'; }

  resultado.innerHTML = `
    <p><strong>Contraste:</strong> ${contraste.toFixed(2)}:1</p>
    <p><strong>Nível:</strong> ${nivel}</p>
    <p><strong>Sugestão:</strong> ${sugestao}</p>
  `;
}

function mostrarAlerta(msg, tipo = 'success') {
  const alerta = document.getElementById('alertContainer');
  alerta.className = `alert alert-${tipo}`;
  alerta.innerText = msg;
  alerta.classList.remove('d-none');
  setTimeout(() => alerta.classList.add('d-none'), 3000);
}

// Inicialização
avaliarAcessibilidade();
atualizarEstiloBotao();
atualizarBotoesTemas();
