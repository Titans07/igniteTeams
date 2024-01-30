import "styled-components";
import theme from '../theme';

declare module 'styled-component' {
    type ThemeType = typeof theme;

    export interface DefaultTheme extends ThemeType { }
}