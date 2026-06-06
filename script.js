$('.banner').slick({
  dots: true,
  infinite: true,
  speed: 900,
  slidesToShow: 1,
  autoplay: true,
  autoplaySpeed: 0,
  adaptiveHeight: false,
  fade: true,
  pauseOnHover: false,
  pauseOnFocus: false
});

gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray('.reveal, .heading, .section-heading').forEach((element) => {
  gsap.from(element, {
    y: 44,
    opacity: 0,
    duration: 0.9,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 84%'
    }
  });
});

document.querySelectorAll('[data-amount]').forEach((button) => {
  button.addEventListener('click', () => {
    const panel = button.closest('.donation-panel');
    const input = panel ? panel.querySelector('input[type="number"]') : document.getElementById('amount');

    if (input) {
      input.value = button.dataset.amount;
    }

    if (panel) {
      panel.querySelectorAll('[data-amount]').forEach((item) => item.classList.remove('active'));
    }

    button.classList.add('active');
  });
});

const drawer = document.querySelector('.mobile-drawer');
const drawerBackdrop = document.querySelector('.drawer-backdrop');
const menuToggle = document.querySelector('.menu-toggle');
const drawerLinks = gsap.utils.toArray('.drawer-nav a, .drawer-card');
let drawerOpen = false;

const drawerTimeline = gsap.timeline({
  paused: true,
  defaults: { ease: 'power3.out' }
});

drawerTimeline
  .to(drawerBackdrop, { autoAlpha: 1, duration: 0.25 })
  .to(drawer, { xPercent: 0, duration: 0.55 }, '<')
  .from(drawerLinks, { x: 34, opacity: 0, stagger: 0.06, duration: 0.35 }, '-=0.2');

function openDrawer() {
  if (!drawer || drawerOpen) {
    return;
  }

  drawerOpen = true;
  document.body.classList.add('drawer-is-open');
  drawer.setAttribute('aria-hidden', 'false');
  menuToggle.setAttribute('aria-expanded', 'true');
  drawerTimeline.play();
}

function closeDrawer() {
  if (!drawer || !drawerOpen) {
    return;
  }

  drawerOpen = false;
  document.body.classList.remove('drawer-is-open');
  drawer.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');
  drawerTimeline.reverse();
}

if (menuToggle) {
  menuToggle.addEventListener('click', openDrawer);
}

document.querySelectorAll('[data-close-drawer]').forEach((item) => {
  item.addEventListener('click', closeDrawer);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeDrawer();
  }
});

function buildUpiUrl(amount) {
  const safeAmount = Math.max(Number(amount) || 100, 1).toFixed(2);
  return `upi://pay?pa=8586042076@upi&pn=HelpingHand&am=${safeAmount}&cu=INR&tn=Thank%20you%20for%20supporting%20our%20cause`;
}

function getDonationAmount(source) {
  const panel = source && source.closest ? source.closest('.donation-panel') : null;
  const panelInput = panel ? panel.querySelector('input[type="number"]') : null;
  const filledInput = Array.from(document.querySelectorAll('.donation-panel input[type="number"]')).find((input) => input.value);
  return (panelInput && panelInput.value) || (filledInput && filledInput.value) || 100;
}

function donate(source) {
  window.location.href = buildUpiUrl(getDonationAmount(source));
}

window.donate = donate;
