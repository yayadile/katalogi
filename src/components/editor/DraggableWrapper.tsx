'use client'

export type BlockPosition = {
  x: number
  y: number
  width: number | string
  height: number | string
  zIndex: number
}

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
  children
}: DraggableWrapperProps) {
  
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onSelect(id)
      }}
      className={`relative w-full transition-all group ${
        isSelected ? 'ring-2 ring-purple-700 z-50' : 'hover:ring-1 hover:ring-purple-500 z-10'
      }`}
      style={{
        zIndex: position.zIndex,
      }}
    >
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-purple-700 text-white text-[10px] px-2 py-0.5 rounded-t-md font-bold uppercase tracking-wider z-50">
          Selected
        </div>
      )}
      <div className="w-full relative">
        {children}
      </div>
    </div>
  )
}