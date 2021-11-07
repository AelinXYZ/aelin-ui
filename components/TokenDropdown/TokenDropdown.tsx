import { useState } from 'react';
import { utils } from 'ethers';
import styled from 'styled-components';
import { ActionMeta, createFilter, Props } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { useSelectStyles } from 'components/Select/Select';
import {
	IndicatorSeparator,
	DropdownIndicator,
	MultiValueRemove,
} from 'components/Select/components';

import { Token } from 'constants/token';
import useAelinTokenList from 'hooks/useAelinTokenList';

const tokenToOption = (token: Token) => ({
	value: token,
	label: token.symbol,
});
const noSearchTermTokens = ['ETH', 'USDC', 'USDT', 'SNX'];

type Option = { label: string; value: Token };
type TokenDropdownProps = Props<Option, false> & {
	variant: 'solid' | 'outline';
	selectedAddress?: string;
	onValidationError: (message: string) => void;
	onChange: (option: Option, meta: ActionMeta<Option>) => void;
};

function TokenDropdown(props: TokenDropdownProps) {
	const [customToken, setCustomToken] = useState<Token | undefined>(undefined);
	const { tokens = [], tokensByAddress = {} } = useAelinTokenList() || {};
	const computedStyles = useSelectStyles(props);

	const hasCustomTokenSelected = customToken && props.selectedAddress === customToken.address;
	const options = tokens.concat(hasCustomTokenSelected ? customToken : []).map(tokenToOption);
	const getSelectedToken = () => {
		if (!props.selectedAddress) return undefined;
		const token = tokensByAddress[props.selectedAddress];
		if (token) return tokenToOption(token);
		if (customToken) return tokenToOption(customToken);
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
				placeholder="Token Address"
				onChange={(x, meta) => {
					props.onValidationError('');
					setCustomToken(undefined);
					props.onChange(x, meta);
				}}
				allowCreateWhileLoading={false}
				formatCreateLabel={(inputString) => 'Add Custom Token: ' + inputString}
				isValidNewOption={(searchTerm) => {
					const isAddress = utils.isAddress(searchTerm);
					if (!isAddress) return false;
					const tokenExists = tokensByAddress[searchTerm];
					return !tokenExists;
				}}
				onCreateOption={(x) => {
					const todoLogicForValidatingAddress = 1 === 1; // TODO make some calls with the address
					if (todoLogicForValidatingAddress) {
						const customToken = {
							name: 'Custom Token',
							address: x,
							decimals: 18,
							symbol: x,
							chainId: 1,
							logoURI: '',
							tags: [],
						};
						const newOption = { label: customToken.symbol, value: customToken };
						const meta: ActionMeta<Option> = {
							action: 'create-option',
							option: newOption,
						};
						props.onChange(newOption, meta);
						setCustomToken(customToken);
					} else {
						props.onValidationError('Not a valid ERC20 token');
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
