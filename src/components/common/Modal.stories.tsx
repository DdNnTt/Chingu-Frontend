import type { Meta, StoryObj } from '@storybook/react';
import Modal from './Modal';

const meta = {
  title: 'Common/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '기본 modal 컴포넌트 입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      description: '모달의 표시 여부',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
      },
    },
    title: {
      description: '모달의 제목',
      control: 'text',
    },
    submitLabel: {
      description: '확인 버튼의 텍스트',
      control: 'text',
    },
    cancelLabel: {
      description: '취소 버튼의 텍스트',
      control: 'text',
    },
    hideFooter: {
      description: '하단 버튼 영역의 표시 여부',
      control: 'boolean',
    },
    onClose: { action: 'closed' },
    onSubmit: { action: 'submitted' },
  },
  args: {
    isOpen: true,
    title: '기본 모달',
    submitLabel: '확인',
    cancelLabel: '취소',
    hideFooter: false,
    children: '기본 모달 내용입니다.',
    onClose: () => {},
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
