/* ============================================================
   PORTFÓLIO — PAULO VICTOR
   Animações e interações. Nada aqui é obrigatório para o site
   funcionar: se este arquivo falhar, o conteúdo continua legível.
   ============================================================ */

(function () {
    "use strict";

    var reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var temGsap = typeof window.gsap !== "undefined";

    /* ========================================================
       1. PRELOADER — porcentagem real de assets carregados
       ======================================================== */
    function iniciarPreloader() {
        var preloader = document.getElementById("preloader");
        var fill = document.getElementById("preloader-fill");
        var pct = document.getElementById("preloader-pct");
        if (!preloader) return;

        // Só conta o que já está no HTML inicial; o resto é lazy e não
        // deve segurar a entrada do site.
        var assets = Array.prototype.slice.call(
            document.querySelectorAll('img:not([loading="lazy"])')
        );
        var total = assets.length;
        var prontos = 0;

        function pintar(valor) {
            var v = Math.min(100, Math.round(valor));
            if (fill) fill.style.width = v + "%";
            if (pct) pct.textContent = v + "%";
        }

        function encerrar() {
            pintar(100);
            preloader.classList.add("pronto");
            // Tira do DOM depois da animação de saída
            window.setTimeout(function () {
                preloader.setAttribute("hidden", "");
            }, 700);
        }

        function passo() {
            prontos++;
            pintar(total ? (prontos / total) * 100 : 100);
            if (prontos >= total) encerrar();
        }

        pintar(total ? 0 : 100);

        if (total === 0) {
            encerrar();
        } else {
            assets.forEach(function (img) {
                if (img.complete) {
                    passo();
                } else {
                    img.addEventListener("load", passo, { once: true });
                    img.addEventListener("error", passo, { once: true });
                }
            });
        }

        // Rede lenta ou asset travado não pode prender o visitante
        window.setTimeout(encerrar, 4000);
    }

    /* ========================================================
       2. ANO DO RODAPÉ
       ======================================================== */
    function atualizarAno() {
        var ano = document.getElementById("ano");
        if (ano) ano.textContent = new Date().getFullYear();
    }

    /* ========================================================
       3. LIGHTBOX — clique na imagem de projeto para ampliar
       ======================================================== */
    function iniciarLightbox() {
        var caixa = document.getElementById("lightbox");
        var imgAlvo = document.getElementById("lightbox-img");
        var fechar = document.getElementById("lightbox-close");
        if (!caixa || !imgAlvo || !fechar) return;

        var ultimoFoco = null;

        function abrir(src, alt) {
            ultimoFoco = document.activeElement;
            imgAlvo.src = src;
            imgAlvo.alt = alt || "";
            caixa.removeAttribute("hidden");
            // Força um frame antes da transição de opacidade
            requestAnimationFrame(function () {
                caixa.classList.add("aberto");
            });
            document.body.style.overflow = "hidden";
            fechar.focus();
        }

        function esconder() {
            caixa.classList.remove("aberto");
            document.body.style.overflow = "";
            window.setTimeout(function () {
                caixa.setAttribute("hidden", "");
                imgAlvo.src = "";
            }, 300);
            if (ultimoFoco) ultimoFoco.focus();
        }

        document.querySelectorAll(".card-proj .img-link img").forEach(function (img) {
            img.setAttribute("tabindex", "0");
            img.setAttribute("role", "button");

            img.addEventListener("click", function () {
                abrir(img.currentSrc || img.src, img.alt);
            });

            img.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    abrir(img.currentSrc || img.src, img.alt);
                }
            });
        });

        fechar.addEventListener("click", esconder);

        caixa.addEventListener("click", function (e) {
            if (e.target === caixa) esconder();
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && !caixa.hasAttribute("hidden")) esconder();
        });
    }

    /* ========================================================
       4. NAVEGAÇÃO — link ativo conforme a seção visível
       ======================================================== */
    function iniciarNavAtiva() {
        var links = Array.prototype.slice.call(document.querySelectorAll("nav .pages a"));
        if (!links.length || !("IntersectionObserver" in window)) return;

        var mapa = {};
        var alvos = [];

        links.forEach(function (a) {
            var id = a.getAttribute("href");
            if (!id || id.charAt(0) !== "#") return;
            var secao = document.querySelector(id);
            if (!secao) return;
            mapa[id.slice(1)] = a;
            alvos.push(secao);
        });

        var observador = new IntersectionObserver(
            function (entradas) {
                entradas.forEach(function (entrada) {
                    var link = mapa[entrada.target.id];
                    if (!link) return;
                    if (entrada.isIntersecting) {
                        links.forEach(function (l) { l.classList.remove("ativo"); });
                        link.classList.add("ativo");
                    }
                });
            },
            // A seção precisa ocupar a faixa central da tela para contar
            { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
        );

        alvos.forEach(function (s) { observador.observe(s); });
    }

    /* ========================================================
       5. BARRA DE PROGRESSO DA ROLAGEM
       ======================================================== */
    function iniciarProgresso() {
        var barra = document.getElementById("scroll-progress");
        if (!barra) return;

        var pendente = false;

        function pintar() {
            var doc = document.documentElement;
            var total = doc.scrollHeight - doc.clientHeight;
            var razao = total > 0 ? doc.scrollTop / total : 0;
            barra.style.transform = "scaleX(" + razao + ")";
            pendente = false;
        }

        window.addEventListener(
            "scroll",
            function () {
                if (pendente) return;
                pendente = true;
                requestAnimationFrame(pintar);
            },
            { passive: true }
        );

        pintar();
    }

    /* ========================================================
       6. SPLIT TEXT — quebra o nome em letras para animar
       ======================================================== */
    function quebrarEmLetras(el) {
        if (!el) return [];
        var texto = el.textContent;
        el.textContent = "";
        var spans = [];

        texto.split("").forEach(function (ch) {
            var span = document.createElement("span");
            span.className = "letra";
            span.textContent = ch;
            // O nome inteiro continua sendo lido de uma vez pelo leitor de tela
            span.setAttribute("aria-hidden", "true");
            el.appendChild(span);
            spans.push(span);
        });

        el.setAttribute("aria-label", texto);
        return spans;
    }
    /* ========================================================
       7. REVELAÇÃO NO SCROLL — IntersectionObserver

       Por que não ScrollTrigger aqui: ele calcula posições em
       pixels e precisa de refresh sempre que fonte ou imagem
       muda a altura da página. Quando esse recálculo não
       acontece, o conteúdo fica invisível para sempre — foi
       exatamente o que quebrou a primeira versão desta página.
       O IntersectionObserver pergunta ao navegador se o elemento
       está na tela, então não tem esse modo de falha.

       O GSAP continua cuidando do que é puramente decorativo:
       entrada do header, foguete, parallax, tilt e magnetismo.
       ======================================================== */
    function iniciarRevelacao() {
        var alvos = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

        function mostrarTudo() {
            alvos.forEach(function (el) { el.classList.add("visivel"); });
        }

        if (!alvos.length) {
            window.__revelacaoAtiva = true;
            return;
        }

        // Navegador sem IntersectionObserver: mostra tudo de uma vez
        if (!("IntersectionObserver" in window)) {
            mostrarTudo();
            window.__revelacaoAtiva = true;
            return;
        }

        // Stagger: irmãos diretos entram em sequência, não todos juntos
        var contagem = new WeakMap();
        alvos.forEach(function (el) {
            var pai = el.parentElement;
            var i = contagem.get(pai) || 0;
            contagem.set(pai, i + 1);
            el.style.setProperty("--atraso", Math.min(i, 8) * 60 + "ms");
        });

        var observador = new IntersectionObserver(
            function (entradas) {
                entradas.forEach(function (entrada) {
                    if (!entrada.isIntersecting) return;
                    entrada.target.classList.add("visivel");
                    // Revelou uma vez, some do radar: nada é escondido de novo
                    observador.unobserve(entrada.target);
                });
            },
            { rootMargin: "0px 0px -12% 0px", threshold: 0.01 }
        );

        alvos.forEach(function (el) { observador.observe(el); });

        // A partir daqui o script assumiu o controle e o timer de
        // segurança do <head> não precisa mais derrubar a classe .js
        window.__revelacaoAtiva = true;

        // Última rede: o que continuar invisível dentro da tela aparece
        window.setTimeout(function () {
            alvos.forEach(function (el) {
                if (el.classList.contains("visivel")) return;
                var r = el.getBoundingClientRect();
                if (r.top < window.innerHeight && r.bottom > 0) {
                    el.classList.add("visivel");
                }
            });
        }, 2500);
    }

    /* ========================================================
       8. ANIMAÇÕES DECORATIVAS (GSAP)
       Nada aqui controla se um conteúdo existe ou não.
       ======================================================== */

    function iniciarAnimacoes() {
        if (!temGsap) return;

        gsap.registerPlugin(ScrollTrigger);

        var tituloNome = document.querySelector("[data-split]");
        var letras = quebrarEmLetras(tituloNome);

        // --- Entrada do header ---
        var entrada = gsap.timeline({ defaults: { ease: "power3.out" } });

        entrada.from(".hello", { y: 30, opacity: 0, duration: 0.6 });

        if (letras.length) {
            entrada.from(
                letras,
                { y: 60, opacity: 0, duration: 0.7, stagger: 0.035 },
                "-=0.3"
            );
        }

        entrada.from(".cargo, .tagline", { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.4");
        entrada.from("header .bt > *", { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.3");
        entrada.from("header .foto", { x: 60, opacity: 0, duration: 0.9 }, "-=0.9");

        // --- Foguete: sobe e volta dentro do próprio bloco ---
        gsap.to(".caixa", {
            y: -14,
            x: 10,
            rotation: 12,
            duration: 1.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // --- Logos do rodapé ---
        gsap.to(".last-logo", {
            y: 18,
            duration: 1.6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // --- Parallax suave nas imagens dos projetos ---
        // Só mexe em transform, nunca em opacity: não pode esconder nada.
        gsap.utils.toArray(".card-proj .img-link img").forEach(function (img) {
            gsap.to(img, {
                yPercent: -6,
                ease: "none",
                scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: 0.8 }
            });
        });

        // --- Tilt 3D nos cards de skill ---
        iniciarTilt();

        // --- Botões magnéticos ---
        iniciarMagnetico();

        // O parallax é a única coisa aqui que usa ScrollTrigger, e ele só
        // mexe em transform. Mesmo se falhar, nada some da tela.
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
        }
        window.addEventListener("load", function () { ScrollTrigger.refresh(); });
    }

    /* ========================================================
       8. TILT — o card acompanha levemente o cursor
       ======================================================== */
    function iniciarTilt() {
        if (!window.matchMedia("(hover: hover)").matches) return;

        var cards = document.querySelectorAll(
            ".card-skill-f, .card-skill-b, .card-skill-d, .card-skill-o"
        );

        cards.forEach(function (card) {
            card.addEventListener("mousemove", function (e) {
                var r = card.getBoundingClientRect();
                var px = (e.clientX - r.left) / r.width - 0.5;
                var py = (e.clientY - r.top) / r.height - 0.5;

                gsap.to(card, {
                    rotationY: px * 14,
                    rotationX: -py * 14,
                    transformPerspective: 700,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });

            card.addEventListener("mouseleave", function () {
                gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "power2.out" });
            });
        });
    }

    /* ========================================================
       9. BOTÕES MAGNÉTICOS
       ======================================================== */
    function iniciarMagnetico() {
        if (!window.matchMedia("(hover: hover)").matches) return;

        var botoes = document.querySelectorAll(".bt .mail, .bt .cv, .card-proj .links a");

        botoes.forEach(function (btn) {
            btn.addEventListener("mousemove", function (e) {
                var r = btn.getBoundingClientRect();
                gsap.to(btn, {
                    x: (e.clientX - r.left - r.width / 2) * 0.25,
                    y: (e.clientY - r.top - r.height / 2) * 0.35,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });

            btn.addEventListener("mouseleave", function () {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
            });
        });
    }

    /* ========================================================
       BOOT
       ======================================================== */
    function iniciar() {
        iniciarPreloader();
        atualizarAno();
        iniciarLightbox();
        iniciarNavAtiva();

        if (reduzido) {
            // Movimento reduzido: nada de entrada por scroll. Marca todo
            // mundo como visível e confirma que assumimos o controle,
            // para o timer de segurança do <head> não precisar agir.
            document.querySelectorAll(".reveal").forEach(function (el) {
                el.classList.add("visivel");
            });
            window.__revelacaoAtiva = true;
            return;
        }

        iniciarRevelacao();
        iniciarProgresso();
        iniciarAnimacoes();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();
