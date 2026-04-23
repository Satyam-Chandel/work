export interface IActionModalConfig {
  id: string;
  title: string;
  menuName?: string;
  tooltip?: string;
  isMenuEnabled: (data: any[]) => boolean;
}

export interface IActionModalProps {
  selectedRows: any[];
  onClose: () => void;
  submitAction: (action: () => void) => void;
  onSubmitEnabled?: (isEnabled: boolean) => void;
  onActionComplete?: (uuid: string, actionType: string) => void;
  systemConfig?: any;
}

export interface IActionModule {
  Modal?: React.ComponentType<IActionModalProps>;
  Drawer?: React.ComponentType<IActionModalProps>;
  actionModalConfig?: IActionModalConfig;
}
