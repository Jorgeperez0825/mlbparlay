import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { METRIC_CATEGORIES } from '@/constants/metrics';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (metrics: string[]) => void;
}

export const CreateBoardModal = ({ isOpen, onClose, onSubmit }: CreateBoardModalProps) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [boardName, setBoardName] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedMetrics);
    onClose();
  };

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId)
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(prev => prev === categoryId ? null : categoryId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create High-Margin Betting Analysis">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Board Name */}
        <div>
          <label htmlFor="boardName" className="block text-sm font-medium text-gray-700">
            Board Name
          </label>
          <input
            type="text"
            id="boardName"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#002D72] focus:ring-[#002D72] sm:text-sm"
            placeholder="My High-Margin Analysis Board"
            required
          />
        </div>

        {/* Metrics Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Analysis Tools
          </label>
          <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3">
            {METRIC_CATEGORIES.map((category) => (
              <div key={category.id} className="border border-gray-200 rounded-lg">
                {/* Category Header */}
                <button
                  type="button"
                  className="w-full px-4 py-3 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100 rounded-t-lg"
                  onClick={() => toggleCategory(category.id)}
                >
                  <span className="font-medium text-gray-900">{category.name}</span>
                  <span className="text-gray-500">
                    {expandedCategory === category.id ? '−' : '+'}
                  </span>
                </button>

                {/* Category Metrics */}
                {expandedCategory === category.id && (
                  <div className="p-4 space-y-3">
                    {category.metrics.map((metric) => (
                      <div
                        key={metric.id}
                        className={`
                          p-4 rounded-lg border-2 cursor-pointer transition-colors
                          ${selectedMetrics.includes(metric.id)
                            ? 'border-[#002D72] bg-[#002D72] bg-opacity-10'
                            : 'border-gray-200 hover:border-[#002D72]'
                          }
                        `}
                        onClick={() => toggleMetric(metric.id)}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedMetrics.includes(metric.id)}
                            onChange={() => toggleMetric(metric.id)}
                            className="mt-1 h-4 w-4 text-[#002D72] focus:ring-[#002D72] border-gray-300 rounded"
                          />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{metric.name}</h4>
                            <p className="text-sm text-gray-500">{metric.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002D72]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={selectedMetrics.length === 0 || !boardName}
            className="px-4 py-2 text-sm font-medium text-white bg-[#002D72] border border-transparent rounded-md shadow-sm hover:bg-[#041E42] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002D72] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Board
          </button>
        </div>
      </form>
    </Modal>
  );
}; 