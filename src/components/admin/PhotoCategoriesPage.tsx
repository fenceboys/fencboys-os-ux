import React, { useState } from 'react';
import { PageLayout, PageHeader } from '../layout';
import { Card, Button } from '../ui';
import { useData } from '../../context/DataContext';
import { PhotoCategory } from '../../types';

export const PhotoCategoriesPage: React.FC = () => {
  const { photoCategories, addPhotoCategory, updatePhotoCategory, deletePhotoCategory } = useData();
  const [editingCategory, setEditingCategory] = useState<PhotoCategory | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const activeCategories = photoCategories
    .filter((c) => c.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const handleAdd = () => {
    if (!newName.trim()) return;

    const maxSortOrder = Math.max(...photoCategories.map((c) => c.sortOrder), 0);

    addPhotoCategory({
      name: newName.trim(),
      sortOrder: maxSortOrder + 1,
      isActive: true,
    });

    setNewName('');
    setIsAdding(false);
  };

  const handleUpdate = () => {
    if (!editingCategory || !newName.trim()) return;
    updatePhotoCategory(editingCategory.id, { name: newName.trim() });
    setEditingCategory(null);
    setNewName('');
  };

  const handleDeactivate = (category: PhotoCategory) => {
    if (window.confirm(`Deactivate "${category.name}"? This will hide it from photo uploads.`)) {
      updatePhotoCategory(category.id, { isActive: false });
    }
  };

  const handleMoveUp = (category: PhotoCategory) => {
    const currentIndex = activeCategories.findIndex((c) => c.id === category.id);
    if (currentIndex > 0) {
      const prevCategory = activeCategories[currentIndex - 1];
      updatePhotoCategory(category.id, { sortOrder: prevCategory.sortOrder });
      updatePhotoCategory(prevCategory.id, { sortOrder: category.sortOrder });
    }
  };

  const handleMoveDown = (category: PhotoCategory) => {
    const currentIndex = activeCategories.findIndex((c) => c.id === category.id);
    if (currentIndex < activeCategories.length - 1) {
      const nextCategory = activeCategories[currentIndex + 1];
      updatePhotoCategory(category.id, { sortOrder: nextCategory.sortOrder });
      updatePhotoCategory(nextCategory.id, { sortOrder: category.sortOrder });
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Photo Categories"
        subtitle="Manage categories for project photos"
        icon={
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
        actions={
          <Button variant="primary" onClick={() => setIsAdding(true)}>
            + Add Category
          </Button>
        }
      />

      <Card>
        <div className="divide-y divide-gray-100">
          {/* Add new category inline */}
          {isAdding && (
            <div className="px-4 py-3 flex items-center space-x-3 bg-blue-50">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAdd();
                  if (e.key === 'Escape') setIsAdding(false);
                }}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                placeholder="Enter category name..."
                autoFocus
              />
              <Button variant="primary" size="sm" onClick={handleAdd}>
                Add
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          )}

          {activeCategories.length === 0 && !isAdding ? (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              No categories yet
            </div>
          ) : (
            activeCategories.map((category, index) => (
              <div
                key={category.id}
                className="px-4 py-3 flex items-center justify-between hover:bg-gray-50"
              >
                {editingCategory?.id === category.id ? (
                  <div className="flex items-center space-x-3 flex-1">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUpdate();
                        if (e.key === 'Escape') {
                          setEditingCategory(null);
                          setNewName('');
                        }
                      }}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                      autoFocus
                    />
                    <Button variant="primary" size="sm" onClick={handleUpdate}>
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setEditingCategory(null);
                        setNewName('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    <div className="flex items-center space-x-1">
                      {/* Move Up */}
                      <button
                        onClick={() => handleMoveUp(category)}
                        disabled={index === 0}
                        className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      {/* Move Down */}
                      <button
                        onClick={() => handleMoveDown(category)}
                        disabled={index === activeCategories.length - 1}
                        className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {/* Edit */}
                      <button
                        onClick={() => {
                          setEditingCategory(category);
                          setNewName(category.name);
                        }}
                        className="p-1.5 rounded hover:bg-gray-200"
                        title="Edit"
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      {/* Deactivate */}
                      <button
                        onClick={() => handleDeactivate(category)}
                        className="p-1.5 rounded hover:bg-red-100"
                        title="Deactivate"
                      >
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </PageLayout>
  );
};
