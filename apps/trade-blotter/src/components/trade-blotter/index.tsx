import { createGlobalStyle, SfContextProvider, styled } from '@sfcm/framework';
import { SfServiceProvider } from '@sfcm/shared';
import MainLayout from './components/main-layout';
import { Context } from './context';
import { DefaultContextData } from './helper';
import { IContextData } from './types';

const GlobalStyle = createGlobalStyle`
html,
body {
  //height: 100vh;
  margin-top: 0;
  margin-bottom: 0;
}

.select__feedback {
  //position: absolute;
  top: 4rem;
}

.ag-filter-apply-panel-button {
  line-height: 0.5!important;
}
`;

const StyledContainer = styled.div`
  height: 99vh;
  padding-right: 0;
  padding-left: 0;
  //background: #f5f5f5;
`;

export const MODULE_ID = 'TRADE_BLOTTER';

const TradeBlotterModule = (): JSX.Element => {
  return (
    <StyledContainer className='container-fluid'>
      <GlobalStyle />
      <SfServiceProvider moduleId={MODULE_ID}>
        <SfContextProvider<IContextData> context={Context} defaultData={DefaultContextData}>
          <MainLayout />
        </SfContextProvider>
      </SfServiceProvider>
    </StyledContainer>
  );
};

export default TradeBlotterModule;
