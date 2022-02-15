//@ts-nocheck
import { utils } from 'ethers';
import React, { FC, useRef } from 'react';
import { CSVReader } from 'react-papaparse';
import styled from 'styled-components';

import Button from 'components/Button';

import { IUploadCSV, ICSVResponse, WhitelistProps } from './types';

const UploadCSV: FC<IUploadCSV> = ({ onUploadCSV }) => {
	const buttonRef = useRef();

	const handleOnDrop = (csv: ICSVResponse[]) => {
		const whitelist = csv.reduce((accum, curr: ICSVResponse) => {
			const [address, amount] = curr.data;

			if (!utils.isAddress(address)) return accum;

			accum.push({
				address,
				amount: amount.length ? Number(amount) : null,
			});

			return accum;
		}, [] as WhitelistProps[]);

		onUploadCSV(whitelist);
	};

	const handleOpenDialog = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (buttonRef.current) {
			buttonRef.current.open(e);
		}
	};

	return (
		<CSVReader
			// @ts-ignore: missing type
			ref={buttonRef}
			onFileLoad={handleOnDrop}
			noDrag
			noClick
		>
			{() => (
				<StyledButton size="sm" isRounded variant="secondary" onClick={handleOpenDialog}>
					Upload CSV
				</StyledButton>
			)}
		</CSVReader>
	);
};

const StyledButton = styled(Button)`
	margin: 0 10px;
`;

export default UploadCSV;
export { UploadCSV };
