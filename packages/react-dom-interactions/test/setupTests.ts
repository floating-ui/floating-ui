import '@testing-library/jest-dom';

jest
  .spyOn(window, 'requestAnimationFrame')
  .mockImplementation((callback: FrameRequestCallback): number => {
    callback(0);
    return 0;
  });
