"use client";

/**
 * Unread badge component - WhatsApp-style
 * Shows a red dot or count badge for unread conversations
 */
export default function UnreadBadge({ count, className = "" }) {
  if (!count) return null;
  
  const badgeClass = `inline-flex items-center justify-center ${
    count > 9 ? 'min-w-5 px-1.5' : 'h-5 w-5'
  } rounded-full bg-red-500 text-xs font-medium text-white ${className}`;
  
  return (
    <span className={badgeClass}>
      {count > 99 ? '99+' : count > 0 ? count : ''}
    </span>
  );
}

/**
 * Simple unread dot indicator (no count)
 */
export function UnreadDot({ className = "" }) {
  return (
    <span 
      className={`inline-block h-3 w-3 rounded-full bg-red-500 ${className}`} 
      aria-hidden="true" 
    />
  );
}

/**
 * Highlighted item wrapper - adds a pulsing effect for new items
 */
export function HighlightWrapper({ isHighlighted, children, className = "" }) {
  return (
    <div 
      className={`transition-all duration-300 ${
        isHighlighted 
          ? 'ring-2 ring-blue-400 ring-offset-2 shadow-lg animate-pulse-once' 
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}