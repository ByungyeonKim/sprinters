import { useState } from 'react';

export function useCodeAttachment() {
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [editingCodeBlock, setEditingCodeBlock] = useState(null);

  const resetCodeBlocks = () => {
    setCodeBlocks([]);
  };

  const openAddModal = () => {
    setEditingCodeBlock(null);
    setIsCodeModalOpen(true);
  };

  const handleCodeEdit = (index) => {
    setEditingCodeBlock(index);
    setIsCodeModalOpen(true);
  };

  const handleCodeDelete = (index) => {
    setCodeBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCodeSubmit = ({ language, code }) => {
    if (editingCodeBlock !== null) {
      setCodeBlocks((prev) =>
        prev.map((block, i) =>
          i === editingCodeBlock ? { language, code } : block,
        ),
      );
    } else {
      setCodeBlocks((prev) => [...prev, { language, code }]);
    }
    setEditingCodeBlock(null);
    setIsCodeModalOpen(false);
  };

  const handleModalOpenChange = (open) => {
    setIsCodeModalOpen(open);
    if (!open) {
      setEditingCodeBlock(null);
    }
  };

  const codeModalProps = {
    open: isCodeModalOpen,
    onOpenChange: handleModalOpenChange,
    onSubmit: handleCodeSubmit,
    initialLanguage:
      editingCodeBlock !== null
        ? codeBlocks[editingCodeBlock]?.language
        : undefined,
    initialCode:
      editingCodeBlock !== null
        ? codeBlocks[editingCodeBlock]?.code
        : undefined,
  };

  return {
    codeBlocks,
    resetCodeBlocks,
    openAddModal,
    handleCodeEdit,
    handleCodeDelete,
    codeModalProps,
  };
}
