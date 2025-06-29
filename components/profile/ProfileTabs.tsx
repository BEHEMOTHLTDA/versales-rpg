// src/components/profile/ProfileTabs.tsx
"use client";

// Este componente recebe a aba ativa e uma função para mudá-la
interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = ["Crônicas", "Personagens", "Biblioteca"];

export default function ProfileTabs({
  activeTab,
  setActiveTab,
}: ProfileTabsProps) {
  return (
    <div className="w-full bg-black/30 border-b border-gray-800">
      <nav className="flex space-x-8 px-4 max-w-5xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 px-2 text-lg font-bold transition-colors duration-300 ${
              activeTab === tab
                ? "text-white border-b-4 border-red-800"
                : "text-gray-500 hover:text-white"
            }`}
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}
