import { Children, cloneElement, useRef } from "react";

interface DraggableArrayProps {
  children: preact.ComponentChildren;
  onMove?: (from: number, to: number) => void;
}

function DraggableArray({ children, onMove }: DraggableArrayProps) {
  const draggedIndex = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    draggedIndex.current = index;
  };

  const handleDragOver = (event: DragEvent, index: number) => {
    event.preventDefault();
    if (draggedIndex.current === null || draggedIndex.current === index) return;

    onMove?.(draggedIndex.current, index, event);
    draggedIndex.current = index;
  };

  const handleDragEnd = () => {
    draggedIndex.current = null;
  };

  return Children.toArray(children).map((child, index) =>
    cloneElement(child as preact.VNode, {
      draggable: false,
      onDragStart: () => handleDragStart(index),
      onDragOver: (event: DragEvent) => handleDragOver(event, index),
      onDragEnd: handleDragEnd,
      children: Children.toArray(child.props?.children).map((child) =>
        cloneElement(child as preact.VNode, {
          draggable: child.props["data-draggable"] === true,
          onDragStart: () => handleDragStart(index),
          onDragOver: (event: DragEvent) => handleDragOver(event, index),
          onDragEnd: handleDragEnd,
        })
      ),
    })
  );
}

export default DraggableArray;
