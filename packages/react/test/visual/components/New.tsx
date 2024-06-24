import * as React from 'react';
import * as AlertDialog from '@base_ui/react/AlertDialog';
import {useTheme} from '@mui/system';

function EmployeeList() {
  const [employees, setEmployees] = React.useState([
    'Albert',
    'Colm',
    'James',
    'Marija',
    'Michał',
  ]);

  const handleFire = (person: string) => {
    setEmployees((emps) => emps.filter((e) => e !== person));
  };

  return (
    <div>
      <input type="text" />
      <div>
        {employees.map((e) => (
          <div className="person" key={e}>
            {e}
            <button className="trigger">Give bonus</button>
            <button className="trigger">Give raise</button>
            <FireButton person={e} onFire={() => handleFire(e)} />
          </div>
        ))}

        <Styles />
      </div>
      <input type="text" />
    </div>
  );
}

function FireButton(props: any) {
  const {person, onFire} = props;

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger className="trigger">Fire</AlertDialog.Trigger>
      <AlertDialog.Backdrop className="backdrop" />
      <AlertDialog.Popup className="popup">
        <AlertDialog.Title className="title">Fire {person}</AlertDialog.Title>
        <AlertDialog.Description>
          Are you sure you want to fire {person}?
        </AlertDialog.Description>
        <div className="controls">
          <AlertDialog.Close className="close">Nope</AlertDialog.Close>
          <AlertDialog.Close className="close" onClick={onFire}>
            Sure
          </AlertDialog.Close>
        </div>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}

function useIsDarkMode() {
  const theme = useTheme();
  return theme.palette.mode === 'dark';
}

const grey = {
  900: '#0f172a',
  800: '#1e293b',
  700: '#334155',
  500: '#64748b',
  300: '#cbd5e1',
  200: '#e2e8f0',
  100: '#f1f5f9',
  50: '#f8fafc',
};

function Styles() {
  // Replace this with your app logic for determining dark mode
  const isDarkMode = useIsDarkMode();

  return (
    <style>
      {`
				:focus {
					outline: 2px solid red;
				}

        .popup {
          background: ${isDarkMode ? grey[900] : grey[50]};
          border: 1px solid ${isDarkMode ? grey[700] : grey[100]};
          min-width: 400px;
          border-radius: 4px;
          box-shadow: rgba(0, 0, 0, 0.2) 0px 18px 50px -10px;
          position: fixed;
          top: 50%;
          left: 50%;
          font-family: IBM Plex Sans;
          transform: translate(-50%, -50%);
          padding: 16px;
          z-index: 2100;
        }

        .trigger {
          background-color: ${isDarkMode ? grey[50] : grey[900]};
          color: ${isDarkMode ? grey[900] : grey[50]};
          padding: 8px 16px;
          border-radius: 4px;
          border: none;
          font-family:
            IBM Plex Sans,
            sans-serif;

          &:hover {
            background-color: ${isDarkMode ? grey[200] : grey[700]};
					}
        }

        .close {
          background-color: transparent;
          border: 1px solid ${isDarkMode ? grey[300] : grey[500]};
          color: ${isDarkMode ? grey[50] : grey[900]};
          padding: 8px 16px;
          border-radius: 4px;
          font-family: IBM Plex Sans, sans-serif;
          min-width: 80px;

          &:hover {
            background-color: ${isDarkMode ? grey[700] : grey[200]};
          }
        }

        .controls {
          display: flex;
          background: ${isDarkMode ? grey[800] : grey[100]};
          gap: 8px;
          padding: 16px;
          margin: 32px -16px -16px;
        }

        .title {
          font-size: 1.25rem;
        }

        .backdrop {
          background: rgba(0, 0, 0, 0.35);
          position: fixed;
          inset: 0;
          backdrop-filter: blur(4px);
          z-index: 2000;
        }

        .textfield {
          padding: 8px;
          border-radius: 4px;
          border: 1px solid ${grey[300]};
          font-family: "IBM Plex Sans", sans-serif;
          margin: 16px 0;
          width: 100%;
          box-sizing: border-box;
        }
				
				.person {
					display: flex;
					gap: 20px;
					margin-bottom: 10p;
					padding: 10px 0;
					border-bottom: 1px solid black;

				}
    `}
    </style>
  );
}

export function New() {
  return <EmployeeList />;
}
