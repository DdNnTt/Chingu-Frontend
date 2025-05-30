import React, { useState } from 'react';
import Modal from '@/components/common/Modal';
import axios from '@/libs/axios';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError('');

      await axios.post('/api/schedules', {
        title,
        description,
        scheduleDate: date,
      });

      // 성공 시 모달 닫기
      onClose();
      // 입력 필드 초기화
      setTitle('');
      setDate('');
      setDescription('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '일정 등록에 실패했습니다.'
      );
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
      disabled={isLoading}
    >
      <div className="space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ScheduleModal;
