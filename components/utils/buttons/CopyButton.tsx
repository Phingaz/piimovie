'use client';
import { Check, Copy } from 'lucide-react';
import React, { useState } from 'react';

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <button
      aria-label="Copy magnet link"
      onClick={() => copyToClipboard(text)}
      className="text-gray-100 bg-gray-800 rounded-sm p-[6px] hover:bg-gray-700 transition-colors cursor-pointer"
    >
      {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
    </button>
  );
};

export default CopyButton;
