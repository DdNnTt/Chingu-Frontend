import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta = {
  title: 'Common/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '기본 button 컴포넌트 입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      description: '버튼의 타입',
      control: 'radio',
      options: ['button', 'submit', 'reset'],
      table: {
        type: { summary: "'button' | 'submit' | 'reset'" },
      },
    },
    onClick: { action: 'clicked' },
    className: {
      description: 'Tailwind CSS 클래스 적용 테스트',
      control: 'text',
    },
    children: {
      description: '버튼 내부에 들어갈 텍스트',
      control: 'text',
    },
  },
  args: {
    type: 'button',
    className: 'bg-gray-500 text-white px-4 py-2 rounded-md',
    children: '기본 버튼',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'bg-gray-500 text-white px-4 py-2 rounded-md',
    children: '기본 버튼',
  },
};
