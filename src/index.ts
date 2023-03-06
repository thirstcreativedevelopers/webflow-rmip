import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';
import Splitting from 'splitting';

/* Prevent scroling when menu is open */

const navButton = document.querySelector('.w-nav-button');

navButton.addEventListener('click', function () {
  if (navButton.classList.contains('w--open')) {
    document.body.style.overflow = 'auto';
  } else {
    document.body.style.overflow = 'hidden';
  }
});

/* Splitting JS */

Splitting();

const options = {
  //el: document.querySelector(".locomotive-scroll"),
  el: document.querySelector('[data-scroll-container]'),
  smooth: true,
  getSpeed: true,
  getDirection: true,
  reloadOnContextChange: true,
};

/*$('.locomotive-scroll').imagesLoaded( function() {
  // images have loaded
  setTimeout(() => {  
      locoScroll.update();
      console.log('redraw completed');
    }, 2000);
}); */

const header = document.getElementById('header');

Webflow.push(function () {
  // check is the CMS editor is there
  if (Webflow.env('editor') != true) {
    // code here

    const scroller = new LocomotiveScroll(options);

    gsap.registerPlugin(ScrollTrigger);
    scroller.on('scroll', ScrollTrigger.update);

    ScrollTrigger.scrollerProxy('.locomotive-scroll', {
      scrollTop(value) {
        return arguments.length
          ? scroller.scrollTo(value, 0, 0)
          : scroller.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          left: 0,
          top: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    /* Hero image animation - disabled for touch devices */

    const mm = gsap.matchMedia();

    mm.add('(min-width: 992px)', () => {
      ScrollTrigger.create({
        trigger: '.hero-image',
        scroller: '.locomotive-scroll',
        start: 'top+=0% 30%',
        end: 'bottom-=40% 50%',
        //animation: gsap.to('.hero-image', {backgroundSize: '80%'}),
        animation: gsap.to('.hero-image', { width: '80vw' }),
        scrub: 2,
        // markers: true
      });
    });

    ScrollTrigger.addEventListener('refresh', () => scroller.update());

    ScrollTrigger.refresh();

    /* Add class to header so we know when the user has begun to scroll */

    if (window.innerWidth >= 768) {
      scroller.on('scroll', (args) => {
        // Get all current elements : args.currentElements

        if (typeof args.currentElements['trigger'] === 'object') {
          const { progress } = args.currentElements['trigger'];
          if (progress > 0.2) {
            $('#header').addClass('scrolled');
          } else {
            $('#header').removeClass('scrolled');
          }
        }
      });
    }

    setTimeout(() => {
      scroller.update();
      //console.log('updated');
    }, 4000);
  }
});
