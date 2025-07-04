import React, { useMemo } from 'react';
import PptxTextBlock from './PptxTextBlock';

const PptxEditor = ({ textBlocks, setTextBlocks }) => {
    // Group text blocks by slide and shape
    const groupBlocks = () => {
        const groups = {};

        textBlocks.forEach(block => {
            const groupKey = `${block.slide}-shape-${block.shapeId}`;
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(block);
        });

        // Convert to array and sort by slide number
        return Object.values(groups).sort((a, b) => {
            const slideNumA = parseInt(a[0].slide.match(/slide(\d+)/)?.[1]) || 0;
            const slideNumB = parseInt(b[0].slide.match(/slide(\d+)/)?.[1]) || 0;
            return slideNumA - slideNumB;
        });
    };

    const groupedBlocks = useMemo(() => groupBlocks(), [textBlocks]);

    const handleTextBlockUpdate = (index, updatedBlocks) => {
        setTextBlocks(prev => {
            const newBlocks = [...prev];

            updatedBlocks.forEach(updatedBlock => {
                const originalIndex = newBlocks.findIndex(b => b.id === updatedBlock.id);
                if (originalIndex !== -1) {
                    newBlocks[originalIndex] = { ...updatedBlock };
                }
            });

            return newBlocks;
        });
    };

    return (
        <div className='w-full h-full space-y-2 p-2 overflow-auto'>
            {groupedBlocks.map((blockGroup, index) => (
                <div key={`group-${blockGroup[0].id}`} >
                    <PptxTextBlock
                        key={`block-${blockGroup[0].id}`}
                        index={index}
                        onUpdate={handleTextBlockUpdate}
                        block={blockGroup}
                    />
                </div>
            ))}
        </div>
    );
};

export default PptxEditor;