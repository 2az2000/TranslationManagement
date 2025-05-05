import React, { useContext, useState, useRef } from 'react';
import { TranslationContext } from '../context/TranslationContext';
import { FaLanguage, FaFilter, FaGripVertical } from 'react-icons/fa';

const languages = [
  { code: 'fa', label: 'فارسی', dir: 'ltr' },
  { code: 'fr', label: 'فرانسوی', dir: 'ltr' },
  { code: 'en', label: 'انگلیسی', dir: 'ltr' },
];

export default function PublicView() {
  const { data, setData, language, setLanguage } = useContext(TranslationContext);
  const [onlyTranslated, setOnlyTranslated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggingItem, setDraggingItem] = useState(null);
  const dragItem = useRef();
  const dragOverItem = useRef();

  // فیلتر واژه‌ها
  const filteredData = data
    .filter(item => item.keyword.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(item => !onlyTranslated || item.translations?.[language]?.trim());

  // تغییر زبان
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    document.documentElement.dir = languages.find(l => l.code === lang)?.dir || 'rtl';
  };

  // Drag and Drop
  const handleDragStart = (e, index) => {
    dragItem.current = index;
    setDraggingItem(filteredData[index]);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    dragOverItem.current = index;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (dragItem.current !== dragOverItem.current) {
      const draggedKeyword = filteredData[dragItem.current].keyword;
      const targetKeyword = filteredData[dragOverItem.current].keyword;
      
      const draggedIndex = data.findIndex(item => item.keyword === draggedKeyword);
      const targetIndex = data.findIndex(item => item.keyword === targetKeyword);
      
      const newData = [...data];
      const [removed] = newData.splice(draggedIndex, 1);
      newData.splice(targetIndex, 0, removed);
      
      setData(newData);
    }
    setDraggingItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* هدر با کنترل‌ها */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transition-all duration-300">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaLanguage className="text-blue-600" />
              نمایش عمومی ترجمه‌ها
            </h2>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* جستجو */}
              <div className="relative transition-all duration-300 hover:scale-[1.01]">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجوی واژه..."
                  className="border rounded pl-10 pr-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* انتخاب زبان */}
              <select
                value={language}
                onChange={handleLanguageChange}
                className="border rounded px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>

              {/* فیلتر ترجمه‌دارها */}
              <label className="flex items-center text-sm gap-1 cursor-pointer transition-all duration-200 hover:text-blue-600">
                <input
                  type="checkbox"
                  checked={onlyTranslated}
                  onChange={(e) => setOnlyTranslated(e.target.checked)}
                  className="cursor-pointer"
                />
                فقط ترجمه‌دارها
              </label>
            </div>
          </div>
        </div>

        {/* لیست واژه‌ها */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 transition-all duration-300">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <div
                key={item.keyword}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={handleDrop}
                onDragEnd={handleDrop}
                className={`border border-gray-200 rounded-lg p-4 shadow-sm transition-all duration-300 transform ${
                  draggingItem?.keyword === item.keyword 
                    ? 'scale-105 opacity-80 bg-gray-50 shadow-md' 
                    : 'hover:scale-[1.02] hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-2">
                  <FaGripVertical className="text-gray-400 mt-1 cursor-grab active:cursor-grabbing" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      {item.keyword}
                    </p>
                    <p className={`text-md transition-colors duration-200 ${
                      item.translations?.[language] 
                        ? 'text-blue-600' 
                        : 'text-gray-400 italic'
                    }`}>
                      {item.translations?.[language]?.trim() || 'بدون ترجمه'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center col-span-full transition-all duration-300">
              <p className="text-gray-500 text-lg">هیچ واژه‌ای یافت نشد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}