export function slugify(text: string) {
  if (!text) return "";
  
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '') // Remove everything except letters, numbers, spaces, and hyphens
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function extractHeadings(content: string) {
  const headings: { id: string; text: string; level: number }[] = [];
  if (!content) return headings;

  // More flexible regex for all heading levels
  const regex = /<h([2-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const rawText = match[3];
    const cleanText = rawText.replace(/<[^>]*>/g, "").trim();
    const id = slugify(cleanText);
    
    if (id) {
      headings.push({ id, text: cleanText, level });
    }
  }
  
  return headings;
}
