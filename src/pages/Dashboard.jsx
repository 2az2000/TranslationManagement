import React, { useContext, useState, useRef } from "react";
import { TranslationContext } from "../context/TranslationContext";
import {
  FaSave,
  FaSearch,
  FaPlus,
  FaGripVertical,
  FaLanguage,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

export default function Dashboard() {
  const { data, setData, language, editTranslation } =
    useContext(TranslationContext);
  const [search, setSearch] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [draggingItem, setDraggingItem] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragItem = useRef();
  const dragOverItem = useRef();

  // فیلتر واژه‌ها
  const filteredData = data.filter((item) =>
    item.keyword.toLowerCase().includes(search.toLowerCase())
  );

 
  const showAlert = (title, text, icon) => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: "باشه",
    });
  };

  const handleAddKeyword = (keyword = newKeyword.trim()) => {
    if (!keyword) {
      showAlert("خطا!", "لطفاً یک واژه وارد کنید!", "error");
      return;
    }

    if (
      data.some((item) => item.keyword.toLowerCase() === keyword.toLowerCase())
    ) {
      showAlert("خطا!", "این واژه قبلاً وجود دارد!", "error");
      return;
    }

    const newWord = {
      keyword,
      translations: {
        fa: "",
        en: "",
        fr: "",
        [language]: "",
      },
    };

    setData([...data, newWord]);
    setNewKeyword("");
    showAlert("موفقیت!", "واژه با موفقیت اضافه شد!", "success");
  };

  const showAddKeywordModal = () => {
    Swal.fire({
      title: "افزودن واژه جدید",
      input: "text",
      inputPlaceholder: "واژه جدید را وارد کنید...",
      showCancelButton: true,
      confirmButtonText: "افزودن",
      cancelButtonText: "انصراف",
      inputValidator: (value) => {
        if (!value) {
          return "لطفاً یک واژه وارد کنید!";
        }
        if (
          data.some((item) => item.keyword.toLowerCase() === value.toLowerCase())
        ) {
          return "این واژه قبلاً وجود دارد!";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleAddKeyword(result.value);
      }
    });
  };

  // Drag and Drop
  const handleDragStart = (e, index) => {
    dragItem.current = index;
    setIsDragging(true);
    setDraggingItem(filteredData[index]);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget);
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

      const draggedIndex = data.findIndex(
        (item) => item.keyword === draggedKeyword
      );
      const targetIndex = data.findIndex(
        (item) => item.keyword === targetKeyword
      );

      const newData = [...data];
      const [removed] = newData.splice(draggedIndex, 1);
      newData.splice(targetIndex, 0, removed);

      setData(newData);
    }
    setIsDragging(false);
    setDraggingItem(null);
  };

  // ذخیره تغییرات
  const handleSave = () => {
    localStorage.setItem("translationData", JSON.stringify(data));
    showAlert("موفقیت!", "تغییرات با موفقیت ذخیره شد!", "success");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    dragging: {
      scale: 1.05,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      zIndex: 10,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-6 pb-20 md:pb-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6 transition-all duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <FaLanguage className="text-blue-600 text-xl md:text-2xl" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                مدیریت ترجمه‌ها
              </h2>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm md:text-base"
            >
              <FaSave className="text-xs md:text-sm" /> ذخیره تغییرات
            </motion.button>
          </div>
        </div>

        {/* جستجو و افزودن */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            {/* جستجو */}
            <div className="relative">
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm md:text-base" />
              <input
                type="text"
                placeholder="جستجوی واژه..."
                className="w-full border border-gray-200 rounded-lg pl-3 pr-8 py-2 md:pl-4 md:pr-10 md:py-3 text-sm md:text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* افزودن واژه جدید - فقط در دسکتاپ */}
            <div className="hidden md:flex gap-2">
              <input
                type="text"
                placeholder="واژه جدید..."
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddKeyword()}
              />
              <button
                onClick={() => handleAddKeyword()}
                className="flex items-center gap-1 md:gap-2 bg-green-600 text-white px-3 py-2 md:px-4 md:py-3 rounded-lg text-sm md:text-base"
              >
                <FaPlus className="text-xs md:text-sm" /> افزودن
              </button>
            </div>
          </div>
        </div>

        {/* لیست واژه‌ها */}
        <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3 md:space-y-4 overflow-y-auto flex-1"
            style={{
              maxHeight: 'calc(100vh - 300px)',
              scrollbarWidth: 'thin',
              scrollbarColor: '#3b82f6 #f1f5f9',
            }}
          >
          <AnimatePresence>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <motion.li
                key={item.keyword}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={handleDrop}
                onDragEnd={handleDrop}
                className={`border border-gray-200 rounded-xl bg-white p-3 md:p-4 shadow-md ${
                  isDragging && draggingItem?.keyword === item.keyword
                    ? "scale-105 opacity-80 bg-gray-50 shadow-lg"
                    : ""
                }`}
              >
                  <div className="flex items-center gap-2 md:gap-3">
                    <FaGripVertical className="text-gray-400 mt-0.5 md:mt-1 cursor-grab active:cursor-grabbing text-sm md:text-base" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-2">
                      <h3 className="text-base md:text-lg font-semibold text-gray-800">
                        {item.keyword}
                      </h3>
                      <input
                        type="text"
                        value={item.translations?.[language] || ""}
                        onChange={(e) =>
                          editTranslation(
                            item.keyword,
                            language,
                            e.target.value
                          )
                        }
                        className={`${
                          item.translations?.[language]
                            ? "border-gray-300"
                            : "bg-red-300"
                        } border border-gray-200 rounded-lg text-center px-2 py-1.5 md:px-3 md:py-2 text-sm md:text-base w-full md:w-auto`}
                        placeholder="ترجمه را وارد کنید..."
                      />
                    </div>
                  </div>
                </motion.li>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <p className="text-gray-500 text-base md:text-lg">
                  هیچ واژه‌ای یافت نشد
                </p>
              </div>
            )}
          </AnimatePresence>
        </motion.ul>
      </div>

      {/* دکمه افزودن واژه در موبایل */}
     <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <motion.div
          initial={false}
          animate={{ width: "auto" }}
          whileHover={{ width: "auto" }}
          className="flex items-center justify-end bg-green-600 rounded-full shadow-lg overflow-hidden"
        >
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            className="text-white px-3 whitespace-nowrap"
          >
            افزودن واژه
          </motion.span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={showAddKeywordModal}
            className="bg-green-600 text-white p-4 rounded-full"
          >
            <FaPlus className="text-xl" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
