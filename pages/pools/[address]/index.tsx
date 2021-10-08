import { FC, useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import CopyIcon from 'assets/svg/copy.svg';
import CheckIcon from 'assets/svg/check.svg';
import Image from 'next/image';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { PageLayout } from 'sections/Layout';
import Grid from 'components/Grid';
import { FlexDivCenterAligned } from 'components/common';
import ActionBox from 'components/ActionBox';
import { truncateAddress } from 'utils/crypto';

const Pool: FC = () => {
	const [copiedAddress, setCopiedAddress] = useState(false);
	const router = useRouter();
	const { address } = router.query;
	const walletAddress = (address ?? '') as string;

	useEffect(() => {
		if (copiedAddress) {
			setInterval(() => {
				setCopiedAddress(false);
			}, 3000); // 3s
		}
	}, [copiedAddress]);

	const gridItems = useMemo(
		() => [
			{
				header: 'some header',
				text: 'some text',
			},
			{
				header: 'some header',
				text: 'some text',
			},
			{
				header: 'some header',
				text: 'some text',
			},
			{
				header: 'some header',
				text: 'some text',
			},
			{
				header: 'some header',
				text: 'some text',
			},
			{
				header: 'some header',
				text: 'some text',
			},
			{
				header: 'some header',
				text: 'some text',
			},
			{
				header: 'some header',
				text: 'some text',
			},
			{
				header: 'some header',
				text: 'some text',
			},
		],
		[]
	);
	const title = (
		<FlexDivCenterAligned>
			Aelin Pool
			<AddressWidget>{truncateAddress(walletAddress)}</AddressWidget>
			<CopyWrapper onClick={() => console.log('copy address')}>
				<CopyToClipboard text={walletAddress} onCopy={() => setCopiedAddress(true)}>
					{copiedAddress ? (
						<Image src={CheckIcon} alt="copied" />
					) : (
						<Image src={CopyIcon} alt={walletAddress} />
					)}
				</CopyToClipboard>
			</CopyWrapper>
		</FlexDivCenterAligned>
	);
	return (
		<PageLayout title={title} subtitle="">
			<Grid hasInputFields={false} gridItems={gridItems} />
			<ActionBox
				onClick={() => console.log('clicked me')}
				header="Purchase"
				input={{ type: 'number', placeholder: '0', label: 'Balance: 2000 USDC' }}
				actionText="Purchase"
			/>
		</PageLayout>
	);
};

const CopyWrapper = styled(FlexDivCenterAligned)`
	cursor: pointer;
`;

const AddressWidget = styled.div`
	width: 115px;
	height: 22px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	border-radius: 100px;
	font-size: 11px;
	color: ${(props) => props.theme.colors.headerGrey};
	text-align: center;
	margin-left: 10px;
	margin-right: 10px;
	padding-top: 5px;
`;

export default Pool;
