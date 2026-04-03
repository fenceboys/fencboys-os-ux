import React, { useState, useEffect } from 'react';
import { useData } from '../../../context/DataContext';
import { ProjectSpecs } from '../../../types';

interface ProjectSpecsFormProps {
  projectId: string;
}

const FENCE_TYPES = ['Wood', 'Vinyl', 'Chain Link', 'Aluminum', 'Composite', 'Wrought Iron'];
const FENCE_STYLES = ['Privacy', 'Semi-Privacy', 'Picket', 'Ranch Rail', 'Pool Code', 'Split Rail'];
const FENCE_HEIGHTS = ['4 ft', '5 ft', '6 ft', '7 ft', '8 ft'];

type TerrainHandling = 'followGrade' | 'stepAndLevel' | 'keepTopStraight' | '';

export const ProjectSpecsForm: React.FC<ProjectSpecsFormProps> = ({ projectId }) => {
  const { getProjectSpecsByProjectId, addProjectSpecs, updateProjectSpecs } = useData();
  const existingSpecs = getProjectSpecsByProjectId(projectId);

  const [formData, setFormData] = useState({
    fenceType: existingSpecs?.fenceType || '',
    fenceStyle: existingSpecs?.fenceStyle || '',
    fenceHeight: existingSpecs?.fenceHeight || '',
    estimatedLinearFeet: existingSpecs?.estimatedLinearFeet || null,
    requirements: existingSpecs?.requirements || {
      permit: false,
      hoa: false,
      fenceRemoval: false,
      haulAway: false,
    },
    terrainHandling: (existingSpecs?.terrainHandling || '') as TerrainHandling,
    undergroundUtilities: existingSpecs?.undergroundUtilities || {
      irrigation: false,
      electricDogFence: false,
      other: false,
    },
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (existingSpecs) {
      updateProjectSpecs(existingSpecs.id, formData);
    } else {
      addProjectSpecs({
        projectId,
        ...formData,
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRequirementChange = (key: keyof typeof formData.requirements) => {
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [key]: !prev.requirements[key],
      },
    }));
  };

  const handleUtilityChange = (key: keyof typeof formData.undergroundUtilities) => {
    setFormData(prev => ({
      ...prev,
      undergroundUtilities: {
        ...prev.undergroundUtilities,
        [key]: !prev.undergroundUtilities[key],
      },
    }));
  };

  return (
    <div className="space-y-8">
      {/* Fence Specifications */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Fence Specifications</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fence Type</label>
            <select
              value={formData.fenceType}
              onChange={(e) => setFormData(prev => ({ ...prev, fenceType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select type...</option>
              {FENCE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fence Style</label>
            <select
              value={formData.fenceStyle}
              onChange={(e) => setFormData(prev => ({ ...prev, fenceStyle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select style...</option>
              {FENCE_STYLES.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fence Height</label>
            <select
              value={formData.fenceHeight}
              onChange={(e) => setFormData(prev => ({ ...prev, fenceHeight: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select height...</option>
              {FENCE_HEIGHTS.map(height => (
                <option key={height} value={height}>{height}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Est. Linear Feet</label>
            <input
              type="number"
              value={formData.estimatedLinearFeet || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                estimatedLinearFeet: e.target.value ? parseInt(e.target.value) : null
              }))}
              placeholder="Enter feet..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Requirements</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { key: 'permit' as const, label: 'Permit Required', description: 'Building permit needed for installation' },
            { key: 'hoa' as const, label: 'HOA Approval', description: 'Homeowners association approval required' },
            { key: 'fenceRemoval' as const, label: 'Fence Removal', description: 'Existing fence needs to be removed' },
            { key: 'haulAway' as const, label: 'Haul Away', description: 'Debris removal and disposal included' },
          ].map(({ key, label, description }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleRequirementChange(key)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                formData.requirements[key]
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  formData.requirements[key]
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {formData.requirements[key] && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="font-medium text-gray-900">{label}</span>
              </div>
              <p className="text-xs text-gray-500 ml-6">{description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Terrain Handling */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Terrain Handling</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 'followGrade' as TerrainHandling, label: 'Follow Grade', description: 'Fence follows the natural slope of the ground' },
            { value: 'stepAndLevel' as TerrainHandling, label: 'Step and Level', description: 'Fence sections step down with grade changes' },
            { value: 'keepTopStraight' as TerrainHandling, label: 'Keep Top Straight', description: 'Top of fence remains level, bottom follows grade' },
          ].map(({ value, label, description }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, terrainHandling: value }))}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                formData.terrainHandling === value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  formData.terrainHandling === value
                    ? 'border-blue-500'
                    : 'border-gray-300'
                }`}>
                  {formData.terrainHandling === value && (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>
                <span className="font-medium text-gray-900">{label}</span>
              </div>
              <p className="text-xs text-gray-500 ml-6">{description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Underground Utilities */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Underground Utilities</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { key: 'irrigation' as const, label: 'Irrigation System', description: 'Sprinkler lines present in work area' },
            { key: 'electricDogFence' as const, label: 'Electric Dog Fence', description: 'Invisible fence wiring underground' },
            { key: 'other' as const, label: 'Other', description: 'Other utilities that need locating' },
          ].map(({ key, label, description }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleUtilityChange(key)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                formData.undergroundUtilities[key]
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  formData.undergroundUtilities[key]
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {formData.undergroundUtilities[key] && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="font-medium text-gray-900">{label}</span>
              </div>
              <p className="text-xs text-gray-500 ml-6">{description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {saved ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
          ) : (
            'Save Specifications'
          )}
        </button>
      </div>
    </div>
  );
};
