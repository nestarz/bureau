import { h, hydrate, Fragment, cloneElement, toChildArray } from "preact";
export { h, hydrate };
import { useSignal, useComputed } from "@preact/signals";

interface DraggableListProps {
  children: preact.ComponentChildren;
  onMove?: (from: number, to: number) => void;
}

function DraggableList({ children, onMove }: DraggableListProps) {
  const draggedIndex = useSignal<number | null>(null);

  const handleDragStart = (index: number) => {
    draggedIndex.value = index;
  };

  const handleDragOver = (event: DragEvent, index: number) => {
    event.preventDefault();
    if (draggedIndex.value === null || draggedIndex.value === index) return;

    onMove?.(draggedIndex.value, index);
    draggedIndex.value = index;
  };

  const handleDragEnd = () => {
    draggedIndex.value = null;
  };

  return toChildArray(children).map((child, index) =>
    cloneElement(child as preact.VNode, {
      draggable: true,
      onDragStart: () => handleDragStart(index),
      onDragOver: (event: DragEvent) => handleDragOver(event, index),
      onDragEnd: handleDragEnd,
      children: toChildArray(child.props?.children).map((child) =>
        cloneElement(child as preact.VNode, {
          draggable: true,
          onDragStart: () => handleDragStart(index),
          onDragOver: (event: DragEvent) => handleDragOver(event, index),
          onDragEnd: handleDragEnd,
        })
      ),
    })
  );
}

export default DraggableList;
