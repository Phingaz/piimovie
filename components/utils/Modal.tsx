'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnClickOutside = true,
  closeOnEsc = true,
  className = '',
}: ModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  useEffect(() => {
    if (isOpen && !isMounted) {
      setIsMounted(true);
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen, isMounted]);

  useEffect(() => {
    if (isMounted) {
      const timer = setTimeout(() => {
        setIsVisible(isOpen);
      }, 10);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isMounted, isOpen]);

  useEffect(() => {
    if (!isOpen && isMounted) {
      const timer = setTimeout(() => {
        setIsMounted(false);
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isOpen, isMounted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEsc && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, closeOnEsc]);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return undefined;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (firstElement) {
      firstElement.focus();
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isMounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-300 ease-in-out`}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black cursor-pointer ${
          isVisible ? 'opacity-80' : 'opacity-0'
        } transition-opacity duration-300 ease-in-out`}
        aria-hidden="true"
      ></div>

      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} bg-gray-800 rounded-lg shadow-xl transform ${
          isVisible ? 'scale-100' : 'scale-95'
        } transition-transform duration-300 ease-in-out ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        <button
          type="button"
          className="p-1 cursor-pointer bg-gray-700 text-gray-200 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 absolute z-1 top-2 right-2"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
