import { useState } from 'react';
import { ethers, utils } from 'ethers';
import styled from 'styled-components';
import { ActionMeta, createFilter, Props } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { useSelectStyles } from 'components/Select/Select';
import {
	IndicatorSeparator,
	DropdownIndicator,
	MultiValueRemove,
} from 'components/Select/components';

import { Token, validateErc20Address } from 'constants/token';
import useAelinTokenList from 'hooks/useAelinTokenList';
import Connector from 'containers/Connector';

const tokenToOption = (token: Token) => ({
	value: token,
	label: token.symbol,
});

const noSearchTermTokens = ['USDC', 'USDT', 'SNX', 'DAI', 'sUSD', 'wETH'];

type Option = { label: string; value: Token };
type TokenDropdownProps = Props<Option, false> & {
	variant: 'solid' | 'outline';
	selectedAddress?: string;
	onValidationError: (message: string) => void;
	onChange: (option: Option, meta: ActionMeta<Option>) => void;
};

function TokenDropdown(props: TokenDropdownProps) {
	const { provider } = Connector.useContainer();

	const [customToken, setCustomToken] = useState<Token | undefined>(undefined);
	const { tokens = [], tokensByAddress = {} } = useAelinTokenList() || {};
	const computedStyles = useSelectStyles(props);

	const hasCustomTokenSelected = customToken && props.selectedAddress === customToken.address;
	const options = tokens.concat(hasCustomTokenSelected ? customToken : []).map(tokenToOption);

	const getSelectedToken = () => {
		if (!props.selectedAddress) {return undefined;}
		const token = tokensByAddress[props.selectedAddress];
		if (token) {return tokenToOption(token);}
		if (customToken) {return tokenToOption(customToken);}
		return undefined;
	};

	return (
		<Container>
			<CreatableSelect
				styles={computedStyles}
				components={{
					IndicatorSeparator,
					DropdownIndicator,
					MultiValueRemove,
					...props.components,
				}}
				isMulti={false}
				filterOption={(option, searchTerm) => {
					const value = option.data.value;
					if (searchTerm.length === 0) {
						return noSearchTermTokens.includes(value.symbol);
					}
					return createFilter<Option>({
						ignoreCase: true,
						ignoreAccents: true,
						matchFrom: 'any',
						stringify: (option) => `${option.label} ${option.data.value.address}`,
						trim: true,
					})(option, searchTerm);
				}}
				noOptionsMessage={() => 'Not a valid Address'}
				placeholder="Select Token"
				onChange={(x, meta) => {
					props.onValidationError('');
					setCustomToken(undefined);
					props.onChange(x, meta);
				}}
				allowCreateWhileLoading={false}
				formatCreateLabel={(inputString) => 'Add Custom Token: ' + inputString}
				isValidNewOption={(searchTerm) => {
					const isAddress = utils.isAddress(searchTerm);
					if (!isAddress) {return false;}
					const tokenExists = tokensByAddress[searchTerm];
					return !tokenExists;
				}}
				onCreateOption={async (address) => {
					const validationResult = await validateErc20Address(address, provider);
					if (validationResult.result === 'success') {
						const newOption = {
							label: validationResult.token.symbol,
							value: validationResult.token,
						};
						const meta: ActionMeta<Option> = {
							action: 'create-option',
							option: newOption,
						};
						props.onChange(newOption, meta);
						setCustomToken(validationResult.token);
					} else {
						props.onValidationError(validationResult.errorMessage);
					}
				}}
				isLoading={tokens.length === 0}
				options={options}
				value={getSelectedToken()}
			/>
		</Container>
	);
}

const Container = styled.div`
	max-width: 166px;
`;

export default TokenDropdown;
