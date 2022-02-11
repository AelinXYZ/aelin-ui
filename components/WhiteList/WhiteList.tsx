//@ts-nocheck
import { isEqual } from 'lodash';
import Image from 'next/image';
import styled from 'styled-components';
import { FC, useEffect, useState } from 'react';

import Button from 'components/Button';
import Input from 'components/Input/Input';
import UploadCSV from 'components/UploadCSV';
import BaseModal from 'components/BaseModal';

import { ColCenter } from 'sections/Layout/PageLayout';

import { Privacy, initialWhitelistValues } from 'constants/pool';

import Edit from 'assets/svg/edit.svg';
import Remove from 'assets/svg/remove.svg';

import { IWhitelistComponent, IWhitelist, IStyleColumnProps, IStyleRowProps } from './types';

const WhiteList: FC<IWhitelistComponent> = ({ formik, isModalOpen, setIsModalOpen }) => {
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
		setIsModalOpen(false);
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

	const handleClose = () => {
		const whitelist = [...formik.values.whitelist];

		const filteredWhitelist = whitelist.filter(
			(row: IWhitelist) => row.address.length && row.isSaved
		);

		if (!filteredWhitelist.length) {
			formik.setFieldValue('whitelist', initialWhitelistValues);

			formik.setFieldValue('poolPrivacy', Privacy.PUBLIC);
		} else {
			formik.setFieldValue('whitelist', filteredWhitelist);
		}

		setIsModalOpen(false);
	};

	return (
		<BaseModal
			title={'Whitelist'}
			onClose={handleClose}
			setIsModalOpen={setIsModalOpen}
			isModalOpen={isModalOpen}
		>
			<div>
				<ColCenter>
					<ContentBody>
						<Row>
							<Column width="60">
								<Row align="center">
									<Title>Address</Title>
									<UploadCSV onUploadCSV={handleUploadCSV} />
								</Row>
							</Column>
							<Column width="30">
								<Title>Amount</Title>
							</Column>
						</Row>
						<ContainerRow>
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
										<Column width="25" justify="center">
											<Input
												type="number"
												placeholder="Max allocation"
												disabled={formik.values.whitelist[index].isSaved}
												name={`whitelist.${index}.amount`}
												value={formik.values.whitelist[index].amount}
												onChange={formik.handleChange}
											/>
										</Column>
										<Column width="15" justify="center">
											<Row align="center" justify="flex-end">
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
						</ContainerRow>
						<Row>
							<Column>
								<Button size="lg" variant="tertiary" onClick={handleAddRows}>
									+ Add more rows
								</Button>
							</Column>
						</Row>
						<Row justify="flex-end">
							<StyledButton
								size="lg"
								isRounded
								variant="secondary"
								disabled={isClearDisabled}
								onClick={handleClear}
							>
								Clear
							</StyledButton>
							<Button
								size="lg"
								isRounded
								variant="primary"
								disabled={isSaveDisabled}
								onClick={handleSave}
							>
								Save
							</Button>
						</Row>
					</ContentBody>
				</ColCenter>
			</div>
		</BaseModal>
	);
};

const ContentBody = styled.div`
	width: 610px;
	border-radius: 8px;
`;

const Pointer = styled.span`
	cursor: pointer;
	line-height: 1px;
	margin: 0 2px;
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

const ContainerRow = styled(Row)`
	max-height: 400px;
	overflow-y: scroll;
`;

const Title = styled.span`
	font-size: 1.2rem;
	color: ${(props) => props.theme.colors.forestGreen};
`;

const StyledButton = styled(Button)`
	margin: 0 10px;
`;

export default WhiteList;
