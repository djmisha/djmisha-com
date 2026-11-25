(function () {
  function shuffleChildren(parent) {
    const children = Array.from(parent.children);
    for (let index = children.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      parent.appendChild(children[randomIndex]);
      children.splice(randomIndex, 1, children[index]);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('ngg-gallery-sidebar');
    if (container) {
      const items = container.querySelectorAll('.sidebar-gallery-item');
      const toShow =
        parseInt(container.getAttribute('data-thumbs-to-show'), 10) || 12;

      const indices = Array.from({ length: items.length }, (_, index) => index);
      for (let index = indices.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [indices[index], indices[randomIndex]] = [
          indices[randomIndex],
          indices[index],
        ];
      }

      for (
        let index = 0;
        index < toShow && index < indices.length;
        index += 1
      ) {
        const item = items[indices[index]];
        item.classList.add('is-visible');
        const thumb = item.querySelector('.sidebar-gallery-thumb');
        const background = thumb?.getAttribute('data-bg');
        if (thumb && background) {
          thumb.style.backgroundImage = `url(${background})`;
        }
      }
    }

    const blogCards = document.getElementById('sidebar-blog-cards');
    if (blogCards) shuffleChildren(blogCards);
  });
})();
