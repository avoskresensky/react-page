import { BottomToolbarProps } from '../../ui/BottomToolbar/types';
import { CellPluginMissingProps } from './plugins';
import { HTMLCellProps, HTMLRowProps } from '../../renderer/HTMLRenderer';
import { RowProps } from '../components/Row';
import { CellProps } from '../components/Cell';

/**
 * Internal component overrides for the editor.
 */
export type Components = {
  /**
   * BottomToolbar used for rendering plugin controls.
   */
  BottomToolbar?: React.ComponentType<BottomToolbarProps>;
  CellPluginMissing?: React.ComponentType<CellPluginMissingProps>;
  EditModeResizeHandle?: React.ComponentType<{ onClick: () => void }>;
  Cell?: React.ComponentType<CellProps>;
  Row?: React.ComponentType<RowProps>;
  HTMLCell?: React.ComponentType<HTMLCellProps>;
  HTMLRow?: React.ComponentType<HTMLRowProps>;
};
