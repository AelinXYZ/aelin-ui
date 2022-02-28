import { createContainer } from 'unstated-next';
import useLocalStorage from 'hooks/useLocalStorage';

import { ThemeMode } from 'styles/theme';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';

const useUI = () => {
	const [theme, setTheme] = useLocalStorage<ThemeMode>(
		LOCAL_STORAGE_KEYS.SELECTED_THEME,
		ThemeMode.LIGHT
	);

	return { theme, setTheme };
};

const UI = createContainer(useUI);

export default UI;
