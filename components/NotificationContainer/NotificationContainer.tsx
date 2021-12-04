import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationContainer = () => {
	return typeof document !== 'undefined'
		? createPortal(
				<StyledToastContainer autoClose={false} position="bottom-right" closeOnClick={false} />,
				document.body
		  )
		: null;
};

const StyledToastContainer = styled(ToastContainer)`
	.Toastify__toast {
		background-color: ${(props) => props.theme.colors.cell};
		color: ${(props) => props.theme.colors.black};
		border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	}
	.Toastify__toast-body {
		font-family: ${(props) => props.theme.fonts.agrandir};
		font-size: 14px;
		line-height: 14px;
	}
	.Toastify__progress-bar {
		background: ${(props) => props.theme.colors.headerGreen};
		box-shadow: 0px 0px 15px rgb(0 209 255 / 60%);
	}
	.Toastify__close-button > svg {
		fill: ${(props) => props.theme.colors.black};
	}
`;

export default NotificationContainer;
