import { FC, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { Props } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { useSelectStyles } from 'components/Select/Select';
import {
	IndicatorSeparator,
	DropdownIndicator,
	MultiValueRemove,
} from 'components/Select/components';

import { Status } from 'components/DealStatus';
import { statusToText } from 'constants/pool';

type Option = { labesl: Status; value: Status };
type StatusDropdownProps = Props<Option, false> & {
	variant: 'solid' | 'outline';
	selectedStatus: Status | string;
	onChange: Dispatch<SetStateAction<Status | string>>;
};

const statusToOption = (status: Status | string) => ({
	value: status,
	label: statusToText(status as Status),
});

const StatusDropdown: FC<StatusDropdownProps> = (props) => {
	const computedStyles = useSelectStyles(props);

	const options = (Object.keys(Status) as Array<keyof typeof Status>)
		.filter((key) => key !== 'Closed' && key !== 'OpenRedemption' && key !== 'ProRataRedemption')
		.map(statusToOption);

	options.push({ label: 'Reset', value: null });

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
				placeholder="Select Status"
				onChange={(x) => {
					props.onChange(x.value);
				}}
				allowCreateWhileLoading={false}
				// @ts-ignore
				options={options}
				// @ts-ignore
				value={statusToOption(props.selectedStatus)}
			/>
		</Container>
	);
};

const Container = styled.div`
	width: 22%;
	height: 35px;
	color: ${(props) => props.theme.colors.white};
`;

export default StatusDropdown;
