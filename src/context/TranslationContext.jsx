import React, { createContext, useState, useEffect } from "react";

export const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem("translationData");
    return savedData ? JSON.parse(savedData) : [
      { keyword: "Hello", translations: { fa: "سلام", fr: "Bonjour" } },
      { keyword: "World", translations: { fa: "جهان", fr: "Monde" } },
      { keyword: "Apple", translations: { fa: "سیب" } },
      { keyword: "Book", translations: { fa: "کتاب" } },
      { keyword: "Key", translations: {} },
      { keyword: "Head", translations: { fa: "سر" } },
      { keyword: "Green", translations: { fa: "سبز" } },
      { keyword: "Food", translations: {} },
    ];
  });

  const [language, setLanguage] = useState("fa");

  useEffect(() => {
    localStorage.setItem("translationData", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem("selectedLanguage", language);
  }, [language]);

  const addKeyword = (keyword, lang, translation) => {
    setData(prev => {
      const existingKeyword = prev.find(item => item.keyword === keyword);
      if (existingKeyword) {
        return prev.map(item =>
          item.keyword === keyword
            ? { ...item, translations: { ...item.translations, [lang]: translation } }
            : item
        );
      }
      return [...prev, { keyword, translations: { [lang]: translation } }];
    });
  };

  const editTranslation = (keyword, lang, newTranslation) => {
    setData(prev =>
      prev.map(item =>
        item.keyword === keyword
          ? { ...item, translations: { ...item.translations, [lang]: newTranslation } }
          : item
      )
    );
  };

  const value = {
    data,
    setData,
    language,
    setLanguage,
    addKeyword,
    editTranslation,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}