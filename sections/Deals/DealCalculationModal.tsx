import { useState } from 'react';
import BaseModal from 'components/BaseModal';

const DealCalculationModal = () => {
	const handleClose = () => {};
	return (
		<BaseModal
			title="Deal Calculation"
			onClose={handleClose}
			setIsModalOpen={setIsModalOpen}
			isModalOpen={isModalOpen}
		>
			<div>test</div>
		</BaseModal>
	);
};

export default DealCalculationModal;
