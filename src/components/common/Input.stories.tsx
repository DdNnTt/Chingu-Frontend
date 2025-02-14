import type { Meta, StoryObj } from '@storybook/react';
import Input from './Input';

const meta = {
  title: 'Common/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '기본 input 컴포넌트 입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: '입력 필드의 라벨' },
    type: {
      control: 'radio',
      options: ['text', 'password', 'email', 'number'],
      description: '입력 필드 타입',
    },
    placeholder: { control: 'text', description: '플레이스홀더' },
    value: { control: 'text', description: '입력 값' },
  },
  args: {
    label: '제목',
    type: 'text',
    placeholder: '제목을 입력하세요',
    value: '',
    onChange: () => {},
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
