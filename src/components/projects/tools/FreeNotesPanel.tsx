import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';

interface FreeNotesPanelProps {
  projectId: string;
}

export const FreeNotesPanel: React.FC<FreeNotesPanelProps> = ({ projectId }) => {
  const { getNotesByProjectId, addNote, getActivitiesByProjectId, getSalespersonById } = useData();
  const [noteContent, setNoteContent] = useState('');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const notes = getNotesByProjectId(projectId);
  const activities = getActivitiesByProjectId(projectId);

  const handleAddNote = () => {
    if (!noteContent.trim()) return;

    addNote({
      projectId,
      content: noteContent,
      authorId: 'sp1', // Default to first salesperson
    });
    setNoteContent('');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Editor */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => setIsBold(!isBold)}
            className={`p-1.5 rounded hover:bg-gray-200 ${isBold ? 'bg-gray-200' : ''}`}
            title="Bold"
          >
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setIsItalic(!isItalic)}
            className={`p-1.5 rounded hover:bg-gray-200 ${isItalic ? 'bg-gray-200' : ''}`}
            title="Italic"
          >
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4m-2 0v16m-2 0h4" transform="skewX(-10)" />
            </svg>
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <button
            type="button"
            className="p-1.5 rounded hover:bg-gray-200"
            title="Bullet List"
          >
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            type="button"
            className="p-1.5 rounded hover:bg-gray-200"
            title="Numbered List"
          >
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 6h13M7 12h13M7 18h13M4 6h.01M4 12h.01M4 18h.01" />
            </svg>
          </button>
        </div>

        {/* Text Area */}
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Write a note..."
          className={`w-full p-4 min-h-[120px] resize-none focus:outline-none ${
            isBold ? 'font-bold' : ''
          } ${isItalic ? 'italic' : ''}`}
        />
      </div>

      {/* Add Note Button */}
      <div className="flex justify-end">
        <button
          onClick={handleAddNote}
          disabled={!noteContent.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Add Note
        </button>
      </div>

      {/* Notes List */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Project Notes</h3>
        {notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <p>No notes yet</p>
            <p className="text-sm">Add your first note above</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.slice().reverse().map((note) => {
              const author = getSalespersonById(note.authorId);
              return (
                <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{author?.name || 'Team Member'}</span>
                    <span className="text-xs text-gray-500">{formatDate(note.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Activity Section */}
      {activities.length > 0 && (
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Activity</h3>
          <div className="space-y-3">
            {activities.slice().reverse().slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-gray-300" />
                <div className="flex-1">
                  <p className="text-gray-700">{activity.content}</p>
                  <p className="text-xs text-gray-400">{formatDate(activity.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
