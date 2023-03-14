import {
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/core';
import {useCallback, useEffect, useRef, useState} from 'react';

const reference = {width: 150, height: 100, x: 5, y: 5};
const floating = {width: 275, height: 50, x: 0, y: 0};

export function Canvas() {
  const canvasRef = useRef(null);
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  const position = useCallback(() => {
    const platform = {
      getElementRects: (data) => data,
      getDimensions: (element) => element,
      getClippingRect: () => ({x: 0, y: 0, width, height}),
    };

    computePosition(reference, floating, {
      platform,
      placement: 'top-start',
      middleware: [
        offset(5),
        flip({padding: 5}),
        shift({padding: 5}),
      ],
    }).then(({x, y}) => {
      const ctx = canvasRef.current.getContext('2d');

      ctx.beginPath();
      ctx.rect(
        reference.x,
        reference.y,
        reference.width,
        reference.height
      );
      ctx.fillStyle = 'royalblue';
      ctx.fill();

      ctx.font = '17px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(
        'Drag me',
        reference.x + 43,
        reference.y + reference.height / 2 + 5
      );

      ctx.beginPath();
      ctx.rect(x, y, floating.width, floating.height);
      ctx.fillStyle = 'black';
      ctx.fill();

      ctx.font = '16px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(
        'Floating',
        x + 100,
        y + floating.height / 2 + 5
      );
    });
  }, [height, width]);

  useEffect(() => {
    function handleResize() {
      const canvasEl = canvasRef.current;
      const rect = canvasEl.getBoundingClientRect();
      setWidth(rect.width);
      setHeight(rect.height);
      position();
    }

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [position]);

  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    const canvasEl = canvasRef.current;
    const rect = canvasEl.getBoundingClientRect();
    canvasEl.width = rect.width * dpr;
    canvasEl.height = rect.height * dpr;
    const ctx = canvasEl.getContext('2d');
    ctx.scale(dpr, dpr);
    reference.x = rect.width / 2 - reference.width / 2;
    reference.y = rect.height / 2 - reference.height / 2;
  });

  useEffect(() => {
    let isDragging = false;
    let clickOffset = {x: 0, y: 0};

    function handlePointerDown({clientX, clientY}) {
      const canvasEl = canvasRef.current;
      const rect = canvasEl.getBoundingClientRect();

      const referenceX = reference.x + rect.x;
      const referenceY = reference.y + rect.y;

      clickOffset = {
        x: clientX - referenceX,
        y: clientY - referenceY,
      };

      const clickedOnReference =
        clientX >= referenceX &&
        clientX <= referenceX + reference.width &&
        clientY >= referenceY &&
        clientY <= referenceY + reference.height;

      if (clickedOnReference) {
        isDragging = true;
      }
    }

    function handlePointerUp() {
      const canvasEl = canvasRef.current;
      const ctx = canvasEl.getContext('2d');
      const rect = canvasEl.getBoundingClientRect();

      if (
        isDragging &&
        (event.clientX < rect.x ||
          event.clientY < rect.y ||
          event.clientX > rect.x + rect.width ||
          event.clientY > rect.y + rect.height)
      ) {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        reference.x = rect.width / 2 - reference.width / 2;
        reference.y = rect.height / 2 - reference.height / 2;
        position();
      }

      isDragging = false;
    }

    function handlePointerMove() {
      if (!isDragging) return;

      const canvasEl = canvasRef.current;
      const ctx = canvasEl.getContext('2d');
      const rect = canvasEl.getBoundingClientRect();

      event.preventDefault();

      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

      reference.x = event.clientX - rect.x - clickOffset.x;
      reference.y = event.clientY - rect.y - clickOffset.y;

      position();
    }

    position();

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener(
        'pointerdown',
        handlePointerDown
      );
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener(
        'pointermove',
        handlePointerMove
      );
    };
  }, [position]);

  return (
    <canvas
      ref={canvasRef}
      className="bg-white border border-red-500 touch-none w-full h-[20rem]"
    />
  );
}
