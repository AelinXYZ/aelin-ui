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
		<circle cx="19" cy="3" r="2.75" transform="rotate(90 19 3)" strokeWidth="0.5" />
		<circle cx="11" cy="3" r="2.75" transform="rotate(90 11 3)" strokeWidth="0.5" />
		<circle cx="3" cy="3" r="2.75" transform="rotate(90 3 3)" strokeWidth="0.5" />
	</Icon>
);

export const LeftArrow = ({ className }: { className?: string }) => (
	<Icon viewBox="0 0 8 14" className={className}>
		<path d="M7.88999 1.57999L6.70332 0.399994L0.109985 6.99999L6.70999 13.6L7.88999 12.42L2.46999 6.99999L7.88999 1.57999Z" />
	</Icon>
);

export const RightArrow = ({ className }: { className?: string }) => (
	<Icon viewBox="0 0 8 14" className={className}>
		<path d="M0.109985 12.42L1.28999 13.6L7.88999 6.99999L1.28999 0.399994L0.109985 1.57999L5.52999 6.99999L0.109985 12.42H0.109985Z" />
	</Icon>
);

export const LeftEndArrow = ({ className }: { className?: string }) => (
	<Icon viewBox="0 0 16 16" className={className}>
		<path d="M13.89 2.57999L12.7033 1.39999L6.10999 7.99999L12.71 14.6L13.89 13.42L8.46999 7.99999L13.89 2.57999Z" />
		<path d="M2.66666 1.33806L4.34015 1.33334L4.33543 14.499H2.66666L2.66666 1.33806Z" />
	</Icon>
);

export const RightEndArrow = ({ className }: { className?: string }) => (
	<Icon viewBox="0 0 16 16" className={className}>
		<path d="M2.11001 2.57999L3.29668 1.39999L9.89001 7.99999L3.29001 14.6L2.11001 13.42L7.53001 7.99999L2.11001 2.57999Z" />
		<path d="M13.3333 1.33806L11.6599 1.33334L11.6646 14.499H13.3333L13.3333 1.33806Z" />
	</Icon>
);

export const CopyIcon = ({ className }: { className?: string }) => (
	<Icon viewBox="0 0 16 16" className={className}>
		<path d="M10.4848 1.33331H3.21212C2.54545 1.33331 2 1.87877 2 2.54543V11.0303H3.21212V2.54543H10.4848V1.33331ZM12.303 3.75756H5.63637C4.9697 3.75756 4.42425 4.30301 4.42425 4.96968V13.4545C4.42425 14.1212 4.9697 14.6666 5.63637 14.6666H12.303C12.9697 14.6666 13.5152 14.1212 13.5152 13.4545V4.96968C13.5152 4.30301 12.9697 3.75756 12.303 3.75756ZM5.63636 13.4545H12.303V4.96968H5.63636V13.4545Z" />
	</Icon>
);

export const EtherscanLinkIcon = ({ className }: { className?: string }) => (
	<Icon viewBox="0 0 16 16" className={className}>
		<path d="M3.33333 3.33333V12.6667H12.6667V8H14V12.6667C14 13.4 13.4 14 12.6667 14H3.33333C2.59333 14 2 13.4 2 12.6667V3.33333C2 2.6 2.59333 2 3.33333 2H8V3.33333H3.33333ZM9.33333 3.33333V2H14V6.66667H12.6667V4.27333L6.11333 10.8267L5.17333 9.88667L11.7267 3.33333H9.33333Z" />
	</Icon>
);
