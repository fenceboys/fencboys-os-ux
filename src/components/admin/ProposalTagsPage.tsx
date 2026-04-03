import React, { useState } from 'react';
import { PageLayout, PageHeader } from '../layout';
import { Card, Button } from '../ui';
import { useData } from '../../context/DataContext';
import { ProposalTag } from '../../types';

type TagCategory = 'material' | 'height' | 'style';

const categoryLabels: Record<TagCategory, string> = {
  material: 'Material',
  height: 'Height',
  style: 'Style',
};

const categoryOrder: TagCategory[] = ['material', 'height', 'style'];

export const ProposalTagsPage: React.FC = () => {
  const { proposalTags, addProposalTag, updateProposalTag, deleteProposalTag } = useData();
  const [editingTag, setEditingTag] = useState<ProposalTag | null>(null);
  const [addingCategory, setAddingCategory] = useState<TagCategory | null>(null);
  const [newTagName, setNewTagName] = useState('');

  // Group tags by category
  const tagsByCategory = categoryOrder.reduce((acc, category) => {
    acc[category] = proposalTags
      .filter((t) => t.category === category && t.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    return acc;
  }, {} as Record<TagCategory, ProposalTag[]>);

  const handleAddTag = (category: TagCategory) => {
    if (!newTagName.trim()) return;

    const maxSortOrder = Math.max(
      ...proposalTags.filter((t) => t.category === category).map((t) => t.sortOrder),
      0
    );

    addProposalTag({
      name: newTagName.trim(),
      category,
      sortOrder: maxSortOrder + 1,
      isActive: true,
    });

    setNewTagName('');
    setAddingCategory(null);
  };

  const handleUpdateTag = () => {
    if (!editingTag || !newTagName.trim()) return;
    updateProposalTag(editingTag.id, { name: newTagName.trim() });
    setEditingTag(null);
    setNewTagName('');
  };

  const handleDeactivate = (tag: ProposalTag) => {
    if (window.confirm(`Deactivate "${tag.name}"? This will hide it from new proposals.`)) {
      updateProposalTag(tag.id, { isActive: false });
    }
  };

  const handleMoveUp = (tag: ProposalTag) => {
    const categoryTags = tagsByCategory[tag.category];
    const currentIndex = categoryTags.findIndex((t) => t.id === tag.id);
    if (currentIndex > 0) {
      const prevTag = categoryTags[currentIndex - 1];
      updateProposalTag(tag.id, { sortOrder: prevTag.sortOrder });
      updateProposalTag(prevTag.id, { sortOrder: tag.sortOrder });
    }
  };

  const handleMoveDown = (tag: ProposalTag) => {
    const categoryTags = tagsByCategory[tag.category];
    const currentIndex = categoryTags.findIndex((t) => t.id === tag.id);
    if (currentIndex < categoryTags.length - 1) {
      const nextTag = categoryTags[currentIndex + 1];
      updateProposalTag(tag.id, { sortOrder: nextTag.sortOrder });
      updateProposalTag(nextTag.id, { sortOrder: tag.sortOrder });
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Proposal Tags"
        subtitle="Manage material, height, and style tags for proposals"
        icon={
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        }
      />

      <div className="space-y-6">
        {categoryOrder.map((category) => (
          <Card key={category}>
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                {categoryLabels[category]}
              </h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setAddingCategory(category);
                  setNewTagName('');
                }}
              >
                + Add
              </Button>
            </div>
            <div className="divide-y divide-gray-100">
              {/* Add new tag inline */}
              {addingCategory === category && (
                <div className="px-4 py-3 flex items-center space-x-3 bg-blue-50">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddTag(category);
                      if (e.key === 'Escape') setAddingCategory(null);
                    }}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    placeholder="Enter tag name..."
                    autoFocus
                  />
                  <Button variant="primary" size="sm" onClick={() => handleAddTag(category)}>
                    Add
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setAddingCategory(null)}>
                    Cancel
                  </Button>
                </div>
              )}

              {tagsByCategory[category].length === 0 && addingCategory !== category ? (
                <div className="px-4 py-6 text-center text-gray-500 text-sm">
                  No tags in this category
                </div>
              ) : (
                tagsByCategory[category].map((tag, index) => (
                  <div
                    key={tag.id}
                    className="px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                  >
                    {editingTag?.id === tag.id ? (
                      <div className="flex items-center space-x-3 flex-1">
                        <input
                          type="text"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateTag();
                            if (e.key === 'Escape') {
                              setEditingTag(null);
                              setNewTagName('');
                            }
                          }}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                          autoFocus
                        />
                        <Button variant="primary" size="sm" onClick={handleUpdateTag}>
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setEditingTag(null);
                            setNewTagName('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-medium text-gray-900">{tag.name}</span>
                        <div className="flex items-center space-x-1">
                          {/* Move Up */}
                          <button
                            onClick={() => handleMoveUp(tag)}
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
                            onClick={() => handleMoveDown(tag)}
                            disabled={index === tagsByCategory[category].length - 1}
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
                              setEditingTag(tag);
                              setNewTagName(tag.name);
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
                            onClick={() => handleDeactivate(tag)}
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
        ))}
      </div>
    </PageLayout>
  );
};
