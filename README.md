# viquituor.github.io

Portfólio pessoal de **Paulo Victor Almeida de Oliveira** — desenvolvedor full stack.

🔗 **https://viquituor.github.io/**

## Stack

HTML, CSS e JavaScript puros. Sem build, sem framework, sem dependência de pacote.
A única biblioteca externa é o [GSAP](https://gsap.com/) (via CDN), usado apenas para
animação decorativa.

## Estrutura

```
index.html          página única
css/
  PRE-NAV.css       tokens de cor, reset, navegação, revelação no scroll, lightbox
  PRELOAD.css       preloader
  HEADER.css        topo e botões
  SOBRE.css         seção sobre mim
  EXPERIENCIAS.css  experiências profissionais
  SKILLS.css        tecnologias por domínio
  PROJETOS.css      cards de projeto
  FORMACAO.css      formação acadêmica
  CONTATOS.css      rodapé e contato
js/script.js        preloader, revelação, lightbox, nav ativa e animações
img/                imagens em WebP com fallback JPG, e o vídeo de demonstração
doc/
  curriculo-paulo-victor.pdf   currículo (1 página, A4)
  curriculo-fonte.html         fonte do currículo — edite e reimprima
```

## Decisões de implementação

**O conteúdo nunca depende do JavaScript.** As animações de entrada são ativadas por
uma classe `js` no `<html>`, adicionada por um script inline. Se esse script não rodar,
ou se `js/script.js` falhar em carregar, um timer derruba a classe e tudo aparece
normalmente. Nenhum cenário de falha resulta em página em branco.

**A revelação no scroll usa `IntersectionObserver`, não o ScrollTrigger do GSAP.**
O ScrollTrigger calcula posições em pixels e precisa de `refresh()` sempre que uma
fonte ou imagem muda a altura da página — quando esse recálculo não acontece, o
conteúdo some para sempre. O `IntersectionObserver` pergunta ao navegador se o
elemento está na tela e não tem esse modo de falha. O GSAP cuida só do que é
decorativo: entrada do topo, foguete, parallax, tilt e botões magnéticos.

**Acessibilidade.** Contrastes conferidos contra o WCAG AA, hierarquia de headings
correta, `:focus-visible` em tudo que é interativo, skip link, cards de skill
acessíveis por teclado e por toque, e todas as animações desligadas em
`prefers-reduced-motion`.

**Performance.** Imagens em WebP com fallback JPG, `loading="lazy"` e dimensões
declaradas para evitar layout shift. O vídeo carrega só sob demanda, com poster.

## Rodando localmente

Qualquer servidor estático serve:

```bash
npx http-server . -p 4173 -c-1
```

## Regerando o currículo

O PDF é gerado a partir de `doc/curriculo-fonte.html`. Edite o HTML e reimprima:

```bash
chrome --headless=new --no-pdf-header-footer --print-to-pdf=doc/curriculo-paulo-victor.pdf doc/curriculo-fonte.html
```

O layout está calibrado para caber em uma página A4: o conteúdo ocupa 274,2 mm dos
275 mm úteis — a folga é de menos de 1 mm, então qualquer linha nova exige cortar
outra coisa.
