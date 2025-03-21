import React from 'react';
import Button from '@/components/common/Button';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4">일정 등록</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              일정 제목
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="일정 제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              날짜 선택
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              일정 설명
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows={3}
              placeholder="일정에 대한 설명을 입력하세요"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            type="button"
            className="flex-1 bg-gray-500 text-white"
            onClick={onClose}
          >
            취소
          </Button>
          <Button type="button" className="flex-1 text-white">
            등록
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
