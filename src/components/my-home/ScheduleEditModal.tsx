import React, { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import axios from '@/libs/axios';

interface Schedule {
  id: number;
  user: {
    id: number;
    userId: string;
    name: string;
    nickname: string;
    email: string;
    password: string;
    profilePictureUrl: string;
    bio: string;
    joinDate: string;
    lastLoginDate: string;
    uniqueKey: string;
    socialType: string;
  };
  title: string;
  description: string;
  scheduleDate: string;
}

interface ScheduleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule | null;
}

const ScheduleEditModal: React.FC<ScheduleEditModalProps> = ({
  isOpen,
  onClose,
  schedule,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // schedule이 변경될 때마다 폼 데이터 초기화
  useEffect(() => {
    if (schedule) {
      setTitle(schedule.title);
      setDate(schedule.scheduleDate);
      setDescription(schedule.description);
    }
  }, [schedule]);

  const handleSubmit = async () => {
    if (!schedule) return;

    try {
      setIsLoading(true);
      setError('');

      await axios.put(`/api/schedules/${schedule.id}`, {
        title,
        description,
        scheduleDate: date,
      });

      alert('일정이 성공적으로 수정되었습니다!');

      // 성공 시 모달 닫기
      onClose();
    } catch {
      setError('일정 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!schedule) return;

    const isConfirmed = confirm('정말로 이 일정을 삭제하시겠습니까?');
    if (!isConfirmed) return;

    try {
      setIsLoading(true);
      setError('');

      await axios.delete(`/api/schedules/${schedule.id}`);

      alert('일정이 성공적으로 삭제되었습니다!');

      // 성공 시 모달 닫기
      onClose();
    } catch {
      setError('일정 삭제에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!schedule) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="일정 수정"
      submitLabel={isLoading ? '수정 중...' : '수정'}
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

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
          >
            삭제
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ScheduleEditModal;
