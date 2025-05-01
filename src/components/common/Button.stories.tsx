import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta = {
  title: 'Common/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '기본 button 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: '버튼의 스타일 variant',
      control: 'radio',
      options: ['primary', 'secondary'],
      table: {
        type: { summary: "'primary' | 'secondary'" },
        defaultValue: { summary: 'primary' },
      },
    },
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
      description: 'Tailwind CSS 클래스 추가 적용',
      control: 'text',
    },
    children: {
      description: '버튼 내부에 들어갈 텍스트',
      control: 'text',
    },
  },
  args: {
    type: 'button',
    variant: 'primary',
    children: '버튼',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '확인',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: '취소',
  },
};

export const CustomClassName: Story = {
  args: {
    variant: 'primary',
    className: 'w-full max-w-xs',
    children: '커스텀 클래스 적용',
  },
};
