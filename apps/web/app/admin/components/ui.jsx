"use client";

import { useState } from 'react';
import Link from 'next/link';

/**
 * Admin UI Components
 * 
 * This file contains reusable UI components for the admin interface
 * to ensure consistent styling across all admin pages.
 */

// Status badge with appropriate colors
export function StatusBadge({ status, type = 'status' }) {
  const normalizedStatus = status?.toLowerCase() || '';
  
  // Colors for different status types
  const colors = {
    // Ticket statuses
    'new': 'bg-blue-100 text-blue-800',
    'open': 'bg-cyan-100 text-cyan-800',
    'in_progress': 'bg-indigo-100 text-indigo-800',
    'on_hold': 'bg-yellow-100 text-yellow-800',
    'resolved': 'bg-green-100 text-green-800',
    'closed': 'bg-gray-100 text-gray-800',
    'canceled': 'bg-red-100 text-red-800',
    'cancelled': 'bg-red-100 text-red-800',
    
    // Payment/invoice statuses
    'paid': 'bg-green-100 text-green-800',
    'unpaid': 'bg-red-100 text-red-800',
    'overdue': 'bg-orange-100 text-orange-800',
    'draft': 'bg-gray-100 text-gray-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'refunded': 'bg-purple-100 text-purple-800',
    
    // Priority levels
    'low': 'bg-blue-50 text-blue-700',
    'medium': 'bg-yellow-50 text-yellow-700',
    'high': 'bg-orange-100 text-orange-800',
    'urgent': 'bg-red-100 text-red-800',
    
    // Ticket types
    'remote': 'bg-violet-100 text-violet-800',
    'onsite': 'bg-emerald-100 text-emerald-800',
    'webdev': 'bg-sky-100 text-sky-800',
    
    // Payment methods
    'credit card': 'bg-purple-100 text-purple-800',
    'upi': 'bg-blue-100 text-blue-800',
    'cash': 'bg-green-100 text-green-800',
    'bank transfer': 'bg-indigo-100 text-indigo-800',
    
    // SLA status
    'on track': 'bg-green-100 text-green-800',
    'at risk': 'bg-yellow-100 text-yellow-800',
    'sla breached': 'bg-red-100 text-red-800',
    
    // Default
    'default': 'bg-gray-100 text-gray-800',
  };
  
  const colorClass = colors[normalizedStatus] || colors['default'];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
}

// Card component with consistent styling
export function Card({
  children,
  title,
  className = '',
  padding = true,
  footer = null,
  onClick,
  role,
  tabIndex,
  ...rest
}) {
  const clickable = typeof onClick === 'function';

  const handleKeyDown = (event) => {
    if (!clickable) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(event);
    }
  };

  const combinedClassName = [
    'bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden',
    clickable ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={combinedClassName}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={role ?? (clickable ? 'button' : undefined)}
      tabIndex={tabIndex ?? (clickable ? 0 : undefined)}
      {...rest}
    >
      {title && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className={padding ? 'p-4' : ''}>
        {children}
      </div>
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
}

// Button component with different variants
export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  type = 'button',
  className = '',
  icon = null,
  disabled = false,
  fullWidth = false
}) {
  // Button variants
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
    info: 'bg-cyan-500 hover:bg-cyan-600 text-white focus:ring-cyan-500',
    link: 'text-blue-600 hover:text-blue-800 hover:underline',
  };
  
  // Button sizes
  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };
  
  return (
    <button
      type={type}
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 
        transition-colors duration-200 ease-in-out
        flex items-center justify-center
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}

// Simple select component used for filters
export function Select({ 
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select',
  className = '',
  name,
  id,
  disabled = false
}) {
  const wrapperClass = ['flex flex-col space-y-1 text-sm text-gray-700', className]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={wrapperClass}>
      {label ? <span className="font-medium">{label}</span> : null}
      <select
        name={name}
        id={id}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        {placeholder === null ? null : <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

// Form input component
export function FormInput({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  className = '',
  error = '',
  id = '',
  name = '',
  disabled = false
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={id}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full px-3 py-2 bg-white border ${error ? 'border-red-300' : 'border-gray-300'} 
          rounded-md shadow-sm focus:outline-none focus:ring-2 
          ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'}
          disabled:bg-gray-100 disabled:text-gray-500
        `}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Form select component
export function FormSelect({ 
  label, 
  value, 
  onChange, 
  options = [], 
  required = false,
  className = '',
  error = '',
  id = '',
  name = '',
  disabled = false,
  placeholder = 'Select an option'
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={id}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`
          w-full px-3 py-2 bg-white border ${error ? 'border-red-300' : 'border-gray-300'} 
          rounded-md shadow-sm focus:outline-none focus:ring-2 
          ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'}
          disabled:bg-gray-100 disabled:text-gray-500
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={typeof option === 'object' ? option.value : option}>
            {typeof option === 'object' ? option.label : option}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Form textarea component
export function FormTextarea({ 
  label, 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  className = '',
  error = '',
  id = '',
  name = '',
  disabled = false,
  rows = 4
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={id}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`
          w-full px-3 py-2 bg-white border ${error ? 'border-red-300' : 'border-gray-300'} 
          rounded-md shadow-sm focus:outline-none focus:ring-2 
          ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'}
          disabled:bg-gray-100 disabled:text-gray-500
        `}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Data table component
export function DataTable({ 
  columns = [], 
  data = [], 
  loading = false,
  emptyMessage = 'No data available'
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={column.width ? { width: column.width } : {}}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Filter panel component
export function FilterPanel({ children, onApply, onReset }) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <Card className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="text-gray-400 hover:text-gray-600"
        >
          {isExpanded ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          )}
        </button>
      </div>
      
      {isExpanded && (
        <>
          <div className="space-y-4">
            {children}
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button 
              variant="primary" 
              onClick={onApply}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
              }
            >
              Apply Filters
            </Button>
            <Button 
              variant="secondary" 
              onClick={onReset}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              }
            >
              Reset
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}

// Page header component
export function PageHeader({ 
  title, 
  description = '',
  actions = []
}) {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            {actions.map((action, index) => (
              <div key={index}>
                {action}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Empty state component
export function EmptyState({ 
  title = 'No data available', 
  description = 'There are no items to display at this time.',
  icon = null,
  action = null
}) {
  return (
    <div className="text-center py-12 px-4 bg-white rounded-lg border border-gray-200">
      {icon && (
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// Tabs component
export function Tabs({ 
  tabs = [], 
  activeTab, 
  onChange 
}) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

// Loading spinner
export function LoadingSpinner({ size = 'md', color = 'blue' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  const colors = {
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    green: 'border-green-600',
    red: 'border-red-600',
  };
  
  return (
    <div className="flex justify-center p-4">
      <div className={`animate-spin rounded-full ${sizes[size]} border-t-2 border-b-2 ${colors[color]}`}></div>
    </div>
  );
}

// Message component for chats/comments
export function Message({ 
  content, 
  sender, 
  timestamp, 
  isInternal = false, 
  avatar = null 
}) {
  return (
    <div className={`p-4 rounded-lg mb-4 ${isInternal ? 'bg-yellow-50 border border-yellow-200' : 'bg-white border border-gray-200'}`}>
      <div className="flex items-start">
        {avatar ? (
          <div className="mr-3">{avatar}</div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-gray-600 font-medium">
            {sender?.email?.charAt(0)?.toUpperCase() || '?'}
          </div>
        )}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-gray-900">{sender?.email || 'Unknown'}</span>
            <span className="text-xs text-gray-500">
              {typeof timestamp === 'string' ? new Date(timestamp).toLocaleString() : timestamp}
            </span>
          </div>
          <div className="text-gray-700 whitespace-pre-line">{content}</div>
        </div>
      </div>
    </div>
  );
}

// Kanban column component
export function KanbanColumn({ title, children, count = 0 }) {
  return (
    <div className="flex flex-col bg-gray-50 rounded-lg p-2 min-w-[280px]">
      <div className="flex items-center justify-between px-2 py-2 mb-2">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-800">
          {count}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

// Kanban card component
export function KanbanCard({ 
  title, 
  code,
  priority,
  children,
  badges = [],
  onClick,
  actions = [],
  className = ''
}) {
  return (
    <div 
      className={`bg-white p-3 rounded-lg shadow-sm border border-gray-200 mb-2 cursor-pointer hover:shadow-md transition-shadow ${className}`.trim()}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="font-medium text-gray-900">{code}</span>
        <div className="flex gap-1">
          {badges.map((badge, index) => (
            <div key={index}>{badge}</div>
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-700 mb-3">{title}</p>
      {children}
      
      {actions.length > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-100 flex gap-2">
          {actions.map((action, index) => (
            <div 
              key={index} 
              onClick={(e) => {
                e.stopPropagation();
                if (action.onClick) action.onClick();
              }}
            >
              {action.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Confirmation dialog component
export function ConfirmDialog({
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'warning'
}) {
  // Variants for different types of confirmation (warning, danger, info)
  const variants = {
    warning: {
      icon: (
        <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    },
    danger: {
      icon: (
        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
    info: {
      icon: (
        <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    }
  };
  
  const selectedVariant = variants[variant] || variants.warning;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                {selectedVariant.icon}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${selectedVariant.confirmButton} focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FormCheckbox({
  label,
  checked,
  onChange,
  description = '',
  className = '',
  id,
  name,
  disabled = false,
}) {
  const inputId = id || name || `checkbox-${Math.random().toString(36).slice(2)}`;

  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={inputId}
          name={name}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={inputId} className={`font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
          {label}
        </label>
        {description && (
          <p className="text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
}

export function Pagination({ totalPages = 1, currentPage = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
          currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
        }`}
      >
        <span className="sr-only">Previous</span>
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M12.707 14.707a1 1 0 01-1.414 0L7.586 11l3.707-3.707a1 1 0 10-1.414-1.414l-4.414 4.414a1 1 0 000 1.414l4.414 4.414a1 1 0 001.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            currentPage === pageNumber
              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
          }`}
        >
          {pageNumber}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
          currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
        }`}
      >
        <span className="sr-only">Next</span>
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M7.293 5.293a1 1 0 011.414 0L13.414 10l-4.707 4.707a1 1 0 01-1.414-1.414L10.586 10 7.293 6.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </nav>
  );
}
export const TextField = FormInput;



