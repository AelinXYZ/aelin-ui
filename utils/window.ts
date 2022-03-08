const scrollToBottom = () => {
	window.scroll({
		top: document.body.offsetHeight,
		left: 0,
		behavior: 'smooth',
	});
};

export { scrollToBottom };
