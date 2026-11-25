export function initializeSiteCta() {
  const contactCta = document.querySelector('.lets-chat');
  if (!contactCta) return;

  const onScroll = () => {
    if (window.scrollY <= 1200) return;
    contactCta.classList.add('fly-out');
    window.removeEventListener('scroll', onScroll);
  };

  window.addEventListener('scroll', onScroll);
  window.setInterval(() => {
    contactCta.classList.toggle('hello-shake');
  }, 60000);
}
