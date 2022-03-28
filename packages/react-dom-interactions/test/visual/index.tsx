import {render} from 'react-dom';
import {FloatingDelayGroup} from '../../src/FloatingDelayGroup';
import {Dialog} from '../../src/recipes/Dialog';
import {Popover} from '../../src/recipes/NonModalPopover';
import {Option, OptionGroup, Select} from '../../src/recipes/Select';
import {Tooltip} from '../../src/recipes/TooltipGroup';
import {Tooltip as TooltipS} from '../../src/recipes/Tooltip';
import {ModalPopover} from '../../src/recipes/ModalPopover';
import {Menu, MenuItem} from '../../src/recipes/Menu';
import {FloatingTree} from '../../src/FloatingTree';
import {SafePolygon} from '../../src/recipes/SafePolygon';
import {ContextMenu} from '../../src/recipes/ContextMenu';
import {AutoComplete} from '../../src/recipes/AutoComplete';

const decades = ['1990s', '2000s', '2010s', '2020s'];

const data = [
  {
    name: 'Toy Story',
    icon: 'https://upload.wikimedia.org/wikipedia/en/1/13/Toy_Story.jpg',
    decade: '1990s',
  },
  {
    name: 'A Bugs Life',
    icon: 'https://upload.wikimedia.org/wikipedia/en/c/cc/A_Bug%27s_Life.jpg',
    decade: '1990s',
  },
  {
    name: 'Toy Story 2',
    icon: 'https://upload.wikimedia.org/wikipedia/en/c/c0/Toy_Story_2.jpg',
    decade: '1990s',
  },
  {
    name: 'Monsters, Inc.',
    icon: 'https://upload.wikimedia.org/wikipedia/en/6/63/Monsters_Inc.JPG',
    decade: '2000s',
  },
  {
    name: 'Finding Nemo',
    icon: 'https://upload.wikimedia.org/wikipedia/en/2/29/Finding_Nemo.jpg',
    decade: '2000s',
  },
  {
    name: 'The Incredibles',
    icon: 'https://upload.wikimedia.org/wikipedia/en/2/27/The_Incredibles_%282004_animated_feature_film%29.jpg',
    decade: '2000s',
  },
  {
    name: 'Cars',
    icon: 'https://upload.wikimedia.org/wikipedia/en/3/34/Cars_2006.jpg',
    decade: '2000s',
  },
  {
    name: 'Ratatouille',
    icon: 'https://upload.wikimedia.org/wikipedia/en/5/50/RatatouillePoster.jpg',
    decade: '2000s',
  },
  {
    name: 'WALL-E',
    icon: 'https://upload.wikimedia.org/wikipedia/en/c/c2/WALL-Eposter.jpg',
    decade: '2000s',
  },
  {
    name: 'Up',
    icon: 'https://upload.wikimedia.org/wikipedia/en/0/05/Up_%282009_film%29.jpg',
    decade: '2000s',
  },
  {
    name: 'Cars 2',
    icon: 'https://upload.wikimedia.org/wikipedia/en/7/7f/Cars_2_Poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Toy Story 3',
    icon: 'https://upload.wikimedia.org/wikipedia/en/6/69/Toy_Story_3_poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Brave',
    icon: 'https://upload.wikimedia.org/wikipedia/en/9/96/Brave_Poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Monsters University',
    icon: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Monsters_University_poster_3.jpg',
    decade: '2010s',
  },
  {
    name: 'Inside Out',
    icon: 'https://upload.wikimedia.org/wikipedia/en/0/0a/Inside_Out_%282015_film%29_poster.jpg',
    decade: '2010s',
  },
  {
    name: 'The Good Dinosaur',
    icon: 'https://upload.wikimedia.org/wikipedia/en/8/80/The_Good_Dinosaur_poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Finding Dory',
    icon: 'https://upload.wikimedia.org/wikipedia/en/3/3e/Finding_Dory.jpg',
    decade: '2010s',
  },
  {
    name: 'Cars 3',
    icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/94/Cars_3_poster.jpg/220px-Cars_3_poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Coco',
    icon: 'https://upload.wikimedia.org/wikipedia/en/9/98/Coco_%282017_film%29_poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Incredibles 2',
    icon: 'https://upload.wikimedia.org/wikipedia/en/1/1f/Incredibles_2_%282018_animated_film%29.jpg',
    decade: '2010s',
  },
  {
    name: 'Toy Story 4',
    icon: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Toy_Story_4_poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Onward',
    icon: 'https://upload.wikimedia.org/wikipedia/en/0/03/Onward_poster.jpg',
    decade: '2020s',
  },
  {
    name: 'Soul',
    icon: 'https://upload.wikimedia.org/wikipedia/en/3/39/Soul_%282020_film%29_poster.jpg',
    decade: '2020s',
  },
  {
    name: 'Luca',
    icon: 'https://upload.wikimedia.org/wikipedia/en/3/33/Luca_%282021_film%29.png',
    decade: '2020s',
  },
];

function App() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(250vh - 16px)',
      }}
    >
      <div>
        <AutoComplete />

        <ContextMenu>
          <MenuItem label="New tab" />
          <MenuItem label="New window" />
          <MenuItem label="Close tab" disabled />
        </ContextMenu>

        <h3>Safe Polygon Playground</h3>
        <SafePolygon
          placement="bottom"
          content={<div style={{}}>My tooltip wider than button</div>}
        >
          <button style={{}}>My button</button>
        </SafePolygon>

        <h3>Dropdown Menu</h3>
        <Menu label="File">
          <MenuItem label="New tab" />
          <MenuItem label="New window" />
          <MenuItem label="Close Tab" disabled />
          <Menu label="Share...">
            <MenuItem label="Mail" />
            <MenuItem label="Instagram" />
            <Menu label="Other...">
              <MenuItem label="Reddit" />
              <MenuItem label="LinkedIn" />
            </Menu>
          </Menu>
        </Menu>

        <h3 style={{marginBottom: 10}}>Your Favorite Pixar Film</h3>
        <Select
          value="Soul"
          render={(selectedIndex) => (
            <div>
              {data[selectedIndex] ? (
                <img className="OptionIcon" src={data[selectedIndex]?.icon} />
              ) : null}
              {data[selectedIndex]?.name ?? 'Select...'}{' '}
            </div>
          )}
          onChange={console.log}
        >
          {decades.map((decade) => (
            <OptionGroup key={decade} label={decade}>
              {data
                .filter((item) => item.decade === decade)
                .map(({name, icon}) => (
                  <Option key={name} value={name}>
                    <div>
                      {icon && <img className="OptionIcon" src={icon} />}{' '}
                      <span>{name}</span>
                    </div>
                  </Option>
                ))}
            </OptionGroup>
          ))}
        </Select>

        <h3>Tooltip</h3>
        <FloatingDelayGroup delay={{open: 1000, close: 200}}>
          <Tooltip label="Click to edit your name">
            <button>Hello</button>
          </Tooltip>
          <Tooltip label="Click to edit your date of birth">
            <button>Hello</button>
          </Tooltip>
        </FloatingDelayGroup>

        <h3>Tooltip (single)</h3>
        <TooltipS label="Hello there...">
          <button>Hello</button>
        </TooltipS>

        <h3>Popover (portal nesting)</h3>
        <FloatingTree>
          <ModalPopover
            render={({close}) => (
              <>
                <ModalPopover
                  render={({close}) => (
                    <>
                      <ModalPopover
                        render={({close}) => (
                          <>
                            <div>Hello</div>
                            <button onClick={close}>Close</button>
                          </>
                        )}
                      >
                        <button>Nested</button>
                      </ModalPopover>
                      <button onClick={close}>Close</button>
                    </>
                  )}
                >
                  <button>Nested</button>
                </ModalPopover>
                <button onClick={close}>Close</button>
              </>
            )}
          >
            <button>Hello</button>
          </ModalPopover>
        </FloatingTree>

        <h3>Popover (natural DOM nesting)</h3>
        <Popover
          render={({close}) => (
            <>
              <Popover
                render={({close}) => (
                  <>
                    <div>Hello</div>
                    <button onClick={close}>Close</button>
                  </>
                )}
              >
                <button>Nested</button>
              </Popover>
              <button onClick={close}>Close</button>
            </>
          )}
        >
          <button>Hello</button>
        </Popover>

        <h3>Dialog</h3>
        <Dialog
          render={({close, labelId, descriptionId}) => (
            <div>
              <h1 id={labelId}>This is a dialog!</h1>
              <p id={descriptionId}>
                Now that I've got your attention, you can close this.
              </p>
              <button onClick={close}>Close</button>
            </div>
          )}
        >
          <button>Open dialog</button>
        </Dialog>
      </div>
    </div>
  );
}

render(<App />, document.getElementById('root'));
