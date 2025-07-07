import React, { useMemo } from 'react';
import DocxTextBlock from './DocxTextBlock';

const DocxEditor = ({ textBlocks, setTextBlocks }) => {
    const groupSentences = () => {
        // First, group by paragraph
        const paragraphs = {};

        // Organize blocks by paragraph
        textBlocks.forEach(block => {
            if (!paragraphs[block.paraId]) {
                paragraphs[block.paraId] = {};
            }

            if (!paragraphs[block.paraId][block.sentId]) {
                paragraphs[block.paraId][block.sentId] = [];
            }

            paragraphs[block.paraId][block.sentId].push(block);
        });

        // Then sort paragraphs by their order in the original textBlocks
        const paraOrder = [...new Set(textBlocks.map(block => block.paraId))];

        // For each paragraph, sort sentences and then sort text blocks within each sentence
        const result = [];

        paraOrder.forEach(paraId => {
            const sentences = paragraphs[paraId];
            const sentIds = Object.keys(sentences).sort((a, b) => a - b);

            sentIds.forEach(sentId => {
                // Sort text blocks within a sentence by their appearance in original array
                const blocksInSentence = [...sentences[sentId]].sort((a, b) => {
                    const indexA = textBlocks.findIndex(block => block.id === a.id);
                    const indexB = textBlocks.findIndex(block => block.id === b.id);
                    return indexA - indexB;
                });

                if (blocksInSentence.length > 0) {
                    result.push(blocksInSentence);
                }
            });
        });

        return result;
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
                        key={`block-${blockGroup[0].paraId}-${blockGroup[0].sentId}`}
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