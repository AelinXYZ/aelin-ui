import { FC } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import SearchIcon from 'assets/svg/search-icon.svg';

const SearchInput: FC = () => {
	return (
		<Container>
			<Input type="text" placeholder="Search" />
			<ImageContainer>
				<Image src={SearchIcon} alt="search icon" />
			</ImageContainer>
		</Container>
	);
};

const Container = styled.div`
	position: relative;
`;

const ImageContainer = styled.div`
	position: absolute;
	top: 50%;
	left: 14px;
	transform: translateY(-50%);
`;

const Input = styled.input`
	outline: none;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 152px;
	background-color: ${(props) => props.theme.colors.background};
	border-radius: 100px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	height: 35px;
	padding: 12px 30px;
	&::placeholder {
		font-display: ${(props) => props.theme.fonts.agrandir};
		font-size: 12px;
	}
`;

export default SearchInput;
