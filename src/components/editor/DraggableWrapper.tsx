'use client'

import { Rnd } from 'react-rnd'
import { useState, useEffect } from 'react'
import { type BlockPosition } from './BlockNavigator'

type DraggableWrapperProps = {
  id: string
  position: BlockPosition
  isSelected: boolean
  onSelect: (id: string) => void
  onDragStop: (id: string, x: number, y: number) => void
  onResizeStop: (id: string, width: string | number, height: string | number, x: number, y: number) => void
  children: React.ReactNode
}

export default function DraggableWrapper({
  id,
  position,
  isSelected,
  onSelect,
  onDragStop,
  onResizeStop,
  children
}: DraggableWrapperProps) {
  const [internalPos, setInternalPos] = useState({ x: position.x, y: position.y })
  const [internalSize, setInternalSize] = useState({ width: position.width, height: position.height })

  // Sync with external position if it changes (e.g. from undo/redo or settings panel)
  // We use key on Rnd or other mechanism if we want to avoid useEffect, 
  // but for now let's just use it properly or avoid syncing if not needed.
  // Actually, setting state in useEffect is fine if it's for syncing with props,
  // but ESLint warns about it. 
  
  const [prevPosition, setPrevPosition] = useState(position)
  if (position !== prevPosition) {
    setInternalPos({ x: position.x, y: position.y })
    setInternalSize({ width: position.width, height: position.height })
    setPrevPosition(position)
  }

  return (
    <Rnd
      size={{ width: internalSize.width, height: internalSize.height }}
      position={{ x: internalPos.x, y: internalPos.y }}
      onDragStop={(e, d) => {
        onDragStop(id, d.x, d.y)
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onResizeStop(id, ref.style.width, ref.style.height, position.x, position.y)
      }}
      onClick={() => onSelect(id)}
      bounds="parent"
      style={{
        zIndex: position.zIndex,
        border: isSelected ? '2px solid #8b5cf6' : '1px transparent',
        transition: 'border 0.2s',
      }}
      enableResizing={isSelected}
      disableDragging={!isSelected}
      className={isSelected ? 'z-50' : ''}
    >
      <div className="w-full h-full relative group">
        {isSelected && (
          <div className="absolute -top-6 left-0 bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-t-md font-bold uppercase tracking-wider">
            Selected
          </div>
        )}
        <div className="w-full h-full overflow-hidden">
          {children}
        </div>
      </div>
    </Rnd>
  )
}