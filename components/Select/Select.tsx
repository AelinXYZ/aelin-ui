import React, { useMemo } from 'react';
import ReactSelect, { Props, StylesConfig } from 'react-select';
import { useTheme } from 'styled-components';

import { IndicatorSeparator, DropdownIndicator, MultiValueRemove } from './components';

type SelectProps<T> = Props<T> & {
	variant?: 'solid' | 'outline';
};

function Select<T>(props: SelectProps<T>) {
	const { colors, fonts } = useTheme();

	const computedStyles = useMemo(() => {
		const styles: StylesConfig = {
			container: (style, state) => ({
				...style,
				opacity: state.isDisabled ? 0.4 : 1,
				backgroundColor: colors.grey,
			}),
			singleValue: (style) => ({
				...style,
				color: colors.white,
				boxShadow: `0px 0px 20px ${colors.buttonStroke}`,
				fontSize: '12px',
				border: 'none',
			}),
			multiValue: (style) => ({
				...style,
				background: 'none',
				alignItems: 'flex-end',
			}),
			multiValueLabel: (style) => ({
				...style,
				background: colors.grey,
				borderRadius: 0,
				color: colors.white,
				fontSize: '12px',
				padding: 0,
				paddingLeft: 0,
			}),
			multiValueRemove: (style) => ({
				...style,
				background: colors.grey,
				borderRadius: 0,
				color: colors.black,
				'&:hover': {
					background: colors.grey,
					color: colors.white,
				},
				padding: 0,
			}),
			noOptionsMessage: (style) => ({
				...style,
				fontSize: '12px',
				color: colors.white,
			}),
			control: (style) => {
				const baseStyles = {
					...style,
					fontFamily: fonts.ASMRegular,
					color: colors.white,
					cursor: 'pointer',
					borderRadius: '4px',
					outline: 'none',
					fontSize: '12px',
					backgroundColor: colors.grey,
				};
				if (props.variant === 'outline') {
					return {
						...baseStyles,
						border: `1px solid ${colors.buttonStroke}`,
						boxShadow: 'none',
						'&:hover': {
							backgroundColor: colors.forestGreen,
							border: `1px solid ${colors.buttonStroke}`,
							outline: 'none',
						},
					};
				}
				return {
					...baseStyles,
					border: 'none',
					boxShadow: `0px 0px 20px ${colors.buttonStroke}`,
					'&:hover': {
						border: 'none',
					},
				};
			},
			menu: (style) => ({
				...style,
				backgroundColor: colors.grey,
				border: 'none',
				boxShadow: `0px 0px 20px ${colors.buttonStroke}`,
				padding: 0,
			}),
			menuList: (style) => ({
				...style,
				borderRadius: 0,
				padding: 0,
				textAlign: 'left',
			}),
			option: (style) => {
				const baseStyles = {
					...style,
					fontFamily: fonts.ASMRegular,
					cursor: 'pointer',
					padding: '12px 10px',
					fontSize: '12px',
					backgroundColor: colors.grey,
					'&:hover': {
						backgroundColor: colors.forestGreen,
						color: colors.white,
					},
				};

				if (props.variant === 'outline') {
					return {
						...baseStyles,
						color: colors.white,
					};
				}

				return {
					...baseStyles,
					color: colors.black,
				};
			},
			placeholder: (style) => ({
				...style,
				fontSize: '12px',
				color: colors.white,
				textTransform: 'capitalize',
			}),
			dropdownIndicator: (style, state) => ({
				...style,
				color: state.selectProps.menuIsOpen ? colors.white : colors.black,
				transition: 'transform 0.2s ease-in-out',
				transform: state.selectProps.menuIsOpen && 'rotate(180deg)',
			}),
		};
		return styles;
	}, [colors, fonts, props.variant]);

	const { components, ...rest } = props;

	return (
		<ReactSelect
			styles={computedStyles}
			classNamePrefix="react-select"
			components={{ IndicatorSeparator, DropdownIndicator, MultiValueRemove, ...components }}
			{...rest}
		/>
	);
}

export default Select;
