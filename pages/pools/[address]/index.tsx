import { FC, useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import CopyIcon from 'assets/svg/copy.svg';
import CheckIcon from 'assets/svg/check.svg';
import Image from 'next/image';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ContentHeader, ContentTitle } from 'sections/Layout/PageLayout';

import { PageLayout } from 'sections/Layout';
import Grid from 'components/Grid';
import { FlexDivCenterAligned, FlexDiv } from 'components/common';
import ActionBox from 'components/ActionBox';
import { truncateAddress } from 'utils/crypto';

const Pool: FC = () => {
	const [copiedPoolAddress, setCopiedPoolAddress] = useState(false);
	const [copiedDealAddress, setCopiedDealAddress] = useState(false);
	const router = useRouter();
	const { address } = router.query;
	const poolAddress = (address ?? '') as string;

	useEffect(() => {
		if (copiedPoolAddress) {
			const timer1 = setInterval(() => {
				setCopiedPoolAddress(false);
			}, 3000); // 3s
			return () => clearInterval(timer1);
		}
	}, [copiedPoolAddress]);

	useEffect(() => {
		if (copiedDealAddress) {
			const timer1 = setInterval(() => {
				setCopiedDealAddress(false);
			}, 3000); // 3s
			return () => clearInterval(timer1);
		}
	}, [copiedDealAddress]);

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

	const hasDeal = true;
	const dealAddress = '0x123456781234567812345678';

	return (
		<PageLayout
			title={
				<FlexDivCenterAligned>
					Aelin Pool
					<AddressWidget>{truncateAddress(poolAddress)}</AddressWidget>
					<CopyToClipboard text={poolAddress} onCopy={() => setCopiedPoolAddress(true)}>
						{copiedPoolAddress ? (
							<Image src={CheckIcon} alt="copied" />
						) : (
							<Image src={CopyIcon} alt={poolAddress} />
						)}
					</CopyToClipboard>
				</FlexDivCenterAligned>
			}
			subtitle=""
		>
			<FlexDiv>
				<Grid hasInputFields={false} gridItems={gridItems} />
				<ActionBox
					onClick={() => console.log('clicked me')}
					header="Purchase"
					input={{ type: 'number', placeholder: '0', label: 'Balance: 2000 USDC' }}
					actionText="Purchase"
				/>
			</FlexDiv>
			{hasDeal ? (
				<DealWrapper>
					<ContentHeader>
						<ContentTitle>
							<FlexDivCenterAligned>
								Aelin Deal
								<AddressWidget>{truncateAddress(dealAddress)}</AddressWidget>
								<CopyToClipboard text={dealAddress} onCopy={() => setCopiedDealAddress(true)}>
									{copiedDealAddress ? (
										<Image src={CheckIcon} alt="copied" />
									) : (
										<Image src={CopyIcon} alt={dealAddress} />
									)}
								</CopyToClipboard>
							</FlexDivCenterAligned>
						</ContentTitle>
					</ContentHeader>
					<FlexDiv>
						<Grid hasInputFields={false} gridItems={gridItems} />
						<ActionBox
							onClick={() => console.log('clicked me')}
							header="Purchase"
							input={{ type: 'number', placeholder: '0', label: 'Balance: 2000 USDC' }}
							actionText="Purchase"
						/>
					</FlexDiv>
				</DealWrapper>
			) : null}
		</PageLayout>
	);
};

const DealWrapper = styled.div`
	margin-top: 35px;
`;

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
