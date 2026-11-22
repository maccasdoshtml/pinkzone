(function () {

  const CHAVE_SESSAO = "pinkzone_admin";

  function configuracao() {
    const config = window.PINKZONE_SUPABASE || {};
    if (!config.url || !config.anonKey) {
      throw new Error("Supabase não configurado. Preencha supabase-config.js.");
    }
    return {
      base: String(config.url).replace(/\/+$/, ""),
      anonKey: config.anonKey
    };
  }

  function sessaoAdmin() {
    try {
      const dados = JSON.parse(sessionStorage.getItem(CHAVE_SESSAO) || "null");
      if (!dados || !dados.access_token) return null;
      if (dados.expires_at && dados.expires_at * 1000 < Date.now()) {
        sessionStorage.removeItem(CHAVE_SESSAO);
        return null;
      }
      return dados;
    } catch (erro) {
      sessionStorage.removeItem(CHAVE_SESSAO);
      return null;
    }
  }

  function cabecalhos(sessao) {
    const config = configuracao();
    const token = sessao && sessao.access_token ? sessao.access_token : config.anonKey;
    return {
      "apikey": config.anonKey,
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    };
  }

  async function requisitar(url, opcoes) {
    let resposta;
    try {
      resposta = await fetch(url, opcoes);
    } catch (erro) {
      throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão.");
    }

    if (!resposta.ok) {
      let mensagem = "";
      try {
        const corpo = await resposta.json();
        mensagem = corpo.message || corpo.msg || corpo.error_description || corpo.error || "";
      } catch (erro) {
        mensagem = "";
      }
      if (resposta.status === 401) mensagem = "Não autorizado. Verifique suas credenciais.";
      throw new Error(mensagem || ("Erro " + resposta.status + " ao acessar os relatos."));
    }

    if (resposta.status === 204) return null;
    const texto = await resposta.text();
    return texto ? JSON.parse(texto) : null;
  }

  async function listarPublicados() {
    const config = configuracao();
    const parametros = new URLSearchParams({
      select: "id,criado_em,titulo,conteudo,uf,cidade,tipo_violencia",
      status: "eq.publicado",
      order: "criado_em.desc",
      limit: "30"
    });
    return requisitar(config.base + "/rest/v1/relatos?" + parametros.toString(), {
      headers: cabecalhos(null),
      cache: "no-store"
    });
  }

  async function enviarRelato(dados) {
    const config = configuracao();
    const corpo = {
      titulo: String(dados.titulo || "").trim(),
      conteudo: String(dados.conteudo || "").trim(),
      uf: String(dados.uf || "").trim().toUpperCase(),
      cidade: dados.cidade ? String(dados.cidade).trim() : null,
      tipo_violencia: dados.tipo_violencia || null,
      consentimento: true,
      status: "pendente"
    };
    return requisitar(config.base + "/rest/v1/relatos", {
      method: "POST",
      headers: Object.assign({}, cabecalhos(null), { "Prefer": "return=minimal" }),
      body: JSON.stringify(corpo)
    });
  }

  async function login(email, senha) {
    const config = configuracao();
    const resposta = await requisitar(config.base + "/auth/v1/token?grant_type=password", {
      method: "POST",
      headers: {
        "apikey": config.anonKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: email, password: senha })
    });
    sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify({
      access_token: resposta.access_token,
      expires_at: resposta.expires_at,
      email: resposta.user ? resposta.user.email : email
    }));
    return resposta;
  }

  async function listarTodos() {
    const sessao = sessaoAdmin();
    if (!sessao) throw new Error("Sessão expirada. Entre novamente.");
    const config = configuracao();
    const parametros = new URLSearchParams({
      select: "id,criado_em,titulo,conteudo,uf,cidade,tipo_violencia,status,consentimento",
      order: "criado_em.desc",
      limit: "100"
    });
    return requisitar(config.base + "/rest/v1/relatos?" + parametros.toString(), {
      headers: cabecalhos(sessao),
      cache: "no-store"
    });
  }

  async function salvarRelato(id, dados) {
    const sessao = sessaoAdmin();
    if (!sessao) throw new Error("Sessão expirada. Entre novamente.");
    const config = configuracao();
    return requisitar(config.base + "/rest/v1/relatos?id=eq." + encodeURIComponent(id), {
      method: "PATCH",
      headers: Object.assign({}, cabecalhos(sessao), { "Prefer": "return=representation" }),
      body: JSON.stringify(dados)
    });
  }

  async function excluirRelato(id) {
    const sessao = sessaoAdmin();
    if (!sessao) throw new Error("Sessão expirada. Entre novamente.");
    const config = configuracao();
    return requisitar(config.base + "/rest/v1/relatos?id=eq." + encodeURIComponent(id), {
      method: "DELETE",
      headers: Object.assign({}, cabecalhos(sessao), { "Prefer": "return=minimal" })
    });
  }

  function logout() {
    sessionStorage.removeItem(CHAVE_SESSAO);
  }

  window.PinkZoneDB = {
    configurado: function () {
      const config = window.PINKZONE_SUPABASE || {};
      return Boolean(config.url && config.anonKey);
    },
    sessaoAdmin: sessaoAdmin,
    listarPublicados: listarPublicados,
    enviarRelato: enviarRelato,
    login: login,
    listarTodos: listarTodos,
    salvarRelato: salvarRelato,
    excluirRelato: excluirRelato,
    logout: logout
  };

})();
