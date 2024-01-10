import type {Meta, StoryObj} from '@storybook/react';

import {serializedDataDecorator} from '../../utils/decorators';
import FloatingUIMiddleware from './FloatingUIMiddleware';
import {generateReferenceId} from '../../utils/references';

export default {
  title: 'Views/Floating UI/Middleware',
  parameters: {
    layout: 'centered',
  },
  component: FloatingUIMiddleware,
} satisfies Meta;

export const Middleware: StoryObj<typeof FloatingUIMiddleware> = {
  decorators: [
    serializedDataDecorator(
      Array.from({length: 10}, (_, index) => ({
        elements: {
          floating: generateReferenceId(),
          reference: generateReferenceId(),
        },
        x: index * 10,
        y: index * 10,
        type: 'FloatingUIMiddleware',
        strategy: 'absolute',
        rects: {
          floating: {x: index * 10, y: index * 10, width: 100, height: 100},
          reference: {x: 0, y: 0, width: 0, height: 0},
        },
        placement: 'bottom',
        initialPlacement: 'bottom-end',
        middlewareData: {},
      })),
    ),
  ],
};
