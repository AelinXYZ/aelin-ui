import { FC } from 'react';
import { useFormik } from 'formik';

import Connector from 'containers/Connector';

import { FlexDivRow } from 'components/common';
import TextInput from 'components/Input/TextInput';
import Input from 'components/Input/Input';

import validateCreateDeal from 'utils/validate/create-deal';
import CreateForm from 'sections/shared/CreateForm';

const CreateDeal: FC = () => {
	const { walletAddress } = Connector.useContainer();
	const canCreateDeal = true;

	const formik = useFormik({
		initialValues: {
			underlyingDealToken: '',
			purchaseTokenTotal: 0,
			underlyingDealTokenTotal: 0,
			vestingPeriodDays: 0,
			vestingPeriodHours: 0,
			vestingPeriodMinutes: 0,
			vestingCliffDays: 0,
			vestingCliffHours: 0,
			vestingCliffMinutes: 0,
			proRataRedemptionDays: 0,
			proRataRedemptionHours: 0,
			proRataRedemptionMinutes: 0,
			openRedemptionDays: 0,
			openRedemptionHours: 0,
			openRedemptionMinutes: 0,
			holderFundingExpiryDays: 0,
			holderFundingExpiryHours: 0,
			holderFundingExpiryMinutes: 0,
			holder: '',
		},
		validate: validateCreateDeal,
		onSubmit: (values) => {
			alert(JSON.stringify(values, null, 2));
		},
	});
	const createDealGridItems = useMemo(
		() => [
			{
				header: <label htmlFor="underlyingDealToken">Underlying Deal Token address</label>,
				subText: 'the deal token pool holders want',
				formField: (
					<TextInput
						id="underlyingDealToken"
						name="underlyingDealToken"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.underlyingDealToken}
					/>
				),
				formError: formik.errors.underlyingDealToken,
			},
			{
				header: <label htmlFor="poolCap">Pool Cap (Underlying Deal Tokens)</label>,
				subText: 'Uncapped if left blank or 0',
				formField: (
					<Input
						id="poolCap"
						name="poolCap"
						type="number"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.poolCap}
					/>
				),
				formError: formik.errors.poolCap,
			},
			{
				header: <label htmlFor="duration">Duration</label>,
				subText: 'Input days - hours - minutes',
				formField: (
					<FlexDivRow>
						<Input
							width="50px"
							id="durationDays"
							name="durationDays"
							type="number"
							placeholder="days"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.durationDays || ''}
						/>
						<Input
							width="55px"
							id="durationHours"
							name="durationHours"
							type="number"
							placeholder="hours"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.durationHours || ''}
						/>
						<Input
							width="50px"
							id="durationMinutes"
							name="durationMinutes"
							type="number"
							placeholder="mins"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.durationMinutes || ''}
						/>
					</FlexDivRow>
				),
				formError: formik.errors.durationMinutes,
			},
			{
				header: <label htmlFor="sponsorFee">Sponsor Fee</label>,
				subText: 'Optional fee from 0 to 98%',
				formField: (
					<Input
						id="sponsorFee"
						name="sponsorFee"
						type="number"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.sponsorFee}
					/>
				),
				formError: formik.errors.sponsorFee,
			},
			{
				header: <label htmlFor="sponsorFee">Name</label>,
				subText: 'Name of the pool',
				formField: (
					<TextInput
						id="poolName"
						name="poolName"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.poolName}
					/>
				),
				formError: formik.errors.poolName,
			},
			{
				header: <label htmlFor="sponsorFee">Symbol</label>,
				subText: 'Symbol of the pool',
				formField: (
					<TextInput
						id="poolSymbol"
						name="poolSymbol"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.poolSymbol}
					/>
				),
				formError: formik.errors.poolSymbol,
			},
			{
				header: <label htmlFor="purchaseExpiry">Expiry</label>,
				subText: 'Time to purchase deal tokens',
				formField: (
					<FlexDivRow>
						<Input
							width="50px"
							id="purchaseExpiryDays"
							name="purchaseExpiryDays"
							type="number"
							placeholder="days"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.purchaseExpiryDays || ''}
						/>
						<Input
							width="55px"
							id="purchaseExpiryHours"
							name="purchaseExpiryHours"
							type="number"
							placeholder="hours"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.purchaseExpiryHours || ''}
						/>
						<Input
							width="50px"
							id="purchaseExpiryMinutes"
							name="purchaseExpiryMinutes"
							type="number"
							placeholder="mins"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.purchaseExpiryMinutes || ''}
						/>
					</FlexDivRow>
				),
				formError: formik.errors.purchaseExpiryMinutes,
			},
			{
				header: '',
				subText: '',
			},
			{
				header: '',
				subText: '',
			},
		],
		[formik]
	);
	const summaryItems = useMemo(
		() => [
			{
				label: 'Sponsor',
				text: walletAddress != null ? truncateAddress(walletAddress) : 'Connect Wallet',
			},
			{
				label: 'Cap:',
				text: 'some text',
			},
			{
				label: 'Currency:',
				text: 'some text',
			},
			{
				label: 'Fee:',
				text: 'some text',
			},
			{
				label: 'Duration:',
				text: 'some text',
			},
			{
				label: 'Name:',
				text: 'some text',
			},
			{
				label: 'Symbol:',
				text: 'some text',
			},
			{
				label: 'Expiry:',
				text: 'some text',
			},
		],
		[walletAddress]
	);

	return (
		<CreateForm formik={formik} gridItems={gridItems} summaryItems={summaryItems} type="Pool" />
	);
};
