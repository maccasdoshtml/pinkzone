/*====================================================
    PINKZONE 2.0
    Desenvolvido em JavaScript puro
=====================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    iniciarContadores();
    iniciarAnimacoesScroll();
    iniciarScrollSuave();
    iniciarModoEscuro();
    criarBotaoTopo();
    iniciarCards();
    iniciarMenu();

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

    const botao = document.querySelector(".dark-mode-toggle");

    if (!botao) return;

    if (localStorage.getItem("tema") === "escuro") {

        document.body.classList.add("dark-theme");
        botao.innerHTML = "☀️";

    }

    botao.addEventListener("click", () => {

        document.body.classList.toggle("dark-theme");

        const ativo = document.body.classList.contains("dark-theme");

        localStorage.setItem("tema", ativo ? "escuro" : "claro");

        botao.innerHTML = ativo ? "☀️" : "🌙";

    });

}

/*====================================================
    BOTÃO VOLTAR AO TOPO
=====================================================*/

function criarBotaoTopo(){

    const botao=document.createElement("button");

    botao.className="back-to-top";

    botao.innerHTML="↑";

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

