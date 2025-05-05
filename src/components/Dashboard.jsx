import React, { useContext } from "react";
import { TranslationContext } from "../context/TranslationContext";

export default function Dashboard() {
  const { data, setData, language, setLanguage } = useContext(TranslationContext);

  const handleChange = (index, value) => {
    const newData = [...data];
    if (!newData[index].translations) newData[index].translations = {};
    newData[index].translations[language] = value;
    setData(newData);
  };

  const addKeyword = () => {
    const newKeyword = prompt("Enter new keyword:");
    if (newKeyword) {
      setData([...data, { keyword: newKeyword, translations: {} }]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Translation Management</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="fa">فارسی</option>
          <option value="fr">Français</option>
        </select>
      </div>
      <div className="space-y-2">
        {data.map((item, idx) => {
          const hasTranslation = item.translations?.[language];
          return (
            <div key={item.keyword} className="flex gap-2">
              <div className="w-1/2 p-2 border rounded bg-white">{item.keyword}</div>
              <input
                className={`w-1/2 p-2 border rounded ${hasTranslation ? "bg-white" : "bg-red-200"}`}
                value={item.translations?.[language] || ""}
                onChange={(e) => handleChange(idx, e.target.value)}
              />
            </div>
          );
        })}
      </div>
      <button onClick={addKeyword} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        + Add Keyword
      </button>
    </div>
  );
}