const testimonials = document.querySelectorAll('.home-testi');

if (testimonials.length > 0) {
  const showTestimonial = (event) => {
    event.target.classList.toggle('testi-partial');
    event.target.classList.toggle('testi-full');
  };

  for (let index = testimonials.length - 1; index >= 0; index -= 1) {
    testimonials[index].classList.add('testi-partial');
    testimonials[index].addEventListener('click', showTestimonial);
  }
}
