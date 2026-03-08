import { useCallback, useMemo, useState } from 'react';

function getCodeBlockPreview(code) {
  return code.split('\n').slice(0, 5).join('\n');
}

function createCodeBlock(language, code) {
  return {
    language,
    code,
    previewLines: getCodeBlockPreview(code),
  };
}

export function useCodeAttachment() {
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [editingCodeBlock, setEditingCodeBlock] = useState(null);

  const resetCodeBlocks = useCallback(() => {
    setCodeBlocks([]);
  }, []);

  const openAddModal = useCallback(() => {
    setEditingCodeBlock(null);
    setIsCodeModalOpen(true);
  }, []);

  const handleCodeEdit = useCallback((index) => {
    setEditingCodeBlock(index);
    setIsCodeModalOpen(true);
  }, []);

  const handleCodeDelete = useCallback((index) => {
    setCodeBlocks((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleCodeSubmit = useCallback(({ language, code }) => {
    const nextBlock = createCodeBlock(language, code);

    if (editingCodeBlock !== null) {
      setCodeBlocks((prev) =>
        prev.map((block, i) =>
          i === editingCodeBlock ? nextBlock : block,
        ),
      );
    } else {
      setCodeBlocks((prev) => [...prev, nextBlock]);
    }
    setEditingCodeBlock(null);
    setIsCodeModalOpen(false);
  }, [editingCodeBlock]);

  const handleModalOpenChange = useCallback((open) => {
    setIsCodeModalOpen(open);
    if (!open) {
      setEditingCodeBlock(null);
    }
  }, []);

  const editingBlock =
    editingCodeBlock !== null ? codeBlocks[editingCodeBlock] : null;

  const codeModalProps = useMemo(() => ({
    open: isCodeModalOpen,
    onOpenChange: handleModalOpenChange,
    onSubmit: handleCodeSubmit,
    initialLanguage: editingBlock?.language,
    initialCode: editingBlock?.code,
  }), [
    editingBlock,
    handleCodeSubmit,
    handleModalOpenChange,
    isCodeModalOpen,
  ]);

  return {
    codeBlocks,
    resetCodeBlocks,
    openAddModal,
    handleCodeEdit,
    handleCodeDelete,
    codeModalProps,
  };
}
