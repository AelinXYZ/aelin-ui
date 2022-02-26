import styled from 'styled-components';

const Icon = styled.svg`
	width: 14px;
	height: 14px;
`;

export const DownArrow = ({ className }: { className?: string }) => (
	<Icon viewBox="0 0 14 14" className={className}>
		<path d="M6 9L0.803847 -2.51245e-08L11.1962 8.834e-07L6 9Z" />
	</Icon>
);

export const MeatBall = ({ className }: { className?: string }) => (
	<Icon viewBox="0 0 22 6" className={className}>
		<circle cx="19" cy="3" r="2.75" transform="rotate(90 19 3)" stroke-width="0.5" />
		<circle cx="11" cy="3" r="2.75" transform="rotate(90 11 3)" stroke-width="0.5" />
		<circle cx="3" cy="3" r="2.75" transform="rotate(90 3 3)" stroke-width="0.5" />
	</Icon>
);
