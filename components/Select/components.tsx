//@ts-nocheck
import React from 'react';
import { components, IndicatorProps } from 'react-select';
import Image from 'next/image';

import CaretDownIcon from 'assets/svg/caret-down.svg';
import CloseIcon from 'assets/svg/menu-close.svg';

export const IndicatorSeparator = () => null;

export const DropdownIndicator = (props: IndicatorProps<any>) => (
	<components.DropdownIndicator {...props}>
		<Image src={CaretDownIcon} alt="down" />
	</components.DropdownIndicator>
);

export const MultiValueRemove = (props: IndicatorProps<any>) => (
	<components.MultiValueRemove {...props}>
		<span
			style={{ display: 'inline-block', lineHeight: 1, paddingLeft: '4px', paddingRight: '4px' }}
		>
			<Image src={CloseIcon} alt="close" width="10" height="10" />
		</span>
	</components.MultiValueRemove>
);
