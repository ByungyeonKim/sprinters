import { useCallback, useMemo, useState } from 'react';

export type CodeBlock = {
  language: string;
  code: string;
  previewLines: string;
};

function getCodeBlockPreview(code: string): string {
  return code.split('\n').slice(0, 5).join('\n');
}

function createCodeBlock(language: string, code: string): CodeBlock {
  return {
    language,
    code,
    previewLines: getCodeBlockPreview(code),
  };
}

export function useCodeAttachment() {
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [editingCodeBlock, setEditingCodeBlock] = useState<number | null>(null);

  const resetCodeBlocks = useCallback(() => {
    setCodeBlocks([]);
  }, []);

  const openAddModal = useCallback(() => {
    setEditingCodeBlock(null);
    setIsCodeModalOpen(true);
  }, []);

  const handleCodeEdit = useCallback((index: number) => {
    setEditingCodeBlock(index);
    setIsCodeModalOpen(true);
  }, []);

  const handleCodeDelete = useCallback((index: number) => {
    setCodeBlocks((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleCodeSubmit = useCallback(({ language, code }: { language: string; code: string }) => {
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

  const handleModalOpenChange = useCallback((open: boolean) => {
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
