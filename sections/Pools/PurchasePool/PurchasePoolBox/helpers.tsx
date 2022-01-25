export const actionBoxTypeToTitle = (
	isPrivatePool: boolean,
	privatePoolAmount: string,
	purchaseTokenSymbol: string
) => {
	const privatePoolText = (
		<div>
			<div>Private pool</div>
			<div>{`${
				privatePoolAmount && Number(privatePoolAmount) > 0
					? `You may purchase up to ${privatePoolAmount} ${purchaseTokenSymbol}`
					: 'You have no allocation'
			}`}</div>
		</div>
	);
	const publicPoolText = 'Public pool';

	return isPrivatePool ? privatePoolText : publicPoolText;
};

export const getActionButtonLabel = ({
	allowance,
	amount,
	isPurchaseExpired,
	isPrivatePoolAndNoAllocation,
}: {
	allowance?: string;
	amount: string | number;
	isPurchaseExpired: boolean | undefined;
	isPrivatePoolAndNoAllocation: boolean | undefined;
}) => {
	if (isPrivatePoolAndNoAllocation) {
		return 'No Allocation';
	}

	if (Number(allowance ?? '0') < Number(amount) && !isPurchaseExpired) {
		return 'Approve';
	}

	return isPurchaseExpired ? 'Purchase Expired' : 'Purchase';
};
