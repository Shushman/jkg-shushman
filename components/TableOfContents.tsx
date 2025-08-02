import React, { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from the document
    const headings = document.querySelectorAll('h2, h3');
    const items: TocItem[] = [];

    headings.forEach((heading, index) => {
      // Create a slug from the heading text
      const text = heading.textContent || '';
      const slug = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .trim();
      
      const id = slug || `heading-${index}`;
      if (!heading.id) {
        heading.id = id;
      }
      
      items.push({
        id,
        text,
        level: parseInt(heading.tagName.charAt(1))
      });
    });

    setTocItems(items);

    // Set up intersection observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0
      }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Contents
        </div>
      </div>
      <div className="p-2">
        <ul>
          {tocItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToHeading(item.id)}
                className={`block w-full text-left py-0.5 px-2 text-sm rounded transition-colors duration-200 ${
                  item.level === 3 ? 'ml-3 text-xs' : ''
                } ${
                  activeId === item.id
                    ? 'text-blue-600 font-medium bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}