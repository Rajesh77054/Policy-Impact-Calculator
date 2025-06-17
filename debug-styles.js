// Debug script to inspect computed styles
const cards = document.querySelectorAll('.hero-glass-card');
cards.forEach((card, index) => {
  const computedStyle = window.getComputedStyle(card);
  console.log(`Card ${index}:`, {
    background: computedStyle.background,
    backgroundColor: computedStyle.backgroundColor,
    backdropFilter: computedStyle.backdropFilter,
    className: card.className
  });
});