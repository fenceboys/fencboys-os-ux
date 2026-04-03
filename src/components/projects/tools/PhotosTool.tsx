import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { PageLayout, PageHeader } from '../../layout';
import { useData } from '../../../context/DataContext';
import { Photo } from '../../../types';

const PHOTO_TAGS: string[] = [
  'Before',
  'After',
  'Progress',
  'Site Survey',
  'Materials',
  'Issue',
  'Customer Approval',
];

export const PhotosTool: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProjectById, getCustomerById, getPhotosByProjectId, addPhoto, updatePhoto, deletePhoto } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<{ dataUrl: string; filename: string } | null>(null);
  const [photoName, setPhotoName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showInPortal, setShowInPortal] = useState(false);
  const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false);

  // Edit modal state
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [editName, setEditName] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editInPortal, setEditInPortal] = useState(false);
  const [editTagsDropdownOpen, setEditTagsDropdownOpen] = useState(false);

  // Full view state
  const [viewingPhoto, setViewingPhoto] = useState<Photo | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const project = getProjectById(projectId || '');
  const customer = project ? getCustomerById(project.customerId) : null;
  const photos = getPhotosByProjectId(projectId || '');
  const filteredPhotos = photos.filter(photo =>
    photo.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (photo.name && photo.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (photo.caption?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Upload modal functions
  const openUploadModal = () => {
    setUploadModalOpen(true);
    setPendingFile(null);
    setPhotoName('');
    setSelectedTags([]);
    setShowInPortal(false);
    setTagsDropdownOpen(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPendingFile({
        dataUrl: reader.result as string,
        filename: file.name,
      });
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setPhotoName(nameWithoutExt);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadConfirm = () => {
    if (!pendingFile || !projectId) return;

    addPhoto({
      projectId,
      dataUrl: pendingFile.dataUrl,
      filename: pendingFile.filename,
      name: photoName || pendingFile.filename,
      tags: selectedTags,
      inPortal: showInPortal,
      uploadedBy: 'Team Member',
    });

    setUploadModalOpen(false);
    setPendingFile(null);
    setPhotoName('');
    setSelectedTags([]);
    setShowInPortal(false);
  };

  const handleCancelUpload = () => {
    setUploadModalOpen(false);
    setPendingFile(null);
    setPhotoName('');
    setSelectedTags([]);
    setShowInPortal(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Edit modal functions
  const openEditModal = (photo: Photo) => {
    setEditingPhoto(photo);
    setEditName(photo.name || photo.filename);
    setEditTags(photo.tags || []);
    setEditInPortal(photo.inPortal || false);
    setEditTagsDropdownOpen(false);
  };

  const handleSaveEdit = () => {
    if (!editingPhoto) return;

    updatePhoto(editingPhoto.id, {
      name: editName,
      tags: editTags,
      inPortal: editInPortal,
    });

    setEditingPhoto(null);
  };

  const handleCancelEdit = () => {
    setEditingPhoto(null);
    setEditName('');
    setEditTags([]);
    setEditInPortal(false);
  };

  const toggleEditTag = (tag: string) => {
    setEditTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleDeleteFromEdit = () => {
    if (!editingPhoto) return;
    if (window.confirm('Are you sure you want to delete this photo?')) {
      deletePhoto(editingPhoto.id);
      setEditingPhoto(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!projectId || !project) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Project not found</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <span>Photos</span>
            <span className="px-2.5 py-1 bg-pink-100 text-pink-700 text-sm font-medium rounded-full">
              {customer?.name}
            </span>
          </div>
        }
        subtitle={`${project.address} • ${photos.length} photo${photos.length !== 1 ? 's' : ''}`}
        backLink={{ label: 'Back to Project', to: `/projects/${projectId}` }}
        actions={
          <button
            onClick={openUploadModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Upload
          </button>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* New Photo Card - Always First */}
          <div
            onClick={openUploadModal}
            className="relative group rounded-lg overflow-hidden border-2 border-dashed border-gray-300 aspect-square cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-pink-200 transition-colors">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors text-sm">New Photo</span>
              <span className="text-xs text-gray-500 mt-1">Upload image</span>
            </div>
          </div>

          {/* Existing Photos */}
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => openEditModal(photo)}
              className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-square cursor-pointer"
            >
              <img
                src={photo.dataUrl}
                alt={photo.name || photo.filename}
                className="w-full h-full object-cover"
              />
              {/* In Portal badge */}
              {photo.inPortal && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded">
                  In Portal
                </div>
              )}
              {/* Tags */}
              {photo.tags && photo.tags.length > 0 && (
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  {photo.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white rounded-full p-2">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Caption/date/customer overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-xs text-white truncate">{photo.name || photo.filename}</p>
                <p className="text-xs text-white/70">{customer?.name} • {formatDate(photo.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Upload Photo</h3>
                  <p className="text-sm text-gray-500">Add a photo to this project</p>
                </div>
              </div>
              <button
                onClick={handleCancelUpload}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-4">
              {/* Upload/Preview Area */}
              <div
                className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:border-gray-300 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {pendingFile ? (
                  <>
                    <img
                      src={pendingFile.dataUrl}
                      alt="Preview"
                      className="max-h-48 object-contain rounded mb-4"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Replace
                    </button>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-gray-100 rounded-full mb-3">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Click to select a photo</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Document Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Document Name</label>
                <input
                  type="text"
                  value={photoName}
                  onChange={(e) => setPhotoName(e.target.value)}
                  placeholder="Enter a name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Tags Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-900 mb-1">Tags</label>
                <button
                  type="button"
                  onClick={() => setTagsDropdownOpen(!tagsDropdownOpen)}
                  className="w-full px-3 py-2 border-2 border-blue-500 rounded-lg text-left flex items-center justify-between bg-white"
                >
                  <span className={selectedTags.length > 0 ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedTags.length > 0 ? selectedTags.join(', ') : 'Select tags (optional)'}
                  </span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {tagsDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {PHOTO_TAGS.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                          selectedTags.includes(tag) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                        }`}>
                          {selectedTags.includes(tag) && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">{tag}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Show in Customer Portal */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInPortal}
                    onChange={(e) => setShowInPortal(e.target.checked)}
                    className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Show in Customer Portal</span>
                    <p className="text-sm text-gray-500">When enabled, customers will be able to view this document.</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={handleCancelUpload}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadConfirm}
                disabled={!pendingFile}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  pendingFile
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Upload Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Edit Photo</h3>
                  <p className="text-sm text-gray-500">Update photo details</p>
                </div>
              </div>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-4">
              {/* Photo Preview */}
              <div className="border-2 border-gray-200 rounded-lg p-4 flex flex-col items-center">
                <img
                  src={editingPhoto.dataUrl}
                  alt={editingPhoto.name || editingPhoto.filename}
                  className="max-h-48 object-contain rounded mb-3 cursor-pointer"
                  onClick={() => setViewingPhoto(editingPhoto)}
                />
                <button
                  onClick={() => setViewingPhoto(editingPhoto)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  View Full Size
                </button>
              </div>

              {/* Document Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Document Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter a name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Tags Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-900 mb-1">Tags</label>
                <button
                  type="button"
                  onClick={() => setEditTagsDropdownOpen(!editTagsDropdownOpen)}
                  className="w-full px-3 py-2 border-2 border-blue-500 rounded-lg text-left flex items-center justify-between bg-white"
                >
                  <span className={editTags.length > 0 ? 'text-gray-900' : 'text-gray-400'}>
                    {editTags.length > 0 ? editTags.join(', ') : 'Select tags (optional)'}
                  </span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {editTagsDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {PHOTO_TAGS.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleEditTag(tag)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                          editTags.includes(tag) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                        }`}>
                          {editTags.includes(tag) && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">{tag}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Show in Customer Portal */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editInPortal}
                    onChange={(e) => setEditInPortal(e.target.checked)}
                    className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Show in Customer Portal</span>
                    <p className="text-sm text-gray-500">When enabled, customers will be able to view this document.</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between px-6 py-4 border-t border-gray-200">
              <button
                onClick={handleDeleteFromEdit}
                className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full View Modal */}
      {viewingPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60]"
          onClick={() => setViewingPhoto(null)}
        >
          <button
            onClick={() => setViewingPhoto(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={viewingPhoto.dataUrl}
            alt="Full view"
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </PageLayout>
  );
};
