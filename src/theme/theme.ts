import { createMuiTheme } from '@material-ui/core/styles';
import deepOrange from '@material-ui/core/colors/deepOrange';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: 'rgb(238,238,238)'
    },
    secondary: {
      main: 'rgba(238,238,238, 0.5)',
      contrastText: '#fff'
    },
    error: {
      main: '#e73631'
    }
  },
  typography: {
    button: {
      textTransform: 'none'
    }
  },
  overrides: {
    MuiTextField: {
      root: {
        '& .MuiInputBase-input::-ms-clear': {
          display: 'none'
        }
      }
    }
  }
});
