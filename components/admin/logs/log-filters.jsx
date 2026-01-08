'use client';

import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LogFilters({ filters, setFilters }) {
  const actions = ['all', 'created', 'updated', 'deleted', 'blocked', 'replied', 'login'];
  const resourceTypes = ['all', 'user', 'roadmap', 'quiz', 'mentorship', 'settings'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Action Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Action</label>
          <select
            value={filters.action}
            onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value, page: 1 }))}
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700"
          >
            {actions.map(action => (
              <option key={action} value={action}>
                {action === 'all' ? 'All Actions' : action.charAt(0).toUpperCase() + action.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Resource Type Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Resource Type</label>
          <select
            value={filters.resourceType}
            onChange={(e) => setFilters(prev => ({ ...prev, resourceType: e.target.value, page: 1 }))}
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700"
          >
            {resourceTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Actor Search */}
        <div>
          <label className="text-sm font-medium mb-2 block">Actor (Email)</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={filters.actor}
              onChange={(e) => setFilters(prev => ({ ...prev, actor: e.target.value, page: 1 }))}
              placeholder="Search by email..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="text-sm font-medium mb-2 block">Start Date</label>
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value, page: 1 }))}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="text-sm font-medium mb-2 block">End Date</label>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value, page: 1 }))}
          />
        </div>
      </div>

      {/* Clear Filters */}
      <div className="mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilters({
            page: 1,
            action: 'all',
            resourceType: 'all',
            actor: '',
            startDate: '',
            endDate: ''
          })}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}

