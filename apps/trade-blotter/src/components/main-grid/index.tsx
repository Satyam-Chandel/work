import { SfSplitterLayout } from '@sfcm/framework';
import { Context } from 'components/trade-blotter/context';
import { useContext } from 'react';
import Events from './components/events';
import Grid from './components/grid';

const MainGrid = (): JSX.Element => {
  const { data, setData } = useContext(Context);

  return (
    <SfSplitterLayout
      id='splitter-trade-blotter'
      vertical
      percentage
      secondaryInitialSize={40}
      secondaryHidden={data.ShowEvents === false}
      unmountHiddenPanes>
      <Grid />

      <Events />
    </SfSplitterLayout>
  );
};

export default MainGrid;
