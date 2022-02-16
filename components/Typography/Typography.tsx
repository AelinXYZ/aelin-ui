//@ts-nocheck
import { ReactNode } from 'react';
import styled, { CSSProperties } from 'styled-components';

export enum TypographyVariant {
	h1 = 'h1',
	h2 = 'h2',
	h3 = 'h3',
	h4 = 'h4',
	h5 = 'h5',
	p = 'p',
	span = 'span',
}

const defaultVariant = TypographyVariant.span;

interface ITypography {
	variant: TypographyVariant;
	children: ReactNode;
	color: string;
}

interface IVariant {
	style?: CSSProperties;
}

const Typography: React.FC<ITypography> = ({
	variant,
	children,
	className,
	...style
}: ITypography) => {
	const Component = variant ?? defaultVariant;
	return (
		<Component className={className} style={style}>
			{children}
		</Component>
	);
};

const StyledTypography = styled(Typography)<IVariant>`
	color: ${(props) => props?.color ?? props.theme.colors.grey};
`;

export { StyledTypography as Typography };
export default StyledTypography;
