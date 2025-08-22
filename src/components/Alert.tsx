import { forwardRef, useImperativeHandle, useState } from 'react';
import { Snackbar, Alert as MuiAlert, AlertColor } from '@mui/material';
import { AlertProps } from '@mui/material/Alert';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type AlertState = {
  open: boolean;
  message: string;
  severity: AlertColor;
};

type AlertRef = {
  show: (message: string, severity: AlertColor) => void;
  hide: () => void;
};

const AlertComponent = forwardRef<AlertRef>((_, ref) => {
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: '',
    severity: 'success',
  });

  useImperativeHandle(ref, () => ({
    show: (message: string, severity: AlertColor = 'success') => {
      setAlert({ open: true, message, severity });
    },
    hide: () => {
      setAlert(prev => ({ ...prev, open: false }));
    },
  }));

  const handleClose = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        '& .MuiPaper-root': {
          minWidth: '300px',
        },
      }}
    >
      <Alert
        onClose={handleClose}
        severity={alert.severity}
        sx={{ width: '100%' }}
      >
        {alert.message}
      </Alert>
    </Snackbar>
  );
});

export { AlertComponent as Alert };
export type { AlertRef };
