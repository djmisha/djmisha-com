const testimonialImageCount = 23;

export const testimonialBackgroundImages = Array.from(
  { length: testimonialImageCount },
  (_, index) => `/images/wedding-page/testimonial-${index + 1}.webp`,
);
