
// Animação do título "DESENVOLVEDOR FRONT-END JUNIOR"
document.addEventListener("DOMContentLoaded", () => {

    gsap.registerPlugin(ScrollTrigger);



    gsap.to(".caixa", {
        y: -1000, // Move 300px para a direita
        x:  1000,
        duration: 10,
        repeat: -1, // Repetição infinita
        yoyo: false, // Volta para a posição original
        ease: "power1.inOut" // Suavização do movimento
    });
    


    gsap.from(".card", {
        opacity: 0,
        y: -100, // Move para cima no início (vindo de baixo)
        duration: 3, // Duração mais curta para uma animação mais suave
        scrollTrigger: {
            trigger: ".card", // Elemento que ativa a animação
            start: "top 80%", // Começa quando o topo do elemento atinge 80% da tela
            toggleActions: "play none none none", // Animação roda apenas uma vez
            markers: false, // Desative os marcadores para produção
        }
    });

});