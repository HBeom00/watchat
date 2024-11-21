import React from 'react';
import Modal from '@/components/recruit/Modal';
import SearchComponent from '@/components/recruit/Search';
import { SearchModalProps } from '@/types/search';

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onResultClick, videoName, setVideoName }) => {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="p-4">
        <SearchComponent videoName={videoName} setVideoName={setVideoName} handleSearchResultClick={onResultClick} />
      </div>
    </Modal>
  );
};

export default SearchModal;
