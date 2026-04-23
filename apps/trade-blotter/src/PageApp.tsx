import { WfPropsProvider } from '@broadridge/components';
import { WfProps } from '@broadridge/types/app';
import Main from './Main';

export default function PageApp(props: WfProps) {
  return (
    //@ts-ignore
    <WfPropsProvider value={props}>
      <Main />
    </WfPropsProvider>
  );
}
