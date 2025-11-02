'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface TabLayoutProps {
  gemeinsam: React.ReactNode;
  privat: React.ReactNode;
}

interface Tab {
  id: string;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: 'gemeinsam', label: 'Gemeinsam', icon: '🏠' },
  { id: 'privat', label: 'Privat', icon: '👤' },
];

export default function TabLayout({ gemeinsam, privat }: TabLayoutProps) {
  const [activeTab, setActiveTab] = useState('gemeinsam');

  return (
    <div className='bg-gray-50'>
      <div className='max-w-6xl mx-auto'>
        {/* Tab Navigation */}
        <div className='bg-white rounded-lg shadow-md p-2 mb-6'>
          <div className='flex space-x-1'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 flex items-center justify-center px-4 py-3 rounded-md font-medium text-sm transition-colors duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className='mr-2 text-lg'>{tab.icon}</span>
                <span>{tab.label}</span>

                {activeTab === tab.id && (
                  <motion.div
                    className='absolute inset-0 bg-blue-100 rounded-md -z-10'
                    layoutId='activeTab'
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'gemeinsam' ? gemeinsam : privat}
        </motion.div>
      </div>
    </div>
  );
}
