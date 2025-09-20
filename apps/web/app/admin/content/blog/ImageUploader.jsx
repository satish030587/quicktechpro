"use client";

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { Button, LoadingSpinner } from '../../components/ui';

export default function ImageUploader({ onImageUploaded }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);

      const reader = new FileReader();
      reader.onload = (event) => {
        setTimeout(() => {
          const imageUrl = event.target.result;
          onImageUploaded(imageUrl);

          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }

          setUploading(false);
          toast.success('Image uploaded successfully');
        }, 1000);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      setUploading(false);
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-6 text-center ${dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {uploading ? (
        <div className="flex flex-col items-center justify-center">
          <LoadingSpinner size="lg" />
          <p className="mt-3 text-sm text-gray-500">Uploading image...</p>
        </div>
      ) : (
        <>
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">Drag and drop an image here, or click to browse</p>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => fileInputRef.current?.click()}
          >
            Select Image
          </Button>
        </>
      )}
    </div>
  );
}
