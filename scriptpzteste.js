/*====================================================
    PINKZONE 2.0
    Desenvolvido em JavaScript puro
=====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    iniciarContadores();

    iniciarAnimacoesScroll();

    iniciarScrollSuave();

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

/*====================================================
    INICIALIZAÇÃO EXTRA
=====================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    iniciarModoEscuro();

    criarBotaoTopo();

    iniciarCards();

    iniciarMenu();

});