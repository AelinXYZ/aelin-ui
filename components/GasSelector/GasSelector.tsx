import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Wei, { wei } from '@synthetixio/wei';

import { Tooltip } from 'components/common';
import Button from 'components/Button';
import Connector from 'containers/Connector';

import useExchangeRatesQuery from 'hooks/useExchangeRatesQuery';
import useEthGasPriceQuery, { GAS_SPEEDS } from 'hooks/useEthGasPriceQuery';

import { getExchangeRatesForCurrencies } from 'utils/currencies';
import { getTransactionPrice } from 'utils/network';

import { GWEI_PRECISION } from 'constants/networks';

import { IGasSelector, GasSpeed, GasPrices } from './types';

const GasSelector: React.FC<IGasSelector> = ({
	setGasPrice,
	gasLimitEstimate,
	initialGasSpeed = 'fast',
}) => {
	const [customGasPrice, setCustomGasPrice] = useState<string>('');
	const [gasSpeed, setGasSpeed] = useState<GasSpeed>(initialGasSpeed);
	const [isOpen, setIsOpen] = useState(false);

	const { network, provider, isOVM } = Connector.useContainer();

	const exchangeRatesQuery = useExchangeRatesQuery(network);
	const ethGasStationQuery = useEthGasPriceQuery({ networkId: network.id, provider });
	const gasPrices = useMemo(
		() => ethGasStationQuery.data ?? ({} as GasPrices),
		[ethGasStationQuery.data]
	);
	const exchangeRates = exchangeRatesQuery.data ?? null;

	const gasPrice: Wei | null = useMemo(() => {
		try {
			return wei(customGasPrice, GWEI_PRECISION);
		} catch (_) {
			if (!ethGasStationQuery.data) return null;

			return wei(ethGasStationQuery.data[gasSpeed], GWEI_PRECISION);
		}
	}, [customGasPrice, ethGasStationQuery.data, gasSpeed]);

	const ethPriceRate = getExchangeRatesForCurrencies(exchangeRates, 'sETH', 'sUSD');

	const transactionFee = useMemo(
		() => getTransactionPrice(gasPrice, gasLimitEstimate, ethPriceRate) ?? 0,
		[gasPrice, gasLimitEstimate, ethPriceRate]
	);

	const formattedGasPrice = useMemo(() => {
		const nGasPrice = Number(gasPrices[gasSpeed] ?? 0);
		const nCustomGasPrice = Number(customGasPrice);

		if (!nCustomGasPrice) {
			if (!Number.isInteger(nGasPrice)) return nGasPrice.toFixed(isOVM ? 3 : 2);
			return nGasPrice;
		}

		if (!Number.isInteger(nCustomGasPrice)) return nCustomGasPrice.toFixed(isOVM ? 3 : 2);
		return nCustomGasPrice;
	}, [customGasPrice, gasPrices, gasSpeed, isOVM]);

	useEffect(() => {
		try {
			setGasPrice(wei(customGasPrice, GWEI_PRECISION));
		} catch (_) {
			setGasPrice(gasPrice || wei(0));
		}
		// eslint-disable-next-line
	}, [gasPrice, customGasPrice]);

	return (
		<StyledContainer>
			<StyledGasDescription>{`Gas price (GWEI)`}</StyledGasDescription>
			<Wrapper>
				<StyledGasPrice>{`≈ ${formattedGasPrice} ($${transactionFee})`}</StyledGasPrice>
				<EditGasEstimateTooltip
					visible={isOpen}
					appendTo="parent"
					trigger="click"
					allowHTML
					interactive
					content={
						<StyledUl>
							<StyledLi>
								<StyledInput
									type="number"
									value={customGasPrice}
									placeholder="Custom"
									onChange={(e) => {
										setCustomGasPrice(e.target.value);
									}}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											setIsOpen(!isOpen);
										}
									}}
								/>
							</StyledLi>
							{GAS_SPEEDS.map((gasSpeed) => (
								<StyledLi
									key={gasSpeed}
									onClick={() => {
										setCustomGasPrice('');
										setGasSpeed(gasSpeed);
										setIsOpen(!isOpen);
									}}
								>
									<StyledSpeed>{gasSpeed}</StyledSpeed>
									<span>{Number(gasPrices[gasSpeed]).toFixed(isOVM ? 3 : 2)}</span>
								</StyledLi>
							))}
						</StyledUl>
					}
				>
					<StyledButton
						isRounded
						size="md"
						variant="quaternary"
						type="submit"
						onClick={() => setIsOpen(!isOpen)}
					>
						Edit
					</StyledButton>
				</EditGasEstimateTooltip>
			</Wrapper>
		</StyledContainer>
	);
};

const StyledContainer = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 25px 0;
`;

const StyledGasDescription = styled.span`
	color: ${(props) => props.theme.colors.textBody};
	line-height: 2rem;
	font-size: 1rem;
	padding-right: 5px;
`;

const StyledGasPrice = styled.span`
	color: ${(props) => props.theme.colors.textSmall};
	line-height: 2rem;
	font-size: 1rem;
	margin-right: 15px;
`;

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const StyledButton = styled(Button)`
	font-family: ${(props) => props.theme.fonts.ASMRegular};
	position: absolute;
	right: 0;
`;

const StyledInput = styled.input`
	width: 120px;
	min-width: 0;
	font-family: Agrandir-Regular;
	background-color: #dbdbdb;
	height: 32px;
	padding: 0 8px;
	font-size: 1rem;
	border: 0;
	border-radius: 4px;
	border: 1px solid #c4c4c4;
	color: #252626;
	caret-color: #477830;
	outline: none;
`;

const EditGasEstimateTooltip = styled(Tooltip)`
	background-color: ${(props) => props.theme.colors.boxesBackground};
	border: 1px solid ${(props) => props.theme.colors.borders};

	> div {
		padding: 0 !important;
	}
`;

const StyledUl = styled.ul`
	padding: 0;
`;

const StyledLi = styled.li`
	list-style-type: none;
	padding: 15px;
	color: ${(props) => props.theme.colors.textBody};
	cursor: pointer;
	letter-spacing: 1px;
	font-weight: 300;
	text-align: left;
	display: flex;
	justify-content: space-between;

	&:hover {
		color: ${(props) => props.theme.colors.buttonPrimary};
		background-color: ${(props) => props.theme.colors.inputBackground};

		&:last-child {
			border-bottom-left-radius: 4px;
			border-bottom-right-radius: 4px;
		}
	}

	&:first-child {
		&:hover {
			background-color: inherit;
		}
		border-top: none;
	}
`;

const StyledSpeed = styled.span`
	&::first-letter {
		text-transform: uppercase;
	}
`;

export { GasSelector };
export default GasSelector;
