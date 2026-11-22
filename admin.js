document.addEventListener("DOMContentLoaded", () => {

  const areaLogin = document.getElementById("areaLogin");
  const areaPainel = document.getElementById("areaPainel");
  const formLogin = document.getElementById("formLogin");
  const statusLogin = document.getElementById("statusLogin");
  const statusPainel = document.getElementById("statusPainel");
  const filtro = document.getElementById("filtroStatus");
  const botaoAtualizar = document.getElementById("botaoAtualizar");
  const botaoSair = document.getElementById("botaoSair");
  const lista = document.getElementById("listaAdmin");

  function definirStatus(elemento, mensagem, tipo) {
    elemento.textContent = mensagem;
    elemento.className = "relato-status" + (tipo ? " " + tipo : "");
  }

  function mostrarPainel(logado) {
    areaLogin.hidden = logado;
    areaPainel.hidden = !logado;
    botaoSair.hidden = !logado;
  }

  function formatarData(valor) {
    const data = new Date(valor);
    if (isNaN(data.getTime())) return "";
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function criarCampo(texto, elemento) {
    const rotulo = document.createElement("label");
    rotulo.className = "admin-campo";
    const span = document.createElement("span");
    span.textContent = texto;
    rotulo.appendChild(span);
    rotulo.appendChild(elemento);
    return rotulo;
  }

  function criarBotao(texto, classe, acao) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = classe;
    botao.textContent = texto;
    botao.addEventListener("click", acao);
    return botao;
  }

  function sessaoEncerrada(erro) {
    const mensagem = String(erro && erro.message ? erro.message : "");
    return mensagem.indexOf("Sessão expirada") !== -1 || mensagem.indexOf("Não autorizado") !== -1;
  }

  function tratarErro(erro) {
    if (sessaoEncerrada(erro)) {
      window.PinkZoneDB.logout();
      mostrarPainel(false);
      definirStatus(statusLogin, "Sua sessão expirou. Entre novamente.", "erro");
      return;
    }
    definirStatus(statusPainel, erro.message || "Não foi possível concluir a operação.", "erro");
  }

  function renderizar(relatos) {
    lista.innerHTML = "";

    if (!relatos.length) {
      const vazio = document.createElement("p");
      vazio.className = "relato-status";
      vazio.textContent = "Nenhum relato encontrado com esse filtro.";
      lista.appendChild(vazio);
      return;
    }

    relatos.forEach((relato) => {
      const cartao = document.createElement("article");
      cartao.className = "relato-card admin-card";

      const meta = document.createElement("div");
      meta.className = "relato-meta";

      const local = document.createElement("span");
      local.className = "relato-local";
      local.textContent = [relato.cidade, relato.uf].filter(Boolean).join(" - ") || "Brasil";
      meta.appendChild(local);

      const data = document.createElement("span");
      data.className = "relato-data";
      data.textContent = formatarData(relato.criado_em);
      meta.appendChild(data);

      const situacao = document.createElement("span");
      situacao.className = "relato-tag admin-status status-" + relato.status;
      situacao.textContent = relato.status;
      meta.appendChild(situacao);

      const titulo = document.createElement("input");
      titulo.type = "text";
      titulo.value = relato.titulo;
      titulo.maxLength = 120;

      const conteudo = document.createElement("textarea");
      conteudo.rows = 8;
      conteudo.maxLength = 5000;
      conteudo.value = relato.conteudo;

      const botoes = document.createElement("div");
      botoes.className = "admin-acoes";

      async function salvar(novoStatus) {
        const novoTitulo = titulo.value.trim();
        const novoConteudo = conteudo.value.trim();

        if (novoTitulo.length < 5 || novoConteudo.length < 20) {
          definirStatus(statusPainel, "O título precisa de 5 caracteres e o relato de 20.", "erro");
          return;
        }

        botoes.querySelectorAll("button").forEach((botao) => { botao.disabled = true; });
        definirStatus(statusPainel, "Salvando...", "info");

        try {
          await window.PinkZoneDB.salvarRelato(relato.id, {
            titulo: novoTitulo,
            conteudo: novoConteudo,
            status: novoStatus
          });
          definirStatus(statusPainel, "Relato atualizado.", "sucesso");
          await carregar();
        } catch (erro) {
          tratarErro(erro);
          botoes.querySelectorAll("button").forEach((botao) => { botao.disabled = false; });
        }
      }

      botoes.appendChild(criarBotao("Publicar", "btn-primary", () => salvar("publicado")));
      botoes.appendChild(criarBotao("Arquivar", "btn-secondary", () => salvar("arquivado")));
      botoes.appendChild(criarBotao("Voltar a pendente", "btn-secondary", () => salvar("pendente")));

      botoes.appendChild(criarBotao("Excluir", "btn-perigo", async () => {
        if (!window.confirm("Excluir este relato permanentemente?")) return;
        try {
          await window.PinkZoneDB.excluirRelato(relato.id);
          definirStatus(statusPainel, "Relato excluído.", "sucesso");
          await carregar();
        } catch (erro) {
          tratarErro(erro);
        }
      }));

      cartao.appendChild(meta);
      cartao.appendChild(criarCampo("Título", titulo));
      cartao.appendChild(criarCampo("Texto do relato", conteudo));
      cartao.appendChild(botoes);
      lista.appendChild(cartao);
    });
  }

  async function carregar() {
    if (!window.PinkZoneDB || !window.PinkZoneDB.configurado()) {
      definirStatus(statusPainel, "Supabase não configurado.", "erro");
      return;
    }

    definirStatus(statusPainel, "Carregando relatos...", "info");

    try {
      const relatos = await window.PinkZoneDB.listarTodos();
      const valor = filtro.value;
      const filtrados = valor === "todos"
        ? relatos
        : (relatos || []).filter((relato) => relato.status === valor);
      renderizar(filtrados || []);
      definirStatus(statusPainel, "", "");
    } catch (erro) {
      tratarErro(erro);
    }
  }

  formLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (!window.PinkZoneDB || !window.PinkZoneDB.configurado()) {
      definirStatus(statusLogin, "Supabase não configurado. Preencha supabase-config.js.", "erro");
      return;
    }

    definirStatus(statusLogin, "Entrando...", "info");

    try {
      await window.PinkZoneDB.login(
        document.getElementById("adminEmail").value,
        document.getElementById("adminSenha").value
      );
      mostrarPainel(true);
      await carregar();
    } catch (erro) {
      definirStatus(statusLogin, erro.message || "Não foi possível entrar.", "erro");
    }
  });

  botaoAtualizar.addEventListener("click", carregar);
  filtro.addEventListener("change", carregar);

  botaoSair.addEventListener("click", (evento) => {
    evento.preventDefault();
    window.PinkZoneDB.logout();
    formLogin.reset();
    definirStatus(statusLogin, "", "");
    mostrarPainel(false);
  });

  mostrarPainel(false);

  if (window.PinkZoneDB && window.PinkZoneDB.sessaoAdmin()) {
    mostrarPainel(true);
    carregar();
  }

});
