import React, { useMemo } from 'react';
import DocxTextBlock from './DocxTextBlock';

const DocxEditor = ({ textBlocks, setTextBlocks }) => {
    const groupSentences = () => {
        const groups = [];
        let currentGroup = [];
        let currentParaId = null;
        let currentSentId = null;

        // Sort blocks by paraId and sentId to ensure proper grouping
        const sortedBlocks = [...textBlocks].sort((a, b) => {
            if (a.paraId === b.paraId) {
                return a.sentId - b.sentId;
            }
            return a.paraId.localeCompare(b.paraId);
        });

        for (const block of sortedBlocks) {
            if (block.paraId !== currentParaId || block.sentId !== currentSentId) {
                if (currentGroup.length > 0) {
                    groups.push(currentGroup);
                }
                currentGroup = [block];
                currentParaId = block.paraId;
                currentSentId = block.sentId;
            } else {
                currentGroup.push(block);
            }
        }

        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }

        return groups;
    };

    const groupedSentences = useMemo(() => groupSentences(), [textBlocks]);

    const handleTextBlockUpdate = (index, updatedBlocks) => {
        setTextBlocks(prev => {
            const newBlocks = [...prev];

            updatedBlocks.forEach(updatedBlock => {
                const originalIndex = newBlocks.findIndex(b => b.id === updatedBlock.id);
                if (originalIndex !== -1 && newBlocks[originalIndex].text !== updatedBlock.text) {
                    newBlocks[originalIndex] = { ...updatedBlock };
                }
            });

            return newBlocks;
        });
    };

    return (
        <div className='w-full h-full space-y-2 p-2 overflow-auto'>
            {groupedSentences.map((blockGroup, index) => (
                blockGroup.length > 0 ? (
                    <DocxTextBlock
                        key={`block-${blockGroup[0].id}`}
                        index={index}
                        onUpdate={handleTextBlockUpdate}
                        block={blockGroup}
                    />
                ) : (
                    <div key={`empty-${index}`} style={{ minHeight: '40px' }} />
                )
            ))}
        </div>
    );
};

export default DocxEditor;