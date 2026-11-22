document.addEventListener("DOMContentLoaded", () => {

  const formulario = document.getElementById("formRelato");
  const statusEnvio = document.getElementById("statusEnvio");
  const botaoEnviar = document.getElementById("botaoEnviar");
  const lista = document.getElementById("listaRelatos");
  const carregando = document.getElementById("carregandoRelatos");
  const vazios = document.getElementById("relatosVazios");

  if (!window.PinkZoneDB || !window.PinkZoneDB.configurado()) {
    if (carregando) carregando.hidden = true;
    if (vazios) {
      vazios.hidden = false;
      vazios.textContent = "Os relatos ainda não estão disponíveis. Tente novamente mais tarde.";
    }
    if (botaoEnviar) botaoEnviar.disabled = true;
    formulario.addEventListener("submit", (evento) => evento.preventDefault());
    return;
  }

  function definirStatus(elemento, mensagem, tipo) {
    if (!elemento) return;
    elemento.textContent = mensagem;
    elemento.className = "relato-status" + (tipo ? " " + tipo : "");
  }

  function formatarData(valor) {
    const data = new Date(valor);
    if (isNaN(data.getTime())) return "";
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  }

  function criarTexto(classe, texto) {
    const elemento = document.createElement("p");
    elemento.className = classe;
    elemento.textContent = texto;
    return elemento;
  }

  function renderizar(relatos) {
    lista.innerHTML = "";

    if (!relatos.length) {
      vazios.hidden = false;
      return;
    }

    vazios.hidden = true;

    relatos.forEach((relato) => {
      const cartao = document.createElement("article");
      cartao.className = "relato-card";

      const meta = document.createElement("div");
      meta.className = "relato-meta";

      const local = [relato.cidade, relato.uf].filter(Boolean).join(" - ") || "Brasil";
      meta.appendChild(criarTexto("relato-local", local));

      const data = new Date(relato.criado_em);
      if (!isNaN(data.getTime())) {
        meta.appendChild(criarTexto("relato-data", formatarData(relato.criado_em)));
      }

      if (relato.tipo_violencia) {
        const tipo = document.createElement("span");
        tipo.className = "relato-tag";
        tipo.textContent = relato.tipo_violencia;
        meta.appendChild(tipo);
      }

      const titulo = document.createElement("h3");
      titulo.textContent = relato.titulo;

      const conteudo = document.createElement("div");
      conteudo.className = "relato-texto";
      conteudo.textContent = relato.conteudo;

      cartao.appendChild(meta);
      cartao.appendChild(titulo);
      cartao.appendChild(conteudo);
      lista.appendChild(cartao);
    });
  }

  async function carregar() {
    try {
      const relatos = await window.PinkZoneDB.listarPublicados();
      renderizar(relatos || []);
      carregando.hidden = true;
    } catch (erro) {
      definirStatus(carregando, "Não foi possível carregar os relatos agora.", "erro");
      carregando.hidden = false;
    }
  }

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (!formulario.reportValidity()) return;

    botaoEnviar.disabled = true;
    definirStatus(statusEnvio, "Enviando seu relato...", "info");

    try {
      await window.PinkZoneDB.enviarRelato({
        titulo: document.getElementById("relatoTitulo").value,
        conteudo: document.getElementById("relatoConteudo").value,
        uf: document.getElementById("relatoUf").value,
        cidade: document.getElementById("relatoCidade").value,
        tipo_violencia: document.getElementById("relatoTipo").value
      });

      formulario.reset();
      definirStatus(
        statusEnvio,
        "Relato enviado com segurança. Ele será revisado antes de aparecer nesta página.",
        "sucesso"
      );
    } catch (erro) {
      definirStatus(
        statusEnvio,
        erro.message || "Não foi possível enviar seu relato. Tente novamente.",
        "erro"
      );
    } finally {
      botaoEnviar.disabled = false;
    }
  });

  carregar();

});
