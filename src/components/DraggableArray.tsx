// @deno-types="@types/react"
import { Children, cloneElement, ReactElement, ReactNode, useRef } from "react";

interface DraggableArrayProps {
  children: ReactNode; // Children can be any valid React node
  onMove?: (from: number, to: number, event: DragEvent) => void; // Added event parameter to onMove definition
}

export function DraggableArray({
  children,
  onMove,
}: DraggableArrayProps): ReactNode[] {
  const draggedIndex = useRef<number | null>(null);

  // The event type here should technically be React.DragEvent to properly type React's version of the event
  const handleDragStart = (index: number) => {
    draggedIndex.current = index;
  };

  // Using React.DragEvent<HTML*Element> where * can be your desired HTML element, or HTMLElement as a generic element.
  const handleDragOver = (
    event: React.DragEvent<HTMLElement>,
    index: number
  ) => {
    event.preventDefault(); // To allow dropping
    if (draggedIndex.current === null || draggedIndex.current === index) return;

    onMove?.(draggedIndex.current, index, event as unknown as DragEvent); // Assuming you want the native event, cast to `DragEvent`
    draggedIndex.current = index;
  };

  const handleDragEnd = () => {
    draggedIndex.current = null;
  };

  return Children.toArray(children).map((child, index) =>
    cloneElement(child as ReactElement, {
      // Ensure child is of type ReactElement for `cloneElement`
      draggable: false,
      onDragStart: () => handleDragStart(index),
      onDragOver: (event: React.DragEvent<HTMLElement>) =>
        handleDragOver(event, index),
      onDragEnd: handleDragEnd,
      children: Children.toArray((child as ReactElement).props?.children).map(
        (innerChild) =>
          cloneElement(innerChild as ReactElement, {
            // Ensure innerChild is of type ReactElement for `cloneElement`
            draggable:
              (innerChild as ReactElement).props["data-draggable"] === true,
            onDragStart: () => handleDragStart(index),
            onDragOver: (event: React.DragEvent<HTMLElement>) =>
              handleDragOver(event, index),
            onDragEnd: handleDragEnd,
          })
      ),
    })
  );
}

export default DraggableArray;
