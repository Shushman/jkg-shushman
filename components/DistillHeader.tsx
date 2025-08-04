import React from 'react';

interface DistillHeaderProps {
  title: string;
  authors: Array<{
    name: string;
    url?: string;
    affiliation?: string;
  }>;
  publishDate?: string;
  description?: string;
}

export default function DistillHeader({ title, authors, publishDate, description }: DistillHeaderProps) {
  return (
    <header className="w-full mb-0">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 leading-tight text-gray-900 tracking-tight">
            {title}
          </h1>
          
          {description && (
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              {description}
            </p>
          )}
          
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-8">
              {authors.map((author, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  {author.url ? (
                    <a 
                      href={author.url} 
                      className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {author.name}
                    </a>
                  ) : (
                    <span className="text-lg font-medium text-blue-600">{author.name}</span>
                  )}
                  {author.affiliation && (
                    <span className="text-sm text-gray-500 mt-1">{author.affiliation}</span>
                  )}
                </div>
              ))}
            </div>
            
            {publishDate && (
              <div className="text-sm text-gray-500">
                <time>{publishDate}</time>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}