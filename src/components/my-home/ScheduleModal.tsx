import React, { useState } from 'react';
import Modal from '@/components/common/Modal';
import axios, { isAxiosError } from 'axios';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await axios.post('/api/schedules', {
        title,
        description,
        scheduleDate: date,
      });

      setTitle('');
      setDate('');
      setDescription('');
      onClose();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || '일정 등록에 실패했습니다.');
      } else {
        setError('일정 등록에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="일정 등록"
      submitLabel={isLoading ? '등록 중...' : '등록'}
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

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
            required
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
            required
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
          />
        </div>
      </div>
    </Modal>
  );
};

export default ScheduleModal;
