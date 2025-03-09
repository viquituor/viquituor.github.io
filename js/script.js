
// Animação do título "DESENVOLVEDOR FRONT-END JUNIOR"
document.addEventListener("DOMContentLoaded", () => {

    gsap.registerPlugin(ScrollTrigger);


    gsap.to(".caixa", {
        y: -350,
        x:  350,
        duration: 5,
        repeat: -1, // Repetição infinita
        yoyo: true, // Volta para a posição original
        ease: "power1.inOut" // Suavização do movimento
    });

    gsap.to(".last-logo", {
        y: -80,
        duration: 3,
        repeat: -1, // Repetição infinita
        yoyo: true, // Volta para a posição original
        ease: "power5.inOut" // Suavização do movimento
    });
    

    gsap.from(".card", {
        opacity: 0,
        y: -100, // Move para cima no início (vindo de baixo)
        duration: 3, // Duração mais curta para uma animação mais suave
        stagger: 2, // Atraso entre cada animação
        immediateRender: false,
        scrollTrigger: {
            trigger: ".card", // Elemento que ativa a animação
            start: "top 90%", 
            end: "bottom top" ,// Começa quando o topo do elemento atinge 80% da tela
            toggleActions: "play reset play reset", // Animação roda apenas uma vez
            markers: false, // Desative os marcadores para produção
        }
    });

    gsap.from(".card-exp", {
        opacity: 0,
        y: -400, // Move para cima no início (vindo de baixo)
        duration: 3, // Duração mais curta para uma animação mais suave
        stagger: 2, // Atraso entre cada animação
        immediateRender: false,
        scrollTrigger: {
            trigger: ".card-exp", // Elemento que ativa a animação
            start: "top 90%", 
            end: "bottom top" ,// Começa quando o topo do elemento atinge 80% da tela
            toggleActions: "play reset play reset", // Animação roda apenas uma vez
            markers: false, // Desative os marcadores para produção
        }
    });

    
    gsap.to(".card", {
        y: 13, // Move o elemento 50px para cima
        duration: 1, // Duração da animação (1 segundo)
        repeat: -1, // Repete infinitamente
        yoyo: true, // Faz a animação ir e voltar
        ease: "power1.inOut", // Efeito de easing suave
      
    });
});