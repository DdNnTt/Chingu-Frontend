import React, { useState } from 'react';
import Modal from '@/components/common/Modal';
import { AxiosError } from 'axios';
import instance from '@/libs/axios';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiErrorResponse {
  error: string;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const { data } = await instance.post('/api/schedules', {
        title,
        description,
        scheduleDate: date,
      });

      alert(data.message);
      setTitle('');
      setDate('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('일정 생성 중 오류 발생:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.error ||
        '일정 등록에 실패했습니다. 다시 시도해주세요.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="일정 등록"
      submitLabel={isSubmitting ? '등록 중...' : '등록'}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            일정 제목
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="일정 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            날짜 선택
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            일정 설명
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none"
            rows={3}
            placeholder="일정에 대한 설명을 입력하세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ScheduleModal;
