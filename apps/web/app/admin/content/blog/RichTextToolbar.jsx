"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '../../components/ui';

export default function RichTextToolbar({ onAction, className = '' }) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const linkInputRef = useRef(null);
  
  useEffect(() => {
    if (showLinkInput && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [showLinkInput]);

  const handleInsertLink = () => {
    if (linkUrl.trim()) {
      onAction('link', linkUrl.trim());
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInsertLink();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowLinkInput(false);
      setLinkUrl('');
    }
  };

  return (
    <div className={`border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap items-center gap-1 ${className}`}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onAction('heading', 'h2')}
        title="Heading 2"
      >
        <span className="font-bold">H2</span>
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onAction('heading', 'h3')}
        title="Heading 3"
      >
        <span className="font-bold">H3</span>
      </Button>
      
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onAction('format', 'bold')}
        title="Bold"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onAction('format', 'italic')}
        title="Italic"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
        </svg>
      </Button>
      
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onAction('list', 'bullet')}
        title="Bullet List"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onAction('list', 'number')}
        title="Numbered List"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </Button>
      
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setShowLinkInput(!showLinkInput)}
        title="Insert Link"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
        </svg>
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onAction('image')}
        title="Insert Image"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onAction('codeblock')}
        title="Insert Code Block"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
        </svg>
      </Button>
      
      {showLinkInput && (
        <div className="flex items-center ml-2 mt-1 w-full">
          <input
            ref={linkInputRef}
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter URL"
            className="rounded-l-md border border-gray-300 px-3 py-1 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm flex-1"
          />
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleInsertLink}
            className="rounded-l-none rounded-r-md"
          >
            Insert
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowLinkInput(false);
              setLinkUrl('');
            }}
            className="ml-1"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}