import styled from 'styled-components';

export const FlexDiv = styled.div`
	display: flex;
`;

export const FlexDivCol = styled.div`
	display: flex;
	flex-direction: column;
`;

export const FlexDivCenterAligned = styled.div`
	display: flex;
	align-items: center;
`;

export const FlexDivCentered = styled(FlexDiv)`
	align-items: center;
`;

export const FlexDivRow = styled(FlexDiv)`
	justify-content: space-between;
`;

export const FlexDivRowCentered = styled(FlexDivRow)`
	align-items: center;
`;

export const FlexDivColCentered = styled(FlexDivCol)`
	align-items: center;
`;
