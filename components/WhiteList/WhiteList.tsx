//@ts-nocheck
import { isEqual } from 'lodash';
import Image from 'next/image';
import styled from 'styled-components';
import { FC, useEffect, useState } from 'react';

import Button from 'components/Button';
import Input from 'components/Input/Input';
import UploadCSV from 'components/UploadCSV';

import { ColCenter, ContentTitle } from 'sections/Layout/PageLayout';

import { Privacy, initialWhitelistValues } from 'constants/pool';

import Edit from 'assets/svg/edit.svg';
import Remove from 'assets/svg/remove.svg';

import { IWhitelistComponent, IWhitelist, IStyleColumnProps, IStyleRowProps } from './types';

const Whitelist: FC<IWhitelistComponent> = ({ formik }) => {
	const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(false);
	const [isClearDisabled, setIsClearDisabled] = useState<boolean>(true);

	useEffect(() => {
		const whitelist = [...formik.values.whitelist];
		const filteredWhitelist = whitelist.filter((row: IWhitelist) => row.address.length);

		if (!filteredWhitelist.length) {
			setIsSaveDisabled(false);
			return;
		}

		const isSaved = filteredWhitelist.every((row: IWhitelist) => row.isSaved);
		setIsSaveDisabled(isSaved);
	}, [formik.values.whitelist]);

	useEffect(() => {
		if (isEqual(formik.values.whitelist, initialWhitelistValues)) {
			setIsClearDisabled(true);
		} else {
			setIsClearDisabled(false);
		}
	}, [formik.values.whitelist]);

	const clearAddresses = (): void => {
		formik.setFieldValue('whitelist', initialWhitelistValues);
	};

	const handleEditRow = (index: number): void => {
		const whitelist = [...formik.values.whitelist];

		whitelist[index].isSaved = false;

		formik.setFieldValue('whitelist', whitelist);
	};

	const handleAddRows = (): void => {
		const whitelist = [...formik.values.whitelist, ...initialWhitelistValues];

		setIsSaveDisabled(false);

		formik.setFieldValue('whitelist', whitelist);
	};

	const handleRemoveRow = (index: number): void => {
		const whitelist = formik.values.whitelist.filter((_, idx: number) => index !== idx);

		formik.setFieldValue('whitelist', whitelist);
	};

	const handleUploadCSV = (whitelist: IWhitelist[]): void => {
		formik.setFieldValue('whitelist', [...whitelist]);
	};

	const handleClear = () => {
		clearAddresses();
		setIsSaveDisabled(false);
		formik.setFieldValue('poolPrivacy', Privacy.PUBLIC);
	};

	const handleSave = (): void => {
		const whitelist = [...formik.values.whitelist];

		const filteredWhitelist = whitelist.filter((row: IWhitelist) => row.address.length);

		if (!filteredWhitelist.length) return;

		filteredWhitelist.forEach((row: IWhitelist) => {
			row.isSaved = true;
		});

		setIsSaveDisabled(true);

		formik.setFieldValue('whitelist', filteredWhitelist);
	};

	return (
		<Container>
			<ColCenter>
				<HeaderRow>
					<Column width="70">
						<ContentTitle>Allowlist</ContentTitle>
					</Column>
					<Column width="30" justify="center" align="flex-end">
						<UploadCSV onUploadCSV={handleUploadCSV} />
					</Column>
				</HeaderRow>
				<ContentBody>
					<Row>
						<Column width="60">
							<Title>Address</Title>
						</Column>
						<Column width="30">
							<Title>Amount</Title>
						</Column>
					</Row>
					<Row>
						{formik.values.whitelist.map((_: string, index: number) => {
							return (
								<Row key={`row-${index}`} align="center">
									<Column width="60" justify="center">
										<Input
											type="text"
											disabled={formik.values.whitelist[index].isSaved}
											placeholder="Add address"
											name={`whitelist.${index}.address`}
											value={formik.values.whitelist[index].address}
											onChange={formik.handleChange}
										/>
									</Column>
									<Column width="20" justify="center">
										<Input
											type="number"
											placeholder="Max allocation"
											disabled={formik.values.whitelist[index].isSaved}
											name={`whitelist.${index}.amount`}
											value={formik.values.whitelist[index].amount}
											onChange={formik.handleChange}
										/>
									</Column>
									<Column width="20" justify="center">
										<Row align="center" justify="center">
											<Pointer onClick={() => handleEditRow(index)}>
												<Image src={Edit} alt="edit icon" />
											</Pointer>
											<Pointer onClick={() => handleRemoveRow(index)}>
												<Image src={Remove} alt="remove icon" />
											</Pointer>
										</Row>
									</Column>
								</Row>
							);
						})}
					</Row>
					<Row>
						<Column>
							<Button size="lg" variant="text" onClick={handleAddRows}>
								+ Add more rows
							</Button>
						</Column>
					</Row>
					<Row>
						<Button size="lg" variant="round" disabled={isSaveDisabled} onClick={handleSave}>
							Save
						</Button>
						<Button size="lg" variant="round" disabled={isClearDisabled} onClick={handleClear}>
							Clear
						</Button>
					</Row>
				</ContentBody>
			</ColCenter>
		</Container>
	);
};

const Container = styled.div`
	margin-top: 40px;
`;

const ContentBody = styled.div`
	max-width: 621px;
	padding: 20px;
	border-radius: 8px;
	background-color: #e2e2e2;
	border: 1px solid #c4c4c4;
`;

const Pointer = styled.span`
	cursor: pointer;
	line-height: 1px;
`;

const Column = styled.div<IStyleColumnProps>`
	display: flex;
	flex-direction: column;
	padding: 0 5px 0 0;
	width: ${(props) => props.width || '100'}%;
	justify-content: ${(props) => props.justify || 'flex-start'};
	align-items: ${(props) => props.align || 'flex-start'};
`;

const Row = styled.div<IStyleRowProps>`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	width: 100%;
	padding: 3px 0;
	justify-content: ${(props) => props.justify || 'flex-start'};
	align-items: ${(props) => props.align || 'flex-start'};
`;

const HeaderRow = styled(Row)`
	max-width: 621px;
	margin-bottom: 34px;
`;

const Title = styled.span`
	font-size: 1.2rem;
	margin-bottom: 5px;
	color: ${(props) => props.theme.colors.forestGreen};
`;

const Subtitle = styled.span`
	font-size: 1rem;
`;

export default Whitelist;
