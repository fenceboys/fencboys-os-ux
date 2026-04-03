import React, { useState } from 'react';
import { Button, Textarea } from '../ui';
import { useData } from '../../context/DataContext';

interface NotesPanelProps {
  projectId: string;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({ projectId }) => {
  const { getNotesByProjectId, addNote, getSalespersonById } = useData();
  const [newNote, setNewNote] = useState('');

  const notes = getNotesByProjectId(projectId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    addNote({
      projectId,
      content: newNote,
      authorId: 'sp1', // Default to first salesperson for demo
    });

    setNewNote('');
  };

  return (
    <div>
      {/* Add Note Form */}
      <div className="mb-4">
        <Textarea
          placeholder="Add a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={3}
        />
        <div className="mt-2 flex justify-end">
          <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim()}>
            Add Note
          </Button>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No notes yet</p>
        ) : (
          notes.map((note) => {
            const author = getSalespersonById(note.authorId);
            return (
              <div key={note.id} className="border-l-2 border-gray-200 pl-4">
                <p className="text-gray-900 text-sm">{note.content}</p>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <span>{author?.name || 'Unknown'}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(note.createdAt).toLocaleString()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
