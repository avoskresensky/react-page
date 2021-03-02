import React from 'react';
import { getCellStyle } from '../../../utils/getCellStyle';
import {
  useCellHasPlugin,
  useFocusCell,
  useIsEditMode,
  useIsFocused,
  useIsPreviewMode,
  useNodeChildrenIds,
  usePluginOfCell,
  useSetEditMode,
  useCellSpacing,
} from '../../hooks';
import Row from '../../Row';
import Draggable from '../Draggable';
import Droppable from '../Droppable';
import PluginComponent from '../PluginComponent';

const Inner: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const isPreviewMode = useIsPreviewMode();
  const isEditMode = useIsEditMode();
  const cellShouldHavePlugin = useCellHasPlugin(nodeId);
  const plugin = usePluginOfCell(nodeId);
  const setEditMode = useSetEditMode();
  const focus = useFocusCell(nodeId);
  const focused = useIsFocused(nodeId);
  const childrenIds = useNodeChildrenIds(nodeId);
  const cellSpacing = useCellSpacing();
  const ref = React.useRef<HTMLDivElement>();

  const hasChildren = childrenIds.length > 0;

  const onClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;

      // check whether the click was inside cell-inner, but not inside a nested cell
      // also check whether it was not somehwere in a inner row (e.g. the resize handle)
      if (
        target?.closest &&
        target.closest('.react-page-cell-inner') === ref.current &&
        target.closest('.react-page-cell') ===
          ref.current.closest('.react-page-cell') &&
        target.closest('.react-page-row') ===
          ref.current.closest('.react-page-row') &&
        // also prevent click on insert new
        !target.classList.contains('react-page-cell-insert-new')
      ) {
        if (!focused && isEditMode) {
          focus(false, 'onClick');
          setEditMode();
        }
      }
      return true;
    },
    [focus, focused, isEditMode, setEditMode]
  );
  const insertAllowed = plugin?.childConstraints?.maxChildren
    ? plugin?.childConstraints?.maxChildren > childrenIds.length
    : true;

  const cellStyle = getCellStyle(plugin);
  const children = childrenIds.map((id) => <Row nodeId={id} key={id} />);
  if (!cellShouldHavePlugin) {
    return <Droppable nodeId={nodeId}>{children}</Droppable>;
  }
  return (
    <Droppable nodeId={nodeId} isLeaf={!hasChildren}>
      <Draggable nodeId={nodeId} isLeaf={!hasChildren}>
        <div
          onClick={!isPreviewMode ? onClick : undefined}
          tabIndex={-1}
          style={{
            outline: 'none',
            boxSizing: 'border-box',
            height: '100%',
            ...(cellStyle ?? {}),
          }}
          className={
            'react-page-cell-inner' +
            (hasChildren ? '' : ' react-page-cell-inner-leaf')
          }
          ref={ref}
        >
          <PluginComponent
            nodeId={nodeId}
            hasChildren={hasChildren}
            insertAllowed={insertAllowed}
          >
            {children}
          </PluginComponent>
        </div>
      </Draggable>
    </Droppable>
  );
};

export default React.memo(Inner);
