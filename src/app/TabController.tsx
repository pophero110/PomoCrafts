import React from "react";
import { Tab } from "./page";

interface PageSwitchProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: Tab) => void;
}

const TabController: React.FC<PageSwitchProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex border-b border-gray-300">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`py-2 px-4 text-sm font-medium focus:outline-none transition-colors duration-300 ${
            activeTab === tab
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabController;
