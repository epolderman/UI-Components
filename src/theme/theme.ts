import { createMuiTheme } from '@material-ui/core/styles';
import deepOrange from '@material-ui/core/colors/deepOrange';
import blueGrey from '@material-ui/core/colors/blueGrey';

export const theme = createMuiTheme({
  palette: {
    primary: deepOrange,
    secondary: {
      main: '#2980b9'
    }
  }
});
