import { FC, useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import BaseModal from 'components/BaseModal';
import { FlexDiv } from 'components/common';
import { formatNumber } from 'utils/numbers';
import Input from 'components/Input/Input';
import Connector from 'containers/Connector';
import Button from 'components/Button';
import Wei, { wei } from '@synthetixio/wei';
import { getERC20Data } from 'utils/crypto';
import { removeZeroes } from 'utils/string';

type DealCalculationModalProps = {
	handleClose: () => void;
	handleValidate: (underlyingDealTokenTotal: Wei) => void;
	setIsModalOpen: (isOpen: boolean) => void;
	isModalOpen: boolean;
	purchaseTokenSymbol: string;
	purchaseTokenTotal: string;
	underlyingDealTokenAddress: string;
};

const DealCalculationModal: FC<DealCalculationModalProps> = ({
	handleClose,
	setIsModalOpen,
	isModalOpen,
	purchaseTokenSymbol,
	purchaseTokenTotal,
	underlyingDealTokenAddress,
	handleValidate,
}) => {
	const { provider } = Connector.useContainer();
	const [rateIsInverted, setRateIsInverted] = useState<boolean>(false);
	const [rate, setRate] = useState<number>(1);

	const [underlyingDealTokenSymbol, setUnderlyingDealTokenSymbol] =
		useState<string>('Underlying Deal Token');
	const ratePair = useMemo(() => {
		if (rateIsInverted) {
			return `${purchaseTokenSymbol} per ${underlyingDealTokenSymbol}`;
		} else {
			return `${underlyingDealTokenSymbol} per ${purchaseTokenSymbol}`;
		}
	}, [rateIsInverted, purchaseTokenSymbol, underlyingDealTokenSymbol]);

	const rateLabel = useMemo(() => {
		if (rateIsInverted) {
			return `1 ${underlyingDealTokenSymbol} = ${rate} ${purchaseTokenSymbol}`;
		} else {
			return `1 ${purchaseTokenSymbol} = ${rate} ${underlyingDealTokenSymbol}`;
		}
	}, [rateIsInverted, underlyingDealTokenSymbol, rate, purchaseTokenSymbol]);

	const underlyingDealTokenTotal = useMemo(() => {
		try {
			if (rateIsInverted) {
				return wei(purchaseTokenTotal).div(wei(rate.toString()));
			} else {
				return wei(purchaseTokenTotal).mul(wei(rate.toString()));
			}
		} catch (e) {
			console.log(e);
			return wei(0);
		}
	}, [rate, purchaseTokenTotal, rateIsInverted]);

	useEffect(() => {
		const fetchTokenSymbol = async () => {
			const { symbol } = await getERC20Data({ address: underlyingDealTokenAddress, provider });
			setUnderlyingDealTokenSymbol(symbol);
		};
		if (!!underlyingDealTokenAddress && !!provider) {
			fetchTokenSymbol();
		}
	}, [underlyingDealTokenAddress, provider]);

	return (
		<BaseModal
			title="Deal Calculation"
			onClose={handleClose}
			setIsModalOpen={setIsModalOpen}
			isModalOpen={isModalOpen}
		>
			<Content>
				<ItemLabel>{`Total Purchase Token (${purchaseTokenSymbol}): ${formatNumber(
					purchaseTokenTotal,
					2
				)}`}</ItemLabel>
				<InputBlock>
					<StyledFlexDiv>
						<ItemLabel>{`Exchange rate: ${ratePair}`}</ItemLabel>
						<InvertButton
							onClick={() => {
								setRateIsInverted(!rateIsInverted);
								setRate(0);
							}}
							variant="tertiary"
						>
							Invert
						</InvertButton>
					</StyledFlexDiv>
					<Input
						placeholder="0"
						id="rate"
						name="rate"
						type="number"
						value={rate}
						onChange={(e: any) => {
							setRate(e.target.value);
						}}
					/>
					<RateLabel>{`(${rateLabel})`}</RateLabel>
				</InputBlock>
				<InputBlock>
					<StyledFlexDiv>
						<ItemLabel>{`${underlyingDealTokenSymbol} Total`}</ItemLabel>
					</StyledFlexDiv>
					<Input
						disabled
						placeholder="0"
						id="underlyingDealTokenTotal"
						name="underlyingDealTokenTotal"
						type="string"
						value={
							underlyingDealTokenTotal.eq(0)
								? '0'
								: removeZeroes(underlyingDealTokenTotal.toString())
						}
					/>
				</InputBlock>
				<ValidationButton
					variant="primary"
					size="lg"
					isRounded
					fullWidth
					disabled={!underlyingDealTokenTotal || underlyingDealTokenTotal.eq(0)}
					onClick={() => handleValidate(underlyingDealTokenTotal)}
				>
					OK
				</ValidationButton>
			</Content>
		</BaseModal>
	);
};

const Content = styled.div`
	margin: 20px 0 10px 0;
`;

const ItemLabel = styled.div`
	color: ${(props) => props.theme.colors.textBody};
	font-size: 1.1rem;
	margin-right: 6px;
`;

const InputBlock = styled.div`
	margin: 20px 0;
`;

const StyledFlexDiv = styled(FlexDiv)`
	align-items: baseline;
`;

const InvertButton = styled(Button)`
	text-decoration: underline;
`;

const ValidationButton = styled(Button)`
	margin-top: 40px;
`;

const RateLabel = styled(FlexDiv)`
	justify-content: flex-end;
	margin-top: 2px;
`;

export default DealCalculationModal;
