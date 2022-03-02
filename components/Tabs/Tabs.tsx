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

	useEffect(() => {
		setSelectedIndex(defaultIndex);
	}, [defaultIndex]);

	const onChangeTab = (nextIndex: number) => {
		if (selectedIndex === nextIndex) {return;}
		setSelectedIndex(nextIndex);
		if (onSelect) {onSelect(nextIndex);}
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
								disabled={!!tab.props.disabled}
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
					'aria-labelledby': `${tabs[selectedIndex].props.label}-${selectedIndex}`,
				})}
		</Tab>
	);
};

const TabList = styled.ul`
	display: flex;
	list-style: none;
	padding: 0;
	max-width: 720px;
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
			border-right: 1px solid ${(props) => props.theme.colors.tabBorders};
			border-top-right-radius: 8px;
			border-bottom-right-radius: 8px;
		}
	}
`;

const TabLink = styled.button`
	background-color: ${(props) => props.theme.colors.tabBackground};
	border-top: 1px solid
		${(props) => (props.disabled ? props.theme.colors.grey5 : props.theme.colors.tabBorders)};
	border-bottom: 1px solid
		${(props) => (props.disabled ? props.theme.colors.grey5 : props.theme.colors.tabBorders)};
	border-left: 1px solid
		${(props) => (props.disabled ? props.theme.colors.grey5 : props.theme.colors.tabBorders)};
	border-right: 0;
	width: 100%;
	padding: 0.5rem 0;
	color: ${(props) => (props.disabled ? props.theme.colors.grey5 : props.theme.colors.tabText)};

	cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

	${(props) =>
		props['aria-selected'] &&
		css`
			cursor: default;
			background-color: ${(props) => props.theme.colors.selectedTabBackground};
			color: ${(props) => props.theme.colors.selectedTabText};
			font-weight: 600;
		`};
`;

const Tab = styled.div<{ label?: string; disabled?: boolean }>``;

export default Tabs;
export { Tab };
