/*====================================================
    PINKZONE 2.0
    Desenvolvido em JavaScript puro
====================================================*/

let promptInstalacaoPWA = null;

window.addEventListener("beforeinstallprompt", (evento) => {

    evento.preventDefault();
    promptInstalacaoPWA = evento;

    const item = document.getElementById("instalarApp");

    if (item) item.parentElement.hidden = false;

});

window.addEventListener("appinstalled", () => {

    promptInstalacaoPWA = null;

    const item = document.getElementById("instalarApp");

    if (item) item.parentElement.hidden = true;

});

document.addEventListener("DOMContentLoaded",()=>{

    iniciarContadores();
    iniciarAnimacoesScroll();
    iniciarScrollSuave();
    iniciarMenuMobile();
    iniciarModoEscuro();
    criarBotaoTopo();
    iniciarCards();
    iniciarMenu();
    iniciarSaidaRapida();
    registrarServiceWorker();
    iniciarPopupEntrada();
    iniciarLocalizacaoApoio();

});

/*====================================================
    CONTADORES
=====================================================*/

function iniciarContadores() {

    const contadores = document.querySelectorAll(".contador");

    if (!contadores.length) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            const contador = entry.target;

            const numeroFinal = parseInt(contador.dataset.numero);

            let numeroAtual = 0;

            const incremento = Math.ceil(numeroFinal / 180);

            const intervalo = setInterval(() => {

                numeroAtual += incremento;

                if (numeroAtual >= numeroFinal) {

                    numeroAtual = numeroFinal;

                    clearInterval(intervalo);

                }

                contador.textContent = numeroAtual.toLocaleString("pt-BR");

            }, 10);

            observer.unobserve(contador);

        });

    }, {

        threshold: 0.5

    });

    contadores.forEach(contador => observer.observe(contador));

}

/*====================================================
    SCROLL SUAVE
=====================================================*/

function iniciarScrollSuave() {

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (e) {

            const destino = document.querySelector(this.getAttribute("href"));

            if (!destino) return;

            e.preventDefault();

            destino.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        });

    });

}

/*====================================================
    ANIMAÇÕES AO ROLAR
=====================================================*/

function iniciarAnimacoesScroll() {

    const elementos = document.querySelectorAll(

        ".card, .stat, .hero-text, .hero-image, .about-text, .cta"

    );

    if (!elementos.length) return;

    elementos.forEach(elemento => {

        elemento.style.opacity = "0";

        elemento.style.transform = "translateY(40px)";

        elemento.style.transition =

            "opacity .7s ease, transform .7s ease";

    });

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";

                entry.target.style.transform = "translateY(0)";

            }

        });

    }, {

        threshold: 0.15

    });

    elementos.forEach(elemento => observer.observe(elemento));

}

/*====================================================
    MODO ESCURO
=====================================================*/

function iniciarModoEscuro() {

    const botoes = document.querySelectorAll(".dark-mode-toggle, .tema-mobile");

    if (!botoes.length) return;

    aplicarTema(localStorage.getItem("tema") === "escuro");

    document.addEventListener("click", (evento) => {

        if (!(evento.target instanceof Element)) return;

        const botao = evento.target.closest(".dark-mode-toggle, .tema-mobile");

        if (!botao) return;

        aplicarTema(!document.body.classList.contains("dark-theme"));

    });

}

function aplicarTema(escuro) {

    document.body.classList.toggle("dark-theme", escuro);

    localStorage.setItem("tema", escuro ? "escuro" : "claro");

    document.querySelectorAll(".dark-mode-toggle").forEach(botao => {

        botao.innerHTML = escuro ? "☀️" : "🌙";
        botao.setAttribute("aria-label", escuro ? "Ativar tema claro" : "Ativar tema escuro");
        botao.setAttribute("title", escuro ? "Tema claro" : "Tema escuro");

    });

    document.querySelectorAll(".tema-mobile").forEach(botao => {

        botao.innerHTML = `
            <span class="tema-icone">${escuro ? "☀️" : "🌙"}</span>
            <span>${escuro ? "Tema claro" : "Tema escuro"}</span>
        `;
        botao.setAttribute("aria-label", escuro ? "Ativar tema claro" : "Ativar tema escuro");

    });

    const metaTema = document.querySelector('meta[name="theme-color"]');

    if (metaTema) metaTema.setAttribute("content", escuro ? "#121212" : "#ff4f87");

}

/*====================================================
    BOTÃO VOLTAR AO TOPO
=====================================================*/

function criarBotaoTopo(){

    const botao=document.createElement("button");

    botao.type="button";
    botao.className="back-to-top";
    botao.innerHTML="↑";
    botao.setAttribute("aria-label","Voltar ao topo");
    botao.setAttribute("title","Voltar ao topo");

    document.body.appendChild(botao);

    window.addEventListener("scroll",()=>{

        if(window.scrollY>400){

            botao.classList.add("show");

        }else{

            botao.classList.remove("show");

        }

    });

    botao.addEventListener("click",()=>{

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}

/*====================================================
    EFEITO HOVER DOS CARDS
=====================================================*/

function iniciarCards(){

    const cards=document.querySelectorAll(".card");

    cards.forEach(card=>{

        card.addEventListener("mousemove",(e)=>{

            const rect=card.getBoundingClientRect();

            const x=e.clientX-rect.left;

            const y=e.clientY-rect.top;

            card.style.background=
            `radial-gradient(circle at ${x}px ${y}px,
            rgba(255,79,135,.10),
            white 70%)`;

        });

        card.addEventListener("mouseleave",()=>{

            card.style.background="white";

        });

    });

}function iniciarCards() {

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        card.addEventListener("mousemove", (e) => {

            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const escuro = document.body.classList.contains("dark-theme");

            if(document.body.classList.contains("dark-theme")){

    card.style.background =
    `radial-gradient(circle at ${x}px ${y}px,
    rgba(255,79,135,.18),
    #1d1d1d 70%)`;

}else{

    card.style.background =
    `radial-gradient(circle at ${x}px ${y}px,
    rgba(255,79,135,.10),
    #ffffff 70%)`;

}

        });

        card.addEventListener("mouseleave",()=>{

    card.style.background="";

});

    });

}

/*====================================================
    MENU ATIVO
=====================================================*/

function iniciarMenu(){

    const secoes=document.querySelectorAll("section");

    const links=document.querySelectorAll("nav a");

    if(!secoes.length || !links.length) return;

    window.addEventListener("scroll",()=>{

        let atual="";

        secoes.forEach(secao=>{

            const topo=secao.offsetTop-180;

            if(window.scrollY>=topo){

                atual=secao.id;

            }

        });

        links.forEach(link=>{

            link.classList.remove("active");

            if(link.getAttribute("href")==="#"+atual){

                link.classList.add("active");

            }

        });

    });

}

/*====================================================
    MENU MOBILE
====================================================*/

function iniciarMenuMobile() {

    const nav = document.querySelector("nav");
    const lista = nav ? nav.querySelector("ul") : null;

    if (!nav || !lista) return;

    if (!lista.id) lista.id = "menuPrincipal";

    const botao = document.createElement("button");

    botao.type = "button";
    botao.className = "menu-mobile-toggle";
    botao.id = "menuMobileToggle";
    botao.setAttribute("aria-label", "Abrir menu");
    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-controls", lista.id);
    botao.innerHTML = "<span></span><span></span><span></span>";

    nav.insertBefore(botao, lista);

    const itemTema = document.createElement("li");

    itemTema.className = "menu-mobile-item";

    const botaoTema = document.createElement("button");

    botaoTema.type = "button";
    botaoTema.className = "tema-mobile";
    botaoTema.setAttribute("aria-label", "Ativar tema escuro");
    botaoTema.textContent = "🌙";

    itemTema.appendChild(botaoTema);
    lista.appendChild(itemTema);

    const itemInstalar = document.createElement("li");

    itemInstalar.className = "menu-mobile-item";
    itemInstalar.hidden = !promptInstalacaoPWA;

    const botaoInstalar = document.createElement("button");

    botaoInstalar.type = "button";
    botaoInstalar.className = "instalar-app";
    botaoInstalar.id = "instalarApp";
    botaoInstalar.textContent = "Instalar aplicativo";

    itemInstalar.appendChild(botaoInstalar);
    lista.appendChild(itemInstalar);

    function abrirMenu() {

        nav.classList.add("menu-aberto");
        botao.setAttribute("aria-expanded", "true");
        botao.setAttribute("aria-label", "Fechar menu");

    }

    function fecharMenu() {

        nav.classList.remove("menu-aberto");
        botao.setAttribute("aria-expanded", "false");
        botao.setAttribute("aria-label", "Abrir menu");

    }

    botao.addEventListener("click", (evento) => {

        evento.stopPropagation();

        if (nav.classList.contains("menu-aberto")) {

            fecharMenu();

        } else {

            abrirMenu();

        }

    });

    lista.addEventListener("click", (evento) => {

        if (!(evento.target instanceof Element)) return;

        if (
            evento.target.closest("a") ||
            evento.target.closest("#abrirContatos") ||
            evento.target.closest("#abrirAjuda")
        ) {

            fecharMenu();

        }

    });

    document.addEventListener("click", (evento) => {

        if (!nav.contains(evento.target)) fecharMenu();

    });

    document.addEventListener("keydown", (evento) => {

        if (evento.key === "Escape") fecharMenu();

    });

    window.addEventListener("resize", () => {

        if (window.innerWidth > 1150) fecharMenu();

    });

    botaoInstalar.addEventListener("click", async () => {

        if (!promptInstalacaoPWA) return;

        promptInstalacaoPWA.prompt();
        await promptInstalacaoPWA.userChoice;
        promptInstalacaoPWA = null;
        itemInstalar.hidden = true;

    });

    document.documentElement.classList.add("menu-mobile-pronto");

}

/*====================================================
    SAÍDA RÁPIDA
====================================================*/

function iniciarSaidaRapida() {

    if (document.querySelector(".quick-exit")) {

        document.body.classList.add("tem-saida-rapida");

    }

}

/*====================================================
    SERVICE WORKER (PWA)
====================================================*/

function registrarServiceWorker() {

    if (!("serviceWorker" in navigator)) return;

    const local = ["localhost", "127.0.0.1"].includes(location.hostname);

    if (location.protocol !== "https:" && !local) return;

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("service-worker.js").catch(() => {});

    });

}

/*==============================
PESQUISA REDE DE APOIO
==============================*/

const campoPesquisa = document.getElementById("pesquisaApoio");

if(campoPesquisa){

    campoPesquisa.addEventListener("keyup", ()=>{

        const texto = campoPesquisa.value.toLowerCase();

        document.querySelectorAll(".card-apoio").forEach(card=>{

            const conteudo = card.innerText.toLowerCase();

            if(conteudo.includes(texto)){

                card.style.display="block";

            }else{

                card.style.display="none";

            }

        });

    });

}

/*==========================
QUIZ SINAIS
==========================*/

const botaoQuiz = document.getElementById("verificarQuiz");

if(botaoQuiz){

    botaoQuiz.addEventListener("click",()=>{

        const perguntas=document.querySelectorAll(".pergunta");

        let total=0;

        perguntas.forEach(item=>{

            if(item.checked){

                total++;

            }

        });

        const resultado=document.getElementById("resultadoQuiz");

        resultado.style.display="block";

        if(total==0){

            resultado.innerHTML=`
            🌸 Você não marcou nenhum dos sinais apresentados.

            Mesmo assim, conhecer seus direitos e saber onde buscar ajuda é sempre importante.
            `;

            resultado.style.background="#ffe4ec";

        }

        else if(total<=2){

            resultado.innerHTML=`
            💗 Você marcou alguns sinais.

            Vale a pena conversar com alguém de confiança e observar se esses comportamentos se repetem.
            `;

            resultado.style.background="#fff3cd";

        }

        else if(total<=4){

            resultado.innerHTML=`
            ⚠️ Atenção.

            Você marcou diversos comportamentos que podem indicar uma relação abusiva.

            Considere procurar orientação e conhecer a Rede de Apoio.
            `;

            resultado.style.background="#ffd6a5";

        }

        else{

            resultado.innerHTML=`
            🚨 Foram identificados vários sinais preocupantes.

            Se você se sentir em risco, procure ajuda imediatamente.

            Ligue para o 180 ou, em caso de emergência, para o 190.

            Você não está sozinha.
            `;

            resultado.style.background="#ffccd5";

        }

    });

}

/*====================================================
    QUIZ - SINAIS DE ALERTA
=====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const botao = document.getElementById("verificarQuiz");

    if (!botao) return;

    botao.addEventListener("click", () => {

        const perguntas = document.querySelectorAll(".pergunta");

        let total = 0;

        perguntas.forEach(pergunta => {

            if (pergunta.checked) {

                total++;

            }

        });

        const resultado = document.getElementById("resultadoQuiz");

        resultado.style.display = "block";

        if (total === 0) {

            resultado.innerHTML = `
                <h3>🌸 Nenhum sinal marcado</h3>
                <p>Você não marcou nenhuma situação. Mesmo assim, conhecer seus direitos e a rede de apoio é sempre importante.</p>
            `;

        } else if (total <= 2) {

            resultado.innerHTML = `
                <h3>💗 Atenção</h3>
                <p>Você marcou alguns comportamentos que merecem atenção. Conversar com alguém de confiança pode ser um bom primeiro passo.</p>
            `;

        } else if (total <= 4) {

            resultado.innerHTML = `
                <h3>⚠️ Sinais importantes</h3>
                <p>Você identificou diversos comportamentos que podem indicar uma relação abusiva. Procure conhecer seus direitos e a rede de apoio.</p>
            `;

        } else {

            resultado.innerHTML = `
                <h3>🚨 Procure ajuda</h3>
                <p>Você marcou muitos sinais preocupantes. Se estiver em risco, procure um local seguro e utilize os canais de apoio, como o 180 ou, em caso de emergência, o 190.</p>
            `;

        }

        resultado.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    });

});

/* ==========================================
   MODAL DE AJUDA
========================================== */

const abrirAjuda = document.getElementById("abrirAjuda");
const modalAjuda = document.getElementById("modalAjuda");
const fecharAjuda = document.getElementById("fecharAjuda");

if (abrirAjuda && modalAjuda && fecharAjuda) {

    abrirAjuda.addEventListener("click", () => {

        modalAjuda.classList.add("ativo");

    });

    fecharAjuda.addEventListener("click", () => {

        modalAjuda.classList.remove("ativo");

    });

    modalAjuda.addEventListener("click", (e) => {

        if (e.target === modalAjuda) {

            modalAjuda.classList.remove("ativo");

        }

    });

}

/* ==========================================
   CONTATOS DE CONFIANÇA
========================================== */

const CHAVE_CONTATOS = "pinkzone_contatos";

document.addEventListener("DOMContentLoaded", () => {

    iniciarContatos();

});

function iniciarContatos() {

    const botaoDenunciar = document.getElementById("abrirAjuda");

    if (!botaoDenunciar) return;

    const itemMenu = botaoDenunciar.closest("li");

    if (!itemMenu) return;

    const botaoContatos = document.createElement("button");

    botaoContatos.type = "button";
    botaoContatos.className = "menu-contatos";
    botaoContatos.id = "abrirContatos";
    botaoContatos.setAttribute("aria-haspopup", "dialog");
    botaoContatos.setAttribute("aria-expanded", "false");
    botaoContatos.textContent = "Contatos";

    itemMenu.classList.add("nav-acoes");
    itemMenu.insertBefore(botaoContatos, botaoDenunciar);

    const popover = document.createElement("div");

    popover.className = "contatos-popover";
    popover.id = "contatosPopover";
    popover.setAttribute("role", "dialog");
    popover.setAttribute("aria-label", "Contatos de confiança");

    popover.innerHTML = `
        <div class="contatos-topo">
            <div>
                <h3>Contatos de confiança</h3>
                <p>Salvos apenas neste navegador.</p>
            </div>
            <button type="button" class="contatos-fechar" id="fecharContatos" aria-label="Fechar contatos">&times;</button>
        </div>

        <div class="contatos-lista" id="contatosLista"></div>

        <div class="contatos-vazio" id="contatosVazio">
            Nenhum contato salvo ainda. Cadastre uma pessoa de confiança
            para acessar o WhatsApp rapidamente.
        </div>

        <button type="button" class="contatos-adicionar" id="contatosAdicionar">
            + Adicionar contato
        </button>

        <form class="contatos-form" id="contatosForm" novalidate>
            <input type="hidden" id="contatoId">

            <label for="contatoNome">Nome</label>
            <input type="text" id="contatoNome" maxlength="60" autocomplete="name" placeholder="Ex.: Maria" required>

            <label for="contatoParentesco">Grau de parentesco</label>
            <select id="contatoParentesco" required>
                <option value="">Selecione...</option>
                <option>Mãe</option>
                <option>Pai</option>
                <option>Irmã</option>
                <option>Irmão</option>
                <option>Avó</option>
                <option>Avô</option>
                <option>Tia</option>
                <option>Tio</option>
                <option>Prima</option>
                <option>Primo</option>
                <option>Amiga</option>
                <option>Amigo</option>
                <option>Colega de trabalho</option>
                <option>Colega de estudo</option>
                <option>Vizinho(a)</option>
                <option>Outro</option>
            </select>

            <label for="contatoTelefone">Telefone (DDD + número)</label>
            <input type="tel" id="contatoTelefone" inputmode="numeric" maxlength="24" autocomplete="tel" placeholder="84998213691" required>

            <small class="contatos-erro" id="contatosErro" role="alert"></small>

            <div class="contatos-form-acoes">
                <button type="submit" class="contatos-salvar" id="contatosSalvar">Salvar</button>
                <button type="button" class="contatos-cancelar" id="contatosCancelar">Cancelar</button>
            </div>
        </form>

        <p class="contatos-status" id="contatosStatus" role="status" aria-live="polite"></p>
    `;

    document.body.appendChild(popover);

    const lista = popover.querySelector("#contatosLista");
    const vazio = popover.querySelector("#contatosVazio");
    const form = popover.querySelector("#contatosForm");
    const campoId = popover.querySelector("#contatoId");
    const campoNome = popover.querySelector("#contatoNome");
    const campoParentesco = popover.querySelector("#contatoParentesco");
    const campoTelefone = popover.querySelector("#contatoTelefone");
    const erro = popover.querySelector("#contatosErro");
    const status = popover.querySelector("#contatosStatus");
    const botaoAdicionar = popover.querySelector("#contatosAdicionar");
    const botaoSalvar = popover.querySelector("#contatosSalvar");
    const botaoCancelar = popover.querySelector("#contatosCancelar");
    const botaoFechar = popover.querySelector("#fecharContatos");

    let contatos = carregarContatos();
    let editandoId = null;
    let aberto = false;
    let statusTimer = null;

    function carregarContatos() {

        try {

            const dados = JSON.parse(localStorage.getItem(CHAVE_CONTATOS) || "[]");

            if (!Array.isArray(dados)) return [];

            return dados
                .filter(c => c && typeof c.nome === "string" && c.telefone)
                .map(c => ({
                    id: String(c.id || Date.now() + Math.random()),
                    nome: String(c.nome).slice(0, 60),
                    parentesco: String(c.parentesco || "Outro"),
                    telefone: normalizarTelefone(c.telefone)
                }))
                .filter(c => telefoneValido(c.telefone));

        } catch (e) {

            return [];

        }

    }

    function salvarNoNavegador() {

        try {

            localStorage.setItem(CHAVE_CONTATOS, JSON.stringify(contatos));

            return true;

        } catch (e) {

            return false;

        }

    }

    function normalizarTelefone(valor) {

        let digitos = String(valor || "").replace(/\D/g, "");

        if ((digitos.length === 12 || digitos.length === 13) && digitos.startsWith("55")) {

            digitos = digitos.slice(2);

        }

        return digitos;

    }

    function telefoneValido(digitos) {

        return digitos.length === 10 || digitos.length === 11;

    }

    function formatarTelefone(digitos) {

        if (digitos.length === 11) {

            return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;

        }

        if (digitos.length === 10) {

            return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;

        }

        return digitos;

    }

    function linkWhatsApp(digitos) {

        return `https://wa.me/55${digitos}`;

    }

    function mostrarStatus(mensagem, erroVisual = false) {

        status.textContent = mensagem;
        status.style.color = erroVisual ? "#c62828" : "#2e7d32";

        clearTimeout(statusTimer);

        statusTimer = setTimeout(() => {

            status.textContent = "";

        }, 3500);

    }

    function renderizar() {

        lista.innerHTML = "";

        if (!contatos.length) {

            lista.style.display = "none";
            vazio.style.display = "block";
            botaoAdicionar.style.display = "none";

            return;

        }

        lista.style.display = "flex";
        vazio.style.display = "none";
        botaoAdicionar.style.display = "block";

        contatos.forEach(contato => {

            const item = document.createElement("div");
            item.className = "contato-item";
            item.dataset.id = contato.id;

            const botaoNome = document.createElement("button");
            botaoNome.type = "button";
            botaoNome.className = "contato-nome";
            botaoNome.setAttribute("aria-expanded", "false");

            const avatar = document.createElement("span");
            avatar.className = "contato-avatar";
            avatar.textContent = (contato.nome.trim().charAt(0) || "?").toUpperCase();

            const info = document.createElement("span");
            info.className = "contato-info";

            const nome = document.createElement("strong");
            nome.textContent = contato.nome;

            const detalhe = document.createElement("small");
            detalhe.textContent = `${contato.parentesco} • ${formatarTelefone(contato.telefone)}`;

            info.appendChild(nome);
            info.appendChild(detalhe);

            const seta = document.createElement("span");
            seta.className = "contato-seta";
            seta.textContent = "›";

            botaoNome.appendChild(avatar);
            botaoNome.appendChild(info);
            botaoNome.appendChild(seta);

            const acoes = document.createElement("div");
            acoes.className = "contato-acoes";

            const link = document.createElement("a");
            link.className = "contato-whatsapp";
            link.href = linkWhatsApp(contato.telefone);
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "Contato";

            const editar = document.createElement("button");
            editar.type = "button";
            editar.className = "contato-editar";
            editar.textContent = "Editar";

            const excluir = document.createElement("button");
            excluir.type = "button";
            excluir.className = "contato-excluir";
            excluir.textContent = "Excluir";

            acoes.appendChild(link);
            acoes.appendChild(editar);
            acoes.appendChild(excluir);

            item.appendChild(botaoNome);
            item.appendChild(acoes);
            lista.appendChild(item);

            botaoNome.addEventListener("click", () => {

                const estaAberto = item.classList.toggle("aberto");
                botaoNome.setAttribute("aria-expanded", estaAberto ? "true" : "false");

            });

            editar.addEventListener("click", () => {

                abrirFormulario(contato);

            });

            excluir.addEventListener("click", () => {

                if (!confirm(`Excluir o contato "${contato.nome}"?`)) return;

                contatos = contatos.filter(c => c.id !== contato.id);

                if (!salvarNoNavegador()) {

                    mostrarStatus("Não foi possível excluir neste navegador.", true);
                    return;

                }

                if (editandoId === contato.id) fecharFormulario();

                renderizar();
                mostrarStatus("Contato excluído.");

            });

        });

    }

    function abrirFormulario(contato = null) {

        editandoId = contato ? contato.id : null;
        campoId.value = contato ? contato.id : "";
        campoNome.value = contato ? contato.nome : "";
        campoParentesco.value = contato ? contato.parentesco : "";
        campoTelefone.value = contato ? contato.telefone : "";
        erro.textContent = "";
        botaoSalvar.textContent = contato ? "Salvar alterações" : "Salvar";

        form.style.display = "flex";
        lista.style.display = "none";
        vazio.style.display = "none";
        botaoAdicionar.style.display = "none";

        campoNome.focus();

    }

    function fecharFormulario() {

        editandoId = null;
        form.reset();
        campoId.value = "";
        erro.textContent = "";
        botaoSalvar.textContent = "Salvar";

        form.style.display = "none";
        renderizar();

    }

    function abrirPopover() {

        aberto = true;
        popover.classList.add("ativo");
        botaoContatos.setAttribute("aria-expanded", "true");

        posicionarPopover();
        renderizar();

        if (!contatos.length) {

            abrirFormulario();

        } else {

            const primeiro = popover.querySelector(".contato-nome");

            if (primeiro) primeiro.focus();

        }

    }

    function fecharPopover(devolverFoco = false) {

        aberto = false;
        popover.classList.remove("ativo");
        botaoContatos.setAttribute("aria-expanded", "false");

        fecharFormulario();

        if (devolverFoco) botaoContatos.focus();

    }

    function posicionarPopover() {

        const margem = 12;

        if (window.innerWidth <= 1150) {

            popover.style.width = `${window.innerWidth - margem * 2}px`;
            popover.style.left = `${margem}px`;
            popover.style.top = `${margem}px`;
            popover.style.maxHeight = `${window.innerHeight - margem * 2}px`;

            return;

        }

        const rect = botaoContatos.getBoundingClientRect();
        const largura = Math.min(380, window.innerWidth - margem * 2);

        let esquerda = rect.right - largura;
        esquerda = Math.max(margem, Math.min(esquerda, window.innerWidth - largura - margem));

        const espacoAbaixo = window.innerHeight - rect.bottom - margem * 2;
        const espacoAcima = rect.top - margem * 2;

        let topo;
        let alturaMaxima;

        if (espacoAbaixo >= espacoAcima) {

            topo = rect.bottom + margem;
            alturaMaxima = espacoAbaixo;

        } else {

            alturaMaxima = espacoAcima;
            topo = rect.top - margem - alturaMaxima;

        }

        if (alturaMaxima < 180) {

            alturaMaxima = window.innerHeight - margem * 2;
            topo = margem;

        }

        popover.style.width = `${largura}px`;
        popover.style.left = `${esquerda}px`;
        popover.style.top = `${topo}px`;
        popover.style.maxHeight = `${Math.max(160, alturaMaxima)}px`;

    }

    botaoContatos.addEventListener("click", () => {

        if (aberto) {

            fecharPopover(true);

        } else {

            abrirPopover();

        }

    });

    botaoFechar.addEventListener("click", () => fecharPopover(true));

    botaoAdicionar.addEventListener("click", () => abrirFormulario());

    botaoCancelar.addEventListener("click", () => {

        if (contatos.length) {

            fecharFormulario();

        } else {

            fecharPopover(true);

        }

    });

    form.addEventListener("submit", (evento) => {

        evento.preventDefault();
        erro.textContent = "";

        const nome = campoNome.value.trim();
        const parentesco = campoParentesco.value;
        const telefone = normalizarTelefone(campoTelefone.value);

        if (nome.length < 2) {

            erro.textContent = "Digite o nome do contato.";
            campoNome.focus();
            return;

        }

        if (!parentesco) {

            erro.textContent = "Selecione o grau de parentesco.";
            campoParentesco.focus();
            return;

        }

        if (!telefoneValido(telefone)) {

            erro.textContent = "Digite o telefone com DDD, só números. Ex.: 84998213691.";
            campoTelefone.focus();
            return;

        }

        if (editandoId) {

            const contato = contatos.find(c => c.id === editandoId);

            if (contato) {

                contato.nome = nome;
                contato.parentesco = parentesco;
                contato.telefone = telefone;

            }

        } else {

            contatos.push({
                id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
                nome,
                parentesco,
                telefone
            });

        }

        if (!salvarNoNavegador()) {

            erro.textContent = "Não foi possível salvar. Verifique se o navegador permite armazenamento.";
            return;

        }

        const mensagem = editandoId ? "Contato atualizado." : "Contato salvo.";

        fecharFormulario();
        mostrarStatus(mensagem);

    });

    campoTelefone.addEventListener("input", () => {

        campoTelefone.value = normalizarTelefone(campoTelefone.value);

    });

    document.addEventListener("click", (evento) => {

        if (!aberto) return;
        if (popover.contains(evento.target) || botaoContatos.contains(evento.target)) return;

        fecharPopover();

    });

    document.addEventListener("keydown", (evento) => {

        if (evento.key === "Escape" && aberto) {

            fecharPopover(true);

        }

    });

    window.addEventListener("resize", () => {

        if (aberto) posicionarPopover();

    });

    window.addEventListener("scroll", () => {

        if (aberto) posicionarPopover();

    }, { passive: true });

    botaoDenunciar.addEventListener("click", () => {

        if (aberto) fecharPopover();

    });

    renderizar();

}


/*====================================================
    POPUP DE ENTRADA
=====================================================*/

function iniciarPopupEntrada() {

    const modal = document.getElementById("modalEntrada");
    if (!modal) return;

    const fechar = () => {
        modal.classList.remove("ativo");
        try { sessionStorage.setItem("pz_popup_entrada", "1"); } catch (e) {}
    };

    const btnFechar = modal.querySelector(".fechar-modal-entrada");
    if (btnFechar) btnFechar.addEventListener("click", fechar);

    const btnEntendi = modal.querySelector("#fecharEntrada");
    if (btnEntendi) btnEntendi.addEventListener("click", fechar);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) fechar();
    });

    let visto = false;
    try { visto = sessionStorage.getItem("pz_popup_entrada") === "1"; } catch (e) {}
    if (!visto) {
        modal.classList.add("ativo");
    }

}

/*====================================================
    LOCALIZAÇÃO - APOIO E POLÍCIA PRÓXIMOS
=====================================================*/

function iniciarLocalizacaoApoio() {
    const btn = document.getElementById("btnLocalizacao");
    const status = document.getElementById("statusLocalizacao");
    const resultados = document.getElementById("resultadosLocalizacao");
    if (!btn || !status || !resultados) return;

    const linkDelegacias = document.getElementById("linkMapaDelegacias");
    const linkPolicia = document.getElementById("linkMapaPolicia");

    function setStatus(msg, tipo) {
        status.textContent = msg || "";
        status.className = "localizacao-status" + (tipo ? " " + tipo : "");
    }

    function distanciaKm(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }

    function renderLocais(locais) {
        if (!locais.length) {
            resultados.innerHTML = '<div class="card"><p>Não encontramos resultados automáticos próximos. Use os botões acima para buscar no mapa.</p></div>';
            return;
        }
        locais.sort((a,b) => a.dist - b.dist);
        resultados.innerHTML = locais.slice(0, 12).map(l => {
            const maps = `https://www.google.com/maps/search/?api=1&query=${l.lat},${l.lon}`;
            const distTxt = l.dist < 1 ? `${Math.round(l.dist*1000)} m` : `${l.dist.toFixed(1)} km`;
            return `<div class="card card-apoio">
                <div class="icone">${l.tipo === 'apoio' ? '💜' : '🚓'}</div>
                <h3>${escapeHtml(l.nome)}</h3>
                <span class="distancia">~ ${distTxt} de você</span>
                ${l.endereco ? `<p class="endereco">${escapeHtml(l.endereco)}</p>` : ''}
                <p>${l.tipo === 'apoio' ? 'Serviço de apoio/rede de proteção.' : 'Unidade policial/delegacia.'}</p>
                <a href="${maps}" target="_blank" rel="noopener" class="btn-primary">Ver no mapa</a>
            </div>`;
        }).join("");
    }

    async function buscarOverpass(lat, lon) {
        const radius = 7000;
        const query = `[out:json][timeout:25];
(
  node["amenity"="police"](around:${radius},${lat},${lon});
  way["amenity"="police"](around:${radius},${lat},${lon});
  node["name"~"Mulher|DEAM|CRAM|Casa da Mulher|Referência da Mulher|Defensoria",i](around:${radius},${lat},${lon});
  way["name"~"Mulher|DEAM|CRAM|Casa da Mulher|Referência da Mulher|Defensoria",i](around:${radius},${lat},${lon});
  node["social_facility:for"~"woman|women",i](around:${radius},${lat},${lon});
  way["social_facility:for"~"woman|women",i](around:${radius},${lat},${lon});
);
out center tags;`;
        const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Falha na consulta");
        const data = await resp.json();
        const vistos = new Set();
        const locais = [];
        (data.elements || []).forEach(el => {
            const elLat = el.lat || (el.center && el.center.lat);
            const elLon = el.lon || (el.center && el.center.lon);
            if (elLat == null || elLon == null) return;
            const tags = el.tags || {};
            const nome = tags.name || (tags.amenity === "police" ? "Delegacia/Polícia" : "Serviço de apoio");
            const chave = nome + "|" + elLat.toFixed(4) + "|" + elLon.toFixed(4);
            if (vistos.has(chave)) return;
            vistos.add(chave);
            const endereco = [tags["addr:street"], tags["addr:housenumber"], tags["addr:suburb"], tags["addr:city"]].filter(Boolean).join(", ");
            const nomeLower = nome.toLowerCase();
            const tipo = (tags.amenity === "police" && !/mulher|cram|refer|casa da mulher/.test(nomeLower)) ? "policia" : (/mulher|deam|cram|defensoria|refer|casa da mulher|social/.test(nomeLower) || tags["social_facility:for"] ? "apoio" : "policia");
            locais.push({ nome, lat: elLat, lon: elLon, endereco, tipo, dist: distanciaKm(lat, lon, elLat, elLon) });
        });
        return locais;
    }

    btn.addEventListener("click", async () => {
        if (!navigator.geolocation) {
            setStatus("Seu navegador não suporta geolocalização. Use os botões para abrir o mapa.", "erro");
            return;
        }
        setStatus("Obtendo sua localização...", "");
        resultados.innerHTML = "";
        btn.disabled = true;
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const acc = Math.round(pos.coords.accuracy || 0);
            if (linkDelegacias) linkDelegacias.href = `https://www.google.com/maps/search/delegacia+da+mulher/@${lat},${lon},14z`;
            if (linkPolicia) linkPolicia.href = `https://www.google.com/maps/search/pol%C3%ADcia+delegacia/@${lat},${lon},14z`;
            setStatus(`Localização obtida (precisão ~${acc} m). Buscando serviços próximos...`, "");
            try {
                const locais = await buscarOverpass(lat, lon);
                setStatus(locais.length ? `Encontramos ${locais.length} local(is) em até 7 km.` : "Nenhum local cadastrado encontrado automaticamente por perto.", locais.length ? "ok" : "");
                renderLocais(locais);
            } catch (e) {
                setStatus("Não foi possível buscar locais automaticamente. Use os botões para abrir o mapa.", "erro");
                resultados.innerHTML = '<div class="card"><p>Tente novamente em instantes ou abra o mapa para ver delegacias e polícia próximas.</p></div>';
            } finally {
                btn.disabled = false;
            }
        }, (err) => {
            btn.disabled = false;
            if (err.code === 1) setStatus("Permissão de localização negada. Você pode permitir no navegador ou usar os botões de mapa.", "erro");
            else if (err.code === 2) setStatus("Localização indisponível no momento. Tente os botões de mapa.", "erro");
            else if (err.code === 3) setStatus("Tempo esgotado ao obter localização. Tente novamente.", "erro");
            else setStatus("Não foi possível obter sua localização.", "erro");
        }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
    });
}