import { ISfOptionDataSource, SfDropdown } from '@sfcm/framework';
import { useAuthentication, useMessageService, usePostDataRequest } from '@sfcm/shared';
import { Context } from 'components/trade-blotter/context';
import { useContext, useEffect, useState } from 'react';
import { getDataGridQueries } from './helper';

const DataSourceTemplate: ISfOptionDataSource = {
  valueField: 'queryName',
  nameField: 'queryName',
  data: [
    {
      queryKey: null,
      queryName: 'Active (Open & Term)',
      queryDescription: 'All open trades plus term trades in future.',
      disabled: false,
      queryComponents: [
        {
          queryLogicalOperator: 'and',
          queryAction: 'notEquals',
          fieldName: 'status',
          value: 'Cancelled',
          queryValueType: 'String',
        },
        {
          queryLogicalOperator: 'and',
          queryAction: 'notEquals',
          fieldName: 'status',
          value: 'Closed',
          queryValueType: 'String',
        },
      ],
    },
  ],
};

const Queries = (): JSX.Element => {
  const { setData } = useContext(Context);

  const { requestData } = usePostDataRequest();
  const { sendMessage } = useMessageService('Trade Blotter Queries Service');
  const { user, isAuthenticated } = useAuthentication();

  const [queries, setQueries] = useState<ISfOptionDataSource>(DataSourceTemplate);
  const [selectedQuery, setSelectedQuery] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated) {
      getDataGridQueries(requestData, user, sendMessage, 'tradeBlotter').then((result) => {
        setQueries((x) => ({ ...x, data: result }));
      });
    }
  }, [isAuthenticated]);

  const handleChange = (newValue: string | null, optionDataSource: ISfOptionDataSource): void => {
    setSelectedQuery(newValue ?? '');
    const selectedValue = optionDataSource.data.find((x) => x.queryName === newValue);

    if (selectedValue) {
      setData({
        SelectedBlotterQuery: {
          id: selectedValue.queryName,
          queryComponents: selectedValue.queryComponents,
        },
      });
    }
  };

  return (
    <SfDropdown
      id='drop-tb-queries'
      value={selectedQuery}
      optionDataSource={queries}
      onChange={handleChange}
      autoSelectFirstOption
    />
  );
};

export default Queries;
