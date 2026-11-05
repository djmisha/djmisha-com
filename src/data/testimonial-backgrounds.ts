const testimonialImageCount = 9;

export const testimonialBackgroundImages = Array.from(
  { length: testimonialImageCount },
  (_, index) => `/images/wedding-page/testimonial-${index + 1}.webp`,
);
