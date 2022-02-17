import React, { FC, useEffect, useState, useMemo } from 'react';
import styled, { css } from 'styled-components';

interface TabsProps {
	children: React.ReactNode;
	defaultIndex: number;
	onSelect?: (newIndex: number) => void;
}

const Tabs: FC<TabsProps> = ({ children, defaultIndex, onSelect }) => {
	const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex ?? 0);
	const [tabs, setTabs] = useState<any[]>(() => React.Children.toArray(children));

	useEffect(() => {
		setTabs(React.Children.toArray(children));
	}, [children]);

	const onChangeTab = (nextIndex: number) => {
		if (selectedIndex === nextIndex) return;
		setSelectedIndex(nextIndex);
		if (onSelect) onSelect(nextIndex);
	};

	const tabWidth = useMemo(() => {
		const fullWidth = 100;
		return fullWidth / tabs.length;
	}, [tabs.length]);

	return (
		<Tab>
			<TabList role="tablist">
				{tabs.map((tab, index) => {
					const tabIsSelected = selectedIndex === index;

					return (
						<TabListItem role="presentation" key={`${index}-tab`} style={{ width: `${tabWidth}%` }}>
							<TabLink
								type="button"
								role="tab"
								id={`id-${index}`}
								tabIndex={tabIsSelected ? 0 : -1}
								aria-selected={tabIsSelected}
								aria-controls={index + '-tab'}
								onClick={() => onChangeTab(index)}
							>
								{tab.props.label}
							</TabLink>
						</TabListItem>
					);
				})}
			</TabList>
			{tabs[selectedIndex] &&
				React.cloneElement(tabs[selectedIndex], {
					role: 'tabpanel',
					id: `${tabs[selectedIndex].props.label}-${selectedIndex}-tab`,
					'aria-labelledby': `${tabs[selectedIndex].props.label}-${selectedIndex}`,
				})}
		</Tab>
	);
};

const TabList = styled.ul`
	display: flex;
	list-style: none;
	padding: 0;
`;

const TabListItem = styled.li`
	text-align: center;

	&:first-child {
		> button {
			border-top-left-radius: 8px;
			border-bottom-left-radius: 8px;
		}
	}

	&:last-child {
		> button {
			border-right: 1px solid ${(props) => props.theme.colors.forestGreen};
			border-top-right-radius: 8px;
			border-bottom-right-radius: 8px;
		}
	}
`;

const TabLink = styled.button`
	background-color: ${(props) => props.theme.colors.white};
	border-top: 1px solid ${(props) => props.theme.colors.forestGreen};
	border-bottom: 1px solid ${(props) => props.theme.colors.forestGreen};
	border-left: 1px solid ${(props) => props.theme.colors.forestGreen};
	border-right: 0;
	width: 100%;
	padding: 0.5rem 0;
	color: ${(props) => props.theme.colors.forestGreen};
	cursor: pointer;

	${(props) =>
		props['aria-selected'] &&
		css`
			cursor: default;
			background-color: ${(props) => props.theme.colors.forestGreen};
			color: ${(props) => props.theme.colors.white};
			font-weight: 600;
		`};
`;

const Tab = styled.div<{ label?: string }>``;

export default Tabs;
export { Tab };
