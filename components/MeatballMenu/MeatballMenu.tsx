import { useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import Link from 'next/link';

import Dropdown from 'components/Dropdown';
import ROUTES from 'constants/routes';
import { FlexDivCentered } from 'components/common';
import UI from 'containers/UI';
import { ThemeMode } from 'styles/theme';

import MeatballsIcon from 'assets/svg/meatballs-icon.svg';
import OptimismLogo from 'assets/svg/optimism-logo.svg';
import EthereumLogo from 'assets/svg/ethereum-logo.svg';
import GitbookLogo from 'assets/svg/gitbook-logo.svg';
import MoonIcon from 'assets/svg/moon.svg';
import SunIcon from 'assets/svg/sun.svg';
import { MeatBall } from 'components/Svg';

const MeatballMenu = () => {
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const { theme, setTheme } = UI.useContainer();

	const MeatballMenuContent = (
		<Content>
			<List>
				<ListElement>
					<Link href={ROUTES.Docs} passHref>
						<LinkInner target="_blank">
							<Image src={GitbookLogo} alt="gitbook logo" />
							<LinkLabel>Docs</LinkLabel>
						</LinkInner>
					</Link>
				</ListElement>
				<ListElement>
					<Link href={ROUTES.UniswapPoolOP} passHref>
						<LinkInner target="_blank">
							<Image src={OptimismLogo} alt="optimism logo" />
							<LinkLabel>Buy Aelin OP</LinkLabel>
						</LinkInner>
					</Link>
				</ListElement>
				<ListElement>
					<Link href={ROUTES.UniswapPoolL1} passHref>
						<LinkInner target="_blank">
							<Image src={EthereumLogo} alt="ethereum logo" />
							<LinkLabel>Buy Aelin L1</LinkLabel>
						</LinkInner>
					</Link>
				</ListElement>
				<ListElement
					onClick={() => setTheme(theme === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT)}
				>
					<FlexDivCentered>
						<Image src={theme === ThemeMode.LIGHT ? MoonIcon : SunIcon} alt="moon icon" />
						<LinkLabel>{theme === ThemeMode.LIGHT ? 'Dark mode' : 'Light mode'}</LinkLabel>
					</FlexDivCentered>
				</ListElement>
			</List>
		</Content>
	);
	return (
		<Dropdown
			isOpen={isDropdownOpen}
			setIsOpen={setIsDropdownOpen}
			content={MeatballMenuContent}
			hideArrow={true}
		>
			<StyledImage src={MeatballsIcon} alt="meatball icon" />
		</Dropdown>
	);
};

const Content = styled.div`
	width: 100%;
`;

const LinkInner = styled.a`
	display: flex;
	align-items: center;
`;

const LinkLabel = styled.span`
	margin-left: 8px;
`;

const List = styled.ul`
	padding: 0;
	margin: 0;
	list-style: none;
	width: 100%;
`;

const ListElement = styled.li`
	width: 100%;
	padding: 12px;
	cursor: pointer;
	&:hover {
		background-color: ${(props) => props.theme.colors.inputBorders};
	}
`;

const StyledImage = styled(MeatBall)`
	width: 20px;
	height: 20px;
	fill: ${(props) => props.theme.colors.paginationText};
`;
export default MeatballMenu;
