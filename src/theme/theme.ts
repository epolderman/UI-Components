import { createMuiTheme } from '@material-ui/core/styles';
import deepOrange from '@material-ui/core/colors/deepOrange';

export const theme = createMuiTheme({
  palette: {
    primary: deepOrange,
    secondary: {
      main: '#2980b9'
    }
  },
  typography: {
    button: {
      textTransform: 'none'
    }
  }
});
