'use client';

import { Card } from "@/components/ui/card";
import { Building2 } from 'lucide-react';
import CompanyCard from './company-card';
import { COMPANY_DATA } from '@/data/company-interview-data';

export default function CompanyPrepCards() {
  return (
    <Card className="p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
          <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Company Interview Guide
        </h3>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Know what each company focuses on and how to prepare specifically for them
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COMPANY_DATA.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </Card>
  );
}
