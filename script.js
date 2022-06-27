let controller;
let slideScene;
let Pagescene;

function animateSlide() {
    controller = new ScrollMagic.Controller();

    const sliders = document.querySelectorAll('.slide');
    const nav = document.querySelector(".nav-header");
    sliders.forEach((slide, index, slides) => {
        const revealImg = slide.querySelector(".reveal-img");
        const img = slide.querySelector("img");
        const revealText = slide.querySelector(".reveal-text");
        
      
        var slideT1 = gsap.timeline({
          defaults: { duration: 1, ease: "power2.inOut" }
        });
        slideT1.fromTo(revealImg, {x: "0%"}, {x: "100%"})
        slideT1.fromTo(img, {scale: 2}, {x: 1}, "-=1")
        slideT1.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
        slideT1.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.5");
      
      new ScrollMagic.Scene({
        triggerElement: slide,
        triggerHook: 0.5,
        reverse: false
      })
        .setTween(slideT1)
        .addIndicators({
          colorStart: "white",
          colorTrigger: "white",
          name: "slide",
        })
        .addTo(controller);
      
      const pageTl = gsap.timeline();
      const nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
      pageTl.fromTo(nextSlide, {y: "0%"}, {y: "50%"})
      pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
      pageTl.fromTo(nextSlide, {y: "50%"}, {y: "0%"}, "-=0.5")
      
      Pagescene = new ScrollMagic.Scene({
        triggerElement: slide,
        triggerHook: 0,
        duration: "100%",
      })
        .addIndicators({
          colorStart: "white",
          colorTrigger: "white",
          name: "page",
          indent: 100,
        })
        .setPin(slide, {pushFollowers: false})
        .setTween(pageTl)
        .addTo(controller);
      
    })
}

const mouse = document.querySelector('.cursor');
const TapBtn = mouse.querySelector("span");
const burger = document.querySelector(".burger");

window.addEventListener('mousemove', cursor)
window.addEventListener("mouseover", activeCursor);
burger.addEventListener("click", navToggle);


function navToggle(e) {
  gsap.to(".line1", 0.5, { rotate: "45", y: "5", background: "black" });
  gsap.to(".line2", 0.5, { rotate: "-45", y: "-5", background: "black" });
  gsap.to("#logo", 0.5, { color: "black"} );
  gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%)" });
  document.body.style.overflow = "hidden"
}

function cursor(e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}

function activeCursor(e) {
  const item = e.target;
  if (item.id === "logo" || item.classList.contains('burger')) {
    mouse.classList.add('nav-active');  
  } else {
    mouse.classList.remove('nav-active');
  }
  if (item.classList.contains('explore')) {
    mouse.classList.add('explore-active');
    gsap.to('.title-swipe', 1, {y: "0%"})
    TapBtn.innerText = "Tap";
  } else {
    mouse.classList.remove('explore-active')
    TapBtn.innerText = "";
    gsap.to('.title-swipe', 1, {y: "100%"})
  }
}


barba.init({
  views: [
    {
      namespace: 'home',
      beforeEnter() {
        animateSlide();
      },
      beforeLeave() {
        controller.destroy();
        slideScene.destroy();
        Pagescene.destroy();
      }
    },
    {
      namespace: 'fashion'
    }
  ], 
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } })
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0, oncomplete: done });
      },
      enter({ current, next }) {
        let done = this.async();
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(
          next.container,
          1,
          { opacity: 0 },
          { opacity: 1, oncomplete: done }
        );
      }
    }
  ] 
});

