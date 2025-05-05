import React, { useContext } from "react";
import { TranslationContext } from "../context/TranslationContext";

export default function PublicView() {
  const { data, language, setLanguage } = useContext(TranslationContext);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Word Translations</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="fa">فارسی</option>
          <option value="fr">Français</option>
        </select>
      </div>
      <div className="space-y-4">
        {data.map((item) => (
          <div
            key={item.keyword}
            className="border p-4 rounded shadow-sm bg-white"
          >
            <div className="font-bold text-lg">{item.keyword}</div>
            <div className="text-gray-600">
              {item.translations?.[language] || "No translation yet"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
