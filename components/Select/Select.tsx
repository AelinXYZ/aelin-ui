import React, { useMemo } from 'react';
import ReactSelect, { GroupBase, Props, StylesConfig } from 'react-select';
import { useTheme } from 'styled-components';

import { IndicatorSeparator, DropdownIndicator, MultiValueRemove } from './components';

type Variant = 'solid' | 'outline';

export function useSelectStyles<
	Option,
	IsMulti extends boolean = false,
	Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group> & { variant: Variant }) {
	const { colors, fonts } = useTheme();

	return useMemo(() => {
		const styles: StylesConfig<Option, IsMulti, Group> = {
			container: (style, state) => ({
				...style,
				opacity: state.isDisabled ? 0.4 : 1,
				backgroundColor: colors.tableHeaderText,
			}),
			singleValue: (style) => ({
				...style,
				color: colors.black,
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
				background: colors.tableHeaderText,
				borderRadius: 0,
				color: colors.black,
				fontSize: '12px',
				padding: 0,
				paddingLeft: 0,
			}),
			multiValueRemove: (style) => ({
				...style,
				background: colors.tableHeaderText,
				borderRadius: 0,
				color: colors.black,
				'&:hover': {
					background: colors.tableHeaderText,
					color: colors.textButton,
				},
				padding: 0,
			}),
			noOptionsMessage: (style) => ({
				...style,
				fontSize: '12px',
				color: colors.black,
			}),
			control: (style) => {
				const baseStyles = {
					...style,
					fontFamily: fonts.ASMRegular,
					color: colors.textButton,
					cursor: 'pointer',
					borderRadius: '4px',
					outline: 'none',
					fontSize: '12px',
					backgroundColor: colors.white,
					height: '32px',
					minHeight: '32px',
				};
				if (props.variant === 'outline') {
					return {
						...baseStyles,
						border: `1px solid ${colors.tableBorders}`,
						boxShadow: 'none',
						'&:hover': {
							border: `1px solid ${colors.tableBorders}`,
							outline: 'none',
						},
					};
				}
				return {
					...baseStyles,
					border: 'none',
					boxShadow: `0px 0px 20px ${colors.tableBorders}`,
					'&:hover': {
						border: 'none',
					},
				};
			},
			menu: (style) => ({
				...style,
				backgroundColor: colors.tableHeaderText,
				border: 'none',
				boxShadow: `0px 0px 20px ${colors.tableBorders}`,
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
					backgroundColor: colors.tableHeaderText,
					'&:hover': {
						backgroundColor: colors.heading,
						color: colors.textHover,
					},
				};

				if (props.variant === 'outline') {
					return {
						...baseStyles,
						color: colors.textBody,
					};
				}

				return {
					...baseStyles,
					color: colors.textBody,
				};
			},
			placeholder: (style) => ({
				...style,
				fontSize: '12px',
				color: colors.textBody,
				textTransform: 'capitalize',
			}),
			dropdownIndicator: (style, state) => ({
				...style,
				color: state.selectProps.menuIsOpen ? colors.textBody : colors.textButton,
				transition: 'transform 0.2s ease-in-out',
				transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'none',
			}),
		};
		return styles;
	}, [colors, fonts, props.variant]);
}

function Select<
	Option,
	IsMulti extends boolean = false,
	Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group> & { variant: Variant }) {
	const computedStyles = useSelectStyles(props);

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
