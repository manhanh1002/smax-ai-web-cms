document.addEventListener('DOMContentLoaded', () => {
  // Dynamically get the current origin and append /vi
  const strictBaseUrl = `${window.location.origin}/vi`;

  // Find all <a> tags
  const navLinks = document.querySelectorAll('a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');

    // Only update local relative paths
    if (href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith('http')) {
      const cleanPath = href.replace(/^\//, '');
      link.href = `${strictBaseUrl}/${cleanPath}`;
    }
  });
});

